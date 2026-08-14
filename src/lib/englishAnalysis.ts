import type { TranslationSourceType } from "@/lib/naturalTranslation";
import {
  ANALYSIS_LANGUAGES,
  type LearnerLevel,
} from "@/lib/languageAnalysisPrompt";

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
  correctionNote?: string;
  language?: string;
  elements: LanguageKeyElement[];
  chunks: EnglishChunk[];
};

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
};

export type EnglishAnalysisTarget = {
  selectedText: string;
  contextSentence: string;
  context?: string[];
  sourceType?: TranslationSourceType;
  language?: string;
  learnerLevel?: LearnerLevel;
};

function asLine(value: unknown): string {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "";
}

function asExamples(value: unknown): EnglishAnalysisExample[] {
  if (!Array.isArray(value)) return [];
  const out: EnglishAnalysisExample[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object") continue;
    const o = item as Record<string, unknown>;
    const english = asLine(o.text) || asLine(o.english);
    if (!english) continue;
    const translation = asLine(o.translation);
    const note = asLine(o.note);
    out.push({
      english,
      ...(translation ? { translation } : {}),
      ...(note ? { note } : {}),
    });
    if (out.length >= 2) break;
  }
  return out;
}

export function normalizeEnglishInputAnalysis(
  raw: unknown,
  input: string,
): EnglishInputAnalysis | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const source = asLine(o.input) || asLine(input);
  if (!source) return null;
  const translation = asLine(o.translation);
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

  if (elements.length === 0) {
    elements.push({
      text: source,
      label: source,
      gloss: translation || source,
    });
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
    ...(correctionNote ? { correctionNote } : {}),
    ...(language ? { language } : {}),
  };
}

export function normalizeEnglishElementAnalysis(
  raw: unknown,
  selectedText: string,
  contextSentence: string,
): EnglishElementAnalysis | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const meaningInContext = asLine(o.meaningInContext);
  const contextExplanation = asLine(o.contextExplanation);
  const whyUsed = asLine(o.whyUsed);
  const usageExplanation = asLine(o.usageExplanation);
  if (!meaningInContext && !contextExplanation && !whyUsed && !usageExplanation) {
    return null;
  }

  const otherUsages: EnglishOtherUsage[] = [];
  if (Array.isArray(o.otherUsages)) {
    for (const item of o.otherUsages) {
      if (!item || typeof item !== "object") continue;
      const u = item as Record<string, unknown>;
      const pattern = asLine(u.pattern);
      const meaning = asLine(u.meaning);
      if (!pattern || !meaning) continue;
      const examples = asExamples(u.examples);
      otherUsages.push({
        pattern,
        meaning,
        ...(examples.length ? { examples } : {}),
      });
      if (otherUsages.length >= 4) break;
    }
  }

  const relatedConcepts: EnglishRelatedConcept[] = [];
  if (Array.isArray(o.relatedConcepts)) {
    for (const item of o.relatedConcepts) {
      if (!item || typeof item !== "object") continue;
      const r = item as Record<string, unknown>;
      const label = asLine(r.label);
      if (!label) continue;
      const id = asLine(r.id);
      const kind =
        r.kind === "grammar" || r.kind === "expression" ? r.kind : undefined;
      relatedConcepts.push({
        label,
        ...(id ? { id } : {}),
        ...(kind ? { kind } : {}),
      });
      if (relatedConcepts.length >= 8) break;
    }
  }

  const examples = asExamples(o.examples);
  const title = asLine(o.title) || selectedText;
  const pattern = asLine(o.pattern);
  const reading = asLine(o.reading);

  return {
    selectedText: asLine(o.selectedText) || selectedText,
    contextSentence: asLine(o.contextSentence) || contextSentence,
    title,
    ...(reading ? { reading } : {}),
    ...(meaningInContext ? { meaningInContext } : {}),
    ...(contextExplanation ? { contextExplanation } : {}),
    ...(whyUsed ? { whyUsed } : {}),
    ...(pattern ? { pattern } : {}),
    ...(usageExplanation ? { usageExplanation } : {}),
    ...(examples.length ? { examples } : {}),
    ...(otherUsages.length ? { otherUsages } : {}),
    ...(relatedConcepts.length ? { relatedConcepts } : {}),
  };
}
