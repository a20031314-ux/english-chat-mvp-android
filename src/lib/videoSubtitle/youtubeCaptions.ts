import { BROWSER_UA, fetchWithTimeout } from "@/lib/videoSubtitle/http";
import { nativeGetText } from "@/lib/videoSubtitle/nativeHttp";
import { asNumber, asRecord, asString } from "@/lib/videoSubtitle/parseModelJson";
import {
  captionLanguageMatches,
  isManualCaptionTrack,
} from "@/lib/videoSubtitle/captionLanguages";
import { uniqueTextAdvance } from "@/lib/videoSubtitle/sttChunks";
import type { CaptionTrack, SttSegment, SttWord } from "@/lib/videoSubtitle/types";

export type CaptionFetchOptions = {
  /** Prefer / require tracks matching this UI/locale language. */
  preferredLocale?: string;
  /** Only accept manual (non-asr) tracks. */
  manualOnly?: boolean;
  /**
   * When preferredLocale is set and no track matches, return nothing
   * (do not fall back to other languages).
   */
  requireLanguageMatch?: boolean;
};

function trackClientScore(track: CaptionTrack): number {
  if (track.client === "android") return 40;
  if (track.client === "ios") return 20;
  // WEB timedtext URLs often return empty 200 without a PoToken.
  if (/[?&]exp=/i.test(track.baseUrl)) return -80;
  return 0;
}

function rankTracks(
  tracks: CaptionTrack[],
  options?: CaptionFetchOptions,
): CaptionTrack[] {
  const preferred = options?.preferredLocale;
  return [...tracks].sort((a, b) => {
    const score = (track: CaptionTrack) => {
      let value = trackClientScore(track);
      if (isManualCaptionTrack(track.kind)) value += 100;
      if (preferred && captionLanguageMatches(track.languageCode, preferred)) {
        value += 50;
      }
      return value;
    };
    return score(b) - score(a);
  });
}

function absoluteCaptionUrl(baseUrl: string): string {
  const raw = baseUrl.startsWith("//") ? `https:${baseUrl}` : baseUrl;
  return raw;
}

function withFmt(baseUrl: string, fmt: string): string {
  const url = new URL(absoluteCaptionUrl(baseUrl));
  url.searchParams.delete("fmt");
  url.searchParams.delete("html5");
  url.searchParams.set("fmt", fmt);
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
  const byKey = new Map<string, CaptionTrack>();
  for (const track of tracks) {
    const key = `${track.languageCode}:${track.kind ?? "manual"}`;
    const existing = byKey.get(key);
    if (!existing || trackClientScore(track) > trackClientScore(existing)) {
      byKey.set(key, track);
    }
  }
  return [...byKey.values()];
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

function wordsAcrossSpan(text: string, start: number, end: number): SttWord[] {
  const parts = text.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return [];
  const expected = Math.min(12, Math.max(0.4, parts.length / 3.2));
  const from = Math.max(0, start);
  let to = Math.max(from + 0.35, end);
  if (parts.length >= 3 && to - from < expected * 0.5) {
    to = from + expected;
  }
  const step = (to - from) / parts.length;
  return parts.map((word, index) => ({
    word,
    start: from + index * step,
    end: from + (index + 1) * step,
  }));
}

function wordsFromJson3(payload: unknown): SttWord[] {
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
  const url = withFmt(track.baseUrl, fmt);
  const headers = captionHeaders(videoId, cookie) as Record<string, string>;
  const native = await nativeGetText(url, headers, 15000);
  let status = 0;
  let body = "";
  if (native) {
    status = native.status;
    body = native.text;
  } else {
    const response = await fetchWithTimeout(url, {
      timeoutMs: 15000,
      headers,
    });
    status = response.status;
    if (response.ok) body = await response.text();
  }
  if (status < 200 || status >= 300) {
    console.error("[youtube-captions-http]", {
      lang: track.languageCode,
      kind: track.kind,
      client: track.client,
      fmt,
      status,
    });
    return [];
  }
  const segments = parseCaptionBody(body);
  if (segments.length === 0) {
    console.error("[youtube-captions-empty]", {
      lang: track.languageCode,
      kind: track.kind,
      client: track.client,
      fmt,
      bytes: body.length,
    });
  }
  return segments;
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

/** Public track list for a video (manual vs asr). */
export async function listYouTubeCaptionTracks(
  videoId: string,
  cookie?: string,
): Promise<CaptionTrack[]> {
  return timedTextTracks(videoId, cookie);
}

/** True when the video has at least one non-ASR (uploader/official) caption track. */
export async function hasOfficialYouTubeCaptions(
  videoId: string,
  cookie?: string,
): Promise<boolean> {
  const tracks = await listYouTubeCaptionTracks(videoId, cookie);
  return tracks.some((track) => isManualCaptionTrack(track.kind));
}

function filterTracks(
  tracks: CaptionTrack[],
  options?: CaptionFetchOptions,
): CaptionTrack[] {
  let pool = tracks;
  if (options?.manualOnly) {
    pool = pool.filter((track) => isManualCaptionTrack(track.kind));
  }
  if (options?.preferredLocale) {
    const locale = options.preferredLocale;
    const matched = pool.filter((track) =>
      captionLanguageMatches(track.languageCode, locale),
    );
    if (matched.length > 0) {
      pool = matched;
    } else if (
      options.manualOnly ||
      options.requireLanguageMatch
    ) {
      // Do not silently pick Arabic/etc. when the learner asked for Japanese.
      return [];
    }
  }
  return pool;
}

/**
 * Fetch caption segments. When `manualOnly` + `preferredLocale` are set,
 * only returns text if an official track in that language exists.
 */
export async function transcribeYouTubeCaptions(
  tracks: CaptionTrack[],
  videoId?: string,
  cookie?: string,
  options?: CaptionFetchOptions,
): Promise<SttSegment[]> {
  const hasAndroid = tracks.some((track) => track.client === "android");
  const extra =
    !hasAndroid && videoId ? await timedTextTracks(videoId, cookie) : [];
  const merged = mergeTracks([...tracks, ...extra]);
  const pool = rankTracks(filterTracks(merged, options), options);
  for (const track of pool.slice(0, 12)) {
    const segments = await segmentsFromTrack(track, videoId, cookie);
    if (segments.length > 0) return segments;
  }
  return [];
}
