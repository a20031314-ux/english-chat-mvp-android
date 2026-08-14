"use client";

import { ReactNode } from "react";
import { DiffHighlightText } from "./ErrorHighlightText";
import { SelectableEnglishText } from "./SelectableEnglishText";
import { AnalyzableEnglish } from "./AnalyzableEnglish";
import { TTSButton } from "./TTSButton";

type CorrectionCardProps = {
  original: string;
  corrected: string;
  natural: string;
  explanation?: string;
  feedback: string;
  hasError?: boolean;
  pickMode?: boolean;
  isWordSaved?: (word: string) => boolean;
  savingWord?: string | null;
  onWordClick?: (word: string) => void;
  labels: {
    listen: string;
    natural: string;
    blockTitle?: string;
    myLine?: string;
    tryThis?: string;
  };
  actions?: ReactNode;
};

function norm(text: string) {
  return text.replace(/\s+/g, " ").trim().toLowerCase();
}

export function CorrectionCard({
  original,
  corrected,
  natural,
  explanation = "",
  feedback,
  hasError = true,
  pickMode = false,
  isWordSaved,
  savingWord = null,
  onWordClick,
  labels,
  actions,
}: CorrectionCardProps) {
  const textsDiffer = norm(corrected) !== norm(original);
  const showRecommended = Boolean(hasError) && textsDiffer;
  const compareBase = showRecommended ? corrected : original;
  const showNatural =
    natural.trim() !== "" && norm(natural) !== norm(compareBase);
  const explanationText = explanation.trim();
  const showExplanation = showRecommended && explanationText !== "";

  const blockTitle = labels.blockTitle ?? "문법 교정";
  const myLine = labels.myLine ?? "내가 쓴 표현";
  const tryThis = labels.tryThis ?? "이렇게 바꿔보세요";

  if (!showRecommended) {
    return (
      <div className="mt-2 rounded-2xl border border-emerald-200/80 bg-emerald-50/60 px-3.5 py-3">
        <p className="text-xs text-emerald-800/90">{feedback}</p>
        <AnalyzableEnglish
          sentence={original}
          className="mt-2 text-[15px] font-medium text-slate-900"
        >
          <SelectableEnglishText
            text={original}
            pickMode={pickMode}
            isWordSaved={isWordSaved}
            savingWord={savingWord}
            onWordClick={onWordClick}
          />
        </AnalyzableEnglish>
        <div className="mt-2">
          <TTSButton text={original} ariaLabel={labels.listen} />
        </div>
        {showNatural ? (
          <div className="mt-3 text-xs leading-relaxed text-slate-500">
            <span className="font-medium text-slate-600">{labels.natural}</span>
            {" · "}
            <AnalyzableEnglish
              sentence={natural}
              inline
              className="text-slate-700"
            />
            <span className="ml-2 inline-block align-middle">
              <TTSButton text={natural} ariaLabel={labels.listen} />
            </span>
          </div>
        ) : null}
        {!pickMode && actions ? <div className="mt-3">{actions}</div> : null}
      </div>
    );
  }

  return (
    <div className="mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="border-b border-slate-100 px-3.5 py-2">
        <p className="text-[11px] font-semibold tracking-wide text-slate-500">
          {blockTitle}
        </p>
      </div>

      <div className="space-y-4 px-3.5 py-3.5">
        <div>
          <p className="text-[11px] font-medium text-slate-500">{myLine}</p>
          <AnalyzableEnglish
            sentence={original}
            className="mt-1.5 text-[15px] leading-relaxed text-slate-800"
          >
            <DiffHighlightText
              original={original}
              corrected={corrected}
              side="original"
              pickMode={pickMode}
              isWordSaved={isWordSaved}
              savingWord={savingWord}
              onWordClick={onWordClick}
            />
          </AnalyzableEnglish>
          <div className="mt-2">
            <TTSButton text={original} ariaLabel={labels.listen} />
          </div>
        </div>

        <div className="flex justify-center text-slate-300" aria-hidden>
          ↓
        </div>

        <div>
          <p className="text-[11px] font-medium text-teal-800">{tryThis}</p>
          <AnalyzableEnglish
            sentence={corrected}
            className="mt-1.5 text-base font-semibold leading-relaxed text-slate-900"
          >
            <DiffHighlightText
              original={original}
              corrected={corrected}
              side="corrected"
              pickMode={pickMode}
              isWordSaved={isWordSaved}
              savingWord={savingWord}
              onWordClick={onWordClick}
            />
          </AnalyzableEnglish>
          <div className="mt-2">
            <TTSButton text={corrected} ariaLabel={labels.listen} />
          </div>
        </div>

        {showExplanation ? (
          <p className="text-xs leading-relaxed text-slate-600">
            <span className="mr-1" aria-hidden>
              💡
            </span>
            {explanationText}
          </p>
        ) : null}

        {showNatural ? (
          <div className="border-t border-slate-100 pt-3 text-xs leading-relaxed text-slate-500">
            <span className="font-medium text-slate-600">{labels.natural}</span>
            {" · "}
            <AnalyzableEnglish
              sentence={natural}
              inline
              className="text-slate-700"
            />
            <span className="ml-2 inline-block align-middle">
              <TTSButton text={natural} ariaLabel={labels.listen} />
            </span>
          </div>
        ) : null}
      </div>

      {!pickMode && actions ? (
        <div className="border-t border-slate-100 px-3.5 py-2.5">{actions}</div>
      ) : null}
    </div>
  );
}
