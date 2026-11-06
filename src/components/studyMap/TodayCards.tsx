"use client";

import { useEffect, useMemo, useState } from "react";
import type { UICopy } from "@/lib/copy";
import { usePremium } from "@/contexts/PremiumContext";
import { sendAppIntent } from "@/lib/appIntents";
import { useBankTone } from "@/components/studyMap/bankTone";
import { LEDGER_EVENT, readLedger } from "@/lib/curriculum/logLedger";
import { checkStates } from "@/lib/curriculum/checkState";
import { cardsForDay, doneOf, parseCards, pickCards, type TodayCard, type TodayCards as Saved } from "@/lib/curriculum/todayCards";
import { focusQuiz } from "@/lib/curriculum/quizFocus";
import { localDay } from "@/lib/curriculum/resume";

/**
 * Logbank 맨 위 "오늘" 카드(개편 3단계, 스위치 lib/reform.ts — 설계 hub/drafts/no-today-2026-11-05.md 8절 B안).
 * 카드마다 이름 · 근거 숫자 한 줄 · 문 하나(▶ Quizbank 또는 📞 공부). 그날 처음 정하고 하루 그대로, 끝은 사건으로 ✓.
 * 고르기·끝 셈은 curriculum/todayCards.ts, 이 폰의 장부(logbank.v1.<언어>)만.
 */
const KEY = "todayCards.v1";

function readSaved(language: string): Saved | null {
  try {
    return parseCards(localStorage.getItem(`${KEY}.${language}`));
  } catch {
    return null;
  }
}

/** 그날 카드(없거나 날이 바뀌었으면 새로 고르고 저장)와 카드마다 끝났나. */
function buildView(language: string, canCall: boolean): { today: Saved; done: boolean[] } {
  const events = readLedger(language);
  const now = Math.floor(Date.now() / 1000);
  const saved = readSaved(language);
  const today = cardsForDay(saved, localDay(), () => pickCards({ events, states: checkStates(events), now, canCall }), now);
  if (today !== saved) {
    try {
      localStorage.setItem(`${KEY}.${language}`, JSON.stringify(today));
    } catch {
      // 이번에만(다시 열면 다시 고름).
    }
  }
  return { today, done: today.cards.map((card) => doneOf(card, events, today.at)) };
}

export function TodayCards({ ui, language }: { ui: UICopy; language: string }) {
  const tone = useBankTone();
  const { isPremium } = usePremium();
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const on = (event: Event) => {
      const detail = (event as CustomEvent<{ language?: string }>).detail;
      if (!detail?.language || detail.language === language) setTick((n) => n + 1);
    };
    window.addEventListener(LEDGER_EVENT, on);
    return () => window.removeEventListener(LEDGER_EVENT, on);
  }, [language]);
  const view = useMemo(() => {
    void tick;
    return buildView(language, isPremium);
  }, [language, tick, isPremium]);
  const allDone = view.done.length > 0 && view.done.every(Boolean);
  return (
    <section data-today-cards className="flex flex-col gap-2 rounded-xl border border-line p-3">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-note font-semibold text-ink">{ui.lbToday}</h3>
        {allDone ? <span data-today-done className="text-caption text-good">✓ {ui.planAllDone}</span> : null}
      </div>
      {view.today.cards.map((card, index) => (
        <CardRow key={`${card.kind}-${index}`} ui={ui} card={card} done={view.done[index] ?? false} soft={tone.soft} language={language} />
      ))}
    </section>
  );
}

function partLabel(ui: UICopy, part: TodayCard["part"]): string {
  if (part === "word") return ui.partVocab;
  if (part === "grammar") return ui.partGrammar;
  if (part === "expression") return ui.partExpression;
  if (part === "frame") return ui.framesTitle;
  return "";
}

function CardRow({ ui, card, done, soft, language }: { ui: UICopy; card: TodayCard; done: boolean; soft: string; language: string }) {
  const n = String(card.n);
  const title = { check: ui.lbCardCheck, stuck: ui.lbCardStuck, hard: ui.lbCardHard, try: ui.lbCardTry, new: ui.lbCardNew }[card.kind];
  const why =
    card.kind === "hard"
      ? `${partLabel(ui, card.part)} ${n}`
      : { check: ui.lbWhyCheck, stuck: ui.lbWhyStuck, try: ui.lbWhyTry, new: ui.lbWhyNew }[card.kind].replace("{n}", n);
  const call = card.kind === "try";
  const go = () => {
    if (call) {
      sendAppIntent("practice", { tab: "roleplay", goal: { phrases: card.keys.map((key) => key.slice(2)) }, title });
      return;
    }
    focusQuiz(language, card.keys);
  };
  return (
    <button
      type="button"
      data-today-card={card.kind}
      data-done={done ? "1" : undefined}
      onClick={go}
      className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-start ${done ? "border-line opacity-60" : soft}`}
    >
      <span aria-hidden className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-caption ${done ? "border-good text-good" : "border-line text-slate-400"}`}>
        {done ? "✓" : ""}
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="text-chat font-semibold text-ink">{title}</span>
        <span className="text-caption text-slate-400">{why}</span>
      </span>
      <span className="shrink-0 text-caption text-slate-300">{call ? `📞 ${ui.callModeStudy}` : `▶ ${ui.keepTitle}`}</span>
    </button>
  );
}
