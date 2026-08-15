import assert from "node:assert/strict";
import test from "node:test";
import {
  cutOffsetFromRatio,
  mergeVideoCues,
  snapCutOffset,
  splitVideoCue,
} from "./videoCueEdit.ts";
import type { VideoSubtitle } from "./videoLearning.ts";

function cue(
  partial: Partial<VideoSubtitle> & Pick<VideoSubtitle, "id" | "original">,
): VideoSubtitle {
  return {
    startTime: 0,
    endTime: 4,
    translation: "옛 번역",
    translationStatus: "final",
    ...partial,
  };
}

test("snapCutOffset avoids mid-word cuts", () => {
  const text = "Hello wonderful world";
  assert.equal(snapCutOffset(text, 8), 6); // inside "wonderful" → before word
});

test("splitVideoCue cuts at user offset and clears translation", () => {
  const cues = [
    cue({
      id: "a",
      original: "Hello wonderful world today",
      startTime: 10,
      endTime: 20,
      translation: "안녕하세요",
    }),
  ];
  const next = splitVideoCue(cues, "a", "Hello wonderful".length);
  assert.ok(next);
  assert.equal(next!.length, 2);
  assert.equal(next![0]!.original, "Hello wonderful");
  assert.equal(next![1]!.original, "world today");
  assert.equal(next![0]!.translation, "");
  assert.equal(next![1]!.translation, "");
  assert.equal(next![0]!.translationStatus, "english");
  assert.ok(next![0]!.endTime > 10 && next![0]!.endTime < 20);
});

test("mergeVideoCues clears translation for re-gloss", () => {
  const cues = [
    cue({ id: "a", original: "Hello", startTime: 0, endTime: 1 }),
    cue({ id: "b", original: "world", startTime: 1, endTime: 2 }),
  ];
  const next = mergeVideoCues(cues, ["a", "b"]);
  assert.ok(next);
  assert.equal(next!.length, 1);
  assert.equal(next![0]!.original, "Hello world");
  assert.equal(next![0]!.translation, "");
  assert.equal(next![0]!.translationStatus, "english");
});

test("cutOffsetFromRatio follows the slider", () => {
  const text = "Hello wonderful world today";
  const cut = cutOffsetFromRatio(text, 0.5);
  assert.ok(cut != null && cut > 0 && cut < text.length);
});
