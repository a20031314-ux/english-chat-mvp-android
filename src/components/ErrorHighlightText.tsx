"use client";

import { isLookupableEnglishWord } from "@/lib/vocabulary";
import {
  correctedHighlightParts,
  originalHighlightParts,
} from "@/lib/textDiff";
import { SelectableEnglishText } from "./SelectableEnglishText";

type DiffSide = "original" | "corrected";

type DiffHighlightTextProps = {
  original: string;
  corrected: string;
  side: DiffSide;
  pickMode?: boolean;
  isWordSaved?: (word: string) => boolean;
  savingWord?: string | null;
  onWordClick?: (word: string) => void;
  className?: string;
  tone?: "default" | "onDark";
};

const markClasses = {
  default: {
    remove:
      "rounded-sm bg-rose-500/15 px-0.5 font-semibold text-rose-700 underline decoration-2 decoration-rose-500 underline-offset-2",
    add: "rounded-sm bg-teal-500/15 px-0.5 font-semibold text-teal-800 underline decoration-2 decoration-teal-600 underline-offset-2",
    gap: "mx-0.5 inline-flex items-center rounded-sm border border-dashed border-rose-400 bg-rose-50 px-1 py-0.5 text-[11px] font-semibold leading-none text-rose-700",
  },
  onDark: {
    remove:
      "rounded-sm bg-rose-400/35 px-0.5 font-semibold text-rose-100 underline decoration-2 decoration-rose-300 underline-offset-2",
    add: "rounded-sm bg-teal-400/30 px-0.5 font-semibold text-teal-100 underline decoration-2 decoration-teal-200 underline-offset-2",
    gap: "mx-0.5 inline-flex items-center rounded-sm border border-dashed border-rose-200/80 bg-rose-400/20 px-1 py-0.5 text-[11px] font-semibold leading-none text-rose-100",
  },
};

function PickableToken({
  text,
  markClass,
  pickMode,
  isWordSaved,
  savingWord,
  onWordClick,
}: {
  text: string;
  markClass?: string;
  pickMode: boolean;
  isWordSaved?: (word: string) => boolean;
  savingWord?: string | null;
  onWordClick?: (word: string) => void;
}) {
  if (pickMode && onWordClick && isLookupableEnglishWord(text.trim())) {
    const word = text.trim();
    const saved = isWordSaved?.(word) ?? false;
    const saving = savingWord?.toLowerCase() === word.toLowerCase();
    return (
      <button
        type="button"
        disabled={saving}
        onClick={() => onWordClick(word)}
        className={`inline align-baseline transition disabled:cursor-default ${markClass ?? ""}`}
        translate="no"
      >
        {text}
      </button>
    );
  }
  if (markClass) {
    return <span className={markClass}>{text}</span>;
  }
  return <span>{text}</span>;
}

export function DiffHighlightText({
  original,
  corrected,
  side,
  pickMode = false,
  isWordSaved,
  savingWord = null,
  onWordClick,
  className = "",
  tone = "default",
}: DiffHighlightTextProps) {
  const marks = markClasses[tone];
  if (side === "original") {
    const parts = originalHighlightParts(original, corrected);
    const hasMarks = parts.some(
      (p) => (p.error && p.text.trim()) || Boolean(p.missingHint),
    );
    if (!hasMarks) {
      return (
        <SelectableEnglishText
          text={original}
          pickMode={pickMode}
          isWordSaved={isWordSaved}
          savingWord={savingWord}
          onWordClick={onWordClick}
          className={className}
        />
      );
    }
    return (
      <span className={`whitespace-pre-wrap ${className}`}>
        {parts.map((part, index) => {
          if (part.missingHint) {
            return (
              <span
                key={`gap-${index}`}
                className={marks.gap}
                title={part.missingHint}
              >
                +{part.missingHint}
              </span>
            );
          }
          if (!part.text.trim() && !part.error) {
            return <span key={`${index}-ws`}>{part.text}</span>;
          }
          return (
            <PickableToken
              key={`${index}-${part.text}`}
              text={part.text}
              markClass={part.error ? marks.remove : undefined}
              pickMode={pickMode}
              isWordSaved={isWordSaved}
              savingWord={savingWord}
              onWordClick={onWordClick}
            />
          );
        })}
      </span>
    );
  }

  const parts = correctedHighlightParts(original, corrected);
  const hasAdds = parts.some((p) => p.added && p.text.trim());
  if (!hasAdds) {
    return (
      <SelectableEnglishText
        text={corrected}
        pickMode={pickMode}
        isWordSaved={isWordSaved}
        savingWord={savingWord}
        onWordClick={onWordClick}
        className={className}
      />
    );
  }

  return (
    <span className={`whitespace-pre-wrap ${className}`}>
      {parts.map((part, index) => (
        <PickableToken
          key={`${index}-${part.text}`}
          text={part.text}
          markClass={part.added ? marks.add : undefined}
          pickMode={pickMode}
          isWordSaved={isWordSaved}
          savingWord={savingWord}
          onWordClick={onWordClick}
        />
      ))}
    </span>
  );
}

/** @deprecated Prefer DiffHighlightText — kept for report analysis fallbacks */
export function ErrorHighlightText(
  props: Omit<DiffHighlightTextProps, "side">,
) {
  return <DiffHighlightText {...props} side="original" />;
}
