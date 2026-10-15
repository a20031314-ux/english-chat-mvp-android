import { MAX_VIDEO_PREP_SECONDS } from "../billing/config.ts";

/**
 * Shorter than this is a Short, a trailer or a promo: mostly music, too few
 * lines to follow, and on the device too short for its captions to be trusted,
 * so it ends in "no speech found". NHK's channel was three quarters of these.
 */
export const MIN_CHANNEL_VIDEO_SECONDS = 60;

/** A channel upload a learner can actually open here. */
export function isStudyableUpload(item: { title?: string; durationSeconds?: number }): boolean {
  if (/#shorts?\b/i.test(item.title ?? "")) return false;
  const seconds = item.durationSeconds;
  // No length is a live or scheduled stream: hours long, or nothing yet.
  if (seconds == null || !Number.isFinite(seconds)) return false;
  return seconds >= MIN_CHANNEL_VIDEO_SECONDS && seconds <= MAX_VIDEO_PREP_SECONDS;
}
