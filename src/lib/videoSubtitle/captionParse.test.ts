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

test("a rolling caption line ends where the next one starts", () => {
  // YouTube keeps line one on screen until line three pushes it off, so its
  // own end stamp is two lines past the speech. Every word interpolated
  // across that span lands late.
  const body = `<?xml version="1.0"?><timedtext><body>
    <p t="0" d="5100">Delivering personal superintelligence</p>
    <p t="3000" d="4800">is now within reach.</p>
    <p t="5100" d="5800">Soon, everyone is going to have an</p>
  </body></timedtext>`;
  const parsed = parseCaptionBody(body);
  assert.equal(parsed[0]!.endTime, 3);
  assert.equal(parsed[1]!.endTime, 5.1);
  // The last line has nothing after it and keeps the span it was given.
  assert.ok(Math.abs(parsed[2]!.endTime - 10.9) < 0.01);
});

test("lines that do not overlap are left exactly as they came", () => {
  const body = `<?xml version="1.0"?><timedtext><body>
    <p t="0" d="2000">Why is that?</p>
    <p t="2500" d="3000">What is the difference?</p>
  </body></timedtext>`;
  const parsed = parseCaptionBody(body);
  assert.equal(parsed[0]!.endTime, 2);
  assert.equal(parsed[1]!.startTime, 2.5);
});

test("a line is never clamped shorter than a breath", () => {
  const body = `<?xml version="1.0"?><timedtext><body>
    <p t="1000" d="4000">One.</p>
    <p t="1050" d="4000">Two.</p>
  </body></timedtext>`;
  const parsed = parseCaptionBody(body);
  assert.ok(parsed[0]!.endTime >= 1.4);
});

test("json3 word stamps are never second-guessed", () => {
  const body = JSON.stringify({
    events: [
      {
        tStartMs: 0,
        dDurationMs: 6000,
        segs: [{ utf8: "one" }, { utf8: " two", tOffsetMs: 400 }],
      },
    ],
  });
  const parsed = parseCaptionBody(body);
  assert.equal(parsed.length, 1);
  assert.ok(parsed[0]!.words && parsed[0]!.words.length === 2);
});
