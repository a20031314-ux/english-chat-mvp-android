"use client";

import type { UICopy } from "@/lib/copy";
import type { EnglishAnalysisFrame } from "@/hooks/useEnglishAnalysis";
import { InteractiveEnglishText } from "@/components/InteractiveEnglishText";
import { TTSButton } from "@/components/TTSButton";

export function EnglishAnalysisViewer({
  frame,
  canGoBack,
  ui,
  onBack,
  onClose,
}: {
  frame: EnglishAnalysisFrame;
  canGoBack: boolean;
  ui: UICopy;
  onBack: () => void;
  onClose: () => void;
}) {
  const analysis = frame.analysis;
  const sentence = frame.target.contextSentence;

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center bg-slate-900/40 sm:items-center sm:p-3">
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label={ui.insightClose}
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="english-analysis-title"
        className="relative z-10 flex max-h-[86vh] w-full max-w-md flex-col overflow-hidden rounded-t-2xl border border-slate-200 bg-white shadow-xl sm:rounded-2xl"
        onPointerDown={(event) => event.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between gap-2 px-3 pt-3">
          {canGoBack ? (
            <button
              type="button"
              onClick={onBack}
              className="rounded-lg px-2 py-1.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            >
              ← {ui.insightBack}
            </button>
          ) : (
            <span className="px-2 py-1.5 text-sm text-transparent">←</span>
          )}
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            aria-label={ui.insightClose}
          >
            ✕
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-6 pt-1">
          <p
            id="english-analysis-title"
            className="text-lg font-semibold text-slate-900"
          >
            {analysis?.title || frame.target.selectedText}
          </p>
          {analysis?.reading ? (
            <p className="mt-0.5 text-sm text-slate-500">{analysis.reading}</p>
          ) : null}
          {analysis?.meaningInContext ? (
            <p className="mt-1 text-sm font-medium text-teal-800">
              {analysis.meaningInContext}
            </p>
          ) : null}

          {sentence.trim() ? (
            <div className="mt-3 rounded-xl bg-slate-50 px-3 py-2">
              <p className="text-[11px] font-semibold tracking-wide text-slate-500">
                {ui.exploreMeaningHere}
              </p>
              <InteractiveEnglishText
                sentence={sentence}
                sourceType={frame.target.sourceType}
                language={frame.target.language}
                className="mt-1 text-sm leading-relaxed text-slate-800"
              />
            </div>
          ) : null}

          {frame.isLoading ? (
            <p className="mt-4 text-sm text-slate-600">{ui.insightLoading}</p>
          ) : frame.failed ? (
            <p className="mt-4 text-sm text-rose-700">{ui.insightFailed}</p>
          ) : analysis ? (
            <div className="mt-4 space-y-4">
              {analysis.contextExplanation ? (
                <p className="text-sm leading-relaxed text-slate-800">
                  {analysis.contextExplanation}
                </p>
              ) : null}

              {analysis.whyUsed ? (
                <section>
                  <p className="text-[11px] font-semibold tracking-wide text-slate-500">
                    {ui.exploreWhy}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-800">
                    {analysis.whyUsed}
                  </p>
                </section>
              ) : null}

              {analysis.pattern ? (
                <section>
                  <p className="text-[11px] font-semibold tracking-wide text-slate-500">
                    {ui.insightPattern}
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-900">
                    {analysis.pattern}
                  </p>
                </section>
              ) : null}

              {analysis.usageExplanation ? (
                <section>
                  <p className="text-[11px] font-semibold tracking-wide text-slate-500">
                    {ui.exploreUsage}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-800">
                    {analysis.usageExplanation}
                  </p>
                </section>
              ) : null}

              {analysis.examples?.length ? (
                <section>
                  <p className="text-[11px] font-semibold tracking-wide text-slate-500">
                    {ui.insightExamples}
                  </p>
                  <ul className="mt-2 space-y-2">
                    {analysis.examples.map((example) => (
                      <li key={example.english}>
                        <div className="flex items-start gap-2">
                          <InteractiveEnglishText
                            sentence={example.english}
                            sourceType="example"
                            language={frame.target.language}
                            className="text-sm font-medium leading-relaxed text-slate-900"
                          />
                          <TTSButton
                            text={example.english}
                            ariaLabel={ui.listen}
                          />
                        </div>
                        {example.translation ? (
                          <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
                            {example.translation}
                          </p>
                        ) : null}
                        {example.note ? (
                          <p className="mt-0.5 text-[11px] text-slate-400">
                            {example.note}
                          </p>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              {analysis.otherUsages?.length ? (
                <section>
                  <p className="text-[11px] font-semibold tracking-wide text-slate-500">
                    {ui.exploreOtherUsages}
                  </p>
                  <ul className="mt-2 space-y-3">
                    {analysis.otherUsages.map((usage) => (
                      <li key={`${usage.pattern}-${usage.meaning}`}>
                        <p className="text-sm font-medium text-slate-900">
                          {usage.pattern}
                        </p>
                        <p className="mt-0.5 text-sm leading-relaxed text-slate-700">
                          {usage.meaning}
                        </p>
                        {usage.examples?.map((example) => (
                          <div key={example.english} className="mt-1">
                            <InteractiveEnglishText
                              sentence={example.english}
                              sourceType="example"
                              language={frame.target.language}
                              className="text-sm leading-relaxed text-slate-800"
                            />
                            {example.translation ? (
                              <p className="text-xs text-slate-500">
                                {example.translation}
                              </p>
                            ) : null}
                          </div>
                        ))}
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
