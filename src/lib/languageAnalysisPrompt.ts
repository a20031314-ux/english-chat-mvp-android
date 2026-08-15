import {
  naturalTranslationPrinciples,
  type TranslationSourceType,
} from "@/lib/naturalTranslation";
import {
  commonLanguageInstructions,
  LANGUAGE_LEARNING_LIMITS,
} from "@/lib/languageLearningAnalysis";
import { learningLanguageName } from "@/lib/learningLanguages";

export const LEARNER_LEVELS = ["beginner", "intermediate", "advanced"] as const;
export type LearnerLevel = (typeof LEARNER_LEVELS)[number];

export const ANALYSIS_LANGUAGES: Record<string, string> = {
  ko: "Korean (한국어)",
  en: "English",
  es: "Spanish",
  ja: "Japanese",
  zh: "Simplified Chinese",
  vi: "Vietnamese",
  fr: "French",
  pt: "Portuguese",
  id: "Indonesian",
};

export function asLearnerLevel(value: unknown): LearnerLevel | undefined {
  return typeof value === "string" &&
    (LEARNER_LEVELS as readonly string[]).includes(value)
    ? (value as LearnerLevel)
    : undefined;
}

function levelHint(level?: LearnerLevel): string {
  if (level === "beginner") {
    return "Learner level: beginner. Prefer core words, reading/pronunciation when the writing system is hard, and the one structure that unlocks the sentence. Do not hide a meaning-critical item.";
  }
  if (level === "advanced") {
    return "Learner level: advanced. Prefer nuance, register, collocation, and non-obvious grammar. Skip elementary labels unless they are the whole point.";
  }
  if (level === "intermediate") {
    return "Learner level: intermediate. Prefer reusable chunks, patterns, and collocations over isolated beginner words.";
  }
  return "Learner level unknown. Prefer items that unlock meaning and reuse; skip what the translation already makes obvious.";
}

function usefulAnalysisPhilosophy(): string {
  return `You are a language-agnostic analysis engine for learners.

Goal: help them understand THIS sentence in a few seconds, and reuse what is worth learning. Not a complete linguistic parse. Not a grammar textbook.

USEFUL ANALYSIS > COMPLETE ANALYSIS.

Do not force a checklist (always grammar / always tense / always prepositions / always pronunciation / always every word).
Detect the language. Analyze it in ITS own terms. Never explain Japanese or Spanish as if they were English grammar.

Select only what scores high on:
1) Would missing this cause a wrong reading?
2) Is it reusable in other sentences?
3) Is it hard to get from a plain translation?
4) Is it an important structure in this language?
5) Is it new/useful at this learner level?
6) Is there a native nuance (slang, hedge, speech-act) that matters?

Prefer meaningful chunks (end up ~ing, 見に行く, Si tuviera...) over splitting every word/particle/character.
Slang, idiom, meme, and nuance can be THE element. Do not invent extra grammar to fill a quota.
If writing/morphology matters HERE (kanji reading, conjugation, mood), include it. If not, skip it.
Do not dump etymology, full paradigm tables, every dictionary sense, or every exception.`;
}

function sourceLanguageHint(hint?: string): string {
  if (hint) {
    return `Caller language hint: ${hint}. Still verify from the actual sentence. Analyze in that language's own terms.`;
  }
  return "Detect the source language from the sentence. Do not assume English.";
}

function resolveAnalysisLanguages(options: {
  locale: string;
  interfaceLanguage?: string;
  targetLanguage?: string;
  languageHint?: string;
}) {
  const interfaceLanguage = options.interfaceLanguage ?? options.locale;
  const targetLanguage = options.targetLanguage ?? "en";
  const languageHint =
    options.languageHint?.trim() ||
    learningLanguageName(targetLanguage);
  return { interfaceLanguage, targetLanguage, languageHint };
}

