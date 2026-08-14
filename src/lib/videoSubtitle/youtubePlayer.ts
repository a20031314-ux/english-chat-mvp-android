import { parseYouTubeVideoId } from "@/lib/videoLearning";
import { VideoPipelineError } from "@/lib/videoSubtitle/errors";
import {
  BROWSER_UA,
  fetchWithTimeout,
  YOUTUBE_ANDROID_UA,
  YOUTUBE_IOS_UA,
} from "@/lib/videoSubtitle/http";
import { asNumber, asRecord, asString } from "@/lib/videoSubtitle/parseModelJson";
import type { CaptionTrack, YouTubeSource } from "@/lib/videoSubtitle/types";

type PlayerClient = {
  userAgent: string;
  headers?: Record<string, string>;
  body: (videoId: string, visitorData?: string) => unknown;
};

/** Prefer Android — it still returns direct googlevideo URLs without n-sig. */
const CLIENTS: PlayerClient[] = [
  {
    userAgent: YOUTUBE_ANDROID_UA,
    headers: {
      "X-YouTube-Client-Name": "3",
      "X-YouTube-Client-Version": "20.10.38",
    },
    body: (videoId, visitorData) => ({
      context: {
        client: {
          clientName: "ANDROID",
          clientVersion: "20.10.38",
          androidSdkVersion: 34,
          hl: "en",
          gl: "US",
          ...(visitorData ? { visitorData } : {}),
        },
      },
      videoId,
      contentCheckOk: true,
      racyCheckOk: true,
    }),
  },
  {
    userAgent: YOUTUBE_IOS_UA,
    headers: {
      "X-YouTube-Client-Name": "5",
      "X-YouTube-Client-Version": "20.10.4",
    },
    body: (videoId, visitorData) => ({
      context: {
        client: {
          clientName: "IOS",
          clientVersion: "20.10.4",
          deviceMake: "Apple",
          deviceModel: "iPhone16,2",
          osName: "iOS",
          osVersion: "18.1.0",
          hl: "en",
          gl: "US",
          ...(visitorData ? { visitorData } : {}),
        },
      },
      videoId,
      contentCheckOk: true,
      racyCheckOk: true,
    }),
  },
  {
    userAgent: BROWSER_UA,
    headers: {
      "X-YouTube-Client-Name": "2",
      "X-YouTube-Client-Version": "2.20250313.01.00",
    },
    body: (videoId, visitorData) => ({
      context: {
        client: {
          clientName: "MWEB",
          clientVersion: "2.20250313.01.00",
          hl: "en",
          gl: "US",
          ...(visitorData ? { visitorData } : {}),
        },
      },
      videoId,
      contentCheckOk: true,
      racyCheckOk: true,
    }),
  },
  {
    userAgent: BROWSER_UA,
    headers: {
      "X-YouTube-Client-Name": "1",
      "X-YouTube-Client-Version": "2.20250313.01.00",
    },
    body: (videoId, visitorData) => ({
      context: {
        client: {
          clientName: "WEB",
          clientVersion: "2.20250313.01.00",
          hl: "en",
          gl: "US",
          ...(visitorData ? { visitorData } : {}),
        },
      },
      videoId,
      contentCheckOk: true,
      racyCheckOk: true,
    }),
  },
];

function extractJsonObject(source: string, needle: string): unknown | null {
  const index = source.indexOf(needle);
  if (index < 0) return null;
  const fromNeedle = source.slice(index);
  const eq = fromNeedle.indexOf("{");
  if (eq < 0) return null;
  const start = index + eq;
  let depth = 0;
  let inString = false;
  let escape = false;
  for (let i = start; i < source.length; i += 1) {
    const ch = source[i];
    if (inString) {
      if (escape) {
        escape = false;
      } else if (ch === "\\") {
        escape = true;
      } else if (ch === '"') {
        inString = false;
      }
      continue;
    }
    if (ch === '"') {
      inString = true;
      continue;
    }
    if (ch === "{") depth += 1;
    if (ch === "}") {
      depth -= 1;
      if (depth === 0) {
        try {
          return JSON.parse(source.slice(start, i + 1));
        } catch {
          return null;
        }
      }
    }
  }
  return null;
}

