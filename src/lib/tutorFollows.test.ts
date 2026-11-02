import assert from "node:assert/strict";
import test from "node:test";
import { lastLineFor, normalizeConversationSession, resumableFor, type ConversationSession } from "./chatArchive.ts";
import { followedTutors, isFollowingTutor, resetTutorFollowsForTest, setTutorFollow, tutorChatRows } from "./tutorFollows.ts";

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

test("튜터별 대화방: 같은 언어라도 튜터마다 따로 이어 한다 — ja·es", () => {
  const sessions = [
    session("ja-yuki", "ja", "f", ["こんにちは", "やあ、元気？"]),
    session("ja-haruto", "ja", "m", ["ラーメン好き？"]),
    session("es-old", "es", undefined, ["Hola", "¿Qué tal?"]),
    session("ja-yuki-ended", "ja", "f", ["前の話"], 5),
  ];
  assert.equal(resumableFor(sessions, "ja", "f", null, "f")?.id, "ja-yuki");
  assert.equal(resumableFor(sessions, "ja", "m", null, "f")?.id, "ja-haruto");
  // 기억해 둔 방이 다른 튜터 것이면 쓰지 않는다.
  assert.equal(resumableFor(sessions, "ja", "m", "ja-yuki", "f")?.id, "ja-haruto");
  // 튜터가 안 붙은 예전 기록은 untagged 튜터 것.
  assert.equal(resumableFor(sessions, "es", "m", null, "m")?.id, "es-old");
  assert.equal(resumableFor(sessions, "es", "f", null, "m"), null);
  assert.equal(lastLineFor(sessions, "ja", "f", "f"), "やあ、元気？");
  // 튜터 답은 JSON으로 저장된다 — 보이는 글만, 글 없는 줄(통화 알림 등)은 건너뜀.
  const stored = session("ja-json", "ja", "m", ["ラーメン好き？"]);
  stored.messages.push({ id: "j1", role: "assistant", content: JSON.stringify({ assistantMessage: "うん、大好き！" }), createdAt: 9 });
  stored.messages.push({ id: "j2", role: "assistant", content: JSON.stringify({ assistantMessage: "", callEvent: {} }), createdAt: 10 });
  assert.equal(lastLineFor([stored], "ja", "m", "f"), "うん、大好き！");
  assert.equal(lastLineFor(sessions, "es", "f", "m"), "");
});

test("대화 기록을 읽을 때 튜터가 남는다(없으면 빠짐)", () => {
  assert.equal(normalizeConversationSession(session("a", "th", "f", ["สวัสดี"]))?.tutorGender, "f");
  assert.equal(normalizeConversationSession({ ...session("b", "en", undefined, ["hi"]), tutorGender: "x" })?.tutorGender, undefined);
});

test("팔로우: 언어마다 따로, 대화 탭 줄은 고른 튜터 먼저 + 팔로우한 튜터", () => {
  resetTutorFollowsForTest();
  assert.deepEqual(followedTutors("ja"), []);
  setTutorFollow("ja", "m", true);
  setTutorFollow("ja", "m", true);
  assert.deepEqual(followedTutors("ja"), ["m"]);
  assert.equal(isFollowingTutor("es", "m"), false);
  assert.deepEqual(tutorChatRows("f", followedTutors("ja")), ["f", "m"]);
  assert.deepEqual(tutorChatRows("m", followedTutors("ja")), ["m"]);
  assert.deepEqual(tutorChatRows("f", []), ["f"]);
  assert.deepEqual(tutorChatRows("f", [], ["m"]), ["f", "m"], "a tutor they talked with stays listed");
  assert.deepEqual(tutorChatRows("m", ["f"], ["m", "f"]), ["m", "f"]);
  setTutorFollow("ja", "m", false);
  assert.deepEqual(followedTutors("ja"), []);
});
