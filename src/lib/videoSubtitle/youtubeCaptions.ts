import { fetchWithTimeout } from "@/lib/videoSubtitle/http";
import { asNumber, asRecord, asString } from "@/lib/videoSubtitle/parseModelJson";
import type { CaptionTrack, SttSegment, SttWord } from "@/lib/videoSubtitle/types";

function json3Url(baseUrl: string): string {
  const url = new URL(baseUrl);
  url.searchParams.set("fmt", "json3");
  return url.toString();
}

function vttUrl(baseUrl: string): string {
  const url = new URL(baseUrl);
  url.searchParams.set("fmt", "vtt");
  return url.toString();
}

function pickCaptionTrack(tracks: CaptionTrack[]): CaptionTrack | null {
  if (tracks.length === 0) return null;
  const english = tracks.filter((track) =>
    track.languageCode.toLowerCase().startsWith("en"),
  );
  const pool = english.length > 0 ? english : tracks;
  return (
    pool.find((track) => track.kind !== "asr") ??
    pool.find((track) => track.kind === "asr") ??
    pool[0] ??
    null
  );
}

function wordsFromJson3(payload: unknown): SttWord[] {
  const root = asRecord(payload);
  const events = root?.events;
  if (!Array.isArray(events)) return [];
  const words: SttWord[] = [];
  for (const event of events) {
    const row = asRecord(event);
    if (!row) continue;
    const startMs = asNumber(row.tStartMs);
    if (startMs == null) continue;
    const segs = Array.isArray(row.segs) ? row.segs : [];
    if (segs.length === 0) continue;
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
  }
  for (let i = 0; i < words.length; i += 1) {
    const current = words[i]!;
    const next = words[i + 1];
    if (next) current.end = Math.max(current.start + 0.08, next.start);
  }
  return words;
}

function flushCue(words: SttWord[], startIndex: number): SttSegment | null {
  const slice = words.slice(startIndex);
  if (slice.length === 0) return null;
  const text = slice
    .map((word) => word.word)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
  if (!text) return null;
  const startTime = slice[0]!.start;
  const endTime = Math.max(startTime + 0.4, slice[slice.length - 1]!.end);
  return {
    id: `c-${Math.round(startTime * 1000)}`,
    text,
    startTime,
    endTime,
    words: slice,
  };
}

function groupWords(words: SttWord[]): SttSegment[] {
  if (words.length === 0) return [];
  const segments: SttSegment[] = [];
  let cueStart = 0;
  for (let i = 0; i < words.length; i += 1) {
    const word = words[i]!;
    const prev = i > cueStart ? words[i - 1] : null;
    const cue = words.slice(cueStart, i);
    const duration = cue.length > 0 ? word.end - words[cueStart]!.start : 0;
    const gap = prev ? word.start - prev.end : 0;
    const punct = /[.?!]$/.test(prev?.word ?? "");
    const shouldFlush =
      i > cueStart &&
      (gap > 0.45 || duration > 6.8 || cue.length >= 18 || punct);
    if (shouldFlush) {
      const segment = flushCue(words.slice(cueStart, i), 0);
      if (segment) segments.push(segment);
      cueStart = i;
    }
  }
  const last = flushCue(words.slice(cueStart), 0);
  if (last) segments.push(last);
  return segments.map((segment, index) => ({
    ...segment,
    id: `c-${index}-${Math.round(segment.startTime * 1000)}`,
  }));
}

function parseVtt(vtt: string): SttSegment[] {
  const blocks = vtt.replace(/\r/g, "").split(/\n\n+/);
  const segments: SttSegment[] = [];
  for (const block of blocks) {
    const lines = block.split("\n").filter(Boolean);
    const timeLine = lines.find((line) => line.includes("-->"));
    if (!timeLine) continue;
    const match = timeLine.match(
      /(\d{2}:)?(\d{2}):(\d{2})\.(\d{3})\s+-->\s+(\d{2}:)?(\d{2}):(\d{2})\.(\d{3})/,
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

async function fetchCaptionJson3(track: CaptionTrack): Promise<SttSegment[]> {
  const response = await fetchWithTimeout(json3Url(track.baseUrl), {
    timeoutMs: 15000,
    headers: { "Accept-Language": "en-US,en;q=0.9" },
  });
  if (!response.ok) return [];
  const payload = await response.json();
  return groupWords(wordsFromJson3(payload));
}

async function fetchCaptionVtt(track: CaptionTrack): Promise<SttSegment[]> {
  const response = await fetchWithTimeout(vttUrl(track.baseUrl), {
    timeoutMs: 15000,
    headers: { "Accept-Language": "en-US,en;q=0.9" },
  });
  if (!response.ok) return [];
  return parseVtt(await response.text());
}

export async function transcribeYouTubeCaptions(
  tracks: CaptionTrack[],
): Promise<SttSegment[]> {
  const track = pickCaptionTrack(tracks);
  if (!track) return [];
  try {
    const json3 = await fetchCaptionJson3(track);
    if (json3.length > 0) return json3;
  } catch {
    // try vtt
  }
  try {
    return await fetchCaptionVtt(track);
  } catch {
    return [];
  }
}
