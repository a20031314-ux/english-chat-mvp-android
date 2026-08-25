import type { SttSegment } from "./types";
import { sentenceSegmentsFromStt } from "./sentenceFromWords.ts";

/** Whisper upload slices. Long enough for context, small enough for Vercel body limits. */
export const STT_CHUNK_SECONDS = 75;
export const STT_CHUNK_OVERLAP_SECONDS = 2;
const WAV_RATE = 16000;

export function sttChunkStarts(durationSeconds: number): number[] {
  const duration = Math.max(0, durationSeconds);
  if (duration <= STT_CHUNK_SECONDS + 5) return [0];
  const step = STT_CHUNK_SECONDS - STT_CHUNK_OVERLAP_SECONDS;
  const starts: number[] = [];
  for (let t = 0; t < duration - 1; t += step) {
    starts.push(Number(t.toFixed(3)));
    if (t + STT_CHUNK_SECONDS >= duration - 0.4) break;
  }
  return starts.length > 0 ? starts : [0];
}

export function mergeSttChunks(
  chunks: Array<{ startTime: number; segments: SttSegment[] }>,
): SttSegment[] {
  const ordered = [...chunks].sort((a, b) => a.startTime - b.startTime);
  let merged: SttSegment[] = [];
  for (const chunk of ordered) {
    if (merged.length === 0) {
      merged = [...chunk.segments];
      continue;
    }
    const cut =
      chunk.startTime +
      (chunk.startTime <= 0 ? 0 : STT_CHUNK_OVERLAP_SECONDS / 2);
    merged = merged.filter((segment) => segment.startTime < cut);
    merged.push(
      ...chunk.segments.filter((segment) => segment.startTime >= cut),
    );
  }
  return regularizeSttSegments(merged);
}

export function speechCoversDuration(
  segments: Array<{ startTime: number; endTime: number }>,
  durationSeconds: number,
): boolean {
  if (segments.length === 0) return false;
  const duration = Math.max(0, durationSeconds);
  const last = Math.max(...segments.map((segment) => segment.endTime));
  const first = Math.min(...segments.map((segment) => segment.startTime));
  const span = Math.max(0, last - first);
  if (!(duration > 25)) {
    return segments.length >= 6 && span >= 20;
  }
  const minSpan = Math.min(duration * 0.72, duration - 18);
  const minLines = Math.max(5, Math.floor(duration / 28));
  return span >= minSpan && segments.length >= minLines;
}

function normalizeWord(value: string): string {
  return value.toLowerCase().replace(/^[^a-z0-9가-힣]+|[^a-z0-9가-힣]+$/gi, "");
}

export function stripLeadingOverlap(previous: string, next: string): string {
  const prevWords = previous.split(/\s+/).filter(Boolean);
  const nextWords = next.split(/\s+/).filter(Boolean);
  if (prevWords.length === 0 || nextWords.length === 0) return next;
  const max = Math.min(6, prevWords.length, nextWords.length);
  for (let count = max; count >= 1; count -= 1) {
    if (count === nextWords.length && nextWords.length > 4) continue;
    const left = prevWords.slice(-count).map(normalizeWord).join(" ");
    const right = nextWords.slice(0, count).map(normalizeWord).join(" ");
    if (left && left === right) {
      const rest = nextWords.slice(count).join(" ");
      return rest;
    }
  }
  return next;
}

export function dedupeRepeatedWords(text: string): string {
  const words = text.split(/\s+/).filter(Boolean);
  const out: string[] = [];
  for (const word of words) {
    const prev = out[out.length - 1];
    if (
      prev &&
      normalizeWord(prev) === normalizeWord(word) &&
      normalizeWord(word).length >= 3
    ) {
      continue;
    }
    out.push(word);
  }
  return out.join(" ");
}

function dropBoundaryEchoes(segments: SttSegment[]): SttSegment[] {
  if (segments.length === 0) return segments;
  const out: SttSegment[] = [
    { ...segments[0]!, text: dedupeRepeatedWords(segments[0]!.text) },
  ];
  for (let i = 1; i < segments.length; i += 1) {
    const current = segments[i]!;
    const prev = out[out.length - 1]!;
    const text = dedupeRepeatedWords(
      stripLeadingOverlap(prev.text, current.text).replace(/\s+/g, " ").trim(),
    );
    if (!text) continue;
    out.push({ ...current, text });
  }
  return out;
}

