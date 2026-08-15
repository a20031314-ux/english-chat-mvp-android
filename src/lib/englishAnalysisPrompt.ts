/**
 * Frozen English analysis prompts.
 * Used ONLY when targetLanguage === "en".
 * Do not replace these with adaptive/generic multilingual prompts.
 */

import {
  naturalTranslationPrinciples,
  type TranslationSourceType,
} from "@/lib/naturalTranslation";
import {
  ANALYSIS_LANGUAGES,
  type LearnerLevel,
} from "@/lib/languageAnalysisPrompt";

function englishLevelHint(level?: LearnerLevel): string {
  if (level === "beginner") {
    return "Learner level: beginner. Prefer core words, clear patterns, and the one structure that unlocks the sentence.";
  }
  if (level === "advanced") {
    return "Learner level: advanced. Prefer nuance, register, collocation, and non-obvious grammar. Skip elementary labels unless they are the whole point.";
  }
  if (level === "intermediate") {
    return "Learner level: intermediate. Prefer reusable chunks, patterns, and collocations over isolated beginner words.";
  }
  return "Learner level unknown. Prefer items that unlock meaning and reuse; skip what the translation already makes obvious.";
}

/**
 * English sentence overview — existing English learning pipeline.
 */
export function englishOverviewSystem(options: {
  locale: string;
  interfaceLanguage?: string;
  sourceType: TranslationSourceType;
  learnerLevel?: LearnerLevel;
}): string {
  const interfaceLanguage = options.interfaceLanguage ?? options.locale;
  const language =
    ANALYSIS_LANGUAGES[interfaceLanguage] ?? ANALYSIS_LANGUAGES.ko;
  const mustBeKorean =
    interfaceLanguage === "ko"
      ? `
Write translation, correctionNote, element.label (learner-facing part), element.gloss, and element.reading labels in Korean Hangul where those fields are explanations.
element.text MUST be an exact substring of the English source.
element.label may mix English with a short Korean gloss cue (ended up ~ing).
`
      : "";

  return `You analyze ENGLISH sentences for language learners.

Goal: help them understand THIS English sentence in a few seconds, and reuse what is worth learning. Not a complete linguistic parse. Not a grammar textbook.

USEFUL ANALYSIS > COMPLETE ANALYSIS.

Select only what scores high on:
1) Would missing this cause a wrong reading of the English?
2) Is it reusable in other English sentences?
3) Is it hard to get from a plain translation?
4) Is it an important English structure, collocation, or idiom?
5) Is it new/useful at this learner level?
6) Is there a native nuance (slang, hedge, speech-act) that matters?

Prefer meaningful English chunks (end up ~ing, looking forward to, might as well) over splitting every word.
Slang, idiom, meme, and nuance can be THE element. Do not invent extra grammar to fill a quota.
Do not dump etymology, full paradigm tables, every dictionary sense, or every exception.

Write learner-facing text in ${language}.
${mustBeKorean}
${englishLevelHint(options.learnerLevel)}

First give the natural meaning of the WHOLE English sentence, then 0–4 key elements (1–2 if very simple). Never pad to 5–10. Empty elements is fine when translation alone is enough.

translation = natural ${language} for THIS sentence. No lecture inside translation.
${naturalTranslationPrinciples({
  locale: interfaceLanguage,
  targetLanguage: "en",
  interfaceLanguage,
  role: "utterance",
  sourceType: options.sourceType,
})}

Return ONLY JSON:
{
  "input": "English as written, light cleanup only",
  "language": "en",
  "translation": "natural meaning in ${language}",
  "correctionNote": "only if the English is clearly broken AND that would mislead, else empty",
  "elements": [
    {
      "text": "exact substring from input",
      "label": "ended up ~ing",
      "gloss": "1–3 short sentences: meaning HERE, not a dictionary list",
      "reading": "optional; usually empty for English"
    }
  ]
}

Element rules:
- text is a real span from the English input (same characters).
- label is what the learner should remember (chunk shape, pattern name).
- gloss is THIS-sentence meaning only. Other senses wait for detail view.
- Do not list every word or force subject/verb/object labels on easy sentences.`;
}

/**
 * English element detail — existing English learning pipeline.
 */
export function englishElementSystem(options: {
  locale: string;
  interfaceLanguage?: string;
  sourceType?: TranslationSourceType;
  learnerLevel?: LearnerLevel;
}): string {
  const interfaceLanguage = options.interfaceLanguage ?? options.locale;
  const language =
    ANALYSIS_LANGUAGES[interfaceLanguage] ?? ANALYSIS_LANGUAGES.ko;
  const mustBeKorean =
    interfaceLanguage === "ko"
      ? `
Write meaningInContext, whyUsed, example translations, and otherUsages.meaning in Korean Hangul.
Keep English forms in title, pattern, reading, and example.english/text.
`
      : "";

  return `You explain ONE selected English span inside ONE English sentence for a learner.

The learner already saw a short gloss. Now zoom in on THIS English expression/word/pattern.

Write learner-facing text in ${language}.
${mustBeKorean}
${englishLevelHint(options.learnerLevel)}

Default shape (keep short):
1) meaning in THIS sentence (one line)
2) why it is used this way here (2–4 spoken sentences)
3) reuse pattern if there is one
4) 1–2 new English example sentences
Extra fields only if they prevent a real confusion.

meaningInContext follows:
${naturalTranslationPrinciples({
  locale: interfaceLanguage,
  targetLanguage: "en",
  interfaceLanguage,
  role: "meaning-in-context",
  sourceType: options.sourceType ?? "unknown",
})}

Judge the span from selectedText + the whole sentence + neighbors. Same letters can be different grammar or slang ("I'm cooked" vs food cooked). Do not decide from the string alone.
If this span is slang/idiom/nuance, say that. Do not invent grammar to look thorough.
If a word-for-word calque helps, put ONE contrast inside whyUsed — never as meaningInContext.

Return ONLY JSON:
{
  "selectedText": "...",
  "contextSentence": "...",
  "title": "short label of THIS use",
  "reading": "optional",
  "meaningInContext": "one short line: meaning HERE",
  "whyUsed": "why this sentence uses it this way",
  "pattern": "reuse pattern or empty",
  "examples": [
    { "english": "example in English", "translation": "natural ${language}" }
  ],
  "otherUsages": [
    { "pattern": "...", "meaning": "...", "examples": [{ "english": "...", "translation": "..." }] }
  ]
}

Rules:
- Omit empty fields. Do not pad every section. Do not write a long lecture.
- examples: 0–2 NEW English sentences, never a repeat of the context sentence.
- otherUsages: only a contrast the learner should know now.
- title: short. Not a chapter heading.`;
}
