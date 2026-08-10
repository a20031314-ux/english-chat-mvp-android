"use client";

import { useEffect, useState } from "react";
import { LanguageSelector } from "@/components/LanguageSelector";
import type { Locale, UICopy } from "@/lib/copy";
import { getCurrentYearMonth, type YearMonth } from "@/lib/monthlyReports";
import {
  loadSessionReports,
  type SessionReport,
} from "@/lib/sessionReports";
import { MonthlyReportPage } from "./MonthlyReportPage";
import { SessionReportView } from "./SessionReportView";

type ReportsTabProps = {
  locale: Locale;
  ui: UICopy;
  onLocaleChange: (locale: Locale) => void;
  initialReportId?: string | null;
  onInitialReportConsumed?: () => void;
};

export function ReportsTab({
  locale,
  ui,
  onLocaleChange,
  initialReportId,
  onInitialReportConsumed,
}: ReportsTabProps) {
  const [reports, setReports] = useState<SessionReport[]>([]);
  const [activeReport, setActiveReport] = useState<SessionReport | null>(null);
  const [returnYm, setReturnYm] = useState<YearMonth>(() =>
    getCurrentYearMonth(),
  );

  const refresh = () => setReports(loadSessionReports());

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    if (!initialReportId) return;
    const report =
      loadSessionReports().find((r) => r.id === initialReportId) ?? null;
    if (report) {
      setActiveReport(report);
      const d = new Date(report.endedAt);
      setReturnYm({ year: d.getFullYear(), month: d.getMonth() + 1 });
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
      <header className="flex shrink-0 items-center justify-between gap-2 border-b border-slate-200 px-4 py-3">
        <h1 className="text-base font-semibold text-slate-900">
          {ui.homeTabReports}
        </h1>
        <LanguageSelector locale={locale} onChange={onLocaleChange} />
      </header>
      <div className="min-h-0 flex-1 overflow-hidden">
        <MonthlyReportPage
          key={`${returnYm.year}-${returnYm.month}`}
          reports={reports}
          locale={locale}
          ui={ui}
          initialYm={returnYm}
          onBack={() => undefined}
          hideBack
          onOpenReport={(report, selectedYm) => {
            setReturnYm(selectedYm);
            setActiveReport(report);
          }}
        />
      </div>
    </div>
  );
}
