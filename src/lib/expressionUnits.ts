import { segmentEnglishForLookup } from "@/lib/englishPhrases";
import { selectionFitsSentence } from "@/lib/expressionInsight";
import {
  isLearnableEnglishWord,
  normalizeVocabHeadword,
} from "@/lib/vocabulary";

export type ExpressionUnitSpan = {
  text: string;
  start: number;
  end: number;
};

function normalizePiece(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function isWordChar(char: string | undefined) {
  return Boolean(char && /[\p{L}\p{M}'’]/u.test(char));
}

function isCjkRun(value: string) {
  return /[\u3040-\u30ff\u3400-\u9fff]/u.test(value);
}

function sitsOnTokenEdge(sentence: string, start: number, end: number) {
  const piece = sentence.slice(start, end);
  // Japanese/Chinese have no spaces between words; exact substrings are valid units.
  if (isCjkRun(piece)) return true;
  const before = start <= 0 ? "" : sentence[start - 1];
  const after = end >= sentence.length ? "" : sentence[end];
  return !isWordChar(before) && !isWordChar(after);
}

/** All occurrences of `needle` in `sentence` that sit on word boundaries. */
export function locatePiece(
  sentence: string,
  needleRaw: string,
): ExpressionUnitSpan[] {
  const needle = normalizePiece(needleRaw);
  if (!needle || !selectionFitsSentence(sentence, needle)) return [];
  const hay = sentence.toLowerCase();
  const want = needle.toLowerCase();
  const out: ExpressionUnitSpan[] = [];
  let from = 0;
  while (from <= hay.length) {
    const index = hay.indexOf(want, from);
    if (index < 0) break;
    const end = index + want.length;
    if (sitsOnTokenEdge(sentence, index, end)) {
      out.push({
        text: sentence.slice(index, end),
        start: index,
        end,
      });
    }
    from = index + 1;
  }
  return out;
}

export function locateUnits(
  sentence: string,
  unitTexts: string[],
): ExpressionUnitSpan[] {
  const seen = new Set<string>();
  const spans: ExpressionUnitSpan[] = [];
  for (const unit of unitTexts) {
    for (const span of locatePiece(sentence, unit)) {
      const key = `${span.start}:${span.end}`;
      if (seen.has(key)) continue;
      seen.add(key);
      spans.push(span);
    }
  }
  return spans.sort((a, b) => a.start - b.start || a.end - b.end);
}

/**
 * Local backup when the model is unavailable: known phrases, then
 * leftover content words. Phrases are greedy and non-overlapping.
 */
export function localExpressionUnits(sentence: string): string[] {
  const units: string[] = [];
  const seen = new Set<string>();
  for (const segment of segmentEnglishForLookup(sentence)) {
    if (segment.kind === "phrase") {
      const text = normalizePiece(segment.value);
      const key = text.toLowerCase();
      if (!text || seen.has(key)) continue;
      seen.add(key);
      units.push(text);
      continue;
    }
    if (segment.kind !== "word") continue;
    if (!isLearnableEnglishWord(segment.value)) continue;
    const text = normalizePiece(segment.value);
    const key = text.toLowerCase();
    if (!text || seen.has(key)) continue;
    seen.add(key);
    units.push(text);
  }
  return units;
}

export function normalizeUnitTexts(raw: unknown, sentence: string): string[] {
  if (!raw || typeof raw !== "object") return [];
  const list = (raw as { units?: unknown }).units;
  if (!Array.isArray(list)) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const item of list) {
    const text =
      typeof item === "string"
        ? normalizeVocabHeadword(normalizePiece(item))
        : "";
    if (!text || text.length > 80) continue;
    if (!selectionFitsSentence(sentence, text)) continue;
    if (coversWholeSentence(sentence, text) && !isShortSaying(sentence)) {
      continue;
    }
    const key = text.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(text);
    if (out.length >= 32) break;
  }
  return out;
}

function lettersOnly(value: string) {
  return normalizePiece(value)
    .toLowerCase()
    .replace(/[^\p{L}\p{M}\p{N}\s]+/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

function countWords(value: string) {
  return normalizePiece(value).split(" ").filter(Boolean).length;
}

function isShortSaying(sentence: string) {
  const text = normalizePiece(sentence);
  if (isCjkRun(text) && !/\s/.test(text)) {
    return Array.from(lettersOnly(text).replace(/\s/g, "")).length <= 8;
  }
  return countWords(text) <= 4 && text.length <= 40;
}

function coversWholeSentence(sentence: string, text: string) {
  const a = lettersOnly(sentence);
  const b = lettersOnly(text);
  return Boolean(a && b && a === b);
}

/**
 * Smallest multi-word idiom/chunk that fully covers this tap.
 * Used when a learner taps one word and should get the whole expression.
 */
export function idiomUnitContaining(
  sentence: string,
  start: number,
  end: number,
  unitTexts: string[],
): ExpressionUnitSpan | null {
  const covering = locateUnits(sentence, unitTexts)
    .filter((unit) => unit.start <= start && unit.end >= end)
    .filter((unit) => {
      if (countWords(unit.text) >= 2) return true;
      if (isCjkRun(unit.text) && unit.end - unit.start > end - start) return true;
      return false;
    })
    .filter(
      (unit) =>
        !coversWholeSentence(sentence, unit.text) || isShortSaying(sentence),
    );
  if (covering.length === 0) return null;
  covering.sort(
    (a, b) => a.end - a.start - (b.end - b.start) || a.start - b.start,
  );
  return covering[0];
}
