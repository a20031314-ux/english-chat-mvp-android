/**
 * Shared language-learning analysis contract and prompt guards.
 * Philosophy: understand the sentence first; expressions > isolated words;
 * grammar only when needed; never pad with textbook dumps.
 */

import { languageEvidence } from "./inputLanguage.ts";
import {
  interfaceLanguageName,
  learningLanguageName,
} from "./learningLanguages.ts";

export type LanguageLearningAnalysis = {
  naturalMeaning: string;
  keyExpressions: Array<{
    text: string;
    meaning: string;
    note?: string | null;
  }>;
  keyVocabulary: Array<{
    text: string;
    meaning: string;
    reading?: string | null;
  }>;
  nuance: string | null;
  optionalLanguageNote: string | null;
};

export const LANGUAGE_LEARNING_LIMITS = {
  maxExpressions: 3,
  maxVocabulary: 3,
} as const;

/**
 * Common instructions shared by chat / translate / analysis / gloss.
 * Combine with language-specific packs (especially English enhancement).
 */
export function commonLanguageInstructions(options: {
  targetLanguage: string;
  interfaceLanguage: string;
  targetLanguageName?: string;
  interfaceLanguageName?: string;
}): string {
  const targetName =
    options.targetLanguageName ??
    learningLanguageName(options.targetLanguage);
  const interfaceName =
    options.interfaceLanguageName ??
    interfaceLanguageDisplayName(options.interfaceLanguage);

  return `You are helping someone learn ${targetName}.
Their app UI / explanation language is ${interfaceName}.

Core learning order (always):
1) Whole sentence → natural meaning in ${interfaceName}
2) Useful expressions / chunks (0–${LANGUAGE_LEARNING_LIMITS.maxExpressions})
3) Key vocabulary (0–${LANGUAGE_LEARNING_LIMITS.maxVocabulary})
4) Nuance / tone when it matters
5) Short language note ONLY when needed to reuse the line

This is NOT a grammar textbook generator.
- Prefer natural paraphrase over word-for-word translation.
- Preserve register: casual/formal, humor, sarcasm, slang, politeness, intensity.
- Prefer reusable chunks over splitting every word/particle/morpheme.
- Slang, memes, and internet wording are valid learning items when they carry meaning.
- Do not invent learning points for very easy sentences — translation alone is fine.
- Do not dump full conjugation tables, part-of-speech lists, or etymology.
- Analyze ${targetName} in its own terms (never force English grammar labels onto other languages).
- Empty arrays / null are allowed when nothing is worth teaching.`;
}

export function interfaceLanguageDisplayName(locale: string): string {
  return interfaceLanguageName(locale);
}

/**
 * Learner-facing explanations must be in the UI language.
 * English→Korean keeps the Hangul-only extra; every other pair uses the same rule.
 */
export function explanationLanguageGuard(options: {
  interfaceLanguage: string;
  fieldsDescription?: string;
  learningLanguage?: string;
}): string {
  const interfaceName = interfaceLanguageDisplayName(options.interfaceLanguage);
  const fields = options.fieldsDescription
    ? ` (${options.fieldsDescription})`
    : "";
  const learningName = options.learningLanguage
    ? learningLanguageName(options.learningLanguage)
    : null;
  const notLearningLine =
    learningName &&
    learningName.toLowerCase() !== interfaceName.toLowerCase()
      ? `\n- Do not write the explanation in ${learningName}. Quote ${learningName} forms only, each inside quotes; grammar terms (tense, particle names), connecting words and sentence endings are always in ${interfaceName}, never glued onto ${learningName} characters.`
      : "";

  if (options.interfaceLanguage === "ko") {
    return `CRITICAL for learner-facing explanations${fields}:
- Write them ONLY in Korean Hangul (한국어). Every sentence of the explanation must be Korean.
- Never write the explanation in English, and never switch languages mid-paragraph.
- Do not use English grammar labels, acronyms, or Latin romaji (SOV, SVO, casual, benkyou, suru). If word order matters, say it in Korean (주어-목적어-동사).${notLearningLine}
- You may quote source-language words inside quotes or 「」. Do not add furigana, romaji, or a second-language sentence after the quote. Explain the quoted form in Korean.`;
  }

  if (options.interfaceLanguage === "en") {
    return `CRITICAL for learner-facing explanations${fields}:
- Write them ONLY in English.
- Do not switch into another language for the explanation.${notLearningLine}
- You may quote the learning-language forms inside quotes.`;
  }

  return `CRITICAL for learner-facing explanations${fields}:
- Write them ONLY in ${interfaceName}.
- Do not switch into English (or another language) for the explanation.${notLearningLine}
- You may quote source-language words inside quotes, but the explanation itself must be ${interfaceName}.`;
}

function stripQuotedLearnerForms(text: string): string {
  return text
    .replace(/[「『][^」』]{0,80}[」』]/g, " ")
    .replace(/["“”][^"“”]{0,80}["“”]/g, " ")
    // Guillemets and low-high quotes, as Russian, French and German tips quote.
    .replace(/[«‹][^»›]{0,80}[»›]/g, " ")
    .replace(/„[^“”]{0,80}[“”]/g, " ")
    .replace(/['‘’][^'‘’]{0,80}['‘’]/g, " ")
    .replace(/`[^`]{0,80}`/g, " ")
    .replace(/\*\*[^*]{0,80}\*\*/g, " ");
}

function languageBase(code: string | undefined): string {
  return (code ?? "").trim().toLowerCase().split(/[-_]/)[0] ?? "";
}

/**
 * True when a note meant for the learner is written in the language they
 * are learning rather than the one they read the app in. Quoted forms are
 * set aside first, since a note is supposed to quote the learning language;
 * what is left is the prose, and it should be mostly the app's language.
 */
export function explanationInLearningLanguage(
  text: string,
  interfaceLanguage: string,
  learningLanguage: string,
): boolean {
  if (languageBase(interfaceLanguage) === languageBase(learningLanguage)) return false;
  const evidence = languageEvidence(
    stripQuotedLearnerForms(text),
    languageBase(learningLanguage),
    languageBase(interfaceLanguage),
  );
  return evidence.learning > evidence.ui;
}
