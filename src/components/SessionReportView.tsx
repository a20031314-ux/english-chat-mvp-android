"use client";

import { useEffect, useMemo, useState } from "react";
import type { Locale, UICopy } from "@/lib/copy";
import {
  analysisNeedsLearnerRefresh,
  CONVERSATION_ANALYSIS_VERSION,
  extractAnalysisTurns,
  getConversationAnalysis,
  hasConversationAnalysisContent,
  type AnalysisCategory,
  type ConversationAnalysis,
  type ConversationInsight,
} from "@/lib/conversationAnalysis";
import { requestConversationAnalysis } from "@/lib/requestConversationAnalysis";
import {
  countGrammarCorrections,
  formatReportDate,
  getReportScoreBreakdown,
  getSessionReport,
  saveSessionReport,
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

function categoryLabel(category: AnalysisCategory, ui: UICopy): string {
  switch (category) {
    case "NATURAL":
      return ui.reportAnalysisCategoryNatural;
    case "NUANCE":
      return ui.reportAnalysisCategoryNuance;
    case "WORD_CHOICE":
      return ui.reportAnalysisCategoryWordChoice;
    case "TONE":
      return ui.reportAnalysisCategoryTone;
    case "FLOW":
      return ui.reportAnalysisCategoryFlow;
    case "VARIETY":
      return ui.reportAnalysisCategoryVariety;
    case "CONNECTION":
      return ui.reportAnalysisCategoryConnection;
    case "EXPRESSION":
      return ui.reportAnalysisCategoryExpression;
    case "CONVERSATION":
      return ui.reportAnalysisCategoryConversation;
    default:
      return ui.reportAnalysisCategoryImprovement;
  }
}

function InsightCard({
  item,
  ui,
}: {
  item: ConversationInsight;
  ui: UICopy;
}) {
  const positive = item.sentiment === "positive";
  return (
    <article
      className={
        positive
          ? "rounded-2xl border border-emerald-100 bg-emerald-50/50 px-4 py-4"
          : "rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4"
      }
    >
      <p
        className={
          positive
            ? "text-[11px] font-semibold uppercase tracking-wide text-emerald-800"
            : "text-[11px] font-semibold uppercase tracking-wide text-slate-500"
        }
      >
        {categoryLabel(item.category, ui)}
      </p>
      <h3 className="mt-1.5 text-sm font-semibold text-slate-900">
        {item.title}
      </h3>
      {item.evidence ? (
        <p
          className="mt-3 border-l-2 border-slate-300 pl-3 text-[13px] leading-relaxed text-slate-600"
          translate="no"
        >
          “{item.evidence}”
        </p>
      ) : null}
      <p className="mt-3 text-sm leading-relaxed text-slate-600">
        {item.analysis}
      </p>
      {item.suggestion ? (
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          {item.suggestion}
        </p>
      ) : null}
      {item.example ? (
        <p
          className="mt-2 text-[13px] leading-relaxed text-slate-800"
          translate="no"
        >
          “{item.example}”
        </p>
      ) : null}
    </article>
  );
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
  const [analysis, setAnalysis] = useState<ConversationAnalysis>(() =>
    getConversationAnalysis(
      report.messages,
      locale,
      report.conversationAnalysis,
    ),
  );

  useEffect(() => {
    const latest = getSessionReport(report.id) ?? report;
    const stored = latest.conversationAnalysis;
    const turns = extractAnalysisTurns(report.messages);
    const display = getConversationAnalysis(
      report.messages,
      locale,
      stored,
    );
    setAnalysis(display);

    const stale =
      (latest.conversationAnalysisVersion ?? 0) <
        CONVERSATION_ANALYSIS_VERSION ||
      Boolean(stored && analysisNeedsLearnerRefresh(stored, turns));

    if (stored && stale) {
      saveSessionReport({
        ...latest,
        conversationAnalysis: display,
      });
    }
    if (!stale) return;

    let cancelled = false;
    void requestConversationAnalysis(report.messages, locale).then((ai) => {
      if (cancelled || !ai) return;
      if (analysisNeedsLearnerRefresh(ai, turns)) return;
      setAnalysis(ai);
      saveSessionReport({
        ...latest,
        conversationAnalysis: ai,
        conversationAnalysisVersion: CONVERSATION_ANALYSIS_VERSION,
      });
    });

    return () => {
      cancelled = true;
    };
  }, [report, locale]);

  const showAnalysis = hasConversationAnalysisContent(analysis);

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

          <section className="mt-12">
            <h2 className="text-sm font-semibold text-slate-900">
              {ui.reportTimelineTitle}
            </h2>
            <div className="mt-4">
              <SessionChatReplay messages={report.messages} ui={ui} />
            </div>
          </section>

          <section className="mt-14 border-t border-slate-100 pb-12 pt-10">
            <h2 className="text-sm font-semibold text-slate-900">
              {ui.reportAnalysisTitle}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              {ui.reportAnalysisHint}
            </p>

            {!showAnalysis ? (
              <p className="mt-4 text-sm leading-relaxed text-slate-600">
                {ui.reportAnalysisEmpty}
              </p>
            ) : (
              <div className="mt-6 space-y-4">
                {analysis.shortConversationNote ? (
                  <p className="text-sm leading-relaxed text-slate-600">
                    {analysis.shortConversationNote}
                  </p>
                ) : null}

                {analysis.insights.map((item) => (
                  <InsightCard
                    key={`${item.category}-${item.title}-${item.evidence || ""}`}
                    item={item}
                    ui={ui}
                  />
                ))}

                {analysis.nextGoal ? (
                  <article className="rounded-2xl border border-slate-900/10 bg-slate-900 px-4 py-4 text-white">
                    <h3 className="text-[11px] font-semibold uppercase tracking-wide text-slate-300">
                      {ui.reportAnalysisNextGoalTitle}
                    </h3>
                    <p className="mt-2 text-[15px] font-medium leading-relaxed">
                      {analysis.nextGoal.title}
                    </p>
                    {analysis.nextGoal.body &&
                    analysis.nextGoal.body !== analysis.nextGoal.title ? (
                      <p className="mt-2 text-sm leading-relaxed text-slate-300">
                        {analysis.nextGoal.body}
                      </p>
                    ) : null}
                    {analysis.nextGoal.pattern ? (
                      <p className="mt-3 text-[13px] text-slate-200" translate="no">
                        {analysis.nextGoal.pattern}
                      </p>
                    ) : null}
                    {analysis.nextGoal.example ? (
                      <p
                        className="mt-2 text-[13px] leading-relaxed text-white"
                        translate="no"
                      >
                        “{analysis.nextGoal.example}”
                      </p>
                    ) : null}
                  </article>
                ) : null}
              </div>
            )}
          </section>
        </article>
      </div>
    </div>
  );
}
