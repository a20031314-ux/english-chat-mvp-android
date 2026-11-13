import assert from "node:assert/strict";
import test from "node:test";
import { allFramesFor } from "../curriculum/frames.ts";
import { HOMEWORK_QUIZ_MAX, homeworkQuiz } from "./homeworkQuiz.ts";

test("수업 숙제: 다룬 틀마다 한 문제(떠올려 쓰기 먼저) + 다음 틀 예습 하나, 틀 열쇠는 결과용(ja·es·th)", () => {
  for (const language of ["ja", "es", "th"]) {
    const [a, b, c] = allFramesFor(language).filter((f) => f.stage === 1);
    const hw = homeworkQuiz(language, [], [], { covered: [`f|${a.id}`, `f|${b.id}`], next: `f|${c.id}` }, "call1");
    assert.equal(hw.questions.length, hw.keys.length);
    assert.deepEqual(hw.keys, [`f|${a.id}`, `f|${b.id}`, ""], language);
    assert.notEqual(hw.questions[0].kind, "choose", `${language}: 다룬 틀은 고르기 말고 쓰기·틀린 곳·순서`);
    assert.equal(hw.questions.at(-1)!.kind, "choose", `${language}: 예습은 알아보기(고르기)`);
    assert.ok(hw.questions.length <= HOMEWORK_QUIZ_MAX);
    // 같은 통화면 같은 숙제(다시 열어도 같은 문제)
    assert.deepEqual(homeworkQuiz(language, [], [], { covered: [`f|${a.id}`, `f|${b.id}`], next: `f|${c.id}` }, "call1"), hw);
  }
});

test("수업 기록이 없으면 지금 숙제 그대로(틀 문제 없음)", () => {
  const hw = homeworkQuiz("en", [], []);
  assert.deepEqual(hw, { questions: [], keys: [] });
  const [a] = allFramesFor("en").filter((f) => f.stage === 1);
  assert.deepEqual(homeworkQuiz("en", [], [], { covered: [], next: `f|${a.id}` }).keys, [""], "다룬 틀이 없어도 예습은");
});
