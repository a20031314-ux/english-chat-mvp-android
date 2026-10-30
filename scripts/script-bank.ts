/**
 * 대본 은행 만들기 도구(2026-10-30 사용자 "스크립트부터 다 만들어줘").
 *
 *   node --experimental-strip-types scripts/script-bank.ts brief <lang>          — 쓰는 사람에게 줄 자료(단계 1~3 틀·표현·문법)
 *   node --experimental-strip-types scripts/script-bank.ts check <lang> <json>   — 규칙 검사(통과하면 "ok")
 *   node --experimental-strip-types scripts/script-bank.ts write <lang> <json>   — 검사 뒤 src/lib/curriculum/stageScripts/bank/<lang>.ts로
 *
 * JSON은 StageScript 배열(bank: true). 규칙은 scriptBank.test.ts와 같다.
 */
import fs from "node:fs";
import path from "node:path";
import { allFramesFor } from "../src/lib/curriculum/frames.ts";
import { ladderFor } from "../src/lib/curriculum/stages/index.ts";
import { frameUsed } from "../src/lib/curriculum/scriptBank.ts";
import type { StageScript } from "../src/lib/curriculum/stageScripts.ts";

const [, , cmd, lang, file] = process.argv;
if (!cmd || !lang) {
  console.error("usage: brief|check|write <lang> [json]");
  process.exit(2);
}
const frames = allFramesFor(lang);
const ladder = ladderFor(lang);
const stageOf = (order: number) => ladder?.stages.find((stage) => stage.order === order);

if (cmd === "brief") {
  for (const order of [1, 2, 3]) {
    const stage = stageOf(order);
    console.log(`\n=== 단계 ${order} ===`);
    console.log("문장틀(id · pattern · 뜻 · 예문):");
    for (const frame of frames.filter((one) => one.stage === order)) {
      console.log(`  ${frame.id} · ${frame.pattern} · ${frame.meaning.en} · 예: ${frame.examples[0]?.text ?? ""}`);
    }
    if (stage) {
      console.log("문법(번호 · 이름 · 예):");
      stage.grammar.forEach((g, i) => console.log(`  ${i} · ${g.name.en} · ${g.example}`));
      console.log("핵심 표현(그대로 써야 expressions에 넣을 수 있음):");
      console.log(`  ${stage.expressions.join(" | ")}`);
    }
  }
  process.exit(0);
}

const scripts = JSON.parse(fs.readFileSync(file!, "utf8")) as StageScript[];
const byId = new Map(frames.map((frame) => [frame.id, frame]));
const errors: string[] = [];
const ids = new Set<string>();
const perStage: Record<number, number> = {};
const used: Record<string, number> = {};
for (const script of scripts) {
  const at = script.id;
  if (!new RegExp(`^${lang}-[123]-b\\d{2}$`).test(script.id)) errors.push(`${at}: id 모양 ${lang}-<단계>-bNN`);
  if (ids.has(script.id)) errors.push(`${at}: id 겹침`);
  ids.add(script.id);
  if (script.id.split("-")[1] !== String(script.stage)) errors.push(`${at}: id 단계와 stage가 다름`);
  if (script.bank !== true) errors.push(`${at}: bank: true`);
  perStage[script.stage] = (perStage[script.stage] ?? 0) + 1;
  if (!script.setting?.en || !script.setting?.ko) errors.push(`${at}: setting.en·ko`);
  const stage = stageOf(script.stage);
  for (const expression of script.expressions ?? []) {
    if (!stage?.expressions.includes(expression)) errors.push(`${at}: 표현 "${expression}"은 ${script.stage}단계 핵심 표현 목록에 없음`);
    else if (!script.lines.some((line) => line.who === "me" && line.text.toLowerCase().includes(expression.toLowerCase()))) errors.push(`${at}: 표현 "${expression}"이 내 줄에 없음`);
  }
  if (!Array.isArray(script.expressions)) errors.push(`${at}: expressions 배열(비어도 됨)`);
  for (const g of script.grammar ?? []) if (!stage || g < 0 || g >= stage.grammar.length) errors.push(`${at}: 문법 번호 ${g}`);
  if (script.lines?.length !== 8) errors.push(`${at}: 줄 8개(지금 ${script.lines?.length})`);
  let tagged = 0;
  (script.lines ?? []).forEach((line, i) => {
    const where = `${at} 줄${i}`;
    if (line.who !== (i % 2 === 0 ? "them" : "me")) errors.push(`${where}: them·me 번갈아(them부터)`);
    if (!line.text?.trim()) errors.push(`${where}: text`);
    if (!line.gloss?.en?.trim() || !line.gloss?.ko?.trim()) errors.push(`${where}: gloss.en·ko`);
    if (/\p{Nd}/u.test(line.text ?? "")) errors.push(`${where}: 숫자는 글로("${line.text}")`);
    if (line.who === "them" && line.frames?.length) errors.push(`${where}: 상대 줄에는 frames 없음`);
    if (line.frames?.length) tagged += 1;
    for (const id of line.frames ?? []) {
      const frame = byId.get(id);
      if (!frame) {
        errors.push(`${where}: 없는 틀 ${id}`);
        continue;
      }
      if (frame.stage > script.stage) errors.push(`${where}: 틀 ${id}는 ${frame.stage}단계(장면은 ${script.stage}단계)`);
      if (!frameUsed(frame.pattern, line.text)) errors.push(`${where}: 줄에 틀 "${frame.pattern}"의 고정 부분이 그대로 없음 — "${line.text}"`);
      used[id] = (used[id] ?? 0) + 1;
    }
  });
  if (tagged < 3) errors.push(`${at}: 내 줄 넷 중 셋 이상에 frames`);
  const nameText = script.name?.text ?? [];
  for (const name of nameText) if (!script.lines.some((line) => line.text.includes(name))) errors.push(`${at}: name "${name}"이 줄에 없음`);
}
for (const order of [1, 2, 3]) if ((perStage[order] ?? 0) < 20) errors.push(`${order}단계 장면 ${perStage[order] ?? 0}개(20개 필요)`);
const unused = frames.filter((frame) => frame.stage <= 3 && !used[frame.id]).map((frame) => frame.id);
if (unused.length) errors.push(`한 번도 안 쓴 틀: ${unused.join(", ")}`);

if (errors.length) {
  console.log(errors.slice(0, 80).join("\n"));
  console.log(`\n${errors.length}개 문제`);
  process.exit(1);
}
console.log(`ok — ${scripts.length}개 (${Object.entries(perStage).map(([s, n]) => `${s}단계 ${n}`).join(", ")})`);

if (cmd === "write") {
  const NAME = `${lang.toUpperCase()}_BANK`;
  const out = path.resolve(`src/lib/curriculum/stageScripts/bank/${lang}.ts`);
  const body = `import type { StageScript } from "../../stageScripts.ts";

/**
 * ${lang} 대본 은행(2026-10-30 사용자 "여러 개 만들어 두고 추천" → A: 지금 단계 이하에서) — 단계 조건·상황 목록과 따로, 오늘 할 것 끝의 대화 한 칸으로 추천(curriculum/scriptBank.ts).
 * 1~3단계 20개씩, 줄 8개, 내 줄에 그 단계 이하 틀 태그. Claude가 쓰고 scripts/script-bank.ts로 검사, 원어민 확인 전.
 */
export const ${NAME}: StageScript[] = ${JSON.stringify(scripts, null, 2)};
`;
  fs.writeFileSync(out, body);
  console.log(`→ ${path.relative(process.cwd(), out)}`);
}
