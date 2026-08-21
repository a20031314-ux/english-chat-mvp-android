import assert from "node:assert/strict";
import test from "node:test";
import {
  findCharacterItem,
  findCharactersInText,
  getCharacterGuide,
  shouldShowCharacterGuide,
} from "./characterGuide/index.ts";

test("character guide is hidden for Latin learning languages", () => {
  assert.equal(shouldShowCharacterGuide("en", "ko"), false);
  assert.equal(shouldShowCharacterGuide("es", "ko"), false);
  assert.equal(shouldShowCharacterGuide("fr", "en"), false);
  assert.equal(shouldShowCharacterGuide("id", "ko"), false);
  assert.equal(shouldShowCharacterGuide("vi", "ko"), false);
});

test("character guide is hidden when UI already uses the same script", () => {
  assert.equal(shouldShowCharacterGuide("ja", "ja"), false);
  assert.equal(shouldShowCharacterGuide("ko", "ko"), false);
  assert.equal(shouldShowCharacterGuide("zh", "zh"), false);
  assert.equal(shouldShowCharacterGuide("ru", "ru"), false);
  assert.equal(shouldShowCharacterGuide("ar", "ar"), false);
});

test("character guide is shown when scripts differ", () => {
  assert.equal(shouldShowCharacterGuide("ja", "ko"), true);
  assert.equal(shouldShowCharacterGuide("zh", "ko"), true);
  assert.equal(shouldShowCharacterGuide("ru", "ko"), true);
  assert.equal(shouldShowCharacterGuide("ar", "en"), true);
  assert.equal(shouldShowCharacterGuide("ko", "en"), true);
});

test("Japanese guide has hiragana, katakana, and kanji", () => {
  const guide = getCharacterGuide("ja");
  assert.ok(guide);
  const ids = guide.categories.map((row) => row.id);
  assert.deepEqual(ids, ["hiragana", "katakana", "kanji"]);
  assert.ok(findCharacterItem("ja", "か")?.reading === "ka");
  assert.ok(findCharacterItem("ja", "カ")?.reading === "ka");
  assert.equal(findCharacterItem("ja", "学")?.character, "学");
});

test("Chinese lookup splits a word into characters", () => {
  const parts = findCharactersInText("zh", "学习");
  assert.equal(parts.map((item) => item.character).join(""), "学习");
  assert.equal(findCharacterItem("zh", "学")?.tone, 2);
});

test("Arabic letter matches a positional form", () => {
  const ba = findCharacterItem("ar", "ب");
  assert.ok(ba);
  assert.equal(findCharacterItem("ar", "بـ")?.id, ba.id);
});
