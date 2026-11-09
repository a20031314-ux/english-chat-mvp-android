import { test } from "node:test";
import assert from "node:assert/strict";
import { callLines, chatLines, commonWords, shareable } from "./talkQuiz.ts";
test("채팅 기록: 내 줄은 틀렸으면 고친 꼴로(fixed), 튜터 줄은 그대로, 내 말로 쓴 줄·표현 묻기는 뺌", () => {
  const lines = chatLines({
    messages: [
      { role: "user", content: "I go to school yesterday." },
      { role: "assistant", content: JSON.stringify({ assistantMessage: "Oh nice! **How about you**, did you like it?", correctionResult: { corrected: "I went to school yesterday.", hasError: true } }) },
      { role: "user", content: "어떻게 말해?" },
      { role: "assistant", content: JSON.stringify({ assistantMessage: "You can say it like this.", ownLanguage: true }) },
      { role: "assistant", content: JSON.stringify({ assistantMessage: "x", fromHowToSay: true }) },
    ],
  });
  assert.deepEqual(lines, [
    { who: "me", text: "I went to school yesterday.", fixed: true },
    { who: "them", text: "Oh nice! How about you, did you like it?" },
    { who: "them", text: "You can say it like this." },
  ]);
});

test("통화 기록: 튜터 줄은 번역을 뜻으로, 내 줄은 더 나은 꼴이 있으면 그것으로", () => {
  const lines = callLines({ said: [{ who: "tutor", text: "¿Qué quieres tomar?", translation: "뭐 마실래?" }, { who: "learner", text: "Quiero un café", better: "Quiero un café, por favor." }] });
  assert.deepEqual(lines, [
    { who: "them", text: "¿Qué quieres tomar?", gloss: "뭐 마실래?" },
    { who: "me", text: "Quiero un café, por favor.", fixed: true },
  ]);
});

test("모두에게 보낼 튜터 줄: 흔한 낱말만, 숫자·이름·내 줄은 안 됨", () => {
  const known = new Set(["how", "about", "you", "are", "tired", "now", "i", "see", "my", "name", "is", "in"]);
  assert.equal(shareable("en", { who: "them", text: "I see. How about you, are you tired now?" }, known), true);
  assert.equal(shareable("en", { who: "them", text: "How about you, Minji, are you tired now?" }, known), false);
  assert.equal(shareable("en", { who: "them", text: "Are you tired at 9 now?" }, known), false);
  assert.equal(shareable("en", { who: "me", text: "I see. How about you, are you tired now?" }, known), false);
  assert.equal(shareable("en", { who: "them", text: "How about you, are you tired now?" }, known, new Set(["tired"])), false);
  // 띄어쓰기 없는 말: 이름 뒤 존칭이 붙은 줄은 낱말 목록을 통과해도 뺌.
  const ja = new Set(["田中", "さん", "は", "東京", "に", "住ん", "で", "います", "すみません", "わかりません"]);
  assert.equal(shareable("ja", { who: "them", text: "田中さんは東京に住んでいます。" }, ja), false);
});

test("흔한 낱말 모음: 빈도 목록 + 앱 대본에 소문자로 나온 꼴(활용형) — 대본 속 이름은 안 들어감", () => {
  const words = commonWords("en", ["be", "do"]);
  assert.ok(words.has("are") && words.has("did"));
  assert.ok(!words.has("daniel") && !words.has("ana"));
});
