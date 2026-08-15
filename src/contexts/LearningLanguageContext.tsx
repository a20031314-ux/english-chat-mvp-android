"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_LEARNING_LANGUAGE_CODE,
  getLearningLanguage,
  isLearningLanguageCode,
  persistTargetLanguage,
  readStoredTargetLanguage,
  type LearningLanguage,
  type LearningLanguageCode,
} from "@/lib/learningLanguages";

type LearningLanguageContextValue = {
  targetLanguage: LearningLanguageCode;
  targetLanguageInfo: LearningLanguage;
  setTargetLanguage: (code: LearningLanguageCode) => void;
};

const LearningLanguageContext =
  createContext<LearningLanguageContextValue | null>(null);

export function LearningLanguageProvider({ children }: { children: ReactNode }) {
  const [targetLanguage, setTargetLanguageState] =
    useState<LearningLanguageCode>(DEFAULT_LEARNING_LANGUAGE_CODE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setTargetLanguageState(readStoredTargetLanguage());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    persistTargetLanguage(targetLanguage);
  }, [targetLanguage, hydrated]);

  const setTargetLanguage = useCallback((code: LearningLanguageCode) => {
    if (!isLearningLanguageCode(code)) return;
    setTargetLanguageState(code);
  }, []);

  const value = useMemo<LearningLanguageContextValue>(
    () => ({
      targetLanguage,
      targetLanguageInfo: getLearningLanguage(targetLanguage),
      setTargetLanguage,
    }),
    [targetLanguage, setTargetLanguage],
  );

  return (
    <LearningLanguageContext.Provider value={value}>
      {children}
    </LearningLanguageContext.Provider>
  );
}

export function useLearningLanguage(): LearningLanguageContextValue {
  const ctx = useContext(LearningLanguageContext);
  if (!ctx) {
    throw new Error(
      "useLearningLanguage must be used within LearningLanguageProvider",
    );
  }
  return ctx;
}

export function useLearningLanguageOptional(): LearningLanguageContextValue | null {
  return useContext(LearningLanguageContext);
}
