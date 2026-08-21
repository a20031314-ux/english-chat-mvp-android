import test from "node:test";
import assert from "node:assert/strict";
import { selectionAnalysisTarget } from "./contentSelection.ts";

test("selectionAnalysisTarget reuses the existing analysis target shape", () => {
  const target = selectionAnalysisTarget({
    selectedText: "figure out",
    contextSentence: "I couldn't figure out what he meant.",
    previous: "He hadn't spoken to me since that morning.",
    next: "Eventually, I decided to bring it up.",
    language: "en",
  });
  assert.equal(target.selectedText, "figure out");
  assert.equal(target.contextSentence, "I couldn't figure out what he meant.");
  assert.deepEqual(target.context, [
    "He hadn't spoken to me since that morning.",
    "Eventually, I decided to bring it up.",
  ]);
  assert.equal(target.sourceType, "web");
  assert.equal(target.intent, "word");
  assert.equal(target.allowVocabSave, true);
});

test("selectionAnalysisTarget treats a full sentence as sentence intent", () => {
  const target = selectionAnalysisTarget({
    selectedText: "I couldn't figure out what he meant.",
  });
  assert.equal(target.intent, "sentence");
  assert.equal(target.contextSentence, "I couldn't figure out what he meant.");
});
