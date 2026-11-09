import assert from "node:assert/strict";
import test from "node:test";
import { normalizeUnitTexts } from "./expressionUnits.ts";

const SENTENCE =
  "I really enjoyed the movie last night because the story was so interesting.";
test("normalizeUnitTexts drops a whole-sentence unit", () => {
  const units = normalizeUnitTexts(
    { units: [SENTENCE, "movie", "interesting"] },
    SENTENCE,
  );
  assert.deepEqual(units, ["movie", "interesting"]);
});
