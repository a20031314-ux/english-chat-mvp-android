"use client";

import type { UICopy } from "@/lib/copy";

const STEPS = [
  "videoLearnStepSpeech",
  "videoLearnStepContext",
  "videoLearnStepTranslate",
  "videoLearnStepCleanup",
] as const;

export function SubtitleGenerationStatus({
  ui,
  stepIndex,
  progressPercent,
}: {
  ui: UICopy;
  stepIndex: number;
  /** 0–100 overall material generation progress */
  progressPercent: number;
}) {
  const percent = Math.max(0, Math.min(100, Math.round(progressPercent)));

  return (
    <div className="px-4 py-8">
      <p className="text-center text-sm font-medium text-slate-100">
        {ui.videoLearnGenerating}
      </p>

      <div className="mx-auto mt-5 max-w-sm">
        <div
          className="h-2.5 overflow-hidden rounded-full bg-white/10"
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
        <p className="mt-2 text-center text-sm font-semibold tabular-nums text-slate-200">
          {percent}%
        </p>
      </div>

      <ul className="mx-auto mt-6 max-w-xs space-y-2">
        {STEPS.map((key, index) => {
          const done = index < stepIndex || percent >= 100;
          const current = index === stepIndex && percent < 100;
          return (
            <li
              key={key}
              className={`flex items-center gap-2 text-sm ${
                current
                  ? "font-medium text-slate-100"
                  : done
                    ? "text-slate-500"
                    : "text-slate-400"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                  current
                    ? "bg-slate-800"
                    : done
                      ? "bg-slate-400"
                      : "bg-slate-300"
                }`}
              />
              {ui[key]}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
