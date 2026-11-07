import { test } from "node:test";
import assert from "node:assert/strict";
import { compareTalk, readTopics, sampleLines, talkStatsOf, type TalkCall } from "./talkStats.ts";
import { parseMemory } from "./memory.ts";
import type { TranscriptLine } from "./review.ts";

const me = (text: string, better?: string): TranscriptLine => ({ who: "learner", text, ...(better ? { better } : {}) });
const bank = ["casa", "comer", "pan", "trabajo", "viaje", "aeropuerto", "retraso"].map((w, i) => ({ w, pos: i < 3 ? "noun" : "noun" }));

test("대화 숫자: 처음 줄만, 줄당 낱말·2단계 이상·고쳐진 줄·물음 (es·ja)", () => {
  const lines = [me("Hola"), { who: "tutor", text: "¿Qué tal?" } as TranscriptLine, me("Como pan en casa"), me("Mi viaje al aeropuerto tuvo retraso"), me("Yo comer pan", "Yo como pan"), me("¿Y tu trabajo?")];
  const stats = talkStatsOf("es", lines, bank, 3)!;
  assert.equal(stats.n, 5);
  assert.equal(stats.asked, 1);
  assert.equal(stats.fixed, 1 / 5);
  assert.ok(stats.words > 3 && stats.words < 4, String(stats.words));
  assert.ok(stats.level > 0.3 && stats.level < 0.7, String(stats.level));
  assert.deepEqual(sampleLines("es", lines), ["Como pan en casa", "Mi viaje al aeropuerto tuvo retraso"]);
  assert.equal(talkStatsOf("es", [me("Hola")], bank, 3), null);
  const ja = talkStatsOf("ja", [me("パンを食べました"), me("空港に行きました"), me("仕事は？")], [{ w: "パン", pos: "noun" }], 0)!;
  assert.equal(ja.asked, 1);
  assert.ok(ja.words >= 2, "띄어쓰기 없는 말도 낱말로 자름");
});

test("비교: 다섯 통부터, 나아진 칸이 둘 이상일 때만, 나아진 칸만", () => {
  const call = (i: number, words: number, level: number, fixed: number, topics: string[]): TalkCall => ({ at: i, talk: { n: 8, words, level, fixed, asked: 0 }, topics });
  const grew = [call(1, 3, 0.1, 0.6, ["food"]), call(2, 3, 0.1, 0.5, ["food"]), call(3, 4, 0.1, 0.5, ["travel"]), call(4, 6, 0.1, 0.3, ["work"]), call(5, 7, 0.12, 0.2, ["people"]), call(6, 8, 0.1, 0.2, ["health"])];
  const out = compareTalk(grew)!;
  assert.deepEqual(out.rows.map((row) => row.id), ["words", "fixed", "topics"]);
  assert.equal(compareTalk(grew.slice(0, 4)), null);
  assert.equal(compareTalk(grew.map((one) => ({ ...one, talk: { ...one.talk, words: 3, fixed: 0.5 }, topics: ["food"] }))), null);
});

test("소재: 목록 안 것만 둘까지 — 튜터 메모 답에서 (서버 parseMemory)", () => {
  assert.deepEqual(readTopics(["food", "space", "food", "travel", "work"]), ["food", "travel"]);
  assert.deepEqual(parseMemory(JSON.stringify({ notes: "n", facts: [], summary: "s", topics: ["work", "x"] }))?.topics, ["work"]);
  assert.equal(parseMemory(JSON.stringify({ notes: "n", facts: [] }))?.topics, undefined);
});
