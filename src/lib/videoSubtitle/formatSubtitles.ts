import type { NormalizedSegment, SubtitleSegment } from "@/lib/videoSubtitle/types";

const MAX_CHARS = 42;

function charLen(text: string): number {
  return [...text].length;
}

function splitReadable(text: string): string[] {
  const trimmed = text.replace(/\s+/g, " ").trim();
  if (!trimmed) return [];
  if (charLen(trimmed) <= MAX_CHARS) return [trimmed];

  const sentences = trimmed
    .split(/(?<=(?:다|요|죠|까|네|습니다|해요|예요|이에요|네요)[.?!]?)(?:\s+|$)|(?<=[.?!])\s+/)
    .map((part) => part.trim())
    .filter(Boolean);

  const lines: string[] = [];
  for (const sentence of sentences.length ? sentences : [trimmed]) {
    if (charLen(sentence) <= MAX_CHARS) {
      lines.push(sentence);
      continue;
    }
    const chunks = sentence.split(/(?<=,|만|고|는데|지만)\s+/);
    let buf = "";
    for (const chunk of chunks) {
      const next = buf ? `${buf} ${chunk}` : chunk;
      if (charLen(next) <= MAX_CHARS) {
        buf = next;
      } else {
        if (buf) lines.push(buf);
        buf = chunk;
      }
    }
    if (buf) lines.push(buf);
  }
  return lines.length ? lines : [trimmed];
}

function splitTimes(
  start: number,
  end: number,
  parts: string[],
): Array<{ start: number; end: number }> {
  const total = Math.max(0.8, end - start);
  const weights = parts.map((part) => Math.max(1, charLen(part)));
  const sum = weights.reduce((a, b) => a + b, 0);
  const out: Array<{ start: number; end: number }> = [];
  let cursor = start;
  for (let i = 0; i < parts.length; i += 1) {
    const share = total * (weights[i]! / sum);
    const next = i === parts.length - 1 ? end : cursor + share;
    out.push({
      start: cursor,
      end: Math.max(cursor + 0.7, next),
    });
    cursor = next;
  }
  return out;
}

export function formatSubtitles(input: {
  segments: NormalizedSegment[];
  translations: Map<string, string>;
}): SubtitleSegment[] {
  const cues: SubtitleSegment[] = [];
  for (const segment of input.segments) {
    const translation = (input.translations.get(segment.id) || "").trim();
    const parts = splitReadable(translation);
    const lines = parts.length > 0 ? parts : [translation];
    const times = splitTimes(segment.startTime, segment.endTime, lines);
    const status: SubtitleSegment["translationStatus"] = translation
      ? "final"
      : "draft";
    lines.forEach((line, index) => {
      const time = times[index] ?? {
        start: segment.startTime,
        end: segment.endTime,
      };
      cues.push({
        id: lines.length === 1 ? segment.id : `${segment.id}-${index + 1}`,
        startTime: time.start,
        endTime: time.end,
        rawOriginal: segment.rawText,
        original: segment.normalizedText,
        translation: line,
        confidence: segment.confidence,
        translationStatus: status,
        analysis: segment.uncertain ? { flags: ["uncertain-stt"] } : undefined,
      });
    });
  }
  return cues;
}
