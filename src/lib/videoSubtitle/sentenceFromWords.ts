import {
  flattenSttToTimedWords,
  segmentsFromSentenceSpans,
  spanFromWordSlice,
  textFromTimedWords,
} from "./timedWords.ts";
import { countCjkLetters, countLetters, normalizeSttToken } from "./sttTokens.ts";
import type { SentenceSpan, SttSegment, TimedWord } from "./types";

const SENTENCE_PUNCT = /[.!?…。！？]["')\]]*$/u;
const ABBREV =
  /^(mr|mrs|ms|dr|prof|sr|jr|vs|etc|st|no|u\.s|u\.k|e\.g|i\.e)\.?$/i;
const SPEAKER_MARK = /^>>/;

function stripTrailingPunct(text: string): string {
  return text.trim().replace(/[.!?…。！？]+$/gu, "").trim();
}

function lastToken(text: string): string {
  return stripTrailingPunct(text).split(/\s+/).pop() || "";
}

function endsOpen(text: string): boolean {
  const last = lastToken(text);
  if (!last) return true;
  if (/^[a-z]+n't$/i.test(last)) return true;
  return /^(a|an|the|to|of|for|with|and|or|but|as|by|from|into|at|in|on|my|your|our|their|his|her|its|this|these|those|what|which|whose|whom|who|how|where|when|why)$/i.test(
    last,
  );
}

function openNounPhrase(text: string): boolean {
  return /\b(a|an|the|my|your|our|their|his|her|its|this|that|these|those)\s+(first|last|next|other|same|new|old|good|bad|little|big|more|most|few|many|own|only|main|real|right|wrong|best|worst)\s*[.!?…]?$/i.test(
    text.trim(),
  );
}

function looksFinished(text: string): boolean {
  const trimmed = text.replace(/\s+/g, " ").trim();
  if (!trimmed || endsOpen(trimmed) || openNounPhrase(trimmed)) return false;
  const words = trimmed.split(/\s+/).filter(Boolean).length;
  if (SENTENCE_PUNCT.test(trimmed) && (words >= 3 || countCjkLetters(trimmed) >= 8)) {
    return true;
  }
  return false;
}

function normalizeMatchToken(value: string): string {
  return normalizeSttToken(value);
}

/** Whole Whisper line interpolated as one unspaced CJK token. */
function isUnspacedCjkClause(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed || /\s/.test(trimmed)) return false;
  return countCjkLetters(trimmed) >= 8;
}

function isAbbrevWord(word: string): boolean {
  return ABBREV.test(word.replace(/["')\]]+$/g, ""));
}

function isSpeakerMark(word: string): boolean {
  return SPEAKER_MARK.test(word.trim());
}

/**
 * Punctuation and speaker changes only. Acoustic pauses are ignored so VAD
 * chunks cannot cut a sentence. Unpunctuated runs stay together for LLM.
 */
export function splitWordsByPunctAndSpeaker(words: TimedWord[]): SentenceSpan[] {
  if (words.length === 0) return [];
  const cuts: number[] = [];
  let start = 0;
  for (let i = 0; i < words.length; i += 1) {
    const word = words[i]!;
    const next = words[i + 1];
    if (next && isSpeakerMark(next.text) && i >= start) {
      cuts.push(i);
      start = i + 1;
      continue;
    }
    if (
      next &&
      word.speakerTag &&
      next.speakerTag &&
      word.speakerTag !== next.speakerTag
    ) {
      cuts.push(i);
      start = i + 1;
      continue;
    }
    if (
      next &&
      isUnspacedCjkClause(word.text) &&
      isUnspacedCjkClause(next.text) &&
      i >= start
    ) {
      cuts.push(i);
      start = i + 1;
      continue;
    }
    const currentText = textFromTimedWords(words.slice(start, i + 1));
    if (
      SENTENCE_PUNCT.test(word.text.trim()) &&
      !isAbbrevWord(word.text) &&
      !endsOpen(currentText) &&
      !openNounPhrase(currentText)
    ) {
      cuts.push(i);
      start = i + 1;
    }
  }
  const ends = cuts.length > 0 && cuts[cuts.length - 1] === words.length - 1
    ? cuts
    : [...cuts, words.length - 1];
  const spans: SentenceSpan[] = [];
  let from = 0;
  for (const end of ends) {
    if (end < from) continue;
    const span = spanFromWordSlice(words, from, end);
    if (span) spans.push(span);
    from = end + 1;
  }
  return spans;
}

export function tokenizeForWordMatch(text: string): string[] {
  return text.split(/\s+/).map(normalizeMatchToken).filter(Boolean);
}

/**
 * Align LLM sentences to the original word list. Returns null on any
 * insert/delete so callers can fall back to punctuation cuts.
 */
export function matchSentencesToWordIndices(
  words: TimedWord[],
  sentences: string[],
): Array<{ startIndex: number; endIndex: number }> | null {
  const expected = words.map((word) => normalizeMatchToken(word.text)).filter(Boolean);
  const got = sentences.flatMap(tokenizeForWordMatch);
  if (expected.join(" ") !== got.join(" ")) return null;

  let cursor = 0;
  const spans: Array<{ startIndex: number; endIndex: number }> = [];
  for (const sentence of sentences) {
    const tokens = tokenizeForWordMatch(sentence);
    if (tokens.length === 0) continue;
    while (cursor < words.length && !normalizeMatchToken(words[cursor]!.text)) {
      cursor += 1;
    }
    const startIndex = cursor;
    for (const token of tokens) {
      while (cursor < words.length && !normalizeMatchToken(words[cursor]!.text)) {
        cursor += 1;
      }
      if (cursor >= words.length) return null;
      if (normalizeMatchToken(words[cursor]!.text) !== token) return null;
      cursor += 1;
    }
    spans.push({ startIndex, endIndex: cursor - 1 });
  }
  while (cursor < words.length && !normalizeMatchToken(words[cursor]!.text)) {
    cursor += 1;
  }
  if (cursor !== words.length) return null;
  return spans;
}

export function parseLlmSentenceMarks(marked: string): string[] {
  return marked
    .replace(/\s+/g, " ")
    .trim()
    .split(/\s*\|\|\|\s*/)
    .map((part) => part.trim())
    .filter(Boolean);
}

export function applyLlmSentenceMarks(
  words: TimedWord[],
  marked: string,
): SentenceSpan[] | null {
  const sentences = parseLlmSentenceMarks(marked);
  if (sentences.length === 0) return null;
  const matched = matchSentencesToWordIndices(words, sentences);
  if (!matched) return null;
  const spans = matched
    .map((row) => spanFromWordSlice(words, row.startIndex, row.endIndex))
    .filter((span): span is SentenceSpan => Boolean(span));
  return spans.length > 0 ? spans : null;
}

export function needsLlmSentenceSplit(span: SentenceSpan): boolean {
  const words = span.text.split(/\s+/).filter(Boolean).length;
  const cjk = countCjkLetters(span.text);
  // One Whisper Japanese line is already a sentence.
  if (isUnspacedCjkClause(span.text) && cjk < 80) return false;
  if (words < 8) return false;
  if (looksFinished(span.text) && words <= 16) return false;
  return !SENTENCE_PUNCT.test(span.text.trim()) || words >= 18;
}

export type LlmSentenceSplitter = (text: string) => Promise<string | null>;

export async function refineSpansWithLlm(
  words: TimedWord[],
  spans: SentenceSpan[],
  split: LlmSentenceSplitter,
): Promise<SentenceSpan[]> {
  const out: SentenceSpan[] = [];
  for (const span of spans) {
    if (!needsLlmSentenceSplit(span)) {
      out.push(span);
      continue;
    }
    const slice = words.slice(span.startIndex, span.endIndex + 1);
    let marked: string | null = null;
    try {
      marked = await split(textFromTimedWords(slice));
    } catch {
      marked = null;
    }
    const refined = marked ? applyLlmSentenceMarks(slice, marked) : null;
    if (!refined) {
      out.push(span);
      continue;
    }
    for (const part of refined) {
      const mapped = spanFromWordSlice(
        words,
        span.startIndex + part.startIndex,
        span.startIndex + part.endIndex,
      );
      if (mapped) out.push(mapped);
    }
  }
  return out.length > 0 ? out : spans;
}

export function splitSentencesFromWords(
  words: TimedWord[],
): SentenceSpan[] {
  return splitWordsByPunctAndSpeaker(words);
}

export function sentenceSegmentsFromStt(segments: SttSegment[]): SttSegment[] {
  const words = flattenSttToTimedWords(segments);
  return segmentsFromSentenceSpans(words, splitSentencesFromWords(words));
}

export function logSentenceSplits(label: string, segments: SttSegment[]): void {
  console.info("[video-sentence-split]", {
    label,
    count: segments.length,
    sentences: segments.map((segment) => ({
      id: segment.id,
      text: segment.text,
      startMs: Math.round(segment.startTime * 1000),
      endMs: Math.round(segment.endTime * 1000),
      words: segment.words?.length ?? segment.text.split(/\s+/).filter(Boolean).length,
    })),
  });
}
