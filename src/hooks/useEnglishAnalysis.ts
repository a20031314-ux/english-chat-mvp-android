"use client";

import { useCallback, useRef, useState } from "react";
import type { Locale } from "@/lib/copy";
import type {
  EnglishAnalysisTarget,
  EnglishElementAnalysis,
} from "@/lib/englishAnalysis";
import { analyzeEnglishElement } from "@/lib/englishAnalysisService";

export type EnglishAnalysisFrame = {
  id: number;
  target: EnglishAnalysisTarget;
  analysis: EnglishElementAnalysis | null;
  isLoading: boolean;
  failed: boolean;
};

export function useEnglishAnalysis(locale: Locale) {
  const [stack, setStack] = useState<EnglishAnalysisFrame[]>([]);
  const idRef = useRef(0);

  const close = useCallback(() => {
    idRef.current += 1;
    setStack([]);
  }, []);

  const back = useCallback(() => {
    idRef.current += 1;
    setStack((prev) => prev.slice(0, -1));
  }, []);

  const open = useCallback(
    async (next: EnglishAnalysisTarget) => {
      const selectedText = next.selectedText.replace(/\s+/g, " ").trim();
      const contextSentence = next.contextSentence.replace(/\s+/g, " ").trim();
      if (!selectedText || !contextSentence) return;

      const id = idRef.current + 1;
      idRef.current = id;
      const target = { ...next, selectedText, contextSentence };
      setStack((prev) => [
        ...prev.slice(-19),
        {
          id,
          target,
          analysis: null,
          isLoading: true,
          failed: false,
        },
      ]);
      try {
        const analysis = await analyzeEnglishElement({
          selectedText,
          contextSentence,
          locale,
          context: next.context,
          sourceType: next.sourceType,
          language: next.language,
          learnerLevel: next.learnerLevel,
        });
        if (idRef.current !== id) return;
        setStack((prev) =>
          prev.map((frame) =>
            frame.id === id
              ? {
                  ...frame,
                  analysis,
                  isLoading: false,
                  failed: !analysis,
                }
              : frame,
          ),
        );
      } catch {
        if (idRef.current !== id) return;
        setStack((prev) =>
          prev.map((frame) =>
            frame.id === id
              ? { ...frame, analysis: null, isLoading: false, failed: true }
              : frame,
          ),
        );
      }
    },
    [locale],
  );

  return {
    current: stack[stack.length - 1] ?? null,
    depth: stack.length,
    open,
    back,
    close,
  };
}
