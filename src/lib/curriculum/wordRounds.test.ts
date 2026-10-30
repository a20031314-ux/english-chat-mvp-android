import assert from "node:assert/strict";
import test from "node:test";
import { samePosRounds } from "./wordRounds.ts";

const pos: Record<string, string> = { casa: "noun", perro: "noun", agua: "noun", libro: "noun", mesa: "noun", comer: "verb", ir: "verb", 駅: "noun", 本: "noun", 水: "noun", 食べる: "verb" };

test("뜻 맞추기 판은 같은 품사만 — 꽉 찬 판만 이어 붙임(스페인어)", () => {
  const pairs = ["casa", "comer", "perro", "agua", "ir", "libro", "mesa"].map((word) => ({ word, meaning: word }));
  const rounds = samePosRounds(pairs, (w) => pos[w], 5);
  assert.deepEqual(rounds.map((p) => p.word), ["casa", "perro", "agua", "libro", "mesa"]);
});

test("꽉 찬 판이 없으면 가장 큰 품사 묶음 하나(일본어)", () => {
  const pairs = ["駅", "食べる", "本", "水"].map((word) => ({ word, meaning: word }));
  assert.deepEqual(samePosRounds(pairs, (w) => pos[w], 5).map((p) => p.word), ["駅", "本", "水"]);
});
