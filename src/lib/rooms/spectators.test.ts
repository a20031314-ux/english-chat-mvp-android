import test from "node:test";
import assert from "node:assert/strict";
import { newLiarGame } from "./liarGame.ts";
import { newMafiaGame } from "./mafiaGame.ts";
import { addToBoard, canPredict, isSpectator, predictionOpen, scorePredictions, topOfBoard } from "./spectators.ts";

const people = (ids: string[]) => ids.map((id) => ({ peerId: `p_${id}`, accountId: `lb_${id}`, nickname: id.toUpperCase() }));
const liar = () =>
  newLiarGame({ id: "g", mode: "ai", moderator: "p_a", players: people(["a", "b", "c"]), topic: "food", topicNames: { en: "Food" }, words: { en: "apple" }, laps: 1, now: 0, random: () => 0.99 });
const mafia = () => newMafiaGame({ id: "m", mode: "ai", moderator: "p_a", players: people(["a", "b", "c", "d", "e"]), now: 0, random: () => 0.99 });

test("관전자: 플레이어가 아닌 사람, 마피아 탈락자. 방장 사회자는 빠진다", () => {
  const g = liar();
  assert.ok(!isSpectator(g, "p_a"));
  assert.ok(isSpectator(g, "p_x"));
  assert.ok(!isSpectator({ ...g, mode: "host", moderator: "p_x" }, "p_x"));
  const m = { ...mafia(), alive: ["p_a", "p_b", "p_c", "p_d"] };
  assert.ok(isSpectator(m, "p_e"));
  assert.ok(!isSpectator(m, "p_d"));
});

test("찍을 수 있는 때·대상: 라이어는 설명·투표 중, 마피아는 남은 사람만", () => {
  const g = liar();
  assert.ok(canPredict(g, "p_x", "p_b"));
  assert.ok(!canPredict(g, "p_a", "p_b"));
  assert.ok(!canPredict(g, "p_x", "p_zz"));
  assert.ok(!predictionOpen({ ...g, phase: "guess" }));
  const m = { ...mafia(), alive: ["p_a", "p_b", "p_c", "p_d"] };
  assert.ok(canPredict(m, "p_e", "p_a"));
  assert.ok(!canPredict(m, "p_e", "p_e"));
  assert.ok(!canPredict({ ...m, alive: ["p_b", "p_c", "p_d"] }, "p_x", "p_a"));
});

test("점수: 라이어는 마지막 표, 마피아는 맞힌 라운드 수·처음 맞힌 라운드", () => {
  const watchers = people(["x", "y", "z"]);
  const g = liar(); // 라이어 p_c
  const s = scorePredictions(g, watchers, [
    { peerId: "p_x", round: 0, target: "p_c" },
    { peerId: "p_y", round: 0, target: "p_b" },
  ]);
  assert.deepEqual(s.right.map((r) => r.peerId), ["p_x"]);
  assert.deepEqual(s.counts, { p_c: 1, p_b: 1 });
  assert.equal(s.total, 2);
  const m = mafia(); // 마피아 p_a
  const sm = scorePredictions(m, watchers, [
    { peerId: "p_x", round: 1, target: "p_b" },
    { peerId: "p_x", round: 2, target: "p_a" },
    { peerId: "p_x", round: 3, target: "p_a" },
    { peerId: "p_y", round: 1, target: "p_d" },
  ]);
  assert.deepEqual(sm.right, [{ peerId: "p_x", nickname: "X", round: 2 }]);
  assert.equal(sm.hits.p_x, 2);
  const board = addToBoard(addToBoard({}, watchers, sm.hits), watchers, { p_y: 1 });
  assert.deepEqual(topOfBoard(board), [{ nickname: "X", hits: 2 }, { nickname: "Y", hits: 1 }]);
});
