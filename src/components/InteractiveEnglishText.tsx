"use client";

import { AnalyzableEnglish } from "@/components/AnalyzableEnglish";
import type { TranslationSourceType } from "@/lib/naturalTranslation";

/** Sentence text that shows save/analyze actions before opening analysis. */
export function InteractiveEnglishText({
  sentence,
  className = "",
  sourceType,
  language,
  translation,
}: {
  sentence: string;
  chunks?: unknown;
  className?: string;
  sourceType?: TranslationSourceType;
  language?: string;
  translation?: string;
}) {
  return (
    <AnalyzableEnglish
      sentence={sentence}
      className={className}
      sourceType={sourceType}
      language={language}
      translation={translation}
    />
  );
}