export function languageOverviewSystem(options: {
  locale: string;
  sourceType: TranslationSourceType;
  languageHint?: string;
  learnerLevel?: LearnerLevel;
  targetLanguage?: string;
  interfaceLanguage?: string;
}): string {
  const { interfaceLanguage, targetLanguage, languageHint } =
    resolveAnalysisLanguages(options);
  const language =
    ANALYSIS_LANGUAGES[interfaceLanguage] ?? ANALYSIS_LANGUAGES.ko;
  const mustBeKorean =
    interfaceLanguage === "ko"
      ? `
Write translation, correctionNote, element.label (learner-facing part), element.gloss, and element.reading labels in Korean Hangul where those fields are explanations.
element.text MUST be an exact substring of the source.
element.label may mix source script with a short Korean gloss cue (映画・えいが, ended up ~ing).
`
      : "";

  const maxElements = LANGUAGE_LEARNING_LIMITS.maxExpressions;

  return `${commonLanguageInstructions({
    targetLanguage,
    interfaceLanguage,
  })}

${usefulAnalysisPhilosophy()}

Write learner-facing text in ${language}.
${mustBeKorean}
${sourceLanguageHint(languageHint)}
${levelHint(options.learnerLevel)}

First give the natural meaning of the WHOLE sentence, then 0–${maxElements} key elements (prefer ≤${maxElements}; 1–2 if the sentence is very simple). Never pad to 5–10. Empty elements is fine when translation alone is enough.

translation = natural ${language} for THIS sentence. No lecture inside translation.
${naturalTranslationPrinciples({
  locale: interfaceLanguage,
  targetLanguage,
  interfaceLanguage,
  role: "utterance",
  sourceType: options.sourceType,
})}

Return ONLY JSON:
{
  "input": "source as written, light cleanup only",
  "language": "iso-like code you detected, e.g. en, ja, es, zh",
  "translation": "natural meaning in ${language}",
  "correctionNote": "only if the source is clearly broken AND that would mislead, else empty",
  "elements": [
    {
      "text": "exact substring from input",
      "label": "ended up ~ing",
      "gloss": "1–3 short sentences: meaning HERE, not a dictionary list",
      "reading": "optional: えいが / pinyin / etc. Only if useful"
    }
  ]
}

Element rules:
- text is a real span from input (same characters).
- label is what the learner should remember (chunk shape, word+reading, pattern name).
- gloss is THIS-sentence meaning only. Other senses wait for detail view.
- reading only when the script/form is a real learning target in THIS sentence.
- Do not list every particle, every kanji, every word.`;
}

export function languageElementSystem(options: {
  locale: string;
  sourceType?: TranslationSourceType;
  languageHint?: string;
  learnerLevel?: LearnerLevel;
  targetLanguage?: string;
  interfaceLanguage?: string;
}): string {
  const { interfaceLanguage, targetLanguage, languageHint } =
    resolveAnalysisLanguages(options);
  const language =
    ANALYSIS_LANGUAGES[interfaceLanguage] ?? ANALYSIS_LANGUAGES.ko;
  const mustBeKorean =
    interfaceLanguage === "ko"
      ? `
Write meaningInContext, whyUsed, example translations, and otherUsages.meaning in Korean Hangul.
Keep source-language forms in title, pattern, reading, and example.english/text.
`
      : "";

  return `${commonLanguageInstructions({
    targetLanguage,
    interfaceLanguage,
  })}

${usefulAnalysisPhilosophy()}

This request is ELEMENT DETAIL (the zoom-in). The learner already saw a short gloss. Now explain ONE selected span inside ONE sentence.

Write learner-facing text in ${language}.
${mustBeKorean}
${sourceLanguageHint(languageHint)}
${levelHint(options.learnerLevel)}

Default shape (keep short):
1) meaning in THIS sentence (one line)
2) why it is used this way here (2–4 spoken sentences)
3) reuse pattern if there is one
4) 1–2 new example sentences
Extra fields only if they prevent a real confusion (contrasting use, look-alike form).

meaningInContext follows:
${naturalTranslationPrinciples({
  locale: interfaceLanguage,
  targetLanguage,
  interfaceLanguage,
  role: "meaning-in-context",
  sourceType: options.sourceType ?? "unknown",
})}

Judge the span from selectedText + the whole sentence + neighbors. Same letters can be different grammar or slang ("I'm cooked" vs food cooked). Do not decide from the string alone.
If this span is slang/idiom/nuance, say that. Do not invent grammar to look thorough.
If form matters (conjugation, particles, mood, kanji), explain THAT form in this language's own terms.
If a word-for-word calque helps, put ONE contrast inside whyUsed — never as meaningInContext.

Return ONLY JSON:
{
  "selectedText": "...",
  "contextSentence": "...",
  "title": "short label of THIS use",
  "reading": "optional pronunciation/form (えいが, tuviera ← tener)",
  "meaningInContext": "one short line: meaning HERE",
  "whyUsed": "why this sentence uses it this way",
  "pattern": "reuse pattern or empty",
  "examples": [
    { "english": "example in the SOURCE language", "translation": "natural ${language}" }
  ],
  "otherUsages": [
    { "pattern": "...", "meaning": "...", "examples": [{ "english": "...", "translation": "..." }] }
  ]
}

Rules:
- Omit empty fields. Do not pad every section. Do not write a long lecture.
- examples: 0–2 NEW sentences in the source language, never a repeat of the context sentence.
- otherUsages: only a contrast the learner should know now.
- title: short. Not a chapter heading.`;
}
