/**
 * Adaptive Language Analysis — NON-ENGLISH learning targets only.
 *
 * English continues to use englishAnalysisPrompt.ts.
 * This module lets the model choose high-value learning units for the
 * target language on its own terms (not an English grammar template).
 */

import {
  ANALYSIS_LANGUAGES,
  type LearnerLevel,
} from "@/lib/languageAnalysisPrompt";
import {
  explanationLanguageGuard,
  interfaceLanguageDisplayName,
} from "@/lib/languageLearningAnalysis";
import { learningLanguageName } from "@/lib/learningLanguages";
import {
  naturalTranslationPrinciples,
  type TranslationSourceType,
} from "@/lib/naturalTranslation";
import type {
  EnglishElementAnalysis,
  EnglishInputAnalysis,
  LanguageKeyElement,
} from "@/lib/englishAnalysis";
import type { ExpressionInsight } from "@/lib/expressionInsight";

export const ADAPTIVE_MAX_LEARNING_UNITS = 4;

/** Extensible; UI should not hard-depend on a closed enum. */
export type LearningUnitType =
  | "word"
  | "expression"
  | "grammar"
  | "character"
  | "pronunciation"
  | "form"
  | "nuance"
  | "slang"
  | "other"
  | (string & {});

export type LearningUnit = {
  text: string;
  type: LearningUnitType;
  meaning: string;
  explanation?: string;
  pronunciation?: string;
  reading?: string;
  romanization?: string;
  baseForm?: string;
  example?: {
    sentence: string;
    meaning: string;
  };
  importance?: number;
};

export type AdaptiveSentenceAnalysis = {
  input: string;
  naturalMeaning: string;
  learningUnits: LearningUnit[];
  nuance?: string | null;
  optionalLanguageNote?: string | null;
  language?: string;
};

export type AdaptiveElementAnalysis = {
  selectedText: string;
  contextSentence: string;
  title: string;
  type?: LearningUnitType;
  meaningInContext: string;
  whyUsed?: string;
  pattern?: string;
  pronunciation?: string;
  reading?: string;
  romanization?: string;
  baseForm?: string;
  examples?: Array<{ sentence: string; meaning: string }>;
  otherUsages?: Array<{ pattern: string; meaning: string }>;
};

function adaptiveLevelHint(level?: LearnerLevel): string {
  if (level === "beginner") {
    return "Learner level: beginner. You MAY raise importance of basic words, readings/pronunciation, and core reusable expressions — but only if they matter in THIS sentence.";
  }
  if (level === "advanced") {
    return "Learner level: advanced. You MAY raise importance of nuance, register, idiom, slang, and subtle forms — but only if they matter in THIS sentence.";
  }
  if (level === "intermediate") {
    return "Learner level: intermediate. Prefer reusable chunks, constructions, and collocations over elementary labels — when they matter here.";
  }
  return "Learner level unknown. Prefer what unlocks meaning and reuse for THIS sentence.";
}

function adaptiveCorePhilosophy(targetName: string): string {
  return `You are not applying a universal grammar template.

First understand ${targetName} on its own terms.

Use your knowledge of ${targetName}'s grammar, writing system, morphology, pronunciation, vocabulary, idioms, pragmatics, register, and common learning difficulties to determine what kinds of learning units matter for THIS specific sentence.

Do not expose all of that analysis to the learner.

Select only the few elements that provide the highest learning value.

The learner should first understand and absorb the sentence as a meaningful whole.
Decomposition is secondary and should only be used when it makes the sentence easier to understand, remember, or reuse.

Do not force grammar explanations.
Do not force character explanations.
Do not force vocabulary explanations.
Do not analyze every particle, every character, every conjugation, or every word.

Adapt the analysis to the language and the sentence.

Learning units MAY be any of: word, phrase, chunk, expression, idiom, collocation, grammatical construction, conjugated form, particle, character, character combination, pronunciation, reading, tone, sentence ending, honorific, register, slang, pragmatic expression, morphology, culturally dependent expression, or other units that matter in ${targetName}.
That list is NOT a checklist — never hunt for each type.

Prefer meaning chunks a native speaker would reuse as a unit.
Prioritize the meaning of the expression IN THIS CONTEXT over dictionary dumps.

Learning-value ranking (pick highest only):
A) Missing it would likely misread the sentence
B) High reuse value in other situations
C) Hard to get from a plain translation alone
D) Important characteristic of learning ${targetName}
E) Plays an important role in THIS sentence
F) Common / natural native usage
G) Appropriate for the learner level

Cap: 1–${ADAPTIVE_MAX_LEARNING_UNITS} learning units (0–2 if very easy; max ${ADAPTIVE_MAX_LEARNING_UNITS} even if complex).
Empty learningUnits is allowed for trivial sentences (e.g. a plain greeting).`;
}

