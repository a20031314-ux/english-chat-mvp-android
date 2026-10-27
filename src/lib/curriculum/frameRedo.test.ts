import { test } from "node:test";
import assert from "node:assert/strict";
import { framesToRedo, REDO_REST_MS } from "./frameRedo.ts";
import type { FixCard } from "../notes/notebook.ts";

const DAY = 24 * 60 * 60 * 1000;
const NOW = Date.UTC(2026, 9, 28);
const card = (id: string, frame: string | undefined, daysAgo: number, extra: Partial<FixCard> = {}): FixCard => ({
  id,
  wrong: `w${id}`,
  right: `r${id}`,
  note: "n",
  node: null,
  where: "chat",
  at: NOW - daysAgo * DAY,
  ...(frame ? { frame } : {}),
  ...extra,
});

test("다시 연습: 14일 안에 같은 틀 두 번이면 권함, 최근 카드로", () => {
  const out = framesToRedo([card("a1", "ja-f1-05", 3), card("a2", "ja-f1-05", 1), card("b1", "es-f2-01", 2)], {}, NOW);
  assert.equal(out.length, 1);
  assert.equal(out[0]!.frame, "ja-f1-05");
  assert.equal(out[0]!.count, 2);
  assert.equal(out[0]!.card.id, "a2");
});

test("다시 연습: 오래된 것·오타·질문·같은 카드 겹침은 안 셈", () => {
  assert.deepEqual(framesToRedo([card("a1", "ko-f1-01", 20), card("a2", "ko-f1-01", 1)], {}, NOW), []);
  assert.deepEqual(framesToRedo([card("a1", "ko-f1-01", 2, { kind: "typo" }), card("a2", "ko-f1-01", 1)], {}, NOW), []);
  assert.deepEqual(framesToRedo([card("a1", "ko-f1-01", 2, { kind: "question" }), card("a2", "ko-f1-01", 1)], {}, NOW), []);
  assert.deepEqual(framesToRedo([card("a1", "ko-f1-01", 2), card("a1", "ko-f1-01", 2)], {}, NOW), []);
  assert.equal(framesToRedo([card("a1", "ko-f1-01", 2, { kind: "meant" }), card("a2", "ko-f1-01", 1)], {}, NOW).length, 1);
});

test("다시 연습: 끝낸 틀은 3일 쉬고, 그 뒤엔 끝낸 뒤 짚인 것만", () => {
  const cards = [card("a1", "es-f1-03", 6), card("a2", "es-f1-03", 5), card("a3", "es-f1-03", 1), card("a4", "es-f1-03", 0.5)];
  assert.deepEqual(framesToRedo(cards, { "es-f1-03": NOW - 2 * DAY }, NOW), []);
  assert.deepEqual(framesToRedo(cards.slice(0, 3), { "es-f1-03": NOW - REDO_REST_MS - 2 * DAY }, NOW), []);
  const back = framesToRedo(cards, { "es-f1-03": NOW - 4 * DAY }, NOW);
  assert.equal(back.length, 1);
  assert.equal(back[0]!.count, 2);
});

test("다시 연습: 두 개까지, 많이 짚인 틀 먼저", () => {
  const cards = [
    ...["1", "2"].map((n) => card(`a${n}`, "ko-f2-01", Number(n))),
    ...["1", "2", "3"].map((n) => card(`b${n}`, "ko-f2-02", Number(n) + 3)),
    ...["1", "2"].map((n) => card(`c${n}`, "ko-f2-03", Number(n) + 5)),
  ];
  const out = framesToRedo(cards, {}, NOW);
  assert.deepEqual(out.map((item) => item.frame), ["ko-f2-02", "ko-f2-01"]);
});
