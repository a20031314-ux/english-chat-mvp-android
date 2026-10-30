import { test } from "node:test";
import assert from "node:assert/strict";
import { contentScope } from "./contentScope.ts";

test("배울 수 있는 것: 단계 다섯, 문법·표현·상황이 있고 낱말은 받은 수 + 확장", () => {
  for (const language of ["ja", "th", "es", "ar"]) {
    const scope = contentScope(language, { 1: 700, 2: 800, 6: 50 });
    assert.equal(scope.stages.length, 5, language);
    assert.ok(scope.stages.every((row) => row.grammar > 0 && row.expressions > 0 && row.scenes > 0), language);
    assert.ok(scope.stages.slice(0, 3).every((row) => row.frames > 0), `${language} frames 1~3`);
    assert.equal(scope.total.words, 1550, language);
    assert.equal(scope.total.grammar, scope.stages.reduce((sum, row) => sum + row.grammar, 0));
  }
  assert.equal(contentScope("en").total.words, 0);
});
