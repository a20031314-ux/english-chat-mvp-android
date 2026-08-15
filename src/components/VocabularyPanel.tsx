"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { TTSButton } from "@/components/TTSButton";
import { AnalyzableEnglish } from "@/components/AnalyzableEnglish";
import { VocabSenseList } from "@/components/VocabSenseList";
import { apiUrl } from "@/lib/apiBase";
import type { Locale, UICopy } from "@/lib/copy";
import { useLearningLanguageOptional } from "@/contexts/LearningLanguageContext";
import {
  DEFAULT_LEARNING_LANGUAGE_CODE,
} from "@/lib/learningLanguages";
import {
  filterVocabularyByLanguage,
  isWordSaved,
  loadHideVocabGloss,
  loadVocabulary,
  makeVocabId,
  persistHideVocabGloss,
  persistVocabulary,
  type VocabLookupResult,
  type VocabularyEntry,
  vocabSensesOf,
} from "@/lib/vocabulary";

type VocabularyPanelProps = {
  locale: Locale;
  ui: UICopy;
};

export function VocabularyPanel({ locale, ui }: VocabularyPanelProps) {
  const learningLanguage = useLearningLanguageOptional();
  const targetLanguage =
    learningLanguage?.targetLanguage ?? DEFAULT_LEARNING_LANGUAGE_CODE;
  const [allEntries, setAllEntries] = useState<VocabularyEntry[]>([]);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<VocabLookupResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [hideGloss, setHideGloss] = useState(false);
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());
  const [orderIds, setOrderIds] = useState<string[] | null>(null);

  const entries = useMemo(
    () => filterVocabularyByLanguage(allEntries, targetLanguage),
    [allEntries, targetLanguage],
  );

  useEffect(() => {
    setAllEntries(loadVocabulary());
    setHideGloss(loadHideVocabGloss());
  }, []);

  useEffect(() => {
    setOrderIds(null);
    setRevealedIds(new Set());
    setResults([]);
    setSearched(false);
    setError(null);
  }, [targetLanguage]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    setResults([]);
    setSearched(false);
    setError(null);
  }, [locale]);

  const handleSearch = async (event?: FormEvent) => {
    event?.preventDefault();
    const trimmed = query.trim();
    if (!trimmed || isSearching) return;

    setIsSearching(true);
    setError(null);
    setSearched(true);

    try {
      const response = await fetch(apiUrl("/api/vocab"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: trimmed,
          locale,
          interfaceLanguage: locale,
          targetLanguage,
        }),
      });
      if (!response.ok) {
        throw new Error("lookup failed");
      }
      const data = (await response.json()) as { results?: VocabLookupResult[] };
      setResults(Array.isArray(data.results) ? data.results : []);
    } catch {
      setResults([]);
      setError(ui.vocabSearchFailed);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSave = (item: VocabLookupResult) => {
    if (isWordSaved(allEntries, item.word, targetLanguage)) return;
    const senses = vocabSensesOf(item);
    const next: VocabularyEntry = {
      id: makeVocabId(item.word),
      word: item.word,
      gloss: item.gloss,
      languageCode: targetLanguage,
      createdAt: Date.now(),
      ...(senses.length > 1 ? { senses } : {}),
      ...(item.example ? { example: item.example } : {}),
      ...(item.partOfSpeech ? { partOfSpeech: item.partOfSpeech } : {}),
    };
    const updated = [next, ...allEntries];
    setAllEntries(updated);
    persistVocabulary(updated);
    setToast(ui.vocabSavedToast);
  };

  const handleDelete = (id: string) => {
    const updated = allEntries.filter((e) => e.id !== id);
    setAllEntries(updated);
    persistVocabulary(updated);
    setOrderIds((prev) => (prev ? prev.filter((item) => item !== id) : prev));
  };

  const handleShuffle = () => {
    const next = [...entries];
    for (let i = next.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [next[i], next[j]] = [next[j], next[i]];
    }
    setOrderIds(next.map((entry) => entry.id));
    setRevealedIds(new Set());
  };

  const handleClearSearch = () => {
    setQuery("");
    setResults([]);
    setSearched(false);
    setError(null);
  };

  const showResults = searched && !isSearching;

  const displayedEntries = (() => {
    if (!orderIds) return entries;
    const byId = new Map(entries.map((entry) => [entry.id, entry]));
    const ordered = orderIds
      .map((id) => byId.get(id))
      .filter((entry): entry is VocabularyEntry => Boolean(entry));
    const seen = new Set(ordered.map((entry) => entry.id));
    return [...ordered, ...entries.filter((entry) => !seen.has(entry.id))];
  })();

  return (
    <div className="relative flex h-full min-h-0 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-400"
          />
          <button
            type="submit"
            disabled={isSearching || !query.trim()}
            className="shrink-0 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-40"
          >
            {isSearching ? ui.vocabSearching : ui.vocabSearchCta}
          </button>
        </form>

        {showResults ? (
          <section className="mt-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold text-slate-900">
                {ui.vocabResultsTitle}
              </h2>
              <button
                type="button"
                onClick={handleClearSearch}
                className="shrink-0 text-xs font-medium text-slate-500 hover:text-slate-900"
              >
                {ui.vocabPreviewClose}
              </button>
            </div>
            {error ? (
              <p className="mt-2 text-sm text-rose-700">{error}</p>
            ) : results.length === 0 ? (
              <p className="mt-2 text-sm text-slate-600">{ui.vocabNoResults}</p>
            ) : (
              <ul className="mt-3 space-y-3">
                {results.map((item) => {
                  const saved = isWordSaved(entries, item.word);
                  return (
                    <li
                      key={`${item.word}-${item.gloss}`}
                      className="rounded-2xl border border-slate-200 bg-white p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <AnalyzableEnglish
                              sentence={item.word}
                              context={item.example ? [item.example] : undefined}
                              className="text-base font-semibold text-slate-900"
                            />
                            <TTSButton text={item.word} ariaLabel={ui.listen} />
                          </div>
                          <div className="mt-1">
                            <VocabSenseList
                              senses={vocabSensesOf(item)}
                              otherLabel={ui.vocabOtherSenses}
                            />
                          </div>
                          {item.example ? (
                            <AnalyzableEnglish
                              sentence={item.example}
                              className="mt-1 text-xs leading-relaxed text-slate-500"
                            />
                          ) : null}
                        </div>
                        <button
                          type="button"
                          disabled={saved}
                          onClick={() => handleSave(item)}
                          className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium ${
                            saved
                              ? "bg-teal-50 text-teal-800"
                              : "bg-slate-900 text-white"
                          }`}
                        >
                          {saved ? ui.vocabSaved : ui.vocabSave}
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        ) : null}

        <section className="mt-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-slate-900">
              {ui.vocabSavedTitle}
            </h2>
            {entries.length > 0 ? (
              <div className="flex shrink-0 items-center gap-2">
                {entries.length > 1 ? (
                  <button
                    type="button"
                    onClick={handleShuffle}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
                  >
                    {ui.vocabShuffle}
                  </button>
                ) : null}
                <button
                  type="button"
                  aria-pressed={hideGloss}
                  onClick={() => {
                    const next = !hideGloss;
                    setHideGloss(next);
                    persistHideVocabGloss(next);
                    setRevealedIds(new Set());
                  }}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                    hideGloss
                      ? "bg-slate-900 text-white"
                      : "border border-slate-200 bg-white text-slate-600"
                  }`}
                >
                  {ui.vocabHideGloss}
                </button>
              </div>
            ) : null}
          </div>
          {entries.length === 0 ? (
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-slate-600">
              {ui.vocabEmpty}
            </p>
          ) : (
            <ul className="mt-3 space-y-3">
              {displayedEntries.map((entry) => {
                const revealed = revealedIds.has(entry.id);
                const meaningHidden = hideGloss && !revealed;
                return (
                  <li
                    key={entry.id}
                    className="rounded-2xl border border-slate-200 bg-white p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <AnalyzableEnglish
                            sentence={entry.word}
                            context={entry.example ? [entry.example] : undefined}
                            className="text-base font-semibold text-slate-900"
                          />
                          <TTSButton text={entry.word} ariaLabel={ui.listen} />
                        </div>
                        {meaningHidden ? (
                          <button
                            type="button"
                            onClick={() =>
                              setRevealedIds((prev) => {
                                const next = new Set(prev);
                                next.add(entry.id);
                                return next;
                              })
                            }
                            className="mt-2 w-full rounded-xl bg-slate-50 px-3 py-2.5 text-left text-xs text-slate-500"
                          >
                            {ui.vocabRevealGloss}
                          </button>
                        ) : (
                          <div
                            role={hideGloss ? "button" : undefined}
                            tabIndex={hideGloss ? 0 : undefined}
                            onClick={
                              hideGloss
                                ? () =>
                                    setRevealedIds((prev) => {
                                      const next = new Set(prev);
                                      next.delete(entry.id);
                                      return next;
                                    })
                                : undefined
                            }
                            onKeyDown={
                              hideGloss
                                ? (event) => {
                                    if (event.key !== "Enter" && event.key !== " ") {
                                      return;
                                    }
                                    event.preventDefault();
                                    setRevealedIds((prev) => {
                                      const next = new Set(prev);
                                      next.delete(entry.id);
                                      return next;
                                    });
                                  }
                                : undefined
                            }
                            className={`mt-1 ${hideGloss ? "cursor-pointer" : ""}`}
                          >
                            <VocabSenseList
                              senses={vocabSensesOf(entry)}
                              otherLabel={ui.vocabOtherSenses}
                            />
                            {entry.example ? (
                              <AnalyzableEnglish
                                sentence={entry.example}
                                className="mt-1 text-xs leading-relaxed text-slate-500"
                              />
                            ) : null}
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDelete(entry.id)}
                        className="shrink-0 text-xs font-medium text-rose-700 hover:underline"
                      >
                        {ui.vocabDelete}
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>

      {toast ? (
        <div className="pointer-events-none absolute bottom-4 left-1/2 z-10 max-w-[min(90vw,18rem)] -translate-x-1/2 rounded-full bg-slate-900 px-4 py-2 text-center text-xs text-white shadow-lg">
          {toast}
        </div>
      ) : null}
    </div>
  );
}
