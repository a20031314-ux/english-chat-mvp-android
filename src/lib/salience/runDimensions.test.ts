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

  const jaSyntaxKoUi = buildDimensionPrompt("syntax", {
    language: "ja",
    languageName: "Japanese",
    nativeLanguage: "ko",
    explanationLanguage: "ko",
    sentence: "毎日勉強する。",
    spanText: "勉強する",
    signalTags: ["key_expression"],
    focus: ["SOV", "particles as case"],
  });
  assert.match(jaSyntaxKoUi, /ONLY in Korean Hangul/);
  assert.match(jaSyntaxKoUi, /Do not write the explanation in Japanese/);
  assert.match(jaSyntaxKoUi, /주어-목적어-동사/);
  assert.match(jaSyntaxKoUi, /OUTPUT LANGUAGE LOCK/);
  assert.match(jaSyntaxKoUi, /설명 문장은 전부 한국어로만/);
  assert.match(jaSyntaxKoUi, /BAD: 「勉強する」は普通体です/);
  assert.match(jaSyntaxKoUi, /Do not SKIP only because the span is written in Japanese/);
  assert.equal(jaSyntaxKoUi.includes("Write learner-facing text in ko"), false);
  assert.match(jaSyntaxKoUi, /never paste these labels/i);
});

test("unknown language still runs using the default profile (no code fork)", async () => {
  const called = await calledFor("xx");
  assert.deepEqual(called, DEFAULT_LANGUAGE_PROFILE.activeDimensions);
});

test("tag-like salience reasons are not shown as learner copy", async () => {
  const result = await runActiveDimensions({
    sentence: "毎日勉強する。",
    language: "ja",
    nativeLanguage: "ko",
    candidate: {
      tokenRange: { start: 0, end: 1 },
      originalText: "勉強する",
      signalTags: ["key_expression"],
    },
    salienceReason: "key_expression",
    callDimension: async () => "SKIP",
  });
  assert.equal(result.salienceReason, "");
});

test("near-duplicate dimension copy is dropped", async () => {
  const same =
    '"been"은 "be"의 과거 분사형입니다. 경험이나 상태를 나타냅니다.';
  const result = await runActiveDimensions({
    sentence: "Have you been there before?",
    language: "en",
    nativeLanguage: "ko",
    candidate: {
      tokenRange: { start: 0, end: 1 },
      originalText: "been",
      signalTags: ["irregular_verb"],
    },
    callDimension: async () => same,
  });
  assert.ok(result.dimensionResults.usageInContext);
  assert.equal(result.dimensionResults.etymology, undefined);
  assert.equal(result.dimensionResults.syntax, undefined);
});

test("etymology prompt tells the model to skip plain verb forms", () => {
  const prompt = buildDimensionPrompt("etymology", {
    language: "en",
    languageName: "English",
    nativeLanguage: "ko",
    explanationLanguage: "ko",
    sentence: "Have you been there before?",
    spanText: "been",
    signalTags: ["irregular_verb"],
    focus: ["idiom origin"],
    siblingDimensions: ["syntax", "usageInContext", "morphology", "etymology"],
  });
  assert.match(prompt, /plain\/irregular form/);
  assert.match(prompt, /do not repeat their facts/i);
  assert.match(prompt, /usageInContext/);
});
