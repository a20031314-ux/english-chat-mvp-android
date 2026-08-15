"use client";

import { useState } from "react";
import type { LearningLanguage } from "@/lib/learningLanguages";

type LearningLanguageFlagProps = {
  language: Pick<LearningLanguage, "flag" | "flagCountry" | "nativeLabel">;
  className?: string;
};

/**
 * Country flag image (Windows-safe). Falls back to emoji if the image fails.
 */
export function LearningLanguageFlag({
  language,
  className = "",
}: LearningLanguageFlagProps) {
  const [failed, setFailed] = useState(false);
  const src = `/flags/${language.flagCountry}.png`;

  if (failed) {
    return (
      <span
        aria-hidden="true"
        className={`inline-flex h-3.5 w-[1.15rem] shrink-0 items-center justify-center text-[11px] leading-none ${className}`.trim()}
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
      loading="lazy"
      decoding="async"
      aria-hidden="true"
      onError={() => setFailed(true)}
      className={`inline-block h-3.5 w-[1.15rem] shrink-0 rounded-[2px] object-cover shadow-[0_0_0_1px_rgba(15,23,42,0.12)] ${className}`.trim()}
    />
  );
}
