import assert from "node:assert/strict";
import test from "node:test";
import { heardInAny, heardOrNothing, looksLikeLanguage } from "./transcript.ts";

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

test("a learner reaching for a word in their own language is still talking", () => {
  // Reported from a phone: "How can I say 전기공학 in English?" was heard
  // perfectly and answered well, and the reply to that answer was thrown away.
  // The app then saw silence, and the character replied to somebody who had
  // said nothing — one turn after answering the question that prompted it.
  //
  // Which is the worst turn to lose. Reaching for a word you do not have yet
  // in the language you are learning is the moment this app exists for.
  for (const said of [
    "How can I say 전기공학 in English?",
    "It's 전기공학.",
    "Ah, 전기공학이요.",
    "전기공학 is my major.",
    "I studied 전기공학 for four years at university.",
  ]) {
    assert.equal(heardOrNothing(said, "en"), said, `${said} was thrown away`);
  }
});

test("an answer with none of the language in it is still refused", () => {
  // What the check is for: a model handed half a second of room noise fills the
  // gap with something it has heard often, and those come back with not one
  // letter of the language being learned.
  assert.equal(heardOrNothing("ご視聴ありがとうございました。", "en"), "");
  assert.equal(heardOrNothing("字幕は自動生成されました", "en"), "");
  assert.equal(heardOrNothing("Thank you for watching!", "ko"), "");
});

test("punctuation and numbers decide nothing", () => {
  assert.ok(looksLikeLanguage("2026!", "en"));
  assert.ok(looksLikeLanguage("…", "ko"));
});

test("방(언어 둘): 둘 중 하나의 글자면 믿고, 아니면 버린다", () => {
  assert.equal(heardInAny("ハイハイ", ["en", "ko"]), "");
  assert.equal(heardInAny("Hi hi!", ["en", "ko"]), "Hi hi!");
  assert.equal(heardInAny("안녕하세요", ["en", "ko"]), "안녕하세요");
  assert.equal(heardInAny("はい、そうです", ["ja", "es"]), "はい、そうです");
  assert.equal(heardInAny("Sí, claro", ["ja", "es"]), "Sí, claro");
  assert.equal(heardInAny("สวัสดีครับ", ["th", "ko"]), "สวัสดีครับ");
  assert.equal(heardInAny("Привет", ["th", "ko"]), "");
  assert.equal(heardInAny("anything", []), "anything");
  assert.equal(heardInAny("  ", ["en"]), "");
});

test("자유 대화방 줄의 언어: 글자로 가를 수 있을 때만", async () => {
  const { whichLanguage } = await import("./transcript.ts");
  assert.equal(whichLanguage("こんにちは、元気？", ["ja", "ko"]), "ja");
  assert.equal(whichLanguage("안녕하세요 반가워요", ["ja", "ko"]), "ko");
  assert.equal(whichLanguage("สวัสดีครับ", ["th", "en"]), "th");
  assert.equal(whichLanguage("مرحبا كيف حالك", ["es", "ar"]), "ar");
  // 같은 글자를 쓰는 두 언어(스페인어·영어)는 가르지 않는다.
  assert.equal(whichLanguage("¿Qué tal? Muy bien", ["es", "en"]), null);
  // 반반 섞이면 정하지 않는다. 글자가 없으면 없음.
  assert.equal(whichLanguage("ok 네네", ["en", "ko"]), null);
  assert.equal(whichLanguage("123 !!", ["ja", "ko"]), null);
});

test("말하는 방 힌트: 편한 말이 든 줄만(글자가 다른 두 언어일 때)", async () => {
  const { leansOnOwnLanguage } = await import("./transcript.ts");
  assert.equal(leansOnOwnLanguage("어.. 스물둘..", "en", "ko"), true);
  assert.equal(leansOnOwnLanguage("I'm 스물둘", "en", "ko"), true);
  assert.equal(leansOnOwnLanguage("I'm twenty-two.", "en", "ko"), false);
  assert.equal(leansOnOwnLanguage("えっと、にじゅうに", "es", "ja"), true);
  assert.equal(leansOnOwnLanguage("ฉันอายุยี่สิบสอง", "en", "th"), true);
  // 스페인어를 배우는 영어 사용자: 같은 글자라 판단하지 않는다.
  assert.equal(leansOnOwnLanguage("I am twenty two", "es", "en"), false);
  // 일본어를 배우는 중국어 사용자: 한자만으로는 못 가른다.
  assert.equal(leansOnOwnLanguage("二十二", "ja", "zh"), false);
});
