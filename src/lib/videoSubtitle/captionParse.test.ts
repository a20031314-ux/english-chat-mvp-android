import { test } from "node:test";
import assert from "node:assert/strict";
import { parseCaptionBody, wordsAcrossSpan } from "./captionParse.ts";

test("a quick speaker's caption line keeps the span it was given", () => {
  // Ten words in 1.6 seconds is 6.3 a second — fast, and real. The old test
  // called anything past 6.4 a lost timestamp and stretched the line to 3.1
  // seconds, holding the subtitle well past the speech.
  const words = wordsAcrossSpan(
    "it is genuinely one of the best phones I have",
    10,
    11.6,
  );
  assert.equal(words.length, 10);
  assert.ok(words[words.length - 1]!.end <= 11.65);
});

test("a caption line with no span at all is still spread out", () => {
  const words = wordsAcrossSpan("one two three four five six", 10, 10.05);
  assert.ok(words[words.length - 1]!.end > 11);
});

test("json3 word offsets arrive as one block of timed words", () => {
  const body = JSON.stringify({
    events: [
      {
        tStartMs: 8000,
        dDurationMs: 5120,
        segs: [
          { utf8: "chat" },
          { utf8: " with", tOffsetMs: 280 },
          { utf8: " a", tOffsetMs: 400 },
          { utf8: " friend", tOffsetMs: 559 },
        ],
      },
    ],
  });
  const parsed = parseCaptionBody(body);
  assert.equal(parsed.length, 1);
  assert.equal(parsed[0]!.words?.length, 4);
  assert.equal(parsed[0]!.words?.[1]!.word, "with");
  assert.ok(Math.abs(parsed[0]!.words![1]!.start - 8.28) < 0.01);
});

test("srv3 arrives as the lines the player would have shown", () => {
  const body = `<?xml version="1.0"?><timedtext><body>
    <p t="0" d="5100">Delivering personal superintelligence</p>
    <p t="3000" d="4800">is now within reach.</p>
  </body></timedtext>`;
  const parsed = parseCaptionBody(body);
  assert.equal(parsed.length, 2);
  assert.equal(parsed[1]!.text, "is now within reach.");
  assert.equal(parsed[1]!.startTime, 3);
});
