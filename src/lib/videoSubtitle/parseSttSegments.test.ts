import { test } from "node:test";
import assert from "node:assert/strict";
import { parseSttSegment, parseSttSegments } from "./parseSttSegments.ts";
import { regularizeSttSegments } from "./sttChunks.ts";

const line = {
  id: "s-0",
  text: "So the thing about this camera is that the sensor is smaller.",
  startTime: 1.2,
  endTime: 3.0,
  words: [
    { word: "So", start: 1.2, end: 1.32 },
    { word: "the", start: 1.32, end: 1.44 },
    { word: "thing", start: 1.44, end: 1.6 },
    { word: "about", start: 1.6, end: 1.78 },
    { word: "this", start: 1.78, end: 1.9 },
    { word: "camera", start: 1.9, end: 2.12 },
    { word: "is", start: 2.12, end: 2.2 },
    { word: "that", start: 2.2, end: 2.32 },
    { word: "the", start: 2.32, end: 2.42 },
    { word: "sensor", start: 2.42, end: 2.66 },
    { word: "is", start: 2.66, end: 2.76 },
    { word: "smaller.", start: 2.76, end: 3.0 },
  ],
};

test("the word stamps the app sends survive the request", () => {
  const parsed = parseSttSegment(JSON.parse(JSON.stringify(line)));
  assert.equal(parsed?.words?.length, 12);
  assert.equal(parsed?.words?.[0]?.start, 1.2);
  assert.equal(parsed?.words?.[11]?.end, 3.0);
});

test("a line without stamps is still a line", () => {
  const { words: _words, ...bare } = line;
  const parsed = parseSttSegment(bare);
  assert.ok(parsed);
  assert.equal(parsed?.words, undefined);
});

test("stamps that are not stamps are left out rather than trusted", () => {
  const parsed = parseSttSegment({
    ...line,
    words: [
      { word: "So", start: 1.2, end: 1.32 },
      { word: "", start: 1.4, end: 1.5 },
      { word: "the", start: 2.0, end: 1.0 },
      { word: "thing", start: "1.5", end: 1.7 },
      "the",
      null,
    ],
  });
  assert.equal(parsed?.words?.length, 1);
});

test("dropping the stamps stretches a fast line past the speech", () => {
  // Why the field is parsed at all. Twelve words spoken in 1.8 seconds is 6.7 a
  // second; with the stamps gone, timedWords.ts spreads them at a fixed 3.2 and
  // the cue is held for as long as that takes. Measured, not assumed: this is
  // the reported complaint — subtitles on a fast video landing late — reduced
  // to its one line of cause.
  const withStamps = regularizeSttSegments([parseSttSegment(line)!]);
  const { words: _words, ...bare } = line;
  const without = regularizeSttSegments([parseSttSegment(bare)!]);
  const held = (cue: { startTime: number; endTime: number }) =>
    cue.endTime - cue.startTime;
  assert.ok(Math.abs(held(withStamps[0]!) - 1.8) < 0.2, `${held(withStamps[0]!)}`);
  assert.ok(held(without[0]!) > 3, `${held(without[0]!)}`);
});

test("segments are parsed as a list, up to the limit", () => {
  assert.equal(parseSttSegments([line, line, line], 2).length, 2);
  assert.equal(parseSttSegments([line, {}, null, "x"], 800).length, 1);
  assert.equal(parseSttSegments("not a list", 800).length, 0);
});
