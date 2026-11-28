import { test } from "node:test";
import assert from "node:assert/strict";
import { readTopics } from "./talkStats.ts";
import { parseMemory } from "./memory.ts";
test("소재: 목록 안 것만 둘까지 — 튜터 메모 답에서 (서버 parseMemory)", () => {
  assert.deepEqual(readTopics(["food", "space", "food", "travel", "work"]), ["food", "travel"]);
  assert.deepEqual(parseMemory(JSON.stringify({ notes: "n", facts: [], summary: "s", topics: ["work", "x"] }))?.topics, ["work"]);
  assert.equal(parseMemory(JSON.stringify({ notes: "n", facts: [] }))?.topics, undefined);
});
