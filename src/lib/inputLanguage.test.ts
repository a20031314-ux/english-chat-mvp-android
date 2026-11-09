import assert from "node:assert/strict";
import { test } from "node:test";
import { writtenInLearningLanguage } from "./inputLanguage.ts";
test("Same language either side, or too short to tell, counts as practice", () => {
  assert.equal(writtenInLearningLanguage("hello", "en", "en"), true);
  assert.equal(writtenInLearningLanguage("ok", "es", "en"), true);
  assert.equal(writtenInLearningLanguage("", "es", "en"), true);
});

test("French and Spanish share é; a French reply still reads as French", () => {
  assert.equal(writtenInLearningLanguage("Ah génial ! T'as vu quoi, au musée ?", "fr", "es"), true);
});
