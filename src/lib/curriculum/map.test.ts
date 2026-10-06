import assert from "node:assert/strict";
import { test } from "node:test";
import { connectionsOf, nextTopic, normalizeMap } from "./map.ts";

const base = {
  id: "m1",
  language: "en",
  uiLanguage: "ko",
  goal: "여행 가서 현지인과 대화하기",
  level: "beginner" as const,
  createdAt: "2026-10-07T00:00:00.000Z",
  libraryVideoIds: ["vid1", "vid2"],
};

function topic(id: string, order: number, extra: Record<string, unknown> = {}) {
  return { id, sector: id[0], title: `Topic ${id}`, summary: "s", order, activities: [], links: [], ...extra };
}

const sectors = ["A", "B", "C", "D"].map((id) => ({ id, title: `Sector ${id}`, description: "d" }));

test("a well-formed map survives whole, with its order made contiguous", () => {
  const raw = {
    title: "Travel talk",
    sectors,
    topics: [topic("A1", 1), topic("B1", 3), topic("C1", 5), topic("D1", 9), topic("A2", 2), topic("B2", 4)],
  };
  const result = normalizeMap(raw, base);
  assert.ok(result);
  assert.deepEqual(result.map.topics.map((t) => [t.id, t.order]), [
    ["A1", 1], ["A2", 2], ["B1", 3], ["B2", 4], ["C1", 5], ["D1", 6],
  ]);
  assert.deepEqual(result.dropped, []);
});

test("lines to nowhere, to itself and twice to the same place are dropped", () => {
  const raw = {
    sectors,
    topics: [
      topic("A1", 1, { links: [{ to: "B1", why: "uses it" }, { to: "B1", why: "again" }, { to: "Z9", why: "?" }, { to: "A1", why: "self" }] }),
      topic("B1", 2), topic("C1", 3), topic("D1", 4), topic("A2", 5), topic("B2", 6),
    ],
  };
  const result = normalizeMap(raw, base)!;
  assert.deepEqual(result.map.topics.find((t) => t.id === "A1")!.links, [{ to: "B1", why: "uses it" }]);
  assert.ok(result.dropped.some((d) => d.includes("Z9")));
});

test("activities only on tabs the app has, and videos only from the library", () => {
  const raw = {
    sectors,
    topics: [
      topic("A1", 1, {
        activities: [
          { tab: "chat", task: "Order a coffee", starter: "Hi, can I get…" },
          { tab: "video", task: "vid2: watch it and note the opinions", videoId: "vid2" },
          { tab: "video", task: "Watch another", videoId: "not-ours" },
          { tab: "podcast", task: "Listen" },
        ],
      }),
      topic("B1", 2), topic("C1", 3), topic("D1", 4), topic("A2", 5), topic("B2", 6),
    ],
  };
  const a1 = normalizeMap(raw, base)!.map.topics[0];
  assert.equal(a1.activities.length, 3);
  assert.equal(a1.activities[0].starter, "Hi, can I get…");
  assert.equal(a1.activities[1].videoId, "vid2");
  assert.equal(a1.activities[1].task, "watch it and note the opinions", "the raw id is not left in the sentence");
  assert.equal(a1.activities[2].videoId, undefined, "an id not in the library is not linked");
});

test("topics in the wrong sector, malformed or repeated are dropped; too few is no map", () => {
  const raw = {
    sectors,
    topics: [topic("A1", 1), { ...topic("B1", 2), sector: "C" }, topic("A1", 3), topic("Q1", 4), topic("C1", 5)],
  };
  assert.equal(normalizeMap(raw, base), null);
});

test("connections read both ways, and continue picks the first unfinished", () => {
  const raw = {
    sectors,
    topics: [
      topic("A1", 1, { links: [{ to: "B1", why: "A1 needs B1" }] }),
      topic("B1", 2), topic("C1", 3, { links: [{ to: "B1", why: "C1 feeds B1" }] }),
      topic("D1", 4), topic("A2", 5), topic("B2", 6),
    ],
  };
  const map = normalizeMap(raw, base)!.map;
  const ofB1 = connectionsOf(map, "B1").map((c) => c.topic.id).sort();
  assert.deepEqual(ofB1, ["A1", "C1"]);
  assert.equal(nextTopic(map, { A1: "done", B1: "doing" })?.id, "B1");
  assert.equal(nextTopic(map, Object.fromEntries(map.topics.map((t) => [t.id, "done" as const]))), null);
});
