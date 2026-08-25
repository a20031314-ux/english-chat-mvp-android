import { test } from "node:test";
import assert from "node:assert/strict";
import {
  applyLlmSentenceMarks,
  matchSentencesToWordIndices,
  refineSpansWithLlm,
  splitSentencesFromWords,
} from "./sentenceFromWords.ts";
import { flattenSttToTimedWords, spanFromWordSlice } from "./timedWords.ts";
import { regularizeSttSegments } from "./sttChunks.ts";
import type { TimedWord } from "./types.ts";

function words(
  rows: Array<[string, number, number, string?]>,
): TimedWord[] {
  return rows.map(([text, start, end, speaker]) => ({
    text,
    startMs: Math.round(start * 1000),
    endMs: Math.round(end * 1000),
    ...(speaker ? { speakerTag: speaker } : {}),
  }));
}

test("flatten then punct-split does not cut after got in a VAD chunk pair", () => {
  const segments = regularizeSttSegments([
    {
      id: "a",
      text: "and then it got",
      startTime: 12.0,
      endTime: 13.4,
      words: [
        { word: "and", start: 12.0, end: 12.15 },
        { word: "then", start: 12.18, end: 12.35 },
        { word: "it", start: 12.4, end: 12.5 },
        { word: "got", start: 12.55, end: 13.35 },
      ],
    },
    {
      id: "b",
      text: "Him turfed out of the party",
      startTime: 13.5,
      endTime: 15.2,
      words: [
        { word: "Him", start: 13.5, end: 13.7 },
        { word: "turfed", start: 13.75, end: 14.1 },
        { word: "out", start: 14.15, end: 14.3 },
        { word: "of", start: 14.32, end: 14.4 },
        { word: "the", start: 14.42, end: 14.5 },
        { word: "party", start: 14.55, end: 15.15 },
      ],
    },
  ]);
  assert.equal(segments.length, 1);
  assert.match(segments[0]!.text, /got Him turfed out of the party/i);
  assert.ok(segments[0]!.startTime <= 12.05);
  assert.ok(segments[0]!.endTime >= 15.1);
  assert.equal(segments[0]!.words?.length, 10);
});

test("punctuation still splits after a finished sentence", () => {
  const spans = splitSentencesFromWords(
    words([
      ["Hello", 0, 0.4],
      ["there.", 0.45, 0.9],
      ["This", 1.0, 1.2],
      ["is", 1.25, 1.35],
      ["next.", 1.4, 1.8],
    ]),
  );
  assert.deepEqual(
    spans.map((span) => span.text),
    ["Hello there.", "This is next."],
  );
  assert.equal(spans[0]!.startIndex, 0);
  assert.equal(spans[0]!.endIndex, 1);
  assert.equal(spans[1]!.startIndex, 2);
});

test("false period after an open noun phrase does not split", () => {
  const spans = splitSentencesFromWords(
    words([
      ["as", 0, 0.2],
      ["a", 0.25, 0.35],
      ["first.", 0.4, 0.7],
      ["language.", 0.8, 1.3],
    ]),
  );
  assert.equal(spans.length, 1);
  assert.match(spans[0]!.text, /first\. language\./i);
});

test("Mr. abbreviation does not start a new sentence", () => {
  const spans = splitSentencesFromWords(
    words([
      ["Meet", 0, 0.3],
      ["Mr.", 0.35, 0.55],
      ["Smith", 0.6, 0.9],
      ["today.", 1.0, 1.4],
    ]),
  );
  assert.equal(spans.length, 1);
  assert.match(spans[0]!.text, /Mr\. Smith today\./);
});

test("speaker tag change forces a split even without punctuation", () => {
  const spans = splitSentencesFromWords(
    words([
      ["I", 0, 0.2, "A"],
      ["know", 0.25, 0.5, "A"],
      ["Wait", 0.7, 0.95, "B"],
      ["what", 1.0, 1.3, "B"],
    ]),
  );
  assert.equal(spans.length, 2);
  assert.equal(spans[0]!.text, "I know");
  assert.equal(spans[1]!.text, "Wait what");
});

test(">> marker starts a new sentence", () => {
  const spans = splitSentencesFromWords(
    words([
      ["Hello", 0, 0.4],
      ["there.", 0.45, 0.9],
      [">>", 1.2, 1.3],
      ["No", 1.35, 1.5],
      ["way.", 1.55, 1.9],
    ]),
  );
  assert.equal(spans.length, 2);
  assert.equal(spans[0]!.text, "Hello there.");
  assert.match(spans[1]!.text, /No way/);
});

test("LLM marks map back onto word indices", () => {
  const list = words([
    ["I", 0, 0.1],
    ["need", 0.12, 0.3],
    ["to", 0.32, 0.4],
    ["leave", 0.42, 0.6],
    ["now", 0.62, 0.8],
    ["We", 0.9, 1.0],
    ["can", 1.05, 1.2],
    ["talk", 1.22, 1.4],
    ["later", 1.45, 1.7],
  ]);
  const spans = applyLlmSentenceMarks(
    list,
    "I need to leave now ||| We can talk later",
  );
  assert.ok(spans);
  assert.equal(spans.length, 2);
  assert.equal(spans[0]!.text, "I need to leave now");
  assert.equal(spans[1]!.text, "We can talk later");
  assert.equal(spans[0]!.startMs, 0);
  assert.ok(spans[1]!.startMs >= 900);
});

test("LLM mismatch falls back to punctuation spans", async () => {
  const list = words([
    ["and", 0, 0.2],
    ["then", 0.22, 0.4],
    ["it", 0.42, 0.5],
    ["got", 0.52, 0.7],
    ["Him", 0.8, 1.0],
    ["turfed", 1.05, 1.4],
    ["out", 1.45, 1.6],
    ["of", 1.62, 1.7],
    ["the", 1.72, 1.8],
    ["party", 1.85, 2.2],
  ]);
  const fallback = splitSentencesFromWords(list);
  const refined = await refineSpansWithLlm(list, fallback, async () => {
    return "and then it got him kicked ||| out of the party";
  });
  assert.equal(refined.length, 1);
  assert.match(refined[0]!.text, /got Him turfed/);
});

test("matched LLM sentences must equal the original word sequence", () => {
  const list = words([
    ["and", 0, 0.2],
    ["then", 0.22, 0.4],
    ["it", 0.42, 0.5],
    ["got", 0.52, 0.7],
  ]);
  assert.equal(
    matchSentencesToWordIndices(list, ["and then it went"]),
    null,
  );
});

test("flattenSttToTimedWords concatenates chunk words in list order", () => {
  const list = flattenSttToTimedWords([
    {
      id: "a",
      text: "and then it got",
      startTime: 1,
      endTime: 2,
      words: [
        { word: "and", start: 1, end: 1.2 },
        { word: "then", start: 1.25, end: 1.4 },
        { word: "it", start: 1.45, end: 1.55 },
        { word: "got", start: 1.6, end: 1.9 },
      ],
    },
    {
      id: "b",
      text: "Him turfed",
      startTime: 2,
      endTime: 2.6,
      words: [
        { word: "Him", start: 2.0, end: 2.2 },
        { word: "turfed", start: 2.25, end: 2.55 },
      ],
    },
  ]);
  assert.deepEqual(
    list.map((word) => word.text),
    ["and", "then", "it", "got", "Him", "turfed"],
  );
  const span = spanFromWordSlice(list, 0, 5);
  assert.equal(span?.text, "and then it got Him turfed");
  assert.equal(span?.startMs, 1000);
  assert.ok((span?.endMs ?? 0) >= 2550);
});
