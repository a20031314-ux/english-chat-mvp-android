"use client";

import type { UICopy } from "@/lib/copy";
import type { ExpressionInsight } from "@/lib/expressionInsight";
import { AnalyzableEnglish } from "@/components/AnalyzableEnglish";
import { TTSButton } from "@/components/TTSButton";

type ExpressionInsightSheetProps = {
  sentence: string;
  selected: string;
  insight: ExpressionInsight | null;
  isLoading: boolean;
  failed: boolean;
  ui: UICopy;
  onClose: () => void;
};

function SheetEnglish({
  sentence,
  context,
  className,
}: {
  sentence: string;
  context?: string[];
  className?: string;
}) {
  return (
    <AnalyzableEnglish
      sentence={sentence}
      context={context}
      className={className}
    />
  );
}

export function ExpressionInsightSheet({
  sentence,
  selected,
  insight,
  isLoading,
  failed,
  ui,
  onClose,
}: ExpressionInsightSheetProps) {
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
        aria-labelledby="expression-insight-title"
        className="relative z-10 max-h-[86vh] w-full max-w-md overflow-y-auto rounded-t-2xl border border-slate-200 bg-white shadow-xl sm:rounded-2xl"
        onPointerDown={(event) => event.stopPropagation()}
      >
        <div className="px-4 pb-6 pt-4">
          <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-slate-200 sm:hidden" />
          <p
            id="expression-insight-title"
            className="text-lg font-semibold text-slate-900"
          >
            {insight?.title || selected}
          </p>
          {insight?.meaning ? (
            <p className="mt-1 text-sm font-medium text-teal-800">
              {insight.meaning}
            </p>
          ) : null}

          {sentence.trim() ? (
            <div className="mt-3 rounded-xl bg-slate-50 px-3 py-2">
              <SheetEnglish
                sentence={sentence}
                className="text-sm leading-relaxed text-slate-800"
              />
            </div>
          ) : null}

          {isLoading ? (
            <p className="mt-4 text-sm text-slate-600">{ui.insightLoading}</p>
          ) : failed ? (
            <p className="mt-4 text-sm text-rose-700">{ui.insightFailed}</p>
          ) : insight ? (
            <div className="mt-4 space-y-4">
              {insight.explanation ? (
                <p className="text-sm leading-relaxed text-slate-800">
                  {insight.explanation}
                </p>
              ) : null}
              {insight.roleInSentence ? (
                <div>
                  <p className="text-[11px] font-semibold tracking-wide text-slate-500">
                    {ui.insightInSentence}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-800">
                    {insight.roleInSentence}
                  </p>
                </div>
              ) : null}
              {insight.pattern ? (
                <div>
                  <p className="text-[11px] font-semibold tracking-wide text-slate-500">
                    {ui.insightPattern}
                  </p>
                  {/[A-Za-z]/.test(insight.pattern) ? (
                    <SheetEnglish
                      sentence={insight.pattern}
                      context={[sentence]}
                      className="mt-1 text-sm font-medium leading-relaxed text-slate-900"
                    />
                  ) : (
                    <p className="mt-1 text-sm font-medium text-slate-900">
                      {insight.pattern}
                    </p>
                  )}
                </div>
              ) : null}
              {insight.examples?.length ? (
                <div>
                  <p className="text-[11px] font-semibold tracking-wide text-slate-500">
                    {ui.insightExamples}
                  </p>
                  <ul className="mt-2 space-y-2">
                    {insight.examples.map((example) => (
                      <li key={example.english}>
                        <div className="flex items-start gap-2">
                          <SheetEnglish
                            sentence={example.english}
                            context={[sentence]}
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
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {insight.tip ? (
                <div>
                  <p className="text-[11px] font-semibold tracking-wide text-slate-500">
                    {ui.insightTip}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-800">
                    {insight.tip}
                  </p>
                </div>
              ) : null}
              {insight.comparison ? (
                <div>
                  <p className="text-[11px] font-semibold tracking-wide text-slate-500">
                    {ui.insightComparison}
                  </p>
                  <SheetEnglish
                    sentence={insight.comparison.expression}
                    context={[sentence, selected]}
                    className="mt-1 text-sm font-medium leading-relaxed text-slate-900"
                  />
                  <p className="mt-1 text-sm leading-relaxed text-slate-700">
                    {insight.comparison.explanation}
                  </p>
                </div>
              ) : null}
            </div>
          ) : null}

          <button
            type="button"
            onClick={onClose}
            className="mt-5 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            {ui.insightClose}
          </button>
        </div>
      </div>
    </div>
  );
}
