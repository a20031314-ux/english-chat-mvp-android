"use client";

import { useEffect, useState } from "react";
import type { Locale, UICopy } from "@/lib/copy";
import {
  clearSessionReports,
  deleteSessionReport,
  formatReportDate,
  loadSessionReports,
  type SessionReport,
} from "@/lib/sessionReports";
import { SessionReportView } from "./SessionReportView";

type SessionReportsTabProps = {
  locale: Locale;
  ui: UICopy;
  initialReportId?: string | null;
  onInitialReportConsumed?: () => void;
  onBackToHome?: () => void;
};

export function SessionReportsTab({
  locale,
  ui,
  initialReportId,
  onInitialReportConsumed,
  onBackToHome,
}: SessionReportsTabProps) {
  const [reports, setReports] = useState<SessionReport[]>([]);
  const [activeReport, setActiveReport] = useState<SessionReport | null>(null);

  const refresh = () => setReports(loadSessionReports());

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    if (!initialReportId) return;
    const report =
      loadSessionReports().find((r) => r.id === initialReportId) ?? null;
    if (report) {
      setReports(loadSessionReports());
      setActiveReport(report);
    }
    onInitialReportConsumed?.();
  }, [initialReportId, onInitialReportConsumed]);

  if (activeReport) {
    return (
      <div className="h-full min-h-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
        <SessionReportView
          key={activeReport.id}
          report={activeReport}
          ui={ui}
          locale={locale}
          onBack={() => {
            setActiveReport(null);
            refresh();
          }}
        />
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
      <header className="shrink-0 border-b border-slate-200 px-4 py-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            {onBackToHome ? (
              <button
                type="button"
                onClick={onBackToHome}
                className="shrink-0 rounded-md px-1 py-1 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                {ui.homeBack}
              </button>
            ) : null}
            <h1 className="truncate text-base font-semibold text-slate-900">
              {ui.reportListTitle}
            </h1>
          </div>
          {reports.length > 0 ? (
            <button
              type="button"
              onClick={() => {
                clearSessionReports();
                setReports([]);
              }}
              className="rounded-md border border-rose-200 bg-rose-50 px-2 py-1 text-[11px] text-rose-700 hover:bg-rose-100"
            >
              {ui.reportClearAll}
            </button>
          ) : null}
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        {reports.length === 0 ? (
          <p className="rounded-lg border border-dashed border-slate-300 p-4 text-sm leading-relaxed text-slate-600">
            {ui.reportListEmpty}
          </p>
        ) : (
          <div className="space-y-2">
            {reports.map((report) => (
              <article
                key={report.id}
                className="rounded-lg border border-slate-200 bg-white p-3 text-sm"
              >
                <button
                  type="button"
                  onClick={() => setActiveReport(report)}
                  className="w-full text-left"
                >
                  <p className="font-medium leading-snug text-slate-900">
                    {report.title}
                  </p>
                  <p className="mt-1.5 text-xs text-slate-500">
                    {formatReportDate(report.endedAt, locale)}
                    {" · "}
                    {ui.reportTurnCount.replace(
                      "{count}",
                      String(report.messageCount),
                    )}
                    {report.score != null
                      ? ` · ${ui.reportScoreLabel.replace("{score}", String(report.score))}`
                      : ""}
                  </p>
                </button>
                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveReport(report)}
                    className="rounded-md border border-slate-300 bg-white px-2 py-1 text-[11px] text-slate-700 hover:bg-slate-100"
                  >
                    {ui.reportViewCta}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      deleteSessionReport(report.id);
                      refresh();
                    }}
                    className="rounded-md border border-slate-300 bg-white px-2 py-1 text-[11px] text-slate-700 hover:bg-slate-100"
                  >
                    {ui.delete}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
