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
      <div className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/10 bg-[#121212] shadow-xl">
        <div className="border-b border-white/10 px-5 py-4">
          <h2 id="review-modal-title" className="text-base font-semibold text-slate-100">
            {ui.learningBookTitle}
          </h2>
          <p className="mt-1 text-xs text-slate-500">{ui.reviewFrontHint}</p>
        </div>

        <div className="space-y-4 px-5 py-5">
          <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-4">
            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
              {ui.cardMySentence}
            </p>
            <AnalyzableEnglish
              sentence={card.original}
              analyzeLabel={ui.insightAnalyze}
              sourceType="example"
              tone="onDark"
              className="mt-2 text-base leading-relaxed text-slate-100"
            />
          </div>

          {!revealed ? (
            <button
              type="button"
              onClick={() => setRevealed(true)}
              className="w-full rounded-xl bg-[#e8e8e4] shadow-[0_0_14px_rgba(255,255,255,0.28)] px-4 py-3 text-sm font-medium text-neutral-900 transition hover:bg-[#f5f5f3]"
            >
              {ui.reviewReveal}
            </button>
          ) : (
            <div className="space-y-4">
              <div className="rounded-xl border border-emerald-400/25 bg-emerald-500/10 px-4 py-3">
                <p className="text-[11px] font-medium uppercase tracking-wide text-emerald-200">
                  {ui.cardBetterExpression}
                </p>
                <AnalyzableEnglish
                  sentence={card.corrected}
                  analyzeLabel={ui.insightAnalyze}
                  sourceType="example"
                  tone="onDark"
                  className="mt-1.5 text-base font-medium text-emerald-100"
                />
              </div>

              {showNatural && (
                <div className="rounded-xl border border-white/25 bg-white/10 px-4 py-3">
                  <p className="text-[11px] font-medium uppercase tracking-wide text-[#e4e4e0]">
                    {ui.cardMoreNatural}
                  </p>
                  <AnalyzableEnglish
                    sentence={card.natural ?? ""}
                    analyzeLabel={ui.insightAnalyze}
                    sourceType="example"
                    tone="onDark"
                    className="mt-1.5 text-base text-neutral-200"
                  />
                </div>
              )}

              {card.explanation.trim() ? (
                <div className="rounded-xl border border-white/10 bg-[#121212] px-4 py-3">
                  <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                    {ui.cardPoint}
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-100">{card.explanation}</p>
                </div>
              ) : null}

              <p className="text-center text-sm leading-relaxed text-slate-300">
                {ui.reviewConfidencePrompt}
              </p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                <button
                  type="button"
                  onClick={() => onRate("forgot")}
                  className="rounded-xl border border-rose-400/30 bg-rose-500/15 px-3 py-2.5 text-sm font-medium text-rose-100 transition hover:bg-rose-500/25"
                >
                  {ui.reviewForgot}
                </button>
                <button
                  type="button"
                  onClick={() => onRate("vague")}
                  className="rounded-xl border border-amber-400/30 bg-amber-500/15 px-3 py-2.5 text-sm font-medium text-amber-100 transition hover:bg-amber-500/25"
                >
                  {ui.reviewVague}
                </button>
                <button
                  type="button"
                  onClick={() => onRate("familiar")}
                  className="rounded-xl border border-white/30 bg-white/10 px-3 py-2.5 text-sm font-medium text-neutral-200 transition hover:bg-white/20"
                >
                  {ui.reviewFamiliar}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end border-t border-white/10 px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-white/10 hover:text-white"
          >
            {ui.closeArchive}
          </button>
        </div>
      </div>
    </div>
  );
}
