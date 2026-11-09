import assert from "node:assert/strict";
import test from "node:test";
import { CHECKUP_EVERY_MS, checkupDue, checkupWeakest, cleanResult, type CheckResult } from "./checkup.ts";
import { DAY_MS } from "./dailyPlan.ts";
const NOW = Date.UTC(2026, 9, 29, 3);
test("서버가 받는 결과: 숫자·열쇠 모양이 틀리면 버린다", () => {
  assert.equal(cleanResult({ stage: 9, parts: { vocab: [1, 2] } }, "en"), null);
  assert.equal(cleanResult({ stage: 1, parts: { vocab: [3, 2] } }, "en"), null);
  assert.equal(cleanResult({ stage: 1, parts: {} }, "en"), null);
  const ok = cleanResult({ stage: 1, parts: { vocab: [1, 2], other: [1, 1] }, wrong: ["x|nope", "e|" + "a".repeat(90)] }, "en", NOW)!;
  assert.deepEqual(ok.parts, { vocab: [1, 2] });
  assert.deepEqual(ok.wrong, []);
});

test("7일에 한 번, 약한 갈래는 최근 확인 셋을 합쳐서(2문제 이상, 80% 아래)", () => {
  assert.equal(checkupDue([], NOW), true);
  const r = (daysAgo: number, parts: CheckResult["parts"]): CheckResult => ({ at: NOW - daysAgo * DAY_MS, stage: 1, parts, origins: {}, wrong: [] });
  assert.equal(checkupDue([r(2, { vocab: [1, 1] })], NOW), false);
  assert.equal(checkupDue([r(7, { vocab: [1, 1] })], NOW), true);
  assert.ok(CHECKUP_EVERY_MS === 7 * DAY_MS);
  const results = [r(1, { vocab: [3, 3], grammar: [1, 3], pronunciation: [0, 1] }), r(8, { grammar: [1, 2], expression: [2, 3] })];
  // 발음은 1문제뿐이라 빼고, 문법 2/5 = 가장 낮음.
  assert.equal(checkupWeakest(results, NOW), "grammar");
  assert.equal(checkupWeakest([r(1, { vocab: [4, 4], grammar: [4, 5] })], NOW), null);
  // 4주가 지난 결과는 안 씀.
  assert.equal(checkupWeakest([r(40, { grammar: [0, 4] })], NOW), null);
});
