import assert from "node:assert/strict";
import test from "node:test";
import { confidenceOfLogprobs, confidenceOfWords, isUnsure } from "./speechConfidence.ts";

test("logprobs → 기하평균·최솟값", () => {
  const c = confidenceOfLogprobs([{ logprob: Math.log(0.9) }, { logprob: Math.log(0.4) }]);
  assert.equal(c.min, 0.4);
  assert.equal(c.mean, Math.round(Math.sqrt(0.9 * 0.4) * 1000) / 1000);
  assert.deepEqual(confidenceOfLogprobs(null), { mean: null, min: null });
});

test("낱말 확신도 → 평균·최솟값", () => {
  assert.deepEqual(confidenceOfWords([null]), { mean: null, min: null });
  assert.equal(confidenceOfWords([1, 0.25]).mean, 0.5);
});

test("모델마다 기준이 다르다, 모르면 표시하지 않는다", () => {
  assert.equal(isUnsure({ mean: 0.88, min: 0.5 }, "gpt-4o-mini-transcribe"), false);
  assert.equal(isUnsure({ mean: 0.88, min: 0.5 }, "gpt-transcribe"), true);
  assert.equal(isUnsure({ mean: 0.91, min: 0.5 }, "scribe_v2"), true);
  assert.equal(isUnsure({ mean: null, min: null }, "gpt-transcribe"), false);
  assert.equal(isUnsure({ mean: 0.5, min: null }, "unknown-model"), true);
});
