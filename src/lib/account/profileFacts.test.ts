import assert from "node:assert/strict";
import test from "node:test";
import {
  cleanFacts,
  cleanShow,
  DEFAULT_SHOW,
  factsOf,
  factsPrompt,
  INTERESTS_MAX,
  sharedInterests,
  showOf,
} from "./profileFacts.ts";

test("모르는 칩·중복·한도를 넘는 것은 버리고, 모국어는 할 수 있는 언어에서 뺀다", () => {
  const facts = cleanFacts({
    native: "th",
    speaks: ["th", "es", "es", "ja", "ar", "zh", "<b>"],
    interests: ["music", "music", "nope", "travel", "games", "cooking", "sports", "movies"],
    work: "student",
    meetModes: ["call", "fax"],
    meetTimes: ["night", 3],
  });
  assert.equal(facts.native, "th");
  assert.deepEqual(facts.speaks, ["es", "ja", "ar"]);
  assert.equal(facts.interests.length, INTERESTS_MAX);
  assert.deepEqual(facts.interests.slice(0, 2), ["music", "travel"]);
  assert.equal(facts.work, "student");
  assert.deepEqual(facts.meetModes, ["call"]);
  assert.deepEqual(facts.meetTimes, ["night"]);
});

test("이상한 값은 빈 사실로", () => {
  assert.deepEqual(cleanFacts(null), factsOf(undefined));
  assert.equal(cleanFacts({ native: "korean", work: "ceo" }).native, null);
  assert.equal(cleanFacts({ work: "ceo" }).work, null);
});

test("칸 켬/끔: 처음 값은 도움·꾸준함·목표·함께 만든 사람만 켬, 보낸 칸만 바뀐다", () => {
  assert.equal(DEFAULT_SHOW.topics, false);
  assert.equal(DEFAULT_SHOW.phrases, false);
  assert.equal(DEFAULT_SHOW.help, true);
  const changed = cleanShow({ help: false, topics: "yes" }, { streak: false });
  assert.equal(changed.help, false);
  assert.equal(changed.streak, false);
  assert.equal(changed.topics, false);
  assert.equal(changed.goal, true);
  assert.deepEqual(showOf(undefined), DEFAULT_SHOW);
});

test("겹치는 관심사 수", () => {
  assert.equal(sharedInterests(["music", "travel", "games"], ["games", "music", "books"]), 2);
  assert.equal(sharedInterests([], ["music"]), 0);
});

test("튜터 줄: 관심사·하는 일이 있을 때만, 튜터 사용을 끄면 비어 있다", () => {
  const facts = cleanFacts({ interests: ["cooking", "anime"], work: "worker" });
  const line = factsPrompt(facts, DEFAULT_SHOW);
  assert.match(line, /cooking, anime/);
  assert.match(line, /worker/);
  assert.match(line, /do not ask/);
  assert.equal(factsPrompt(facts, { ...DEFAULT_SHOW, tutor: false }), "");
  assert.equal(factsPrompt(cleanFacts({ native: "ko" }), DEFAULT_SHOW), "");
});
