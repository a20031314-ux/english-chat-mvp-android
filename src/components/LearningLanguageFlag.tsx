"use client";

import { useState } from "react";
import type { LearningLanguage } from "@/lib/learningLanguages";

type LearningLanguageFlagProps = {
  language: Pick<LearningLanguage, "flag" | "flagCountry" | "nativeLabel">;
  className?: string;
  /** 고르기 화면의 큰 국기(처음 실행·언어 설정). */
  big?: boolean;
};

/**
 * Country flag image (Windows-safe). Falls back to emoji if the image fails.
 */
export function LearningLanguageFlag({
  language,
  className = "",
  big = false,
}: LearningLanguageFlagProps) {
  const [failed, setFailed] = useState(false);
  const src = `/flags/${language.flagCountry}.png`;

  if (failed) {
    return (
      <span
        aria-hidden="true"
        className={`inline-flex shrink-0 items-center justify-center leading-none ${big ? "h-8 w-12 text-heading" : "h-3.5 w-[1.15rem] text-[11px]"} ${className}`.trim()}
      >
        {language.flag}
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      width={18}
      height={12}
      loading={big ? "eager" : "lazy"}
      decoding="async"
      aria-hidden="true"
      onError={() => setFailed(true)}
      className={`inline-block shrink-0 object-cover shadow-[0_0_0_1px_rgba(15,23,42,0.12)] ${big ? "h-8 w-12 rounded-lg" : "h-3.5 w-[1.15rem] rounded-[2px]"} ${className}`.trim()}
    />
  );
}
