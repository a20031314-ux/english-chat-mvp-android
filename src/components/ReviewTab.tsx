"use client";

import { useCallback, useEffect, useState } from "react";
import { LanguageSelector } from "@/components/LanguageSelector";
import { TTSButton } from "@/components/TTSButton";
import { AnalyzableEnglish } from "@/components/AnalyzableEnglish";
import type { Locale, UICopy } from "@/lib/copy";
import {
  REVIEW_BUSY_EVENT,
  REVIEW_PACK_UPDATED_EVENT,
  clearReviewQueue,
  completeReviewPack,
  loadReviewQueue,
  uniqueReviewSentences,
  type ReviewCard,
  type ReviewPack,
} from "@/lib/reviewMaterials";

type ReviewTabProps = {
  locale: Locale;
  ui: UICopy;
  onLocaleChange: (locale: Locale) => void;
  onGoChat: () => void;
};

type Filter = "all" | "grammar" | "vocabulary";

function sectionTitle(pack: ReviewPack, index: number, ui: UICopy): string {
  if (pack.reportTitle.trim()) return pack.reportTitle.trim();
  return ui.reviewSectionFallback.replace("{n}", String(index + 1));
}

function filteredCards(pack: ReviewPack, filter: Filter): ReviewCard[] {
  if (filter === "all") return pack.cards;
  return pack.cards.filter((card) => card.kind === filter);
}

