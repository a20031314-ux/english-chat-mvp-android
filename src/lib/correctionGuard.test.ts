import assert from "node:assert/strict";
import test from "node:test";
import { shouldKeepLearnerLine } from "./correctionGuard.ts";

test("문장부호·이모지만 보낸 줄은 고치지 않는다", () => {
  assert.equal(shouldKeepLearnerLine("?", "Hey! What have you been up to lately?"), true);
  assert.equal(shouldKeepLearnerLine("😂😂👍🔥", "Looks like you're pumped!"), true);
});

test("마침표·대소문자만 다르면 고친 게 아니다", () => {
  assert.equal(shouldKeepLearnerLine("yes", "Yes."), true);
  assert.equal(shouldKeepLearnerLine("그래요", "그래요."), true);
  assert.equal(shouldKeepLearnerLine("ok", "OK!"), true);
});

test("짧은 답을 문장으로 늘리지 않는다", () => {
  assert.equal(shouldKeepLearnerLine("음…", "응, 나 요즘 그냥 바빠. 너는?"), true);
  assert.equal(shouldKeepLearnerLine("hmm", "I'm not sure what to say right now."), true);
});

test("진짜 고침은 남긴다", () => {
  assert.equal(shouldKeepLearnerLine("날씨가 너무 덥어요.", "날씨가 너무 더워요."), false);
  assert.equal(shouldKeepLearnerLine("저는 커피을 마셔요.", "저는 커피를 마셔요."), false);
  assert.equal(shouldKeepLearnerLine("I went to there last weekend.", "I went there last weekend."), false);
  assert.equal(shouldKeepLearnerLine("별로요", "별로예요"), false);
  assert.equal(shouldKeepLearnerLine("idk", "I don't know"), false);
});

test("한국어 띄어쓰기 고침은 남긴다", () => {
  assert.equal(shouldKeepLearnerLine("저는학생이에요", "저는 학생이에요"), false);
});

test("태국어·아랍어도 글자로 본다", () => {
  assert.equal(shouldKeepLearnerLine("ไม่รู้", "ไม่รู้ครับ"), false);
  assert.equal(shouldKeepLearnerLine("نعم", "نعم."), true);
});
