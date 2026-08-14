export const TRANSLATION_WINDOW_SECONDS = 60;
export const CONTEXT_NEIGHBOR_COUNT = 3;

export type TimeWindow = {
  start: number;
  end: number;
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
 * Future seek-priority queue: current playhead first, then upcoming, then the rest.
 * Sequential order is used today; this keeps the ranking rule in one place.
 */
export function prioritizeWindows(
  windows: TimeWindow[],
  playheadSeconds: number,
): TimeWindow[] {
  const playhead = Math.max(0, playheadSeconds);
  return [...windows].sort((a, b) => {
    const score = (w: TimeWindow) => {
      if (playhead >= w.start && playhead < w.end) return 0;
      if (w.start >= playhead) return 1 + (w.start - playhead);
      return 100000 + (playhead - w.end);
    };
    return score(a) - score(b);
  });
}

export function segmentsInWindow<T extends { startTime: number }>(
  segments: T[],
  window: TimeWindow,
): T[] {
  return segments.filter(
    (segment) => segment.startTime >= window.start && segment.startTime < window.end,
  );
}

export function neighborsAround<T>(
  all: T[],
  startIndex: number,
  endIndex: number,
  count = CONTEXT_NEIGHBOR_COUNT,
): { previous: T[]; next: T[] } {
  return {
    previous: all.slice(Math.max(0, startIndex - count), startIndex),
    next: all.slice(endIndex, Math.min(all.length, endIndex + count)),
  };
}
