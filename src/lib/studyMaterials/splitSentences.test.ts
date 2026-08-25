import assert from "node:assert/strict";
import { test } from "node:test";
import {
  sentenceContainingSelection,
  splitSentences,
} from "./splitSentences.ts";

test("English chat replies split so one sentence is not the whole bubble", () => {
  const bubble = "Hey! What's up? How's your day?";
  assert.deepEqual(splitSentences(bubble), [
    "Hey!",
    "What's up?",
    "How's your day?",
  ]);
  assert.equal(
    sentenceContainingSelection(bubble, "How's your day?"),
    "How's your day?",
  );
  assert.equal(sentenceContainingSelection(bubble, "up"), "What's up?");
});

test("Japanese uses the sentence that contains the click, not the whole chat", () => {
  const bubble = "こんにちは。今日はいい天気ですね。";
  assert.equal(
    sentenceContainingSelection(bubble, "今日はいい天気ですね。"),
    "今日はいい天気ですね。",
  );
});
