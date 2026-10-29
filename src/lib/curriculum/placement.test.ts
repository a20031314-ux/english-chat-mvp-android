import assert from "node:assert/strict";
import test from "node:test";
import {
  nextPlacementStage,
  PLACEMENT_BLOCK,
  PLACEMENT_SAY,
  placementBlock,
  placementResult,
  placementStart,
  stageKeys,
  type PlacementItem,
} from "./placement.ts";
import { cleanResult } from "./checkup.ts";

const has = (language: string) => (stage: number) => stageKeys(language, stage).length > 0;

/** 끝까지 풀어 본다: 아는 단계(known 이하)는 다 맞히고, 그 위는 다 틀림. */
function run(language: string, known: number) {
  const items: PlacementItem[] = [];
  const answers: boolean[] = [];
  let stage: number | null = 2;
  let extraDone = false;
  let guard = 0;
  while (stage !== null && guard++ < 10) {
    const block = placementBlock({ language, stage, used: new Set(items.map((i) => i.key)), says: items.filter((i) => i.question.kind === "say").length, seed: "t" });
    if (!block.length) break;
    const extra = items.length > 0 && items.some((i) => i.stage === stage);
    if (extra) extraDone = true;
    for (const item of block) {
      items.push(item);
      answers.push(item.stage <= known);
    }
    const tallies = placementResult(items, answers).stages!;
    stage = nextPlacementStage({ last: stage, tallies, asked: items.length, extraDone, hasKeys: has(language) });
  }
  return { items, answers, result: placementResult(items, answers) };
}

test("처음 시험: 아는 만큼 단계가 정해진다(영어·스페인어·일본어·태국어)", () => {
  for (const language of ["en", "es", "ja", "th"]) {
    for (const [known, start] of [[0, 1], [1, 2], [2, 3], [3, 4], [5, 5]] as const) {
      const { items, result } = run(language, known);
      assert.equal(result.stage, start, `${language}: ${known}단계까지 알면 ${start}단계에서`);
      assert.ok(items.length >= 8 && items.length <= 24, `${language} ${known}: ${items.length}문제`);
      assert.equal(new Set(items.map((i) => i.key)).size, items.length, `${language}: 열쇠는 한 번씩`);
      assert.ok(items.filter((i) => i.question.kind === "say").length <= PLACEMENT_SAY, language);
    }
  }
});

test("묶음은 4문제, 넷째는 말하기(셋까지, 문법 열쇠면 고르기·순서)", () => {
  const block = placementBlock({ language: "en", stage: 2, used: new Set(), says: 0, seed: "x" });
  assert.equal(block.length, PLACEMENT_BLOCK);
  const fourth = block[PLACEMENT_BLOCK - 1]!;
  if (/^[fg]\|/.test(fourth.key)) assert.notEqual(fourth.question.kind, "say");
  else {
    assert.equal(fourth.question.kind, "say");
    assert.equal(fourth.part, "pronunciation");
  }
  const later = placementBlock({ language: "en", stage: 2, used: new Set(), says: PLACEMENT_SAY, seed: "x" });
  assert.ok(later.every((item) => item.question.kind !== "say"));
});

test("시작 단계: 막힌 가장 낮은 단계, 없으면 넘은 단계 + 1", () => {
  assert.equal(placementStart({ "2": [4, 4], "3": [1, 4] }), 3);
  assert.equal(placementStart({ "2": [1, 4], "1": [4, 4] }), 2);
  assert.equal(placementStart({ "2": [0, 4], "1": [1, 4] }), 1);
  assert.equal(placementStart({ "5": [4, 4] }), 5);
  assert.equal(placementStart({}), 1);
  // 말하기를 건너뛰어 3문제만 셌으면 3 중 2(67%)는 못 넘음.
  assert.equal(placementStart({ "2": [2, 3] }), 2);
});

test("결과: 틀린 것은 시작 단계보다 아래 것만, 서버가 다시 받아도 같은 모양", () => {
  const { result } = run("es", 2);
  assert.equal(result.kind, "placement");
  assert.equal(result.stage, 3);
  assert.deepEqual(result.wrong, []);
  const back = cleanResult(JSON.parse(JSON.stringify(result)), "es", result.at);
  assert.deepEqual(back, result);
});
