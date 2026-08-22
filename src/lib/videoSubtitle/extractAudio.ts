import { execFile } from "node:child_process";
import { randomBytes } from "node:crypto";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import { downloadYouTubeAudioBytes } from "@/lib/videoSubtitle/downloadAudioBytes";
import type { ExtractedAudio } from "@/lib/videoSubtitle/types";

const execFileAsync = promisify(execFile);

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
  videoStreamUrl?: string;
  videoMimeType?: string;
  mediaUserAgent?: string;
  maxSeconds?: number;
}): Promise<ExtractedAudio | null> {
  const maxSeconds = input.maxSeconds ?? 600;
  const downloaded = await downloadYouTubeAudioBytes({
    audioStreamUrl: input.audioStreamUrl,
    audioMimeType: input.audioMimeType,
    videoStreamUrl: input.videoStreamUrl,
    videoMimeType: input.videoMimeType,
    mediaUserAgent: input.mediaUserAgent,
    maxSeconds,
  });
  if (!downloaded) return null;
  return optimizeAudioForStt(
    {
      bytes: Buffer.from(downloaded.bytes),
      filename: downloaded.filename,
      mimeType: downloaded.mimeType,
    },
    maxSeconds,
  );
}
