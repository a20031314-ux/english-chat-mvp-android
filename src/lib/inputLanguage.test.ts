import assert from "node:assert/strict";
import { test } from "node:test";
import { resolveChatInputMode, writtenInLearningLanguage } from "./inputLanguage.ts";

const both = (learningLanguage: string, interfaceLanguage: string) => ({
  chatEnabled: true,
  askExpressionEnabled: true,
  learningLanguage,
  interfaceLanguage,
});

test("English app, learning Spanish: English is a question, Spanish is practice", () => {
  assert.equal(resolveChatInputMode("How do I say I missed the bus?", both("es", "en")), "how_to_say");
  assert.equal(resolveChatInputMode("I want to order a coffee", both("es", "en")), "how_to_say");
  assert.equal(resolveChatInputMode("Ayer yo voy al museo con mi hermana", both("es", "en")), "chat");
  assert.equal(resolveChatInputMode("¿Dónde está la estación?", both("es", "en")), "chat");
});

test("Korean app, learning English keeps working the way it did", () => {
  assert.equal(resolveChatInputMode("Yesterday I go to the museum", both("en", "ko")), "chat");
  assert.equal(resolveChatInputMode("I went to 강남 yesterday.", both("en", "ko")), "chat");
  assert.equal(resolveChatInputMode("버스 놓쳤다고 어떻게 말해?", both("en", "ko")), "how_to_say");
  assert.equal(resolveChatInputMode("열람실 영어로 뭐야", both("en", "ko")), "how_to_say");
});

test("Other pairs decide by script or by words", () => {
  assert.equal(resolveChatInputMode("昨日は映画を見ました", both("ja", "en")), "chat");
  assert.equal(resolveChatInputMode("What is the word for umbrella?", both("ja", "en")), "how_to_say");
  assert.equal(resolveChatInputMode("मैं कल बाज़ार गया", both("en", "hi")), "how_to_say");
  assert.equal(resolveChatInputMode("Je suis allé au cinéma hier", both("fr", "es")), "chat");
  assert.equal(resolveChatInputMode("Quiero decir que estoy cansado", both("fr", "es")), "how_to_say");
  assert.equal(resolveChatInputMode("我昨天去了商店", both("zh", "ja")), "chat");
  assert.equal(resolveChatInputMode("昨日お店に行きました", both("zh", "ja")), "how_to_say");
});

test("A single mode switched on is obeyed regardless of language", () => {
  const onlyChat = { ...both("es", "en"), askExpressionEnabled: false };
  const onlyAsk = { ...both("es", "en"), chatEnabled: false };
  assert.equal(resolveChatInputMode("I want coffee", onlyChat), "chat");
  assert.equal(resolveChatInputMode("Quiero café", onlyAsk), "how_to_say");
});

test("Same language either side, or too short to tell, counts as practice", () => {
  assert.equal(writtenInLearningLanguage("hello", "en", "en"), true);
  assert.equal(writtenInLearningLanguage("ok", "es", "en"), true);
  assert.equal(writtenInLearningLanguage("", "es", "en"), true);
});

test("French and Spanish share é; a French reply still reads as French", () => {
  assert.equal(writtenInLearningLanguage("Ah génial ! T'as vu quoi, au musée ?", "fr", "es"), true);
});
