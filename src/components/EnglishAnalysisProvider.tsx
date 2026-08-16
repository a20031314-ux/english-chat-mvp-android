"use client";

import { useMemo, type ReactNode } from "react";
import { EnglishAnalysisViewer } from "@/components/EnglishAnalysisViewer";
import { VocabPreviewProvider } from "@/components/VocabPreviewProvider";
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
    () => ({
      open: analysis.open,
      isOpen: Boolean(analysis.session),
    }),
    [analysis.open, analysis.session],
  );

  return (
    <EnglishAnalysisContext.Provider value={value}>
      <VocabPreviewProvider
        locale={locale}
        ui={ui}
        hideOverlay={Boolean(analysis.session)}
      >
        {children}
        {analysis.session ? (
          <EnglishAnalysisViewer
            session={analysis.session}
            ui={ui}
            onTab={analysis.setTab}
            onRange={analysis.setRange}
            onAnalyzeRange={analysis.analyzeRange}
            onClose={analysis.close}
          />
        ) : null}
      </VocabPreviewProvider>
    </EnglishAnalysisContext.Provider>
  );
}
