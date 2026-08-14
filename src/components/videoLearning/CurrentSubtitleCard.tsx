"use client";

import { AnalyzableEnglish } from "@/components/AnalyzableEnglish";
import { SegmentPlayButton } from "@/components/videoLearning/SegmentPlayButton";
import type { UICopy } from "@/lib/copy";
import type { VideoSubtitle } from "@/lib/videoLearning";
import { formatSubtitleTime } from "@/lib/videoLearning";

export function CurrentSubtitleCard({
  ui,
  cue,
  playing,
  sessionSaved,
  onPlaySegment,
  onSaveSession,
}: {
  ui: UICopy;
  cue: VideoSubtitle | null;
  playing: boolean;
  sessionSaved: boolean;
  onPlaySegment: () => void;
  onSaveSession: () => void;
}) {
  if (!cue) {
    return (
      <div className="px-4 py-5">
        <p className="text-center text-sm text-slate-500">
          {ui.videoLearnIdleEnglish}
        </p>
        <div className="mt-3 flex justify-center">
          <button
            type="button"
            onClick={onSaveSession}
            disabled={sessionSaved}
            className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800 disabled:bg-slate-300"
          >
            {sessionSaved ? ui.videoLearnSessionSaved : ui.videoLearnSaveSession}
          </button>
        </div>
      </div>
    );
  }

  const interpretation = cue.translation.trim();

  return (
    <div className="px-4 py-4">
      <div
        role="button"
        tabIndex={0}
        onClick={() => onPlaySegment()}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onPlaySegment();
          }
        }}
        className={`cursor-pointer rounded-xl px-3 py-3 text-left transition ${
          playing ? "bg-slate-900" : "bg-slate-50 hover:bg-slate-100"
        }`}
      >
        <div className="flex items-start justify-between gap-2">
          <div
            className="min-w-0 flex-1"
            onClick={(event) => {
              const selected = window.getSelection()?.toString().trim();
              if (selected) event.stopPropagation();
            }}
          >
            <AnalyzableEnglish
              sentence={cue.original}
              analyzeLabel={ui.insightAnalyze}
              tone={playing ? "onDark" : "default"}
              className={`text-[1.05rem] font-semibold leading-snug ${
                playing ? "text-white" : "text-slate-900"
              }`}
            />
            {interpretation ? (
              <p
                className={`mt-2 text-sm leading-snug ${
                  playing ? "text-white/75" : "text-slate-600"
                }`}
              >
                {interpretation}
              </p>
            ) : null}
          </div>
          <SegmentPlayButton
            ariaLabel={ui.listen}
            playing={playing}
            onPlay={onPlaySegment}
            tone={playing ? "onDark" : "light"}
          />
        </div>
        <p
          className={`mt-2 text-xs tabular-nums ${
            playing ? "text-white/60" : "text-slate-400"
          }`}
        >
          {formatSubtitleTime(cue.startTime)}
          {" – "}
          {formatSubtitleTime(cue.endTime)}
        </p>
      </div>
      <div className="mt-3 flex justify-center">
        <button
          type="button"
          onClick={onSaveSession}
          disabled={sessionSaved}
          className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800 disabled:bg-slate-300"
        >
          {sessionSaved ? ui.videoLearnSessionSaved : ui.videoLearnSaveSession}
        </button>
      </div>
    </div>
  );
}