function extractJsonArray(source: string, fromIndex: number): unknown | null {
  const start = source.indexOf("[", fromIndex);
  if (start < 0) return null;
  let depth = 0;
  let inString = false;
  let escape = false;
  for (let i = start; i < source.length; i += 1) {
    const ch = source[i];
    if (inString) {
      if (escape) escape = false;
      else if (ch === "\\") escape = true;
      else if (ch === '"') inString = false;
      continue;
    }
    if (ch === '"') {
      inString = true;
      continue;
    }
    if (ch === "[") depth += 1;
    if (ch === "]") {
      depth -= 1;
      if (depth === 0) {
        try {
          return JSON.parse(source.slice(start, i + 1));
        } catch {
          return null;
        }
      }
    }
  }
  return null;
}

function cookiesFromResponse(response: Response): string {
  const header =
    typeof response.headers.getSetCookie === "function"
      ? response.headers.getSetCookie()
      : [];
  const parts = header
    .map((row) => row.split(";")[0]?.trim())
    .filter((row): row is string => Boolean(row));
  return parts.join("; ");
}

function captionTracksFromList(tracks: unknown): CaptionTrack[] {
  if (!Array.isArray(tracks)) return [];
  const out: CaptionTrack[] = [];
  for (const item of tracks) {
    const row = asRecord(item);
    if (!row) continue;
    const baseUrl = asString(row.baseUrl);
    const languageCode = asString(row.languageCode);
    if (!baseUrl || !languageCode) continue;
    if (/[?&]tlang=/i.test(baseUrl)) continue;
    const name = asRecord(row.name);
    out.push({
      languageCode,
      kind: asString(row.kind) ?? undefined,
      name: asString(name?.simpleText) ?? asString(row.name) ?? undefined,
      baseUrl,
    });
  }
  return out;
}

function captionTracksFromPlayer(player: Record<string, unknown> | null): CaptionTrack[] {
  if (!player) return [];
  const captions = asRecord(player.captions);
  const list = asRecord(captions?.playerCaptionsTracklistRenderer);
  return captionTracksFromList(list?.captionTracks);
}

function captionsFromHtml(html: string): CaptionTrack[] {
  const fromPlayer = captionTracksFromPlayer(
    asRecord(extractJsonObject(html, "ytInitialPlayerResponse")),
  );
  if (fromPlayer.length > 0) return fromPlayer;
  const marker = html.indexOf('"captionTracks"');
  if (marker < 0) return [];
  return captionTracksFromList(extractJsonArray(html, marker));
}

function formatUrl(row: Record<string, unknown>): string | undefined {
  const direct = asString(row.url);
  if (direct) return direct;
  const cipher = asString(row.signatureCipher) ?? asString(row.cipher);
  if (!cipher) return undefined;
  try {
    return new URLSearchParams(cipher).get("url") ?? undefined;
  } catch {
    return undefined;
  }
}

function audioFromPlayer(player: Record<string, unknown>): {
  url?: string;
  mimeType?: string;
} {
  const streaming = asRecord(player.streamingData);
  const formats = [
    ...(Array.isArray(streaming?.adaptiveFormats)
      ? streaming.adaptiveFormats
      : []),
    ...(Array.isArray(streaming?.formats) ? streaming.formats : []),
  ];
  const audio: { url: string; mimeType: string; bitrate: number; rank: number }[] =
    [];
  for (const item of formats) {
    const row = asRecord(item);
    if (!row) continue;
    const mimeType = asString(row.mimeType) ?? "";
    const url = formatUrl(row);
    if (!url || !mimeType) continue;
    const lower = mimeType.toLowerCase();
    const audioOnly = lower.startsWith("audio/");
    const muxed = lower.startsWith("video/mp4") || lower.startsWith("video/3gpp");
    if (!audioOnly && !muxed) continue;
    if (!asString(row.url) && (asString(row.signatureCipher) || asString(row.cipher))) {
      continue;
    }
    audio.push({
      url,
      mimeType,
      bitrate: asNumber(row.bitrate) ?? asNumber(row.averageBitrate) ?? 0,
      rank: audioOnly
        ? lower.includes("mp4") || lower.includes("mp4a")
          ? 0
          : 1
        : 2,
    });
  }
  audio.sort((a, b) => a.rank - b.rank || a.bitrate - b.bitrate);
  const pick = audio[0];
  return pick ? { url: pick.url, mimeType: pick.mimeType } : {};
}

