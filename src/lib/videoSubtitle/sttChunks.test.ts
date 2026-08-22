import { test } from "node:test";
import assert from "node:assert/strict";
import { mergeSttChunks, sttChunkStarts } from "./sttChunks.ts";

test("sttChunkStarts uses one window for short audio", () => {
  assert.deepEqual(sttChunkStarts(40), [0]);
});

test("sttChunkStarts steps with overlap for long audio", () => {
  const starts = sttChunkStarts(200);
  assert.equal(starts[0], 0);
  assert.ok(starts.length >= 3);
  assert.ok((starts[1] ?? 0) > 70 && (starts[1] ?? 0) < 76);
});

test("mergeSttChunks drops overlapped duplicates", () => {
  const merged = mergeSttChunks([
    {
      startTime: 0,
      segments: [
        { id: "a", text: "hello", startTime: 0, endTime: 1 },
        { id: "b", text: "there", startTime: 73, endTime: 74.5 },
      ],
    },
    {
      startTime: 73,
      segments: [
        { id: "c", text: "there", startTime: 73.1, endTime: 74.4 },
        { id: "d", text: "friend", startTime: 80, endTime: 81 },
      ],
    },
  ]);
  assert.deepEqual(
    merged.map((row) => row.text),
    ["hello", "there", "friend"],
  );
});