const SENTENCE_END = /[.!?…]["']?$/;
const HARD_PAUSE_SECONDS = 0.48;
const WORDS_PER_SECOND = 3.2;
  const START_LEAD_SECONDS = 0.18;
const MAX_PREV_TRIM_SECONDS = 0.4;
const CUE_VERB =
  /\b(am|is|are|was|were|be|been|'s|'re|'m|do|does|did|have|has|had|'ve|will|would|can|could|should|need|needs|needed|go|goes|went|get|got|know|think|want|said|say|make|made|take|see|come|came|tell|told|leave|left|call|talk|keep|try|ask|show|give|feel|look)\b/i;

function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 1
    ? sorted[mid]!
    : (sorted[mid - 1]! + sorted[mid]!) / 2;
}

function cueEndsOpen(text: string): boolean {
  const last =
    text
      .trim()
      .replace(/[.!?…]+$/g, "")
      .split(/\s+/)
      .pop() || "";
  if (/^[a-z]+n't$/i.test(last)) return true;
  return /^(a|an|the|to|of|for|with|and|or|but|as|by|from|at|in|on|my|your|our|their|his|her|its|this|these|those)$/i.test(
    last,
  );
}

function cueLooksFinished(text: string): boolean {
  const trimmed = text.replace(/\s+/g, " ").trim();
  if (!trimmed || cueEndsOpen(trimmed)) return false;
  const words = trimmed.split(/\s+/).filter(Boolean).length;
  if (SENTENCE_END.test(trimmed) && words >= 3) return true;
  if (words >= 5 && CUE_VERB.test(trimmed)) return true;
  return words >= 9;
}

function cueFromWords(
  words: NonNullable<SttSegment["words"]>,
  extra?: Partial<SttSegment>,
): SttSegment | null {
  const text = words
    .map((word) => word.word)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
  if (!text) return null;
  const startTime = Math.max(0, words[0]!.start);
  return {
    id: extra?.id ?? `w-${Math.round(startTime * 1000)}`,
    text,
    startTime,
    endTime: Math.max(startTime + 0.25, words[words.length - 1]!.end),
    words,
    confidence: extra?.confidence,
    uncertain: extra?.uncertain,
  };
}

/**
 * Legacy acoustic splitter. New cues go through flatten + sentenceFromWords.
 */
export function splitSpokenWords(
  words: NonNullable<SttSegment["words"]>,
  extra?: Partial<SttSegment>,
): SttSegment[] {
  if (words.length === 0) return [];
  const gaps: number[] = [];
  for (let i = 1; i < words.length; i += 1) {
    const gap = words[i]!.start - words[i - 1]!.end;
    if (Number.isFinite(gap) && gap >= 0) gaps.push(gap);
  }
  const typicalGap = median(gaps) || 0.06;
  const pauseThreshold = Math.max(0.18, Math.min(HARD_PAUSE_SECONDS, typicalGap * 4));

  const groups: Array<NonNullable<SttSegment["words"]>> = [];
  let current: NonNullable<SttSegment["words"]> = [];
  for (const word of words) {
    if (current.length === 0) {
      current = [word];
      continue;
    }
    const prev = current[current.length - 1]!;
    const gap = word.start - prev.end;
    const text = current
      .map((item) => item.word)
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
    const nextToken = word.word.replace(/^[^a-zA-Z']+|[^a-zA-Z']+$/g, "");
    const finished = cueLooksFinished(text) && !cueEndsOpen(text);
    const punct = SENTENCE_END.test(prev.word.trim());
    const pause = gap > pauseThreshold;
    const duration = Math.max(0, word.start - current[0]!.start);
    const capitalClause =
      !cueEndsOpen(text) &&
      current.length >= 4 &&
      /^(I|We|You|They|He|She)$/.test(nextToken) &&
      /^[A-Z]/.test(word.word.trim());
    const tooLong = finished && (duration >= 5.2 || current.length >= 12);
    const hardCap = current.length >= 16 || duration >= 8;
    if (punct || pause || capitalClause || tooLong || hardCap) {
      groups.push(current);
      current = [word];
      continue;
    }
    current.push(word);
  }
  if (current.length > 0) groups.push(current);
  return groups
    .map((group) => cueFromWords(group, extra))
    .filter((row): row is SttSegment => Boolean(row));
}

function expectedSpeechSeconds(text: string): number {
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.min(16, Math.max(0.4, words / WORDS_PER_SECOND));
}

/**
 * Keep line order. A later cue with an earlier karaoke stamp must not cut the
 * previous line's end — that made cue 2/3 play the first sentence's audio.
 * Collapsed spans expand forward, not backward into the previous line.
 */
export function alignSttToSpeech(segments: SttSegment[]): SttSegment[] {
  const aligned: SttSegment[] = [];
  for (let i = 0; i < segments.length; i += 1) {
    const segment = segments[i]!;
    const text = segment.text.replace(/\s+/g, " ").trim();
    const words = text.split(/\s+/).filter(Boolean).length;
    const expected = expectedSpeechSeconds(text);
    const prev = aligned[aligned.length - 1];
    let start = Math.max(0, segment.startTime - START_LEAD_SECONDS);
    let end = Math.max(start + 0.25, segment.endTime);
    if (prev) {
      start = Math.max(start, prev.startTime + 0.08);
      if (start < prev.endTime) {
        const overlap = prev.endTime - start;
        if (overlap <= MAX_PREV_TRIM_SECONDS) {
          prev.endTime = Math.max(prev.startTime + 0.25, start);
        }
        if (start < prev.endTime) start = prev.endTime;
      }
    }
    end = Math.max(start + 0.3, end);
    if (words >= 3 && end - start < expected * 0.55) {
      const stretched = start + expected;
      const nextStart = segments[i + 1]?.startTime;
      // Stretching into the next stamp made cue 2 start mid-sentence on long videos.
      const cap =
        nextStart != null && nextStart > start + 0.3 ? nextStart : stretched;
      end = Math.min(stretched, cap);
    }
    aligned.push({
      ...segment,
      text,
      startTime: start,
      endTime: end,
    });
  }
  return aligned;
}

/** New words added by a growing / sliding karaoke caption. `null` = unrelated line. */
export function uniqueTextAdvance(previous: string, next: string): string | null {
  const prev = previous.replace(/\s+/g, " ").trim();
  const curr = next.replace(/\s+/g, " ").trim();
  if (!prev || !curr) return null;
  if (curr === prev) return "";
  if (curr.startsWith(prev)) return curr.slice(prev.length).trim();
  if (prev.startsWith(curr)) return "";
  const prevWords = prev.split(/\s+/).filter(Boolean);
  const nextWords = curr.split(/\s+/).filter(Boolean);
  const max = Math.min(prevWords.length, nextWords.length);
  for (let count = max; count >= 1; count -= 1) {
    const left = prevWords.slice(-count).map(normalizeWord).join(" ");
    const right = nextWords.slice(0, count).map(normalizeWord).join(" ");
    if (!left || left !== right) continue;
    if (count === 1) {
      const word = nextWords[0] ?? "";
      if (normalizeWord(word).length < 4) continue;
      if (
        /^(the|and|you|that|this|with|from|have|been|were|they|them|then|when|what)$/i.test(
          word,
        )
      ) {
        continue;
      }
    }
    return nextWords.slice(count).join(" ");
  }
  return null;
}

function collapseOverlappingCaptions(segments: SttSegment[]): SttSegment[] {
  const out: SttSegment[] = [];
  for (const segment of segments) {
    const text = segment.text.replace(/\s+/g, " ").trim();
    if (!text) continue;
    const prev = out[out.length - 1];
    if (!prev) {
      out.push({ ...segment, text });
      continue;
    }
    const advance = uniqueTextAdvance(prev.text, text);
    const overlap =
      Math.min(prev.endTime, segment.endTime) -
      Math.max(prev.startTime, segment.startTime);
    const near = overlap > 0.08 || segment.startTime - prev.endTime <= 0.55;
    const nextWords = (advance ?? "").split(/\s+/).filter(Boolean).length;
    const prevWords = prev.text.split(/\s+/).filter(Boolean).length;
    const span = Math.max(prev.endTime, segment.endTime) - prev.startTime;
    const nextWordCount = text.split(/\s+/).filter(Boolean).length;
    const advanceCount = advance ? advance.split(/\s+/).filter(Boolean).length : 0;
    const overlappedWords = Math.max(0, nextWordCount - advanceCount);
    const karaokeOverlap = overlap > 0.15 || overlappedWords >= 2;
    if (
      advance !== null &&
      near &&
      karaokeOverlap &&
      prevWords + nextWords <= 28 &&
      span <= 14
    ) {
      if (advance) {
        prev.text = `${prev.text} ${advance}`.replace(/\s+/g, " ").trim();
      }
      prev.endTime = Math.max(prev.endTime, segment.endTime);
      if (advance && segment.words && segment.words.length > 0) {
        const tail = new Set(advance.split(/\s+/).map(normalizeWord));
        prev.words = [
          ...(prev.words ?? []),
          ...segment.words.filter((word) => tail.has(normalizeWord(word.word))),
        ];
      }
      continue;
    }
    out.push({ ...segment, text });
  }
  return out;
}

/** Flatten STT chunks to a word list, then slice sentences by punctuation. */
export function regularizeSttSegments(segments: SttSegment[]): SttSegment[] {
  // Keep incoming order (YouTube event / Whisper line order). Sorting by the
  // often-wrong ASR clock is what reversed karaoke lyrics.
  const kept = segments.filter((segment) =>
    segment.text.replace(/\s+/g, " ").trim(),
  );

  const split = sentenceSegmentsFromStt(
    collapseOverlappingCaptions(kept),
  );

  return dropBoundaryEchoes(alignSttToSpeech(split))
    .filter((segment) => segment.endTime > segment.startTime + 0.08)
    .map((segment, index) => ({
      ...segment,
      id: `w-${index}-${Math.round(segment.startTime * 1000)}`,
    }));
}

function resampleMono(input: Float32Array, fromRate: number, toRate: number) {
  if (fromRate === toRate) return input;
  const ratio = fromRate / toRate;
  const length = Math.max(1, Math.floor(input.length / ratio));
  const out = new Float32Array(length);
  for (let i = 0; i < length; i += 1) {
    const src = i * ratio;
    const left = Math.floor(src);
    const right = Math.min(input.length - 1, left + 1);
    const mix = src - left;
    out[i] = input[left]! * (1 - mix) + input[right]! * mix;
  }
  return out;
}

export function audioBufferSliceToWav(
  buffer: AudioBuffer,
  startSeconds: number,
  endSeconds: number,
): Uint8Array {
  const sr = buffer.sampleRate;
  const from = Math.max(0, Math.floor(startSeconds * sr));
  const to = Math.min(buffer.length, Math.floor(endSeconds * sr));
  const count = Math.max(0, to - from);
  const mixed = new Float32Array(count);
  const channels = Math.max(1, buffer.numberOfChannels);
  for (let c = 0; c < channels; c += 1) {
    const data = buffer.getChannelData(c);
    for (let i = 0; i < count; i += 1) {
      mixed[i] = (mixed[i] ?? 0) + (data[from + i] ?? 0) / channels;
    }
  }
  const pcm = resampleMono(mixed, sr, WAV_RATE);
  const bytes = new ArrayBuffer(44 + pcm.length * 2);
  const view = new DataView(bytes);
  const writeString = (offset: number, value: string) => {
    for (let i = 0; i < value.length; i += 1) {
      view.setUint8(offset + i, value.charCodeAt(i));
    }
  };
  writeString(0, "RIFF");
  view.setUint32(4, 36 + pcm.length * 2, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, WAV_RATE, true);
  view.setUint32(28, WAV_RATE * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, "data");
  view.setUint32(40, pcm.length * 2, true);
  let offset = 44;
  for (let i = 0; i < pcm.length; i += 1) {
    const sample = Math.max(-1, Math.min(1, pcm[i] ?? 0));
    view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
    offset += 2;
  }
  return new Uint8Array(bytes);
}
