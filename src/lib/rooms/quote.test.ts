import { test } from "node:test";
import assert from "node:assert/strict";
import { SUPPORTED_LEARNING_LANGUAGES as LEARNING_LANGUAGES } from "../learningLanguages.ts";
import { askPhrase, clipQuote, questionCount } from "./quote.ts";

test("묻는 문장은 14개 학습 언어마다 있고, 모르는 언어는 영어", () => {
  for (const language of LEARNING_LANGUAGES) assert.ok(askPhrase(language.code).length > 3, language.code);
  assert.equal(askPhrase("ja"), "これ、どういう意味ですか？");
  assert.equal(askPhrase("xx"), askPhrase("en"));
});

test("인용 자르기는 글자 단위: 태국어·힌디어 모음 기호를 떼지 않고, 띄어쓰기 없는 일본어도", () => {
  for (const text of ["ไม่เป็นไรครับ".repeat(20), "नमस्ते दोस्तों, कैसे हो?".repeat(5)]) {
    const clipped = clipQuote(text, 7);
    assert.ok(clipped.endsWith("…"));
    const kept = clipped.slice(0, -1);
    assert.ok(text.startsWith(kept));
    // 잘린 바로 다음 글자가 결합 기호면 기호를 떼어 버린 것.
    assert.ok(!/^\p{M}/u.test(text.slice(kept.length)), text.slice(0, 12));
  }
  assert.equal(clipQuote("今日は  いい天気\nですね", 100), "今日は いい天気 ですね");
  assert.equal(clipQuote("¿Qué tal estás?", 4), "¿Qué…");
});

test("질문 수는 묻기(ask)만, 같은 줄(통화 기록이면 같은 index)만 센다", () => {
  const rows = [
    { quote: { seq: 3, nickname: "Yuki", text: "まじで" }, ask: true },
    { quote: { seq: 3, nickname: "Yuki", text: "まじで" }, ask: false },
    { quote: { seq: 3, index: 1, nickname: "Yuki", text: "やばい" }, ask: true },
    { quote: { seq: 3, nickname: "Yuki", text: "部屋の言葉", roomId: "abcdef" }, ask: true },
    {},
  ];
  assert.equal(questionCount(rows, 3), 1);
  assert.equal(questionCount(rows, 3, 1), 1);
  assert.equal(questionCount(rows, 4), 0);
});
