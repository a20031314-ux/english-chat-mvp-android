"use client";

import { AnalyzableEnglish } from "@/components/AnalyzableEnglish";
import { SegmentPlayButton } from "@/components/videoLearning/SegmentPlayButton";
import type { UICopy } from "@/lib/copy";
import type { VideoSubtitle } from "@/lib/videoLearning";
import { formatSubtitleTime } from "@/lib/videoLearning";

export function EnglishSentenceList({
  ui,
  cues,
  activeId,
  playingId,
  playingIds,
  rangeMode,
  rangeIds,
  onToggleRangeMode,
  onClearRange,
  onPlaySegment,
  onSelectRangeCue,
  onPlayRange,
}: {
  ui: UICopy;
  cues: VideoSubtitle[];
  activeId: string | null;
  playingId: string | null;
  playingIds: string[];
  rangeMode: boolean;
  rangeIds: string[];
  onToggleRangeMode: () => void;
  onClearRange: () => void;
  onPlaySegment: (cue: VideoSubtitle) => void;
  onSelectRangeCue: (cue: VideoSubtitle) => void;
  onPlayRange: () => void;
}) {
  if (cues.length === 0) {
    return (
      <div className="px-4 py-6 text-center text-sm text-slate-500">
        {ui.videoLearnStudyEmpty}
      </div>
    );
  }

  const rangeSet = new Set(rangeIds);
  const playingSet = new Set(playingIds);
  const canPlayRange = rangeIds.length >= 2;

  return (
    <div className="border-t border-slate-100 px-4 py-3">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onToggleRangeMode}
          className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
            rangeMode
              ? "bg-slate-900 text-white"
              : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
          }`}
        >
          {ui.videoLearnRangeMode}
        </button>
        {rangeMode && canPlayRange ? (
          <>
            <button
              type="button"
              onClick={onPlayRange}
              className="rounded-lg bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-slate-800"
            >
              {ui.videoLearnPlayRange}
            </button>
            <button
              type="button"
              onClick={onClearRange}
              className="rounded-lg px-2.5 py-1.5 text-xs text-slate-500 hover:bg-slate-100"
            >
              {ui.videoLearnClearRange}
            </button>
          </>
        ) : null}
      </div>
      {rangeMode ? (
        <p className="mt-2 text-[11px] leading-snug text-slate-400">
          {ui.videoLearnRangeHint}
        </p>
      ) : null}
      <ul className="mt-3 space-y-2">
        {cues.map((cue) => {
          const active = cue.id === activeId;
          const playing = cue.id === playingId || playingSet.has(cue.id);
          const inRange = rangeSet.has(cue.id);
          const interpretation = cue.translation.trim();
          const highlighted = active || playing || inRange;
          return (
            <li key={cue.id}>
              <div
                role="button"
                tabIndex={0}
                onClick={(event) => {
                  if (rangeMode || event.shiftKey) {
                    onSelectRangeCue(cue);
                    return;
                  }
                  onPlaySegment(cue);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    if (rangeMode) onSelectRangeCue(cue);
                    else onPlaySegment(cue);
                  }
                }}
                className={`cursor-pointer rounded-xl px-3 py-2.5 text-left transition ${
                  highlighted
                    ? "bg-slate-900 text-white"
                    : "bg-slate-50 hover:bg-slate-100"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <p
                    className={`text-[11px] tabular-nums ${
                      highlighted ? "text-white/60" : "text-slate-400"
                    }`}
                  >
                    {formatSubtitleTime(cue.startTime)}
                    {" – "}
                    {formatSubtitleTime(cue.endTime)}
                  </p>
                  {!rangeMode ? (
                    <SegmentPlayButton
                      ariaLabel={ui.listen}
                      playing={playing}
                      onPlay={() => onPlaySegment(cue)}
                      tone={highlighted ? "onDark" : "light"}
                    />
                  ) : null}
                </div>
                <div
                  className={`mt-1.5 ${highlighted ? "[&_*]:!text-white" : ""}`}
                  onClick={(event) => {
                    const selected = window.getSelection()?.toString().trim();
                    if (selected) event.stopPropagation();
                  }}
                >
                  <AnalyzableEnglish
                    sentence={cue.original}
                    analyzeLabel={ui.insightAnalyze}
                    tone={highlighted ? "onDark" : "default"}
                    className={`text-sm leading-snug ${
                      highlighted
                        ? "font-medium text-white"
                        : "text-slate-900"
                    }`}
                  />
                  {interpretation ? (
                    <p
                      className={`mt-1.5 text-[13px] leading-snug ${
                        highlighted ? "text-white/75" : "text-slate-600"
                      }`}
                    >
                      {interpretation}
                    </p>
                  ) : null}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
