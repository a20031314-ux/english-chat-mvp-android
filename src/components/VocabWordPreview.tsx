"use client";

import { AnalyzableEnglish } from "@/components/AnalyzableEnglish";
import type { UICopy } from "@/lib/copy";
import type { VocabLookupResult } from "@/lib/vocabulary";

type VocabWordPreviewProps = {
  word: string;
  detail: VocabLookupResult | null;
  isLoading: boolean;
  isSaving: boolean;
  loadFailed: boolean;
  alreadySaved?: boolean;
  ui: UICopy;
  onClose: () => void;
  onSave: () => void;
};

export function VocabWordPreview({
  word,
  detail,
  isLoading,
  isSaving,
  loadFailed,
  alreadySaved = false,
  ui,
  onClose,
  onSave,
}: VocabWordPreviewProps) {
  const canSave =
    Boolean(detail) &&
    !alreadySaved &&
    !isLoading &&
    !isSaving &&
    !loadFailed;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-900/40 p-3 sm:items-center">
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label={ui.vocabPreviewClose}
        onClick={onClose}
        disabled={isSaving}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="vocab-preview-title"
        className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl"
      >
        <div className="px-4 py-4">
          <div id="vocab-preview-title">
            <AnalyzableEnglish
              sentence={word}
              context={detail?.example ? [detail.example] : undefined}
              className="text-xl font-semibold text-slate-900"
            />
          </div>
          {detail?.partOfSpeech ? (
            <p className="mt-1 text-[11px] uppercase tracking-wide text-slate-500">
              {detail.partOfSpeech}
            </p>
          ) : null}

          {isLoading ? (
            <p className="mt-3 text-sm text-slate-600">{ui.vocabPreviewLoading}</p>
          ) : loadFailed ? (
            <p className="mt-3 text-sm text-rose-700">{ui.vocabPickFailed}</p>
          ) : (
            <>
              <p className="mt-3 text-sm leading-relaxed text-slate-800">
                {detail?.gloss}
              </p>
              {detail?.example ? (
                <AnalyzableEnglish
                  sentence={detail.example}
                  className="mt-2 text-xs leading-relaxed text-slate-500"
                />
              ) : null}
            </>
          )}
        </div>

        <div className="flex gap-2 border-t border-slate-100 px-4 py-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            {ui.vocabPreviewClose}
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={!canSave}
            className={`flex-1 rounded-xl px-3 py-2.5 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50 ${
              alreadySaved
                ? "bg-teal-50 text-teal-800"
                : "bg-slate-900 text-white hover:bg-slate-800"
            }`}
          >
            {alreadySaved
              ? ui.vocabSaved
              : isSaving
                ? ui.vocabPickSaving
                : ui.vocabPreviewSave}
          </button>
        </div>
      </div>
    </div>
  );
}
