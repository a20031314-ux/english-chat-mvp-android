"use client";

import { useEffect, useMemo, useState } from "react";
import { LearningReviewModal } from "@/components/LearningReviewModal";
import { AnalyzableEnglish } from "@/components/AnalyzableEnglish";
import { LanguageSelector } from "@/components/LanguageSelector";
import { TargetLanguageSelector } from "@/components/TargetLanguageSelector";
import { APP_LOCALE_STORAGE_KEY, isLocale, Locale } from "@/lib/copy";
import type { UICopy } from "@/lib/copy";
import { useUiCopy } from "@/hooks/useUiCopy";
import {
  type LearningCard,
  loadLearningCards,
  persistLearningCards,
  removeReviewEntry,
  countSavedToday,
  countByStatus,
  shouldShowNatural,
  type ReviewLevel,
  applyReviewLevel,
  isReviewQueueCard,
  filterLearningCardsByLanguage,
} from "@/lib/learningCards";
import { useLearningLanguageOptional } from "@/contexts/LearningLanguageContext";
import { DEFAULT_LEARNING_LANGUAGE_CODE } from "@/lib/learningLanguages";

type FilterTab = "all" | "new" | "practicing" | "usable";

function matchesSearch(card: LearningCard, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const pool = [card.original, card.corrected, card.explanation, card.natural ?? ""]
    .join("\n")
    .toLowerCase();
  return pool.includes(q);
}

function matchesTab(card: LearningCard, tab: FilterTab): boolean {
  switch (tab) {
    case "all":
      return true;
    case "new":
      return card.status === "new";
    case "practicing":
      return card.status === "practicing";
    case "usable":
      return card.status === "usable";
    default:
      return true;
  }
}

function formatRelativeDay(timestamp: number | null, ui: UICopy): string | null {
  if (!timestamp) return null;
  const startToday = new Date();
  startToday.setHours(0, 0, 0, 0);
  const reviewedDay = new Date(timestamp);
  reviewedDay.setHours(0, 0, 0, 0);
  const days = Math.max(
    0,
    Math.floor(
      (startToday.getTime() - reviewedDay.getTime()) / (24 * 60 * 60 * 1000),
    ),
  );
  if (days === 0) return ui.progressLastReviewedToday;
  if (days === 1) return ui.progressLastReviewedYesterday;
  return ui.progressLastReviewedDays.replace("{count}", String(days));
}

function ProgressMetadata({ card, ui }: { card: LearningCard; ui: UICopy }) {
  const savedToday = card.createdAt >= new Date().setHours(0, 0, 0, 0);
  const status =
    card.status === "usable"
      ? ui.progressStatusUsable
      : card.status === "practicing"
        ? ui.progressStatusPracticing
        : ui.progressStatusNew;
  const detail =
    card.status === "new"
      ? savedToday
        ? ui.progressSavedToday
        : ui.progressNotReviewed
      : ui.progressReviewCount.replace("{count}", String(card.reviewCount));
  const lastReviewed =
    card.status !== "new" && card.reviewCount > 0
      ? formatRelativeDay(card.lastReviewedAt, ui)
      : null;

  return (
    <div className="flex flex-wrap items-center gap-x-2 text-[11px] font-medium text-slate-500">
      <span className="text-slate-200">{status}</span>
      <span aria-hidden className="text-slate-300">
        ·
      </span>
      <span>{detail}</span>
      {lastReviewed ? (
        <>
          <span aria-hidden className="text-slate-300">
            ·
          </span>
          <span className="font-normal text-slate-400">{lastReviewed}</span>
        </>
      ) : null}
    </div>
  );
}

type LearningBookPanelProps = {
  locale: Locale;
  onLocaleChange?: (locale: Locale) => void;
  showLanguageSelector?: boolean;
};

