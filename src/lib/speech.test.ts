import assert from "node:assert/strict";
import test from "node:test";
import {
  canUseLocalSpeechVoice,
  pickSpeechVoice,
  spokenFormForTts,
  speechLangCandidates,
  ttsSpeechInstructions,
} from "./speech.ts";

test("pickSpeechVoice prefers a Spanish voice over English", () => {
  const voices = [
    { lang: "en-US", name: "Google US English" },
    { lang: "es-MX", name: "Google español de México" },
    { lang: "es-ES", name: "Google español" },
  ];
  const picked = pickSpeechVoice(voices, "es-ES");
  assert.equal(picked?.lang, "es-ES");
});

test("pickSpeechVoice accepts underscore tags and pt-BR for Portuguese", () => {
  const voices = [
    { lang: "en-US", name: "English" },
    { lang: "pt_BR", name: "Portuguese (Brazil)" },
  ];
  const picked = pickSpeechVoice(voices, "pt-PT");
  assert.equal(picked?.lang, "pt_BR");
});

test("pickSpeechVoice does not fall back to English for Spanish", () => {
  const voices = [{ lang: "en-US", name: "English" }];
  assert.equal(pickSpeechVoice(voices, "es-ES"), null);
});

test("speechLangCandidates for Portuguese include Brazil", () => {
  const tags = speechLangCandidates("pt-PT").map((tag) => tag.toLowerCase());
  assert.ok(tags.includes("pt-br"));
  assert.ok(tags.includes("pt-pt"));
});

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

test("pickSpeechVoice matches Portuguese by voice name", () => {
  const voices = [
    { lang: "en-US", name: "Microsoft David" },
    { lang: "", name: "Microsoft Maria - Portuguese (Brazil)" },
  ];
  const picked = pickSpeechVoice(voices, "pt-PT");
  assert.equal(picked?.name, "Microsoft Maria - Portuguese (Brazil)");
});

test("English-only voices are not used for Portuguese", () => {
  const voices = [
    { lang: "en-US", name: "Google US English" },
    { lang: "en-GB", name: "Microsoft Hazel" },
  ];
  assert.equal(pickSpeechVoice(voices, "pt-PT"), null);
  assert.equal(canUseLocalSpeechVoice(voices[0], "pt-PT"), false);
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
