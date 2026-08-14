import assert from "node:assert/strict";
import test from "node:test";
import type { NormalizedSegment } from "./types.ts";
import {
  dialogueSectionsFromSegments,
  firstPlayableSection,
} from "./windows.ts";

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

test("dialogueSectionsFromSegments splits on pauses", () => {
  const sections = dialogueSectionsFromSegments([
    seg("a", "Hello there.", 0, 1.2),
    seg("b", "How are you?", 1.4, 2.5),
    // 2s gap → new section
    seg("c", "Anyway, about the architecture.", 4.6, 6.5),
    seg("d", "It adds complexity.", 6.7, 8),
  ]);
  assert.equal(sections.length, 2);
  assert.equal(sections[0]!.endIndex - sections[0]!.startIndex, 2);
  assert.equal(sections[1]!.startIndex, 2);
});

test("firstPlayableSection merges a tiny opener", () => {
  const sections = dialogueSectionsFromSegments([
    seg("a", "Hi.", 0, 0.6),
    seg("b", "Let's dig into React hooks today.", 2.2, 5),
    seg("c", "First, useState.", 6.5, 8),
  ]);
  const first = firstPlayableSection(sections);
  assert.ok(first);
  assert.ok(first!.endIndex - first!.startIndex >= 2);
  assert.ok(first!.end >= 5);
});
