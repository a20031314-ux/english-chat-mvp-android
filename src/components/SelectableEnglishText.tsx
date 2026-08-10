"use client";

import { segmentEnglishForLookup } from "@/lib/englishPhrases";
import { isLookupableEnglishWord } from "@/lib/vocabulary";

type TextTone = "default" | "onDark" | "onEmerald" | "onBlue";

type SelectableEnglishTextProps = {
  text: string;
  pickMode?: boolean;
  className?: string;
  tone?: TextTone;
  isWordSaved?: (word: string) => boolean;
  savingWord?: string | null;
  onWordClick?: (word: string) => void;
};

const toneClasses: Record<
  TextTone,
  {
    pickable: string;
    phrase: string;
    saved: string;
    saving: string;
  }
> = {
  default: {
    pickable:
      "rounded-sm bg-amber-200/80 px-0.5 font-medium text-slate-900 underline decoration-amber-500 underline-offset-2 hover:bg-amber-300",
    phrase:
      "rounded-sm bg-sky-200/90 px-0.5 font-medium text-sky-950 underline decoration-sky-500 underline-offset-2 hover:bg-sky-300",
    saved: "rounded-sm bg-emerald-100 px-0.5 text-emerald-800",
    saving: "rounded-sm bg-amber-100 px-0.5 text-amber-900 opacity-70",
  },
  onDark: {
    pickable:
      "rounded-sm bg-amber-300/35 px-0.5 font-medium text-white underline decoration-amber-200 underline-offset-2 hover:bg-amber-300/50",
    phrase:
      "rounded-sm bg-sky-300/40 px-0.5 font-medium text-white underline decoration-sky-200 underline-offset-2 hover:bg-sky-300/55",
    saved: "rounded-sm bg-emerald-400/25 px-0.5 text-emerald-100",
    saving: "rounded-sm bg-white/10 px-0.5 text-white/70",
  },
  onEmerald: {
    pickable:
      "rounded-sm bg-amber-200/90 px-0.5 font-medium text-emerald-950 underline decoration-amber-500 underline-offset-2 hover:bg-amber-300",
    phrase:
      "rounded-sm bg-sky-200/95 px-0.5 font-medium text-sky-950 underline decoration-sky-500 underline-offset-2 hover:bg-sky-300",
    saved: "rounded-sm bg-emerald-200 px-0.5 text-emerald-900",
    saving: "rounded-sm bg-amber-100 px-0.5 text-emerald-900/70",
  },
  onBlue: {
    pickable:
      "rounded-sm bg-amber-200/90 px-0.5 font-medium text-blue-950 underline decoration-amber-500 underline-offset-2 hover:bg-amber-300",
    phrase:
      "rounded-sm bg-sky-100 px-0.5 font-medium text-sky-950 underline decoration-sky-500 underline-offset-2 hover:bg-sky-200",
    saved: "rounded-sm bg-blue-200 px-0.5 text-blue-900",
    saving: "rounded-sm bg-amber-100 px-0.5 text-blue-900/70",
  },
};

export function SelectableEnglishText({
  text,
  pickMode = false,
  className = "",
  tone = "default",
  isWordSaved,
  savingWord = null,
  onWordClick,
}: SelectableEnglishTextProps) {
  if (!pickMode || !onWordClick) {
    return <span className={`whitespace-pre-wrap ${className}`}>{text}</span>;
  }

  const styles = toneClasses[tone];
  const segments = segmentEnglishForLookup(text);

  return (
    <span className={`whitespace-pre-wrap ${className}`}>
      {segments.map((segment, index) => {
        if (segment.kind === "text") {
          return <span key={`${index}-t`}>{segment.value}</span>;
        }

        if (
          segment.kind === "word" &&
          !isLookupableEnglishWord(segment.value)
        ) {
          return <span key={`${index}-w`}>{segment.value}</span>;
        }

        const saved = isWordSaved?.(segment.value) ?? false;
        const saving =
          savingWord?.toLowerCase() === segment.value.toLowerCase();
        const pickClass =
          segment.kind === "phrase" ? styles.phrase : styles.pickable;

        return (
          <button
            key={`${index}-${segment.value}`}
            type="button"
            disabled={saving}
            title={
              segment.kind === "phrase" ? segment.value : undefined
            }
            onClick={() => onWordClick(segment.value)}
            className={`inline align-baseline transition disabled:cursor-default ${
              saved ? styles.saved : saving ? styles.saving : pickClass
            }`}
            translate="no"
          >
            {segment.value}
          </button>
        );
      })}
    </span>
  );
}