export function adaptiveOverviewSystem(options: {
  locale: string;
  interfaceLanguage?: string;
  targetLanguage: string;
  sourceType: TranslationSourceType;
  learnerLevel?: LearnerLevel;
  languageHint?: string;
}): string {
  const interfaceLanguage = options.interfaceLanguage ?? options.locale;
  const targetName = learningLanguageName(options.targetLanguage);
  const interfaceName =
    ANALYSIS_LANGUAGES[interfaceLanguage] ??
    interfaceLanguageDisplayName(interfaceLanguage);
  const explanationGuard = explanationLanguageGuard({
    interfaceLanguage,
    fieldsDescription:
      "naturalMeaning, learningUnits.meaning, explanation, nuance, and optionalLanguageNote",
  });
  const sourceFormNote =
    interfaceLanguage === "ko"
      ? `Keep source-language forms in text / reading / romanization / pronunciation / example.sentence.`
      : `Keep source-language forms in text / reading / romanization / pronunciation / example.sentence. Learner-facing explanations stay in ${interfaceName}.`;

  return `${adaptiveCorePhilosophy(targetName)}

Target language being learned: ${targetName} (${options.targetLanguage}).
Caller language hint: ${options.languageHint?.trim() || targetName}. Still verify from the actual sentence.
Write learner-facing explanations in ${interfaceName}.
${explanationGuard}
${sourceFormNote}
${adaptiveLevelHint(options.learnerLevel)}

Natural meaning follows:
${naturalTranslationPrinciples({
  locale: interfaceLanguage,
  targetLanguage: options.targetLanguage,
  interfaceLanguage,
  role: "utterance",
  sourceType: options.sourceType,
})}

Return ONLY JSON:
{
  "input": "source as written, light cleanup only",
  "language": "${options.targetLanguage}",
  "naturalMeaning": "natural meaning in ${interfaceName}",
  "learningUnits": [
    {
      "text": "exact substring from input when possible",
      "type": "word|expression|grammar|character|pronunciation|form|nuance|slang|other",
      "meaning": "short meaning HERE",
      "explanation": "optional one short note — omit if not needed",
      "reading": "optional (e.g. えいが)",
      "romanization": "optional (e.g. xuéxiào)",
      "pronunciation": "optional",
      "baseForm": "optional (e.g. tener ← tengo)",
      "example": { "sentence": "optional reuse example in source language", "meaning": "..." },
      "importance": 1
    }
  ],
  "nuance": "optional short tone/register note or null",
  "optionalLanguageNote": "optional short note or null"
}

Rules:
- Order learningUnits by importance (highest first). Cap at ${ADAPTIVE_MAX_LEARNING_UNITS}.
- Prefer expression/chunk units over atomizing into tiny pieces.
- Character-level only when characters themselves are the learning target (not every character in the sentence).
- Omit unused optional fields. Do not pad.`;
}

export function adaptiveElementSystem(options: {
  locale: string;
  interfaceLanguage?: string;
  targetLanguage: string;
  sourceType?: TranslationSourceType;
  learnerLevel?: LearnerLevel;
  languageHint?: string;
}): string {
  const interfaceLanguage = options.interfaceLanguage ?? options.locale;
  const targetName = learningLanguageName(options.targetLanguage);
  const interfaceName =
    ANALYSIS_LANGUAGES[interfaceLanguage] ??
    interfaceLanguageDisplayName(interfaceLanguage);
  const explanationGuard = explanationLanguageGuard({
    interfaceLanguage,
    fieldsDescription:
      "meaningInContext, whyUsed, example meanings, and otherUsages.meaning",
  });
  const sourceFormNote =
    interfaceLanguage === "ko"
      ? `Keep source forms in title, pattern, reading, romanization, pronunciation, baseForm, and example.sentence.`
      : `Keep source forms in title, pattern, reading, romanization, pronunciation, baseForm, and example.sentence. Learner-facing explanations stay in ${interfaceName}.`;

  return `${adaptiveCorePhilosophy(targetName)}

This request is DETAIL ZOOM for ONE selected learning unit inside ONE ${targetName} sentence.
Adapt the depth to what THIS unit needs in ${targetName} (reading, conjugation, tone, register, etc.) — but keep it short.

Write learner-facing text in ${interfaceName}.
${explanationGuard}
${sourceFormNote}
Caller language hint: ${options.languageHint?.trim() || targetName}.
${adaptiveLevelHint(options.learnerLevel)}

Default shape:
1) meaning in THIS sentence (one line)
2) why it is used this way here (2–4 short sentences)
3) reusable pattern if there is one
4) 1–2 new example sentences in ${targetName}
Do not turn this into a linguistics lecture or full paradigm table.

meaningInContext follows:
${naturalTranslationPrinciples({
  locale: interfaceLanguage,
  targetLanguage: options.targetLanguage,
  interfaceLanguage,
  role: "meaning-in-context",
  sourceType: options.sourceType ?? "unknown",
})}

Return ONLY JSON:
{
  "selectedText": "...",
  "contextSentence": "...",
  "title": "short label of THIS use",
  "type": "word|expression|grammar|character|pronunciation|form|nuance|slang|other",
  "meaningInContext": "one short line: meaning HERE",
  "whyUsed": "why this sentence uses it this way",
  "pattern": "reuse pattern or empty",
  "reading": "optional",
  "romanization": "optional",
  "pronunciation": "optional",
  "baseForm": "optional",
  "examples": [
    { "sentence": "example in ${targetName}", "meaning": "natural ${interfaceName}" }
  ],
  "otherUsages": [
    { "pattern": "...", "meaning": "..." }
  ]
}

Rules:
- Omit empty fields. examples: 0–2 NEW sentences, never a copy of the context sentence.
- otherUsages: only a contrast that matters now.`;
}

