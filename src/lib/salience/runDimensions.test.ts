import assert from "node:assert/strict";
import { test } from "node:test";
import { SUPPORTED_LEARNING_LANGUAGES } from "../learningLanguages.ts";
import { buildDimensionPrompt } from "./dimensionPrompts.ts";
import {
  DEFAULT_LANGUAGE_PROFILE,
  LANGUAGE_PROFILES,
  getLanguageProfile,
  languageProfileTableIsComplete,
  profileHasDimension,
} from "./languageProfiles.ts";
import { recordingDimensionCaller, runActiveDimensions } from "./runDimensions.ts";
import type { AnalysisDimension } from "./types.ts";

async function calledFor(language: string): Promise<AnalysisDimension[]> {
  const sink: AnalysisDimension[] = [];
  const result = await runActiveDimensions({
    sentence: "placeholder sentence for dimension routing",
    language,
    nativeLanguage: "ko",
    candidate: {
      tokenRange: { start: 0, end: 1 },
      originalText: "ended up",
      signalTags: ["phrasal_verb"],
    },
    callDimension: recordingDimensionCaller(sink),
  });
  return result.calledDimensions;
}

test("language profile table covers every learning language as add-row-only config", () => {
  assert.equal(languageProfileTableIsComplete(), true);
  const tableCodes = Object.keys(LANGUAGE_PROFILES).sort();
  const appCodes = SUPPORTED_LEARNING_LANGUAGES.map((lang) => lang.code).sort();
  assert.deepEqual(tableCodes, appCodes);

  const unknown = getLanguageProfile("xx");
  assert.deepEqual(unknown.activeDimensions, DEFAULT_LANGUAGE_PROFILE.activeDimensions);
});

test("English, Spanish, and Korean activate different dimension sets", async () => {
  const en = getLanguageProfile("en");
  const es = getLanguageProfile("es");
  const ko = getLanguageProfile("ko");

  assert.ok(profileHasDimension("en", "etymology"));
  assert.equal(profileHasDimension("es", "etymology"), false);
  assert.ok(profileHasDimension("es", "phonology"));
  assert.equal(profileHasDimension("en", "phonology"), false);
  assert.ok(profileHasDimension("ko", "pragmatics"));
  assert.equal(profileHasDimension("en", "pragmatics"), false);
  assert.equal(profileHasDimension("es", "pragmatics"), false);

  const [enCalled, esCalled, koCalled] = await Promise.all([
    calledFor("en"),
    calledFor("es"),
    calledFor("ko"),
  ]);

  assert.deepEqual(enCalled, en.activeDimensions);
  assert.deepEqual(esCalled, es.activeDimensions);
  assert.deepEqual(koCalled, ko.activeDimensions);
  assert.ok(!enCalled.includes("phonology"));
  assert.ok(esCalled.includes("phonology"));
  assert.ok(koCalled.includes("pragmatics"));
  assert.ok(!enCalled.includes("pragmatics"));

  console.info("[dimensions:profiles]", {
    en: en.activeDimensions,
    es: es.activeDimensions,
    ko: ko.activeDimensions,
  });
  console.info("[dimensions:called]", {
    en: enCalled,
    es: esCalled,
    ko: koCalled,
  });

  const esPhonology = buildDimensionPrompt("phonology", {
    language: "es",
    languageName: "Spanish",
    nativeLanguage: "ko",
    explanationLanguage: "ko",
    sentence: "Voy a echarlo de la fiesta.",
    spanText: "echarlo",
    signalTags: ["clitic"],
    focus: es.dimensionFocus.phonology ?? [],
  });
  const koPragmatics = buildDimensionPrompt("pragmatics", {
    language: "ko",
    languageName: "Korean",
    nativeLanguage: "en",
    explanationLanguage: "en",
    sentence: "선생님께서 들어오셨어요.",
    spanText: "들어오셨어요",
    signalTags: ["honorific"],
    focus: ko.dimensionFocus.pragmatics ?? [],
  });
  assert.match(esPhonology, /sinalefa/i);
  assert.match(koPragmatics, /존댓말/);
});

test("unknown language still runs using the default profile (no code fork)", async () => {
  const called = await calledFor("xx");
  assert.deepEqual(called, DEFAULT_LANGUAGE_PROFILE.activeDimensions);
});
