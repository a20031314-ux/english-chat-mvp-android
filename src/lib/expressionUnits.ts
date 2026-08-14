import { segmentEnglishForLookup } from "@/lib/englishPhrases";
import { selectionFitsSentence } from "@/lib/expressionInsight";
import { isLearnableEnglishWord } from "@/lib/vocabulary";

export type ExpressionUnitSpan = {
  text: string;
  start: number;
  end: number;
};

function normalizePiece(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function isWordChar(char: string | undefined) {
  return Boolean(char && /[A-Za-z']/.test(char));
}

function sitsOnTokenEdge(sentence: string, start: number, end: number) {
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
    const text = typeof item === "string" ? normalizePiece(item) : "";
    if (!text || text.length > 80) continue;
    if (!selectionFitsSentence(sentence, text)) continue;
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

/**
 * Snap a free selection onto the tightest meaningful unit that covers it.
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

  const containing = units.filter(
    (unit) => unit.start <= selection.start && unit.end >= selection.end,
  );
  if (containing.length > 0) {
    containing.sort(
      (a, b) => a.end - a.start - (b.end - b.start) || a.start - b.start,
    );
    return containing[0];
  }

  const overlapping = units
    .map((unit) => ({ unit, score: overlap(unit, selection) }))
    .filter((item) => item.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        a.unit.end - a.unit.start - (b.unit.end - b.unit.start),
    );
  return overlapping[0]?.unit ?? null;
}
