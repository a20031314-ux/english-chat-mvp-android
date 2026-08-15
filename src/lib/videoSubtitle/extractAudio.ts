import { execFile } from "node:child_process";
import { randomBytes } from "node:crypto";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import {
  fetchWithTimeout,
  youtubeMediaHeaders,
  YOUTUBE_ANDROID_UA,
} from "@/lib/videoSubtitle/http";
import type { ExtractedAudio } from "@/lib/videoSubtitle/types";

const execFileAsync = promisify(execFile);

const MAX_AUDIO_BYTES = 24 * 1024 * 1024;
/** Larger chunks → fewer round-trips; tiny 64KB ranges often stall after ~300KB. */
const RANGE_CHUNK_BYTES = 1024 * 1024;
const DOWNLOAD_TIMEOUT_MS = 90000;
const MIN_AUDIO_BYTES = 2000;
/** Rough AAC/HE-AAC bytes/sec used to decide if download is truncated. */
const BYTES_PER_SECOND_HINT = 14_000;

async function resolveFfmpeg(): Promise<string | null> {
  const fromEnv = process.env.FFMPEG_PATH?.trim();
  if (fromEnv) return fromEnv;
  try {
    await execFileAsync(process.platform === "win32" ? "where" : "which", [
      "ffmpeg",
    ]);
    return "ffmpeg";
  } catch {
    return null;
  }
}

function filenameForMime(mimeType: string): string {
  const lower = mimeType.toLowerCase();
  if (lower.includes("mp4") || lower.includes("m4a")) return "audio.m4a";
  if (lower.includes("mpeg") || lower.includes("mp3")) return "audio.mp3";
  if (lower.includes("wav")) return "audio.wav";
  if (lower.includes("ogg")) return "audio.ogg";
  if (lower.startsWith("video/")) return "clip.mp4";
  return "audio.webm";
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function targetBytesForSeconds(maxSeconds: number): number {
  const seconds = Math.max(30, Math.min(900, Math.floor(maxSeconds)));
  return Math.min(
    MAX_AUDIO_BYTES,
    Math.max(MIN_AUDIO_BYTES, seconds * BYTES_PER_SECOND_HINT),
  );
}

async function readBodyCapped(
  response: Response,
  maxBytes: number,
): Promise<Buffer> {
  if (!response.body) {
    const buffer = Buffer.from(await response.arrayBuffer());
    return buffer.byteLength > maxBytes ? buffer.subarray(0, maxBytes) : buffer;
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
    }
  } finally {
    try {
      await reader.cancel();
    } catch {
      // ignore
    }
  }
  return Buffer.concat(parts.map((part) => Buffer.from(part)));
}

async function downloadRange(
  url: string,
  userAgent: string,
  start: number,
  end: number,
): Promise<{ status: number; buffer: Buffer; totalSize?: number } | null> {
  try {
    const response = await fetchWithTimeout(url, {
      timeoutMs: DOWNLOAD_TIMEOUT_MS,
      headers: {
        ...youtubeMediaHeaders(userAgent),
        Range: `bytes=${start}-${end}`,
      },
    });
    if (!response.ok && response.status !== 206) {
      return { status: response.status, buffer: Buffer.alloc(0) };
    }
    const contentRange = response.headers.get("content-range") || "";
    const totalMatch = /\/(\d+)\s*$/.exec(contentRange);
    const totalSize = totalMatch ? Number(totalMatch[1]) : undefined;
    const buffer = Buffer.from(await response.arrayBuffer());
    return {
      status: response.status,
      buffer,
      ...(Number.isFinite(totalSize) && totalSize! > 0 ? { totalSize } : {}),
    };
  } catch {
    return null;
  }
}

