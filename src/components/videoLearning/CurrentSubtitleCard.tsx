"use client";

import type { UICopy } from "@/lib/copy";
import type { VideoSubtitle } from "@/lib/videoLearning";
import { formatSubtitleTime } from "@/lib/videoLearning";
import { SaveLearningButton } from "@/components/videoLearning/SaveLearningButton";

export function CurrentSubtitleCard({
  ui,
  cue,
  analysisOpen,
  saved,
  onToggleAnalysis,
  onSave,
}: {
  ui: UICopy;
  cue: VideoSubtitle | null;
  analysisOpen: boolean;
  saved: boolean;
  onToggleAnalysis: () => void;
  onSave: () => void;
}) {
  if (!cue) {
    return (
      <div className="px-4 py-5">
        <p className="text-center text-sm text-slate-500">{ui.videoLearnIdleCue}</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-4">
      <p className="text-[1.05rem] font-semibold leading-snug text-slate-900">
        {cue.original}
      </p>
      <p className="mt-1.5 text-[0.95rem] leading-relaxed text-slate-600">
        {cue.translation}
      </p>
      <p className="mt-2 text-xs tabular-nums text-slate-400">
        {formatSubtitleTime(cue.startTime)}
      </p>
      <div className="mt-3 flex items-center gap-2">
        <button
          type="button"
          onClick={onToggleAnalysis}
          className={`rounded-lg px-2.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 ${
            analysisOpen ? "bg-slate-100" : ""
          }`}
        >
          {ui.videoLearnWhy}
        </button>
        <SaveLearningButton ui={ui} saved={saved} onSave={onSave} />
      </div>
    </div>
  );
}
