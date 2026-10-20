import { test } from "node:test";
import assert from "node:assert/strict";
import { SUPPORTED_LEARNING_LANGUAGES as LEARNING_LANGUAGES } from "../learningLanguages.ts";
import { askPhrase, askPhraseAbout, cleanFocus, clipQuote, focusOf, pickTokens, questionCount } from "./quote.ts";

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

test("고른 부분 질문: 14개 언어마다 {x} 자리에 그 부분, 없으면 줄 전체 질문", () => {
  for (const language of LEARNING_LANGUAGES) {
    const asked = askPhraseAbout(language.code, "binge-watch");
    assert.ok(asked.includes("binge-watch") && !asked.includes("{x}"), language.code);
  }
  assert.equal(askPhraseAbout("ja", ""), askPhrase("ja"));
  assert.equal(askPhraseAbout("es", "a lo mejor"), "¿Qué significa «a lo mejor»?");
});

test("낱말 고르기: 문장부호는 떼고, 띄어쓰기 없는 일본어·태국어도 낱말로, 구절은 원래 글 그대로", () => {
  const en = "Sounds fun. I'm gonna crash at home and binge-watch a drama.";
  const tokens = pickTokens(en, "en");
  assert.deepEqual(tokens.slice(0, 2).map((t) => t.word), ["Sounds", "fun"]);
  const crash = tokens.findIndex((t) => t.word === "crash");
  assert.equal(focusOf(en, tokens, crash, crash + 2), "crash at home");
  assert.equal(tokens.at(-1)?.word, "drama");

  const ja = "週末は友だちと映画を見に行きます。";
  const jaTokens = pickTokens(ja, "ja");
  assert.ok(jaTokens.length >= 4, JSON.stringify(jaTokens));
  assert.ok(jaTokens.every((t) => ja.slice(t.start, t.end) === t.word));

  const th = "พรุ่งนี้ไปเที่ยวทะเลกัน";
  const thTokens = pickTokens(th, "th");
  assert.ok(thTokens.length >= 3);
  // 태국어 모음 기호가 낱말에서 떨어지지 않는다.
  assert.equal(thTokens.map((t) => t.word).join(""), th);

  const es = "¿Vamos a la playa mañana? ¡A lo mejor!";
  const esTokens = pickTokens(es, "es");
  assert.equal(esTokens[0].word, "Vamos");
  const lo = esTokens.findIndex((t) => t.word === "lo");
  assert.equal(focusOf(es, esTokens, lo - 1, lo + 1), "A lo mejor");
});

test("서버: 고른 부분은 인용 글 안에 있을 때만, 줄 전체·너무 긴 것·없는 말은 버림", () => {
  const quote = "Sounds fun. I'm gonna crash at home and binge-watch a drama.";
  assert.equal(cleanFocus(quote, " binge-watch "), "binge-watch");
  assert.equal(cleanFocus(quote, "crash  at home"), "crash at home");
  assert.equal(cleanFocus(quote, "I hate you"), undefined);
  assert.equal(cleanFocus(quote, quote), undefined);
  assert.equal(cleanFocus(quote, "x".repeat(61)), undefined);
  assert.equal(cleanFocus(quote, 3), undefined);
  assert.equal(cleanFocus("週末は映画を見ます", "映画"), "映画");
});
