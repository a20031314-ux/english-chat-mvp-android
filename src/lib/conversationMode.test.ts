import assert from "node:assert/strict";
import test from "node:test";
import { detectConversationMode } from "./conversationMode.ts";

test("default chat stays native conversation", () => {
  assert.equal(detectConversationMode("I went to the gym today."), "native");
  assert.equal(detectConversationMode("야 오늘 뭐 했어?"), "native");
  assert.equal(detectConversationMode(""), "native");
});

test("stuck phrases switch to temporary tutor mode", () => {
  assert.equal(detectConversationMode("아 어렵네"), "tutor");
  assert.equal(detectConversationMode("이거 어떻게 말해?"), "tutor");
  assert.equal(detectConversationMode("I don't understand"), "tutor");
  assert.equal(detectConversationMode("How do I say this?"), "tutor");
  assert.equal(detectConversationMode("can you explain this"), "tutor");
});
