import assert from "node:assert/strict";
import test from "node:test";
import { heardOrNothing, looksLikeLanguage } from "./transcript.ts";

test("the invented Japanese over an English turn is thrown away", () => {
  // Reported from a real turn: the learner said "hi" to an English scene and
  // the transcript came back as a Japanese stock phrase — the hallucination
  // these models produce when handed almost no audio.
  assert.equal(looksLikeLanguage("ご視聴ありがとうございました", "en"), false);
  assert.equal(heardOrNothing("ご視聴ありがとうございました", "en"), "");
});

test("what they actually said is kept", () => {
  assert.equal(heardOrNothing("  Large, please.  ", "en"), "Large, please.");
  assert.equal(looksLikeLanguage("안녕하세요", "ko"), true);
  assert.equal(looksLikeLanguage("こんにちは", "ja"), true);
  assert.equal(looksLikeLanguage("Здравствуйте", "ru"), true);
  assert.equal(looksLikeLanguage("สวัสดี", "th"), true);
  assert.equal(looksLikeLanguage("नमस्ते", "hi"), true);
  assert.equal(looksLikeLanguage("مرحبا", "ar"), true);
});

test("a borrowed word does not cost someone their turn", () => {
  // Rejecting on a single stray character would throw away real speech: people
  // say names, brands and words from their own language mid-sentence.
  assert.equal(looksLikeLanguage("I went to 강남 yesterday", "en"), true);
  assert.equal(looksLikeLanguage("Can I get a latte, 부탁해요?", "en"), true);
});

test("punctuation and numbers decide nothing either way", () => {
  assert.equal(looksLikeLanguage("...", "en"), true, "no letters is not a wrong script");
  assert.equal(looksLikeLanguage("4.50", "en"), true);
  assert.equal(heardOrNothing("   ", "en"), "");
});

test("Japanese may be written in the Latin alphabet, and Chinese characters are its own", () => {
  // The kana check has to take Han too, or every kanji-heavy answer would be
  // read as a hallucination in a Japanese scene.
  assert.equal(looksLikeLanguage("今日は寒いですね", "ja"), true);
  assert.equal(looksLikeLanguage("今天很冷", "zh"), true);
});

test("a language with no script written down is left alone", () => {
  // Better to pass a turn through than to refuse one over a table entry nobody
  // has filled in yet.
  assert.equal(looksLikeLanguage("anything at all", "xx"), true);
});