export function LearningBookPanel({
  locale,
  onLocaleChange,
  showLanguageSelector = false,
}: LearningBookPanelProps) {
  const learningLanguage = useLearningLanguageOptional();
  const targetLanguage =
    learningLanguage?.targetLanguage ?? DEFAULT_LEARNING_LANGUAGE_CODE;
  const [cards, setCards] = useState<LearningCard[]>([]);
  const [reviewCard, setReviewCard] = useState<LearningCard | null>(null);
  const [reviewSessionQueue, setReviewSessionQueue] = useState<
    LearningCard[] | null
  >(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTab, setFilterTab] = useState<FilterTab>("all");
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const [reviewTodayHint, setReviewTodayHint] = useState<string | null>(null);

  const ui = useUiCopy(locale);

  useEffect(() => {
    setCards(loadLearningCards());
  }, []);

  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible") {
        setCards(loadLearningCards());
      }
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, []);

  const languageCards = useMemo(
    () => filterLearningCardsByLanguage(cards, targetLanguage),
    [cards, targetLanguage],
  );

  const sortedCards = useMemo(
    () => [...languageCards].sort((a, b) => b.id - a.id),
    [languageCards],
  );

  const filteredCards = useMemo(() => {
    return sortedCards.filter(
      (card) => matchesSearch(card, searchQuery) && matchesTab(card, filterTab),
    );
  }, [sortedCards, searchQuery, filterTab]);

  const savedToday = useMemo(
    () => countSavedToday(languageCards),
    [languageCards],
  );
  const totalCards = languageCards.length;
  const practicingCount = useMemo(
    () => countByStatus(languageCards, "practicing"),
    [languageCards],
  );
  const usableCount = useMemo(
    () => countByStatus(languageCards, "usable"),
    [languageCards],
  );
  const reviewCta = practicingCount > 0 ? ui.reviewPracticingCta : ui.reviewNewCta;

  const hasCards = languageCards.length > 0;
  const listEmpty = hasCards && filteredCards.length === 0;

  const closeReviewModal = () => {
    setReviewCard(null);
    setReviewSessionQueue(null);
  };

  const handleDelete = (id: number) => {
    const updated = cards.filter((card) => card.id !== id);
    persistLearningCards(updated);
    removeReviewEntry(id);
    setCards(updated);
    setReviewCard((current) => (current?.id === id ? null : current));
    setReviewSessionQueue((q) => {
      if (!q) return q;
      const next = q.filter((c) => c.id !== id);
      return next.length ? next : null;
    });
  };

  const handleRate = (level: ReviewLevel) => {
    if (!reviewCard) {
      return;
    }
    const reviewedCard = applyReviewLevel(reviewCard, level);
    const updatedCards = cards.map((card) =>
      card.id === reviewedCard.id ? reviewedCard : card,
    );
    persistLearningCards(updatedCards);
    setCards(updatedCards);

    if (reviewSessionQueue && reviewSessionQueue.length > 0) {
      const remaining = reviewSessionQueue.filter(
        (c) => c.id !== reviewCard.id,
      );
      if (remaining.length > 0) {
        setReviewSessionQueue(remaining);
        setReviewCard(remaining[0]);
      } else {
        setReviewCard(null);
        setReviewSessionQueue(null);
      }
    } else {
      setReviewCard(null);
    }
  };

  const startReviewToday = () => {
    setReviewTodayHint(null);
    const queue = languageCards.filter(isReviewQueueCard);
    if (queue.length === 0) {
      setReviewTodayHint(ui.reviewTodayEmpty);
      return;
    }
    setReviewSessionQueue(queue);
    setReviewCard(queue[0]);
  };

  const toggleExpanded = (id: number) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filterTabs: { key: FilterTab; label: string }[] = [
    { key: "all", label: ui.filterAll },
    { key: "new", label: ui.filterNew },
    { key: "practicing", label: ui.filterPracticing },
    { key: "usable", label: ui.filterUsable },
  ];

  return (
    <div className="flex h-full min-h-0 flex-col bg-gradient-to-b from-slate-100 to-slate-50">
      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4 pt-4">
        <div className="mx-auto w-full max-w-lg">
          {showLanguageSelector && onLocaleChange ? (
            <div className="mb-4 flex flex-wrap items-center justify-end gap-2">
              <TargetLanguageSelector label={ui.learningLanguageLabel} />
              <LanguageSelector
                locale={locale}
                onChange={onLocaleChange}
                label={ui.uiLanguageLabel}
              />
            </div>
          ) : null}

          <section className="rounded-2xl border border-white/10 bg-[#121212] p-5 shadow-sm">
            <h1 className="text-xl font-semibold tracking-tight text-slate-100">
              {ui.learningBookTitle}
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              {ui.dashboardTotalCardsSubtle.replace(
                "{count}",
                String(totalCards),
              )}
            </p>

            <dl className="mt-5 grid grid-cols-3 gap-2 text-center sm:gap-3">
              <div className="rounded-xl bg-white/5 px-2 py-3">
                <dt className="text-[11px] font-medium tracking-wide text-slate-500">
                  {ui.dashboardSavedToday}
                </dt>
                <dd className="mt-1.5 text-xl font-semibold tabular-nums text-slate-100">
                  {savedToday}
                </dd>
              </div>
              <div className="rounded-xl bg-white/5 px-2 py-3">
                <dt className="text-[11px] font-medium tracking-wide text-slate-500">
                  {ui.dashboardPracticing}
                </dt>
                <dd className="mt-1.5 text-xl font-semibold tabular-nums text-slate-100">
                  {practicingCount}
                </dd>
              </div>
              <div className="rounded-xl bg-white/5 px-2 py-3">
                <dt className="text-[11px] font-medium tracking-wide text-slate-500">
                  {ui.dashboardUsable}
                </dt>
                <dd className="mt-1.5 text-xl font-semibold tabular-nums text-slate-100">
                  {usableCount}
                </dd>
              </div>
            </dl>

            <button
              type="button"
              onClick={startReviewToday}
              className="mt-5 w-full rounded-xl bg-[#e8e8e4] shadow-[0_0_14px_rgba(255,255,255,0.28)] px-4 py-3 text-sm font-medium text-neutral-900 shadow-sm transition hover:bg-[#f5f5f3]"
            >
              {reviewCta}
            </button>
            {reviewTodayHint ? (
              <p className="mt-3 text-center text-sm leading-relaxed text-slate-500">
                {reviewTodayHint}
              </p>
            ) : null}
          </section>

          {hasCards ? (
            <div className="mt-5 space-y-3">
              <label className="sr-only" htmlFor="learning-search">
                {ui.learningSearchPlaceholder}
              </label>
              <input
                id="learning-search"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={ui.learningSearchPlaceholder}
                autoComplete="off"
                className="w-full rounded-xl border border-white/10 bg-[#121212] px-3 py-2.5 text-sm text-slate-100 shadow-sm outline-none ring-slate-400/30 placeholder:text-slate-400 focus:border-white/40 focus:ring-2"
              />

              <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1 pt-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {filterTabs.map(({ key, label }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setFilterTab(key)}
                    className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition ${
                      filterTab === key
                        ? "bg-[#e8e8e4] text-neutral-900"
                        : "border border-white/10 bg-[#121212] text-slate-200 hover:bg-white/10"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-5 space-y-3">
            {!hasCards ? (
              <p className="whitespace-pre-line rounded-2xl border border-dashed border-white/15 bg-white/5 px-4 py-8 text-center text-sm leading-relaxed text-slate-300">
                {ui.learningEmpty}
              </p>
            ) : listEmpty ? (
              <p className="rounded-2xl border border-dashed border-white/15 bg-white/5 px-4 py-8 text-center text-sm text-slate-300">
                {searchQuery.trim()
                  ? ui.learningSearchNoResults
                  : ui.learningFilterEmpty}
              </p>
            ) : (
              filteredCards.map((card) => {
                const isOpen = !!expanded[card.id];
                const showNat = shouldShowNatural(card);
                return (
                  <article
                    key={card.id}
                    className="overflow-hidden rounded-2xl border border-white/10 bg-[#121212] shadow-sm"
                  >
                    <div className="border-b border-white/10 px-3 py-2">
                      <ProgressMetadata card={card} ui={ui} />
                    </div>

                    <div className="space-y-2 px-3 pb-3 pt-2">
                      <AnalyzableEnglish
                        sentence={card.corrected}
                        analyzeLabel={ui.insightAnalyze}
                        sourceType="example"
                        tone="onDark"
                        className={`text-[15px] font-semibold leading-snug text-emerald-100 sm:text-base ${isOpen ? "" : "line-clamp-3"}`}
                      />
                      <AnalyzableEnglish
                        sentence={card.original}
                        analyzeLabel={ui.insightAnalyze}
                        sourceType="example"
                        tone="onDark"
                        className={`text-[13px] leading-snug text-slate-300 sm:text-[14px] ${isOpen ? "" : "line-clamp-3"}`}
                      />
                      {showNat ? (
                        <AnalyzableEnglish
                          sentence={card.natural ?? ""}
                          analyzeLabel={ui.insightAnalyze}
                          sourceType="example"
                          tone="onDark"
                          className={`text-[12px] leading-snug text-[#e4e4e0] sm:text-[13px] ${isOpen ? "" : "line-clamp-3"}`}
                        />
                      ) : null}
                    </div>

                    <div className="border-t border-white/10 px-3 py-2">
                      <button
                        type="button"
                        onClick={() => toggleExpanded(card.id)}
                        className="text-xs font-medium text-slate-300 underline-offset-2 hover:text-white hover:underline"
                      >
                        {isOpen ? ui.cardHideDetails : ui.cardShowDetails}
                      </button>
                    </div>

                    {isOpen ? (
                      <div className="space-y-3 border-t border-white/10 bg-white/5 px-3 py-3">
                        {card.explanation.trim() ? (
                          <div>
                            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                              {ui.cardPoint}
                            </p>
                            <p className="mt-1 text-sm leading-relaxed text-slate-200">
                              {card.explanation}
                            </p>
                          </div>
                        ) : null}
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setReviewSessionQueue(null);
                              setReviewCard(card);
                            }}
                            className="rounded-lg border border-white/10 bg-[#121212] px-3 py-2 text-xs font-medium text-slate-100 shadow-sm transition hover:border-white/15 hover:bg-white/10"
                          >
                            {ui.practiceAgain}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(card.id)}
                            className="rounded-lg border border-rose-400/30 bg-rose-500/15 px-3 py-2 text-xs font-medium text-rose-200 transition hover:bg-rose-500/25"
                          >
                            {ui.deleteFromBook}
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </article>
                );
              })
            )}
          </div>
        </div>
      </div>

      <LearningReviewModal
        key={reviewCard?.id ?? "closed"}
        card={reviewCard}
        ui={ui}
        onClose={closeReviewModal}
        onRate={(level) => handleRate(level)}
      />
    </div>
  );
}

export function readAppLocale(): Locale {
  if (typeof window === "undefined") return "ko";
  try {
    const raw = localStorage.getItem(APP_LOCALE_STORAGE_KEY);
    if (raw && isLocale(raw)) return raw;
  } catch {
    // ignore
  }
  return "ko";
}
