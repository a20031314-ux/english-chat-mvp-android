import type { TranslationSourceType } from "@/lib/naturalTranslation";
import {
  ANALYSIS_LANGUAGES,
  type LearnerLevel,
} from "@/lib/languageAnalysisPrompt";
import { isLearningLanguageCode } from "@/lib/learningLanguages";
import { ALL_ANALYSIS_DIMENSIONS } from "@/lib/salience/languageProfiles";
import { legacyDimensionProse } from "@/lib/salience/dimensionLabels";
import type { SentenceSpanAnalysis } from "@/lib/salience/sentenceSpanPrompt";
import type { AnalysisDimension } from "@/lib/salience/types";
import { speechLooksWrongLanguage } from "@/lib/videoSubtitle/languageMatch";
import { exampleMixesInterfaceLanguage } from "@/lib/exampleLanguage";

export const ENGLISH_ANALYSIS_LANGUAGES = ANALYSIS_LANGUAGES;

export type EnglishChunkType =
  | "subject"
  | "grammar_pattern"
  | "expression"
  | "clause"
  | "word"
  | "collocation"
  | "other";

export type EnglishChunk = {
  text: string;
  type: EnglishChunkType;
  analysisRecommended: boolean;
};

/** Overview key item: map, not a full parse. */
export type LanguageKeyElement = {
  text: string;
  label: string;
  gloss: string;
  reading?: string;
};

export type EnglishInputAnalysis = {
  input: string;
  translation?: string;
  /** What this utterance is doing in context, when a plain translation is not enough. */
  nuance?: string;
  correctionNote?: string;
  language?: string;
  elements: LanguageKeyElement[];
  chunks: EnglishChunk[];
};

export function normalizeAnalysisSpan(value: string) {
  return value
    .replace(/\s+/g, " ")
    .replace(/[。．.!?！？…]+$/u, "")
    .trim()
    .toLowerCase();
}

export function isSameAnalysisSpan(a: string, b: string) {
  const left = normalizeAnalysisSpan(a);
  const right = normalizeAnalysisSpan(b);
  return Boolean(left && right && left === right);
}

export type EnglishAnalysisExample = {
  english: string;
  translation?: string;
  note?: string;
};

export type EnglishOtherUsage = {
  pattern: string;
  meaning: string;
  examples?: EnglishAnalysisExample[];
};

/** Future concept-link target; not clickable in this iteration. */
export type EnglishRelatedConcept = {
  id?: string;
  label: string;
  kind?: "grammar" | "expression";
};

export type EnglishIdiomNote = {
  text: string;
  withWords: string[];
  meaning: string;
};

export type EnglishGrammarInner = {
  text: string;
  name: string;
  explanation: string;
};

export type EnglishGrammarNote = {
  name: string;
  general: string;
  why?: string;
  inThisSentence: string;
  examples?: EnglishAnalysisExample[];
  inner?: EnglishGrammarInner[];
};

export type EnglishElementAnalysis = {
  selectedText: string;
  contextSentence: string;
  title: string;
  reading?: string;
  meaningInContext?: string;
  contextExplanation?: string;
  whyUsed?: string;
  pattern?: string;
  usageExplanation?: string;
  examples?: EnglishAnalysisExample[];
  otherUsages?: EnglishOtherUsage[];
  relatedConcepts?: EnglishRelatedConcept[];
  idiom?: EnglishIdiomNote;
  grammar?: EnglishGrammarNote[];
  dimensionResults?: Partial<Record<AnalysisDimension, string>>;
};

export type EnglishAnalysisTarget = {
  selectedText: string;
  contextSentence: string;
  context?: string[];
  sourceType?: TranslationSourceType;
  language?: string;
  learnerLevel?: LearnerLevel;
  /** Force sentence overview or element detail. Default: sentence-first, then drill-in. */
  intent?: "sentence" | "element" | "word";
  /** Allow vocab save from the word sheet (idioms only in analysis). */
  allowVocabSave?: boolean;
  /** Existing UI-language translation to reuse (chat, video, …). Caption / 2-pass. */
  translation?: string;
  /**
   * Critique-on rendering to include in analysis explanations.
   * May differ from `translation` (the on-screen / 2-pass line).
   */
  analysisTranslation?: string;
  /**
   * The video a subtitle line belongs to. Lets the server keep the line's
   * translation for the next viewer of the same video (subtitleGlossStore).
   */
  videoId?: string;
  /** Non-English nested pieces (characters / inner words). English never sets this. */
  innerUnits?: Array<{
    text: string;
    kind?: string;
    reading?: string;
    meaning?: string;
  }>;
};

function asLine(value: unknown): string {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "";
}

function asExampleSource(o: Record<string, unknown>): string {
  return (
    asLine(o.sentence) ||
    asLine(o.text) ||
    asLine(o.english) ||
    asLine(o.source)
  );
}

