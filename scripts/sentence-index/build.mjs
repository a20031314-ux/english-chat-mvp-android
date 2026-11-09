// 문장 색인 2단계: 받아 둔 카드 예문(fetch.mjs) → 문법 칸·표현마다 그 소재가 든 예문.
//   node --experimental-strip-types scripts/sentence-index/build.mjs es
// 결과: tmp/sentence-index/<언어>.index.json { key: [카드 낱말…] } + 표준 출력에 칸마다 수·예.
// 사용자 2026-11-09 "7000개 이상의 모든 예문을 소재로 — 왜 한정되어 나오는지" → "일단 만들어줘"(스페인어 먼저, 앱에는 아직 안 붙임).
import fs from "node:fs";
import path from "node:path";

const lang = process.argv[2] ?? "es";
const root = process.cwd();
const dir = path.join(root, "tmp/sentence-index");
const cards = JSON.parse(fs.readFileSync(path.join(dir, `${lang}.cards.json`), "utf8"));
const rules = await import(path.join(root, `scripts/sentence-index/${lang}-rules.mjs`));
const { WORDS } = await import(path.join(root, `src/lib/curriculum/vocab/${lang}.ts`));
const { ladderFor } = await import(path.join(root, "src/lib/curriculum/stages/index.ts"));
const traits = JSON.parse(fs.readFileSync(path.join(root, `src/lib/curriculum/word-traits/${lang}.json`), "utf8"));

const verbs = WORDS.filter((one) => one[1] === "verb").map((one) => one[0]);
const forms = rules.makeForms(verbs);
const nouns = Object.fromEntries(Object.entries(traits).filter(([, t]) => t.g === "m" || t.g === "f").map(([w, t]) => [w, t.g]));
const ladder = ladderFor(lang);
const slots = ladder.stages.flatMap((stage) => (stage.grammar ?? []).map((g, i) => ({ key: `g|${stage.order}:${i}`, name: g.name?.ko ?? g.name?.en ?? "" })));
const expressions = ladder.stages.flatMap((stage) => stage.expressions.map((text) => ({ text, stage: stage.order })));

const seen = new Set();
const index = {};
let used = 0;
for (const card of cards) {
  if (seen.has(card.example)) continue;
  seen.add(card.example);
  const keys = [...rules.grammarKeys(card.example, forms, nouns), ...rules.expressionKeys(card.example, expressions.map((one) => one.text))];
  if (keys.length) used++;
  for (const key of keys) (index[key] ??= []).push(card.w);
}
fs.writeFileSync(path.join(dir, `${lang}.index.json`), JSON.stringify(index));
const exampleOf = (w) => cards.find((one) => one.w === w)?.example ?? "";
console.log(`${lang}: 예문 ${seen.size}개 중 소재가 하나라도 잡힌 문장 ${used}개`);
console.log("\n문법 칸 — 지금(넣어 둔 문제 1) → 색인으로 잡힌 예문 수");
for (const slot of slots) {
  const list = index[slot.key] ?? [];
  console.log(`${slot.key.padEnd(7)} ${String(list.length).padStart(5)}  ${slot.name}`);
  for (const w of list.slice(0, 2)) console.log(`            · ${exampleOf(w)}`);
}
console.log("\n표현 — 단계마다 잡힌 예문 수(표현 수 · 예문 0개인 표현 수 · 합)");
for (const stage of ladder.stages) {
  const list = stage.expressions.map((text) => (index[`e|${text}`] ?? []).length);
  console.log(`${stage.order}단계  표현 ${list.length} · 0개 ${list.filter((n) => n === 0).length} · 합 ${list.reduce((a, b) => a + b, 0)} · 많은 것 ${stage.expressions.map((text, i) => [text, list[i]]).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([text, n]) => `${text} ${n}`).join(", ")}`);
}