/** Prefer one continuous stream — googlevideo often stalls on many tiny ranges. */
async function downloadStreamCapped(
  url: string,
  userAgent: string,
  maxBytes: number,
): Promise<Buffer | null> {
  try {
    const response = await fetchWithTimeout(url, {
      timeoutMs: Math.max(DOWNLOAD_TIMEOUT_MS, 120000),
      headers: youtubeMediaHeaders(userAgent),
    });
    if (!response.ok) return null;
    const buffer = await readBodyCapped(response, maxBytes);
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
): Promise<Buffer | null> {
  const parts: Buffer[] = [];
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

    if (knownTotal != null && offset >= knownTotal) break;
    if (slice.buffer.byteLength < requested) break;
  }

  if (parts.length === 0) return null;
  return Buffer.concat(parts);
}

async function downloadAudioUrl(
  url: string,
  mimeType: string,
  userAgent: string,
  maxBytes: number,
): Promise<ExtractedAudio | null> {
  const streamed = await downloadStreamCapped(url, userAgent, maxBytes);
  let buffer = streamed;

  const enough =
    buffer != null && buffer.byteLength >= Math.min(maxBytes, Math.floor(maxBytes * 0.9));

  if (!enough) {
    // Resume from where the stream stopped when possible; else full ranged pull.
    const startAt = buffer?.byteLength ?? 0;
    if (startAt > 0 && startAt < maxBytes) {
      const rest = await downloadRangedFrom(url, userAgent, startAt, maxBytes);
      if (rest && rest.byteLength > 0) {
        buffer = Buffer.concat([buffer!, rest]);
      }
    } else {
      const ranged = await downloadRangedFrom(url, userAgent, 0, maxBytes);
      if (ranged && (!buffer || ranged.byteLength > buffer.byteLength)) {
        buffer = ranged;
      }
    }
  }

  if (!buffer || buffer.byteLength < MIN_AUDIO_BYTES) return null;

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

/**
 * Optional resample/mono/bitrate drop when FFmpeg is installed.
 * If FFmpeg is missing this is a passthrough — Whisper accepts webm/m4a/mp3/mp4.
 */
export async function optimizeAudioForStt(
  audio: ExtractedAudio,
  maxSeconds = 600,
): Promise<ExtractedAudio> {
  const ffmpeg = await resolveFfmpeg();
  if (!ffmpeg) return audio;

  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "ec-audio-"));
  const inputPath = path.join(dir, audio.filename);
  const outputPath = path.join(dir, `${randomBytes(4).toString("hex")}.mp3`);
  const trimSeconds = Math.max(30, Math.min(900, Math.floor(maxSeconds)));
  try {
    await fs.writeFile(inputPath, audio.bytes);
    await execFileAsync(
      ffmpeg,
      [
        "-y",
        "-i",
        inputPath,
        "-vn",
        "-ac",
        "1",
        "-ar",
        "16000",
        "-b:a",
        "48k",
        "-t",
        String(trimSeconds),
        outputPath,
      ],
      { timeout: 120000 },
    );
    const bytes = await fs.readFile(outputPath);
    if (bytes.byteLength < 1000) return audio;
    return {
      bytes,
      filename: "speech.mp3",
      mimeType: "audio/mpeg",
      durationHintSeconds: audio.durationHintSeconds,
    };
  } catch {
    return audio;
  } finally {
    await fs.rm(dir, { recursive: true, force: true }).catch(() => undefined);
  }
}

/**
 * Audio-only extract. Never sends video frames to the model.
 */
export async function extractAudio(input: {
  audioStreamUrl?: string;
  audioMimeType?: string;
  mediaUserAgent?: string;
  maxSeconds?: number;
}): Promise<ExtractedAudio | null> {
  if (!input.audioStreamUrl) return null;
  const maxSeconds = input.maxSeconds ?? 600;
  const maxBytes = targetBytesForSeconds(maxSeconds);
  const downloaded = await downloadAudioUrl(
    input.audioStreamUrl,
    input.audioMimeType || "audio/webm",
    input.mediaUserAgent || YOUTUBE_ANDROID_UA,
    maxBytes,
  );
  if (!downloaded) return null;
  return optimizeAudioForStt(downloaded, maxSeconds);
}
