"use client";

import type { UICopy } from "@/lib/copy";

/**
 * A slim bar above the list rather than a screen of its own: preparation keeps
 * running while the learner browses, so it should not look like a wall.
 */
export function SubtitleGenerationStatus({
  ui,
  progressPercent,
  onCancel,
}: {
  ui: UICopy;
  /** 0–100 overall material generation progress */
  progressPercent: number;
  onCancel?: () => void;
}) {
  const percent = Math.max(0, Math.min(100, Math.round(progressPercent)));

  return (
    <div className="flex items-center gap-3 px-4 py-2">
      <div
        className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        aria-label={ui.videoLearnGenerating}
      >
        <div
          className="h-full rounded-full bg-[#e8e8e4] transition-[width] duration-300 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
      {onCancel ? (
        <button
          type="button"
          onClick={onCancel}
          className="shrink-0 rounded-md border border-white/15 bg-white/5 px-2 py-1 text-[11px] text-slate-200 hover:bg-white/10"
        >
          {ui.videoLearnCancelPrep}
        </button>
      ) : null}
    </div>
  );
}
