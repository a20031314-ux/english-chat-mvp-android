"use client";

import type { UICopy } from "@/lib/copy";
import type { VideoSubtitle } from "@/lib/videoLearning";
import { formatSubtitleTime } from "@/lib/videoLearning";

function isReadyTranscriptCue(cue: VideoSubtitle): boolean {
  if (cue.translationStatus === "draft") return false;
  const text = cue.translation.trim();
  if (!text) return false;
  if (text === cue.original.trim()) return false;
  return /[가-힣]/.test(text) || cue.translationStatus === "final";
}

export function TranscriptList({
  ui,
  cues,
  activeId,
  onSeek,
}: {
  ui: UICopy;
  cues: VideoSubtitle[];
  activeId: string | null;
  onSeek: (seconds: number) => void;
}) {
  const ready = cues.filter(isReadyTranscriptCue);
  return (
    <div className="border-t border-slate-100 px-4 py-3">
      <p className="text-[11px] font-semibold tracking-wide text-slate-500">
        {ui.videoLearnTranscriptShow}
      </p>
      <ul className="mt-2 space-y-1">
        {ready.map((cue) => {
          const active = cue.id === activeId;
          return (
            <li key={cue.id}>
              <button
                type="button"
                onClick={() => onSeek(cue.startTime)}
                className={`w-full rounded-xl px-2.5 py-2 text-left ${
                  active ? "bg-slate-100" : "hover:bg-slate-50"
                }`}
              >
                <p className="text-[11px] tabular-nums text-slate-400">
                  {formatSubtitleTime(cue.startTime)}
                </p>
                <p
                  className={`mt-0.5 whitespace-pre-line text-sm leading-snug ${
                    active ? "font-medium text-slate-900" : "text-slate-800"
                  }`}
                >
                  {cue.original}
                </p>
                <p className="mt-0.5 whitespace-pre-line text-sm leading-snug text-slate-500">
                  {cue.translation}
                </p>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
