import { test } from "node:test";
import assert from "node:assert/strict";
import { maskAnswers } from "./lessonTitle.ts";

test("수업 제목 답 가리기: 가나는 글자째, 라틴은 낱말 경계만 — ja·es·en", () => {
  assert.equal(maskAnswers("A は B です (A는 B입니다)", ["は"]), "A ＿ B です (A는 B입니다)");
  assert.equal(maskAnswers("Articles and more", ["a"]), "Articles and more", "낱말 속 a는 그대로");
  assert.equal(maskAnswers("현재완료", ["have been"]), "현재완료");
});

test("제목이 보기 목록이면 목록 칸을 모두 가림 — 하나만 가리면 빠진 것이 답(ja·en·es, 체감 점검 2026-11-27)", () => {
  assert.equal(maskAnswers("これ・それ・あれ・どれ", ["それ"]), "＿・＿・＿・＿");
  assert.equal(maskAnswers("much / many / any / a few", ["any"]), "＿ / ＿ / ＿ / ＿");
  assert.equal(maskAnswers("Articles a / an", ["a"]), "Articles ＿ / ＿");
  assert.equal(maskAnswers("ser y estar (Soy / Estoy)", ["estoy"]), "ser y estar (＿ / ＿)");
  assert.equal(maskAnswers("A は B です (A는 B입니다)", ["は"]), "A ＿ B です (A는 B입니다)", "목록이 아니면 그대로");
});
