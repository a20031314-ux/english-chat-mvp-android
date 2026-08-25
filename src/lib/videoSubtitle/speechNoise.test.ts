import assert from "node:assert/strict";
import test from "node:test";
import {
  isNonSpeechMarker,
  isUsableSpeechSegment,
  looksLikeMusicBleed,
} from "./speechNoise.ts";

test("isNonSpeechMarker catches Whisper music tags", () => {
  assert.equal(isNonSpeechMarker("[Music]"), true);
  assert.equal(isNonSpeechMarker("[music playing]"), true);
  assert.equal(isNonSpeechMarker("♪"), true);
  assert.equal(isNonSpeechMarker("♪ hello ♪"), true);
  assert.equal(isNonSpeechMarker("Hello there."), false);
});

test("looksLikeMusicBleed drops high no_speech fragments", () => {
  assert.equal(
    looksLikeMusicBleed({ text: "la la la", noSpeechProb: 0.8 }),
    true,
  );
  assert.equal(
    looksLikeMusicBleed({
      text: "We should leave now.",
      noSpeechProb: 0.1,
      confidence: 0.9,
    }),
    false,
  );
  assert.equal(
    looksLikeMusicBleed({ text: "na na na na", noSpeechProb: 0.2 }),
    true,
  );
  assert.equal(
    looksLikeMusicBleed({
      text: "アメリカはですね、OpenAI、Claude、Geminiを使っています",
      noSpeechProb: 0.6,
      confidence: 0.22,
      uncertain: true,
    }),
    false,
  );
});

test("isUsableSpeechSegment keeps uncertain Japanese dialogue", () => {
  assert.equal(
    isUsableSpeechSegment({
      text: "アメリカはですね、OpenAI、Claude、Geminiを使っています",
      uncertain: true,
      confidence: 0.22,
    }),
    true,
  );
  assert.equal(
    isUsableSpeechSegment({
      text: "5",
      uncertain: true,
      confidence: 0.2,
    }),
    false,
  );
  assert.equal(
    isUsableSpeechSegment({
      text: "mm",
      uncertain: true,
      confidence: 0.2,
    }),
    false,
  );
});
