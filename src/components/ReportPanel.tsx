"use client";

import { useEffect, useState } from "react";
import type { UICopy } from "@/lib/copy";
import type { Locale } from "@/lib/copy";
import type { YearMonth } from "@/lib/monthlyReports";
import {
  formatReportDate,
  type SessionReport,
} from "@/lib/sessionReports";
import { MonthlyReportPanel } from "./MonthlyReportPanel";

type ReportTab = "sessions" | "monthly";

type ReportPanelProps = {
  isOpen: boolean;
  reports: SessionReport[];
  locale: Locale;
  ui: UICopy;
  onClose: () => void;
  onDeleteReport: (id: string) => void;
  onClearReports: () => void;
  onOpenReport: (report: SessionReport) => void;
  onOpenMonthly: (ym: YearMonth) => void;
};

export function ReportPanel({
  isOpen,
  reports,
  locale,
  ui,
  onClose,
  onDeleteReport,
  onClearReports,
  onOpenReport,
  onOpenMonthly,
}: ReportPanelProps) {
  const [tab, setTab] = useState<ReportTab>("sessions");

  useEffect(() => {
    if (!isOpen || typeof document === "undefined") {
      return;
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-200 ${
        isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <button
        type="button"
        aria-label="Close sidebar backdrop"
        onClick={onClose}
        className="absolute inset-0 bg-black/50 transition-opacity duration-300"
      />
      <aside
        className={`absolute left-0 top-0 h-full w-[88%] max-w-sm overflow-y-auto border-r border-slate-200 bg-white p-4 shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <header className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900">
            {ui.reportMenuTitle}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-700 hover:bg-slate-50"
          >
            {ui.closeArchive}
          </button>
        </header>

        <div className="mb-4 flex rounded-lg border border-slate-200 bg-slate-50 p-0.5">
          <button
            type="button"
            onClick={() => setTab("sessions")}
            className={`flex-1 rounded-md px-2 py-1.5 text-xs font-medium transition ${
              tab === "sessions"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {ui.reportSessionsTab}
          </button>
          <button
            type="button"
            onClick={() => setTab("monthly")}
            className={`flex-1 rounded-md px-2 py-1.5 text-xs font-medium transition ${
              tab === "monthly"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {ui.reportMonthlyTab}
          </button>
        </div>

        {tab === "monthly" ? (
          <MonthlyReportPanel
            reports={reports}
            locale={locale}
            ui={ui}
            onOpenMonthly={onOpenMonthly}
            onOpenReport={onOpenReport}
          />
        ) : (
          <section>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-800">
                {ui.reportListTitle}
              </h3>
              {reports.length > 0 ? (
                <button
                  type="button"
                  onClick={onClearReports}
                  className="rounded-md border border-rose-200 bg-rose-50 px-2 py-1 text-[11px] text-rose-700 hover:bg-rose-100"
                >
                  {ui.reportClearAll}
                </button>
              ) : null}
            </div>

            {reports.length === 0 ? (
              <p className="rounded-lg border border-dashed border-slate-300 p-3 text-xs leading-relaxed text-slate-600">
                {ui.reportListEmpty}
              </p>
            ) : (
              <div className="space-y-2">
                {reports.map((report) => (
                  <article
                    key={report.id}
                    className="rounded-lg border border-slate-200 bg-white p-3 text-xs"
                  >
                    <button
                      type="button"
                      onClick={() => onOpenReport(report)}
                      className="w-full text-left"
                    >
                      <p className="font-medium leading-snug text-slate-900">
                        {report.title}
                      </p>
                      <p className="mt-1.5 text-slate-500">
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
                        onClick={() => onOpenReport(report)}
                        className="rounded-md border border-slate-300 bg-white px-2 py-1 text-[11px] text-slate-700 hover:bg-slate-100"
                      >
                        {ui.reportViewCta}
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteReport(report.id)}
                        className="rounded-md border border-slate-300 bg-white px-2 py-1 text-[11px] text-slate-700 hover:bg-slate-100"
                      >
                        {ui.delete}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}
      </aside>
    </div>
  );
}
