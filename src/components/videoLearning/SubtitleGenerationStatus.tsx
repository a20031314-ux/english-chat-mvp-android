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
          /* Same red as hanging up a call: this is the app's other stop button. */
          className="shrink-0 rounded-md bg-rose-600 px-2.5 py-1 text-[11px] font-medium text-white hover:bg-rose-500"
        >
          {ui.videoLearnCancelPrep}
        </button>
      ) : null}
    </div>
  );
}
