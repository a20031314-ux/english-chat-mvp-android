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
}) {
  return {
    id: input.id,
    segmentIds: [input.id],
    startTime: 0,
    endTime: 2,
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
