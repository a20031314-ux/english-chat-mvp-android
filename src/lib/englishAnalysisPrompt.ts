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
import { explanationLanguageGuard } from "@/lib/languageLearningAnalysis";

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
  const explanationGuard = explanationLanguageGuard({
    interfaceLanguage,
    fieldsDescription:
      "translation, correctionNote, element.label (learner-facing part), element.gloss, and element.reading labels",
    learningLanguage: "en",
  });
  const sourceFormNote =
    interfaceLanguage === "ko"
      ? `element.text MUST be an exact substring of the English source.
element.label may mix English with a short Korean gloss cue (ended up ~ing).`
      : `element.text MUST be an exact substring of the English source.
Keep English forms in element.text. Learner-facing labels/glosses stay in ${language}.`;

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
${explanationGuard}
${sourceFormNote}
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
  "nuance": "optional: what this is doing in THIS situation, only if translation is not enough, else empty",
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
  const explanationGuard = explanationLanguageGuard({
    interfaceLanguage,
    fieldsDescription:
      "meaningInContext, grammar.why, grammar.general, grammar.inThisSentence, example translations, and inner.explanation",
    learningLanguage: "en",
  });
  const sourceFormNote =
    interfaceLanguage === "ko"
      ? `Keep English forms in title, pattern, reading, and example.english/text.`
      : `Keep English forms in title, pattern, reading, and example.english/text. Learner-facing explanations stay in ${language}.`;

  return `You explain ONE selected English span inside ONE English sentence for a learner.

The learner already saw a short gloss. Now zoom in on THIS English expression/word/pattern.

Write learner-facing text in ${language}.
${explanationGuard}
${sourceFormNote}
${englishLevelHint(options.learnerLevel)}

Default shape (keep short):
1) meaningInContext: ONLY what THIS selected span means in THIS sentence. One short line. Not a paraphrase of the whole sentence. No dictionary list.
2) If the selected span contains a grammar pattern (when-clause, tense/aspect, dummy it, relative clause, inversion, comparison, modal, contraction, SVC, etc.), fill grammar. Always do this for a clause.
   - why: name the marker in THIS span that makes it that pattern (e.g. conjunction "when" + subject + verb → time adverbial clause).
   - general: how learners use this pattern.
   - inThisSentence: what this span is doing in the parent sentence.
   - examples: 2 short English sentences of the SAME pattern, each with a ${language} translation.
   - inner: if a smaller clause/chunk sits inside the span (I'm bored inside when I'm bored), explain that inner piece too.

meaningInContext follows:
${naturalTranslationPrinciples({
  locale: interfaceLanguage,
  targetLanguage: "en",
  interfaceLanguage,
  role: "meaning-in-context",
  sourceType: options.sourceType ?? "unknown",
})}

Judge the span from selectedText + the whole sentence + neighbors. Same letters can be different grammar or slang ("I'm cooked" vs food cooked). Do not decide from the string alone.

Return ONLY JSON:
{
  "selectedText": "...",
  "contextSentence": "...",
  "title": "short label of THIS use",
  "meaningInContext": "one short line: what THIS span means HERE",
  "grammar": [
    {
      "name": "시간 부사절",
      "why": "which word/form in THIS span makes it that pattern, and the shape (when + subject + verb)",
      "general": "how this grammar works, 1–2 sentences",
      "inThisSentence": "how THIS sentence uses this span, 1–2 sentences",
      "examples": [
        {"english": "Call me when you arrive.", "translation": "..."},
        {"english": "I listen to music when I study.", "translation": "..."}
      ],
      "inner": [
        {
          "text": "I'm bored",
          "name": "주어 + be + 형용사",
          "explanation": "what this inner piece is, and how it is built here"
        }
      ]
    }
  ]
}

Rules:
- Omit empty fields. Do not pad idiom, whyUsed, pattern, or otherUsages.
- meaningInContext is the selected span only. Never retell the whole sentence.
- If the span is a clause or grammar chunk, ALWAYS fill grammar, why, examples (2), and inner when a smaller clause sits inside.
- grammar.why must point at the actual English in the span (when, I'm, -ing, …). Not a textbook title only.
- inner.text MUST be an exact substring of selectedText.
- Skip trivial labels (this is a noun) unless that is the whole point.`;
}
