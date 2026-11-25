import assert from "node:assert/strict";
import test from "node:test";
import { groupMeaningUnits, refineMeaningUnits } from "./groupMeaningUnits.ts";
import type { NormalizedSegment } from "./types.ts";
import { SUBTITLE_NATURALIZATION_CASES } from "./subtitleNaturalizationCases.ts";

function seg(
  id: string,
  text: string,
  start: number,
  end: number,
): NormalizedSegment {
  return {
    id,
    startTime: start,
    endTime: end,
    rawText: text,
    normalizedText: text,
  };
}

test("groupMeaningUnits keeps unpunctuated lyric lines separate", () => {
  const units = groupMeaningUnits({
    currentSegments: [
      seg("a", "Never gonna give you up", 10, 12.2),
      seg("b", "Never gonna let you down", 12.2, 14.4),
      seg("c", "Never gonna run around and desert you", 14.4, 17),
    ],
  });
  assert.equal(units.length, 3);
  assert.equal(units[0]!.original, "Never gonna give you up");
  assert.equal(units[1]!.original, "Never gonna let you down");
});

test("groupMeaningUnits merges dangling already + orphan Colored", () => {
  const units = groupMeaningUnits({
    currentSegments: [
      seg("a", "I was getting it cut and it had been already", 30, 32),
      seg("b", "Colored.", 32.05, 32.8),
      seg("c", "And I just remember looking over", 33.1, 35),
    ],
  });
  assert.equal(units.length, 2);
  assert.deepEqual(units[0]!.segmentIds, ["a", "b"]);
  assert.match(units[0]!.original, /already Colored/i);
  assert.equal(units[1]!.segmentIds[0], "c");
});

test("groupMeaningUnits merges sentence-final noun after false period", () => {
  const units = groupMeaningUnits({
    currentSegments: [
      seg(
        "a",
        "He's French-Canadian, so he speaks French as a first.",
        5,
        8,
      ),
      seg("b", "language.", 8, 8.2),
      seg("c", "And then he switched to English.", 8.6, 10),
    ],
  });
  assert.equal(units.length, 2);
  assert.deepEqual(units[0]!.segmentIds, ["a", "b"]);
  assert.match(units[0]!.original, /first\.? language/i);
  assert.equal(units[1]!.original, "And then he switched to English.");
});

test("groupMeaningUnits merges open 'our.' with following noun phrase", () => {
  const units = groupMeaningUnits({
    currentSegments: [
      seg(
        "a",
        "And we had no idea where to go, what our.",
        19,
        22,
      ),
      seg("b", "schedule could be, and a guy out of nowhere", 22, 25),
      seg("c", "And then things changed.", 25.5, 28),
    ],
  });
  assert.equal(units.length, 2);
  assert.deepEqual(units[0]!.segmentIds, ["a", "b"]);
  assert.match(units[0]!.original, /our\.? schedule/i);
});

test("groupMeaningUnits merges open 'the.' with following complement phrase", () => {
  const units = groupMeaningUnits({
    currentSegments: [
      seg(
        "a",
        "Everyone who's talked about you just says you are the.",
        0,
        3,
      ),
      seg("b", "Nicest, kindest man in all of Hollywood.", 3, 6),
      seg("c", "How does that make you feel?", 6.5, 8),
    ],
  });
  assert.equal(units.length, 2);
  assert.deepEqual(units[0]!.segmentIds, ["a", "b"]);
  assert.match(units[0]!.original, /the\.? Nicest/i);
  assert.match(units[0]!.original, /Hollywood/i);
  assert.equal(units[1]!.original, "How does that make you feel?");
});

test("groupMeaningUnits merges lonely name crumb into previous line", () => {
  const units = groupMeaningUnits({
    currentSegments: [
      seg(
        "a",
        "You play Spider-Man's other love interest Gwen",
        23,
        25,
      ),
      seg("b", "Stacy.", 25, 27),
      seg("c", "How did that feel?", 27.4, 29),
    ],
  });
  assert.equal(units.length, 2);
  assert.deepEqual(units[0]!.segmentIds, ["a", "b"]);
  assert.match(units[0]!.original, /Gwen Stacy/i);
  assert.equal(units[1]!.original, "How did that feel?");
});

test("groupMeaningUnits keeps standalone Yeah after finished sentence", () => {
  const units = groupMeaningUnits({
    currentSegments: [
      seg("a", "I don't buy that.", 0, 1.2),
      seg("b", "Yeah.", 1.35, 1.7),
    ],
  });
  assert.equal(units.length, 2);
});

