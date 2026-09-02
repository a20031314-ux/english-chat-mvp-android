"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { CharacterGuidePanel } from "@/components/CharacterGuidePanel";
import { TTSButton } from "@/components/TTSButton";
import { AnalyzableEnglish } from "@/components/AnalyzableEnglish";
import { VocabSenseList } from "@/components/VocabSenseList";
import { apiUrl } from "@/lib/apiBase";
import type { Locale, UICopy } from "@/lib/copy";
import { useLearningLanguageOptional } from "@/contexts/LearningLanguageContext";
import { shouldShowCharacterGuide } from "@/lib/characterGuide";
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
  const [section, setSection] = useState<"saved" | "characters">("saved");
  const showCharacters = shouldShowCharacterGuide(targetLanguage, locale);

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
    if (!shouldShowCharacterGuide(targetLanguage, locale)) {
      setSection("saved");
    }
  }, [targetLanguage, locale]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2800);
    return () => window.clearTimeout(timer);
  }, [toast]);

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
        {showCharacters ? (
          <div className="mb-4 flex gap-1 rounded-xl bg-white/5 p-1">
            <button
              type="button"
              onClick={() => setSection("saved")}
              className={`flex-1 rounded-lg px-3 py-1.5 text-xs font-medium ${
                section === "saved"
                  ? "bg-[#e8e8e4] text-neutral-900 shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {ui.vocabTabSaved}
            </button>
            <button
              type="button"
              onClick={() => setSection("characters")}
              className={`flex-1 rounded-lg px-3 py-1.5 text-xs font-medium ${
                section === "characters"
                  ? "bg-[#e8e8e4] text-neutral-900 shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {ui.vocabTabCharacters}
            </button>
          </div>
        ) : null}

        {section === "characters" && showCharacters ? (
          <CharacterGuidePanel
            targetLanguage={targetLanguage}
            locale={locale}
            ui={ui}
          />
        ) : (
          <>
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="min-w-0 flex-1 rounded-xl border border-white/10 bg-[#121212] px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-white/40"
          />
          <button
            type="submit"
            disabled={isSearching || !query.trim()}
            className="shrink-0 rounded-xl bg-[#e8e8e4] shadow-[0_0_14px_rgba(255,255,255,0.28)] px-4 py-2.5 text-sm font-medium text-neutral-900 disabled:opacity-40"
          >
            {isSearching ? ui.vocabSearching : ui.vocabSearchCta}
          </button>
        </form>

        {showResults ? (
          <section className="mt-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold text-slate-100">
                {ui.vocabResultsTitle}
              </h2>
              <button
                type="button"
                onClick={handleClearSearch}
                className="shrink-0 text-xs font-medium text-slate-500 hover:text-white"
              >
                {ui.vocabPreviewClose}
              </button>
            </div>
            {error ? (
              <p className="mt-2 text-sm text-rose-300">{error}</p>
            ) : results.length === 0 ? (
              <p className="mt-2 text-sm text-slate-300">{ui.vocabNoResults}</p>
            ) : (
              <ul className="mt-3 space-y-3">
                {results.map((item) => {
                  const saved = isWordSaved(entries, item.word);
                  return (
                    <li
                      key={`${item.word}-${item.gloss}`}
                      className="rounded-2xl border border-white/10 bg-[#121212] p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <AnalyzableEnglish
                              sentence={item.word}
                              context={item.example ? [item.example] : undefined}
                              sentenceRail={false}
                              className="text-base font-semibold text-slate-100"
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
                              analyzeLabel={ui.insightAnalyze}
                              sourceType="example"
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
                              ? "bg-white/10 text-[#d4d4d0]"
                              : "bg-[#e8e8e4] text-neutral-900 hover:bg-[#f5f5f3]"
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
            <h2 className="text-sm font-semibold text-slate-100">
              {ui.vocabSavedTitle}
            </h2>
            {entries.length > 0 ? (
              <div className="flex shrink-0 items-center gap-2">
                {entries.length > 1 ? (
                  <button
                    type="button"
                    onClick={handleShuffle}
                    className="rounded-full border border-white/10 bg-[#121212] px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-white/10"
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
                      ? "bg-[#e8e8e4] text-neutral-900"
                      : "border border-white/10 bg-[#121212] text-slate-300"
                  }`}
                >
                  {ui.vocabHideGloss}
                </button>
              </div>
            ) : null}
          </div>
          {entries.length === 0 ? (
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-slate-300">
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
                    className="rounded-2xl border border-white/10 bg-[#121212] p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <AnalyzableEnglish
                            sentence={entry.word}
                            context={entry.example ? [entry.example] : undefined}
                            sentenceRail={false}
                            className="text-base font-semibold text-slate-100"
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
                            className="mt-2 w-full rounded-xl bg-white/5 px-3 py-2.5 text-left text-xs text-slate-500"
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
                                analyzeLabel={ui.insightAnalyze}
                                sourceType="example"
                                className="mt-1 text-xs leading-relaxed text-slate-500"
                              />
                            ) : null}
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDelete(entry.id)}
                        className="shrink-0 text-xs font-medium text-rose-300 hover:underline"
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
          </>
        )}
      </div>

      {toast ? (
        <div className="pointer-events-none absolute bottom-4 left-1/2 z-10 max-w-[min(90vw,18rem)] -translate-x-1/2 rounded-full bg-[#e8e8e4] px-4 py-2 text-center text-xs text-neutral-900 shadow-lg">
          {toast}
        </div>
      ) : null}
    </div>
  );
}
