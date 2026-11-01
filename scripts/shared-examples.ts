/**
 * 여러 소재가 같이 쓰는 예문(2026-11-01 사용자 "예문 문제가 생기는 문장을 파악해서 … 요소가 3개라면 추가 문장은 2개") — 문장구조(f|)·표현(e|)만.
 * 한 문장을 소재 N개가 재료로 쓰면 하나(재료가 가장 적은 소재)만 그 문장을 쓰고, 나머지 N−1개는 새 예문으로 바꾼다.
 *   plan  → tmp/shared-examples/<언어>.json(새로 쓸 목록 — 소재마다 바꿀 원래 문장들)
 *   check → src/lib/curriculum/examples/<언어>.json 검사(조각이 한 번·따로 선 자리·원래 문장과 다름·겹침 없음·목록 빠짐)
 * Run: node --experimental-strip-types scripts/shared-examples.ts plan|check [언어…]
 */
import fs from "node:fs";
import path from "node:path";
import { quizSources, pieceAt, pieceTwice, pieceOf } from "../src/lib/curriculum/quiz.ts";
import { allFramesFor } from "../src/lib/curriculum/frames.ts";
import { ladderFor } from "../src/lib/curriculum/stages/index.ts";
import { SHARED_EXAMPLES_OFF } from "../src/lib/curriculum/examples/index.ts";

const LANGS = ["en", "ko", "ja", "zh", "es", "fr", "it", "pt", "ru", "ar", "id", "vi", "th", "hi"];
const [mode = "plan", ...only] = process.argv.slice(2);
const langs = only.length ? only : LANGS;

type Task = { key: string; kind: "frame" | "expression"; stage: number; piece: string; pattern?: string; meaning?: string; replaces: { text: string; en: string }[] };

function keysOf(language: string): Map<string, { stage: number; kind: Task["kind"]; pattern?: string; meaning?: string; piece?: string }> {
  const out = new Map<string, { stage: number; kind: Task["kind"]; pattern?: string; meaning?: string }>();
  for (const frame of allFramesFor(language)) out.set(`f|${frame.id}`, { stage: frame.stage, kind: "frame", pattern: frame.pattern, meaning: frame.meaning.en });
  for (const stage of ladderFor(language)?.stages ?? []) for (const expression of stage.expressions) if (!out.has(`e|${expression}`)) out.set(`e|${expression}`, { stage: stage.order, kind: "expression" });
  return out;
}

/** 소재마다 바꿀 원래 문장(공유 문장마다 재료가 가장 적은 소재 하나만 남김). 새 예문을 넣기 전 상태로 센다. */
export function sharedPlan(language: string): Map<string, { text: string; en: string; piece: string }[]> {
  SHARED_EXAMPLES_OFF.add(language);
  const keys = keysOf(language);
  const by = new Map<string, { key: string; piece: string; en: string }[]>();
  const count = new Map<string, number>();
  for (const key of keys.keys()) {
    const list = quizSources(language, key).filter((s) => s.piece && s.who !== "them" && s.from !== "qbank");
    count.set(key, list.length);
    for (const s of list) (by.get(s.text) ?? by.set(s.text, []).get(s.text)!).push({ key, piece: s.piece!, en: s.gloss.en });
  }
  SHARED_EXAMPLES_OFF.delete(language);
  const out = new Map<string, { text: string; en: string; piece: string }[]>();
  for (const [text, users] of by) {
    if (users.length < 2) continue;
    const keep = [...users].sort((a, b) => count.get(a.key)! - count.get(b.key)! || a.key.localeCompare(b.key))[0]!;
    for (const one of users) if (one !== keep) (out.get(one.key) ?? out.set(one.key, []).get(one.key)!).push({ text, en: one.en, piece: one.piece });
  }
  return out;
}

if (mode === "plan") {
  const dir = path.join(process.cwd(), "tmp/shared-examples");
  fs.mkdirSync(dir, { recursive: true });
  let total = 0;
  for (const language of langs) {
    const keys = keysOf(language);
    const tasks: Task[] = [...sharedPlan(language)].map(([key, list]) => {
      const meta = keys.get(key)!;
      return { key, kind: meta.kind, stage: meta.stage, piece: list[0]!.piece, ...(meta.pattern ? { pattern: meta.pattern } : {}), ...(meta.meaning ? { meaning: meta.meaning } : {}), replaces: list.map(({ text, en }) => ({ text, en })) };
    });
    const n = tasks.reduce((sum, task) => sum + task.replaces.length, 0);
    total += n;
    fs.writeFileSync(path.join(dir, `${language}.json`), JSON.stringify(tasks, null, 1));
    console.log(`${language}: 소재 ${tasks.length} · 새 예문 ${n}`);
  }
  console.log(`합 ${total} → tmp/shared-examples/`);
}

if (mode === "check") {
  let bad = 0;
  for (const language of langs) {
    const file = path.join(process.cwd(), `src/lib/curriculum/examples/${language}.json`);
    if (!fs.existsSync(file)) {
      console.log(`${language}: 파일 없음`);
      continue;
    }
    const data = JSON.parse(fs.readFileSync(file, "utf8")) as Record<string, { text: string; en: string; ko: string; replaces: string }[]>;
    const plan = sharedPlan(language);
    SHARED_EXAMPLES_OFF.add(language);
    const existing = new Set<string>();
    for (const key of keysOf(language).keys()) for (const s of quizSources(language, key)) existing.add(s.text);
    SHARED_EXAMPLES_OFF.delete(language);
    const seen = new Set<string>();
    const problems: string[] = [];
    for (const [key, wants] of plan) {
      const got = data[key] ?? [];
      for (const want of wants) if (!got.some((one) => one.replaces === want.text)) problems.push(`빠짐 ${key} ← ${want.text}`);
      for (const one of got) {
        const piece = wants[0]!.piece;
        const kind = key.startsWith("f|") ? allFramesFor(language).find((f) => `f|${f.id}` === key)?.core.find((core) => core && one.text.includes(core)) : pieceOf(one.text, key.slice(2)) || undefined;
        if (!one.text || !one.en || !one.ko || !one.replaces) problems.push(`칸 빔 ${key} ${one.text}`);
        else if (!kind || pieceAt(one.text, kind, language) < 0 || pieceTwice(one.text, kind, language)) problems.push(`조각 "${kind ?? piece}" 자리 ${key}: ${one.text}`);
        if (existing.has(one.text)) problems.push(`원래 있는 문장 ${key}: ${one.text}`);
        if (seen.has(one.text)) problems.push(`겹침 ${key}: ${one.text}`);
        if (/\d/.test(one.text)) problems.push(`숫자 ${key}: ${one.text}`);
        seen.add(one.text);
      }
    }
    for (const key of Object.keys(data)) if (!plan.has(key)) problems.push(`목록 밖 열쇠 ${key}`);
    bad += problems.length;
    console.log(`${language}: 문제 ${problems.length}${problems.length ? "\n  " + problems.slice(0, 30).join("\n  ") : ""}`);
  }
  if (bad) process.exitCode = 1;
}
