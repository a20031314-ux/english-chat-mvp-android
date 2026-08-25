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
            className="rounded-lg bg-[#e8e8e4] shadow-[0_0_12px_rgba(255,255,255,0.22)] px-3 py-1.5 text-xs font-medium text-neutral-900 hover:bg-[#f5f5f3] disabled:bg-white/15 disabled:text-neutral-900/50 disabled:shadow-none"
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
          playing ? "bg-[#e8e8e4]" : "bg-white/5 hover:bg-white/10"
        }`}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <AnalyzableEnglish
              sentence={cue.original}
              analyzeLabel={ui.insightAnalyze}
              sourceType="subtitle"
              translation={interpretation || undefined}
              analysisTranslation={cue.analysisTranslation}
              tone={playing ? "default" : "onDark"}
              className={`text-[1.05rem] font-semibold leading-snug ${
                playing ? "text-neutral-900" : "text-slate-100"
              }`}
            />
            {interpretation ? (
              <p
                className={`mt-2 text-sm leading-snug ${
                  playing ? "text-neutral-700" : "text-slate-300"
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
          className="rounded-lg bg-[#e8e8e4] shadow-[0_0_12px_rgba(255,255,255,0.22)] px-3 py-1.5 text-xs font-medium text-neutral-900 hover:bg-[#f5f5f3] disabled:bg-white/15 disabled:text-neutral-900/50 disabled:shadow-none"
        >
          {sessionSaved ? ui.videoLearnSessionSaved : ui.videoLearnSaveSession}
        </button>
      </div>
    </div>
  );
}