function asExamples(
  value: unknown,
  max = 2,
  targetLanguage?: string,
  interfaceLanguage?: string,
): EnglishAnalysisExample[] {
  if (!Array.isArray(value)) return [];
  const out: EnglishAnalysisExample[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object") continue;
    const o = item as Record<string, unknown>;
    const english = asExampleSource(o);
    if (!english) continue;
    if (exampleSentenceMismatchesTarget(english, targetLanguage)) continue;
    if (exampleMixesInterfaceLanguage(english, targetLanguage, interfaceLanguage)) continue;
    const translation = asLine(o.translation);
    const note = asLine(o.note);
    out.push({
      english,
      ...(translation ? { translation } : {}),
      ...(note ? { note } : {}),
    });
    if (out.length >= max) break;
  }
  return out;
}

function exampleSentenceMismatchesTarget(
  sentence: string,
  targetLanguage?: string,
): boolean {
  if (!isLearningLanguageCode(targetLanguage) || targetLanguage === "en") {
    return false;
  }
  return speechLooksWrongLanguage(sentence, targetLanguage);
}

export function normalizeEnglishInputAnalysis(
  raw: unknown,
  input: string,
): EnglishInputAnalysis | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const source = asLine(o.input) || asLine(input);
  if (!source) return null;
  const translation = asLine(o.translation) || asLine(o.naturalMeaning);
  const nuance = asLine(o.nuance);
  const correctionNote = asLine(o.correctionNote);
  const language = asLine(o.language);

  const elements: LanguageKeyElement[] = [];
  if (Array.isArray(o.elements)) {
    for (const item of o.elements) {
      if (!item || typeof item !== "object") continue;
      const e = item as Record<string, unknown>;
      const text = asLine(e.text);
      const gloss = asLine(e.gloss);
      if (!text || !gloss) continue;
      const label = asLine(e.label) || text;
      const reading = asLine(e.reading);
      elements.push({
        text,
        label,
        gloss,
        ...(reading ? { reading } : {}),
      });
      if (elements.length >= 4) break;
    }
  }

  if (elements.length === 0 && Array.isArray(o.chunks)) {
    for (const item of o.chunks) {
      if (!item || typeof item !== "object") continue;
      const c = item as Record<string, unknown>;
      const text = asLine(c.text);
      if (!text) continue;
      if (c.analysisRecommended === false) continue;
      elements.push({ text, label: text, gloss: translation || text });
      if (elements.length >= 4) break;
    }
  }

  const chunks: EnglishChunk[] = elements.map((element) => ({
    text: element.text,
    type: "expression",
    analysisRecommended: true,
  }));

  return {
    input: source,
    elements,
    chunks,
    ...(translation ? { translation } : {}),
    ...(nuance ? { nuance } : {}),
    ...(correctionNote ? { correctionNote } : {}),
    ...(language ? { language } : {}),
  };
}

export function parseDimensionResults(
  o: Record<string, unknown>,
): Partial<Record<AnalysisDimension, string>> | undefined {
  const nested =
    o.dimensionResults &&
    typeof o.dimensionResults === "object" &&
    !Array.isArray(o.dimensionResults)
      ? (o.dimensionResults as Record<string, unknown>)
      : o;
  const out: Partial<Record<AnalysisDimension, string>> = {};
  for (const dimension of ALL_ANALYSIS_DIMENSIONS) {
    const text = asLine(nested[dimension]);
    if (!text || /^skip$/i.test(text)) continue;
    out[dimension] = text;
  }
  return Object.keys(out).length ? out : undefined;
}

export function mapSentenceSpanToEnglishElement(
  analysis: SentenceSpanAnalysis,
  targetLanguage?: string,
  interfaceLanguage?: string,
): EnglishElementAnalysis {
  const examples = asExamples(
    analysis.examples.map((example) => ({
      sentence: example.sentence,
      translation: example.meaning,
    })),
    2,
    targetLanguage,
    interfaceLanguage,
  );
  const dimensionResults = Object.keys(analysis.dimensionResults).length
    ? analysis.dimensionResults
    : undefined;
  // Viewers older than the dimension list read a grammar note and nothing
  // else — not even top-level examples — so without this they show only the
  // meaning line. Newer viewers skip grammar whenever dimensionResults is set.
  const legacyGrammar =
    dimensionResults && interfaceLanguage
      ? [
          {
            name: analysis.selectedText,
            general: legacyDimensionProse(interfaceLanguage, dimensionResults),
            inThisSentence: analysis.meaningInContext,
            ...(examples.length ? { examples } : {}),
          },
        ]
      : undefined;
  return {
    selectedText: analysis.selectedText,
    contextSentence: analysis.contextSentence,
    title: analysis.selectedText,
    meaningInContext: analysis.meaningInContext,
    ...(analysis.reading ? { reading: analysis.reading } : {}),
    ...(examples.length ? { examples } : {}),
    ...(dimensionResults ? { dimensionResults } : {}),
    ...(legacyGrammar ? { grammar: legacyGrammar } : {}),
  };
}
