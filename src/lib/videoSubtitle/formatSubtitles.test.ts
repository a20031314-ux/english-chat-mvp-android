import assert from "node:assert/strict";
import test from "node:test";
import { formatSubtitleDrafts } from "./formatSubtitles.ts";

const tone = {
  formality: "neutral",
  politeness: "neutral",
  intimacy: "neutral",
  emotion: "neutral",
  intensity: "medium",
  confidence: "medium",
  hesitation: "none",
  humor: "none",
  sarcasm: "none",
  attitude: "neutral",
};

function draft(input: {
  id: string;
  original: string;
  naturalSubtitle: string;
  analysisTranslation?: string;
  startTime?: number;
  endTime?: number;
}) {
  return {
    id: input.id,
    segmentIds: [input.id],
    startTime: input.startTime ?? 0,
    endTime: input.endTime ?? 2,
    original: input.original,
    meaning: input.original,
    tone,
    speakerStyle: "spoken",
    naturalSubtitle: input.naturalSubtitle,
    analysisTranslation: input.analysisTranslation,
    interpretationConfidence: 0.8,
  };
}

test("formatSubtitleDrafts copies analysisTranslation onto cues, not the caption", () => {
  const cues = formatSubtitleDrafts([
    draft({
      id: "a",
      original: "The reason I don't recommend this is complexity.",
      naturalSubtitle: "괜히 복잡해져",
      analysisTranslation: "제가 이걸 추천하지 않는 이유는 복잡해서예요",
    }),
  ]);
  assert.equal(cues.length, 1);
  assert.equal(cues[0]!.translation, "괜히 복잡해져");
  assert.equal(
    cues[0]!.analysisTranslation,
    "제가 이걸 추천하지 않는 이유는 복잡해서예요",
  );
});

test("formatSubtitleDrafts omits analysisTranslation when it matches the caption", () => {
  const cues = formatSubtitleDrafts([
    draft({
      id: "a",
      original: "Yeah.",
      naturalSubtitle: "그래",
      analysisTranslation: "그래",
    }),
  ]);
  assert.equal(cues[0]!.analysisTranslation, undefined);
});

test("a cue never runs past the next one, however far it overran", () => {
  const cues = formatSubtitleDrafts([
    draft({
      id: "a",
      original: "First line that overruns badly.",
      naturalSubtitle: "첫 줄",
      startTime: 0,
      endTime: 9,
    }),
    draft({
      id: "b",
      original: "Second line.",
      naturalSubtitle: "둘째 줄",
      startTime: 3,
      endTime: 5,
    }),
  ]);
  assert.equal(cues.length, 2);
  // 6s of overrun used to be left alone, so both cues covered 3s-9s at once.
  assert.equal(cues[0]!.endTime, 3);
  assert.ok(cues[0]!.endTime <= cues[1]!.startTime);
});

test("a short cue still keeps a minimum length when the next starts immediately", () => {
  const cues = formatSubtitleDrafts([
    draft({
      id: "a",
      original: "Tiny.",
      naturalSubtitle: "짧음",
      startTime: 10,
      endTime: 10.05,
    }),
    draft({
      id: "b",
      original: "Right after.",
      naturalSubtitle: "바로 다음",
      startTime: 10.1,
      endTime: 12,
    }),
  ]);
  assert.equal(cues[0]!.endTime, 10.25);
});
