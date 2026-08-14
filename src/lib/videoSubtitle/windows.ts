import type { NormalizedSegment } from "@/lib/videoSubtitle/types";

/** Fixed processing / first-playable section length. */
export const TRANSLATION_WINDOW_SECONDS = 20;
export const FIRST_WINDOW_SECONDS = 20;
export const CONTEXT_NEIGHBOR_COUNT = 5;

/** Pause between lines that starts a new dialogue section (optional helper). */
export const DIALOGUE_GAP_SECONDS = 1.35;
/** Safety cap so one run-on monologue does not become a huge batch. */
export const MAX_SECTION_SECONDS = 40;
export const MAX_SECTION_SEGMENTS = 12;
/**
 * If the opening beat is tiny, fold the next beat into the first playable section
 * so the player is not gated on a one-word cue.
 */
export const MIN_FIRST_SECTION_SECONDS = 5;
export const MIN_FIRST_SECTION_SEGMENTS = 2;

export type TimeWindow = {
  start: number;
  end: number;
};

export type DialogueSection = TimeWindow & {
  /** Indices into the full segment list (inclusive start, exclusive end). */
  startIndex: number;
  endIndex: number;
};

function endsLikeSentence(text: string): boolean {
  const trimmed = text.trim();
  return /[.!?…。！？]"?$/.test(trimmed) || /[다요죠까네임음]$/.test(trimmed);
}

/**
 * Build processing sections from speech rhythm — not fixed clock slices.
 * A new section starts after a meaningful pause, or when a soft size cap is hit.
 */
export function dialogueSectionsFromSegments(
  segments: NormalizedSegment[],
): DialogueSection[] {
  if (segments.length === 0) return [];

  const sections: DialogueSection[] = [];
  let startIndex = 0;

  for (let i = 1; i < segments.length; i += 1) {
    const prev = segments[i - 1]!;
    const curr = segments[i]!;
    const gap = curr.startTime - prev.endTime;
    const sectionStart = segments[startIndex]!.startTime;
    const durationIfInclude = curr.endTime - sectionStart;
    const countIfInclude = i - startIndex + 1;

    const pauseBreak = gap >= DIALOGUE_GAP_SECONDS;
    const overDuration = durationIfInclude > MAX_SECTION_SECONDS;
    const overCount = countIfInclude > MAX_SECTION_SEGMENTS;
    const softSentenceSplit =
      countIfInclude >= 6 &&
      durationIfInclude >= 18 &&
      endsLikeSentence(prev.normalizedText) &&
      gap >= 0.45;

    if (pauseBreak || overDuration || overCount || softSentenceSplit) {
      sections.push({
        start: segments[startIndex]!.startTime,
        end: prev.endTime,
        startIndex,
        endIndex: i,
      });
      startIndex = i;
    }
  }

  sections.push({
    start: segments[startIndex]!.startTime,
    end: segments[segments.length - 1]!.endTime,
    startIndex,
    endIndex: segments.length,
  });

  return sections;
}

/**
 * First playable batch: at least one dialogue beat; merge a tiny opener with the next beat.
 */
export function firstPlayableSection(
  sections: DialogueSection[],
): DialogueSection | null {
  if (sections.length === 0) return null;
  const first = sections[0]!;
  const firstDuration = first.end - first.start;
  const firstCount = first.endIndex - first.startIndex;
  const next = sections[1];
  if (
    next &&
    (firstDuration < MIN_FIRST_SECTION_SECONDS ||
      firstCount < MIN_FIRST_SECTION_SEGMENTS)
  ) {
    return {
      start: first.start,
      end: next.end,
      startIndex: first.startIndex,
      endIndex: next.endIndex,
    };
  }
  return first;
}

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
    (segment) =>
      segment.startTime >= window.start && segment.startTime < window.end,
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
