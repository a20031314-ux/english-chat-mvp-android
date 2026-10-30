/**
 * 표현 퀴즈의 헷갈리는 오답(2026-10-30 사용자 "앱 데이터 랜덤 나열이라 헷갈리는 선지 기준이 없다" → 미리 만든 오답 + 자라는 문제은행):
 * 단계 핵심 표현마다 살짝 틀린 꼴 2~3개 — 다른 표현 대신 이걸 오답으로 쓴다(curriculum/quiz.ts nearMisses, e| 열쇠).
 *
 *   node --experimental-strip-types scripts/expr-decoys.ts brief <lang>          — 단계·표현·쓰인 줄(쓰는 사람 자료)
 *   node --experimental-strip-types scripts/expr-decoys.ts check <lang> <json>   — 규칙 검사
 *   node --experimental-strip-types scripts/expr-decoys.ts write <lang> <json>   — src/lib/curriculum/expressions/decoys/<lang>.ts
 *
 * JSON: { "<표현>": ["오답", ...] } — 그 언어 1~5단계 핵심 표현 전부.
 */
import fs from "node:fs";
import path from "node:path";
import { ladderFor } from "../src/lib/curriculum/stages/index.ts";
import { allScriptsFor } from "../src/lib/curriculum/stageScripts.ts";

const [, , cmd, lang, file] = process.argv;
if (!cmd || !lang) {
  console.error("usage: brief|check|write <lang> [json]");
  process.exit(2);
}
const ladder = ladderFor(lang);
const expressions = [...new Set((ladder?.stages ?? []).flatMap((stage) => stage.expressions))];
const lower = (text: string) => text.toLocaleLowerCase();
const linesWith = (expression: string) =>
  allScriptsFor(lang)
    .flatMap((script) => script.lines.map((line) => line.text))
    .filter((text) => lower(text).includes(lower(expression)));

if (cmd === "brief") {
  for (const stage of ladder?.stages ?? []) {
    console.log(`\n=== 단계 ${stage.order} ===`);
    for (const expression of stage.expressions) {
      const lines = linesWith(expression).slice(0, 2);
      console.log(`  ${expression}${lines.length ? `   — 예: ${lines.join(" / ")}` : ""}`);
    }
  }
  process.exit(0);
}

const data = JSON.parse(fs.readFileSync(file!, "utf8")) as Record<string, string[]>;
const errors: string[] = [];
for (const expression of expressions) if (!data[expression]) errors.push(`"${expression}": 없음`);
for (const [expression, list] of Object.entries(data)) {
  if (!expressions.includes(expression)) {
    errors.push(`"${expression}": 핵심 표현 목록에 없음`);
    continue;
  }
  if (!Array.isArray(list) || list.length < 2 || list.length > 4) errors.push(`"${expression}": 오답 2~4개`);
  const seen = new Set<string>();
  const lines = linesWith(expression);
  for (const one of list ?? []) {
    if (!one?.trim()) errors.push(`"${expression}": 빈 오답`);
    if (seen.has(lower(one))) errors.push(`"${expression}": 겹침 "${one}"`);
    seen.add(lower(one));
    if (lower(one) === lower(expression)) errors.push(`"${expression}": 정답과 같음`);
    if (lower(expression).includes(lower(one)) || lower(one).includes(lower(expression))) errors.push(`"${expression}": 정답을 품거나 정답에 들어감 "${one}"`);
    for (const line of lines) if (lower(line).includes(lower(one))) errors.push(`"${expression}": 줄 "${line}"에 그대로 있음 "${one}"`);
    if (/\p{Nd}/u.test(one)) errors.push(`"${expression}": 숫자 "${one}"`);
  }
}
if (errors.length) {
  console.log(errors.slice(0, 80).join("\n"));
  console.log(`\n${errors.length}개 문제`);
  process.exit(1);
}
console.log(`ok — 표현 ${expressions.length}개`);

if (cmd === "write") {
  const NAME = `${lang.toUpperCase()}_EXPR_DECOYS`;
  const out = path.resolve(`src/lib/curriculum/expressions/decoys/${lang}.ts`);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  const ordered = Object.fromEntries(expressions.map((key) => [key, data[key]!]));
  fs.writeFileSync(out, `/**\n * ${lang} 단계 핵심 표현마다 헷갈리는 오답(2026-10-30, scripts/expr-decoys.ts) — 표현 → 살짝 틀린 꼴. Claude가 씀, 원어민 확인 전.\n */\nexport const ${NAME}: Record<string, string[]> = ${JSON.stringify(ordered, null, 2)};\n`);
  console.log(`→ ${path.relative(process.cwd(), out)}`);
}
