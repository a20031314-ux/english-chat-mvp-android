"use client";

import { useMemo, type ReactNode } from "react";
import { EnglishAnalysisViewer } from "@/components/EnglishAnalysisViewer";
import { EnglishAnalysisContext } from "@/contexts/EnglishAnalysisContext";
import { useEnglishAnalysis } from "@/hooks/useEnglishAnalysis";
import type { Locale, UICopy } from "@/lib/copy";

export function EnglishAnalysisProvider({
  locale,
  ui,
  children,
}: {
  locale: Locale;
  ui: UICopy;
  children: ReactNode;
}) {
  const analysis = useEnglishAnalysis(locale);
  const value = useMemo(
    () => ({ open: analysis.open, isOpen: analysis.depth > 0 }),
    [analysis.open, analysis.depth],
  );

  return (
    <EnglishAnalysisContext.Provider value={value}>
      {children}
      {analysis.current ? (
        <EnglishAnalysisViewer
          frame={analysis.current}
          canGoBack={analysis.depth > 1}
          ui={ui}
          onBack={analysis.back}
          onClose={analysis.close}
        />
      ) : null}
    </EnglishAnalysisContext.Provider>
  );
}
