"use client";

import { createContext, useContext } from "react";
import type { InsightTarget } from "@/hooks/useExpressionInsight";

export type ExpressionInsightContextValue = {
  open: (target: InsightTarget) => void;
  analyzeLabel: string;
};

export const ExpressionInsightContext =
  createContext<ExpressionInsightContextValue | null>(null);

export function useExpressionInsightOptional() {
  return useContext(ExpressionInsightContext);
}
