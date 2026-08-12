"use client";

import { useEffect, useMemo, useState } from "react";
import type { Locale, UICopy } from "@/lib/copy";
import {
  canGoNextMonth,
  formatYearMonthLabel,
  getCurrentYearMonth,
  getEarliestYearMonth,
  getMonthlyLearningStats,
  getReportsByMonth,
  getValidScoredReports,
  groupReportsByDay,
  shiftYearMonth,
  type YearMonth,
} from "@/lib/monthlyReports";
import { formatReportDate, type SessionReport } from "@/lib/sessionReports";
import { LearningCalendar } from "./LearningCalendar";
import { MonthlyGrowthChart } from "./MonthlyGrowthChart";

type MonthlyReportPageProps = {
  reports: SessionReport[];
  locale: Locale;
  ui: UICopy;
  initialYm?: YearMonth;
  onBack: () => void;
  onOpenReport: (report: SessionReport, ym: YearMonth) => void;
  /** When true, hide the top back control (e.g. already inside a home tab). */
  hideBack?: boolean;
  backLabel?: string;
};

export function MonthlyReportPage({
  reports,
  locale,
  ui,
  initialYm,
  onBack,
  onOpenReport,
  hideBack = false,
  backLabel,
}: MonthlyReportPageProps) {
  const currentYm = getCurrentYearMonth();
  const earliestYm = getEarliestYearMonth(reports, currentYm);
  const [ym, setYm] = useState<YearMonth>(initialYm ?? currentYm);
  const [selectedDayKey, setSelectedDayKey] = useState<string | null>(null);
  const [dayReports, setDayReports] = useState<SessionReport[]>([]);

  const monthReports = useMemo(
    () => getReportsByMonth(reports, ym.year, ym.month),
    [reports, ym.year, ym.month],
  );
  const reportsByDay = useMemo(
    () => groupReportsByDay(monthReports),
    [monthReports],
  );
  const scoredPoints = useMemo(
    () => getValidScoredReports(monthReports),
    [monthReports],
  );
  const stats = useMemo(
    () => getMonthlyLearningStats(monthReports),
    [monthReports],
  );

  useEffect(() => {
    setSelectedDayKey(null);
    setDayReports([]);
  }, [ym.year, ym.month]);

  const canPrev =
    ym.year > earliestYm.year ||
    (ym.year === earliestYm.year && ym.month > earliestYm.month);
  const canNext = canGoNextMonth(ym);

  const growthTitle = ui.monthlyGrowthTitle.replace(
    "{month}",
    formatYearMonthLabel(ym, locale),
  );

  const handleSelectDay = (dayKey: string, list: SessionReport[]) => {
    if (list.length === 1) {
      onOpenReport(list[0], ym);
      return;
    }
    setSelectedDayKey(dayKey);
    setDayReports(list);
  };

  return (
    <div className="flex h-full min-h-0 flex-col bg-white">
      {!hideBack ? (
        <header className="shrink-0 border-b border-slate-200 px-4 py-3 sm:px-6">
          <button
            type="button"
            onClick={onBack}
            className="rounded-md px-1 py-1 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            {backLabel ?? ui.reportBack}
          </button>
        </header>
      ) : null}

      <div className="min-h-0 flex-1 overflow-y-auto">
        <article className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-8 sm:py-8">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => canPrev && setYm((p) => shiftYearMonth(p, -1))}
              disabled={!canPrev}
              className="rounded-md border border-slate-300 px-2.5 py-1 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-40"
            >
              ‹
            </button>
            <h1 className="text-center text-lg font-semibold text-slate-900 sm:text-xl">
              {formatYearMonthLabel(ym, locale)}
            </h1>
            <button
              type="button"
              onClick={() => canNext && setYm((p) => shiftYearMonth(p, 1))}
              disabled={!canNext}
              className="rounded-md border border-slate-300 px-2.5 py-1 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-40"
            >
              ›
            </button>
          </div>
          <p className="mt-2 text-center text-sm text-slate-500">{growthTitle}</p>

          {monthReports.length === 0 ? (
            <p className="mt-8 whitespace-pre-line border border-dashed border-slate-200 px-4 py-8 text-center text-sm leading-relaxed text-slate-600">
              {ui.monthlyEmpty}
            </p>
          ) : (
            <>
              <section className="mt-8 grid grid-cols-3 gap-3 border-y border-slate-100 py-6 text-center">
                <div>
                  <p className="text-xs text-slate-500">{ui.monthlyCurrentScore}</p>
                  <p className="mt-2 text-3xl font-semibold tabular-nums text-slate-900">
                    {stats.currentScore != null ? stats.currentScore : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">{ui.monthlyChange}</p>
                  <p className="mt-2 text-3xl font-semibold tabular-nums text-slate-900">
                    {stats.averageScore != null ? stats.averageScore : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">{ui.monthlySessions}</p>
                  <p className="mt-2 text-3xl font-semibold tabular-nums text-slate-900">
                    {ui.monthlySessionCount.replace(
                      "{count}",
                      String(stats.sessionCount),
                    )}
                  </p>
                </div>
              </section>

              <section className="mt-8">
                <MonthlyGrowthChart
                  points={scoredPoints}
                  selectedReportId={null}
                  onSelectPoint={(point) => onOpenReport(point.report, ym)}
                  emptyLabel={ui.monthlyChartNoScores}
                  singlePointHint={ui.monthlyNeedMoreForTrend}
                  title={ui.monthlyChartTitle}
                />
                {scoredPoints.length > 1 ? (
                  <p className="mt-2 text-center text-xs text-slate-400">
                    {ui.monthlyChartTapHint}
                  </p>
                ) : null}
              </section>
            </>
          )}

          <section className="mt-10">
            <LearningCalendar
              ym={ym}
              locale={locale}
              reportsByDay={reportsByDay}
              selectedDayKey={selectedDayKey}
              onSelectDay={handleSelectDay}
            />
            <p className="mt-2 text-center text-xs text-slate-500">
              {ui.monthlyCalendarHint}
            </p>
          </section>

          {selectedDayKey && dayReports.length > 1 ? (
            <section className="mt-8 pb-10">
              <h2 className="text-sm font-semibold text-slate-900">
                {ui.monthlyDayReportsTitle}
              </h2>
              <ul className="mt-4 divide-y divide-slate-100">
                {dayReports.map((report) => (
                  <li key={report.id} className="py-4">
                    <button
                      type="button"
                      onClick={() => onOpenReport(report, ym)}
                      className="w-full text-left"
                    >
                      <p className="text-xs text-slate-500">
                        {formatReportDate(report.endedAt, locale)}
                        {report.score != null
                          ? ` · ${ui.reportScoreLabel.replace("{score}", String(report.score))}`
                          : ` · ${ui.monthlyNoScore}`}
                      </p>
                      <p className="mt-1 text-sm font-medium text-slate-900">
                        {report.title}
                      </p>
                      <p className="mt-2 text-xs font-medium text-teal-800">
                        {ui.reportViewCta} →
                      </p>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </article>
      </div>
    </div>
  );
}
