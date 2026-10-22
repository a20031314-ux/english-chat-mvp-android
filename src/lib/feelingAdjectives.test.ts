import assert from "node:assert/strict";
import test from "node:test";
import { explainFeelingSlips, FEELING_EXPLAIN_LANGUAGES, promoteFeelingSlip } from "./feelingAdjectives.ts";

test("사람이 주어인 -ing를 natural이 -ed로 바꿨으면 corrected도", () => {
  const out = promoteFeelingSlip("I am so boring today, nothing to do", "I'm so bored today, there's nothing to do");
  assert.equal(out?.corrected, "I am so bored today, nothing to do");
  assert.deepEqual(out?.slips, [{ from: "boring", to: "bored" }]);
  assert.equal(promoteFeelingSlip("I'm really interesting in music.", "I'm really interested in music.")?.corrected, "I'm really interested in music.");
  assert.equal(promoteFeelingSlip("We were very exciting!", "We were super excited!")?.corrected, "We were very excited!");
});

test("것이 주어인 -ed를 natural이 -ing로 바꿨으면 corrected도", () => {
  assert.equal(
    promoteFeelingSlip("The class was ok but it was so bored.", "The class was okay, but it was so boring.")?.corrected,
    "The class was ok but it was so boring.",
  );
});

test("natural이 바꾸지 않았거나 자리가 다르면 그대로", () => {
  // 모델이 '지루한 사람'으로 읽어 natural도 그대로 — 손대지 않는다.
  assert.equal(promoteFeelingSlip("I am so boring", "I'm so boring, haha"), null);
  // natural이 다른 문장으로 다시 쓴 것 — 주어가 사물이라 -ing가 맞다.
  assert.equal(promoteFeelingSlip("That movie is boring.", "I got bored watching that movie."), null);
  // 이미 맞음
  assert.equal(promoteFeelingSlip("I'm bored.", "I'm so bored."), null);
  assert.equal(promoteFeelingSlip("", "I'm bored."), null);
});

test("대문자로 시작한 낱말은 대문자로", () => {
  assert.equal(promoteFeelingSlip("I feel Tiring.", "I feel tired.")?.corrected, "I feel Tired.");
});

test("설명은 14개 앱 언어, 영어 낱말을 그대로 넣는다", () => {
  assert.equal(FEELING_EXPLAIN_LANGUAGES.length, 14);
  for (const ui of FEELING_EXPLAIN_LANGUAGES) {
    const text = explainFeelingSlips([{ from: "boring", to: "bored" }], ui);
    assert.match(text, /'boring'/, ui);
    assert.match(text, /'bored'/, ui);
  }
  assert.match(explainFeelingSlips([{ from: "boring", to: "bored" }], "ko"), /내가 그렇게 느낄 때는 'bored' 꼴을/);
  assert.match(explainFeelingSlips([{ from: "bored", to: "boring" }], "ja"), /感じさせるもの/);
  assert.doesNotMatch(explainFeelingSlips([{ from: "boring", to: "bored" }], "ko"), /'[a-z]+'(는|은|를|을|이|가)/);
  // 모르는 앱 언어는 영어
  assert.match(explainFeelingSlips([{ from: "boring", to: "bored" }], "xx"), /person who feels/);
});
