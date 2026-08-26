import type { VideoSubtitle } from "@/lib/videoLearning";

/**
 * TEMPORARY diagnostic. Web and the Android app build subtitles from different
 * sources — YouTube captions on the server, on-device Whisper in the app — so a
 * timing complaint has to be measured on the platform it was seen on. Flip this
 * off (or delete the file and its one caller) once that is settled.
 */
export const CUE_TIMING_DEBUG = true;

export type CueTimingSource = {
  sttSource?: string;
  captionMode?: string;
  durationSeconds?: number;
  segmentCount?: number;
};

/** Timings and counts only — never the transcript itself. */
export function cueTimingReport(
  cues: VideoSubtitle[],
  source: CueTimingSource,
): string {
  const sorted = [...cues].sort((a, b) => a.startTime - b.startTime);
  const lines: string[] = [];
  lines.push(
    `source=${source.sttSource ?? "?"} mode=${source.captionMode ?? "?"} ` +
      `dur=${(source.durationSeconds ?? 0).toFixed(1)} ` +
      `segments=${source.segmentCount ?? "?"} cues=${sorted.length}`,
  );
  lines.push("idx   start     end     len     gap   ko");

  let overlaps = 0;
  let empty = 0;
  let longest = 0;
  let overFive = 0;

  for (let i = 0; i < sorted.length; i += 1) {
    const cue = sorted[i]!;
    const next = sorted[i + 1];
    const len = cue.endTime - cue.startTime;
    if (len > longest) longest = len;
    if (len > 5) overFive += 1;
    const gap = next ? next.startTime - cue.endTime : Number.NaN;
    if (next && gap < -0.001) overlaps += 1;
    const ko = (cue.translation || "").trim();
    if (!ko) empty += 1;
    lines.push(
      [
        String(i).padStart(3),
        cue.startTime.toFixed(2).padStart(8),
        cue.endTime.toFixed(2).padStart(8),
        len.toFixed(2).padStart(7),
        (Number.isNaN(gap) ? "-" : gap.toFixed(2)).padStart(7),
        String(ko.length).padStart(4),
      ].join(" "),
    );
  }

  lines.push(
    `overlaps=${overlaps} empty=${empty} ` +
      `longest=${longest.toFixed(2)} over5s=${overFive}`,
  );
  return lines.join("\n");
}
