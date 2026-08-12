"use client";

import { useMemo, useState } from "react";
import type { Locale, UICopy } from "@/lib/copy";
import {
  canGoNextMonth,
  formatYearMonthLabel,
  getCurrentYearMonth,
  getEarliestYearMonth,
  getMonthlyLearningStats,
  getReportsByMonth,
  shiftYearMonth,
  type YearMonth,
} from "@/lib/monthlyReports";
import { formatReportDate, type SessionReport } from "@/lib/sessionReports";

/** Compact monthly explorer for the sidebar — opens full page for detail. */
type MonthlyReportPanelProps = {
  reports: SessionReport[];
  locale: Locale;
  ui: UICopy;
  onOpenMonthly: (ym: YearMonth) => void;
  onOpenReport: (report: SessionReport) => void;
};

export function MonthlyReportPanel({
  reports,
  locale,
  ui,
  onOpenMonthly,
  onOpenReport,
}: MonthlyReportPanelProps) {
  const currentYm = getCurrentYearMonth();
  const earliestYm = getEarliestYearMonth(reports, currentYm);
  const [ym, setYm] = useState<YearMonth>(currentYm);

  const monthReports = useMemo(
    () => getReportsByMonth(reports, ym.year, ym.month),
    [reports, ym.year, ym.month],
  );
  const stats = useMemo(
    () => getMonthlyLearningStats(monthReports),
    [monthReports],
  );

  const canPrev =
    ym.year > earliestYm.year ||
    (ym.year === earliestYm.year && ym.month > earliestYm.month);
  const canNext = canGoNextMonth(ym);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => canPrev && setYm((p) => shiftYearMonth(p, -1))}
          disabled={!canPrev}
          className="rounded-md border border-slate-300 px-2 py-1 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-40"
        >
          ‹
        </button>
        <p className="text-sm font-semibold text-slate-900">
          {formatYearMonthLabel(ym, locale)}
        </p>
        <button
          type="button"
          onClick={() => canNext && setYm((p) => shiftYearMonth(p, 1))}
          disabled={!canNext}
          className="rounded-md border border-slate-300 px-2 py-1 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-40"
        >
          ›
        </button>
      </div>

      {monthReports.length === 0 ? (
        <p className="rounded-lg border border-dashed border-slate-300 p-3 text-xs leading-relaxed text-slate-600">
          {ui.monthlyEmpty}
        </p>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2 py-2.5 text-center">
            <div>
              <p className="text-[9px] text-slate-500">{ui.monthlyCurrentScore}</p>
              <p className="mt-0.5 text-sm font-semibold tabular-nums text-slate-900">
                {stats.currentScore ?? "—"}
              </p>
            </div>
            <div>
              <p className="text-[9px] text-slate-500">{ui.monthlyChange}</p>
              <p className="mt-0.5 text-sm font-semibold tabular-nums text-slate-900">
                {stats.averageScore ?? "—"}
              </p>
            </div>
            <div>
              <p className="text-[9px] text-slate-500">{ui.monthlySessions}</p>
              <p className="mt-0.5 text-sm font-semibold tabular-nums text-slate-900">
                {stats.sessionCount}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onOpenMonthly(ym)}
            className="w-full rounded-lg bg-slate-900 px-3 py-2 text-xs font-medium text-white hover:bg-slate-800"
          >
            {ui.monthlyOpenFull}
          </button>

          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-700">
              {ui.monthlyListTitle}
            </p>
            {monthReports.slice(0, 6).map((report) => (
              <button
                key={report.id}
                type="button"
                onClick={() => onOpenReport(report)}
                className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-left text-xs hover:bg-slate-50"
              >
                <p className="font-medium text-slate-900">{report.title}</p>
                <p className="mt-1 text-slate-500">
                  {formatReportDate(report.endedAt, locale)}
                  {report.score != null
                    ? ` · ${ui.reportScoreLabel.replace("{score}", String(report.score))}`
                    : ""}
                </p>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
