import assert from "node:assert/strict";
import { test } from "node:test";
import { splitAnswerForSpeech } from "./answerSpeech.ts";

const spoken = (answer: string, learning: string, ui: string) =>
  splitAnswerForSpeech(answer, learning, ui)
    .filter((part) => part.speak)
    .map((part) => part.speak);

test("Japanese examples in a Korean answer get a speaker; Korean glosses do not", () => {
  const answer =
    "여기서 \"例えば、\"는 '예를 들어'라는 뜻입니다. 예를 들어, \"たとえば、アニメを見たりするのも楽しいよ\"는 친구와의 대화에서 자연스럽고, \"例として、アニメを見たりすることが挙げられます\"는 발표에서 적절합니다.";
  assert.deepEqual(spoken(answer, "ja", "ko"), [
    "例えば、",
    "たとえば、アニメを見たりするのも楽しいよ",
    "例として、アニメを見たりすることが挙げられます",
  ]);
});

test("The parts put back together are the answer, unchanged", () => {
  const answer = "\"たとえば\"(부드러운 느낌)나 \"例として\" 등이 있습니다. '예를 들어'라고 생각하세요.";
  const parts = splitAnswerForSpeech(answer, "ja", "ko");
  assert.equal(parts.map((part) => part.text).join(""), answer);
});

test("Japanese brackets and curly quotes count as quotes", () => {
  assert.deepEqual(spoken("「楽しいよ」와 “楽しいです”의 차이", "ja", "ko"), ["楽しいよ", "楽しいです"]);
});

test("Thai, a spaceless script, keeps its vowel signs", () => {
  assert.deepEqual(spoken("\"ไปไหนมา\" means where have you been", "th", "en"), ["ไปไหนมา"]);
});

test("Same script: a Spanish example in an English answer is spoken, an English gloss is not", () => {
  const answer = "Here \"¿Dónde está la estación?\" is the polite form, and 'where is it' is the plain meaning.";
  assert.deepEqual(spoken(answer, "es", "en"), ["¿Dónde está la estación?"]);
});

test("Apostrophes inside words are not quotes", () => {
  const answer = "It's casual: 'I'm gonna head out' sounds natural, don't you think?";
  assert.deepEqual(spoken(answer, "en", "ko"), ["I'm gonna head out"]);
});

test("An unclosed quote is left as text", () => {
  const answer = "\"たとえば 로 시작하면";
  assert.deepEqual(splitAnswerForSpeech(answer, "ja", "ko"), [{ text: answer }]);
});
