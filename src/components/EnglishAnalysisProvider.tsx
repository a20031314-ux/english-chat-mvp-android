"use client";

import { useEffect, useMemo, useRef, type ReactNode } from "react";
import { EnglishAnalysisViewer } from "@/components/EnglishAnalysisViewer";
import { VocabPreviewProvider } from "@/components/VocabPreviewProvider";
import { EnglishAnalysisContext } from "@/contexts/EnglishAnalysisContext";
import { useLearningLanguageOptional } from "@/contexts/LearningLanguageContext";
import { useEnglishAnalysis } from "@/hooks/useEnglishAnalysis";
import { rememberEnglishAnalysis } from "@/lib/englishAnalysisRecent";
import { analysisTargetFromSelectedText } from "@/lib/genericWebReader";
import { DEFAULT_LEARNING_LANGUAGE_CODE } from "@/lib/learningLanguages";
import type { Locale, UICopy } from "@/lib/copy";
import { WebReader } from "@/plugins/webReader";

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
  const learningLanguage = useLearningLanguageOptional();
  const targetLanguage =
    learningLanguage?.targetLanguage ?? DEFAULT_LEARNING_LANGUAGE_CODE;
  const openAnalysis = analysis.open;
  const lastOpenedRef = useRef({ text: "", at: 0 });
  const value = useMemo(
    () => ({
      open: analysis.open,
      isOpen: Boolean(analysis.session),
    }),
    [analysis.open, analysis.session],
  );

  useEffect(() => {
    let cancelled = false;
    let handle: { remove: () => Promise<void> } | null = null;

    const openCaptured = (raw: string | undefined) => {
      const target = analysisTargetFromSelectedText(raw || "", {
        language: targetLanguage,
      });
      if (!target || cancelled) return;
      const now = Date.now();
      if (
        target.selectedText === lastOpenedRef.current.text &&
        now - lastOpenedRef.current.at < 2000
      ) {
        return;
      }
      lastOpenedRef.current = { text: target.selectedText, at: now };
      rememberEnglishAnalysis({ input: target.contextSentence });
      openAnalysis(target);
    };

    void WebReader.addListener("captureText", (payload) => {
      openCaptured(payload.text);
    }).then((next) => {
      if (cancelled) {
        void next.remove();
        return;
      }
      handle = next;
    });
    void WebReader.takePendingText()
      .then((result) => {
        if (!cancelled) openCaptured(result.text);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
      if (handle) void handle.remove();
    };
  }, [openAnalysis, targetLanguage]);

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
            locale={locale}
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
