import { cleanupTempPath, detectScenes, writeTempVideo } from "@/lib/videoSubtitle/detectScenes";
import { downloadVideoPrefix } from "@/lib/videoSubtitle/downloadVideoPrefix";
import { extractRepresentativeFrames } from "@/lib/videoSubtitle/extractRepresentativeFrames";
import { analyzeScenesBatch } from "@/lib/videoSubtitle/analyzeScene";
import {
  SCENE_FIRST_WINDOW_SECONDS,
  SCENE_MAX_FIRST_PASS,
} from "@/lib/videoSubtitle/sceneConfig";
import type { SceneContext } from "@/lib/videoSubtitle/sceneTypes";

/**
 * Progressive first-window scene contexts for subtitle adaptation.
 * Never throws — returns [] on any soft failure.
 */
export async function buildSceneContextsForWindow(input: {
  videoStreamUrl?: string;
  mediaUserAgent?: string;
  videoTitle?: string;
  fromSeconds?: number;
  toSeconds?: number;
}): Promise<SceneContext[]> {
  const from = input.fromSeconds ?? 0;
  const to = input.toSeconds ?? SCENE_FIRST_WINDOW_SECONDS;

  let videoPath: string | undefined;
  try {
    const bytes = await downloadVideoPrefix({
      videoStreamUrl: input.videoStreamUrl,
      mediaUserAgent: input.mediaUserAgent,
    });
    if (bytes) {
      videoPath = await writeTempVideo(bytes, "mp4");
    }

    const scenes = (
      await detectScenes({
        videoPath,
        fromSeconds: from,
        toSeconds: to,
      })
    ).slice(0, SCENE_MAX_FIRST_PASS);

    const frames = await extractRepresentativeFrames({
      videoPath,
      scenes,
    });

    const analyzed = await analyzeScenesBatch({
      scenes,
      frames,
      videoTitle: input.videoTitle,
    });

    if (process.env.NODE_ENV === "development") {
      console.error("[scene-context]", {
        sceneCount: analyzed.length,
        withVision: frames.some((frame) => Boolean(frame.jpeg)),
        sample: analyzed.slice(0, 2).map((scene) => ({
          id: scene.id,
          t: `${scene.startTime.toFixed(1)}-${scene.endTime.toFixed(1)}`,
          setting: scene.setting,
          situation: scene.situation,
          mood: scene.mood,
        })),
      });
    }

    return analyzed;
  } catch (error) {
    console.error("[scene-context-build]", error);
    return [];
  } finally {
    await cleanupTempPath(videoPath);
  }
}
