import { test } from "node:test";
import assert from "node:assert/strict";
import {
  mergeSttChunks,
  regularizeSttSegments,
  speechCoversDuration,
  splitSpokenWords,
  sttChunkStarts,
} from "./sttChunks.ts";

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
  assert.match(merged.map((row) => row.text).join(" "), /hello/i);
  assert.match(merged.map((row) => row.text).join(" "), /there/i);
  assert.match(merged.map((row) => row.text).join(" "), /friend/i);
  assert.equal((merged.map((row) => row.text).join(" ").match(/\bthere\b/gi) ?? []).length, 1);
});

test("regularizeSttSegments splits on sentences and snaps overlaps", () => {
  const rows = regularizeSttSegments([
    {
      id: "a",
      text: "Hello there. This is a second sentence. And here is a third one.",
      startTime: 0,
      endTime: 18,
    },
    {
      id: "b",
      text: "overlap",
      startTime: 17.2,
      endTime: 19,
    },
  ]);
  assert.deepEqual(
    rows.map((row) => row.text),
    [
      "Hello there.",
      "This is a second sentence.",
      "And here is a third one.",
      "overlap",
    ],
  );
  for (let i = 0; i < rows.length - 1; i += 1) {
    assert.ok(rows[i]!.endTime <= rows[i + 1]!.startTime + 0.001);
  }
});

test("regularizeSttSegments keeps one sentence even if it is long", () => {
  const rows = regularizeSttSegments([
    {
      id: "a",
      text: "I just remember looking over and they both came running toward the door",
      startTime: 0,
      endTime: 14,
    },
  ]);
  assert.equal(rows.length, 1);
  assert.match(rows[0]!.text, /came running/);
});

test("splitSpokenWords cuts fast speech on a new clause without a long pause", () => {
  const rows = splitSpokenWords([
    { word: "I", start: 0, end: 0.08 },
    { word: "need", start: 0.1, end: 0.28 },
    { word: "to", start: 0.3, end: 0.38 },
    { word: "leave", start: 0.4, end: 0.62 },
    { word: "now", start: 0.64, end: 0.9 },
    { word: "We", start: 0.96, end: 1.08 },
    { word: "can", start: 1.1, end: 1.22 },
    { word: "talk", start: 1.24, end: 1.42 },
    { word: "later", start: 1.44, end: 1.7 },
  ]);
  assert.equal(rows.length, 2);
  assert.match(rows[0]!.text, /leave now/i);
  assert.match(rows[1]!.text, /talk later/i);
});

test("regularizeSttSegments does not cut on a pause inside one thought", () => {
  const rows = regularizeSttSegments([
    {
      id: "a",
      text: "Hello there we should go",
      startTime: 0,
      endTime: 6,
      words: [
        { word: "Hello", start: 0, end: 0.4 },
        { word: "there", start: 0.45, end: 0.9 },
        { word: "we", start: 2.2, end: 2.4 },
        { word: "should", start: 2.5, end: 2.8 },
        { word: "go", start: 2.9, end: 3.2 },
      ],
    },
  ]);
  assert.deepEqual(
    rows.map((row) => row.text),
    ["Hello there we should go"],
  );
});

test("regularizeSttSegments expands collapsed stamps forward", () => {
  const rows = regularizeSttSegments([
    {
      id: "a",
      text: "I just remember looking over and they both came running",
      startTime: 12.1,
      endTime: 12.4,
    },
  ]);
  assert.equal(rows.length, 1);
  assert.ok(rows[0]!.startTime >= 11.8);
  assert.ok(rows[0]!.endTime >= 14.5);
});

test("regularizeSttSegments does not stretch a short cue into the next sentence", () => {
  const rows = regularizeSttSegments([
    {
      id: "a",
      text: "I just remember looking over and they both came running.",
      startTime: 12.1,
      endTime: 12.4,
    },
    {
      id: "b",
      text: "Toward the door quickly.",
      startTime: 12.55,
      endTime: 14.2,
    },
  ]);
  assert.equal(rows.length, 2);
  assert.ok(rows[0]!.endTime <= rows[1]!.startTime + 0.05);
  assert.ok(rows[1]!.startTime < 13.2);
});

