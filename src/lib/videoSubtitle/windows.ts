import type { NormalizedSegment } from "@/lib/videoSubtitle/types";

/** Fixed processing / first-playable section length. */
export const TRANSLATION_WINDOW_SECONDS = 20;
export const FIRST_WINDOW_SECONDS = 20;
export type TimeWindow = {
  start: number;
  end: number;
};

export type DialogueSection = TimeWindow & {
  /** Indices into the full segment list (inclusive start, exclusive end). */
  startIndex: number;
  endIndex: number;
};

export function windowsForDuration(
  durationSeconds: number,
  windowSeconds = TRANSLATION_WINDOW_SECONDS,
): TimeWindow[] {
  const duration = Math.max(0, durationSeconds);
  if (duration === 0) return [{ start: 0, end: windowSeconds }];
  const windows: TimeWindow[] = [];
  for (let start = 0; start < duration; start += windowSeconds) {
    windows.push({
      start,
      end: Math.min(start + windowSeconds, duration),
    });
  }
  return windows;
}

/**
 * Fixed clock windows (default 20s). Dialogue helpers remain available separately.
 */
export function processingWindows(
  _segments: NormalizedSegment[],
  durationSeconds: number,
): TimeWindow[] {
  return windowsForDuration(durationSeconds, TRANSLATION_WINDOW_SECONDS);
}
