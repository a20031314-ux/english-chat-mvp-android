import { test } from "node:test";
import assert from "node:assert/strict";
import { skeletonTotals, toNextStage } from "./skeletonTotals.ts";
import { stageKeyMap } from "./myParts.ts";
import { allScriptsFor } from "../curriculum/stageScripts.ts";

const DAY = 86_400_000;

test("정해진 데이터 중 얼마나: 분모는 1~5단계 뼈대 전체, 분자는 이미 앎만, 배우는 중은 따로(일본어·스페인어)", () => {
  for (const language of ["ja", "es"]) {
    const empty = skeletonTotals(language, { known: {}, passed: new Set() });
    assert.ok(empty.parts.length >= 3, language);
    assert.ok(empty.parts.every((part) => part.known === 0 && part.learning === 0 && part.total > 0), language);
    const stageOne = [...stageKeyMap(language, 1).keys()];
    const total = empty.parts.filter((part) => part.id !== "pronunciation").reduce((sum, part) => sum + part.total, 0);
    assert.ok(total > stageOne.length, `${language}: 1단계보다 큼`);
    const [a, b] = stageOne;
    const known = { [a!]: { days: [1, 2, 3], at: 3 * DAY }, [b!]: { days: [1], at: DAY }, "u|algo raro": { days: [1, 2, 3], at: 3 * DAY } };
    const script = allScriptsFor(language).find((one) => one.stage === 1)!;
    const after = skeletonTotals(language, { known, passed: new Set([script.id]) });
    assert.equal(after.parts.reduce((sum, part) => sum + (part.id === "pronunciation" ? 0 : part.known), 0), 1, `${language}: 이미 앎 하나`);
    assert.ok(after.parts.reduce((sum, part) => sum + (part.id === "pronunciation" ? 0 : part.learning), 0) >= 1, `${language}: 배우는 중`);
    assert.deepEqual(after.outside, { known: 1, learning: 0 });
    assert.equal(after.parts.find((part) => part.id === "vocab")?.total, empty.parts.find((part) => part.id === "vocab")?.total, "분모는 그대로");
  }
});

test("다음 단계까지: 갈래마다 70%에 모자란 수(반 몫은 올림)", () => {
  assert.equal(toNextStage([{ done: 3.5, total: 10 }, { done: 7, total: 10 }, { done: 0, total: 0 }], 0.7), 4);
  assert.equal(toNextStage([{ done: 9, total: 10, measured: true }], 0.7), 0);
});
