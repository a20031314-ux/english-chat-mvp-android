import assert from "node:assert/strict";
import test from "node:test";
import { parseMyLanguages, toggleMyLanguage } from "./myLanguages.ts";

test("the current language is always in the list, first when it was missing", () => {
  assert.deepEqual(parseMyLanguages(null, "ja"), ["ja"]);
  assert.deepEqual(parseMyLanguages('["es","th"]', "ja"), ["ja", "es", "th"]);
  assert.deepEqual(parseMyLanguages('["es","th"]', "th"), ["es", "th"]);
});

test("broken or unknown values are dropped", () => {
  assert.deepEqual(parseMyLanguages("not json", "en"), ["en"]);
  assert.deepEqual(parseMyLanguages('["xx","es","es",3]', "en"), ["en", "es"]);
});

test("toggling adds and removes, but never the current or the last language", () => {
  assert.deepEqual(toggleMyLanguage(["ko"], "zh", "ko"), ["ko", "zh"]);
  assert.deepEqual(toggleMyLanguage(["ko", "zh"], "zh", "ko"), ["ko"]);
  assert.deepEqual(toggleMyLanguage(["ko", "zh"], "ko", "ko"), ["ko", "zh"]);
  assert.deepEqual(toggleMyLanguage(["ar"], "ar", "ar"), ["ar"]);
});
