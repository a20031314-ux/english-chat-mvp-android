import test from "node:test";
import assert from "node:assert/strict";
import {
  MAFIA_DAY_MS,
  MAFIA_NIGHT_MS,
  canPick,
  mafiaCount,
  mafiaView,
  mafiaWinner,
  newMafiaGame,
  readMafiaStory,
  skipMafiaDay,
  tickMafia,
  type MafiaGame,
} from "./mafiaGame.ts";

const people = ["a", "b", "c", "d", "e"].map((id) => ({ peerId: `p_${id}`, accountId: `lb_${id}`, nickname: id.toUpperCase() }));
const all = new Set(people.map((p) => p.peerId));

// random() = 0.99 → 섞지 않음: a 마피아, b 의사, c 경찰, d·e 시민.
function game(): MafiaGame {
  return newMafiaGame({ id: "m1", mode: "ai", moderator: "p_a", players: people, now: 0, random: () => 0.99 });
}

test("역할 나누기: 5~6명 마피아 1, 7명부터 2, 의사·경찰 하나씩", () => {
  const g = game();
  assert.deepEqual(Object.values(g.roles).sort(), ["citizen", "citizen", "doctor", "mafia", "police"]);
  assert.equal(g.roles.p_a, "mafia");
  assert.equal(mafiaCount(6), 1);
  assert.equal(mafiaCount(7), 2);
  assert.equal(g.phase, "night");
});

test("밤: 다 고르면 바로 아침, 의사가 지키면 아무도 안 당함, 경찰 확인", () => {
  const g = game();
  assert.equal(tickMafia(g, 10, all, { p_a: "p_d" }).phase, "night");
  const day = tickMafia(g, 10, all, { p_a: "p_d", p_b: "p_e", p_c: "p_a" });
  assert.equal(day.phase, "day");
  assert.deepEqual(day.lastNight, { round: 1, killed: "p_d", saved: false });
  assert.ok(!day.alive.includes("p_d"));
  assert.deepEqual(day.checks, [{ round: 1, target: "p_a", mafia: true }]);
  const saved = tickMafia(g, 10, all, { p_a: "p_d", p_b: "p_d", p_c: "p_e" });
  assert.deepEqual(saved.lastNight, { round: 1, killed: null, saved: true });
  assert.equal(saved.alive.length, 5);
  // 시간이 지나면 고르지 않아도 아침(아무도 안 당함)
  assert.equal(tickMafia(g, MAFIA_NIGHT_MS, all, {}).lastNight?.killed, null);
});

test("고를 수 있는 것: 마피아는 마피아를 못 노림, 경찰은 자기 확인 못 함, 시민은 밤에 못 고름", () => {
  const g = game();
  assert.ok(!canPick(g, "p_a", "p_a"));
  assert.ok(canPick(g, "p_b", "p_b"));
  assert.ok(!canPick(g, "p_c", "p_c"));
  assert.ok(!canPick(g, "p_d", "p_e"));
});

test("낮 → 투표 → 나감 → 승패", () => {
  let g = tickMafia(game(), 10, all, { p_a: "p_d", p_b: "p_e", p_c: "p_e" });
  assert.equal(skipMafiaDay(g, "p_b", 20), g);
  g = skipMafiaDay(g, "p_a", 20);
  assert.equal(g.phase, "vote");
  // 남은 넷 중 셋이 a에게 → a(마피아) 나감 → 시민 승
  const won = tickMafia(g, 30, all, { p_b: "p_a", p_c: "p_a", p_e: "p_a", p_a: "p_b" });
  assert.equal(won.phase, "done");
  assert.equal(won.winner, "town");
  // 동점이면 아무도 안 나가고 다음 밤
  const tie = tickMafia(g, 30, all, { p_b: "p_a", p_a: "p_b", p_c: "p_e", p_e: "p_c" });
  assert.equal(tie.phase, "night");
  assert.equal(tie.round, 2);
  assert.equal(tie.lastVote?.out, null);
  // 낮 시간이 지나면 투표
  assert.equal(tickMafia(tickMafia(game(), 10, all, { p_a: "p_d", p_b: "p_e", p_c: "p_e" }), 10 + MAFIA_DAY_MS, all).phase, "vote");
});

test("마피아 수가 나머지 이상이면 마피아 승, 방을 떠난 사람은 빠진다", () => {
  const g = { ...game(), alive: ["p_a", "p_d"] };
  assert.equal(mafiaWinner(g), "mafia");
  const left = tickMafia(game(), 10, new Set(["p_b", "p_c", "p_d", "p_e"]));
  assert.equal(left.winner, "town");
  assert.deepEqual(left.left, ["p_a"]);
});

test("보이는 것: 남의 역할은 숨기고, 마피아끼리·나간 사람·끝난 판은 보임", () => {
  const g = game();
  const d = mafiaView(g, "p_d");
  assert.equal(d.role, "citizen");
  assert.deepEqual(Object.keys(d.roles), ["p_d"]);
  const a = mafiaView(g, "p_a", { p_a: "p_d" });
  assert.deepEqual(a.team, ["p_a"]);
  assert.deepEqual(a.teamPicks, { p_a: "p_d" });
  assert.equal(a.myPick, "p_d");
  assert.equal(mafiaView(g, "p_d", { p_a: "p_d" }).teamPicks, undefined);
  assert.equal(mafiaView(g, "p_c").checks, undefined);
  const day = tickMafia(g, 10, all, { p_a: "p_d", p_b: "p_e", p_c: "p_a" });
  assert.equal(mafiaView(day, "p_e").roles.p_d, "citizen");
  assert.equal(mafiaView(day, "p_c").checks?.[0].mafia, true);
  assert.equal(mafiaView(day, "p_e").checks, undefined);
  assert.equal(mafiaView(day, "p_d").me, "out");
  const hosted = { ...g, mode: "host" as const, moderator: "p_m" };
  assert.equal(Object.keys(mafiaView(hosted, "p_m").roles).length, 5);
});

test("배경 이야기: 모든 언어가 있어야", () => {
  const raw = { setting: { en: "A ship", ko: "배", th: "เรือ" }, intro: { en: "Night falls.", ko: "밤이 왔어요.", th: "กลางคืนมาถึงแล้ว" } };
  assert.equal(readMafiaStory(raw, ["en", "ko", "th"])?.setting.th, "เรือ");
  assert.equal(readMafiaStory(raw, ["en", "es"]), null);
});