export function ReviewTab({
  locale,
  ui,
  onLocaleChange,
  onGoChat,
}: ReviewTabProps) {
  const [packs, setPacks] = useState<ReviewPack[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [ready, setReady] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const refresh = useCallback(() => {
    setPacks(loadReviewQueue().packs);
    setReady(true);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    const onUpdated = () => refresh();
    const onBusy = (event: Event) => {
      const busy = Boolean((event as CustomEvent<{ busy?: boolean }>).detail?.busy);
      setIsGenerating(busy);
    };
    window.addEventListener(REVIEW_PACK_UPDATED_EVENT, onUpdated);
    window.addEventListener(REVIEW_BUSY_EVENT, onBusy);
    return () => {
      window.removeEventListener(REVIEW_PACK_UPDATED_EVENT, onUpdated);
      window.removeEventListener(REVIEW_BUSY_EVENT, onBusy);
    };
  }, [refresh]);

  const visiblePacks = packs
    .map((pack, index) => ({
      pack,
      index,
      cards: filteredCards(pack, filter),
    }))
    .filter((item) => item.cards.length > 0);

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#121212] shadow-lg">
      <header className="flex shrink-0 items-center justify-between gap-2 border-b border-white/10 px-4 py-3">
        <h1 className="text-base font-semibold text-slate-100">{ui.homeTabQuiz}</h1>
        <div className="flex items-center gap-2">
          {packs.length > 0 ? (
            <button
              type="button"
              onClick={() => clearReviewQueue()}
              className="rounded-full px-3 py-1 text-xs font-medium text-slate-500 hover:bg-white/10 hover:text-white"
            >
              {ui.reviewResetCta}
            </button>
          ) : null}
          <LanguageSelector
            locale={locale}
            onChange={onLocaleChange}
            label={ui.uiLanguageLabel}
          />
        </div>
      </header>

      <div className="flex shrink-0 gap-2 border-b border-white/10 px-4 py-2">
        {(
          [
            ["all", ui.reviewFilterAll],
            ["grammar", ui.reviewFilterGrammar],
            ["vocabulary", ui.reviewFilterVocab],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setFilter(id)}
            className={`rounded-full px-3 py-1 text-sm ${
              filter === id
                ? "bg-[#e8e8e4] text-neutral-900"
                : "bg-white/10 text-slate-300 hover:bg-white/15"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6">
        {!ready ? (
          <p className="py-10 text-center text-sm text-slate-500">{ui.quizLoading}</p>
        ) : packs.length === 0 && !isGenerating ? (
          <div className="mx-auto flex max-w-lg flex-col items-center py-16 text-center">
            <p className="text-sm leading-relaxed text-slate-300">
              {ui.reviewEmptyBody}
            </p>
            <button
              type="button"
              onClick={onGoChat}
              className="mt-8 rounded-2xl bg-[#e8e8e4] px-5 py-3 text-sm font-medium text-neutral-900 hover:bg-[#f5f5f3]"
            >
              {ui.quizEmptyCta}
            </button>
          </div>
        ) : (
          <div className="mx-auto flex w-full max-w-lg flex-col gap-8">
            {isGenerating ? (
              <p className="text-center text-sm text-slate-500">
                {ui.reviewGenerating}
              </p>
            ) : null}
            {visiblePacks.map(({ pack, index, cards }) => (
              <section key={pack.reportId} className="flex flex-col gap-4">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="min-w-0 truncate text-sm font-semibold text-slate-100">
                    {sectionTitle(pack, index, ui)}
                  </h2>
                  <button
                    type="button"
                    onClick={() => completeReviewPack(pack.reportId)}
                    className="shrink-0 rounded-full bg-[#e8e8e4] px-3 py-1.5 text-xs font-medium text-neutral-900 hover:bg-[#f5f5f3]"
                  >
                    {ui.reviewCompleteCta}
                  </button>
                </div>
                {cards.map((card) => (
                  <ReviewCardView
                    key={`${pack.reportId}-${card.kind}-${card.id}`}
                    card={card}
                    ui={ui}
                  />
                ))}
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ReviewCardView({ card, ui }: { card: ReviewCard; ui: UICopy }) {
  if (card.kind === "grammar") {
    return (
      <article className="rounded-2xl border border-white/10 p-4">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          {ui.reviewFilterGrammar}
        </p>
        {card.original &&
        card.corrected &&
        card.original !== card.corrected ? (
          <div className="mt-3 space-y-2 rounded-xl bg-white/5 px-3 py-3 text-sm">
            <div className="text-slate-500">
              {ui.reviewMySentence}:{" "}
              <AnalyzableEnglish
                sentence={card.original}
                inline
                analyzeLabel={ui.insightAnalyze}
                sourceType="example"
                tone="onDark"
                className="text-slate-100"
              />
            </div>
            <div className="text-slate-500">
              {ui.reviewBetterSentence}:{" "}
              <AnalyzableEnglish
                sentence={card.corrected}
                inline
                analyzeLabel={ui.insightAnalyze}
                sourceType="example"
                tone="onDark"
                className="font-medium text-[#e4e4e0]"
              />
            </div>
          </div>
        ) : null}
        <p className="mt-3 text-sm leading-relaxed text-slate-200">
          {card.explanation}
        </p>
        <ExampleList
          label={ui.reviewExamples}
          analyzeLabel={ui.insightAnalyze}
          examples={uniqueReviewSentences(card.examples, [
            card.original,
            card.corrected,
          ])}
        />
      </article>
    );
  }

  return (
    <article className="rounded-2xl border border-white/10 p-4">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
        {ui.reviewFilterVocab}
      </p>
      <AnalyzableEnglish
        sentence={card.word}
        tone="onDark"
        className="mt-1 text-xl font-semibold text-slate-100"
      />
      <div className="mt-3 space-y-4">
        {card.senses.map((sense, index) => (
          <div key={`${card.id}-s-${index}`}>
            <p className="text-sm font-medium text-slate-100">{sense.gloss}</p>
            <ExampleList
              examples={sense.examples}
              analyzeLabel={ui.insightAnalyze}
            />
          </div>
        ))}
      </div>
      {card.similar.length > 0 ? (
        <div className="mt-4 border-t border-white/10 pt-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            {ui.reviewSimilar}
          </p>
          <ul className="mt-2 space-y-1.5">
            {card.similar.map((item) => (
              <li key={`${card.id}-${item.word}`} className="text-sm text-slate-200">
                <AnalyzableEnglish
                  sentence={item.word}
                  inline
                  tone="onDark"
                  className="font-medium text-slate-100"
                />
                <span className="text-slate-500"> — {item.gloss}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </article>
  );
}

function ExampleList({
  label,
  examples,
  analyzeLabel,
}: {
  label?: string;
  examples: string[];
  analyzeLabel?: string;
}) {
  if (examples.length === 0) return null;
  return (
    <div className="mt-3 space-y-2">
      {label ? (
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          {label}
        </p>
      ) : null}
      {examples.map((example) => (
        <div key={example} className="flex items-start justify-between gap-2">
          <AnalyzableEnglish
            sentence={example}
            analyzeLabel={analyzeLabel}
            sourceType="example"
            tone="onDark"
            className="text-sm leading-relaxed text-slate-200"
          />
          <TTSButton text={example} />
        </div>
      ))}
    </div>
  );
}
