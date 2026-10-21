import test from "node:test";
import assert from "node:assert/strict";
import { compareTranscripts, comparableWords, touchesDisputed } from "./agreement.ts";

test("문장부호·대소문자만 다르면 일치", () => {
  assert.equal(compareTranscripts("Yesterday I go to the park.", "yesterday, I go to the park").kind, "match");
  assert.equal(compareTranscripts("Ayer yo va al parque.", "ayer yo va al parque").kind, "match");
});

test("학습자 실수는 두 모델이 같게 적으면 일치 그대로", () => {
  assert.equal(compareTranscripts("음식이 좋아해요", "음식이 좋아해요.").kind, "match");
});

test("낱말 하나만 다르면 구조 일치, 다른 낱말은 disputed", () => {
  const result = compareTranscripts(
    "I went to the store and bought some apples yesterday",
    "I went to the store and bought some apple yesterday",
  );
  assert.equal(result.kind, "structure");
  assert.deepEqual(result.disputed, ["apples"]);
});

test("한국어: 붙은 조사째 한 낱말로", () => {
  const result = compareTranscripts("저는 어제 친구랑 영화를 보고 정말 좋아해요", "저는 어제 친구랑 영화를 보고 정말 좋아돼요");
  assert.equal(result.kind, "structure");
  assert.deepEqual(result.disputed, ["좋아해요"]);
});

test("일본어(띄어쓰기 없음)도 낱말로 잘라 비교", () => {
  const words = comparableWords("昨日公園に行きました。", "ja");
  assert.ok(words.length >= 3, `낱말로 잘려야 함: ${words.join("|")}`);
  assert.equal(compareTranscripts("昨日公園に行きました。", "昨日、公園に行きました", "ja").kind, "match");
  const near = compareTranscripts("昨日は友達と一緒に公園に行って本当に楽しかったです", "昨日は友達と一緒に応援に行って本当に楽しかったです", "ja");
  assert.equal(near.kind, "structure");
  assert.ok(near.disputed.includes("公園"));
});

test("타이 문자: 모음 부호를 지우지 않는다", () => {
  const words = comparableWords("พรุ่งนี้ฉันจะไปตลาด", "th");
  assert.ok(words.join("").includes("พรุ่ง"));
});

test("구조가 다르면 differ", () => {
  assert.equal(compareTranscripts("오늘 날씨가 좋네요", "우내위 다이시").kind, "differ");
  assert.equal(compareTranscripts("I like it", "I liked it").kind, "differ"); // 짧은 줄은 하나만 달라도
  assert.equal(compareTranscripts("It was the only hit of the contest", "They only hit of they contest").kind, "differ");
  assert.equal(compareTranscripts("hello", "").kind, "differ");
});

test("고친 문장이 다르게 들은 낱말을 바꾸면 touchesDisputed", () => {
  assert.equal(touchesDisputed("I bought some apples yesterday.", ["apples"]), false);
  assert.equal(touchesDisputed("I bought an apple yesterday.", ["apples"]), true);
  assert.equal(touchesDisputed("anything", []), false);
});
