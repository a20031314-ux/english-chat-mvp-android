import { Capacitor } from "@capacitor/core";
import {
  fetchWithTimeout,
  youtubeMediaHeaders,
  YOUTUBE_ANDROID_UA,
} from "@/lib/videoSubtitle/http";
import { nativeGetBytes } from "@/lib/videoSubtitle/nativeHttp";

export const MAX_AUDIO_BYTES = 24 * 1024 * 1024;
const RANGE_CHUNK_BYTES = 384 * 1024;
const DOWNLOAD_TIMEOUT_MS = 90000;
export const MIN_AUDIO_BYTES = 2000;
/** Rough AAC/HE-AAC bytes/sec used to decide if download is truncated. */
export const BYTES_PER_SECOND_HINT = 14_000;

export type DownloadedAudioBytes = {
  bytes: Uint8Array;
  filename: string;
  mimeType: string;
};

export type DownloadAudioProgress = {
  /** Called once when at least `prefixBytes` have arrived (copy of the prefix). */
  onPrefix?: (prefix: Uint8Array) => void;
  prefixBytes?: number;
};

export function filenameForMime(mimeType: string): string {
  const lower = mimeType.toLowerCase();
  if (lower.includes("mp4") || lower.includes("m4a")) return "audio.m4a";
  if (lower.includes("mpeg") || lower.includes("mp3")) return "audio.mp3";
  if (lower.includes("wav")) return "audio.wav";
  if (lower.includes("ogg")) return "audio.ogg";
  if (lower.startsWith("video/")) return "clip.mp4";
  return "audio.webm";
}

export function targetBytesForSeconds(maxSeconds: number): number {
  const seconds = Math.max(30, Math.min(900, Math.floor(maxSeconds)));
  return Math.min(
    MAX_AUDIO_BYTES,
    Math.max(MIN_AUDIO_BYTES, seconds * BYTES_PER_SECOND_HINT),
  );
}

