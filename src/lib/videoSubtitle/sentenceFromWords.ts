import {
  flattenSttToTimedWords,
  segmentsFromSentenceSpans,
  spanFromWordSlice,
  textFromTimedWords,
} from "./timedWords.ts";
import { countCjkLetters, normalizeSttToken } from "./sttTokens.ts";
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

function firstLetter(text: string): string {
  return text.match(/\p{L}/u)?.[0] ?? "";
}

function isLowercaseLetter(letter: string): boolean {
  return Boolean(letter) && letter === letter.toLowerCase() && letter !== letter.toUpperCase();
}

function isUppercaseLetter(letter: string): boolean {
  return Boolean(letter) && letter === letter.toUpperCase() && letter !== letter.toLowerCase();
}

/**
 * The period was Whisper's, not the speaker's.
 *
 * Fast speech is where a speech model drops punctuation in the wrong place:
 * "the sensor is. actually smaller than you think" gets a full stop after a
 * word that no rule here calls open, and the sentence is cut in half. What
 * gives it away is the word after it. A sentence the model believes in starts
 * with a capital — it capitalises every sentence it writes — so a lowercase
 * word after a full stop means the model did not believe in that stop either.
 *
 * Only asked of material that uses case at all, which the line's own opening
 * word settles: YouTube's automatic captions arrive entirely lowercase and
 * unpunctuated, and there this decides nothing.
 */
export function continuesPastPunctuation(current: string, nextWord: string): boolean {
  if (isSpeakerMark(nextWord)) return false;
  if (!isUppercaseLetter(firstLetter(current))) return false;
  // "Never gonna give you up. up Never gonna..." — a chunk boundary repeating
  // its last word looks exactly like a sentence carrying on, and gluing the two
  // lines together is how the echo would survive: it is stripped after the cut,
  // not before it.
  if (normalizeSttToken(nextWord) === normalizeSttToken(lastToken(current))) {
    return false;
  }
  return isLowercaseLetter(firstLetter(nextWord));
}

