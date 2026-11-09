import assert from "node:assert/strict";
import test from "node:test";
import { isKanaMora, spokenFormForTts, ttsSpeechInstructions } from "./speech.ts";
test("spokenFormForTts uses Spanish letter names", () => {
  assert.equal(spokenFormForTts("j", "es-ES"), "jota");
  assert.equal(spokenFormForTts("ñ", "es-ES"), "eñe");
  assert.equal(spokenFormForTts("Hola", "es-ES"), "Hola");
});

test("spokenFormForTts uses Portuguese letter names", () => {
  assert.equal(spokenFormForTts("j", "pt-PT"), "jota");
  assert.equal(spokenFormForTts("b", "pt-BR"), "bê");
  assert.equal(spokenFormForTts("Olá", "pt-PT"), "Olá");
});

test("spokenFormForTts reads Portuguese ne? as né, not letter names", () => {
  assert.equal(spokenFormForTts("ne?", "pt-PT"), "né");
  assert.equal(spokenFormForTts("né?", "pt-BR"), "né");
  assert.equal(spokenFormForTts("ne", "pt-PT"), "né");
});

test("한 박자 가나인지", () => {
  for (const mora of ["あ", "ん", "を", "っ", "ー", "ア", "きゃ", "ティ", "ファ", "シェ"]) assert.equal(isKanaMora(mora), true, mora);
  for (const word of ["あめ", "しごと", "がっこう", "hello", ""]) assert.equal(isKanaMora(word), false, word);
});

test("ttsSpeechInstructions lock Portuguese and Spanish", () => {
  const pt = ttsSpeechInstructions("pt-PT");
  assert.match(pt, /Portuguese/);
  assert.match(pt, /né/);
  assert.doesNotMatch(pt, /Spanish "j"/);
  const es = ttsSpeechInstructions("es-ES");
  assert.match(es, /Spanish/);
  assert.match(es, /jota/);
});