function asLine(value: unknown): string {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "";
}

function asUnitType(value: unknown): LearningUnitType {
  const raw = asLine(value).toLowerCase();
  if (!raw) return "other";
  return raw;
}

export function normalizeAdaptiveSentenceAnalysis(
  raw: unknown,
  input: string,
): AdaptiveSentenceAnalysis | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const source = asLine(o.input) || asLine(input);
  if (!source) return null;
  const naturalMeaning =
    asLine(o.naturalMeaning) || asLine(o.translation) || "";
  if (!naturalMeaning) return null;

  const learningUnits: LearningUnit[] = [];
  const unitsRaw = Array.isArray(o.learningUnits)
    ? o.learningUnits
    : Array.isArray(o.elements)
      ? o.elements
      : [];
  for (const item of unitsRaw) {
    if (!item || typeof item !== "object") continue;
    const u = item as Record<string, unknown>;
    const text = asLine(u.text);
    const meaning = asLine(u.meaning) || asLine(u.gloss);
    if (!text || !meaning) continue;
    const explanation = asLine(u.explanation);
    const pronunciation = asLine(u.pronunciation);
    const reading = asLine(u.reading);
    const romanization = asLine(u.romanization);
    const baseForm = asLine(u.baseForm);
    let example: LearningUnit["example"];
    if (u.example && typeof u.example === "object") {
      const ex = u.example as Record<string, unknown>;
      const sentence = asLine(ex.sentence) || asLine(ex.english);
      const exMeaning = asLine(ex.meaning) || asLine(ex.translation);
      if (sentence && exMeaning) {
        example = { sentence, meaning: exMeaning };
      }
    }
    const importance =
      typeof u.importance === "number" && Number.isFinite(u.importance)
        ? u.importance
        : undefined;
    learningUnits.push({
      text,
      type: asUnitType(u.type),
      meaning,
      ...(explanation ? { explanation } : {}),
      ...(pronunciation ? { pronunciation } : {}),
      ...(reading ? { reading } : {}),
      ...(romanization ? { romanization } : {}),
      ...(baseForm ? { baseForm } : {}),
      ...(example ? { example } : {}),
      ...(importance !== undefined ? { importance } : {}),
    });
    if (learningUnits.length >= ADAPTIVE_MAX_LEARNING_UNITS) break;
  }

  const nuance = asLine(o.nuance) || null;
  const optionalLanguageNote =
    asLine(o.optionalLanguageNote) || asLine(o.correctionNote) || null;
  const language = asLine(o.language);

  return {
    input: source,
    naturalMeaning,
    learningUnits,
    nuance,
    optionalLanguageNote,
    ...(language ? { language } : {}),
  };
}