function videoFromPlayer(player: Record<string, unknown>): {
  url?: string;
  mimeType?: string;
} {
  const streaming = asRecord(player.streamingData);
  const formats = [
    ...(Array.isArray(streaming?.adaptiveFormats)
      ? streaming.adaptiveFormats
      : []),
    ...(Array.isArray(streaming?.formats) ? streaming.formats : []),
  ];
  const video: {
    url: string;
    mimeType: string;
    height: number;
    rank: number;
  }[] = [];
  for (const item of formats) {
    const row = asRecord(item);
    if (!row) continue;
    const mimeType = asString(row.mimeType) ?? "";
    const url = formatUrl(row);
    if (!url || !mimeType) continue;
    if (!asString(row.url) && (asString(row.signatureCipher) || asString(row.cipher))) {
      continue;
    }
    const lower = mimeType.toLowerCase();
    // Prefer progressive muxed mp4 for ffmpeg seeking; else lowest video-only mp4.
    const muxed = lower.startsWith("video/mp4") && !lower.includes("av01");
    const videoOnly = lower.includes("video/mp4") || lower.includes("video/webm");
    if (!muxed && !videoOnly) continue;
    if (lower.startsWith("audio/")) continue;
    video.push({
      url,
      mimeType,
      height: asNumber(row.height) ?? 720,
      rank: muxed && lower.includes("mp4") ? 0 : 1,
    });
  }
  video.sort((a, b) => a.rank - b.rank || a.height - b.height);
  const pick = video[0];
  return pick ? { url: pick.url, mimeType: pick.mimeType } : {};
}

function durationFromPlayer(player: Record<string, unknown>): number {
  const details = asRecord(player.videoDetails);
  const raw =
    asString(details?.lengthSeconds) ??
    (asNumber(details?.lengthSeconds) != null
      ? String(details?.lengthSeconds)
      : null);
  const seconds = raw ? Number(raw) : NaN;
  return Number.isFinite(seconds) && seconds > 0 ? seconds : 0;
}

function titleFromPlayer(player: Record<string, unknown>): string | undefined {
  const details = asRecord(player.videoDetails);
  return asString(details?.title) ?? undefined;
}

function playable(player: Record<string, unknown> | null): boolean {
  if (!player) return false;
  const status = asRecord(player.playabilityStatus);
  const value = asString(status?.status);
  return !value || value === "OK";
}

async function fetchInnertubePlayer(
  videoId: string,
  client: PlayerClient,
  visitorData?: string,
  cookie?: string,
): Promise<{ player: Record<string, unknown> | null; userAgent: string }> {
  try {
    const response = await fetchWithTimeout(
      "https://www.youtube.com/youtubei/v1/player?prettyPrint=false",
      {
        method: "POST",
        timeoutMs: 15000,
        headers: {
          "Content-Type": "application/json",
          "User-Agent": client.userAgent,
          ...(cookie ? { Cookie: cookie } : {}),
          ...client.headers,
        },
        body: JSON.stringify(client.body(videoId, visitorData)),
      },
    );
    if (!response.ok) return { player: null, userAgent: client.userAgent };
    return {
      player: asRecord(await response.json()),
      userAgent: client.userAgent,
    };
  } catch {
    return { player: null, userAgent: client.userAgent };
  }
}