test("groupMeaningUnits merges a split sentence into one unit", () => {
  const units = groupMeaningUnits({
    previousSegments: [
      seg(
        "p0",
        "We've been discussing whether this architecture is actually necessary.",
        0,
        3,
      ),
    ],
    currentSegments: [
      seg("a", "The reason I don't recommend this", 3.1, 4.2),
      seg("b", "is because you're basically adding", 4.25, 5.4),
      seg("c", "another layer of complexity", 5.45, 6.5),
      seg("d", "without getting much in return.", 6.55, 8),
    ],
    nextSegments: [
      seg("n0", "And that brings us to the alternative.", 8.2, 10),
    ],
  });

  assert.equal(units.length, 1);
  assert.deepEqual(units[0]!.segmentIds, ["a", "b", "c", "d"]);
  assert.match(units[0]!.original, /reason I don't recommend/);
  assert.match(units[0]!.original, /much in return/);
  assert.ok(units[0]!.previousTexts.length >= 1);
});

test("groupMeaningUnits keeps finished unpunctuated sentences separate", () => {
  const units = groupMeaningUnits({
    currentSegments: [
      seg("a", "I went to the store yesterday afternoon", 0, 2.4),
      seg("b", "My friend was waiting outside the door", 2.5, 5),
    ],
  });
  assert.equal(units.length, 2);
  assert.equal(units[0]!.original, "I went to the store yesterday afternoon");
  assert.equal(units[1]!.original, "My friend was waiting outside the door");
});

test("groupMeaningUnits splits fast speech without pauses or periods", () => {
  const units = groupMeaningUnits({
    currentSegments: [
      seg("a", "I need to leave right now", 0, 1.1),
      seg("b", "We can talk about this later", 1.15, 2.4),
      seg("c", "Call me when you get home", 2.45, 3.5),
    ],
  });
  assert.equal(units.length, 3);
  assert.equal(units[0]!.original, "I need to leave right now");
  assert.equal(units[1]!.original, "We can talk about this later");
  assert.equal(units[2]!.original, "Call me when you get home");
});

test("groupMeaningUnits does not glue lowercase ASR sentences", () => {
  const units = groupMeaningUnits({
    currentSegments: [
      seg("a", "i went to the store yesterday afternoon", 0, 2.2),
      seg("b", "my friend was waiting outside the door", 2.25, 4.6),
    ],
  });
  assert.equal(units.length, 2);
});

test("groupMeaningUnits merges a short unfinished line into the next fragment", () => {
  const units = groupMeaningUnits({
    currentSegments: [
      seg("a", "I was going to tell", 10, 11.1),
      seg("b", "You about the plan today", 11.3, 13),
    ],
  });
  assert.equal(units.length, 1);
  assert.match(units[0]!.original, /going to tell/i);
  assert.match(units[0]!.original, /about the plan/i);
});

test("refineMeaningUnits splits a 1st-pass run-on into two sentences", () => {
  const refined = refineMeaningUnits([
    {
      id: "mu-a",
      segmentIds: ["a"],
      startTime: 0,
      endTime: 4,
      original: "I need to leave right now We can talk about this later",
      previousTexts: [],
      nextTexts: [],
    },
  ]);
  assert.equal(refined.length, 2);
  assert.match(refined[0]!.original, /leave right now/i);
  assert.match(refined[1]!.original, /talk about this later/i);
  assert.ok(refined[0]!.endTime <= refined[1]!.startTime + 0.05);
});

test("refineMeaningUnits merges a leftover fragment after 1st-pass", () => {
  const refined = refineMeaningUnits([
    {
      id: "mu-a",
      segmentIds: ["a"],
      startTime: 10,
      endTime: 11.1,
      original: "I was going to tell",
      previousTexts: [],
      nextTexts: [],
    },
    {
      id: "mu-b",
      segmentIds: ["b"],
      startTime: 11.3,
      endTime: 13,
      original: "You about the plan today",
      previousTexts: [],
      nextTexts: [],
    },
  ]);
  assert.equal(refined.length, 1);
  assert.match(refined[0]!.original, /tell You about the plan/i);
});

test("groupMeaningUnits second pass splits a single run-on STT line", () => {
  const units = groupMeaningUnits({
    currentSegments: [
      seg(
        "a",
        "I need to leave right now We can talk about this later",
        0,
        4,
      ),
    ],
  });
  assert.equal(units.length, 2);
  assert.match(units[0]!.original, /leave right now/i);
  assert.match(units[1]!.original, /talk about this later/i);
});

test("groupMeaningUnits does not glue ordinary caption lines", () => {
  const units = groupMeaningUnits({
    currentSegments: [
      seg("a", "I wasn't unconscious!", 10, 11.2),
      seg("b", "Who are you?", 11.35, 12.1),
    ],
  });
  assert.equal(units.length, 2);
  assert.equal(units[0]!.startTime, 10);
  assert.equal(units[0]!.endTime, 11.2);
  assert.equal(units[1]!.startTime, 11.35);
});

test("naturalization fixture set covers 20+ diverse cases", () => {
  assert.ok(SUBTITLE_NATURALIZATION_CASES.length >= 20);
  const categories = new Set(
    SUBTITLE_NATURALIZATION_CASES.map((item) => item.category),
  );
  for (const needed of [
    "idiom",
    "hedge",
    "dev-terms",
    "long-sentence",
    "pronoun-context",
    "joke",
    "metaphor",
    "casual",
  ]) {
    assert.ok(categories.has(needed), `missing category ${needed}`);
  }
  for (const item of SUBTITLE_NATURALIZATION_CASES) {
    assert.notEqual(item.oldTranslation, item.improvedSubtitle);
    assert.ok(item.original.length > 0);
  }
});
