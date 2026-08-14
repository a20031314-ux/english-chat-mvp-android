import { execFile } from "node:child_process";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import { SCENE_FRAMES_PER_SCENE } from "@/lib/videoSubtitle/sceneConfig";
import type {
  RepresentativeFrame,
  VisualSceneSpan,
} from "@/lib/videoSubtitle/sceneTypes";

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

function sampleTimes(scene: VisualSceneSpan, count: number): number[] {
  const duration = Math.max(0.2, scene.endTime - scene.startTime);
  if (count <= 1) {
    return [scene.startTime + duration * 0.4];
  }
  const times: number[] = [];
  for (let i = 0; i < count; i += 1) {
    const ratio = (i + 1) / (count + 1);
    times.push(scene.startTime + duration * ratio);
  }
  return times;
}

async function grabFrame(
  ffmpeg: string,
  videoPath: string,
  timeSeconds: number,
): Promise<Buffer | null> {
  const outDir = await fs.mkdtemp(path.join(os.tmpdir(), "ec-frame-"));
  const outPath = path.join(outDir, "frame.jpg");
  try {
    await execFileAsync(
      ffmpeg,
      [
        "-y",
        "-ss",
        String(Math.max(0, timeSeconds)),
        "-i",
        videoPath,
        "-frames:v",
        "1",
        "-q:v",
        "5",
        outPath,
      ],
      { timeout: 20000 },
    );
    const bytes = await fs.readFile(outPath);
    return bytes.byteLength > 500 ? bytes : null;
  } catch {
    return null;
  } finally {
    await fs.rm(outDir, { recursive: true, force: true }).catch(() => undefined);
  }
}

/**
 * Extract 1–3 representative JPEG frames per visual scene.
 * Returns frames without jpeg when ffmpeg is unavailable.
 */
export async function extractRepresentativeFrames(input: {
  videoPath?: string;
  scenes: VisualSceneSpan[];
  framesPerScene?: number;
}): Promise<RepresentativeFrame[]> {
  const perScene = input.framesPerScene ?? SCENE_FRAMES_PER_SCENE;
  const ffmpeg = await resolveFfmpeg();
  const out: RepresentativeFrame[] = [];

  for (const scene of input.scenes) {
    const times = sampleTimes(scene, perScene);
    for (const time of times) {
      if (!ffmpeg || !input.videoPath) {
        out.push({ sceneId: scene.id, timeSeconds: time });
        continue;
      }
      const jpeg = await grabFrame(ffmpeg, input.videoPath, time);
      out.push({
        sceneId: scene.id,
        timeSeconds: time,
        ...(jpeg
          ? { jpeg, mimeType: "image/jpeg" as const }
          : {}),
      });
    }
  }
  return out;
}
