import { test } from "node:test";
import assert from "node:assert/strict";
import { addQuizDay, weekOf } from "./quizDays.ts";

test("Logbank 퀴즈 수: 날마다 더하고 1년(366일)만, 주는 월요일로 묶음(2026-11-02 주·월 정리 — 예전 60일)", () => {
  let days = {};
  days = addQuizDay(days, "2026-10-31", true);
  days = addQuizDay(days, "2026-10-31", false);
  assert.deepEqual(days, { "2026-10-31": { n: 2, right: 1 } });
  // 틀린 열쇠는 그날 칸에(같은 열쇠는 한 번) — 태국어·스페인어 낱말.
  let wrongs = addQuizDay({}, "2026-11-1", false, "w|น้ำ");
  wrongs = addQuizDay(wrongs, "2026-11-1", false, "w|น้ำ");
  wrongs = addQuizDay(wrongs, "2026-11-1", false, "w|libro");
  wrongs = addQuizDay(wrongs, "2026-11-1", true, "w|casa");
  assert.deepEqual(wrongs["2026-11-1"], { n: 4, right: 1, wrong: ["w|น้ำ", "w|libro"] });
  for (let i = 0; i < 400; i += 1) {
    const d = new Date(Date.UTC(2024, 0, 1) + i * 24 * 60 * 60 * 1000);
    days = addQuizDay(days, `${d.getUTCFullYear()}-${d.getUTCMonth() + 1}-${d.getUTCDate()}`, true);
  }
  assert.equal(Object.keys(days).length, 366);
  assert.ok("2026-10-31" in days);
  // 2026-10-31은 토요일 → 그 주 월요일 10-26, 일요일 11-1도 같은 주, 월요일 11-2는 다음 주.
  assert.equal(weekOf("2026-10-31"), "2026-10-26");
  assert.equal(weekOf("2026-11-1"), "2026-10-26");
  assert.equal(weekOf("2026-11-2"), "2026-11-2");
});

test("Logbank 결과 카드(이 폰): 말한 줄 다섯까지·빈 줄 빼기, 1년 지난 것 지움(예전 60일) — 일본어·스페인어", async () => {
  const { addDayResult } = await import("./dayLog.ts");
  const now = Date.UTC(2026, 10, 1, 3);
  const old = { kind: "lesson" as const, item: "es-f1-01", title: "Me llamo ___.", right: 1, total: 3, said: [], at: now - 367 * 24 * 60 * 60 * 1000, day: "2025-10-30" };
  const said = ["わたしはミンです。", "", "わたしは学生です。", "a", "b", "c", "d"].map((text, i) => ({ text, good: i % 2 === 0 }));
  const list = addDayResult([old], { kind: "lesson", item: "ja-f1-01", title: "わたしは___です。", right: 2, total: 3, passed: false, said, at: now, day: "2026-11-1" }, now);
  assert.equal(list.length, 1);
  assert.equal(list[0]!.said.length, 5);
  const kept = addDayResult([{ ...old, at: now - 90 * 24 * 60 * 60 * 1000, day: "2026-8-3" }], { ...list[0]!, said: [] }, now);
  assert.equal(kept.length, 2, "90일 전 것은 남음");
  assert.ok(list[0]!.said.every((one) => one.text));
});
