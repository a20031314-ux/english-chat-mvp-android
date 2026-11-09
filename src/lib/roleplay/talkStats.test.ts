import { test } from "node:test";
import assert from "node:assert/strict";
import { compareTalk, readTopics, shapeOf, volumeOf, type TalkCall } from "./talkStats.ts";
import { parseMemory } from "./memory.ts";
import type { TranscriptLine } from "./review.ts";
test("비교: 다섯 통부터, 기준의 배수가 큰 칸 셋까지, 문형 칸은 값이 있는 통화끼리", () => {
  const call = (i: number, words: number, fixed: number, topics: string[], extra: object = {}): TalkCall => ({ at: i, talk: { n: 8, words, level: 0.1, fixed, asked: 0, ...extra }, topics });
  const grew = [call(1, 3, 0.6, ["food"]), call(2, 3, 0.5, ["food"]), call(3, 4, 0.5, ["travel"]), call(4, 6, 0.3, ["work"]), call(5, 7, 0.2, ["people"]), call(6, 8, 0.2, ["health"])];
  const out = compareTalk(grew)!;
  assert.deepEqual(out.rows.map((row) => row.id), ["words", "fixed", "topics"]);
  assert.equal(compareTalk(grew.slice(0, 4)), null);
  assert.equal(compareTalk(grew.map((one) => ({ ...one, talk: { ...one.talk, words: 3, fixed: 0.5 }, topics: ["food"] }))), null);
  // 표시가 생긴 뒤 통화 넷(문형 0.2 → 0.8, 가짓수 1 → 4): 그 둘이 가장 큰 배수로 위에.
  const tagged = grew.concat([7, 8, 9, 10].map((i) => call(i, 8, 0.2, ["health"], { shaped: i < 9 ? 0.2 : 0.8, kinds: i < 9 ? 1 : 4 })));
  const rows = compareTalk(tagged)!.rows.map((row) => row.id);
  assert.equal(rows[0], "shaped");
  assert.ok(rows.includes("kinds") || rows.length === 3, rows.join());
  assert.ok(compareTalk(tagged)!.rows.length <= 3);
});

test("처음 3분 대화량·문형 숫자 (es·th)", () => {
  const t0 = 1_000_000;
  const lines: TranscriptLine[] = [
    { who: "tutor", text: "¿Qué hiciste el fin de semana?", at: t0 },
    { who: "learner", text: "Fui a la playa con mis amigos", at: t0 + 10_000 },
    { who: "tutor", text: "¡Qué bien!", at: t0 + 20_000 },
    { who: "learner", text: "Tengo que trabajar mañana", at: t0 + 30_000 },
    { who: "learner", text: "Yo comer", better: "Yo como", at: t0 + 40_000 },
    { who: "learner", text: "Esto no cuenta porque ya pasaron los tres minutos", at: t0 + 4 * 60_000 },
  ];
  const v = volumeOf("es", lines)!;
  assert.equal(v.mine3, 7 + 4 + 2);
  assert.ok(v.share > 0.6 && v.share < 0.8, String(v.share));
  assert.equal(volumeOf("es", lines.map(({ at: _at, ...rest }) => rest)), null);
  const shape = shapeOf(lines, (line) => (line.text.startsWith("Fui") ? ["g|2:1"] : line.text.startsWith("Tengo") ? ["f|es-f2-13", "e|tengo que"] : []));
  assert.equal(shape.kinds, 3);
  assert.equal(shape.top, 2);
  assert.ok(Math.abs(shape.shaped! - 2 / 4) < 1e-9, String(shape.shaped));
  const th = volumeOf("th", [{ who: "learner", text: "ฉันไปทะเลกับเพื่อน", at: 0 }, { who: "tutor", text: "สนุกไหม", at: 1000 }])!;
  assert.ok(th.mine3 >= 3, "띄어쓰기 없는 말도 낱말로");
});

test("소재: 목록 안 것만 둘까지 — 튜터 메모 답에서 (서버 parseMemory)", () => {
  assert.deepEqual(readTopics(["food", "space", "food", "travel", "work"]), ["food", "travel"]);
  assert.deepEqual(parseMemory(JSON.stringify({ notes: "n", facts: [], summary: "s", topics: ["work", "x"] }))?.topics, ["work"]);
  assert.equal(parseMemory(JSON.stringify({ notes: "n", facts: [] }))?.topics, undefined);
});
