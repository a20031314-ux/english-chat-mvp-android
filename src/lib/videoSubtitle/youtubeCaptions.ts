import { BROWSER_UA, fetchWithTimeout } from "@/lib/videoSubtitle/http";
import { nativeGetText } from "@/lib/videoSubtitle/nativeHttp";
import {
  parseCaptionBody,
  xmlAttr,
} from "@/lib/videoSubtitle/captionParse";
import {
  captionLanguageMatches,
  isManualCaptionTrack,
} from "@/lib/videoSubtitle/captionLanguages";
import type { CaptionTrack, SttSegment } from "@/lib/videoSubtitle/types";

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
