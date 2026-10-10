import assert from "node:assert/strict";
import test from "node:test";
import {
  applyCheck,
  applyUse,
  dueMissions,
  itemState,
  markSeen,
  topicCounts,
  missionProgress,
  nextMission,
  normalizeCheck,
  normalizeMissions,
  statusFromMissions,
  type TopicMissions,
} from "./missions.ts";

const raw = (n: number, extra: Record<string, unknown> = {}) => ({
  missions: Array.from({ length: n }, (_, i) => ({
    task: `과제 ${i + 1}: 처음 만난 동료에게 인사해보세요`,
    hints: ["반갑다는 표현을 붙여보세요", "Nice to…"],
    answer: `Hi, I'm Sian. Nice to meet you. (${i})`,
    ...extra,
  })),
});

test("missions keep their order and get stable ids", () => {
  const missions = normalizeMissions(raw(4));
  assert.equal(missions?.length, 4);
  assert.deepEqual(missions?.map((m) => m.id), ["m1", "m2", "m3", "m4"]);
});

test("too few usable missions is no set at all, and extra ones are cut", () => {
  assert.equal(normalizeMissions(raw(2)), null);
  assert.equal(normalizeMissions(raw(8))?.length, 5);
  assert.equal(normalizeMissions({ missions: [{ task: "x" }] }), null);
});

test("a task that gives its answer away is dropped", () => {
  const leaky = { missions: [
    ...raw(3).missions,
    { task: "Say: Nice to meet you", hints: ["a", "b"], answer: "Nice to meet you" },
  ] };
  assert.equal(normalizeMissions(leaky)?.length, 3);
});

test("missions in spaceless and right-to-left languages are kept as written", () => {
  const ja = normalizeMissions({ missions: Array.from({ length: 3 }, () => ({
    task: "初めて会った同僚にあいさつして名前を言ってみましょう",
    hints: ["会えてうれしい気持ちを伝えましょう", "はじめまして…"],
    answer: "はじめまして、シアンです。よろしくお願いします。",
  })) });
  assert.equal(ja?.[0]?.answer, "はじめまして、シアンです。よろしくお願いします。");
  const ar = normalizeMissions({ missions: Array.from({ length: 3 }, () => ({
    task: "سلّم على زميل تقابله لأول مرة وقل اسمك",
    hints: ["أضف عبارة تعبّر عن سرورك باللقاء", "Mucho…"],
    answer: "Hola, soy Sian. Mucho gusto.",
  })) });
  assert.equal(ar?.length, 3);
});

test("a check is read strictly and a correction equal to the answer is dropped", () => {
  assert.equal(normalizeCheck({ verdict: "maybe" }, "x"), null);
  const close = normalizeCheck({ verdict: "close", better: "Nice to meet you.", feedback: "to가 빠졌어요", reply: "Nice to meet you too!" }, "Nice meet you");
  assert.equal(close?.better, "Nice to meet you.");
  const same = normalizeCheck({ verdict: "pass", better: "nice to meet you", reply: "Hi!" }, "Nice to meet you!");
  assert.equal(same?.better, "");
  const miss = normalizeCheck({ verdict: "miss", better: "Nice to meet you", feedback: "인사부터 해보세요", reply: "Hi" }, "uh");
  assert.equal(miss?.better, "");
  assert.equal(miss?.reply, "");
});

const H = 60 * 60 * 1000;

test("done with help is learned; done unaided the first time is mastered", () => {
  let state: TopicMissions = { missions: normalizeMissions(raw(3))!, results: {} };
  assert.deepEqual(missionProgress(state), { done: 0, total: 3 });
  state = applyCheck(state, "m1", "miss", 0, 1, 0);
  assert.equal(itemState(state, "m1", 0).state, "toLearn");
  state = applyCheck(state, "m1", "close", 1, 2, 0);
  state = applyCheck(state, "m2", "pass", 2, 1, 0);
  state = applyCheck(state, "m3", "pass", 0, 1, 0);
  assert.equal(itemState(state, "m1", 0).state, "learned");
  assert.equal(itemState(state, "m2", 0).state, "learned");
  assert.equal(itemState(state, "m3", 0).state, "mastered");
  assert.deepEqual(missionProgress(state), { done: 3, total: 3 });
  assert.equal(statusFromMissions(state), "doing");
  assert.equal(nextMission(state), null);
});

