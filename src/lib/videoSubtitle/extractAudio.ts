import { execFile } from "node:child_process";
import { randomBytes } from "node:crypto";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import { fetchWithTimeout, YOUTUBE_ANDROID_UA } from "@/lib/videoSubtitle/http";
import type { ExtractedAudio } from "@/lib/videoSubtitle/types";

const execFileAsync = promisify(execFile);

const MAX_AUDIO_BYTES = 18 * 1024 * 1024;
const DOWNLOAD_TIMEOUT_MS = 25000;

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
  return "audio.webm";
}

async function downloadAudioUrl(
  url: string,
  mimeType: string,
): Promise<ExtractedAudio | null> {
  try {
    const response = await fetchWithTimeout(url, {
      timeoutMs: DOWNLOAD_TIMEOUT_MS,
      headers: {
        "User-Agent": YOUTUBE_ANDROID_UA,
        Range: `bytes=0-${MAX_AUDIO_BYTES}`,
      },
    });
    if (!response.ok && response.status !== 206) return null;
    const buffer = Buffer.from(await response.arrayBuffer());
    if (buffer.byteLength < 2000) return null;
    return {
      bytes: buffer.subarray(0, Math.min(buffer.byteLength, MAX_AUDIO_BYTES)),
      filename: filenameForMime(mimeType),
      mimeType,
    };
  } catch {
    return null;
  }
}

/**
 * Optional resample/mono/bitrate drop when FFmpeg is installed.
 * If FFmpeg is missing this is a passthrough — Whisper accepts webm/m4a/mp3.
 */
export async function optimizeAudioForStt(
  audio: ExtractedAudio,
): Promise<ExtractedAudio> {
  const ffmpeg = await resolveFfmpeg();
  if (!ffmpeg) return audio;

  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "ec-audio-"));
  const inputPath = path.join(dir, audio.filename);
  const outputPath = path.join(dir, `${randomBytes(4).toString("hex")}.mp3`);
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
        "900",
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
}): Promise<ExtractedAudio | null> {
  if (!input.audioStreamUrl) return null;
  const downloaded = await downloadAudioUrl(
    input.audioStreamUrl,
    input.audioMimeType || "audio/webm",
  );
  if (!downloaded) return null;
  return optimizeAudioForStt(downloaded);
}
