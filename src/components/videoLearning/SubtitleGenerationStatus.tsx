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
}: {
  ui: UICopy;
  stepIndex: number;
}) {
  return (
    <div className="px-4 py-6">
      <p className="text-center text-sm font-medium text-slate-800">
        {ui.videoLearnGenerating}
      </p>
      <ul className="mx-auto mt-4 max-w-xs space-y-2">
        {STEPS.map((key, index) => {
          const done = index < stepIndex;
          const current = index === stepIndex;
          return (
            <li
              key={key}
              className={`flex items-center gap-2 text-sm ${
                current
                  ? "font-medium text-slate-800"
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
