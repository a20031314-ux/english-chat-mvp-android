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
/** googlevideo often rejects large single Range requests; pull small slices. */
const RANGE_CHUNK_BYTES = 64 * 1024;
const DOWNLOAD_TIMEOUT_MS = 40000;
const MIN_AUDIO_BYTES = 2000;

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

async function downloadRange(
  url: string,
  userAgent: string,
  start: number,
  end: number,
): Promise<{ status: number; buffer: Buffer } | null> {
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
    const buffer = Buffer.from(await response.arrayBuffer());
    return { status: response.status, buffer };
  } catch {
    return null;
  }
}

async function downloadAudioUrl(
  url: string,
  mimeType: string,
  userAgent: string,
): Promise<ExtractedAudio | null> {
  const parts: Buffer[] = [];
  let offset = 0;

  while (offset < MAX_AUDIO_BYTES) {
    const end = Math.min(offset + RANGE_CHUNK_BYTES - 1, MAX_AUDIO_BYTES - 1);
    const slice = await downloadRange(url, userAgent, offset, end);
    if (!slice) {
      if (parts.length === 0) return null;
      break;
    }
    if (slice.buffer.byteLength === 0) {
      if (parts.length === 0) return null;
      break;
    }
    parts.push(slice.buffer);
    offset += slice.buffer.byteLength;
    // Short read ⇒ end of file.
    if (slice.buffer.byteLength < RANGE_CHUNK_BYTES) break;
  }

  const buffer = Buffer.concat(parts);
  if (buffer.byteLength < MIN_AUDIO_BYTES) return null;
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
      { timeout: 40000 },
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
  const downloaded = await downloadAudioUrl(
    input.audioStreamUrl,
    input.audioMimeType || "audio/webm",
    input.mediaUserAgent || YOUTUBE_ANDROID_UA,
  );
  if (!downloaded) return null;
  return optimizeAudioForStt(downloaded, input.maxSeconds ?? 600);
}
