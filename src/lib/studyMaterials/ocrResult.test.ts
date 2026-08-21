import assert from "node:assert/strict";
import test from "node:test";
import {
  normalizeOcrBox,
  parseLooseModelJson,
  parseStudyOcrResult,
} from "./ocrResult.ts";

test("study OCR parser keeps paragraphs and a short title", () => {
  const result = parseStudyOcrResult({
    title: "Lesson 1",
    paragraphs: ["Hello there.", "  How are you?  ", ""],
  });
  assert.equal(result.title, "Lesson 1");
  assert.deepEqual(result.paragraphs, ["Hello there.", "How are you?"]);
  assert.equal(result.boxes.length, 2);
});

test("study OCR parser falls back to a text blob", () => {
  const result = parseStudyOcrResult({
    text: "First block.\n\nSecond block.",
  });
  assert.deepEqual(result.paragraphs, ["First block.", "Second block."]);
});

test("study OCR parser reads poster blocks with percent boxes", () => {
  const result = parseStudyOcrResult({
    title: "Sale",
    blocks: [
      { text: "OPEN", x: 10, y: 20, w: 40, h: 15 },
      { text: "TODAY", x: 0.1, y: 0.5, w: 0.8, h: 0.12 },
    ],
  });
  assert.deepEqual(result.paragraphs, ["OPEN", "TODAY"]);
  assert.equal(result.boxes[0]?.x, 0.1);
  assert.equal(result.boxes[0]?.y, 0.2);
  assert.equal(result.boxes[1]?.x, 0.1);
});

test("normalizeOcrBox rejects tiny regions", () => {
  assert.equal(normalizeOcrBox({ x: 0.1, y: 0.1, w: 0.001, h: 0.1 }), null);
});

test("parseLooseModelJson recovers a truncated blocks payload", () => {
  const parsed = parseLooseModelJson(
    '{"title":"Sale","blocks":[{"text":"OPEN","x":10,"y":20,"w":40,"h":15},{"text":"TO',
  ) as { title?: string; blocks?: Array<{ text?: string }> };
  assert.equal(parsed.title, "Sale");
  assert.equal(parsed.blocks?.[0]?.text, "OPEN");
});