function concatBytes(parts: Uint8Array[]): Uint8Array {
  const total = parts.reduce((sum, part) => sum + part.byteLength, 0);
  const out = new Uint8Array(total);
  let offset = 0;
  for (const part of parts) {
    out.set(part, offset);
    offset += part.byteLength;
  }
  return out;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function prefixNotifier(progress?: DownloadAudioProgress) {
  let sent = false;
  const need = progress?.prefixBytes ?? 0;
  const onPrefix = progress?.onPrefix;
  return {
    maybeSend(bytes: Uint8Array) {
      if (sent || !onPrefix || need <= 0 || bytes.byteLength < need) return;
      sent = true;
      onPrefix(bytes.slice(0, need));
    },
  };
}

async function readBodyCapped(
  response: Response,
  maxBytes: number,
  notify?: { maybeSend: (bytes: Uint8Array) => void },
): Promise<Uint8Array> {
  if (!response.body) {
    const buffer = new Uint8Array(await response.arrayBuffer());
    const sliced =
      buffer.byteLength > maxBytes ? buffer.subarray(0, maxBytes) : buffer;
    notify?.maybeSend(sliced);
    return sliced;
  }

  const reader = response.body.getReader();
  const parts: Uint8Array[] = [];
  let total = 0;
  try {
    while (total < maxBytes) {
      const { done, value } = await reader.read();
      if (done || !value?.byteLength) break;
      const remain = maxBytes - total;
      if (value.byteLength <= remain) {
        parts.push(value);
        total += value.byteLength;
      } else {
        parts.push(value.subarray(0, remain));
        total += remain;
        break;
      }
      notify?.maybeSend(concatBytes(parts));
    }
  } finally {
    try {
      await reader.cancel();
    } catch {
      // ignore
    }
  }
  const out = concatBytes(parts);
  notify?.maybeSend(out);
  return out;
}

async function downloadRange(
  url: string,
  userAgent: string,
  start: number,
  end: number,
): Promise<{ status: number; buffer: Uint8Array; totalSize?: number } | null> {
  const headers = {
    ...youtubeMediaHeaders(userAgent),
    Range: `bytes=${start}-${end}`,
    "Accept-Encoding": "identity",
  };
  try {
    const native = await nativeGetBytes(url, headers, DOWNLOAD_TIMEOUT_MS);
    if (native || (typeof window !== "undefined" && Capacitor.isNativePlatform())) {
      if (!native || (native.status !== 200 && native.status !== 206)) {
        return {
          status: native?.status ?? 0,
          buffer: new Uint8Array(0),
        };
      }
      const contentRange = native.header("content-range");
      const totalMatch = /\/(\d+)\s*$/.exec(contentRange);
      const totalSize = totalMatch ? Number(totalMatch[1]) : undefined;
      return {
        status: native.status,
        buffer: native.bytes,
        ...(Number.isFinite(totalSize) && totalSize! > 0 ? { totalSize } : {}),
      };
    }
    const response = await fetchWithTimeout(url, {
      timeoutMs: DOWNLOAD_TIMEOUT_MS,
      headers,
    });
    if (!response.ok && response.status !== 206) {
      return { status: response.status, buffer: new Uint8Array(0) };
    }
    const contentRange = response.headers.get("content-range") || "";
    const totalMatch = /\/(\d+)\s*$/.exec(contentRange);
    const totalSize = totalMatch ? Number(totalMatch[1]) : undefined;
    const buffer = new Uint8Array(await response.arrayBuffer());
    return {
      status: response.status,
      buffer,
      ...(Number.isFinite(totalSize) && totalSize! > 0 ? { totalSize } : {}),
    };
  } catch {
    return null;
  }
}

async function downloadStreamCapped(
  url: string,
  userAgent: string,
  maxBytes: number,
  notify?: { maybeSend: (bytes: Uint8Array) => void },
): Promise<Uint8Array | null> {
  // Native GET sends the whole body over the Capacitor bridge — too large for audio.
  if (typeof window !== "undefined" && Capacitor.isNativePlatform()) {
    return null;
  }
  try {
    const response = await fetchWithTimeout(url, {
      timeoutMs: Math.max(DOWNLOAD_TIMEOUT_MS, 120000),
      headers: {
        ...youtubeMediaHeaders(userAgent),
        "Accept-Encoding": "identity",
      },
    });
    if (!response.ok) return null;
    const buffer = await readBodyCapped(response, maxBytes, notify);
    return buffer.byteLength >= MIN_AUDIO_BYTES ? buffer : null;
  } catch {
    return null;
  }
}

async function downloadRangedFrom(
  url: string,
  userAgent: string,
  startOffset: number,
  maxBytes: number,
  notify?: { maybeSend: (bytes: Uint8Array) => void },
  already?: Uint8Array,
): Promise<Uint8Array | null> {
  const parts: Uint8Array[] = already?.byteLength ? [already] : [];
  let offset = Math.max(0, startOffset);

  let knownTotal: number | undefined;

  while (offset < maxBytes) {
    const end = Math.min(offset + RANGE_CHUNK_BYTES - 1, maxBytes - 1);
    const requested = end - offset + 1;
    let slice: Awaited<ReturnType<typeof downloadRange>> = null;

    for (let attempt = 0; attempt < 4; attempt += 1) {
      slice = await downloadRange(url, userAgent, offset, end);
      if (slice && slice.buffer.byteLength > 0) break;
      await sleep(250 * (attempt + 1));
    }

    if (!slice || slice.buffer.byteLength === 0) {
      if (parts.length === 0) return null;
      break;
    }

    if (slice.totalSize && slice.totalSize > 0) {
      knownTotal = slice.totalSize;
    }

    parts.push(slice.buffer);
    offset += slice.buffer.byteLength;
    notify?.maybeSend(concatBytes(parts));

    if (knownTotal != null && offset >= knownTotal) break;
    if (slice.buffer.byteLength < requested) break;
  }

  if (parts.length === 0) return null;
  return concatBytes(parts);
}

export async function downloadAudioUrlBytes(
  url: string,
  mimeType: string,
  userAgent: string,
  maxBytes: number,
  progress?: DownloadAudioProgress,
): Promise<DownloadedAudioBytes | null> {
  const notify = prefixNotifier(progress);
  const streamed = await downloadStreamCapped(url, userAgent, maxBytes, notify);
  let buffer = streamed;

  const enough =
    buffer != null &&
    buffer.byteLength >= Math.min(maxBytes, Math.floor(maxBytes * 0.9));

  if (!enough) {
    const startAt = buffer?.byteLength ?? 0;
    if (startAt > 0 && startAt < maxBytes) {
      const rest = await downloadRangedFrom(
        url,
        userAgent,
        startAt,
        maxBytes,
        notify,
        buffer ?? undefined,
      );
      if (rest && rest.byteLength > 0) buffer = rest;
    } else {
      const ranged = await downloadRangedFrom(
        url,
        userAgent,
        0,
        maxBytes,
        notify,
      );
      if (ranged && (!buffer || ranged.byteLength > buffer.byteLength)) {
        buffer = ranged;
      }
    }
  }

  if (!buffer || buffer.byteLength < MIN_AUDIO_BYTES) return null;
  notify.maybeSend(buffer);

  console.error("[video-audio-download]", {
    bytes: buffer.byteLength,
    targetBytes: maxBytes,
    mimeType,
  });

  return {
    bytes: buffer,
    filename: filenameForMime(mimeType),
    mimeType,
  };
}

export async function downloadYouTubeAudioBytes(input: {
  audioStreamUrl?: string;
  audioMimeType?: string;
  videoStreamUrl?: string;
  videoMimeType?: string;
  mediaUserAgent?: string;
  maxSeconds?: number;
  progress?: DownloadAudioProgress;
}): Promise<DownloadedAudioBytes | null> {
  const maxSeconds = input.maxSeconds ?? 600;
  const maxBytes = targetBytesForSeconds(maxSeconds);
  const userAgent = input.mediaUserAgent || YOUTUBE_ANDROID_UA;

  if (input.audioStreamUrl) {
    const downloaded = await downloadAudioUrlBytes(
      input.audioStreamUrl,
      input.audioMimeType || "audio/webm",
      userAgent,
      maxBytes,
      input.progress,
    );
    if (downloaded) return downloaded;
  }

  if (input.videoStreamUrl) {
    const downloaded = await downloadAudioUrlBytes(
      input.videoStreamUrl,
      input.videoMimeType || "video/mp4",
      userAgent,
      maxBytes,
      input.progress,
    );
    if (downloaded) return downloaded;
  }

  return null;
}
