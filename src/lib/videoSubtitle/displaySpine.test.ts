import { test } from "node:test";
import assert from "node:assert/strict";
import { displaySpineFromSentences } from "./displaySpine.ts";
import type { NormalizedSegment, SttSegment } from "./types.ts";

function sentence(
  id: string,
  startTime: number,
  endTime: number,
  text: string,
): NormalizedSegment {
  return { id, startTime, endTime, rawText: text, normalizedText: text };
}

function line(
  id: string,
  startTime: number,
  endTime: number,
  text: string,
): SttSegment {
  return { id, startTime, endTime, text };
}

test("a sentence short enough to read is kept whole, not cut at the caption break", () => {
  const sentences = [
    sentence("s1", 8.0, 15.5, 'Chat with a friend about an established scientific theory and she might reply, "Well, that\'s just a theory."'),
  ];
  const lines = [
    line("d1", 8.1, 11.5, "Chat with a friend about an established scientific theory"),
    line("d2", 11.5, 15.7, 'and she might reply, "Well, that\'s just a theory."'),
  ];
  const spine = displaySpineFromSentences(sentences, lines);
  assert.equal(spine.length, 1);
  assert.match(spine[0]!.normalizedText, /just a theory\.?"?$/);
});

test("a sentence too long to follow is cut at a caption line start", () => {
  const sentences = [sentence("s1", 0, 24, "one two three four five six seven eight nine ten")];
  const lines = [
    line("d1", 0, 6, "one two"),
    line("d2", 6, 12, "three four"),
    line("d3", 12, 18, "five six"),
    line("d4", 18, 24, "seven eight nine ten"),
  ];
  const spine = displaySpineFromSentences(sentences, lines);
  assert.equal(spine.length, 3);
  assert.deepEqual(
    spine.map((row) => [row.startTime, row.endTime]),
    [
      [0, 6],
      [6, 18],
      [18, 24],
    ],
  );
  assert.equal(spine[0]!.normalizedText, "one two");
  assert.equal(spine[2]!.normalizedText, "seven eight nine ten");
});

test("parts stay inside the sentence and keep its ends", () => {
  const sentences = [sentence("s1", 5, 30, "a b c d e f")];
  const lines = [
    line("d1", 5, 11, "a b"),
    line("d2", 11, 17, "c d"),
    line("d3", 17, 23, "e"),
    line("d4", 23, 30, "f"),
  ];
  const spine = displaySpineFromSentences(sentences, lines);
  assert.equal(spine[0]!.startTime, 5);
  assert.equal(spine[spine.length - 1]!.endTime, 30);
  for (const row of spine) {
    assert.ok(row.endTime > row.startTime);
    assert.ok(row.endTime - row.startTime <= 25);
  }
});

test("one block of timed words leaves the sentences alone", () => {
  const sentences = [
    sentence("s1", 0, 18, "a long sentence that nothing can be cut by"),
    sentence("s2", 18, 24, "a short one"),
  ];
  const whole = [line("d1", 0, 24, "a long sentence that nothing can be cut by a short one")];
  assert.deepEqual(displaySpineFromSentences(sentences, whole), sentences);
});

test("rolling caption lines do not steal the spine from the sentences", () => {
  const sentences = [
    sentence("s1", 0, 7.8, "Delivering personal superintelligence is now within reach."),
    sentence("s2", 7.8, 14.0, "Soon everyone is going to have a capable personal agent."),
  ];
  const lines = [
    line("d1", 0, 5.1, "Delivering personal superintelligence"),
    line("d2", 3.0, 7.8, "is now within reach."),
    line("d3", 5.1, 10.9, "Soon, everyone is going to have a"),
    line("d4", 7.8, 14.3, "capable personal agent."),
  ];
  const spine = displaySpineFromSentences(sentences, lines);
  assert.equal(spine.length, 2);
  assert.match(spine[0]!.normalizedText, /within reach\.$/);
  assert.match(spine[1]!.normalizedText, /personal agent\.$/);
});