test("regularizeSttSegments keeps lyric order when a later line has an earlier stamp", () => {
  const rows = regularizeSttSegments([
    {
      id: "a",
      text: "Never gonna give you up",
      startTime: 10,
      endTime: 13,
    },
    {
      id: "b",
      text: "Never gonna let you down",
      startTime: 8,
      endTime: 8.3,
    },
  ]);
  assert.match(rows.map((row) => row.text).join(" "), /give you up/i);
  assert.match(rows.map((row) => row.text).join(" "), /let you down/i);
  const giveAt = rows.map((row) => row.text).join(" ").indexOf("give");
  const letAt = rows.map((row) => row.text).join(" ").indexOf("let");
  assert.ok(giveAt >= 0 && letAt > giveAt);
});

test("regularizeSttSegments does not let a later karaoke stamp cut the previous line", () => {
  const rows = regularizeSttSegments([
    {
      id: "a",
      text: "Welcome to the show everybody",
      startTime: 0.2,
      endTime: 3.8,
    },
    {
      id: "b",
      text: "Today we are going to talk",
      startTime: 0.8,
      endTime: 1.1,
    },
  ]);
  assert.match(rows[0]!.text, /Welcome to the show everybody/i);
  assert.ok(Math.max(...rows.map((row) => row.endTime)) >= 3.2);
});

test("regularizeSttSegments collapses rolling karaoke captions into unique speech", () => {
  const rows = regularizeSttSegments([
    {
      id: "a",
      text: "Hello everyone welcome",
      startTime: 0,
      endTime: 2.4,
    },
    {
      id: "b",
      text: "everyone welcome to the",
      startTime: 1.1,
      endTime: 3.5,
    },
    {
      id: "c",
      text: "welcome to the show today",
      startTime: 2.0,
      endTime: 4.6,
    },
  ]);
  const joined = rows.map((row) => row.text).join(" ");
  assert.match(joined, /Hello everyone welcome to the show today/i);
  assert.equal((joined.match(/everyone/gi) ?? []).length, 1);
  for (let i = 0; i < rows.length - 1; i += 1) {
    assert.ok(rows[i]!.endTime <= rows[i + 1]!.startTime + 0.05);
  }
});

test("regularizeSttSegments does not reorder words by jumbled karaoke clocks", () => {
  const rows = regularizeSttSegments([
    {
      id: "a",
      text: "give you up",
      startTime: 10,
      endTime: 12,
      words: [
        { word: "give", start: 11.8, end: 12 },
        { word: "you", start: 10.1, end: 10.3 },
        { word: "up", start: 10.4, end: 10.6 },
      ],
    },
    {
      id: "b",
      text: "let you down",
      startTime: 9,
      endTime: 9.2,
      words: [
        { word: "let", start: 9, end: 9.1 },
        { word: "you", start: 9.1, end: 9.15 },
        { word: "down", start: 9.15, end: 9.2 },
      ],
    },
  ]);
  const joined = rows.map((row) => row.text).join(" ");
  assert.match(joined, /give you up/i);
  assert.match(joined, /let you down/i);
  assert.ok(joined.indexOf("give") < joined.indexOf("let"));
});

test("regularizeSttSegments drops a last-word karaoke echo on the next line", () => {
  const rows = regularizeSttSegments([
    {
      id: "a",
      text: "Hello everyone welcome today",
      startTime: 0,
      endTime: 2.1,
    },
    {
      id: "b",
      text: "today we start the show",
      startTime: 2.15,
      endTime: 4.2,
    },
  ]);
  assert.ok(!/^today\b/i.test(rows[1]?.text ?? ""));
  assert.match(rows.map((row) => row.text).join(" "), /welcome today/i);
  assert.match(rows.map((row) => row.text).join(" "), /we start the show/i);
});

test("regularizeSttSegments drops a repeated boundary word", () => {
  const rows = regularizeSttSegments([
    {
      id: "a",
      text: "Never gonna give you up.",
      startTime: 0,
      endTime: 2.2,
    },
    {
      id: "b",
      text: "up Never gonna let you down.",
      startTime: 2.2,
      endTime: 4.4,
    },
  ]);
  assert.equal(rows.length, 2);
  assert.equal(rows[1]!.text, "Never gonna let you down.");
});

test("speechCoversDuration rejects a 5-minute video with three early lines", () => {
  assert.equal(
    speechCoversDuration(
      [
        { startTime: 4, endTime: 12 },
        { startTime: 20, endTime: 28 },
        { startTime: 40, endTime: 55 },
      ],
      300,
    ),
    false,
  );
  assert.equal(
    speechCoversDuration(
      Array.from({ length: 12 }, (_, index) => ({
        startTime: index * 24,
        endTime: index * 24 + 8,
      })),
      300,
    ),
    true,
  );
});
