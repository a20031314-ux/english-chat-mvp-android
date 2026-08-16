import type { TranslationSourceType } from "@/lib/naturalTranslation";
import {
  ANALYSIS_LANGUAGES,
  type LearnerLevel,
} from "@/lib/languageAnalysisPrompt";
import { listWordSpans } from "@/lib/textTokens";

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
  /** Existing UI-language translation to reuse (chat, video, …). */
  translation?: string;
};

function asLine(value: unknown): string {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "";
}

export function parseEnglishIdiomNote(
  raw: unknown,
  contextSentence: string,
): EnglishIdiomNote | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const o = raw as Record<string, unknown>;
  const text = asLine(o.text);
  const meaning = asLine(o.meaning);
  if (!text || !meaning) return undefined;
  const hay = contextSentence.toLowerCase();
  if (!hay.includes(text.toLowerCase())) return undefined;
  if (normalizeAnalysisSpan(text) === normalizeAnalysisSpan(contextSentence)) {
    return undefined;
  }
  const withWords: string[] = [];
  if (Array.isArray(o.withWords)) {
    for (const item of o.withWords) {
      const word = asLine(item);
      if (!word) continue;
      withWords.push(word);
      if (withWords.length >= 8) break;
    }
  }
  const tokens =
    withWords.length >= 2 ? withWords : listWordSpans(text).map((word) => word.text);
  if (tokens.length < 2) return undefined;
  return { text, meaning, withWords: tokens };
}

export function parseEnglishGrammarNotes(
  raw: unknown,
  contextSentence: string,
): EnglishGrammarNote[] {
  const items = Array.isArray(raw) ? raw : raw ? [raw] : [];
  const out: EnglishGrammarNote[] = [];
  const hay = contextSentence.toLowerCase();
  for (const item of items) {
    if (!item || typeof item !== "object") continue;
    const o = item as Record<string, unknown>;
    const name = asLine(o.name) || asLine(o.pattern) || asLine(o.title);
    const general =
      asLine(o.general) || asLine(o.usageExplanation) || asLine(o.explanation);
    const inThisSentence =
      asLine(o.inThisSentence) ||
      asLine(o.howUsedHere) ||
      asLine(o.contextExplanation);
    if (!name || !general || !inThisSentence) continue;
    const why = asLine(o.why) || asLine(o.whyThis) || asLine(o.marker);
    const examples = asExamples(o.examples, 2);
    const inner: EnglishGrammarInner[] = [];
    const innerRaw = Array.isArray(o.inner) ? o.inner : [];
    for (const nested of innerRaw) {
      if (!nested || typeof nested !== "object") continue;
      const n = nested as Record<string, unknown>;
      const text = asLine(n.text);
      const innerName = asLine(n.name) || asLine(n.pattern);
      const explanation = asLine(n.explanation) || asLine(n.meaning);
      if (!text || !innerName || !explanation) continue;
      if (!hay.includes(text.toLowerCase())) continue;
      inner.push({ text, name: innerName, explanation });
      if (inner.length >= 3) break;
    }
    out.push({
      name,
      general,
      inThisSentence,
      ...(why ? { why } : {}),
      ...(examples.length ? { examples } : {}),
      ...(inner.length ? { inner } : {}),
    });
    if (out.length >= 3) break;
  }
  return out;
}

function asExamples(value: unknown, max = 2): EnglishAnalysisExample[] {
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
    if (out.length >= max) break;
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
  const idiom = parseEnglishIdiomNote(o.idiom, contextSentence);
  const grammar = parseEnglishGrammarNotes(
    o.grammar ?? o.grammarNotes,
    contextSentence,
  );
  if (
    !meaningInContext &&
    !contextExplanation &&
    !whyUsed &&
    !usageExplanation &&
    !idiom &&
    grammar.length === 0
  ) {
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
    ...(idiom ? { idiom } : {}),
    ...(grammar.length ? { grammar } : {}),
  };
}
