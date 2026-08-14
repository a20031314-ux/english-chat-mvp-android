import {
  fetchWithTimeout,
  youtubeMediaHeaders,
  YOUTUBE_ANDROID_UA,
} from "@/lib/videoSubtitle/http";

const MAX_VIDEO_BYTES = 12 * 1024 * 1024;
const RANGE_CHUNK_BYTES = 256 * 1024;
const DOWNLOAD_TIMEOUT_MS = 45000;

async function downloadRange(
  url: string,
  userAgent: string,
  start: number,
  end: number,
): Promise<Buffer | null> {
  try {
    const response = await fetchWithTimeout(url, {
      timeoutMs: DOWNLOAD_TIMEOUT_MS,
      headers: {
        ...youtubeMediaHeaders(userAgent),
        Range: `bytes=${start}-${end}`,
      },
    });
    if (!response.ok && response.status !== 206) return null;
    const buffer = Buffer.from(await response.arrayBuffer());
    return buffer.byteLength > 0 ? buffer : null;
  } catch {
    return null;
  }
}

/**
 * Download a short progressive video prefix for scene/frame extraction.
 * Soft-fails (null) when the stream is unavailable.
 */
export async function downloadVideoPrefix(input: {
  videoStreamUrl?: string;
  mediaUserAgent?: string;
  maxBytes?: number;
}): Promise<Buffer | null> {
  if (!input.videoStreamUrl) return null;
  const maxBytes = input.maxBytes ?? MAX_VIDEO_BYTES;
  const userAgent = input.mediaUserAgent || YOUTUBE_ANDROID_UA;
  const parts: Buffer[] = [];
  let offset = 0;

  while (offset < maxBytes) {
    const end = Math.min(offset + RANGE_CHUNK_BYTES - 1, maxBytes - 1);
    const slice = await downloadRange(
      input.videoStreamUrl,
      userAgent,
      offset,
      end,
    );
    if (!slice || slice.byteLength === 0) {
      if (parts.length === 0) return null;
      break;
    }
    parts.push(slice);
    offset += slice.byteLength;
    if (slice.byteLength < RANGE_CHUNK_BYTES) break;
  }

  const buffer = Buffer.concat(parts);
  return buffer.byteLength >= 8000 ? buffer : null;
}
