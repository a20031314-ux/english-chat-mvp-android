import type { SceneContext } from "@/lib/videoSubtitle/sceneTypes";

/** Pick the scene covering a cue midpoint (cached list; no re-vision). */
export function getSceneContextAtTime(
  scenes: SceneContext[] | undefined,
  timeSeconds: number,
): SceneContext | undefined {
  if (!scenes?.length) return undefined;
  const t = Math.max(0, timeSeconds);
  const hit = scenes.find(
    (scene) => t >= scene.startTime && t < scene.endTime + 0.001,
  );
  if (hit) return hit;
  // Nearest scene if exactly on a boundary gap
  let best: SceneContext | undefined;
  let bestDist = Number.POSITIVE_INFINITY;
  for (const scene of scenes) {
    const mid = (scene.startTime + scene.endTime) / 2;
    const dist = Math.abs(mid - t);
    if (dist < bestDist) {
      best = scene;
      bestDist = dist;
    }
  }
  return bestDist <= 6 ? best : undefined;
}

export function sceneContextForUnit(
  scenes: SceneContext[] | undefined,
  startTime: number,
  endTime: number,
): SceneContext | undefined {
  return getSceneContextAtTime(scenes, (startTime + endTime) / 2);
}
