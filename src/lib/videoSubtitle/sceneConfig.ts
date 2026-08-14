/** Tunable scene-detection / frame-extraction settings. */
export const SCENE_DETECT_THRESHOLD = Number(
  process.env.VIDEO_SCENE_THRESHOLD ?? "0.35",
);
/** Max seconds of video to pull for the first progressive scene pass. */
export const SCENE_FIRST_WINDOW_SECONDS = Number(
  process.env.VIDEO_SCENE_FIRST_WINDOW ?? "20",
);
/** Fallback scene length when ffmpeg scene filter is unavailable. */
export const SCENE_FALLBACK_SECONDS = Number(
  process.env.VIDEO_SCENE_FALLBACK_SECONDS ?? "8",
);
/** Representative frames per visual scene (1–3). */
export const SCENE_FRAMES_PER_SCENE = Math.min(
  3,
  Math.max(1, Number(process.env.VIDEO_SCENE_FRAMES ?? "1")),
);
/** Cap analyzed scenes across the full progressive / full-video pass. */
export const SCENE_MAX_FIRST_PASS = Number(
  process.env.VIDEO_SCENE_MAX_FIRST ?? "12",
);

export const VISION_MODEL =
  process.env.OPENAI_VISION_MODEL?.trim() ||
  process.env.OPENAI_MODEL?.trim() ||
  "gpt-4o-mini";
