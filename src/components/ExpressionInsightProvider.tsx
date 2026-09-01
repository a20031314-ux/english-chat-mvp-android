"use client";

import { useMemo, type ReactNode } from "react";
import { ExpressionInsightSheet } from "@/components/ExpressionInsightSheet";
import { ExpressionInsightContext } from "@/contexts/ExpressionInsightContext";
import { useExpressionInsight } from "@/hooks/useExpressionInsight";
import type { Locale, UICopy } from "@/lib/copy";

export function ExpressionInsightProvider({
  locale,
  ui,
  children,
}: {
  locale: Locale;
  ui: UICopy;
  children: ReactNode;
}) {
  const insight = useExpressionInsight(locale);
  const value = useMemo(
    () => ({
      open: insight.open,
      analyzeLabel: ui.insightAnalyze,
    }),
    [insight.open, ui.insightAnalyze],
  );

  return (
    <ExpressionInsightContext.Provider value={value}>
      {children}
      {insight.current ? (
        <ExpressionInsightSheet
          sentence={insight.current.target.sentence}
          selected={insight.current.target.selected}
          locale={locale}
          insight={insight.current.insight}
          isLoading={insight.current.isLoading}
          failed={insight.current.failed}
          ui={ui}
          onClose={insight.close}
        />
      ) : null}
    </ExpressionInsightContext.Provider>
  );
}
