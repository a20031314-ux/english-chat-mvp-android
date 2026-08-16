import {
  isKnownEnglishPhrase,
  segmentEnglishForLookup,
} from "@/lib/englishPhrases";
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

function overlap(a: ExpressionUnitSpan, b: ExpressionUnitSpan) {
  return Math.max(0, Math.min(a.end, b.end) - Math.max(a.start, b.start));
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

/** True when snapping would swallow a word tap into a sentence-sized chunk. */
export function isOversizedExpressionSnap(
  sentence: string,
  selected: string,
  unitText: string,
) {
  if (
    coversWholeSentence(sentence, unitText) &&
    !coversWholeSentence(sentence, selected) &&
    !isShortSaying(sentence)
  ) {
    return true;
  }
  const selectedCount = countWords(selected);
  const unitCount = countWords(unitText);
  if (
    selectedCount <= 1 &&
    unitCount >= 2 &&
    isKnownEnglishPhrase(unitText)
  ) {
    return false;
  }
  if (selectedCount <= 1 && unitCount > 4) return true;
  if (
    selectedCount <= 1 &&
    !/\s/.test(normalizePiece(selected)) &&
    unitText.replace(/\s/g, "").length >=
      Math.max(8, normalizePiece(selected).length * 4)
  ) {
    return !isKnownEnglishPhrase(unitText);
  }
  return false;
}

function acceptableSnap(
  sentence: string,
  selected: string,
  unit: ExpressionUnitSpan,
) {
  return !isOversizedExpressionSnap(sentence, selected, unit.text);
}

/**
 * Snap a free selection onto the tightest meaningful unit that covers it.
 * Single-word taps stay words — phrase snap is only for multi-word drags.
 * Returns null when the tap did not land on a unit (e.g. a lone "the").
 */
export function snapToExpressionUnit(
  sentence: string,
  selected: string,
  unitTexts: string[],
  hintStart?: number,
): ExpressionUnitSpan | null {
  const units = locateUnits(sentence, unitTexts);
  if (units.length === 0) return null;

  const hits = locatePiece(sentence, selected);
  let selection = hits[0] ?? null;
  if (hits.length > 1 && hintStart != null) {
    selection = hits.reduce((best, span) =>
      Math.abs(span.start - hintStart) < Math.abs(best.start - hintStart)
        ? span
        : best,
    );
  }
  if (!selection && hintStart != null) {
    selection = {
      text: selected,
      start: hintStart,
      end: hintStart + selected.length,
    };
  }
  if (!selection) return null;

  // A single-word tap stays that word. Phrase snap is only for multi-word drags.
  if (countWords(selected) <= 1 && !/\s/.test(normalizePiece(selected))) return null;

  const containing = units.filter(
    (unit) => unit.start <= selection.start && unit.end >= selection.end,
  );
  if (containing.length > 0) {
    containing.sort(
      (a, b) => a.end - a.start - (b.end - b.start) || a.start - b.start,
    );
    const best = containing.find((unit) =>
      acceptableSnap(sentence, selected, unit),
    );
    if (best) return best;
    return null;
  }

  const overlapping = units
    .map((unit) => ({ unit, score: overlap(unit, selection) }))
    .filter(
      (item) =>
        item.score > 0 && acceptableSnap(sentence, selected, item.unit),
    )
    .sort(
      (a, b) =>
        b.score - a.score ||
        a.unit.end - a.unit.start - (b.unit.end - b.unit.start),
    );
  return overlapping[0]?.unit ?? null;
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
