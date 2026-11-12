#!/usr/bin/env node
/**
 * 넣어 둔 문법·표현 고르기(src/lib/curriculum/problems/*.json) 중 "해석 없이는 다른 보기도 맞는 문장"을 고른다
 * (사용자 2026-11-12 "1+2로" — 3단계부터는 이 문장만 해석을 먼저, preparedQuiz.ts meaningFirst).
 *
 *   node scripts/needs-meaning.mjs --dump    → tmp/needs/items.jsonl · tmp/needs/blank.tsv (빈칸 문장만, 에이전트에게 줄 것)
 *   (에이전트 둘이 따로: tmp/needs/a.json · tmp/needs/b.json — {"true": [id…]}. 쓰기·판정 세션을 나눈다)
 *   node scripts/needs-meaning.mjs --merge   → 둘 중 하나라도 true(망설이면 해석을 보이는 쪽) + 문장 전체 고르기(해석이 곧 문제) → problems/needs-meaning.json
 */
import { mkdirSync, readFileSync, readdirSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const PROBLEMS = join(ROOT, "src/lib/curriculum/problems");
const TMP = join(ROOT, "tmp/needs");
const OUT = join(PROBLEMS, "needs-meaning.json");

function items() {
  const rows = [];
  for (const file of readdirSync(PROBLEMS).filter((name) => name.endsWith(".json") && name !== "needs-meaning.json").sort()) {
    const language = file.split("-")[0].replace(".json", "");
    const book = JSON.parse(readFileSync(join(PROBLEMS, file), "utf8"));
    for (const [key, value] of Object.entries(book)) {
      for (const one of Array.isArray(value) ? value : [value]) {
        if (!one || typeof one !== "object" || !one.line) continue;
        const whole = !("before" in one);
        rows.push({ id: rows.length, lang: language, key, sentence: whole ? "(whole sentence)" : `${one.before ?? ""}___${one.after ?? ""}`, answer: one.answer, options: one.options ?? [], line: one.line });
      }
    }
  }
  return rows;
}

const mode = process.argv[2];
if (mode === "--dump") {
  mkdirSync(TMP, { recursive: true });
  const rows = items();
  writeFileSync(join(TMP, "items.jsonl"), rows.map((row) => JSON.stringify(row)).join("\n") + "\n");
  writeFileSync(join(TMP, "blank.tsv"), rows.filter((row) => row.sentence !== "(whole sentence)").map((row) => [row.id, row.lang, row.sentence, row.options.join(" | "), row.answer].join("\t")).join("\n") + "\n");
  console.log(`문장 ${rows.length}개 (빈칸 ${rows.filter((row) => row.sentence !== "(whole sentence)").length}) → tmp/needs/`);
} else if (mode === "--merge") {
  const rows = JSON.parse(`[${readFileSync(join(TMP, "items.jsonl"), "utf8").trim().split("\n").join(",")}]`);
  const flagged = new Set();
  for (const name of ["a.json", "b.json"]) {
    const path = join(TMP, name);
    if (!existsSync(path)) throw new Error(`${name} 없음 — 에이전트 둘의 결과가 다 있어야 합친다`);
    for (const id of JSON.parse(readFileSync(path, "utf8")).true ?? []) flagged.add(Number(id));
  }
  const out = {};
  for (const row of rows) {
    if (!row.sentence.startsWith("(") && !flagged.has(row.id)) continue;
    const list = (out[row.lang] ??= []);
    if (!list.includes(row.line)) list.push(row.line);
  }
  writeFileSync(OUT, JSON.stringify(out, null, 1) + "\n");
  const total = Object.values(out).reduce((sum, list) => sum + list.length, 0);
  console.log(`해석 먼저 ${total} / ${rows.length} → ${OUT}`);
} else {
  console.log("사용: --dump | --merge");
}