function tokenCount(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

/** One word is not a subtitle. An unspaced CJK clause is one word and is. */
function isLoneFragment(span: SentenceSpan): boolean {
  if (tokenCount(span.text) !== 1) return false;
  if (isSpeakerMark(span.text)) return false;
  return countCjkLetters(span.text) < 8;
}

function joinable(
  words: TimedWord[],
  left: SentenceSpan,
  right: SentenceSpan,
): boolean {
  const before = words[left.endIndex];
  const after = words[right.startIndex];
  if (!before || !after) return false;
  if (isSpeakerMark(after.text)) return false;
  return !(
    before.speakerTag &&
    after.speakerTag &&
    before.speakerTag !== after.speakerTag
  );
}

/**
 * Give a one-word line to the line beside it.
 *
 * "Right." "Okay so." "I mean." — a quick speaker scatters these between
 * sentences and a speech model ends each with a full stop, so every one of
 * them became a cue of its own, on screen for four tenths of a second. There is
 * nothing to read there and nothing to study, and it is what a learner notices
 * first about a fast video.
 *
 * The fragment goes to the sentence that follows it, which is where it belongs
 * in the talking: "Right. But it still shoots 4K sixty." One at the very end of
 * the transcript has nothing after it and goes to the line before instead.
 * Never across a change of speaker — there the short answer is the turn.
 */
export function absorbLoneFragments(
  words: TimedWord[],
  spans: SentenceSpan[],
): SentenceSpan[] {
  if (spans.length < 2) return spans;
  const out: SentenceSpan[] = [];
  for (const span of spans) {
    const prev = out[out.length - 1];
    if (prev && isLoneFragment(prev) && joinable(words, prev, span)) {
      const merged = spanFromWordSlice(words, prev.startIndex, span.endIndex);
      if (merged) {
        out[out.length - 1] = merged;
        continue;
      }
    }
    out.push(span);
  }
  const last = out[out.length - 1];
  const before = out[out.length - 2];
  if (last && before && isLoneFragment(last) && joinable(words, before, last)) {
    const merged = spanFromWordSlice(words, before.startIndex, last.endIndex);
    if (merged) out.splice(out.length - 2, 2, merged);
  }
  return out;
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
      !openNounPhrase(currentText) &&
      !(next && continuesPastPunctuation(currentText, next.text))
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
 * How much of the speech the model may swallow before its answer is refused.
 *
 * The match exists to catch a model that rewrote the speech instead of marking
 * it, and it used to demand the words back exactly. What the model actually
 * does, asked to punctuate an automatic caption track, is tidy: it drops the
 * "um" and the "uh" it was told to keep. Measured on a fifteen-minute talk cut
 * into twenty-two pieces, that was the whole of the disagreement in four of
 * them — one or two fillers each, never a rewritten phrase.
 *
 * Refusing over that is expensive, because the fallback is the unsplit span:
 * one caption for the whole video. So a short run of dropped words is skipped
 * past instead. Nothing is lost by skipping — a span is a pair of indices into
 * the original words, and the subtitle is built from those, so a filler the
 * model left out still shows up in whichever sentence it falls inside.
 */
const MAX_DROPPED_RUN = 2;
const MAX_DROPPED_SHARE = 0.05;

function nextTokenIndex(words: TimedWord[], from: number): number {
  let cursor = from;
  while (cursor < words.length && !normalizeMatchToken(words[cursor]!.text)) {
    cursor += 1;
  }
  return cursor;
}

/**
 * Align LLM sentences to the original word list. Returns null when the answer
 * has drifted far enough to be a rewrite, so callers fall back to punctuation.
 */
export function matchSentencesToWordIndices(
  words: TimedWord[],
  sentences: string[],
): Array<{ startIndex: number; endIndex: number }> | null {
  const spoken = words.filter((word) => normalizeMatchToken(word.text)).length;
  const dropBudget = Math.max(MAX_DROPPED_RUN, Math.floor(spoken * MAX_DROPPED_SHARE));
  let dropped = 0;

  let cursor = 0;
  const spans: Array<{ startIndex: number; endIndex: number }> = [];
  for (const sentence of sentences) {
    const tokens = tokenizeForWordMatch(sentence);
    if (tokens.length === 0) continue;
    cursor = nextTokenIndex(words, cursor);
    const startIndex = cursor;
    for (const token of tokens) {
      let found = -1;
      let skipped = 0;
      let probe = nextTokenIndex(words, cursor);
      while (probe < words.length && skipped <= MAX_DROPPED_RUN) {
        if (normalizeMatchToken(words[probe]!.text) === token) {
          found = probe;
          break;
        }
        skipped += 1;
        probe = nextTokenIndex(words, probe + 1);
      }
      if (found < 0) return null;
      dropped += skipped;
      if (dropped > dropBudget) return null;
      cursor = found + 1;
    }
    spans.push({ startIndex, endIndex: cursor - 1 });
  }
  if (spans.length === 0) return null;
  // Words past the last sentence are the same kind of tidying, at the end of
  // the answer instead of inside it. They join the sentence they follow.
  if (cursor < words.length) {
    const tail = words
      .slice(cursor)
      .filter((word) => normalizeMatchToken(word.text)).length;
    if (dropped + tail > dropBudget) return null;
    spans[spans.length - 1]!.endIndex = words.length - 1;
  }
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

/**
 * How much speech goes to the model at once.
 *
 * YouTube's automatic captions carry no punctuation at all, so a whole video
 * arrives as one span and used to be marked in one request. Measured on the
 * longest video this app will prepare — fifteen minutes, 2,786 words of
 * automatic captions — that request took 45 seconds and came back seventeen
 * words short, which is a refusal, which is one caption for the whole video.
 *
 * The same transcript cut into pieces of about 150 words answered in 4.2
 * seconds with the pieces running at once, and a piece the model spoils costs
 * only its own stretch of the video. 150 words is roughly a minute of talking,
 * which is enough of a run for the model to hear where the sentences end.
 */
const LLM_CHUNK_WORDS = 150;
const LLM_CHUNK_PARALLEL = 6;

/**
 * Cut where the talking stops.
 *
 * A boundary has to fall somewhere, and the longest silence in the region is
 * the likeliest place for a sentence to have ended. Only the seam is at risk:
 * the model sees each side whole.
 */
export function chunkWordsForLlm(
  words: TimedWord[],
  target = LLM_CHUNK_WORDS,
): Array<{ startIndex: number; endIndex: number }> {
  const out: Array<{ startIndex: number; endIndex: number }> = [];
  if (words.length === 0) return out;
  let start = 0;
  while (start < words.length) {
    if (words.length - start <= target * 1.4) {
      out.push({ startIndex: start, endIndex: words.length - 1 });
      break;
    }
    const from = start + Math.floor(target * 0.7);
    const to = Math.min(words.length - 2, start + Math.floor(target * 1.3));
    let best = to;
    let bestGap = -Infinity;
    for (let i = from; i <= to; i += 1) {
      const gap = (words[i + 1]?.startMs ?? 0) - (words[i]?.endMs ?? 0);
      if (gap > bestGap) {
        bestGap = gap;
        best = i;
      }
    }
    out.push({ startIndex: start, endIndex: best });
    start = best + 1;
  }
  return out;
}

async function markedSpansForChunk(
  words: TimedWord[],
  chunk: { startIndex: number; endIndex: number },
  split: LlmSentenceSplitter,
): Promise<SentenceSpan[] | null> {
  const slice = words.slice(chunk.startIndex, chunk.endIndex + 1);
  let marked: string | null = null;
  try {
    marked = await split(textFromTimedWords(slice));
  } catch {
    marked = null;
  }
  const refined = marked ? applyLlmSentenceMarks(slice, marked) : null;
  if (!refined) return null;
  return refined
    .map((part) =>
      spanFromWordSlice(
        words,
        chunk.startIndex + part.startIndex,
        chunk.startIndex + part.endIndex,
      ),
    )
    .filter((span): span is SentenceSpan => Boolean(span));
}

async function inBatches<T, R>(
  items: T[],
  size: number,
  run: (item: T) => Promise<R>,
): Promise<R[]> {
  const out: R[] = [];
  for (let i = 0; i < items.length; i += size) {
    out.push(...(await Promise.all(items.slice(i, i + size).map(run))));
  }
  return out;
}

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
    const chunks = chunkWordsForLlm(
      words.slice(span.startIndex, span.endIndex + 1),
    ).map((chunk) => ({
      startIndex: span.startIndex + chunk.startIndex,
      endIndex: span.startIndex + chunk.endIndex,
    }));
    const results = await inBatches(chunks, LLM_CHUNK_PARALLEL, (chunk) =>
      markedSpansForChunk(words, chunk, split),
    );
    results.forEach((refined, index) => {
      const chunk = chunks[index]!;
      if (refined && refined.length > 0) {
        out.push(...refined);
        return;
      }
      // The model spoiled this stretch. Keep it as one line rather than lose
      // the ones around it, which is what a single request used to cost.
      const whole = spanFromWordSlice(words, chunk.startIndex, chunk.endIndex);
      if (whole) out.push(whole);
    });
  }
  return absorbLoneFragments(words, out.length > 0 ? out : spans);
}

export function splitSentencesFromWords(
  words: TimedWord[],
): SentenceSpan[] {
  return absorbLoneFragments(words, splitWordsByPunctAndSpeaker(words));
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
