import type { SentenceSpan, SttSegment, SttWord, TimedWord } from "./types";

function normalizeToken(value: string): string {
  return value.toLowerCase().replace(/^[^a-z0-9가-힣']+|[^a-z0-9가-힣']+$/gi, "");
}

function toMs(seconds: number): number {
  return Math.round(Math.max(0, seconds) * 1000);
}

export function sttWordToTimed(word: SttWord, speakerTag?: string | null): TimedWord {
  const startMs = toMs(word.start);
  const endMs = Math.max(startMs + 80, toMs(word.end));
  return {
    text: word.word.replace(/\s+/g, " ").trim(),
    startMs,
    endMs,
    ...(speakerTag ? { speakerTag } : {}),
  };
}

export function interpolateTimedWords(
  text: string,
  startSeconds: number,
  endSeconds: number,
  speakerTag?: string | null,
  capEndSeconds?: number,
): TimedWord[] {
  const parts = text.replace(/\s+/g, " ").trim().split(" ").filter(Boolean);
  if (parts.length === 0) return [];
  const from = Math.max(0, startSeconds);
  const expected = Math.min(16, Math.max(0.4, parts.length / 3.2));
  let to = Math.max(from + 0.35, endSeconds, from + expected);
  if (
    capEndSeconds != null &&
    capEndSeconds > from + 0.3 &&
    capEndSeconds >= endSeconds - 0.05
  ) {
    to = Math.min(to, capEndSeconds);
  }
  const step = (to - from) / parts.length;
  return parts.map((part, index) =>
    sttWordToTimed(
      {
        word: part,
        start: from + index * step,
        end: from + (index + 1) * step,
      },
      speakerTag,
    ),
  );
}

function wordsCoverText(words: SttWord[], text: string): boolean {
  const fromWords = words.map((word) => normalizeToken(word.word)).filter(Boolean);
  const fromText = text.split(/\s+/).map(normalizeToken).filter(Boolean);
  if (fromWords.length === 0 || fromText.length === 0) return false;
  if (Math.abs(fromWords.length - fromText.length) > 2) return false;
  let hits = 0;
  const limit = Math.min(fromWords.length, fromText.length);
  for (let i = 0; i < limit; i += 1) {
    if (fromWords[i] === fromText[i]) hits += 1;
  }
  return hits / limit >= 0.7;
}

function speakerFromText(text: string): string | null {
  const match = text.trim().match(/^>>\s*([^:.\n]{1,40})[:.]?/);
  return match?.[1]?.trim() || null;
}

export function timedWordsFromSegment(
  segment: SttSegment,
  capEndSeconds?: number,
): TimedWord[] {
  const text = segment.text.replace(/\s+/g, " ").trim();
  if (!text) return [];
  const speaker = speakerFromText(text);
  if (segment.words && wordsCoverText(segment.words, text)) {
    return segment.words
      .map((word) => sttWordToTimed(word, speaker))
      .filter((word) => word.text);
  }
  return interpolateTimedWords(
    text,
    segment.startTime,
    segment.endTime,
    speaker,
    capEndSeconds,
  );
}

function dropAdjacentEcho(words: TimedWord[]): TimedWord[] {
  if (words.length === 0) return words;
  const out: TimedWord[] = [words[0]!];
  for (let i = 1; i < words.length; i += 1) {
    const current = words[i]!;
    const prev = out[out.length - 1]!;
    const left = normalizeToken(prev.text);
    const right = normalizeToken(current.text);
    if (left && left === right && left.length >= 3) continue;
    out.push(current);
  }
  return out;
}

/**
 * Concatenate STT chunks into one word list. Callers should collapse karaoke
 * captions first. Later sentence cuts are word-index slices, not string splits.
 */
export function flattenSttToTimedWords(segments: SttSegment[]): TimedWord[] {
  const kept = segments.filter((segment) =>
    segment.text.replace(/\s+/g, " ").trim(),
  );
  const words = dropAdjacentEcho(
    kept.flatMap((segment, index) =>
      timedWordsFromSegment(segment, kept[index + 1]?.startTime),
    ),
  );
  for (let i = 0; i < words.length - 1; i += 1) {
    const current = words[i]!;
    const next = words[i + 1]!;
    if (next.startMs > current.startMs) {
      current.endMs = Math.max(
        current.startMs + 80,
        Math.min(current.endMs, next.startMs),
      );
    }
  }
  return words;
}

export function textFromTimedWords(words: TimedWord[]): string {
  return words
    .map((word) => word.text)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

export function spanFromWordSlice(
  words: TimedWord[],
  startIndex: number,
  endIndex: number,
): SentenceSpan | null {
  if (startIndex < 0 || endIndex < startIndex || endIndex >= words.length) {
    return null;
  }
  const slice = words.slice(startIndex, endIndex + 1);
  const text = textFromTimedWords(slice);
  if (!text) return null;
  const startMs = Math.min(...slice.map((word) => word.startMs));
  const endMs = Math.max(
    startMs + 250,
    ...slice.map((word) => word.endMs),
  );
  return { startIndex, endIndex, text, startMs, endMs };
}

export function segmentsFromSentenceSpans(
  words: TimedWord[],
  spans: SentenceSpan[],
): SttSegment[] {
  return spans.map((span, index) => {
    const slice = words.slice(span.startIndex, span.endIndex + 1);
    const startTime = span.startMs / 1000;
    const endTime = Math.max(startTime + 0.25, span.endMs / 1000);
    return {
      id: `w-${index}-${span.startMs}`,
      text: span.text,
      startTime,
      endTime,
      words: slice.map((word) => ({
        word: word.text,
        start: word.startMs / 1000,
        end: word.endMs / 1000,
      })),
    };
  });
}