test("a learned item is mastered by producing it unaided once some hours have passed", () => {
  let state: TopicMissions = { missions: normalizeMissions(raw(3))!, results: {} };
  state = applyCheck(state, "m1", "close", 0, 1, 0);
  // Straight after the correction: practice, not proof.
  state = applyCheck(state, "m1", "pass", 0, 2, 5 * 60 * 1000, "review");
  assert.equal(itemState(state, "m1", 5 * 60 * 1000).state, "learned");
  assert.equal(itemState(state, "m1", 6 * 60 * 1000).due, false);
  const later = 5 * 60 * 1000 + 9 * H;
  assert.equal(itemState(state, "m1", later).due, true);
  assert.deepEqual(dueMissions(state, later).map((m) => m.id), ["m1"]);
  // With a hint it does not count.
  const hinted = applyCheck(state, "m1", "pass", 1, 1, later, "review");
  assert.equal(itemState(hinted, "m1", later).state, "learned");
  state = applyCheck(state, "m1", "pass", 0, 1, later, "review");
  assert.equal(itemState(state, "m1", later).state, "mastered");
  assert.equal(state.results.m1?.outputs?.at(-1)?.where, "review");
});

test("getting a mastered item wrong takes it back to learned", () => {
  let state: TopicMissions = { missions: normalizeMissions(raw(3))!, results: {} };
  state = applyCheck(state, "m1", "pass", 0, 1, 0);
  state = applyCheck(state, "m1", "close", 0, 1, 10 * H, "review");
  assert.equal(itemState(state, "m1", 10 * H).state, "learned");
  assert.equal(state.results.m1?.slips, 1);
});

test("using the phrase in chat or a call counts as producing it", () => {
  let state: TopicMissions = { missions: normalizeMissions(raw(3))!, results: {} };
  // Never practised, used right: they can produce it.
  state = applyUse(state, "m2", true, "chat", 0);
  assert.equal(itemState(state, "m2", 0).state, "mastered");
  state = applyCheck(state, "m1", "close", 1, 1, 0);
  state = applyUse(state, "m1", true, "call", 1 * H);
  assert.equal(itemState(state, "m1", 1 * H).state, "learned");
  state = applyUse(state, "m1", true, "call", 10 * H);
  assert.equal(itemState(state, "m1", 10 * H).state, "mastered");
  state = applyUse(state, "m1", false, "chat", 11 * H);
  assert.equal(itemState(state, "m1", 11 * H).state, "learned");
});

test("looking at the answer is a mark, not progress, and the topic is done when all are mastered", () => {
  let state: TopicMissions = { missions: normalizeMissions(raw(3))!, results: {} };
  state = markSeen(state, "m1");
  const counts = topicCounts(state, 0);
  assert.equal(counts.toLearn, 3);
  assert.equal(counts.seen, 1);
  for (const id of ["m1", "m2", "m3"]) state = applyCheck(state, id, "pass", 0, 1, 0);
  assert.equal(statusFromMissions(state), "done");
  assert.deepEqual(
    { mastered: topicCounts(state, 0).mastered, seen: topicCounts(state, 0).seen },
    { mastered: 3, seen: 0 },
  );
});

test("a second hint that is most of the answer is cut back to its start", () => {
  const ja = normalizeMissions({ missions: Array.from({ length: 3 }, () => ({
    task: "テーブルについて、みんなに今日のお礼を言いましょう",
    hints: ["簡単なあいさつと感謝", "今日はお疲れ様でした。…"],
    answer: "今日はお疲れ様でした。ご一緒できてうれしいです。",
  })) });
  const hint = ja![0]!.hints[1];
  assert.ok(hint.endsWith("…"));
  assert.ok(hint.length < 14, hint);
  const en = normalizeMissions({ missions: Array.from({ length: 3 }, () => ({
    task: "同僚を夕食に誘ってみましょう",
    hints: ["丁寧な誘い方", "Would you like to have dinner together…"],
    answer: "Would you like to have dinner together after the meeting?",
  })) });
  assert.equal(en![0]!.hints[1], "Would you like to have…");
  const short = normalizeMissions(raw(3));
  assert.equal(short![0]!.hints[1], "Nice to…");
});
