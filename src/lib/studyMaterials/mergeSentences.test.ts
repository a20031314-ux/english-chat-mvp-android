import assert from "node:assert/strict";
import test from "node:test";
import {
  imageOverlaysNeedRefresh,
  mergeOcrBoxesToSentences,
} from "./mergeSentences.ts";

test("mergeOcrBoxesToSentences joins line fragments into one sentence", () => {
  const merged = mergeOcrBoxesToSentences([
    { text: "than planned.", x: 0.1, y: 0.7, w: 0.3, h: 0.03 },
    { text: "A client called", x: 0.4, y: 0.7, w: 0.35, h: 0.03 },
    { text: "to change the meeting.", x: 0.1, y: 0.74, w: 0.6, h: 0.03 },
  ]);
  assert.equal(merged.length >= 1, true);
  assert.match(merged.map((row) => row.text).join(" "), /client/);
  for (const row of merged) {
    assert.ok(row.h <= 0.12, "line height should stay line-sized");
  }
});

test("mergeOcrBoxesToSentences keeps separate sentences apart", () => {
  const merged = mergeOcrBoxesToSentences([
    { text: "He was late.", x: 0.1, y: 0.2, w: 0.7, h: 0.04 },
    { text: "I waited outside.", x: 0.1, y: 0.28, w: 0.7, h: 0.04 },
  ]);
  assert.deepEqual(
    [...new Set(merged.map((row) => row.text))],
    ["He was late.", "I waited outside."],
  );
  assert.ok(Math.abs((merged[0]?.y ?? 0) - 0.2) < 0.01);
  assert.ok(Math.abs((merged[1]?.y ?? 0) - 0.28) < 0.01);
});

test("a tall OCR blob is not used as a hit region", () => {
  const merged = mergeOcrBoxesToSentences([
    {
      text: "He hadn't spoken to me since that morning. I couldn't figure out what he meant.",
      x: 0.08,
      y: 0.12,
      w: 0.55,
      h: 0.62,
    },
  ]);
  assert.equal(merged.length, 0);
});

test("wrapped sentence keeps original line boxes", () => {
  const merged = mergeOcrBoxesToSentences([
    { text: "I couldn't figure out", x: 0.1, y: 0.2, w: 0.5, h: 0.03 },
    { text: "what he meant.", x: 0.1, y: 0.24, w: 0.4, h: 0.03 },
  ]);
  assert.equal(merged.length, 2);
  assert.equal(merged[0]?.text, merged[1]?.text);
  assert.ok(Math.abs((merged[0]?.y ?? 0) - 0.2) < 0.01);
  assert.ok(Math.abs((merged[1]?.y ?? 0) - 0.24) < 0.01);
  assert.match(merged[0]?.text || "", /figure out/);
});

test("two sentences on one line stay in separate boxes", () => {
  const merged = mergeOcrBoxesToSentences([
    { text: "11:47", x: 0.08, y: 0.42, w: 0.08, h: 0.02 },
    { text: "p.m.", x: 0.17, y: 0.42, w: 0.06, h: 0.02 },
    { text: "His", x: 0.25, y: 0.42, w: 0.05, h: 0.02 },
    { text: "last", x: 0.31, y: 0.42, w: 0.05, h: 0.02 },
    { text: "train", x: 0.37, y: 0.42, w: 0.07, h: 0.02 },
    { text: "was", x: 0.45, y: 0.42, w: 0.05, h: 0.02 },
    { text: "leaving.", x: 0.51, y: 0.42, w: 0.1, h: 0.02 },
  ]);
  const texts = [...new Set(merged.map((row) => row.text))];
  assert.equal(texts.length, 2);
  const first = merged.filter((row) => /11:47|p\.m/.test(row.text));
  const maxRight = Math.max(...first.map((row) => row.x + row.w));
  assert.ok(
    maxRight < 0.25,
    `first sentence should not cover His, got ${maxRight}`,
  );
});

test("left and right columns are not read as one sentence", () => {
  const merged = mergeOcrBoxesToSentences([
    { text: "He", x: 0.08, y: 0.2, w: 0.05, h: 0.03 },
    { text: "waited.", x: 0.14, y: 0.2, w: 0.12, h: 0.03 },
    { text: "Useful", x: 0.68, y: 0.2, w: 0.12, h: 0.03 },
    { text: "Expressions", x: 0.81, y: 0.2, w: 0.14, h: 0.03 },
    { text: "Stay", x: 0.68, y: 0.28, w: 0.08, h: 0.03 },
    { text: "late.", x: 0.77, y: 0.28, w: 0.08, h: 0.03 },
    { text: "The", x: 0.08, y: 0.28, w: 0.06, h: 0.03 },
    { text: "train", x: 0.15, y: 0.28, w: 0.1, h: 0.03 },
    { text: "left.", x: 0.26, y: 0.28, w: 0.08, h: 0.03 },
  ]);
  const texts = [...new Set(merged.map((row) => row.text))];
  assert.equal(
    texts.some((text) => text.includes("waited") && text.includes("Useful")),
    false,
  );
  assert.equal(texts.some((text) => /He waited/.test(text)), true);
});

test("imageOverlaysNeedRefresh waits for Tesseract layout", () => {
  assert.equal(
    imageOverlaysNeedRefresh({
      id: "sec",
      paragraphs: [],
      imageDataUrl: "data:image/jpeg;base64,xx",
      overlays: [
        { sentenceId: "s1", paragraphId: "p", x: 0.1, y: 0.2, w: 0.5, h: 0.03 },
        { sentenceId: "s1", paragraphId: "p", x: 0.1, y: 0.24, w: 0.4, h: 0.03 },
      ],
    }),
    true,
  );
  assert.equal(
    imageOverlaysNeedRefresh({
      id: "sec",
      paragraphs: [],
      imageDataUrl: "data:image/jpeg;base64,xx",
      ocrEngine: "vision-sentences-1",
      overlays: [
        { sentenceId: "s1", paragraphId: "p", x: 0.1, y: 0.2, w: 0.5, h: 0.03 },
      ],
    }),
    false,
  );
});
