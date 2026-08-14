"use client";

import { useCallback, useRef, useState } from "react";
import type { Locale } from "@/lib/copy";
import type { ExpressionInsight } from "@/lib/expressionInsight";
import { selectionFitsSentence } from "@/lib/expressionInsight";
import { requestExpressionInsight } from "@/lib/requestExpressionInsight";

export type InsightTarget = {
  sentence: string;
  selected: string;
  context?: string[];
};

type InsightFrame = {
  id: number;
  target: InsightTarget;
  insight: ExpressionInsight | null;
  isLoading: boolean;
  failed: boolean;
};

export function useExpressionInsight(locale: Locale) {
  const [frame, setFrame] = useState<InsightFrame | null>(null);
  const idRef = useRef(0);

  const close = useCallback(() => {
    idRef.current += 1;
    setFrame(null);
  }, []);

  const open = useCallback(
    async (next: InsightTarget) => {
      const selected = next.selected.replace(/\s+/g, " ").trim();
      const sentence = next.sentence.replace(/\s+/g, " ").trim();
      if (!selectionFitsSentence(sentence, selected)) return;

      const id = idRef.current + 1;
      idRef.current = id;
      setFrame({
        id,
        target: { ...next, sentence, selected },
        insight: null,
        isLoading: true,
        failed: false,
      });
      try {
        const result = await requestExpressionInsight({
          sentence,
          selected,
          locale,
          context: next.context,
        });
        if (idRef.current !== id) return;
        setFrame({
          id,
          target: { ...next, sentence, selected },
          insight: result,
          isLoading: false,
          failed: !result,
        });
      } catch {
        if (idRef.current !== id) return;
        setFrame({
          id,
          target: { ...next, sentence, selected },
          insight: null,
          isLoading: false,
          failed: true,
        });
      }
    },
    [locale],
  );

  return {
    current: frame,
    open,
    close,
  };
}
