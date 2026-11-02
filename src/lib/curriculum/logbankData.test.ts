import { test } from "node:test";
import assert from "node:assert/strict";
import { bars, partOfKey, partRows, periodDays, resultMinutes, totals, type LogInputs } from "./logbankData.ts";
import type { DayResult } from "./dayLog.ts";

const dayOf = (at: number) => {
  const d = new Date(at);
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
};
const at = (day: string) => {
  const [y, m, d] = day.split("-").map(Number);
  return new Date(y!, m! - 1, d!, 12).getTime();
};
const week = { kind: "week" as const, start: "2026-11-2" };

function result(over: Partial<DayResult>): DayResult {
  return { kind: "lesson", item: "x", title: "t", right: 3, total: 3, passed: true, said: [], at: at("2026-11-3"), day: "2026-11-3", ...over };
}

test("기준 갈래: 열쇠로 문법·어휘·표현을 가른다(띄어쓰기 없는 일본어·스페인어 포함)", () => {
  assert.equal(partOfKey("ja", "f|ja-f1-01"), "grammar");
  assert.equal(partOfKey("ja", "w|食べる"), "vocab");
  assert.equal(partOfKey("es", "e|mucho gusto"), "vocab");
  assert.equal(partOfKey("es", "e|¿me puede ayudar con esto?"), "expression");
  assert.equal(partOfKey("es", "x|?"), null);
});

test("학습 시간: 통화·수업·퀴즈를 날마다 분으로, 잰 시간이 있으면 그것", () => {
  const input: LogInputs = {
    language: "es",
    items: [],
    results: [result({ secs: 300 }), result({ kind: "script", total: 6, day: "2026-11-4", at: at("2026-11-4") })],
    quiz: { "2026-11-3": { n: 30, right: 20 } },
    calls: [{ day: "2026-11-2", at: at("2026-11-2"), seconds: 600, fixed: 1, redone: 0 }],
    dayOf,
  };
  assert.equal(periodDays(week).length, 7);
  const list = bars(week, "time", input);
  assert.deepEqual(list[0]!.parts, [10, 0, 0]);
  assert.deepEqual(list[1]!.parts, [0, 5, 10]);
  assert.equal(list[2]!.parts[1], 3);
  assert.equal(resultMinutes(result({})), 4);
  assert.equal(totals(week, "time", input).minutes, 28);
});

test("갈래 목록: 서버 기록·수업 결과·퀴즈 틀림을 소재 하나로 모으고 틀린 것 먼저", () => {
  const input: LogInputs = {
    language: "ja",
    items: [
      { at: at("2026-11-2"), kind: "learned", text: "食べる", part: "vocab", stage: 1, where: "chat" },
      { at: at("2026-11-3"), kind: "mastered", text: "食べる", part: "vocab", stage: 1, where: "call" },
      { at: at("2026-11-3"), kind: "fixed", text: "わたしは学生だ", right: "わたしは学生です", part: "grammar", stage: 1, where: "call" },
      { at: at("2026-10-20"), kind: "learned", text: "飲む", part: "vocab", stage: 1 },
    ],
    results: [result({ key: "f|ja-f1-01", title: "わたしは___です。", passed: false, right: 1 })],
    quiz: { "2026-11-4": { n: 5, right: 3, wrong: ["w|水", "f|ja-f1-01"] } },
    calls: [],
    dayOf,
  };
  const vocab = partRows(week, "vocab", input);
  assert.deepEqual(vocab.map((row) => [row.text, row.status]), [["水", "missed"], ["食べる", "mastered"]]);
  assert.equal(vocab.find((row) => row.text === "食べる")!.events.length, 2);
  const grammar = partRows(week, "grammar", input);
  const lesson = grammar.find((row) => row.key === "f|ja-f1-01")!;
  assert.equal(lesson.events.length, 2);
  assert.equal(lesson.status, "missed");
  assert.ok(grammar.some((row) => row.events[0]!.kind === "fixed"));
  const b = bars(week, "vocab", input);
  assert.deepEqual(b[0]!.parts, [0, 1, 0]);
  assert.deepEqual(b[1]!.parts, [1, 0, 0]);
  assert.deepEqual(totals(week, "grammar", input), { rows: 2, mastered: 0, missed: 2 });
});

test("익힌 뒤 더 최근에 틀리면 다시 볼 것(가장 최근 사건 우선 — es·th)", () => {
  const input: LogInputs = {
    language: "th",
    items: [
      { at: at("2026-11-2"), kind: "mastered", text: "กิน", part: "vocab", stage: 1, where: "quiz" },
      { at: at("2026-11-2"), kind: "mastered", text: "agua", part: "vocab", stage: 1, where: "quiz" },
    ],
    results: [],
    quiz: { "2026-11-5": { n: 2, right: 0, wrong: ["w|กิน"] } },
    calls: [],
    dayOf,
  };
  const rows = partRows(week, "vocab", input);
  assert.equal(rows.find((row) => row.text === "กิน")?.status, "missed");
  assert.equal(rows.find((row) => row.text === "agua")?.status, "mastered");
  assert.equal(rows[0]!.text, "กิน");
});
