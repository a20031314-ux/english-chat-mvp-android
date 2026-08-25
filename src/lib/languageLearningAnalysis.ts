/**
 * Shared language-learning analysis contract and prompt guards.
 * Philosophy: understand the sentence first; expressions > isolated words;
 * grammar only when needed; never pad with textbook dumps.
 */

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
      ? `\n- Do not write the explanation in ${learningName}. Quote ${learningName} forms only.`
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

const LATIN_SCRIPT_LEARNING = new Set([
  "en",
  "es",
  "fr",
  "it",
  "pt",
  "id",
  "vi",
]);

function stripQuotedLearnerForms(text: string): string {
  return text
    .replace(/[「『][^」』]{0,80}[」』]/g, " ")
    .replace(/["“”][^"“”]{0,80}["“”]/g, " ")
    .replace(/['‘’][^'‘’]{0,80}['‘’]/g, " ")
    .replace(/`[^`]{0,80}`/g, " ")
    .replace(/\*\*[^*]{0,80}\*\*/g, " ");
}

function languageBase(code: string | undefined): string {
  return (code ?? "").trim().toLowerCase().split(/[-_]/)[0] ?? "";
}

/**
 * True when learner-facing prose mixed in the learning language or English
 * metalanguage. Quoted source forms are ignored.
 */
export function explanationLooksMixedLanguage(
  text: string,
  explanationLanguage: string,
  learningLanguage?: string,
): boolean {
  const trimmed = text.trim();
  if (!trimmed || /^skip$/i.test(trimmed)) return false;

  const body = stripQuotedLearnerForms(trimmed);
  const hangul = (body.match(/[\uac00-\ud7af]/g) || []).length;
  const kana = (body.match(/[\u3040-\u30ff]/g) || []).length;
  const kanji = (body.match(/[\u3400-\u9fff]/g) || []).length;
  const latin = (body.match(/[A-Za-z]/g) || []).length;
  const latinWords = body.match(/[A-Za-z]{3,}/g) ?? [];
  const learning = languageBase(learningLanguage);

  if (explanationLanguage === "ko") {
    if (kana >= 8 && kana >= hangul) return true;
    if (kana >= 12) return true;
    if (hangul < 6 && kana + kanji >= 16) return true;
    if (/です|ます|という|だった|ですね/.test(body)) return true;
    if (/\b(SOV|SVO|VSO|OVS|OSV|VOS)\b/.test(body)) return true;
    if (learning && !LATIN_SCRIPT_LEARNING.has(learning)) {
      const romajiLike = latinWords.filter((word) => word.length >= 4);
      if (romajiLike.length > 0) return true;
    } else if (hangul < 6 && latin >= 20) {
      return true;
    }
    return false;
  }

  if (explanationLanguage === "en") {
    if (hangul >= 8) return true;
    if (kana >= 8) return true;
    return false;
  }

  if (kana >= 12 && kana > latin) return true;
  if (hangul >= 12 && hangul > latin) return true;
  return false;
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
