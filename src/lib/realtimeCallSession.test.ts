import assert from "node:assert/strict";
import test from "node:test";
import {
  realtimeCallInstructions,
  realtimeCallSessionConfig,
  realtimeCallVoice,
} from "./realtimeCallSession.ts";

test("English call is a native speaker on the phone, not a tutor", () => {
  const text = realtimeCallInstructions("en");
  assert.match(text, /Alex/);
  assert.match(text, /native English/i);
  assert.match(text, /phone call/i);
  assert.match(text, /understand Korean/i);
  assert.doesNotMatch(text, /correction JSON/i);
  assert.equal(realtimeCallVoice("en"), "ash");
});

test("Korean call is a native speaker who can follow English", () => {
  const text = realtimeCallInstructions("ko");
  assert.match(text, /Minjun|민준|한국어 원어민/);
  assert.match(text, /전화/);
  assert.match(text, /영어도 알아/);
  assert.equal(realtimeCallVoice("ko"), "cedar");
});

test("session config uses realtime type and a voice", () => {
  const session = realtimeCallSessionConfig("en");
  assert.equal(session.type, "realtime");
  assert.equal(session.audio.output.voice, "ash");
  assert.ok(session.instructions.length > 80);
});

test("a call in another language is told to stay in it and expect the native one", () => {
  const text = realtimeCallInstructions("ja", "ko");
  assert.match(text, /Default to Japanese/);
  assert.match(text, /neither Japanese nor Korean/);
  assert.match(text, /Korean speaker learning Japanese/);
  // Bilingual, not a monolingual who refuses: Korean is allowed when asked for.
  assert.match(text, /You also speak Korean/);
  assert.match(text, /answer in Korean for as long as they need/);
  // The old wording let it drift by only "preferring" the target language.
  assert.doesNotMatch(text, /prefer Japanese unless/);
});

test("the native language reaches the session config", () => {
  const session = realtimeCallSessionConfig("ja", "vi");
  assert.match(session.instructions, /Vietnamese speaker learning Japanese/);
});
