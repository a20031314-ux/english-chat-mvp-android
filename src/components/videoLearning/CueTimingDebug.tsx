"use client";

import { useEffect, useMemo, useState } from "react";
import type { VideoSubtitle } from "@/lib/videoLearning";
import {
  CUE_TIMING_DEBUG,
  cueTimingReport,
  type CueTimingSource,
} from "@/lib/videoSubtitle/debugCueTiming";

/**
 * TEMPORARY. Shows the cue timings the running platform actually produced, so a
 * subtitle-timing report from the app can be compared with one from the web.
 * Remove together with debugCueTiming.ts.
 */
export function CueTimingDebug({
  cues,
  getSource,
}: {
  cues: VideoSubtitle[];
  getSource: () => CueTimingSource;
}) {
  const [open, setOpen] = useState(false);

  const report = useMemo(
    () =>
      CUE_TIMING_DEBUG && cues.length > 0
        ? cueTimingReport(cues, getSource())
        : "",
    [cues, getSource],
  );

  useEffect(() => {
    if (report) console.error("[cue-timing]\n" + report);
  }, [report]);

  if (!report) return null;

  return (
    <div className="mt-2 rounded-lg border border-amber-400/30 bg-amber-500/5 p-2">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="text-[11px] font-medium text-amber-200"
      >
        {open ? "▾" : "▸"} cue timing ({cues.length})
      </button>
      {open ? (
        <pre className="mt-2 max-h-64 select-text overflow-auto whitespace-pre text-[10px] leading-tight text-amber-100">
          {report}
        </pre>
      ) : null}
    </div>
  );
}
