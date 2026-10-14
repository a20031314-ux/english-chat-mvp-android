import assert from "node:assert/strict";
import test from "node:test";
import {
  FROM_MEMORY_MS,
  applyHeard,
  applyLearnerLine,
  applyMeet,
  applyMissionResult,
  emptyLedger,
  isLedgerText,
  ledgerKey,
  ledgerMatches,
  summarize,
} from "./ledger.ts";

const T0 = Date.UTC(2026, 9, 12, 9, 0, 0);
const H = 60 * 60 * 1000;

test("met in a video, then used in chat: help too recent is learned, from memory is mastered", () => {
  let l = emptyLedger("en");
  l = applyMeet(l, "ended up", "lookup", { tab: "video", videoId: "abc", t: 42.4 }, T0);
  const item = l.items[ledgerKey("ended up")]!;
  assert.equal(item.state, "met");
  assert.deepEqual(item.firstMet, { tab: "video", at: T0, videoId: "abc", t: 42 });
  l = applyLearnerLine(l, "I ended up staying home", "I ended up staying home", "chat", T0 + H);
  assert.equal(l.items[ledgerKey("ended up")]!.state, "learned", "an hour after looking it up is practice");
  l = applyLearnerLine(l, "We ended up at a bar", "We ended up at a bar", "call", T0 + FROM_MEMORY_MS + 2 * H);
  const done = l.items[ledgerKey("ended up")]!;
  assert.equal(done.state, "mastered");
  assert.equal(done.outputs.at(-1)?.where, "call");
  // Wrong later: back to learned.
  l = applyLearnerLine(l, "I ended up go home", "I wound up going home", "chat", T0 + 30 * H);
  assert.equal(l.items[ledgerKey("ended up")]!.state, "learned");
  assert.equal(l.items[ledgerKey("ended up")]!.slips, 1);
});

test("spaceless and particle-carrying languages are matched, sentences are not phrases", () => {
  let ja = emptyLedger("ja");
  ja = applyMeet(ja, "お疲れ様", "save", { tab: "vocab" }, T0);
  assert.equal(ja.items[ledgerKey("お疲れ様")]!.state, "learned", "saving is choosing to study it");
  ja = applyLearnerLine(ja, "今日もお疲れ様でした", "今日もお疲れ様でした", "chat", T0 + FROM_MEMORY_MS + 1);
  assert.equal(ja.items[ledgerKey("お疲れ様")]!.state, "mastered");
  let ko = emptyLedger("ko");
  ko = applyMeet(ko, "회의", "lookup", { tab: "chat" }, T0);
  ko = applyLearnerLine(ko, "내일 회의가 있어요", "내일 회의가 있어요", "chat", T0 + FROM_MEMORY_MS + 1);
  assert.equal(ko.items[ledgerKey("회의")]!.state, "mastered", "회의가 is 회의 with a particle");
  assert.equal(isLedgerText("Me levanto temprano todos los días para ir al trabajo", "es"), false);
  assert.equal(isLedgerText("me levanto", "es"), true);
});

test("heard twice without a look-up is marked, not mastered; a task is met; mission results follow the map", () => {
  let l = emptyLedger("en");
  l = applyMeet(l, "take a seat", "lookup", { tab: "chat" }, T0);
  l = applyHeard(l, "Please take a seat.", T0 + 1);
  l = applyHeard(l, "Take a seat anywhere.", T0 + 2);
  assert.equal(l.items[ledgerKey("take a seat")]!.understood, true);
  assert.equal(l.items[ledgerKey("take a seat")]!.state, "met");
  const map = { mapId: "m", topicId: "A1", missionId: "m1" };
  l = applyMissionResult(l, "nice to meet you", "helped", "mission", map, T0);
  assert.equal(l.items[ledgerKey("nice to meet you")]!.state, "learned");
  assert.deepEqual(l.items[ledgerKey("nice to meet you")]!.map, map);
  assert.equal(l.items[ledgerKey("nice to meet you")]!.firstMet.tab, "map");
  l = applyMissionResult(l, "nice to meet you", "unaided", "review", map, T0 + FROM_MEMORY_MS);
  assert.equal(l.items[ledgerKey("nice to meet you")]!.state, "mastered");
});

test("summary: counts, this week, retention, where learned things were first met, a row per week", () => {
  let l = emptyLedger("es");
  l = applyMeet(l, "me levanto", "lookup", { tab: "video" }, T0);
  l = applyMeet(l, "tengo que", "save", { tab: "vocab" }, T0);
  l = applyMeet(l, "qué tal", "lookup", { tab: "chat" }, T0);
  l = applyLearnerLine(l, "Me levanto a las siete", "Me levanto a las siete", "chat", T0 + FROM_MEMORY_MS);
  const s = summarize(l, T0 + FROM_MEMORY_MS + 1);
  assert.deepEqual(s.counts, { met: 1, learned: 1, mastered: 1 });
  assert.equal(s.masteredThisWeek, 1);
  assert.equal(s.retention, 1);
  assert.equal(s.bySource.video, 1);
  assert.equal(s.bySource.vocab, 1);
  assert.equal(s.bySource.chat, 0, "met only is not counted as learned from there");
  assert.equal(s.weeks.length, 1);
  assert.equal(s.weeks[0]!.mastered, 1);
  const later = summarize(l, T0 + 40 * 24 * H);
  assert.equal(later.retention, 0, "not used in the last 30 days");
  assert.equal(ledgerMatches(l, "¿Qué tal estás?").length, 1);
});
