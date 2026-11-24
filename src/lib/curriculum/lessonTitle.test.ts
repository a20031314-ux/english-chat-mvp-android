import { test } from "node:test";
import assert from "node:assert/strict";
import { maskAnswers } from "./lessonTitle.ts";

test("수업 제목 답 가리기: 가나는 글자째, 라틴은 낱말 경계만 — ja·es·en", () => {
  assert.equal(maskAnswers("A は B です (A는 B입니다)", ["は"]), "A ＿ B です (A는 B입니다)");
  assert.equal(maskAnswers("ser y estar (Soy / Estoy)", ["estoy"]), "ser y estar (Soy / ＿)");
  assert.equal(maskAnswers("Articles a / an", ["a"]), "Articles ＿ / an", "낱말 속 a는 그대로");
  assert.equal(maskAnswers("현재완료", ["have been"]), "현재완료");
});
