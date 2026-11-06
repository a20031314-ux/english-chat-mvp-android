#!/usr/bin/env node
// 문제은행이 만든 낱말 예문을 사전 예문 파일에 올린다(2026-11-06 사용자 "예문 없는 단어는 퀴즈 풀 때마다 예문 생성 → 사전에 추가", "자동 + 주기적 확인").
//
// 흐름: 퀴즈가 사전 예문 없는 낱말을 내면 문제은행(server/qbank.ts)이 예문을 만들고, 풀이 결과로 셈한다.
//   단어 사전(📕)에서 예문 없는 낱말을 열어도 같은 문제은행이 예문을 만든다(studyMap/Dictionary).
//   20번 넘게 풀렸고 정답률이 15~95%인 예문(qbankRules.promotable) + 아직 덜 풀린 예문(n < 20, reviewable)이 후보 — n·rate 칸을 보고 정한다.
//   1) pull  — 운영 서버에서 후보를 받아 검토 표(tmp/promote/<언어>.tsv)로 쓴다. 운영자 키는 환경 변수 OPS_KEY.
//   2) 검토  — Cursor 구독 에이전트나 Claude가 표를 읽고 ok 칸에 y/n, ko 칸에 한국어 뜻을 쓴다(RULES "생성은 Cursor 먼저").
//              버릴 것: 어색한 문장·뜻이 다른 낱말·특정인·민감한 내용·합성어 속 낱말(빈칸이 다른 낱말의 일부).
//   3) apply — ok=y이고 ko가 있는 줄만 word-sentences/<언어>.json에 넣는다(예문이 둘 안 되는 낱말만, src "qbank").
//              넣고 나면 그 낱말은 사전 예문이 둘이 되어 문제은행이 더 키우지 않는다.
//
//   OPS_KEY=… node scripts/dict-promote.mjs pull ko [es …]    (언어를 안 주면 14개 전부)
//   node scripts/dict-promote.mjs apply ko
//   API_BASE로 서버 주소를 바꿀 수 있다(기본 https://www.languagebank.net).
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "tmp", "promote");
const LANGS = ["ar", "en", "es", "fr", "hi", "id", "it", "ja", "ko", "pt", "ru", "th", "vi", "zh"];
const BASE = (process.env.API_BASE || "https://www.languagebank.net").replace(/\/$/, "");
const cell = (text) => String(text ?? "").replace(/[\t\r\n]+/g, " ").trim();

async function pull(langs) {
  const key = process.env.OPS_KEY?.trim();
  if (!key) throw new Error("OPS_KEY 환경 변수가 필요합니다(운영자 키 — 저장소에 두지 않음).");
  mkdirSync(OUT, { recursive: true });
  for (const lang of langs) {
    const response = await fetch(`${BASE}/api/curriculum/qbank?promoted=${lang}&all=1`, { headers: { "x-ops-key": key } });
    if (!response.ok) {
      console.log(lang, "실패", response.status);
      continue;
    }
    const { lines = [] } = await response.json();
    const rows = ["w\ttext\tpiece\ten\tn\trate\tok\tko", ...lines.map((one) => [one.w, one.text, one.piece, one.en, one.n, one.n ? Math.round((one.r / one.n) * 100) + "%" : "-", "", ""].map(cell).join("\t"))];
    writeFileSync(join(OUT, `${lang}.tsv`), rows.join("\n") + "\n");
    console.log(lang, "후보", lines.length, "→", join("tmp", "promote", `${lang}.tsv`));
  }
}

function apply(lang) {
  const file = join(OUT, `${lang}.tsv`);
  if (!existsSync(file)) throw new Error(`${file} 없음 — 먼저 pull`);
  const bookFile = join(ROOT, "src", "lib", "curriculum", "word-sentences", `${lang}.json`);
  const book = JSON.parse(readFileSync(bookFile, "utf8"));
  const taken = new Set(Object.values(book).flat().map((one) => one.text));
  const [head, ...rows] = readFileSync(file, "utf8").split("\n").filter(Boolean);
  const at = Object.fromEntries(head.split("\t").map((name, index) => [name, index]));
  let added = 0;
  const errs = [];
  for (const row of rows) {
    const cols = row.split("\t");
    const get = (name) => (cols[at[name]] ?? "").trim();
    if (!/^y/i.test(get("ok"))) continue;
    const [w, text, piece, en, ko] = ["w", "text", "piece", "en", "ko"].map(get);
    const list = (book[`w|${w}`] ??= []);
    if (list.length >= 2) continue;
    if (!ko || !/[가-힣]/.test(ko)) errs.push(`${w}: 한국어 뜻 없음`);
    else if (!text.includes(piece) || /\d/.test(text)) errs.push(`${w}: 빈칸·숫자 — ${text}`);
    else if (taken.has(text)) errs.push(`${w}: 중복 — ${text}`);
    else {
      list.push({ text, en, ko, blank: piece, src: "qbank" });
      taken.add(text);
      added += 1;
    }
  }
  writeFileSync(bookFile, JSON.stringify(book, null, 1) + "\n");
  console.log({ lang, added, errs });
}

const [command, ...rest] = process.argv.slice(2);
if (command === "pull") await pull(rest.length ? rest : LANGS);
else if (command === "apply" && rest[0]) apply(rest[0]);
else console.log("사용: OPS_KEY=… node scripts/dict-promote.mjs pull [언어…] · node scripts/dict-promote.mjs apply <언어>");
