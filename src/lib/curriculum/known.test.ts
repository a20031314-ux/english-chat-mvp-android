import assert from "node:assert/strict";
import test from "node:test";
import { applyKnown, cleanKnown, confirmDue, knownState, KNOWN_DAYS, skippedIds, type KnownMap } from "./known.ts";
import { DAY_MS, reviewKeysOf } from "./dailyPlan.ts";
import { allScriptsFor } from "./stageScripts.ts";
import { buildEntryCheck, entryCheckResult, entryDue } from "./stageTest.ts";
import { stageKeys } from "./placement.ts";
import { nextStudy } from "./nextStudy.ts";
import { buildCheckup } from "./checkup.ts";

const NOW = Date.UTC(2026, 9, 29, 3);

test("확인 중 → 이미 앎: 시험에서 생기고, 다른 날 맞힐 때마다 하루씩, 같은 날은 한 번, 틀리면 지움", () => {
  let map: KnownMap = {};
  map = applyKnown(map, "e|gracias", true, NOW);
  assert.equal(knownState(map, "e|gracias"), null, "퀴즈 정답만으로는 안 생김");
  map = applyKnown(map, "e|gracias", true, NOW, true);
  assert.equal(knownState(map, "e|gracias"), "checking");
  map = applyKnown(map, "e|gracias", true, NOW + 1000);
  assert.equal(map["e|gracias"]!.days.length, 1, "같은 날은 한 번");
  for (let d = 1; d < KNOWN_DAYS; d += 1) map = applyKnown(map, "e|gracias", true, NOW + d * DAY_MS);
  assert.equal(knownState(map, "e|gracias"), "known");
  map = applyKnown(map, "e|gracias", false, NOW + 5 * DAY_MS);
  assert.equal(knownState(map, "e|gracias"), null);
  assert.deepEqual(cleanKnown({ "e|a": { days: [1, 1, 2], at: 3 }, "x|b": { days: [1] }, "e|c": { days: [] } }), { "e|a": { days: [1, 2], at: 3 } });
});

test("커리큘럼이 건너뜀: 대본 열쇠가 모두 시험에서 맞힌 것이면(일본어·스페인어), 확인할 것은 오늘 안 푼 것만", () => {
  for (const language of ["ja", "es"]) {
    const script = allScriptsFor(language).find((one) => one.stage === 1)!;
    const keys = reviewKeysOf(language, script.id);
    let map: KnownMap = {};
    for (const key of keys.slice(0, -1)) map = applyKnown(map, key, true, NOW, true);
    assert.equal(skippedIds(language, map).has(script.id), false, `${language}: 하나라도 남으면 그대로`);
    map = applyKnown(map, keys[keys.length - 1]!, true, NOW, true);
    assert.equal(skippedIds(language, map).has(script.id), true, `${language}: 모두면 건너뜀`);
    assert.deepEqual(confirmDue(map, NOW), [], "오늘 맞힌 것은 오늘 다시 안 물음");
    assert.equal(confirmDue(map, NOW + DAY_MS).length, keys.length);
  }
});

test("단계 미리 확인: 그 단계에서 아직 모르는 것만 12문제, 결과는 틀린 것을 다시 볼 것에 안 넣음(태국어·프랑스어)", () => {
  for (const language of ["th", "fr"]) {
    const all = stageKeys(language, 1);
    const known = Object.fromEntries(all.slice(0, 5).map((key) => [key, { days: [1], at: 1 }]));
    const items = buildEntryCheck({ language, stage: 1, known, now: NOW });
    assert.ok(items.length > 0 && items.length <= 12, `${language} ${items.length}`);
    assert.ok(items.every((item) => !known[item.key] && all.includes(item.key)));
    assert.ok(items.filter((item) => item.question.kind === "say").length <= 3);
    const result = entryCheckResult(items, items.map((_, i) => i % 2 === 0), 1, NOW);
    assert.equal(result.kind, "entry");
    assert.deepEqual(result.wrong, []);
    assert.equal(entryDue([], 1, items), true);
    assert.equal(entryDue([result], 1, items), false);
    assert.equal(entryDue([{ ...result, kind: "placement" }], 1, items), false, "그 단계에서 시작한 처음 시험이 있으면 안 함");
  }
});

test("확인 중 열쇠가 계속 공부(다시 볼 것 다음)·이번 주 확인(맨 앞)에 나옴", () => {
  const language = "en";
  const script = allScriptsFor(language).find((one) => one.stage === 1)!;
  const confirm = reviewKeysOf(language, script.id).slice(0, 2);
  const queue = nextStudy({ language, stage: 1, passed: new Set(), review: {}, log: {}, weakest: null, confirm, now: NOW });
  assert.deepEqual(queue.slice(0, 2).map((pick) => [pick.key, pick.reason]), confirm.map((key) => [key, "confirm"]));
  const passed = new Set(allScriptsFor(language).filter((one) => one.stage === 1).slice(0, 3).map((one) => one.id));
  const weekly = buildCheckup({ language, stage: 1, passed, review: {}, log: {}, now: NOW, confirm });
  assert.ok(confirm.every((key) => weekly.some((item) => item.key === key)));
});

test("서버: 큰 시험의 맞힌 문제 → 확인 중, 이번 주 확인은 있는 것만, 퀴즈 답(quiz)만 늘림·헷갈려요는 지움", async () => {
  const { saveCheckup, saveChecks, readKnown } = await import("../server/stageScriptStore.ts");
  const user = "rc:known-test";
  await saveCheckup(user, "es", { at: NOW, stage: 1, parts: { vocab: [1, 2] }, origins: {}, wrong: [], kind: "entry" }, NOW, [["e|gracias", true], ["e|hola", false]]);
  assert.deepEqual(Object.keys(await readKnown(user, "es")), ["e|gracias"]);
  await saveCheckup(user, "es", { at: NOW, stage: 1, parts: { vocab: [1, 1] }, origins: {}, wrong: [] }, NOW + DAY_MS, [["e|vale", true], ["e|gracias", true]]);
  const after = await readKnown(user, "es");
  assert.deepEqual(Object.keys(after), ["e|gracias"]);
  assert.equal(after["e|gracias"]!.days.length, 2);
  await saveChecks(user, "es", { "e|gracias": true }, NOW + 2 * DAY_MS, false);
  assert.equal((await readKnown(user, "es"))["e|gracias"]!.days.length, 2, "알아요는 안 셈");
  await saveChecks(user, "es", { "e|gracias": true }, NOW + 2 * DAY_MS, true);
  assert.equal(knownState(await readKnown(user, "es"), "e|gracias"), "known");
  await saveChecks(user, "es", { "e|gracias": false }, NOW + 3 * DAY_MS, false);
  assert.equal(knownState(await readKnown(user, "es"), "e|gracias"), null);
});
