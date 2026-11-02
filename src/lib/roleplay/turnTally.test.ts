import { test } from "node:test";
import assert from "node:assert/strict";
import { markTurn, tallyTurns, type TurnSignals } from "./turnTally.ts";
import { turnMeasure } from "./director.ts";
import { callDayOf } from "./callDays.ts";

const base: TurnSignals = { assessment: "on_track", bigFix: false, hesitationMs: 1200, usedHint: false, captions: false, afterMissed: false, level: 3 };

test("차례 하나: 어긋남 없음 = 매끄러움, 하나 = 걸림, 둘·감독 막힘·10초 = 막힘", () => {
  assert.equal(markTurn(base).flow, "smooth");
  assert.deepEqual(markTurn({ ...base, hesitationMs: 6000 }).why, ["slow"]);
  assert.equal(markTurn({ ...base, hesitationMs: 6000 }).flow, "snag");
  assert.equal(markTurn({ ...base, usedHint: true, native: true }).flow, "stuck");
  assert.equal(markTurn({ ...base, assessment: "stuck" }).flow, "stuck");
  assert.equal(markTurn({ ...base, hesitationMs: 12_000 }).flow, "stuck");
  assert.deepEqual(markTurn({ ...base, lead: "min" }).why, ["minimal"]);
});

test("알아들음: 자막을 켰으면 듣기 근거에서 빼고, 🙉 다시 들은 뒤 맞게 답하면 after", () => {
  assert.equal(markTurn({ ...base, heard: "yes" }).heard, "yes");
  assert.equal(markTurn({ ...base, heard: "yes", captions: true }).heard, undefined);
  assert.equal(markTurn({ ...base, heard: "yes", captions: true }).captioned, true);
  assert.equal(markTurn({ ...base, heard: "yes", afterMissed: true }).heard, "after");
});

test("통화 셈: 차례·이끎·알아들음·까닭을 세고 튜터 단계는 평균", () => {
  const tally = tallyTurns([
    markTurn({ ...base, heard: "yes", lead: "lead", leadHow: "ask", fnGroup: "ask", level: 2 }),
    markTurn({ ...base, heard: "off", lead: "follow", hesitationMs: 5000, level: 4 }),
    undefined,
  ])!;
  assert.deepEqual([tally.turns, tally.smooth, tally.snag, tally.lead, tally.follow, tally.asked, tally.heardYes, tally.stage], [2, 1, 1, 1, 1, 2, 1, 3]);
  assert.equal(tally.leadHow.ask, 1);
  assert.equal(tally.fn.ask, 1);
  assert.equal(tally.why.slow, 1);
  assert.equal(tallyTurns([undefined]), null);
});

test("감독 재기 칸: 모르는 값은 버리고, 학습자 말이 없거나 🙉 차례면 없음, 이끎은 그냥 대화만", () => {
  const record = { heard: "yes", lead: "lead", how: "topic", fn: "time", native: true };
  assert.deepEqual(turnMeasure(record, { heard: "ayer fui al cine" }, { openEnded: true }), { heard: "yes", lead: "lead", leadHow: "topic", fnGroup: "time", native: true });
  assert.deepEqual(turnMeasure(record, { heard: "ayer fui al cine" }, { openEnded: false }), { heard: "yes", fnGroup: "time", native: true });
  assert.deepEqual(turnMeasure({ heard: "maybe", fn: "weather" }, { heard: "はい" }, { openEnded: true }), {});
  assert.deepEqual(turnMeasure(record, { heard: "", missed: true }, { openEnded: true }), {});
});

test("통화 기록 한 줄에 차례 셈이 실림(문장 없이 숫자만)", () => {
  const row = callDayOf({
    startedAt: Date.UTC(2026, 10, 2, 3),
    updatedAt: Date.UTC(2026, 10, 2, 3, 5),
    activeSecs: 280,
    said: [
      { who: "tutor", text: "¿Qué hiciste ayer?" },
      { who: "learner", text: "Fui al cine", turn: markTurn({ ...base, heard: "yes" }) },
    ],
  })!;
  assert.equal(row.seconds, 280);
  assert.equal(row.turns?.turns, 1);
  assert.ok(!JSON.stringify(row).includes("cine"));
});
