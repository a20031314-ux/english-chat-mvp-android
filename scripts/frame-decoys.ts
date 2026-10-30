/**
 * 문장구조 퀴즈의 헷갈리는 오답(2026-10-30 사용자 "다른 선지가 누가 봐도 오답" → "헷갈리는 오답"):
 * 틀 조각(core)마다 살짝 틀린 꼴 2~3개 — 다른 틀 조각 대신 이걸 오답으로 쓴다(curriculum/quiz.ts chooseOf).
 *
 *   node --experimental-strip-types scripts/frame-decoys.ts brief <lang>          — 틀·조각·예문(쓰는 사람 자료)
 *   node --experimental-strip-types scripts/frame-decoys.ts check <lang> <json>   — 규칙 검사
 *   node --experimental-strip-types scripts/frame-decoys.ts write <lang> <json>   — src/lib/curriculum/frames/decoys/<lang>.ts
 *
 * JSON: { "<frame id>|<core>": ["오답", "오답", ...] } — 모든 틀의 모든 조각.
 */
import fs from "node:fs";
import path from "node:path";
import { allFramesFor } from "../src/lib/curriculum/frames.ts";

const [, , cmd, lang, file] = process.argv;
if (!cmd || !lang) {
  console.error("usage: brief|check|write <lang> [json]");
  process.exit(2);
}
const frames = allFramesFor(lang);

if (cmd === "brief") {
  for (const frame of frames) {
    console.log(`\n${frame.id} (단계 ${frame.stage}) · ${frame.pattern} · ${frame.meaning.en}`);
    for (const core of frame.core) console.log(`  조각: ${frame.id}|${core}`);
    for (const example of frame.examples) console.log(`  예: ${example.text}`);
  }
  process.exit(0);
}

const data = JSON.parse(fs.readFileSync(file!, "utf8")) as Record<string, string[]>;
const errors: string[] = [];
const lower = (text: string) => text.toLocaleLowerCase();
const wanted = new Set(frames.flatMap((frame) => frame.core.filter(Boolean).map((core) => `${frame.id}|${core}`)));
for (const key of wanted) if (!data[key]) errors.push(`${key}: 없음`);
for (const [key, list] of Object.entries(data)) {
  if (!wanted.has(key)) {
    errors.push(`${key}: 없는 틀·조각`);
    continue;
  }
  const core = key.slice(key.indexOf("|") + 1);
  const frame = frames.find((one) => one.id === key.split("|")[0])!;
  if (!Array.isArray(list) || list.length < 2 || list.length > 4) errors.push(`${key}: 오답 2~4개`);
  const seen = new Set<string>();
  for (const one of list ?? []) {
    if (!one?.trim()) errors.push(`${key}: 빈 오답`);
    if (lower(one) === lower(core)) errors.push(`${key}: 정답과 같음 "${one}"`);
    if (seen.has(lower(one))) errors.push(`${key}: 겹침 "${one}"`);
    seen.add(lower(one));
    // 퀴즈는 문장·조각에 그대로 든 오답을 버린다 — 그런 오답은 쓸모없다.
    if (lower(core).includes(lower(one)) || lower(one).includes(lower(core))) errors.push(`${key}: 정답을 품거나 정답에 들어감 "${one}"`);
    for (const example of frame.examples) if (lower(example.text).includes(lower(one))) errors.push(`${key}: 예문 "${example.text}"에 그대로 있음 "${one}"`);
    if (/\p{Nd}/u.test(one)) errors.push(`${key}: 숫자 "${one}"`);
  }
}
if (errors.length) {
  console.log(errors.slice(0, 80).join("\n"));
  console.log(`\n${errors.length}개 문제`);
  process.exit(1);
}
console.log(`ok — 조각 ${wanted.size}개`);

if (cmd === "write") {
  const NAME = `${lang.toUpperCase()}_DECOYS`;
  const out = path.resolve(`src/lib/curriculum/frames/decoys/${lang}.ts`);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  const ordered = Object.fromEntries([...wanted].map((key) => [key, data[key]!]));
  fs.writeFileSync(
    out,
    `/**\n * ${lang} 문장구조 조각마다 헷갈리는 오답(2026-10-30, scripts/frame-decoys.ts) — "틀 id|조각" → 살짝 틀린 꼴. Claude가 씀, 원어민 확인 전.\n */\nexport const ${NAME}: Record<string, string[]> = ${JSON.stringify(ordered, null, 2)};\n`,
  );
  console.log(`→ ${path.relative(process.cwd(), out)}`);
}
