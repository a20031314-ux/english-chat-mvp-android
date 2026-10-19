/**
 * 평가할 줄을 묶음 파일로 꺼낸다 — 평가는 Claude(이 채팅이나 예약 작업의 에이전트)가 한다. 모델 키·서버 변경 없음.
 *
 *   node scripts/sim-users/judge-export.mjs tmp/sim-users/<실행> [--size 40]
 *     → <실행>/judge/batch-01.json …  (각 줄: id·칸·언어·학습자 문장·앱의 고침·설명·답·바로 앞 튜터 말)
 *   평가자는 같은 폴더에 batch-01.verdicts.json을 쓴다(형식은 judge/RUBRIC.md).
 *   tiers-report.mjs가 verdicts를 읽어 칸별 "평가" 비율을 더한다.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const args = process.argv.slice(2);
const dir = args.find((a) => !a.startsWith("--"));
const sizeAt = args.indexOf("--size");
const SIZE = sizeAt >= 0 ? Number(args[sizeAt + 1]) : 40;
if (!dir) throw new Error("실행 폴더를 주세요");

const run = JSON.parse(readFileSync(join(dir, "results.json"), "utf8"));
const items = [];
for (const record of run.records) {
  let before = "";
  for (const step of record.transcript) {
    if (step.suite !== "tiers" || !step.tier || step.tier === "overlap") continue;
    if (step.kind === "start") { before = step.reply ?? ""; continue; }
    if (step.status !== 200) continue;
    items.push({
      id: `${record.persona.id}-${step.turn}`,
      tier: step.tier,
      kind: step.kind,
      target: record.persona.target,
      ui: record.persona.ui,
      intended: step.expect?.tags?.length ? step.expect.tags.join("/") : step.tier === "ok" ? "none" : step.misbehavior ?? "",
      text: step.text,
      corrected: step.corrected ?? "",
      natural: step.natural ?? "",
      explanation: step.explanation ?? "",
      before,
      reply: step.reply ?? "",
      card: step.card?.expression ?? "",
    });
    before = step.reply ?? before;
  }
}
const out = join(dir, "judge");
mkdirSync(out, { recursive: true });
let n = 0;
for (let i = 0; i < items.length; i += SIZE) {
  n += 1;
  writeFileSync(join(out, `batch-${String(n).padStart(2, "0")}.json`), JSON.stringify(items.slice(i, i + SIZE), null, 1));
}
writeFileSync(join(out, "RUBRIC.md"), readFileSync(new URL("./judge-rubric.md", import.meta.url), "utf8"));
console.log(`${items.length}줄 → ${n}묶음 (${out})`);
