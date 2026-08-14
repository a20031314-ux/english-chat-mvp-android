import { BROWSER_UA, fetchWithTimeout } from "@/lib/videoSubtitle/http";
import { asNumber, asRecord, asString } from "@/lib/videoSubtitle/parseModelJson";
import type { CaptionTrack, SttSegment, SttWord } from "@/lib/videoSubtitle/types";

function rankTracks(tracks: CaptionTrack[]): CaptionTrack[] {
  return [...tracks].sort((a, b) => {
    const asr = (track: CaptionTrack) => (track.kind === "asr" ? 1 : 0);
    return asr(a) - asr(b);
  });
}

function absoluteCaptionUrl(baseUrl: string): string {
  const raw = baseUrl.startsWith("//") ? `https:${baseUrl}` : baseUrl;
  return raw;
}

function withFmt(baseUrl: string, fmt: string): string {
  const url = new URL(absoluteCaptionUrl(baseUrl));
  url.searchParams.set("fmt", fmt);
  url.searchParams.set("html5", "1");
  return url.toString();
}

function xmlAttr(source: string, name: string): string | undefined {
  const match = source.match(new RegExp(`${name}="([^"]*)"`, "i"));
  return match?.[1];
}

function captionHeaders(videoId?: string, cookie?: string): HeadersInit {
  return {
    "User-Agent": BROWSER_UA,
    "Accept-Language": "en-US,en;q=0.9",
    Referer: videoId
      ? `https://www.youtube.com/watch?v=${videoId}`
      : "https://www.youtube.com/",
    Origin: "https://www.youtube.com",
    ...(cookie ? { Cookie: cookie } : {}),
  };
}

function timedTextUrl(videoId: string, lang: string, kind?: string): string {
  const params = new URLSearchParams({
    v: videoId,
    lang,
    fmt: "json3",
  });
  if (kind) params.set("kind", kind);
  return `https://www.youtube.com/api/timedtext?${params.toString()}`;
}

function tracksFromTimedTextList(xml: string, videoId: string): CaptionTrack[] {
  const out: CaptionTrack[] = [];
  const regex = /<track\b([^>]*)\/?>/gi;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(xml))) {
    const attrs = match[1] ?? "";
    const languageCode = xmlAttr(attrs, "lang_code");
    if (!languageCode) continue;
    const kind = xmlAttr(attrs, "kind");
    const name =
      xmlAttr(attrs, "lang_translated") ?? xmlAttr(attrs, "lang_original");
    out.push({
      languageCode,
      ...(kind ? { kind } : {}),
      ...(name ? { name } : {}),
      baseUrl: timedTextUrl(videoId, languageCode, kind),
    });
  }
  return out;
}

function mergeTracks(tracks: CaptionTrack[]): CaptionTrack[] {
  const out: CaptionTrack[] = [];
  const seen = new Set<string>();
  for (const track of tracks) {
    const key = `${track.languageCode}:${track.kind ?? "manual"}:${track.baseUrl}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(track);
  }
  return out;
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
      (gap > 0.32 || duration > 3.2 || cue.length >= 10 || punct);
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

function parseSrv3(xml: string): SttSegment[] {
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

function parseCaptionBody(body: string): SttSegment[] {
  const trimmed = body.replace(/^\uFEFF/, "").trim();
  if (!trimmed || trimmed === "{}") return [];
  if (trimmed.includes("WEBVTT")) return parseVtt(trimmed);
  if (trimmed.includes("<transcript") || trimmed.includes("<text ")) {
    return parseTimedTextXml(trimmed);
  }
  if (trimmed.includes("<p ") || trimmed.includes("<p>")) {
    return parseSrv3(trimmed);
  }
  try {
    return groupWords(wordsFromJson3(JSON.parse(trimmed)));
  } catch {
    return [];
  }
}

async function fetchCaptionFmt(
  track: CaptionTrack,
  fmt: string,
  videoId?: string,
  cookie?: string,
): Promise<SttSegment[]> {
  const response = await fetchWithTimeout(withFmt(track.baseUrl, fmt), {
    timeoutMs: 15000,
    headers: captionHeaders(videoId, cookie),
  });
  if (!response.ok) return [];
  return parseCaptionBody(await response.text());
}

async function segmentsFromTrack(
  track: CaptionTrack,
  videoId?: string,
  cookie?: string,
): Promise<SttSegment[]> {
  for (const fmt of ["json3", "srv3", "vtt", "srv1"]) {
    try {
      const segments = await fetchCaptionFmt(track, fmt, videoId, cookie);
      if (segments.length > 0) return segments;
    } catch {
      // next format
    }
  }
  return [];
}

async function timedTextTracks(
  videoId: string,
  cookie?: string,
): Promise<CaptionTrack[]> {
  try {
    const response = await fetchWithTimeout(
      `https://www.youtube.com/api/timedtext?type=list&v=${videoId}`,
      { timeoutMs: 12000, headers: captionHeaders(videoId, cookie) },
    );
    if (response.ok) {
      const listed = tracksFromTimedTextList(await response.text(), videoId);
      if (listed.length > 0) return listed;
    }
  } catch {
    // ignore
  }
  return [];
}

export async function transcribeYouTubeCaptions(
  tracks: CaptionTrack[],
  videoId?: string,
  cookie?: string,
): Promise<SttSegment[]> {
  const extra = videoId ? await timedTextTracks(videoId, cookie) : [];
  const pool = rankTracks(mergeTracks([...tracks, ...extra]));
  for (const track of pool.slice(0, 8)) {
    const segments = await segmentsFromTrack(track, videoId, cookie);
    if (segments.length > 0) return segments;
  }
  return [];
}
