import assert from "node:assert/strict";
import test from "node:test";
import {
  normalizeUnitTexts,
  snapToExpressionUnit,
} from "./expressionUnits.ts";

const SENTENCE =
  "I really enjoyed the movie last night because the story was so interesting.";

test("tapping a word does not snap to the whole sentence", () => {
  const snapped = snapToExpressionUnit(SENTENCE, "movie", [
    SENTENCE,
    "really enjoyed the movie last night because the story was so interesting",
  ]);
  assert.equal(snapped, null);
});

test("tapping a word inside a known phrase keeps the word", () => {
  const sentence = "I will look forward to the weekend.";
  const snapped = snapToExpressionUnit(sentence, "forward", [
    "look forward to",
    "weekend",
  ]);
  assert.equal(snapped, null);
});

test("tapping a content word keeps the word when a long grammar chunk also contains it", () => {
  const snapped = snapToExpressionUnit(SENTENCE, "movie", [
    "really enjoyed the movie last night because the story",
    "interesting",
  ]);
  assert.equal(snapped, null);
});

test("tapping a word in a short saying does not select the whole line", () => {
  const sentence = "See you later.";
  const snapped = snapToExpressionUnit(sentence, "See", ["See you later"]);
  assert.equal(snapped, null);
});

test("dragging a short phrase can still snap onto that phrase unit", () => {
  const sentence = "I will look forward to the weekend.";
  const snapped = snapToExpressionUnit(sentence, "look forward to", [
    "look forward to",
    "weekend",
  ]);
  assert.ok(snapped);
  assert.equal(snapped!.text, "look forward to");
});

test("normalizeUnitTexts drops a whole-sentence unit", () => {
  const units = normalizeUnitTexts(
    { units: [SENTENCE, "movie", "interesting"] },
    SENTENCE,
  );
  assert.deepEqual(units, ["movie", "interesting"]);
});
