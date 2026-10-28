import assert from "node:assert/strict";
import test from "node:test";
import {
  buildCheckup,
  CHECKUP_EVERY_MS,
  CHECKUP_SAY,
  CHECKUP_SIZE,
  checkupDue,
  checkupReady,
  checkupWeakest,
  cleanResult,
  partOf,
  summarize,
  weekSeed,
  type CheckResult,
} from "./checkup.ts";
import { DAY_MS } from "./dailyPlan.ts";
import { allScriptsFor } from "./stageScripts.ts";

const NOW = Date.UTC(2026, 9, 29, 3);
const firstOf = (language: string, stage: number, n: number) => allScriptsFor(language).filter((s) => s.stage === stage).slice(0, n).map((s) => s.id);

test("이번 주 확인: 12문제, 배운 것·다음 단계를 섞고 말하기는 셋까지(영어·스페인어·일본어·태국어)", () => {
  for (const language of ["en", "es", "ja", "th"]) {
    const items = buildCheckup({ language, stage: 1, passed: new Set(firstOf(language, 1, 3)), review: {}, log: {}, now: NOW });
    assert.equal(items.length, CHECKUP_SIZE, language);
    assert.ok(checkupReady(items), language);
    assert.ok(items.some((item) => item.origin === "ahead"), `${language}: 다음 단계 것`);
    const says = items.filter((item) => item.question.kind === "say");
    assert.ok(says.length >= 1 && says.length <= CHECKUP_SAY, `${language}: 말하기 ${says.length}`);
    assert.ok(says.every((item) => item.origin !== "ahead" && item.part === "pronunciation"), `${language}: 다음 단계 것은 말하기로 안 냄`);
    assert.ok(items.every((item) => item.question.kind !== "fix"), language);
    assert.equal(new Set(items.map((item) => item.key)).size, items.length, `${language}: 열쇠는 한 번씩`);
  }
});

test("같은 주에는 같은 문제, 다음 주에는 다른 문제", () => {
  const input = { language: "es", stage: 1, passed: new Set(firstOf("es", 1, 3)), review: {}, log: {}, now: NOW };
  const keys = (now: number) => buildCheckup({ ...input, now }).map((item) => item.key).join(",");
  assert.equal(keys(NOW), keys(NOW + DAY_MS));
  assert.equal(weekSeed("es", NOW), weekSeed("es", NOW + DAY_MS));
  assert.notEqual(weekSeed("es", NOW), weekSeed("es", NOW + 7 * DAY_MS));
});

test("처음 쓰는 사람(배운 게 없음)에게는 확인을 내지 않는다", () => {
  const items = buildCheckup({ language: "en", stage: 1, passed: new Set(), review: {}, log: {}, now: NOW });
  assert.equal(checkupReady(items), false);
});

test("최근 = 2주 안에 다시 볼 것·퀴즈로 푼 것, 그 전 것은 오래전", () => {
  const passed = new Set(firstOf("en", 1, 2));
  const items = buildCheckup({
    language: "en",
    stage: 2,
    passed,
    review: {},
    log: {},
    now: NOW,
  });
  // 지금 단계(2)보다 앞 단계에서 통과한 대본은 오래전 칸.
  assert.ok(items.some((item) => item.origin === "old"));
});

test("갈래: 말하기 = 발음, 문장구조·문법 = 문법, 두 낱말까지 = 어휘(stageParts isWordish), 그보다 길면 표현", () => {
  assert.equal(partOf("en", "e|nice to meet you", "say"), "pronunciation");
  assert.equal(partOf("en", "f|en-f1-01", "choose"), "grammar");
  assert.equal(partOf("en", "g|1:2", "order"), "grammar");
  assert.equal(partOf("es", "e|hola", "choose"), "vocab");
  assert.equal(partOf("en", "e|nice to meet you", "choose"), "expression");
});

test("결과: 갈래·칸마다 맞힌 수, 말하기를 못 한 것은 빼고, 틀린 열쇠", () => {
  const items = buildCheckup({ language: "ja", stage: 1, passed: new Set(firstOf("ja", 1, 3)), review: {}, log: {}, now: NOW });
  const answers = items.map((item, i) => (item.question.kind === "say" && i === items.findIndex((x) => x.question.kind === "say") ? null : i % 3 !== 0));
  const result = summarize(items, answers, 1, NOW);
  const counted = answers.filter((a) => a !== null).length;
  const total = Object.values(result.parts).reduce((sum, t) => sum + t![1], 0);
  assert.equal(total, counted);
  assert.equal(result.wrong.length, answers.filter((a) => a === false).length);
  // 서버가 다시 받아도 같은 모양.
  const back = cleanResult(JSON.parse(JSON.stringify(result)), "ja", NOW);
  assert.deepEqual(back, result);
});

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
