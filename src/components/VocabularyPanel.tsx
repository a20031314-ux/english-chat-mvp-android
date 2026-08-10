"use client";

import { FormEvent, useEffect, useState } from "react";
import { TTSButton } from "@/components/TTSButton";
import { apiUrl } from "@/lib/apiBase";
import type { Locale, UICopy } from "@/lib/copy";
import {
  isWordSaved,
  loadVocabulary,
  makeVocabId,
  persistVocabulary,
  type VocabLookupResult,
  type VocabularyEntry,
} from "@/lib/vocabulary";

type VocabularyPanelProps = {
  locale: Locale;
  ui: UICopy;
};

export function VocabularyPanel({ locale, ui }: VocabularyPanelProps) {
  const [entries, setEntries] = useState<VocabularyEntry[]>([]);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<VocabLookupResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    setEntries(loadVocabulary());
  }, []);

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
        body: JSON.stringify({ query: trimmed, locale }),
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
    if (isWordSaved(entries, item.word)) return;
    const next: VocabularyEntry = {
      id: makeVocabId(item.word),
      word: item.word,
      gloss: item.gloss,
      createdAt: Date.now(),
      ...(item.example ? { example: item.example } : {}),
      ...(item.partOfSpeech ? { partOfSpeech: item.partOfSpeech } : {}),
    };
    const updated = [next, ...entries];
    setEntries(updated);
    persistVocabulary(updated);
    setToast(ui.vocabSavedToast);
  };

  const handleDelete = (id: string) => {
    const updated = entries.filter((e) => e.id !== id);
    setEntries(updated);
    persistVocabulary(updated);
  };

  const handleClearSearch = () => {
    setQuery("");
    setResults([]);
    setSearched(false);
    setError(null);
  };

  const showResults = searched && !isSearching;

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
                            <p
                              className="text-base font-semibold text-slate-900"
                              translate="no"
                            >
                              {item.word}
                            </p>
                            <TTSButton text={item.word} ariaLabel={ui.listen} />
                          </div>
                          <p className="mt-1 text-sm text-slate-700">
                            {item.gloss}
                          </p>
                          {item.example ? (
                            <p
                              className="mt-1 text-xs leading-relaxed text-slate-500"
                              translate="no"
                            >
                              {item.example}
                            </p>
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
          <h2 className="text-sm font-semibold text-slate-900">
            {ui.vocabSavedTitle}
          </h2>
          {entries.length === 0 ? (
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-slate-600">
              {ui.vocabEmpty}
            </p>
          ) : (
            <ul className="mt-3 space-y-3">
              {entries.map((entry) => (
                <li
                  key={entry.id}
                  className="rounded-2xl border border-slate-200 bg-white p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p
                          className="text-base font-semibold text-slate-900"
                          translate="no"
                        >
                          {entry.word}
                        </p>
                        <TTSButton text={entry.word} ariaLabel={ui.listen} />
                      </div>
                      <p className="mt-1 text-sm text-slate-700">
                        {entry.gloss}
                      </p>
                      {entry.example ? (
                        <p
                          className="mt-1 text-xs leading-relaxed text-slate-500"
                          translate="no"
                        >
                          {entry.example}
                        </p>
                      ) : null}
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
              ))}
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
