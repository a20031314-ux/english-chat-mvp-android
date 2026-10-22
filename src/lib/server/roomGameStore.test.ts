import test from "node:test";
import assert from "node:assert/strict";
import { readWordPick } from "../rooms/liarGame.ts";
import { newLiarGame, tickLiar, LIAR_CLUE_MS } from "../rooms/liarGame.ts";
import { commitStep, readGame, writeGame } from "./roomGameStore.ts";

test("AI 제시어: 모든 언어가 채워져야, 길이는 자름", () => {
  const raw = { english: "apple", topic: { en: "Fruit", ja: "果物", es: "Fruta" }, word: { en: "apple", ja: "りんご", es: "manzana" } };
  assert.deepEqual(readWordPick(raw, ["en", "ja", "es"])?.words, { en: "apple", ja: "りんご", es: "manzana" });
  assert.equal(readWordPick({ ...raw, word: { en: "apple", ja: "" } }, ["en", "ja"]), null);
  assert.equal(readWordPick(null, ["en"]), null);
  assert.equal(readWordPick({ topic: { th: "ผลไม้" }, word: { th: "x".repeat(80) } }, ["th"])?.words.th.length, 40);
});

test("단계 넘기기는 한 번만(잠금): 두 번째 쓰기는 이미 저장된 판을 돌려준다", async () => {
  const players = ["a", "b", "c"].map((id) => ({ peerId: `p_${id}`, accountId: null, nickname: id }));
  const base = newLiarGame({ id: "glock1", mode: "ai", moderator: "p_a", players, topic: "food", topicNames: { en: "Food" }, words: { en: "apple" }, laps: 1, now: 0, random: () => 0.99 });
  await writeGame("rtest1", base);
  const present = new Set(players.map((p) => p.peerId));
  const once = await commitStep("rtest1", base, tickLiar(base, LIAR_CLUE_MS, present));
  assert.equal(once.turn, 1);
  // 같은 단계에서 다른 결과로 또 넘기려 해도(늦게 온 물음) 저장된 판 그대로.
  const twice = await commitStep("rtest1", base, { ...base, phase: "vote" });
  assert.equal(twice.turn, 1);
  assert.equal(twice.phase, "clue");
  assert.equal((await readGame("rtest1", "glock1"))?.turn, 1);
  assert.equal(await readGame("rtest1", "other"), null);
});

test("마피아: 밤 행동은 단계마다 따로 저장, 다 고르면 방 물음이 아침으로", async () => {
  const { newMafiaGame } = await import("../rooms/mafiaGame.ts");
  const { currentGame, writeVote, readVotes } = await import("./roomGameStore.ts");
  const players = ["a", "b", "c", "d", "e"].map((id) => ({ peerId: `p_${id}`, accountId: null, nickname: id }));
  const g = newMafiaGame({ id: "mf1", mode: "ai", moderator: "p_a", players, now: Date.now(), random: () => 0.99 });
  await writeGame("rtest2", g);
  assert.equal(await writeVote("rtest2", g, "p_a", "p_d"), true);
  await writeVote("rtest2", g, "p_b", "p_e");
  assert.deepEqual(await readVotes("rtest2", g), { p_a: "p_d", p_b: "p_e" });
  const present = new Set(players.map((p) => p.peerId));
  assert.equal((await currentGame("rtest2", "mf1", present))?.game.phase, "night");
  await writeVote("rtest2", g, "p_c", "p_a");
  const day = await currentGame("rtest2", "mf1", present);
  assert.equal(day?.game.phase, "day");
  // 낮에는 고르는 것이 없다(밤의 표는 다음 단계에 보이지 않음)
  assert.deepEqual(day?.votes, {});
});
