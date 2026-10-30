import { test } from "node:test";
import assert from "node:assert/strict";
import { addQuizDay, weekOf } from "./quizDays.ts";

test("Logbank 퀴즈 수: 날마다 더하고 60일만, 주는 월요일로 묶음", () => {
  let days = {};
  days = addQuizDay(days, "2026-10-31", true);
  days = addQuizDay(days, "2026-10-31", false);
  assert.deepEqual(days, { "2026-10-31": { n: 2, right: 1 } });
  for (let i = 1; i <= 70; i += 1) days = addQuizDay(days, `2026-1-${i}`, true);
  assert.equal(Object.keys(days).length, 60);
  assert.ok("2026-10-31" in days);
  // 2026-10-31은 토요일 → 그 주 월요일 10-26, 일요일 11-1도 같은 주, 월요일 11-2는 다음 주.
  assert.equal(weekOf("2026-10-31"), "2026-10-26");
  assert.equal(weekOf("2026-11-1"), "2026-10-26");
  assert.equal(weekOf("2026-11-2"), "2026-11-2");
});
