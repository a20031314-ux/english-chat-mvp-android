/**
 * Non-English clickable learning spans.
 * English must keep using textTokens + expressionUnits — never this module.
 */

import { selectionFitsSentence } from "./expressionInsight.ts";
import { isLearningLanguageCode } from "./learningLanguages.ts";
import {
  isWordToken,
  listWordSpans,
  tokenize,
  type WordSpan,
} from "./textTokens.ts";

export type LearningSpanKind = "expression" | "word" | "grammar_unit";
export type LearningInnerKind = "word" | "character" | "morpheme";

export type LearningInnerUnit = {
  text: string;
  kind: LearningInnerKind;
  reading?: string;
  meaning?: string;
};

export type LearningSpan = {
  text: string;
  start: number;
  end: number;
  kind: LearningSpanKind;
  reading?: string;
  meaning?: string;
  baseForm?: string;
  inner?: LearningInnerUnit[];
};

const cache = new Map<string, LearningSpan[]>();

function asLine(value: unknown): string {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "";
}

function cacheKey(sentence: string, targetLanguage: string) {
  return `${targetLanguage}:${sentence.replace(/\s+/g, " ").trim()}`;
}

export function peekLearningSpans(
  sentence: string,
  targetLanguage: string,
): LearningSpan[] | null {
  const hit = cache.get(cacheKey(sentence, targetLanguage));
  return hit ?? null;
}

export function rememberLearningSpans(
  sentence: string,
  targetLanguage: string,
  spans: LearningSpan[],
) {
  cache.set(cacheKey(sentence, targetLanguage), spans);
}

function asSpanKind(value: unknown): LearningSpanKind {
  const raw = asLine(value).toLowerCase();
  if (raw === "expression" || raw === "phrase" || raw === "idiom") {
    return "expression";
  }
  if (raw === "grammar_unit" || raw === "grammar" || raw === "form") {
    return "grammar_unit";
  }
  return "word";
}

function asInnerKind(value: unknown, text: string): LearningInnerKind {
  const raw = asLine(value).toLowerCase();
  if (raw === "character" || raw === "hanzi" || raw === "kanji") {
    return "character";
  }
  if (raw === "morpheme" || raw === "particle" || raw === "affix") {
    return "morpheme";
  }
  if (raw === "word") return "word";
  if (text.length === 1 && /[\u3400-\u9fff]/u.test(text)) return "character";
  return "word";
}

function indexOfPiece(sentence: string, needle: string, from: number): number {
  if (!needle || from > sentence.length) return -1;
  const exact = sentence.indexOf(needle, from);
  if (exact >= 0) return exact;
  const hay = sentence.slice(from).toLowerCase();
  const want = needle.toLowerCase();
  const index = hay.indexOf(want);
  return index < 0 ? -1 : from + index;
}

function coversWholeSentence(sentence: string, text: string) {
  const strip = (value: string) =>
    value
      .replace(/\s+/g, "")
      .replace(/[。．.!?！？…]+$/u, "")
      .toLowerCase();
  const a = strip(sentence);
  const b = strip(text);
  if (!a || !b || a !== b) return false;
  if (/[\u0600-\u06ff\u0900-\u097f\u0e00-\u0e7f\u3040-\u30ff\u3400-\u9fff\uac00-\ud7af]/u.test(a)) {
    return Array.from(a).length > 4;
  }
  return a.replace(/[^\p{L}\p{M}\p{N}]+/gu, " ").trim().split(/\s+/).length > 4;
}

function parseInner(raw: unknown, parent: string): LearningInnerUnit[] {
  if (!Array.isArray(raw)) return [];
  const out: LearningInnerUnit[] = [];
  const seen = new Set<string>();
  for (const item of raw) {
    if (typeof item === "string") {
      const text = asLine(item);
      if (!text || !parent.includes(text) || seen.has(text)) continue;
      if (text === parent) continue;
      seen.add(text);
      out.push({ text, kind: asInnerKind("", text) });
      if (out.length >= 8) break;
      continue;
    }
    if (!item || typeof item !== "object") continue;
    const o = item as Record<string, unknown>;
    const text = asLine(o.text) || asLine(o.surface);
    if (!text || !parent.includes(text) || seen.has(text)) continue;
    if (text === parent) continue;
    seen.add(text);
    const reading = asLine(o.reading) || asLine(o.romanization);
    const meaning = asLine(o.meaning) || asLine(o.gloss);
    out.push({
      text,
      kind: asInnerKind(o.kind ?? o.type, text),
      ...(reading ? { reading } : {}),
      ...(meaning ? { meaning } : {}),
    });
    if (out.length >= 8) break;
  }
  return out;
}

function fallbackSpans(chunk: string, offset: number): LearningSpan[] {
  if (!chunk) return [];
  return listWordSpans(chunk).map((word) => ({
    text: word.text,
    start: offset + word.start,
    end: offset + word.end,
    kind: "word" as const,
  }));
}

function fillCoverage(sentence: string, spans: LearningSpan[]): LearningSpan[] {
  const sorted = [...spans]
    .filter((span) => span.end > span.start)
    .sort((a, b) => a.start - b.start || a.end - b.end);
  const out: LearningSpan[] = [];
  let cursor = 0;
  for (const span of sorted) {
    if (span.end <= cursor) continue;
    if (span.start < cursor) continue;
    if (span.start > cursor) {
      out.push(...fallbackSpans(sentence.slice(cursor, span.start), cursor));
    }
    out.push(span);
    cursor = span.end;
  }
  if (cursor < sentence.length) {
    out.push(...fallbackSpans(sentence.slice(cursor), cursor));
  }
  return out.filter((span) => isWordToken(span.text));
}

