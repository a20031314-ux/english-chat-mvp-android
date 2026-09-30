import { asNumber, asRecord, asString } from "./parseModelJson.ts";
import { uniqueTextAdvance } from "./sttChunks.ts";
import type { SttSegment, SttWord } from "./types";

export function xmlAttr(source: string, name: string): string | undefined {
  const match = source.match(new RegExp(`${name}="([^"]*)"`, "i"));
  return match?.[1];
}

function segsToText(segs: unknown[]): string {
  return segs
    .map((seg) => {
      const part = asRecord(seg);
      return asString(part?.utf8)?.replace(/\n/g, " ") ?? "";
    })
    .join("")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Faster than anybody talks, which is how a lost timestamp is recognised.
 *
 * The same test lives in sttChunks.ts and was wrong in the same way here: a
 * caption line shorter than half of what 3.2 words a second would take was
 * called collapsed and stretched to that pace. That threshold is a rate of
 * 6.4, which an ordinary quick speaker reaches, so on a fast video an
 * accurately timed line was pushed past the speech and into the next pause.
 */
const IMPOSSIBLE_WORDS_PER_SECOND = 9;

export function wordsAcrossSpan(text: string, start: number, end: number): SttWord[] {
  const parts = text.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return [];
  const expected = Math.min(12, Math.max(0.4, parts.length / 3.2));
  const from = Math.max(0, start);
  let to = Math.max(from + 0.35, end);
  if (parts.length >= 3 && to - from < parts.length / IMPOSSIBLE_WORDS_PER_SECOND) {
    to = from + expected;
  }
  const step = (to - from) / parts.length;
  return parts.map((word, index) => ({
    word,
    start: from + index * step,
    end: from + (index + 1) * step,
  }));
}

export function wordsFromJson3(payload: unknown): SttWord[] {
  const root = asRecord(payload);
  const events = root?.events;
  if (!Array.isArray(events)) return [];
  const words: SttWord[] = [];
  let roll: { startMs: number; endMs: number; text: string } | null = null;

  const flushRoll = () => {
    if (!roll?.text) {
      roll = null;
      return;
    }
    words.push(
      ...wordsAcrossSpan(roll.text, roll.startMs / 1000, roll.endMs / 1000),
    );
    roll = null;
  };

  for (const event of events) {
    const row = asRecord(event);
    if (!row) continue;
    const startMs = asNumber(row.tStartMs);
    if (startMs == null) continue;
    const segs = Array.isArray(row.segs) ? row.segs : [];
    if (segs.length === 0) continue;
    const durationMs = asNumber(row.dDurationMs) ?? 0;
    const hasOffsets = segs.some((seg) => {
      const offset = asNumber(asRecord(seg)?.tOffsetMs) ?? 0;
      return offset > 0;
    });
    const text = segsToText(segs);
    if (!text) {
      flushRoll();
      continue;
    }

    if (hasOffsets) {
      flushRoll();
      for (const seg of segs) {
        const part = asRecord(seg);
        const utf8 = asString(part?.utf8)?.replace(/\n/g, " ");
        if (!utf8 || !utf8.trim() || utf8 === "\n") continue;
        const offset = asNumber(part?.tOffsetMs) ?? 0;
        const start = (startMs + offset) / 1000;
        const prev = words[words.length - 1];
        if (prev && start > prev.start) {
          prev.end = Math.max(prev.end, start);
        }
        words.push({
          word: utf8.trim(),
          start,
          end: start + 0.35,
        });
      }
      const last = words[words.length - 1];
      if (last && durationMs > 0) {
        last.end = Math.max(last.end, startMs / 1000 + durationMs / 1000);
      }
      continue;
    }

    const endMs = startMs + Math.max(durationMs, 400);
    if (roll) {
      const advance = uniqueTextAdvance(roll.text, text);
      if (
        advance !== null &&
        startMs >= roll.startMs &&
        startMs - roll.startMs < 8000
      ) {
        const nextText = advance
          ? `${roll.text} ${advance}`.replace(/\s+/g, " ").trim()
          : roll.text;
        const nextWords = nextText.split(/\s+/).filter(Boolean).length;
        const nextSpan = (Math.max(roll.endMs, endMs) - roll.startMs) / 1000;
        if (nextWords > 28 || nextSpan > 14) {
          flushRoll();
          roll = {
            startMs,
            endMs,
            text: advance || text,
          };
          continue;
        }
        roll.text = nextText;
        roll.endMs = Math.max(roll.endMs, endMs);
        continue;
      }
    }
    flushRoll();
    roll = { startMs, endMs, text };
  }
  flushRoll();
  for (let i = 0; i < words.length; i += 1) {
    const current = words[i]!;
    const next = words[i + 1];
    if (next && next.start > current.start) {
      current.end = Math.max(current.start + 0.08, next.start);
    }
  }
  return words;
}

function groupWords(words: SttWord[]): SttSegment[] {
  if (words.length === 0) return [];
  const text = words
    .map((word) => word.word)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
  if (!text) return [];
  const startTime = Math.max(0, words[0]!.start);
  return [
    {
      id: `c-0-${Math.round(startTime * 1000)}`,
      text,
      startTime,
      endTime: Math.max(startTime + 0.25, words[words.length - 1]!.end),
      words,
    },
  ];
}

export function parseVtt(vtt: string): SttSegment[] {
  const blocks = vtt.replace(/\r/g, "").split(/\n\n+/);
  const segments: SttSegment[] = [];
  for (const block of blocks) {
    const lines = block.split("\n").filter(Boolean);
    const timeLine = lines.find((line) => line.includes("-->"));
    if (!timeLine) continue;
    const match = timeLine.match(
      /(\d{2}:)?(\d{2}):(\d{2})[.,](\d{3})\s+-->\s+(\d{2}:)?(\d{2}):(\d{2})[.,](\d{3})/,
    );
    if (!match) continue;
    const toSeconds = (
      hours: string | undefined,
      minutes: string,
      seconds: string,
      ms: string,
    ) =>
      (hours ? Number(hours.slice(0, 2)) * 3600 : 0) +
      Number(minutes) * 60 +
      Number(seconds) +
      Number(ms) / 1000;
    const startTime = toSeconds(match[1], match[2]!, match[3]!, match[4]!);
    const endTime = toSeconds(match[5], match[6]!, match[7]!, match[8]!);
    const text = lines
      .filter((line) => line !== timeLine && !/^\d+$/.test(line) && line !== "WEBVTT")
      .join(" ")
      .replace(/<[^>]+>/g, "")
      .replace(/\s+/g, " ")
      .trim();
    if (!text) continue;
    segments.push({
      id: `c-${segments.length}-${Math.round(startTime * 1000)}`,
      text,
      startTime,
      endTime: Math.max(startTime + 0.4, endTime),
    });
  }
  return segments;
}

function decodeXml(value: string): string {
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function parseTimedTextXml(xml: string): SttSegment[] {
  const segments: SttSegment[] = [];
  const regex = /<text\b([^>]*)>([\s\S]*?)<\/text>/gi;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(xml))) {
    const start = Number(xmlAttr(match[1] ?? "", "start") ?? NaN);
    const dur = Number(xmlAttr(match[1] ?? "", "dur") ?? 0);
    const text = decodeXml(match[2] ?? "");
    if (!text || !Number.isFinite(start)) continue;
    segments.push({
      id: `c-${segments.length}-${Math.round(start * 1000)}`,
      text,
      startTime: start,
      endTime: Math.max(start + 0.4, start + (Number.isFinite(dur) ? dur : 0.4)),
    });
  }
  return segments;
}

