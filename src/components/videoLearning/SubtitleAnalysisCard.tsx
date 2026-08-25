"use client";

import type { UICopy } from "@/lib/copy";
import type { VideoSubtitleAnalysis } from "@/lib/videoLearning";

export function SubtitleAnalysisCard({
  ui,
  analysis,
  loading,
}: {
  ui: UICopy;
  analysis: VideoSubtitleAnalysis | null;
  loading: boolean;
}) {
  if (loading) {
    return (
      <div className="mx-4 mb-3 rounded-xl bg-white/5 px-3 py-3">
        <p className="text-sm text-slate-500">{ui.insightLoading}</p>
      </div>
    );
  }
  if (!analysis) return null;

  return (
    <div className="mx-4 mb-3 rounded-xl bg-white/5 px-3 py-3">
      {analysis.whyThisSubtitle ? (
        <>
          <p className="text-[11px] font-semibold tracking-wide text-slate-500">
            {ui.videoLearnWhyDetail}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-slate-100">
            {analysis.whyThisSubtitle}
          </p>
        </>
      ) : null}

      <p
        className={`text-[11px] font-semibold tracking-wide text-slate-500 ${
          analysis.whyThisSubtitle ? "mt-3" : ""
        }`}
      >
        {ui.videoLearnKeyExpression}
      </p>
      <p className="mt-1 text-sm font-medium text-slate-100">
        {analysis.keyExpression}
      </p>
      <p className="mt-0.5 text-sm text-slate-300">{analysis.keyMeaning}</p>

      <p className="mt-3 text-[11px] font-semibold tracking-wide text-slate-500">
        {ui.videoLearnMeaningHere}
      </p>
      <p className="mt-1 text-sm leading-relaxed text-slate-100">
        {analysis.meaningInSentence}
      </p>

      <p className="mt-3 text-[11px] font-semibold tracking-wide text-slate-500">
        {ui.videoLearnNuance}
      </p>
      <p className="mt-1 text-sm leading-relaxed text-slate-100">
        {analysis.nuance}
      </p>

      {analysis.similar.length > 0 ? (
        <>
          <p className="mt-3 text-[11px] font-semibold tracking-wide text-slate-500">
            {ui.videoLearnSimilar}
          </p>
          <ul className="mt-1 space-y-1">
            {analysis.similar.map((line) => (
              <li
                key={line}
                className="text-sm leading-relaxed text-slate-100"
              >
                {line}
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </div>
  );
}