export function normalizeAdaptiveElementAnalysis(
  raw: unknown,
  selectedText: string,
  contextSentence: string,
): AdaptiveElementAnalysis | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const meaningInContext =
    asLine(o.meaningInContext) || asLine(o.meaning) || "";
  const whyUsed = asLine(o.whyUsed) || asLine(o.explanation);
  if (!meaningInContext && !whyUsed) return null;

  const examples: Array<{ sentence: string; meaning: string }> = [];
  if (Array.isArray(o.examples)) {
    for (const item of o.examples) {
      if (!item || typeof item !== "object") continue;
      const e = item as Record<string, unknown>;
      const sentence = asLine(e.sentence) || asLine(e.english) || asLine(e.text);
      const meaning = asLine(e.meaning) || asLine(e.translation);
      if (!sentence || !meaning) continue;
      examples.push({ sentence, meaning });
      if (examples.length >= 2) break;
    }
  }

  const otherUsages: Array<{ pattern: string; meaning: string }> = [];
  if (Array.isArray(o.otherUsages)) {
    for (const item of o.otherUsages) {
      if (!item || typeof item !== "object") continue;
      const u = item as Record<string, unknown>;
      const pattern = asLine(u.pattern);
      const meaning = asLine(u.meaning);
      if (!pattern || !meaning) continue;
      otherUsages.push({ pattern, meaning });
      if (otherUsages.length >= 3) break;
    }
  }

  const reading =
    asLine(o.reading) ||
    asLine(o.romanization) ||
    asLine(o.pronunciation) ||
    "";
  const type = asUnitType(o.type);
  const title = asLine(o.title) || selectedText;
  const pattern = asLine(o.pattern);
  const pronunciation = asLine(o.pronunciation);
  const romanization = asLine(o.romanization);
  const readingOnly = asLine(o.reading);
  const baseForm = asLine(o.baseForm);

  return {
    selectedText: asLine(o.selectedText) || selectedText,
    contextSentence: asLine(o.contextSentence) || contextSentence,
    title,
    type,
    meaningInContext: meaningInContext || whyUsed,
    ...(whyUsed ? { whyUsed } : {}),
    ...(pattern ? { pattern } : {}),
    ...(pronunciation ? { pronunciation } : {}),
    ...(readingOnly ? { reading: readingOnly } : reading ? { reading } : {}),
    ...(romanization ? { romanization } : {}),
    ...(baseForm ? { baseForm } : {}),
    ...(examples.length ? { examples } : {}),
    ...(otherUsages.length ? { otherUsages } : {}),
  };
}

function unitToKeyElement(unit: LearningUnit): LanguageKeyElement {
  const reading =
    unit.reading || unit.romanization || unit.pronunciation || undefined;
  const labelParts = [unit.text];
  if (reading && reading !== unit.text) {
    labelParts.push(`(${reading})`);
  }
  const glossParts = [unit.meaning];
  if (unit.explanation) glossParts.push(unit.explanation);
  if (unit.baseForm) glossParts.push(`← ${unit.baseForm}`);
  return {
    text: unit.text,
    label: labelParts.join(""),
    gloss: glossParts.join(" · "),
    ...(reading ? { reading } : {}),
  };
}

/** Map adaptive overview → existing overview UI schema (no EN fallback padding). */
export function mapAdaptiveSentenceToEnglishInput(
  analysis: AdaptiveSentenceAnalysis,
): EnglishInputAnalysis {
  const elements = analysis.learningUnits.map(unitToKeyElement);
  const noteParts = [
    analysis.optionalLanguageNote,
    analysis.nuance,
  ].filter((part): part is string => Boolean(part?.trim()));
  return {
    input: analysis.input,
    translation: analysis.naturalMeaning,
    language: analysis.language,
    elements,
    chunks: elements.map((element) => ({
      text: element.text,
      type: "expression" as const,
      analysisRecommended: true,
    })),
    ...(noteParts.length
      ? { correctionNote: noteParts.join(" · ") }
      : {}),
  };
}

/** Map adaptive detail → existing element viewer schema. */
export function mapAdaptiveElementToEnglishElement(
  analysis: AdaptiveElementAnalysis,
): EnglishElementAnalysis {
  const reading =
    analysis.reading ||
    analysis.romanization ||
    analysis.pronunciation ||
    undefined;
  const whyParts = [analysis.whyUsed];
  if (analysis.baseForm) {
    whyParts.push(`Base form: ${analysis.baseForm}`);
  }
  const whyUsed = whyParts.filter(Boolean).join("\n\n") || undefined;

  return {
    selectedText: analysis.selectedText,
    contextSentence: analysis.contextSentence,
    title: analysis.title,
    meaningInContext: analysis.meaningInContext,
    ...(reading ? { reading } : {}),
    ...(whyUsed ? { whyUsed } : {}),
    ...(analysis.pattern ? { pattern: analysis.pattern } : {}),
    ...(analysis.examples?.length
      ? {
          examples: analysis.examples.map((ex) => ({
            english: ex.sentence,
            translation: ex.meaning,
          })),
        }
      : {}),
    ...(analysis.otherUsages?.length
      ? {
          otherUsages: analysis.otherUsages.map((u) => ({
            pattern: u.pattern,
            meaning: u.meaning,
          })),
        }
      : {}),
  };
}

/** Map adaptive detail → expression-insight sheet schema. */
export function mapAdaptiveElementToExpressionInsight(
  analysis: AdaptiveElementAnalysis,
): ExpressionInsight {
  return {
    selectedText: analysis.selectedText,
    title: analysis.title,
    meaning: analysis.meaningInContext,
    ...(analysis.whyUsed ? { explanation: analysis.whyUsed } : {}),
    ...(analysis.pattern ? { pattern: analysis.pattern } : {}),
    ...(analysis.examples?.length
      ? {
          examples: analysis.examples.map((ex) => ({
            english: ex.sentence,
            translation: ex.meaning,
          })),
        }
      : {}),
  };
}
