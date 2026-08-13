"use client";

import { useMemo } from "react";
import type { Locale, UICopy } from "@/lib/copy";
import {
  countGrammarCorrections,
  formatReportDate,
  getReportScoreBreakdown,
  type ScoreFactorId,
  type SessionReport,
} from "@/lib/sessionReports";
import { SessionChatReplay } from "@/components/SessionChatReplay";

type SessionReportViewProps = {
  report: SessionReport;
  ui: UICopy;
  locale: Locale;
  onBack: () => void;
};

function factorLabel(id: ScoreFactorId, ui: UICopy): string {
  switch (id) {
    case "accuracy":
      return ui.reportScoreFactorAccuracy;
    case "naturalness":
      return ui.reportScoreFactorNaturalness;
    case "fluency":
      return ui.reportScoreFactorFluency;
    case "spokenStyle":
      return ui.reportScoreFactorSpoken;
    default:
      return id;
  }
}

export function SessionReportView({
  report,
  ui,
  locale,
  onBack,
}: SessionReportViewProps) {
  const scoreBreakdown = useMemo(
    () => getReportScoreBreakdown(report),
    [report],
  );
  const correctionCount = useMemo(
    () => countGrammarCorrections(report),
    [report],
  );

  return (
    <div className="flex h-full min-h-0 flex-col bg-white">
      <header className="shrink-0 border-b border-slate-200 px-4 py-3 sm:px-6">
        <button
          type="button"
          onClick={onBack}
          className="rounded-md px-1 py-1 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          {ui.reportBack}
        </button>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <article className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-8 sm:py-8">
          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
            {ui.reportDetailBadge}
          </p>
          <h1 className="mt-2 text-xl font-semibold leading-snug text-slate-900 sm:text-2xl">
            {ui.reportTodayLearning}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {report.title}
            {" · "}
            {formatReportDate(report.endedAt, locale)}
            {report.score != null
              ? ` · ${ui.reportScoreLabel.replace("{score}", String(report.score))}`
              : ""}
          </p>

          <div className="mt-6 border-y border-slate-100 py-5 text-center">
            <p className="text-2xl font-semibold tabular-nums text-slate-900">
              {correctionCount}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {ui.reportStatCorrections}
            </p>
          </div>

          <section className="mt-6">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              {ui.reportSummaryTitle}
            </h2>
            <p className="mt-2 text-[15px] leading-relaxed text-slate-800">
              {report.conversationSummary}
            </p>
          </section>

          {report.scoreInsufficient ? (
            <p className="mt-6 text-sm leading-relaxed text-amber-900">
              {ui.reportScoreInsufficient}
            </p>
          ) : null}

          {scoreBreakdown ? (
            <section className="mt-8">
              <div className="flex flex-wrap items-end justify-end">
                <p className="text-3xl font-semibold tabular-nums text-slate-900">
                  {scoreBreakdown.total}
                  <span className="ml-1 text-base font-medium text-slate-400">
                    /100
                  </span>
                </p>
              </div>
              <ul className="mt-4 space-y-3">
                {scoreBreakdown.factors.map((factor) => {
                  const lost = Math.max(0, factor.max - factor.earned);
                  const pct =
                    factor.max > 0
                      ? Math.round((factor.earned / factor.max) * 100)
                      : 0;
                  return (
                    <li key={factor.id}>
                      <div className="flex items-center justify-between gap-3 text-sm">
                        <span className="font-medium text-slate-800">
                          {factorLabel(factor.id, ui)}
                        </span>
                        <span className="tabular-nums text-slate-500">
                          {ui.reportScoreFactorEarned
                            .replace("{earned}", String(factor.earned))
                            .replace("{max}", String(factor.max))}
                          {lost > 0 ? (
                            <span className="ml-2 text-rose-700">
                              {ui.reportScoreFactorLost.replace(
                                "{n}",
                                String(lost),
                              )}
                            </span>
                          ) : null}
                        </span>
                      </div>
                      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-slate-800"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          ) : null}

          {(report.expressionItems?.length ?? 0) > 0 ? (
            <section className="mt-12">
              <h2 className="text-sm font-semibold text-slate-900">
                {ui.reportExpressionsTitle}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                {ui.reportExpressionsHint}
              </p>
              <div className="mt-4 space-y-4">
                {report.expressionItems?.map((item, index) => {
                  const extras =
                    Boolean(item.simpler) ||
                    Boolean(item.moreNative) ||
                    Boolean(item.analysis);
                  return (
                    <article
                      key={`${item.used}-${index}`}
                      className="rounded-2xl border border-blue-100 bg-blue-50/40 px-4 py-4"
                    >
                      {item.original ? (
                        <>
                          <p className="text-xs font-medium text-slate-500">
                            {ui.reportExpressionIntent}
                          </p>
                          <p className="mt-1 text-sm leading-relaxed text-slate-700">
                            {item.original}
                          </p>
                        </>
                      ) : null}
                      <p className="mt-3 text-xs font-medium text-slate-500">
                        {ui.reportExpressionUsed}
                      </p>
                      <p
                        className="mt-1 text-[15px] font-medium leading-relaxed text-slate-900"
                        translate="no"
                      >
                        {item.used}
                      </p>
                      {extras ? (
                        <div className="mt-3 space-y-3 border-t border-blue-100 pt-3">
                          {item.simpler ? (
                            <div>
                              <p className="text-xs font-medium text-blue-800">
                                {ui.reportExpressionSimpler}
                              </p>
                              <p
                                className="mt-1 text-sm leading-relaxed text-slate-800"
                                translate="no"
                              >
                                {item.simpler}
                              </p>
                            </div>
                          ) : null}
                          {item.moreNative ? (
                            <div>
                              <p className="text-xs font-medium text-blue-800">
                                {ui.reportExpressionNative}
                              </p>
                              <p
                                className="mt-1 text-sm leading-relaxed text-slate-800"
                                translate="no"
                              >
                                {item.moreNative}
                              </p>
                            </div>
                          ) : null}
                          {item.analysis ? (
                            <div>
                              <p className="text-xs font-medium text-blue-800">
                                {ui.reportExpressionAnalysis}
                              </p>
                              <p className="mt-1 text-sm leading-relaxed text-slate-700">
                                {item.analysis}
                              </p>
                            </div>
                          ) : null}
                        </div>
                      ) : null}
                    </article>
                  );
                })}
              </div>
            </section>
          ) : null}

          <section className="mt-12 pb-12">
            <h2 className="text-sm font-semibold text-slate-900">
              {ui.reportTimelineTitle}
            </h2>
            <div className="mt-4">
              <SessionChatReplay messages={report.messages} ui={ui} />
            </div>
          </section>
        </article>
      </div>
    </div>
  );
}