export function parseSrv3(xml: string): SttSegment[] {
  const segments: SttSegment[] = [];
  const regex = /<p\b([^>]*)>([\s\S]*?)<\/p>/gi;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(xml))) {
    const t = Number(xmlAttr(match[1] ?? "", "t") ?? NaN);
    const d = Number(xmlAttr(match[1] ?? "", "d") ?? 0);
    const text = decodeXml(match[2] ?? "");
    if (!text || !Number.isFinite(t)) continue;
    const startTime = t / 1000;
    const endTime = Math.max(startTime + 0.4, startTime + d / 1000);
    segments.push({
      id: `c-${segments.length}-${Math.round(t)}`,
      text,
      startTime,
      endTime,
    });
  }
  return segments;
}

/** A line has to be on screen this long for the clamp to be worth making. */
const MIN_SPOKEN_SECONDS = 0.4;

/**
 * How long the line was spoken, not how long it was on screen.
 *
 * Automatic captions roll: line one appears, line two appears under it, and
 * line one only leaves when line three pushes it off. So its end stamp is two
 * lines away from where the speaker finished saying it, and these formats give
 * no per-word times to correct that \u2014 every word gets spread evenly across the
 * display span instead. Measured against the same videos read as json3, which
 * does carry real word stamps, that put the median word 0.88 seconds late,
 * two thirds of them more than half a second late, and the worst four seconds
 * out. Subtitles a second behind the voice is what it looks like.
 *
 * The next line starting is the honest end: the speaker had moved on to it.
 * Only the end moves, only when the next line starts before it, and never
 * closer than a breath to this line's own start. Formats that carry word
 * stamps never reach here.
 */
export function clampToSpokenSpans(segments: SttSegment[]): SttSegment[] {
  return segments.map((segment, index) => {
    const next = segments[index + 1];
    if (!next || segment.words?.length) return segment;
    if (next.startTime >= segment.endTime) return segment;
    const end = Math.max(segment.startTime + MIN_SPOKEN_SECONDS, next.startTime);
    return end < segment.endTime ? { ...segment, endTime: end } : segment;
  });
}

export function parseCaptionBody(body: string): SttSegment[] {
  const trimmed = body.replace(/^\uFEFF/, "").trim();
  if (!trimmed || trimmed === "{}") return [];
  if (trimmed.includes("WEBVTT")) return clampToSpokenSpans(parseVtt(trimmed));
  if (trimmed.includes("<transcript") || trimmed.includes("<text ")) {
    return clampToSpokenSpans(parseTimedTextXml(trimmed));
  }
  if (trimmed.includes("<p ") || trimmed.includes("<p>")) {
    return clampToSpokenSpans(parseSrv3(trimmed));
  }
  try {
    return groupWords(wordsFromJson3(JSON.parse(trimmed)));
  } catch {
    return [];
  }
}
