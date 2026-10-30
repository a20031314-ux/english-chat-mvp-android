import { test } from "node:test";
import assert from "node:assert/strict";
import { framesFor } from "./frames.ts";
import { fallbackTurns, lessonPassed } from "./frameLesson.ts";
import { recallFits } from "./recall.ts";

for (const language of ["ja", "es", "th"]) {
  test(`${language}: 서버 수업이 없을 때 대화는 틀 예문으로, 뜻은 앱 언어`, () => {
    const frame = framesFor(language, 1)[0]!;
    const turns = fallbackTurns(frame, "ko");
    assert.ok(turns.length >= 2);
    for (const turn of turns) {
      assert.ok(turn.meGloss && turn.meGloss !== turn.me);
      assert.ok(recallFits(language, turn.me, [frame]));
    }
  });
}

test("대화 통과: 차례를 모두 원문 안 보고 맞혀야", () => {
  assert.equal(lessonPassed([], 3), false);
  assert.equal(lessonPassed([{ good: true, revealed: false }, { good: true, revealed: false }], 3), false);
  assert.equal(lessonPassed([{ good: true, revealed: false }, { good: true, revealed: true }, { good: true, revealed: false }], 3), false);
  assert.equal(lessonPassed([{ good: true, revealed: false }, { good: false, revealed: false }, { good: true, revealed: false }], 3), false);
  assert.equal(lessonPassed([{ good: true, revealed: false }, { good: true, revealed: false }, { good: true, revealed: false }], 3), true);
});
