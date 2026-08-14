"use client";

import { useCallback, useMemo, useRef, useState, type ReactNode } from "react";
import { VocabWordPreview } from "@/components/VocabWordPreview";
import { VocabPreviewContext } from "@/contexts/VocabPreviewContext";
import { apiUrl } from "@/lib/apiBase";
import type { Locale, UICopy } from "@/lib/copy";
import {
  isWordSaved,
  loadVocabulary,
  persistVocabulary,
  saveVocabularyWords,
  type VocabLookupResult,
  type VocabularyEntry,
} from "@/lib/vocabulary";

export function VocabPreviewProvider({
  locale,
  ui,
  children,
}: {
  locale: Locale;
  ui: UICopy;
  children: ReactNode;
}) {
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
    async (word: string) => {
      const trimmed = word.replace(/\s+/g, " ").trim();
      if (!trimmed || isVocabSaving) return;

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
          body: JSON.stringify({ words: [trimmed], locale }),
        });
        if (!response.ok) throw new Error("gloss failed");
        const data = (await response.json()) as { items?: VocabLookupResult[] };
        if (requestIdRef.current !== requestId) return;
        const item =
          Array.isArray(data.items) && data.items.length > 0
            ? data.items[0]
            : { word: trimmed, gloss: trimmed };
        setPreviewDetail({
          word: item.word || trimmed,
          gloss: item.gloss || trimmed,
          ...(item.example ? { example: item.example } : {}),
          ...(item.partOfSpeech ? { partOfSpeech: item.partOfSpeech } : {}),
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
    [isVocabSaving, locale],
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
    setIsVocabSaving(true);
    try {
      const updated = saveVocabularyWords(loadVocabulary(), [previewDetail]);
      persistVocabulary(updated);
      setEntries(updated);
      showToast(ui.vocabPickSavedToast);
      setPreviewWord(null);
      setPreviewDetail(null);
      setPreviewLoadFailed(false);
    } catch {
      showToast(ui.vocabPickFailed);
    } finally {
      setIsVocabSaving(false);
    }
  }, [isVocabSaving, previewDetail, previewWord, showToast, ui.vocabPickFailed, ui.vocabPickSavedToast]);

  const value = useMemo(
    () => ({
      open,
      close,
      saveLabel: ui.insightSaveWord,
      isWordSaved: (word: string) => isWordSaved(entries, word),
      savingWord: previewWord,
    }),
    [close, entries, open, previewWord, ui.insightSaveWord],
  );

  return (
    <VocabPreviewContext.Provider value={value}>
      {children}
      {previewWord ? (
        <VocabWordPreview
          word={previewWord}
          detail={previewDetail}
          isLoading={isPreviewLoading}
          isSaving={isVocabSaving}
          loadFailed={previewLoadFailed}
          alreadySaved={isWordSaved(entries, previewWord)}
          ui={ui}
          onClose={close}
          onSave={save}
        />
      ) : null}
      {toast ? (
        <div
          className="pointer-events-none fixed bottom-6 left-1/2 z-[110] max-w-[min(90vw,20rem)] -translate-x-1/2 px-4"
          role="status"
        >
          <div className="whitespace-pre-line rounded-xl border border-slate-200 bg-white px-4 py-3 text-center text-sm leading-snug text-slate-800 shadow-lg">
            {toast}
          </div>
        </div>
      ) : null}
    </VocabPreviewContext.Provider>
  );
}
