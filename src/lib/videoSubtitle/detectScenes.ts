import { execFile } from "node:child_process";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import {
  SCENE_DETECT_THRESHOLD,
  SCENE_FALLBACK_SECONDS,
} from "@/lib/videoSubtitle/sceneConfig";
import type { VisualSceneSpan } from "@/lib/videoSubtitle/sceneTypes";

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

function fallbackScenes(
  fromSeconds: number,
  toSeconds: number,
): VisualSceneSpan[] {
  const start = Math.max(0, fromSeconds);
  const end = Math.max(start + 0.5, toSeconds);
  const spans: VisualSceneSpan[] = [];
  let cursor = start;
  let index = 0;
  while (cursor < end - 0.05) {
    const next = Math.min(cursor + SCENE_FALLBACK_SECONDS, end);
    spans.push({
      id: `vs-${index}-${Math.round(cursor * 1000)}`,
      startTime: cursor,
      endTime: next,
    });
    cursor = next;
    index += 1;
  }
  return spans.length
    ? spans
    : [{ id: "vs-0", startTime: start, endTime: end }];
}

/**
 * Detect visual scene cuts in a local video file via ffmpeg scene filter.
 * Falls back to fixed time buckets when ffmpeg is missing or detection fails.
 */
export async function detectScenes(input: {
  videoPath?: string;
  fromSeconds: number;
  toSeconds: number;
  threshold?: number;
}): Promise<VisualSceneSpan[]> {
  const from = Math.max(0, input.fromSeconds);
  const to = Math.max(from + 0.5, input.toSeconds);
  const threshold = input.threshold ?? SCENE_DETECT_THRESHOLD;
  const ffmpeg = await resolveFfmpeg();

  if (!ffmpeg || !input.videoPath) {
    return fallbackScenes(from, to);
  }

  try {
    const { stderr } = await execFileAsync(
      ffmpeg,
      [
        "-hide_banner",
        "-ss",
        String(from),
        "-to",
        String(to),
        "-i",
        input.videoPath,
        "-filter:v",
        `select='gt(scene,${threshold})',showinfo`,
        "-f",
        "null",
        "-",
      ],
      { timeout: 60000, maxBuffer: 8 * 1024 * 1024 },
    );
    const cuts: number[] = [from];
    const regex = /pts_time:([0-9.]+)/g;
    let match: RegExpExecArray | null;
    const log = String(stderr ?? "");
    while ((match = regex.exec(log))) {
      const t = from + Number(match[1]);
      if (Number.isFinite(t) && t > cuts[cuts.length - 1]! + 0.4 && t < to) {
        cuts.push(t);
      }
    }
    cuts.push(to);
    const spans: VisualSceneSpan[] = [];
    for (let i = 0; i < cuts.length - 1; i += 1) {
      const a = cuts[i]!;
      const b = cuts[i + 1]!;
      if (b - a < 0.35) continue;
      spans.push({
        id: `vs-${i}-${Math.round(a * 1000)}`,
        startTime: a,
        endTime: b,
      });
    }
    return spans.length ? spans : fallbackScenes(from, to);
  } catch (error) {
    console.error("[scene-detect]", error);
    return fallbackScenes(from, to);
  }
}

export async function writeTempVideo(
  bytes: Buffer,
  ext = "mp4",
): Promise<string> {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "ec-scene-"));
  const filePath = path.join(dir, `clip.${ext}`);
  await fs.writeFile(filePath, bytes);
  return filePath;
}

export async function cleanupTempPath(filePath?: string): Promise<void> {
  if (!filePath) return;
  const dir = path.dirname(filePath);
  await fs.rm(dir, { recursive: true, force: true }).catch(() => undefined);
}
