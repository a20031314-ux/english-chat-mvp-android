import assert from "node:assert/strict";
import test from "node:test";
import { applyKnown, CHECK_DAYS, cleanKnown, confirmDue, knownState, skippedIds, type KnownMap } from "./known.ts";
import { DAY_MS, reviewKeysOf } from "./dailyPlan.ts";
import { allScriptsFor } from "./stageScripts.ts";
const NOW = Date.UTC(2026, 9, 29, 3);

test("한 번 맞히면 익힘, 잊을 때(1·3·7일 뒤)만 다시 묻고 그 뒤로는 안 물음, 틀리면 지움", () => {
  let map: KnownMap = {};
  map = applyKnown(map, "e|gracias", true, NOW);
  assert.equal(knownState(map, "e|gracias"), null, "만들지 않는 답(create 없음)은 그대로");
  map = applyKnown(map, "e|gracias", true, NOW, true);
  assert.equal(knownState(map, "e|gracias"), "known", "한 번 맞히면 익힘");
  map = applyKnown(map, "e|gracias", true, NOW + 1000);
  assert.equal(map["e|gracias"]!.days.length, 1, "같은 날은 한 번");
  assert.deepEqual(confirmDue(map, NOW), []);
  assert.deepEqual(confirmDue(map, NOW + DAY_MS), ["e|gracias"], "다음 날");
  map = applyKnown(map, "e|gracias", true, NOW + DAY_MS);
  assert.deepEqual(confirmDue(map, NOW + 2 * DAY_MS), [], "1일 뒤 맞히면 3일 쉼");
  assert.deepEqual(confirmDue(map, NOW + (1 + CHECK_DAYS[1]) * DAY_MS), ["e|gracias"]);
  map = applyKnown(map, "e|gracias", true, NOW + 4 * DAY_MS);
  map = applyKnown(map, "e|gracias", true, NOW + 11 * DAY_MS);
  assert.deepEqual(confirmDue(map, NOW + 60 * DAY_MS), [], "확인을 다 하면 더 안 물음");
  map = applyKnown(map, "e|gracias", false, NOW + 61 * DAY_MS);
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

test("서버: 시험·이번 주 확인·퀴즈에서 맞힌 것 → 익힘, 알아요는 안 셈, 틀리면 지움", async () => {
  const { saveCheckup, saveChecks, readKnown } = await import("../server/stageScriptStore.ts");
  const user = "rc:known-test";
  await saveCheckup(user, "es", { at: NOW, stage: 1, parts: { vocab: [1, 2] }, origins: {}, wrong: [], kind: "entry" }, NOW, [["e|gracias", true], ["e|hola", false]]);
  assert.deepEqual(Object.keys(await readKnown(user, "es")), ["e|gracias"]);
  await saveCheckup(user, "es", { at: NOW, stage: 1, parts: { vocab: [1, 1] }, origins: {}, wrong: [] }, NOW + DAY_MS, [["e|vale", true], ["e|gracias", true]]);
  const after = await readKnown(user, "es");
  assert.deepEqual(Object.keys(after).sort(), ["e|gracias", "e|vale"], "한 번 맞히면 익힘(이번 주 확인도)");
  assert.equal(after["e|gracias"]!.days.length, 2);
  await saveChecks(user, "es", { "e|gracias": true }, NOW + 2 * DAY_MS, false);
  assert.equal((await readKnown(user, "es"))["e|gracias"]!.days.length, 2, "알아요는 안 셈");
  await saveChecks(user, "es", { "e|gracias": true }, NOW + 2 * DAY_MS, true);
  assert.equal(knownState(await readKnown(user, "es"), "e|gracias"), "known");
  await saveChecks(user, "es", { "e|gracias": false }, NOW + 3 * DAY_MS, false);
  assert.equal(knownState(await readKnown(user, "es"), "e|gracias"), null);
});
