"use client";

import { useEffect, useState } from "react";
import type { Locale, UICopy } from "@/lib/copy";
import { getCurrentYearMonth, type YearMonth } from "@/lib/monthlyReports";
import {
  loadSessionReports,
  type SessionReport,
} from "@/lib/sessionReports";
import { MonthlyReportPage } from "./MonthlyReportPage";
import { SessionReportView } from "./SessionReportView";

type MonthlyReportsTabProps = {
  locale: Locale;
  ui: UICopy;
  onBackToHome?: () => void;
};

export function MonthlyReportsTab({
  locale,
  ui,
  onBackToHome,
}: MonthlyReportsTabProps) {
  const [reports, setReports] = useState<SessionReport[]>([]);
  const [activeReport, setActiveReport] = useState<SessionReport | null>(null);
  const [returnYm, setReturnYm] = useState<YearMonth>(() =>
    getCurrentYearMonth(),
  );

  useEffect(() => {
    setReports(loadSessionReports());
  }, []);

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
            setReports(loadSessionReports());
          }}
        />
      </div>
    );
  }

  return (
    <div className="h-full min-h-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
      <MonthlyReportPage
        key={`${returnYm.year}-${returnYm.month}`}
        reports={reports}
        locale={locale}
        ui={ui}
        initialYm={returnYm}
        onBack={onBackToHome ?? (() => undefined)}
        hideBack={!onBackToHome}
        backLabel={ui.homeBack}
        onOpenReport={(report, selectedYm) => {
          setReturnYm(selectedYm);
          setActiveReport(report);
        }}
      />
    </div>
  );
}
