"use client";

import { createContext, useContext } from "react";
import type { EnglishAnalysisTarget } from "@/lib/englishAnalysis";

export type EnglishAnalysisContextValue = {
  open: (target: EnglishAnalysisTarget) => void;
  isOpen: boolean;
};

export const EnglishAnalysisContext =
  createContext<EnglishAnalysisContextValue | null>(null);

export function useEnglishAnalysisOptional() {
  return useContext(EnglishAnalysisContext);
}
