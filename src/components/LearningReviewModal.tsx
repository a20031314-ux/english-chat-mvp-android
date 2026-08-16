"use client";

import { useState } from "react";
import { AnalyzableEnglish } from "@/components/AnalyzableEnglish";
import type { UICopy } from "@/lib/copy";
import type { LearningCard, ReviewLevel } from "@/lib/learningCards";
import { shouldShowNatural } from "@/lib/learningCards";

type LearningReviewModalProps = {
  card: LearningCard | null;
  ui: UICopy;
  onClose: () => void;
  onRate: (level: ReviewLevel) => void;
};

export function LearningReviewModal({
  card,
  ui,
  onClose,
  onRate,
}: LearningReviewModalProps) {
  const [revealed, setRevealed] = useState(false);

  if (!card) {
    return null;
  }

  const showNatural = shouldShowNatural(card);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="review-modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="Close"
        onClick={onClose}
      />
      <div className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-xl">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 id="review-modal-title" className="text-base font-semibold text-slate-900">
            {ui.learningBookTitle}
          </h2>
          <p className="mt-1 text-xs text-slate-500">{ui.reviewFrontHint}</p>
        </div>

        <div className="space-y-4 px-5 py-5">
          <div className="rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-4">
            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
              {ui.cardMySentence}
            </p>
            <AnalyzableEnglish
              sentence={card.original}
              analyzeLabel={ui.insightAnalyze}
              sourceType="example"
              className="mt-2 text-base leading-relaxed text-slate-900"
            />
          </div>

          {!revealed ? (
            <button
              type="button"
              onClick={() => setRevealed(true)}
              className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              {ui.reviewReveal}
            </button>
          ) : (
            <div className="space-y-4">
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 px-4 py-3">
                <p className="text-[11px] font-medium uppercase tracking-wide text-emerald-800">
                  {ui.cardBetterExpression}
                </p>
                <AnalyzableEnglish
                  sentence={card.corrected}
                  analyzeLabel={ui.insightAnalyze}
                  sourceType="example"
                  className="mt-1.5 text-base font-medium text-emerald-950"
                />
              </div>

              {showNatural && (
                <div className="rounded-xl border border-sky-200 bg-sky-50/60 px-4 py-3">
                  <p className="text-[11px] font-medium uppercase tracking-wide text-sky-800">
                    {ui.cardMoreNatural}
                  </p>
                  <AnalyzableEnglish
                    sentence={card.natural ?? ""}
                    analyzeLabel={ui.insightAnalyze}
                    sourceType="example"
                    className="mt-1.5 text-base text-sky-950"
                  />
                </div>
              )}

              {card.explanation.trim() ? (
                <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                  <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                    {ui.cardPoint}
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-800">{card.explanation}</p>
                </div>
              ) : null}

              <p className="text-center text-sm leading-relaxed text-slate-600">
                {ui.reviewConfidencePrompt}
              </p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                <button
                  type="button"
                  onClick={() => onRate("forgot")}
                  className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm font-medium text-rose-900 transition hover:bg-rose-100"
                >
                  {ui.reviewForgot}
                </button>
                <button
                  type="button"
                  onClick={() => onRate("vague")}
                  className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm font-medium text-amber-950 transition hover:bg-amber-100"
                >
                  {ui.reviewVague}
                </button>
                <button
                  type="button"
                  onClick={() => onRate("familiar")}
                  className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm font-medium text-emerald-950 transition hover:bg-emerald-100"
                >
                  {ui.reviewFamiliar}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end border-t border-slate-100 px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          >
            {ui.closeArchive}
          </button>
        </div>
      </div>
    </div>
  );
}
