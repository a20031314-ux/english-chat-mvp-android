import { test } from "node:test";
import assert from "node:assert/strict";
import { multiBlankRight, spotsFixRight, spotsOf } from "./multiQuiz.ts";

const all = () => true;

test("복합 빈칸 채점: 악센트만 빠지면 맞음, 헷갈리는 오답 꼴은 틀림", () => {
  assert.equal(multiBlankRight({ key: "e|x", answer: "café" }, "cafe", "es"), "loose");
  assert.equal(multiBlankRight({ key: "e|x", answer: "está", near: ["estás"] }, "estás", "es"), false);
});

test("복합 틀린 곳: 틀린 곳마다 다른 낱말 자리, 바르게 고친 말을 치면 맞음·틀린 꼴 그대로면 틀림", () => {
  let found = 0;
  for (const language of ["es", "ar", "ko", "en"]) {
    const made = spotsOf(language, { stage: 3, seed: "t", learned: all });
    if (!made) continue;
    found += 1;
    const q = made.question;
    assert.ok(q.errors.length >= 2);
    assert.notEqual(q.text, q.right);
    const used = q.errors.flatMap((error) => error.bad);
    assert.equal(new Set(used).size, used.length, `${language} ${q.text}`);
    for (const error of q.errors) {
      assert.ok(spotsFixRight(error, error.want, language));
      assert.equal(spotsFixRight(error, error.near[0]!, language), false, `${language} ${error.near[0]} → ${error.want}`);
    }
  }
  assert.ok(found >= 3);
});
