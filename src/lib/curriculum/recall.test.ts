import { test } from "node:test";
import assert from "node:assert/strict";
import { framesFor } from "./frames.ts";
import { recallFits } from "./recall.ts";

for (const language of ["ja", "es", "th"]) {
  const frames = framesFor(language, 1);
  test(`${language}: 틀 예문은 그 틀에 맞고, 다른 말은 안 맞는다`, () => {
    assert.ok(frames.length >= 5);
    for (const frame of frames.slice(0, 5)) assert.ok(recallFits(language, frame.examples[0]!.text, [frame]), `${frame.id} ${frame.examples[0]!.text}`);
    assert.equal(recallFits(language, "zzzz", [frames[0]!]), false);
  });
}
