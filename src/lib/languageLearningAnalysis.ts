/**
 * Shared language-learning analysis contract and prompt guards.
 * Philosophy: understand the sentence first; expressions > isolated words;
 * grammar only when needed; never pad with textbook dumps.
 */

import { learningLanguageName } from "@/lib/learningLanguages";

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
  const map: Record<string, string> = {
    ko: "Korean",
    en: "English",
    es: "Spanish",
    ja: "Japanese",
    zh: "Simplified Chinese",
    vi: "Vietnamese",
    fr: "French",
    pt: "Portuguese",
    id: "Indonesian",
    it: "Italian",
    ru: "Russian",
  };
  return map[locale] ?? "Korean";
}

/**
 * Learner-facing explanations must be in the UI language.
 * English→Korean keeps the Hangul-only extra; every other pair uses the same rule.
 */
export function explanationLanguageGuard(options: {
  interfaceLanguage: string;
  fieldsDescription?: string;
}): string {
  const interfaceName = interfaceLanguageDisplayName(options.interfaceLanguage);
  const fields = options.fieldsDescription
    ? ` (${options.fieldsDescription})`
    : "";

  if (options.interfaceLanguage === "ko") {
    return `CRITICAL for learner-facing explanations${fields}:
- Write them ONLY in Korean Hangul (한국어).
- Never write the explanation in English.
- You may quote source-language words inside quotes, but the explanation itself must be Korean.`;
  }

  if (options.interfaceLanguage === "en") {
    return `CRITICAL for learner-facing explanations${fields}:
- Write them ONLY in English.
- Do not switch into another language for the explanation.
- You may quote the learning-language forms inside quotes.`;
  }

  return `CRITICAL for learner-facing explanations${fields}:
- Write them ONLY in ${interfaceName}.
- Do not switch into English (or another language) for the explanation.
- You may quote source-language words inside quotes, but the explanation itself must be ${interfaceName}.`;
}

/** Clamp model output to shared limits. */
export function normalizeLanguageLearningAnalysis(
  raw: Partial<LanguageLearningAnalysis> | null | undefined,
): LanguageLearningAnalysis {
  const expressions = Array.isArray(raw?.keyExpressions)
    ? raw!.keyExpressions
        .filter(
          (e) =>
            e &&
            typeof e.text === "string" &&
            e.text.trim() &&
            typeof e.meaning === "string",
        )
        .slice(0, LANGUAGE_LEARNING_LIMITS.maxExpressions)
        .map((e) => ({
          text: e.text.trim(),
          meaning: e.meaning.trim(),
          note:
            typeof e.note === "string" && e.note.trim()
              ? e.note.trim()
              : null,
        }))
    : [];

  const vocabulary = Array.isArray(raw?.keyVocabulary)
    ? raw!.keyVocabulary
        .filter(
          (v) =>
            v &&
            typeof v.text === "string" &&
            v.text.trim() &&
            typeof v.meaning === "string",
        )
        .slice(0, LANGUAGE_LEARNING_LIMITS.maxVocabulary)
        .map((v) => ({
          text: v.text.trim(),
          meaning: v.meaning.trim(),
          reading:
            typeof v.reading === "string" && v.reading.trim()
              ? v.reading.trim()
              : null,
        }))
    : [];

  return {
    naturalMeaning:
      typeof raw?.naturalMeaning === "string" ? raw.naturalMeaning.trim() : "",
    keyExpressions: expressions,
    keyVocabulary: vocabulary,
    nuance:
      typeof raw?.nuance === "string" && raw.nuance.trim()
        ? raw.nuance.trim()
        : null,
    optionalLanguageNote:
      typeof raw?.optionalLanguageNote === "string" &&
      raw.optionalLanguageNote.trim()
        ? raw.optionalLanguageNote.trim()
        : null,
  };
}
