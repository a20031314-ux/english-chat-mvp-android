import assert from "node:assert/strict";
import test from "node:test";
import { bigTestDue, BIG_TEST_EVERY_MS, buildStageTest, failedToday, STAGE_TEST_SAY, STAGE_TEST_SIZE, stageTestResult } from "./stageTest.ts";
import { cleanResult, type CheckResult } from "./checkup.ts";
import { DAY_MS } from "./dailyPlan.ts";

const NOW = Date.UTC(2026, 9, 29, 3);

test("단계 시험: 24문제, 그 단계가 대부분·앞 단계·다음 단계, 말하기 넷까지(영어·스페인어·일본어·태국어)", () => {
  for (const language of ["en", "es", "ja", "th"]) {
    for (const stage of [1, 2, 3]) {
      const items = buildStageTest({ language, stage, now: NOW });
      assert.equal(items.length, STAGE_TEST_SIZE, `${language} ${stage}`);
      const here = items.filter((item) => item.stage === stage).length;
      assert.ok(here >= 16, `${language} ${stage}: 그 단계 ${here}`);
      if (stage > 1) assert.ok(items.some((item) => item.stage < stage), `${language} ${stage}: 앞 단계`);
      assert.ok(items.some((item) => item.stage === stage + 1), `${language} ${stage}: 다음 단계`);
      const says = items.filter((item) => item.question.kind === "say");
      assert.ok(says.length <= STAGE_TEST_SAY && says.every((item) => item.stage <= stage), `${language} ${stage}: 말하기`);
      assert.equal(new Set(items.map((item) => item.key)).size, items.length);
    }
  }
});

test("같은 날 같은 문제", () => {
  const keys = (now: number) => buildStageTest({ language: "es", stage: 2, now }).map((item) => item.key).join(",");
  assert.equal(keys(NOW), keys(NOW + 3600_000));
  assert.notEqual(keys(NOW), keys(NOW + DAY_MS));
});

test("넘음 = 그 단계 문제 70% 이상, 틀린 것은 그 단계·앞 단계 것만", () => {
  const items = buildStageTest({ language: "ja", stage: 2, now: NOW });
  const all = stageTestResult(items, items.map((item) => item.stage !== 3), 2, NOW);
  assert.equal(all.passed, true);
  assert.deepEqual(all.wrong, []);
  const half = stageTestResult(items, items.map((_, i) => i % 2 === 0), 2, NOW);
  assert.equal(half.passed, false);
  assert.ok(half.wrong.every((key) => items.find((item) => item.key === key)!.stage <= 2));
  const back = cleanResult(JSON.parse(JSON.stringify(half)), "ja", NOW);
  assert.deepEqual(back, half);
});

test("같은 날 못 넘었으면 다시 안 보고, 큰 시험은 6주마다·처음 본 지 3일", () => {
  const r = (at: number, extra: Partial<CheckResult>): CheckResult => ({ at, stage: 2, parts: { vocab: [1, 1] }, origins: {}, wrong: [], ...extra });
  assert.ok(failedToday([r(NOW - 3600_000, { kind: "stage", passed: false })], 2, NOW));
  assert.equal(failedToday([r(NOW - DAY_MS, { kind: "stage", passed: false })], 2, NOW), null);
  assert.equal(failedToday([r(NOW, { kind: "stage", passed: true })], 2, NOW), null);
  assert.equal(bigTestDue([r(NOW - 10 * DAY_MS, { kind: "placement" })], 0, NOW), false);
  assert.equal(bigTestDue([r(NOW - BIG_TEST_EVERY_MS, { kind: "stage", passed: true })], 0, NOW), true);
  // 이번 주 확인은 큰 시험이 아님.
  assert.equal(bigTestDue([r(NOW, {})], NOW - 4 * DAY_MS, NOW), true);
  assert.equal(bigTestDue([], NOW - DAY_MS, NOW), false);
  assert.equal(bigTestDue([], 0, NOW), false);
});
