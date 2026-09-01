import assert from "node:assert/strict";
import { test } from "node:test";
import {
  analysisDimensionLabel,
  orderedDimensionEntries,
} from "./dimensionLabels.ts";

test("dimension labels follow the UI locale, not the learning language", () => {
  assert.equal(analysisDimensionLabel("ko", "pragmatics"), "말투");
  assert.equal(analysisDimensionLabel("en", "etymology"), "Origin");
  assert.equal(analysisDimensionLabel("ja", "morphology"), "形");
  assert.equal(analysisDimensionLabel("ko-KR", "syntax"), "통사");
  assert.equal(analysisDimensionLabel("xx", "syntax"), "Syntax");
});

test("orderedDimensionEntries skips empty axes and keeps profile order", () => {
  assert.deepEqual(
    orderedDimensionEntries({
      etymology: "  origin  ",
      syntax: "slot",
      phonology: "",
    }),
    [
      { dimension: "syntax", text: "slot" },
      { dimension: "etymology", text: "origin" },
    ],
  );
  assert.deepEqual(orderedDimensionEntries(undefined), []);
});
