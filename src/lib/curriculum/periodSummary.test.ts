import test from "node:test";
import assert from "node:assert/strict";
import { inPeriod, periodLastDay, periodOf, shiftPeriod, summarize } from "./periodSummary.ts";
import type { LogItem } from "../notes/stageParts.ts";

const at = (day: string, hour = 10) => {
  const [y, m, d] = day.split("-").map(Number);
  return Date.UTC(y!, m! - 1, d!, hour);
};
const dayOf = (value: number) => {
  const d = new Date(value);
  return `${d.getUTCFullYear()}-${d.getUTCMonth() + 1}-${d.getUTCDate()}`;
};

test("주는 월요일부터, 달은 1일부터 — 넘기기·끝 날", () => {
  assert.deepEqual(periodOf("week", "2026-11-4"), { kind: "week", start: "2026-11-2" });
  assert.deepEqual(periodOf("month", "2026-11-30"), { kind: "month", start: "2026-11-1" });
  assert.deepEqual(shiftPeriod({ kind: "month", start: "2026-1-1" }, -1), { kind: "month", start: "2025-12-1" });
  assert.deepEqual(shiftPeriod({ kind: "week", start: "2026-11-2" }, -1), { kind: "week", start: "2026-10-26" });
  assert.equal(periodLastDay({ kind: "month", start: "2026-2-1" }), "2026-2-28");
  assert.equal(inPeriod({ kind: "week", start: "2026-11-2" }, "2026-11-8"), true);
  assert.equal(inPeriod({ kind: "week", start: "2026-11-2" }, "2026-11-9"), false);
});

test("기간 합계: 공부한 날·통화·수업·퀴즈·고친 수·맞힘, 소재는 하나로(익힘이 앞섬) — 일본어·스페인어 소재", () => {
  const items: LogItem[] = [
    { at: at("2026-11-2"), kind: "learned", text: "〜たいです", part: "grammar", stage: 1, node: "ja-1-g2" },
    { at: at("2026-11-4"), kind: "mastered", text: "〜たいです", part: "grammar", stage: 1, node: "ja-1-g2" },
    { at: at("2026-11-3"), kind: "learned", text: "¿Qué tal?", part: "expression", stage: 1 },
    { at: at("2026-11-3"), kind: "fixed", text: "yo ir", right: "fui", part: "grammar", stage: 1 },
    { at: at("2026-10-30"), kind: "learned", text: "지난주 것", part: "vocab", stage: 1 },
  ];
  const sum = summarize({
    period: { kind: "week", start: "2026-11-2" },
    items,
    results: [
      { kind: "lesson", item: "f1", title: "〜たいです", right: 3, total: 3, said: [], at: at("2026-11-2"), day: "2026-11-2" },
      { kind: "script", item: "s1", title: "카페", right: 2, total: 4, said: [], at: at("2026-11-5"), day: "2026-11-5" },
    ],
    quiz: { "2026-11-5": { n: 10, right: 7, wrong: [] }, "2026-10-28": { n: 5, right: 5, wrong: [] } } as never,
    calls: [{ day: "2026-11-6", at: at("2026-11-6"), seconds: 330, fixed: 2, redone: 1 }],
    dayOf,
  });
  assert.equal(sum.activeDays, 5, "2·3·4·5·6일");
  assert.deepEqual([sum.calls, sum.callMinutes, sum.lessons, sum.scripts, sum.recalls], [1, 6, 1, 1, 0]);
  assert.deepEqual([sum.quizN, sum.quizRight, sum.fixed, sum.redone], [10, 7, 1, 1]);
  assert.equal(sum.learned.length, 2);
  assert.equal(sum.learned[0]!.kind, "mastered", "익힘 먼저, 같은 문법 칸은 하나");
});

test("아무것도 없는 기간은 0", () => {
  const sum = summarize({ period: { kind: "month", start: "2025-1-1" }, items: [], results: [], quiz: {} as never, calls: [], dayOf });
  assert.equal(sum.activeDays, 0);
  assert.equal(sum.learned.length, 0);
});

test("통화 숫자 한 줄: 길이·고친 수·맞힘, 내 말 없는 통화는 없음, 1년 넘은 줄은 빠짐", async () => {
  const { callDayOf, withCallDay } = await import("../roleplay/callDays.ts");
  const started = at("2026-11-2", 9);
  const row = callDayOf({
    startedAt: started,
    updatedAt: started + 200_000,
    finishedAt: started + 300_000,
    said: [
      { who: "tutor", text: "¿Qué tal?" },
      { who: "learner", text: "yo ir playa", better: "Fui a la playa." },
      { who: "learner", text: "Fui a la playa.", redo: "pass" },
    ],
  });
  assert.equal(row?.seconds, 300);
  assert.deepEqual([row?.fixed, row?.redone], [1, 1]);
  assert.equal(callDayOf({ startedAt: started, updatedAt: started, said: [{ who: "tutor", text: "やあ" }] }), null);
  const kept = withCallDay({ old: { day: "2025-1-1", at: at("2025-1-1"), seconds: 60, fixed: 0, redone: 0 } }, "new", row!, at("2026-11-3"));
  assert.deepEqual(Object.keys(kept), ["new"]);
});
