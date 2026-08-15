"use client";

import { useMemo } from "react";
import { useLearningLanguageOptional } from "@/contexts/LearningLanguageContext";
import type { Locale, UICopy } from "@/lib/copy";
import { DEFAULT_LEARNING_LANGUAGE_CODE } from "@/lib/learningLanguages";
import { resolveUiCopy } from "@/lib/resolveUiCopy";

/** UI copy with `{targetLanguage}` resolved to the current learning language. */
export function useUiCopy(locale: Locale): UICopy {
  const learning = useLearningLanguageOptional();
  const targetLanguage =
    learning?.targetLanguage ?? DEFAULT_LEARNING_LANGUAGE_CODE;
  return useMemo(
    () => resolveUiCopy(locale, targetLanguage),
    [locale, targetLanguage],
  );
}
