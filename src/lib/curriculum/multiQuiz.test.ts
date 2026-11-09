import { test } from "node:test";
import assert from "node:assert/strict";
import { multiBlankRight } from "./multiQuiz.ts";
test("복합 빈칸 채점: 악센트만 빠지면 맞음, 헷갈리는 오답 꼴은 틀림", () => {
  assert.equal(multiBlankRight({ key: "e|x", answer: "café" }, "cafe", "es"), "loose");
  assert.equal(multiBlankRight({ key: "e|x", answer: "está", near: ["estás"] }, "estás", "es"), false);
});
