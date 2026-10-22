import test from "node:test";
import assert from "node:assert/strict";
import {
  LIAR_CLUE_MS,
  LIAR_VOTE_MS,
  guessLiar,
  guessMatchesWord,
  liarCurrent,
  liarLanguages,
  liarView,
  newLiarGame,
  skipLiarTurn,
  tallyVotes,
  tickLiar,
  type LiarGame,
} from "./liarGame.ts";

const people = ["a", "b", "c", "d"].map((id) => ({ peerId: `p_${id}`, accountId: `lb_${id}`, nickname: id.toUpperCase() }));
const all = new Set(people.map((p) => p.peerId));

function game(overrides: Partial<LiarGame> = {}): LiarGame {
  // random() = 0.99 → 섞어도 순서 그대로, 라이어는 마지막 사람(p_d).
  const base = newLiarGame({
    id: "g1",
    mode: "ai",
    moderator: "p_a",
    players: people,
    topic: "food",
    topicNames: { en: "Food", ko: "음식" },
    words: { en: "apple", ko: "사과", ja: "りんご" },
    laps: 1,
    now: 0,
    random: () => 0.99,
  });
  return { ...base, ...overrides };
}

test("차례: 시간이 지나면 다음 사람, 다 돌면 투표", () => {
  let g = game();
  assert.equal(g.liar, "p_d");
  assert.equal(liarCurrent(g)?.peerId, "p_a");
  g = tickLiar(g, LIAR_CLUE_MS - 1, all);
  assert.equal(liarCurrent(g)?.peerId, "p_a");
  g = tickLiar(g, LIAR_CLUE_MS, all);
  assert.equal(liarCurrent(g)?.peerId, "p_b");
  // 다 말했어요(본인) · 다음(사회자) · 남은 못 넘김
  assert.equal(skipLiarTurn(g, "p_c", LIAR_CLUE_MS + 1), g);
  g = skipLiarTurn(g, "p_b", LIAR_CLUE_MS + 1);
  g = skipLiarTurn(g, "p_a", LIAR_CLUE_MS + 2);
  assert.equal(liarCurrent(g)?.peerId, "p_d");
  g = skipLiarTurn(g, "p_d", LIAR_CLUE_MS + 3);
  assert.equal(g.phase, "vote");
  assert.equal(g.endsAt, LIAR_CLUE_MS + 3 + LIAR_VOTE_MS);
});

test("방에 없는 사람의 차례는 건너뛰고, 라이어가 나가면 끝", () => {
  const g = tickLiar(game(), 10, new Set(["p_b", "p_c", "p_d"]));
  assert.equal(liarCurrent(g)?.peerId, "p_b");
  const gone = tickLiar(game(), 10, new Set(["p_a", "p_b", "p_c"]));
  assert.equal(gone.phase, "done");
  assert.equal(gone.reason, "liarLeft");
});

test("투표: 라이어가 뽑히면 맞히기, 엉뚱한 사람·동점이면 라이어 승", () => {
  const voting = game({ phase: "vote", turn: 4, endsAt: 100 });
  const caught = tickLiar(voting, 50, all, { p_a: "p_d", p_b: "p_d", p_c: "p_a", p_d: "p_a", p_x: "p_a" });
  // 2:2 동점(밖의 p_x 표는 버림)
  assert.equal(caught.phase, "done");
  assert.equal(caught.reason, "tie");
  const g = tickLiar(voting, 50, all, { p_a: "p_d", p_b: "p_d", p_c: "p_d", p_d: "p_a" });
  assert.equal(g.phase, "guess");
  assert.equal(g.accused, "p_d");
  const wrong = tickLiar(voting, 50, all, { p_a: "p_b", p_b: "p_c", p_c: "p_b", p_d: "p_b" });
  assert.equal(wrong.winner, "liar");
  assert.equal(wrong.reason, "escaped");
  // 아직 다 안 냈으면 시간까지 기다림
  assert.equal(tickLiar(voting, 50, all, { p_a: "p_d" }).phase, "vote");
  assert.equal(tickLiar(voting, 100, all, { p_a: "p_d" }).phase, "guess");
  // 자기 표는 안 셈
  assert.equal(tallyVotes(voting, { p_a: "p_a", p_b: "p_c" }).top, "p_c");
});

test("라이어 맞히기: 맞으면 라이어, 틀리거나 시간 지나면 시민", () => {
  const g = game({ phase: "guess", accused: "p_d", endsAt: 200 });
  assert.equal(guessLiar(g, "p_a", "apple", true, 10), g);
  assert.equal(guessLiar(g, "p_d", "apple", true, 10).winner, "liar");
  assert.equal(guessLiar(g, "p_d", "pear", false, 10).winner, "players");
  assert.equal(tickLiar(g, 200, all).reason, "missed");
});

test("보이는 것: 라이어는 제시어를 못 보고, 방장 사회자는 다 본다", () => {
  const g = game();
  assert.equal(liarView(g, "p_d").me, "liar");
  assert.equal(liarView(g, "p_d").words, undefined);
  assert.equal(liarView(g, "p_d").liar, undefined);
  assert.equal(liarView(g, "p_a").words?.ko, "사과");
  assert.equal(liarView(g, "p_a").liar, undefined);
  assert.equal(liarView(g, "p_z").me, "watcher");
  assert.equal(liarView(g, "p_z").words, undefined);
  const hosted = { ...g, mode: "host" as const, moderator: "p_m" };
  assert.equal(liarView(hosted, "p_m").me, "moderator");
  assert.equal(liarView(hosted, "p_m").liar, "p_d");
  const done = { ...g, phase: "done" as const, winner: "players" as const };
  assert.equal(liarView(done, "p_z").liar, "p_d");
});

test("답 맞추기: 관사·대소문자·문장부호, 띄어쓰기 없는 말, 스페인어", () => {
  const words = { en: "apple", ko: "사과", ja: "りんご", es: "la manzana", th: "แอปเปิ้ล" };
  assert.ok(guessMatchesWord("An Apple!", words));
  assert.ok(guessMatchesWord("사과", words));
  assert.ok(guessMatchesWord("りんご。", words));
  assert.ok(guessMatchesWord("manzana", words));
  assert.ok(guessMatchesWord("แอปเปิ้ล", words));
  assert.ok(!guessMatchesWord("pear", words));
  assert.ok(!guessMatchesWord("", words));
  assert.ok(!guessMatchesWord("cat", { en: "catalog" }));
});

test("제시어 언어: 방 언어 먼저, 사람들의 배우는 언어, 앱 언어, 겹침 없이", () => {
  const ok = (code: string) => ["en", "ko", "ja", "th", "es"].includes(code);
  assert.deepEqual(liarLanguages(["en", "ko"], [["en", "ja"], ["ko", "en"], ["th", "ko"]], ok), ["en", "ko", "th", "ja"]);
  assert.deepEqual(liarLanguages([], [["es", "xx"]], ok), ["es"]);
});
