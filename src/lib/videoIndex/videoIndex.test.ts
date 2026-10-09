import assert from "node:assert/strict";
import test from "node:test";
import { findExpression, formsOf, matchVideos, wordsOf } from "./match.ts";
import {
  buildTranscriptRecord,
  parseTranscriptRecord,
  speechStats,
  transcriptAsSttSegments,
  type TranscriptRecord,
} from "./transcript.ts";

const SEGMENTS = [
  { startTime: 0, endTime: 3.2, text: "So we got to the cafe and it was packed." },
  { startTime: 3.4, endTime: 6, text: "We ended up going somewhere else." },
  { startTime: 6.2, endTime: 9.8, text: "Honestly, I'd rather wait it out than walk in the rain." },
  { startTime: 10, endTime: 12.5, text: "She stood me up again, can you believe it?" },
];

function record(videoId = "abcDEF12345", segments = SEGMENTS): TranscriptRecord {
  const built = buildTranscriptRecord({
    videoId,
    language: "en",
    title: "  Cafe   chat ",
    durationSeconds: 125.4,
    source: "whisper",
    segments,
    now: 7,
  });
  assert.ok(built);
  return built;
}

test("a record keeps only the speech, cleaned and in order", () => {
  const built = record("abcDEF12345", [
    SEGMENTS[1]!,
    SEGMENTS[0]!,
    { startTime: 5, endTime: 4, text: "backwards" },
    { startTime: 1, endTime: 2, text: "   " },
  ]);
  assert.equal(built.title, "Cafe chat");
  assert.equal(built.durationSeconds, 125);
  assert.deepEqual(built.lines.map((line) => line.start), [0, 3.4]);
});

test("nothing is kept for a bad id, an unknown source or no speech", () => {
  const base = { language: "en", durationSeconds: 10, segments: SEGMENTS };
  assert.equal(buildTranscriptRecord({ ...base, videoId: "../x", source: "whisper" }), null);
  assert.equal(buildTranscriptRecord({ ...base, videoId: "abcDEF12345", source: "guess" }), null);
  assert.equal(
    buildTranscriptRecord({ ...base, videoId: "abcDEF12345", source: "whisper", segments: [] }),
    null,
  );
});

test("a stored record reads back the same, and junk reads as absent", () => {
  const built = record();
  assert.deepEqual(parseTranscriptRecord(JSON.parse(JSON.stringify(built))), built);
  assert.equal(parseTranscriptRecord({ ...built, version: 99 }), null);
  assert.equal(parseTranscriptRecord("nope"), null);
});

test("a record can be handed back to the pipeline as speech it already has", () => {
  const segments = transcriptAsSttSegments(record());
  assert.equal(segments.length, 4);
  assert.deepEqual(segments[1], {
    id: "kept-1",
    text: "We ended up going somewhere else.",
    startTime: 3.4,
    endTime: 6,
  });
});

test("speech stats count words against time spoken", () => {
  const stats = speechStats(record());
  assert.equal(stats.words, 36);
  assert.ok(stats.wordsPerMinute > 150 && stats.wordsPerMinute < 250);
});

test("words drop punctuation but keep apostrophes", () => {
  assert.deepEqual(wordsOf("Honestly, I’d rather — wait!"), ["honestly", "i'd", "rather", "wait"]);
});

test("forms cover regular and irregular inflection", () => {
  assert.ok(formsOf("end").has("ended"));
  assert.ok(formsOf("stop").has("stopping"));
  assert.ok(formsOf("try").has("tried"));
  assert.ok(formsOf("stand").has("stood"));
  assert.ok(formsOf("make").has("making"));
});

test("an inflected phrase is found with its time", () => {
  const hits = findExpression(record().lines, "end up");
  assert.equal(hits.length, 1);
  assert.equal(hits[0]?.start, 3.4);
  assert.equal(hits[0]?.matched, "ended up");
});

test("placeholders stand for the words in between", () => {
  const hits = findExpression(record().lines, "stand someone up");
  assert.equal(hits[0]?.matched, "stood me up");
});

test("a verb and its particle may be split by the object", () => {
  assert.equal(findExpression(record().lines, "wait out")[0]?.matched, "wait it out");
  assert.equal(findExpression(record().lines, "wait it out")[0]?.matched, "wait it out");
  // A particle far away is not the same phrase.
  assert.equal(findExpression(record().lines, "walk out").length, 0);
});

test("other languages match as written", () => {
  const korean = buildTranscriptRecord({
    videoId: "kor12345678",
    language: "ko",
    durationSeconds: 5,
    source: "youtube-manual",
    segments: [{ startTime: 0, endTime: 2, text: "결국 다른 데 갔어요." }],
  });
  assert.ok(korean);
  assert.equal(findExpression(korean.lines, "다른 데", "ko").length, 1);
  assert.equal(findExpression(korean.lines, "다른 곳", "ko").length, 0);
});

test("videos saying more of the wanted expressions rank first", () => {
  const both = record("both1234567");
  const one = record("one12345678", [
    { startTime: 0, endTime: 2, text: "I ended up late. We end up here. They end up there." },
  ]);
  const none = record("none1234567", [{ startTime: 0, endTime: 2, text: "Nothing to see." }]);
  const ranked = matchVideos([one, none, both], ["end up", "stand someone up", "end up"]);
  assert.deepEqual(ranked.map((match) => match.videoId), ["both1234567", "one12345678"]);
  assert.equal(ranked[1]?.hitCount, 3);
});
