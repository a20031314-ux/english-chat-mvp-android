"use client";

import { TTSButton } from "@/components/TTSButton";
import { VocabSenseList } from "@/components/VocabSenseList";
import type { UICopy } from "@/lib/copy";
import { vocabSensesOf, type VocabLookupResult } from "@/lib/vocabulary";

export function VocabWordPanel({
  word,
  detail,
  isLoading,
  isSaving,
  loadFailed,
  alreadySaved = false,
  allowSave = true,
  ui,
  onSave,
}: {
  word: string;
  detail: VocabLookupResult | null;
  isLoading: boolean;
  isSaving: boolean;
  loadFailed: boolean;
  alreadySaved?: boolean;
  allowSave?: boolean;
  ui: UICopy;
  onSave: () => void;
}) {
  const canSave =
    allowSave &&
    Boolean(detail) &&
    !alreadySaved &&
    !isLoading &&
    !isSaving &&
    !loadFailed;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-xl font-semibold text-slate-900">{word}</p>
        <TTSButton text={word} ariaLabel={ui.listen} />
      </div>
      {detail?.reading ? (
        <p className="mt-1 text-sm text-slate-600">{detail.reading}</p>
      ) : null}

      {isLoading ? (
        <p className="mt-3 text-sm text-slate-600">{ui.vocabPreviewLoading}</p>
      ) : loadFailed ? (
        <p className="mt-3 text-sm text-rose-700">{ui.vocabPickFailed}</p>
      ) : (
        <>
          <div className="mt-3">
            <VocabSenseList
              senses={vocabSensesOf({
                gloss: detail?.gloss || "",
                partOfSpeech: detail?.partOfSpeech,
                senses: detail?.senses,
              })}
              otherLabel={ui.vocabOtherSenses}
              listenLabel={ui.listen}
            />
          </div>
        </>
      )}

      {allowSave ? (
        <button
          type="button"
          onClick={onSave}
          disabled={!canSave}
          className={`mt-4 w-full rounded-xl px-3 py-2.5 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50 ${
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
      ) : null}
    </div>
  );
}
