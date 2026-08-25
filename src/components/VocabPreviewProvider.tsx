"use client";

import { useCallback, useMemo, useRef, useState, type ReactNode } from "react";
import { VocabWordPanel } from "@/components/VocabWordPreview";
import { VocabPreviewContext } from "@/contexts/VocabPreviewContext";
import { useLearningLanguageOptional } from "@/contexts/LearningLanguageContext";
import { apiUrl } from "@/lib/apiBase";
import type { Locale, UICopy } from "@/lib/copy";
import { DEFAULT_LEARNING_LANGUAGE_CODE } from "@/lib/learningLanguages";
import {
  isWordSaved,
  loadVocabulary,
  normalizeVocabHeadword,
  persistVocabulary,
  saveVocabularyWords,
  isSentenceVocabUnit,
  type VocabLookupResult,
  type VocabularyEntry,
} from "@/lib/vocabulary";
import { isPronounceableAlphabetLetter } from "@/lib/letterPronunciation";

export function VocabPreviewProvider({
  locale,
  ui,
  hideOverlay = false,
  children,
}: {
  locale: Locale;
  ui: UICopy;
  hideOverlay?: boolean;
  children: ReactNode;
}) {
  const learningLanguage = useLearningLanguageOptional();
  const targetLanguage =
    learningLanguage?.targetLanguage ?? DEFAULT_LEARNING_LANGUAGE_CODE;
  const [entries, setEntries] = useState<VocabularyEntry[]>(() =>
    typeof window === "undefined" ? [] : loadVocabulary(),
  );
  const [previewWord, setPreviewWord] = useState<string | null>(null);
  const [previewDetail, setPreviewDetail] = useState<VocabLookupResult | null>(
    null,
  );
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [previewLoadFailed, setPreviewLoadFailed] = useState(false);
  const [isVocabSaving, setIsVocabSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const requestIdRef = useRef(0);
  const toastTimerRef = useRef<number | null>(null);

  const showToast = useCallback((message: string) => {
    setToast(message);
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => setToast(null), 2200);
  }, []);

  const open = useCallback(
    async (word: string, contextSentence?: string) => {
      const trimmed = normalizeVocabHeadword(word);
      if (!trimmed || isVocabSaving) return;
      if (isSentenceVocabUnit(trimmed, contextSentence)) return;
      // Alphabet letters use the inline sound tip, not the vocab sheet.
      if (isPronounceableAlphabetLetter(trimmed)) return;

      const requestId = requestIdRef.current + 1;
      requestIdRef.current = requestId;
      setPreviewWord(trimmed);
      setPreviewDetail(null);
      setPreviewLoadFailed(false);
      setIsPreviewLoading(true);
      setEntries(loadVocabulary());

      try {
        const response = await fetch(apiUrl("/api/vocab/gloss"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            words: [trimmed],
            locale,
            interfaceLanguage: locale,
            targetLanguage,
          }),
        });
        if (!response.ok) throw new Error("gloss failed");
        const data = (await response.json()) as { items?: VocabLookupResult[] };
        if (requestIdRef.current !== requestId) return;
        const item =
          Array.isArray(data.items) && data.items.length > 0
            ? data.items[0]
            : null;
        const head =
          normalizeVocabHeadword(item?.word || trimmed) || trimmed;
        const senses = item
          ? item.senses && item.senses.length > 0
            ? item.senses
            : item.gloss
              ? [
                  {
                    gloss: item.gloss,
                    ...(item.partOfSpeech
                      ? { partOfSpeech: item.partOfSpeech }
                      : {}),
                  },
                ]
              : []
          : [];
        const gloss = (senses[0]?.gloss || item?.gloss || "").trim();
        // Empty gloss or model echoing the headword = failed lookup (retryable).
        if (
          !gloss ||
          gloss.toLowerCase() === head.toLowerCase() ||
          normalizeVocabHeadword(gloss).toLowerCase() === head.toLowerCase()
        ) {
          setPreviewLoadFailed(true);
          setPreviewDetail({ word: head, gloss: "" });
          return;
        }
        setPreviewDetail({
          word: head,
          gloss,
          ...(senses.length > 0 ? { senses } : {}),
          ...(item?.example ? { example: item.example } : {}),
          ...(senses[0]?.partOfSpeech
            ? { partOfSpeech: senses[0].partOfSpeech }
            : item?.partOfSpeech
              ? { partOfSpeech: item.partOfSpeech }
              : {}),
          ...(item?.reading ? { reading: item.reading } : {}),
        });
      } catch {
        if (requestIdRef.current !== requestId) return;
        setPreviewLoadFailed(true);
      } finally {
        if (requestIdRef.current === requestId) {
          setIsPreviewLoading(false);
        }
      }
    },
    [isVocabSaving, locale, targetLanguage],
  );

  const close = useCallback(() => {
    if (isVocabSaving) return;
    requestIdRef.current += 1;
    setPreviewWord(null);
    setPreviewDetail(null);
    setIsPreviewLoading(false);
    setPreviewLoadFailed(false);
  }, [isVocabSaving]);

  const save = useCallback(() => {
    if (!previewWord || !previewDetail || isVocabSaving) return;
    if (isSentenceVocabUnit(previewWord)) return;
    setIsVocabSaving(true);
    try {
      const updated = saveVocabularyWords(
        loadVocabulary(),
        [previewDetail],
        targetLanguage,
      );
      persistVocabulary(updated);
      setEntries(updated);
      showToast(ui.vocabPickSavedToast);
    } catch {
      showToast(ui.vocabPickFailed);
    } finally {
      setIsVocabSaving(false);
    }
  }, [
    isVocabSaving,
    previewDetail,
    previewWord,
    showToast,
    targetLanguage,
    ui.vocabPickFailed,
    ui.vocabPickSavedToast,
  ]);

  const value = useMemo(
    () => ({
      open,
      close,
      save,
      saveLabel: ui.vocabSaveFromChat,
      isWordSaved: (word: string) =>
        isWordSaved(entries, word, targetLanguage),
      savingWord: isVocabSaving ? previewWord : null,
      word: previewWord,
      detail: previewDetail,
      isLoading: isPreviewLoading,
      loadFailed: previewLoadFailed,
      isSaving: isVocabSaving,
      alreadySaved: previewWord
        ? isWordSaved(entries, previewWord, targetLanguage)
        : false,
    }),
    [
      close,
      entries,
      isPreviewLoading,
      isVocabSaving,
      open,
      previewDetail,
      previewLoadFailed,
      previewWord,
      save,
      targetLanguage,
      ui.vocabSaveFromChat,
    ],
  );

  return (
    <VocabPreviewContext.Provider value={value}>
      {children}
      {!hideOverlay && previewWord ? (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-900/40 p-3 sm:items-center">
          <button
            type="button"
            className="absolute inset-0 cursor-default"
            aria-label={ui.vocabPreviewClose}
            onClick={close}
            disabled={isVocabSaving}
          />
          <div
            role="dialog"
            aria-modal="true"
            className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#121212] p-4 shadow-xl"
          >
            <VocabWordPanel
              word={previewWord}
              detail={previewDetail}
              isLoading={isPreviewLoading}
              isSaving={isVocabSaving}
              loadFailed={previewLoadFailed}
              alreadySaved={isWordSaved(entries, previewWord, targetLanguage)}
              ui={ui}
              onSave={save}
            />
            <button
              type="button"
              onClick={close}
              disabled={isVocabSaving}
              className="mt-2 w-full rounded-xl border border-white/10 bg-[#121212] px-3 py-2.5 text-sm font-medium text-slate-200 hover:bg-white/10 disabled:opacity-50"
            >
              {ui.vocabPreviewClose}
            </button>
          </div>
        </div>
      ) : null}
      {toast ? (
        <div
          className="pointer-events-none fixed bottom-6 left-1/2 z-[110] max-w-[min(90vw,20rem)] -translate-x-1/2 px-4"
          role="status"
        >
          <div className="whitespace-pre-line rounded-xl border border-white/10 bg-[#121212] px-4 py-3 text-center text-sm leading-snug text-slate-100 shadow-lg">
            {toast}
          </div>
        </div>
      ) : null}
    </VocabPreviewContext.Provider>
  );
}
