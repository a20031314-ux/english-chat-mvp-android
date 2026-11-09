import assert from "node:assert/strict";
import test from "node:test";
import { normalizeConversationSession, type ConversationSession } from "./chatArchive.ts";
function session(id: string, languageCode: ConversationSession["languageCode"], tutorGender: "f" | "m" | undefined, lines: string[], endedAt?: number): ConversationSession {
  return {
    id,
    title: id,
    createdAt: 1,
    messageCount: lines.length,
    languageCode,
    ...(tutorGender ? { tutorGender } : {}),
    ...(endedAt ? { endedAt } : {}),
    messages: lines.map((content, index) => ({ id: `${id}-${index}`, role: index % 2 ? "assistant" : "user", content, createdAt: index })),
  };
}

test("대화 기록을 읽을 때 튜터가 남는다(없으면 빠짐)", () => {
  assert.equal(normalizeConversationSession(session("a", "th", "f", ["สวัสดี"]))?.tutorGender, "f");
  assert.equal(normalizeConversationSession({ ...session("b", "en", undefined, ["hi"]), tutorGender: "x" })?.tutorGender, undefined);
});
