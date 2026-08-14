import { parseYouTubeVideoId } from "@/lib/videoLearning";
import { VideoPipelineError } from "@/lib/videoSubtitle/errors";
import {
  BROWSER_UA,
  fetchWithTimeout,
  YOUTUBE_ANDROID_UA,
} from "@/lib/videoSubtitle/http";
import { asNumber, asRecord, asString } from "@/lib/videoSubtitle/parseModelJson";
import type { CaptionTrack, YouTubeSource } from "@/lib/videoSubtitle/types";

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

function captionTracksFromPlayer(player: Record<string, unknown>): CaptionTrack[] {
  const captions = asRecord(player.captions);
  const list = asRecord(captions?.playerCaptionsTracklistRenderer);
  const tracks = list?.captionTracks;
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
      name: asString(name?.simpleText) ?? undefined,
      baseUrl,
    });
  }
  return out;
}

function audioFromPlayer(player: Record<string, unknown>): {
  url?: string;
  mimeType?: string;
} {
  const streaming = asRecord(player.streamingData);
  const formats = [
    ...(Array.isArray(streaming?.adaptiveFormats) ? streaming.adaptiveFormats : []),
    ...(Array.isArray(streaming?.formats) ? streaming.formats : []),
  ];
  const audio: { url: string; mimeType: string; bitrate: number }[] = [];
  for (const item of formats) {
    const row = asRecord(item);
    if (!row) continue;
    const mimeType = asString(row.mimeType) ?? "";
    const url = asString(row.url);
    if (!url || !mimeType.toLowerCase().startsWith("audio/")) continue;
    audio.push({
      url,
      mimeType,
      bitrate: asNumber(row.bitrate) ?? asNumber(row.averageBitrate) ?? 0,
    });
  }
  audio.sort((a, b) => {
    const rank = (mime: string) =>
      mime.includes("mp4") || mime.includes("mp4a") ? 0 : 1;
    const byType = rank(a.mimeType) - rank(b.mimeType);
    if (byType !== 0) return byType;
    return a.bitrate - b.bitrate;
  });
  const pick = audio[0];
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

async function fetchAndroidPlayer(videoId: string): Promise<Record<string, unknown> | null> {
  try {
    const response = await fetchWithTimeout(
      "https://www.youtube.com/youtubei/v1/player?prettyPrint=false",
      {
        method: "POST",
        timeoutMs: 15000,
        headers: {
          "Content-Type": "application/json",
          "User-Agent": YOUTUBE_ANDROID_UA,
          "X-YouTube-Client-Name": "3",
          "X-YouTube-Client-Version": "19.47.33",
        },
        body: JSON.stringify({
          context: {
            client: {
              clientName: "ANDROID",
              clientVersion: "19.47.33",
              androidSdkVersion: 34,
              hl: "en",
              gl: "US",
            },
          },
          videoId,
          contentCheckOk: true,
          racyCheckOk: true,
        }),
      },
    );
    if (!response.ok) return null;
    return asRecord(await response.json());
  } catch {
    return null;
  }
}

async function fetchWatchPlayer(videoId: string): Promise<Record<string, unknown> | null> {
  try {
    const response = await fetchWithTimeout(
      `https://www.youtube.com/watch?v=${videoId}&hl=en&bpctr=9999999999&has_verified=1`,
      {
        timeoutMs: 15000,
        headers: {
          "User-Agent": BROWSER_UA,
          "Accept-Language": "en-US,en;q=0.9",
          Cookie: "CONSENT=YES+; SOCS=CAISNQgDEitib3FfaWRlbnRpdHlmcm9udGVuZHVpc2VydmVyXzIwMjQwMzE3LjA3X3AxGgJlbiACGgYIgNnOsAY",
        },
      },
    );
    if (!response.ok) return null;
    const html = await response.text();
    const parsed = extractJsonObject(html, "ytInitialPlayerResponse");
    return asRecord(parsed);
  } catch {
    return null;
  }
}

function mergePlayers(
  videoId: string,
  players: Array<Record<string, unknown> | null>,
): YouTubeSource {
  let title: string | undefined;
  let durationSeconds = 0;
  let audioStreamUrl: string | undefined;
  let audioMimeType: string | undefined;
  const captionTracks: CaptionTrack[] = [];
  const seenCaptions = new Set<string>();

  for (const player of players) {
    if (!player) continue;
    title = title ?? titleFromPlayer(player);
    durationSeconds = durationSeconds || durationFromPlayer(player);
    if (!audioStreamUrl) {
      const audio = audioFromPlayer(player);
      audioStreamUrl = audio.url;
      audioMimeType = audio.mimeType;
    }
    for (const track of captionTracksFromPlayer(player)) {
      if (seenCaptions.has(track.baseUrl)) continue;
      seenCaptions.add(track.baseUrl);
      captionTracks.push(track);
    }
  }

  return {
    videoId,
    title,
    durationSeconds,
    audioStreamUrl,
    audioMimeType,
    captionTracks,
  };
}

export async function resolveYouTubeSource(videoUrl: string): Promise<YouTubeSource> {
  const videoId = parseYouTubeVideoId(videoUrl);
  if (!videoId) {
    throw new VideoPipelineError("INVALID_URL");
  }
  const [android, watch] = await Promise.all([
    fetchAndroidPlayer(videoId),
    fetchWatchPlayer(videoId),
  ]);
  return mergePlayers(videoId, [android, watch]);
}
