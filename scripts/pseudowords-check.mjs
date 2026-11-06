#!/usr/bin/env node
// 가짜 낱말 검사(첫 측정 예/아니오 — hub/drafts/placement-2026-11-06.md 7절).
// src/lib/curriculum/pseudowords/<언어>.json { "words": [...] } 를 빈도 목록·사전 예문과 겹치는지, 글자 체계·개수·중복·길이·한 글자 바꿈 비율로 본다.
//   node scripts/pseudowords-check.mjs            (있는 파일 전부)
//   node scripts/pseudowords-check.mjs ja ko      (그 언어만)
// 오류가 있으면 종료 코드 1. 찾아서 더한 낱말(서버 목록)은 여기서 못 보니 합치기 전 운영 API로 따로 본다.
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIR = join(ROOT, "src", "lib", "curriculum", "pseudowords");
const WANT = 200;
// 언어마다 글자 체계(이 범위 밖 글자가 있으면 오류). 라틴은 그 언어 악센트 포함.
const SCRIPT = {
  en: /^[a-z]+$/u,
  es: /^[a-záéíóúüñ]+$/u,
  fr: /^[a-zàâæçéèêëîïôœùûüÿ'-]+$/u,
  it: /^[a-zàèéìíîòóùú]+$/u,
  pt: /^[a-záâãàçéêíóôõú]+$/u,
  id: /^[a-z]+$/u,
  vi: /^[a-zàáảãạăằắẳẵặâầấẩẫậđèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵ ]+$/u,
  ru: /^[а-яё]+$/u,
  ar: /^[ء-ي]+$/u,
  hi: /^[ऀ-ॿ]+$/u,
  th: /^[฀-๿]+$/u,
  ko: /^[가-힣]+$/u,
  ja: /^[぀-ヿ一-鿿々ー]+$/u,
  zh: /^[一-鿿]+$/u,
};

function lev1(a, b) {
  // 한 글자 바꿈·넣음·뺌인지(거리 정확히 1).
  const x = [...a], y = [...b];
  if (Math.abs(x.length - y.length) > 1 || a === b) return false;
  let i = 0, j = 0, diff = 0;
  while (i < x.length && j < y.length) {
    if (x[i] === y[j]) { i += 1; j += 1; continue; }
    diff += 1;
    if (diff > 1) return false;
    if (x.length > y.length) i += 1;
    else if (y.length > x.length) j += 1;
    else { i += 1; j += 1; }
  }
  return diff + (x.length - i) + (y.length - j) === 1;
}

const median = (list) => { const s = [...list].sort((a, b) => a - b); return s.length ? s[Math.floor(s.length / 2)] : 0; };

async function check(lang) {
  const errs = [];
  const warns = [];
  const file = join(DIR, `${lang}.json`);
  const words = JSON.parse(readFileSync(file, "utf8")).words;
  if (!Array.isArray(words)) return { errs: ["words 배열 없음"], warns };
  const { WORDS } = await import(pathToFileURL(join(ROOT, "src", "lib", "curriculum", "vocab", `${lang}.ts`)).href);
  const real = new Set(WORDS.map((row) => String(row[0]).toLocaleLowerCase()));
  const sentencesFile = join(ROOT, "src", "lib", "curriculum", "word-sentences", `${lang}.json`);
  if (existsSync(sentencesFile)) for (const key of Object.keys(JSON.parse(readFileSync(sentencesFile, "utf8")))) real.add(key.slice(2).toLocaleLowerCase());
  const seen = new Set();
  let near = 0;
  const shortList = WORDS.slice(0, 5000).map((row) => String(row[0]).toLocaleLowerCase());
  for (const raw of words) {
    const word = typeof raw === "string" ? raw.trim().toLocaleLowerCase() : "";
    if (!word) { errs.push(`빈 값: ${JSON.stringify(raw)}`); continue; }
    if (seen.has(word)) errs.push(`중복: ${word}`);
    seen.add(word);
    if (real.has(word)) errs.push(`진짜 낱말과 겹침: ${word}`);
    if (SCRIPT[lang] && !SCRIPT[lang].test(word)) errs.push(`글자 체계 밖: ${word}`);
    if (shortList.some((one) => lev1(word, one))) near += 1;
  }
  if (words.length !== WANT) errs.push(`개수 ${words.length} (≠ ${WANT})`);
  if (near > words.length / 2) errs.push(`한 글자 바꿈이 절반 넘음: ${near}/${words.length}`);
  const fake = median(words.map((w) => [...String(w)].length));
  const base = median(WORDS.slice(0, 5000).map((row) => [...String(row[0])].length));
  if (base && (fake < base * 0.6 || fake > base * 1.4)) warns.push(`길이 중앙값 ${fake} (빈도 목록 ${base})`);
  return { errs, warns, near };
}

const files = existsSync(DIR) ? readdirSync(DIR).filter((name) => name.endsWith(".json")).map((name) => name.replace(".json", "")) : [];
const langs = process.argv.slice(2).length ? process.argv.slice(2) : files;
if (!langs.length) {
  console.log(`가짜 낱말 파일 없음 — ${DIR}/<언어>.json 을 먼저 만든다(설계 hub/drafts/placement-2026-11-06.md 7절).`);
  process.exit(0);
}
let bad = 0;
for (const lang of langs) {
  if (!files.includes(lang)) { console.log(lang, "파일 없음"); bad += 1; continue; }
  const { errs, warns, near } = await check(lang);
  bad += errs.length;
  console.log(`${lang}: 오류 ${errs.length}${warns.length ? ` · 주의 ${warns.join(", ")}` : ""}${near !== undefined ? ` · 한 글자 바꿈 ${near}` : ""}`);
  for (const one of errs.slice(0, 15)) console.log("  -", one);
}
process.exit(bad ? 1 : 0);