async function fetchWatchPage(videoId: string): Promise<{
  player: Record<string, unknown> | null;
  htmlTracks: CaptionTrack[];
  cookie: string;
  visitorData?: string;
}> {
  const seed =
    "CONSENT=YES+; SOCS=CAISNQgDEitib3FfaWRlbnRpdHlmcm9udGVuZHVpc2VydmVyXzIwMjQwMzE3LjA3X3AxGgJlbiACGgYIgNnOsAY";
  try {
    const response = await fetchWithTimeout(
      `https://www.youtube.com/watch?v=${videoId}&hl=en&bpctr=9999999999&has_verified=1`,
      {
        timeoutMs: 15000,
        headers: {
          "User-Agent": BROWSER_UA,
          "Accept-Language": "en-US,en;q=0.9",
          Cookie: seed,
        },
      },
    );
    if (!response.ok) {
      return { player: null, htmlTracks: [], cookie: seed };
    }
    const html = await response.text();
    const fromResponse = cookiesFromResponse(response);
    const cookie = fromResponse ? `${seed}; ${fromResponse}` : seed;
    const visitorData = html.match(/"VISITOR_DATA":"([^"]+)"/)?.[1];
    const player = asRecord(extractJsonObject(html, "ytInitialPlayerResponse"));
    return {
      player,
      htmlTracks: captionsFromHtml(html),
      cookie,
      visitorData,
    };
  } catch {
    return { player: null, htmlTracks: [], cookie: seed };
  }
}

function mergePlayers(
  videoId: string,
  players: Array<{
    player: Record<string, unknown> | null;
    userAgent?: string;
    extraTracks?: CaptionTrack[];
  }>,
  cookie?: string,
): YouTubeSource {
  let title: string | undefined;
  let durationSeconds = 0;
  let audioStreamUrl: string | undefined;
  let audioMimeType: string | undefined;
  let videoStreamUrl: string | undefined;
  let mediaUserAgent: string | undefined;
  const captionTracks: CaptionTrack[] = [];
  const seenCaptions = new Set<string>();

  const pushTrack = (track: CaptionTrack) => {
    if (seenCaptions.has(track.baseUrl)) return;
    seenCaptions.add(track.baseUrl);
    captionTracks.push(track);
  };

  // Prefer clients that expose direct stream URLs (Android/iOS) over WEB HTML,
  // which often returns format stubs without url/cipher.
  const ordered = [...players].sort((a, b) => {
    const score = (entry: (typeof players)[number]) => {
      if (!entry.player || !playable(entry.player)) return -1;
      const audio = audioFromPlayer(entry.player);
      return audio.url ? 1 : 0;
    };
    return score(b) - score(a);
  });

  for (const entry of ordered) {
    const player = entry.player;
    if (player) {
      title = title ?? titleFromPlayer(player);
      durationSeconds = durationSeconds || durationFromPlayer(player);
      if (!audioStreamUrl && playable(player)) {
        const audio = audioFromPlayer(player);
        if (audio.url) {
          audioStreamUrl = audio.url;
          audioMimeType = audio.mimeType;
          mediaUserAgent = entry.userAgent;
        }
      }
      if (!videoStreamUrl && playable(player)) {
        const video = videoFromPlayer(player);
        if (video.url) {
          videoStreamUrl = video.url;
          mediaUserAgent = mediaUserAgent ?? entry.userAgent;
        }
      }
      for (const track of captionTracksFromPlayer(player)) pushTrack(track);
    }
    for (const track of entry.extraTracks ?? []) pushTrack(track);
  }

  console.error("[youtube-source]", {
    videoId,
    hasAudio: Boolean(audioStreamUrl),
    hasVideo: Boolean(videoStreamUrl),
    captionTracks: captionTracks.length,
    durationSeconds,
    title,
  });

  return {
    videoId,
    title,
    durationSeconds,
    audioStreamUrl,
    audioMimeType,
    videoStreamUrl,
    ...(mediaUserAgent ? { mediaUserAgent } : {}),
    ...(cookie ? { cookie } : {}),
    captionTracks,
  };
}

export async function resolveYouTubeSource(videoUrl: string): Promise<YouTubeSource> {
  const videoId = parseYouTubeVideoId(videoUrl);
  if (!videoId) {
    throw new VideoPipelineError("INVALID_URL");
  }
  const watch = await fetchWatchPage(videoId);
  const innertube = await Promise.all(
    CLIENTS.map((client) =>
      fetchInnertubePlayer(videoId, client, watch.visitorData, watch.cookie),
    ),
  );
  return mergePlayers(
    videoId,
    [
      { player: watch.player, userAgent: BROWSER_UA, extraTracks: watch.htmlTracks },
      ...innertube,
    ],
    watch.cookie,
  );
}
