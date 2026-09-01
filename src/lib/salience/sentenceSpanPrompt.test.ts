import assert from "node:assert/strict";
import { test } from "node:test";
import { getLanguageProfile } from "./languageProfiles.ts";
import {
  buildSentenceSpanPrompt,
  parseSentenceSpanAnalysis,
} from "./sentenceSpanPrompt.ts";

const jaKoBase = {
  sentence: "宿題を忘れてしまった。",
  spanText: "てしまった",
  language: "ja",
  nativeLanguage: "ko",
  explanationLanguage: "ko",
  translation: "숙제를 잊어버리고 말았다.",
} as const;

test("sentence-span prompt injects that language's profile axes only", () => {
  const ja = buildSentenceSpanPrompt(jaKoBase);
  const jaProfile = getLanguageProfile("ja");
  for (const dimension of jaProfile.activeDimensions) {
    assert.match(ja, new RegExp(`"${dimension}"`));
  }
  assert.match(ja, /Active sections[^]*syntax, usageInContext, morphology, pragmatics/);
  assert.match(ja, /honorifics/);
  assert.match(ja, /te-form chains/);
  assert.equal(ja.includes('"phonology"'), false);
  assert.equal(ja.includes('"etymology"'), false);
  assert.match(ja, /do not invent them/i);

  const en = buildSentenceSpanPrompt({
    sentence: "Have you been there before?",
    spanText: "been",
    language: "en",
    nativeLanguage: "ko",
    explanationLanguage: "ko",
  });
  assert.match(en, /etymology/);
  assert.match(en, /idiom origin/);
  assert.equal(en.includes('"phonology"'), false);
  assert.equal(en.includes('"pragmatics"'), false);

  const es = buildSentenceSpanPrompt({
    sentence: "Voy a echarlo de la fiesta.",
    spanText: "echarlo",
    language: "es",
    nativeLanguage: "ko",
    explanationLanguage: "ko",
  });
  assert.match(es, /phonology/);
  assert.match(es, /sinalefa/);
  assert.equal(es.includes('"etymology"'), false);
  assert.equal(es.includes('"pragmatics"'), false);
});

test("sentence-span prompt is for a user-selected range, not a scanner pick", () => {
  const prompt = buildSentenceSpanPrompt(jaKoBase);
  assert.match(prompt, /highlighted a range and tapped Analyze/);
  assert.match(prompt, /They chose the span/);
  assert.match(prompt, /Do not pick a different span/);
  assert.match(prompt, /숙제를 잊어버리고 말았다/);
  assert.match(prompt, /Do not retell it in meaningInContext/);
  assert.match(prompt, /meaningInContext is the selected span only/);
  assert.equal(prompt.includes("grammar.why"), false);
  assert.equal(prompt.includes("inThisSentence"), false);
});

test("sentence-span prompt locks Korean output and forbids English grammar labels", () => {
  const prompt = buildSentenceSpanPrompt(jaKoBase);
  assert.match(prompt, /ONLY in Korean Hangul/);
  assert.match(prompt, /Do not write the explanation in Japanese/);
  assert.match(prompt, /주어-목적어-동사/);
  assert.match(prompt, /OUTPUT LANGUAGE LOCK/);
  assert.match(prompt, /설명 문장은 전부 한국어로만/);
  assert.match(prompt, /Never SKIP meaningInContext/);
  assert.match(prompt, /BAD: 「てしまった」は後悔を表す普通体です/);
  assert.match(prompt, /never paste these labels/i);
});

test("sentence-span prompt asks for learning-language examples, not English teaching lines", () => {
  const prompt = buildSentenceSpanPrompt(jaKoBase);
  assert.match(prompt, /examples\[\]\.sentence MUST be written in Japanese/);
  assert.match(prompt, /Never write English example sentences unless the learning language is English/);
});

test("unknown language still uses the default profile with no code fork", () => {
  const prompt = buildSentenceSpanPrompt({
    sentence: "mmm x y",
    spanText: "x",
    language: "xx",
    nativeLanguage: "ko",
    explanationLanguage: "ko",
  });
  assert.match(prompt, /"syntax"/);
  assert.match(prompt, /"usageInContext"/);
  assert.match(prompt, /"morphology"/);
  assert.equal(prompt.includes('"phonology"'), false);
  assert.equal(prompt.includes('"pragmatics"'), false);
  assert.equal(prompt.includes('"etymology"'), false);
});

test("parseSentenceSpanAnalysis keeps meaning and drops SKIP dimensions", () => {
  const parsed = parseSentenceSpanAnalysis(
    {
      selectedText: "てしまった",
      meaningInContext: "잊어버리고 말았다",
      syntax: "SKIP",
      usageInContext: "이미 벌어진 일을 아쉬워할 때 씁니다.",
      morphology: "「てしまう」의 과거형입니다.",
      pragmatics: "skip",
      examples: [
        {
          sentence: "鍵をなくしてしまった。",
          meaning: "열쇠를 잃어버리고 말았다.",
        },
      ],
    },
    jaKoBase,
  );
  assert.ok(parsed);
  assert.equal(parsed.meaningInContext, "잊어버리고 말았다");
  assert.equal(parsed.dimensionResults.syntax, undefined);
  assert.equal(parsed.dimensionResults.pragmatics, undefined);
  assert.equal(
    parsed.dimensionResults.usageInContext,
    "이미 벌어진 일을 아쉬워할 때 씁니다.",
  );
  assert.equal(parsed.dimensionResults.morphology, "「てしまう」의 과거형입니다.");
  assert.equal(parsed.dimensionResults.phonology, undefined);
  assert.deepEqual(parsed.calledDimensions, getLanguageProfile("ja").activeDimensions);
  assert.equal(parsed.examples.length, 1);
  assert.equal(parsed.examples[0]?.sentence, "鍵をなくしてしまった。");
});

test("parseSentenceSpanAnalysis drops near-duplicate extra dimensions", () => {
  const same =
    '"been"은 "be"의 과거 분사형입니다. 경험이나 상태를 나타냅니다.';
  const parsed = parseSentenceSpanAnalysis(
    {
      meaningInContext: "가 본 적이 있다",
      syntax: same,
      usageInContext: same,
      morphology: same,
      etymology: same,
    },
    {
      sentence: "Have you been there before?",
      spanText: "been",
      language: "en",
    },
  );
  assert.ok(parsed);
  assert.ok(parsed.dimensionResults.usageInContext);
  assert.equal(parsed.dimensionResults.etymology, undefined);
  assert.equal(parsed.dimensionResults.syntax, undefined);
});