function rawSpanItems(raw: unknown): unknown[] {
  if (!raw || typeof raw !== "object") return [];
  const o = raw as Record<string, unknown>;
  if (Array.isArray(o.spans)) return o.spans;
  if (Array.isArray(o.units)) return o.units;
  if (Array.isArray(o.tokens)) return o.tokens;
  return [];
}

/**
 * Locate model spans left-to-right, then fill gaps with Segmenter words.
 * Never used for English.
 */
export function normalizeLearningSpans(
  raw: unknown,
  sentence: string,
): LearningSpan[] {
  const source = sentence.replace(/\s+/g, " ").trim() ? sentence : "";
  if (!source) return [];
  const items = rawSpanItems(raw);
  const located: LearningSpan[] = [];
  let from = 0;
  for (const item of items) {
    const o =
      typeof item === "string"
        ? { text: item }
        : item && typeof item === "object"
          ? (item as Record<string, unknown>)
          : null;
    if (!o) continue;
    const needle = asLine(o.text) || asLine(o.surface) || asLine(o.unit);
    if (!needle || needle.length > 80) continue;
    if (!selectionFitsSentence(source, needle)) continue;
    if (coversWholeSentence(source, needle)) continue;
    const start = indexOfPiece(source, needle, from);
    if (start < 0) continue;
    const end = start + needle.length;
    const text = source.slice(start, end);
    const reading = asLine(o.reading) || asLine(o.romanization);
    const meaning = asLine(o.meaning) || asLine(o.gloss);
    const baseForm = asLine(o.baseForm) || asLine(o.lemma);
    const inner = parseInner(o.inner ?? o.parts ?? o.words, text);
    located.push({
      text,
      start,
      end,
      kind: asSpanKind(o.kind ?? o.type),
      ...(reading ? { reading } : {}),
      ...(meaning ? { meaning } : {}),
      ...(baseForm ? { baseForm } : {}),
      ...(inner.length ? { inner } : {}),
    });
    from = end;
    if (located.length >= 48) break;
  }
  const covered = fillCoverage(source, located);
  return covered.length > 0 ? covered : fallbackSpans(source, 0);
}

export function fallbackLearningSpans(sentence: string): LearningSpan[] {
  return fillCoverage(sentence, []);
}

/** English: always Segmenter word spans. Other languages: cached AI spans, else Segmenter. */
export function listClickableSpans(
  sentence: string,
  targetLanguage: string,
): WordSpan[] {
  if (!isLearningLanguageCode(targetLanguage) || targetLanguage === "en") {
    return listWordSpans(sentence);
  }
  const cached = peekLearningSpans(sentence, targetLanguage);
  if (cached && cached.length > 0) {
    return cached.map((span) => ({
      text: span.text,
      start: span.start,
      end: span.end,
    }));
  }
  return listWordSpans(sentence);
}

export function tokensFromLearningSpans(
  sentence: string,
  spans: LearningSpan[],
): string[] {
  if (spans.length === 0) return tokenize(sentence);
  const out: string[] = [];
  let cursor = 0;
  for (const span of spans) {
    if (span.start < cursor) continue;
    if (span.start > cursor) {
      out.push(sentence.slice(cursor, span.start));
    }
    out.push(span.text);
    cursor = span.end;
  }
  if (cursor < sentence.length) out.push(sentence.slice(cursor));
  return out.filter((part) => part.length > 0);
}

export function findLearningSpan(
  spans: LearningSpan[] | null | undefined,
  text: string,
  hintStart?: number,
): LearningSpan | null {
  if (!spans?.length) return null;
  const needle = text.replace(/\s+/g, " ").trim();
  if (!needle) return null;
  const matches = spans.filter((span) => span.text === needle);
  if (matches.length === 0) return null;
  if (hintStart == null || matches.length === 1) return matches[0] ?? null;
  return matches.reduce((best, span) =>
    Math.abs(span.start - hintStart) < Math.abs(best.start - hintStart)
      ? span
      : best,
  );
}

export function clickRangeForText(
  sentence: string,
  selected: string,
  targetLanguage: string,
): { start: number; end: number } | null {
  const words = listClickableSpans(sentence, targetLanguage);
  if (words.length === 0) return null;
  const needle = selected.replace(/\s+/g, " ").trim();
  if (!needle) return { start: 0, end: words.length - 1 };
  const hay = sentence.toLowerCase();
  const want = needle.toLowerCase();
  let index = hay.indexOf(want);
  if (index < 0) {
    if (hay.replace(/\s+/g, "").indexOf(want.replace(/\s+/g, "")) < 0) {
      return { start: 0, end: words.length - 1 };
    }
    return { start: 0, end: words.length - 1 };
  }
  const end = index + needle.length;
  const startWord = words.findIndex((word) => word.end > index);
  let endWord = words.length - 1;
  for (let i = words.length - 1; i >= 0; i -= 1) {
    if (words[i].start < end) {
      endWord = i;
      break;
    }
  }
  if (startWord < 0) return { start: 0, end: words.length - 1 };
  return { start: startWord, end: Math.max(startWord, endWord) };
}

export function textForClickRange(
  sentence: string,
  start: number,
  end: number,
  targetLanguage: string,
): string {
  const words = listClickableSpans(sentence, targetLanguage);
  if (words.length === 0) return sentence.replace(/\s+/g, " ").trim();
  const from = words[Math.max(0, Math.min(start, words.length - 1))];
  const to = words[Math.max(0, Math.min(end, words.length - 1))];
  if (!from || !to) return sentence.replace(/\s+/g, " ").trim();
  const left = Math.min(from.start, to.start);
  const right = Math.max(from.end, to.end);
  return sentence.slice(left, right).replace(/\s+/g, " ").trim();
}
