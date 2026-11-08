"use client";

import { TodayGrowth } from "@/components/studyMap/Growth";
import { useEffect, useMemo, useState } from "react";
import type { UICopy } from "@/lib/copy";
import { usePremium } from "@/contexts/PremiumContext";
import { sendAppIntent } from "@/lib/appIntents";
import { AiAvatar } from "@/components/AiTutorProfile";
import { readHomework, type Homework } from "@/lib/roleplay/replay";
import { readCalls } from "@/lib/roleplay/callStore";
import { useBankTone } from "@/components/studyMap/bankTone";
import { LEDGER_EVENT, readLedger } from "@/lib/curriculum/logLedger";
import { checkStates } from "@/lib/curriculum/checkState";
import { cardsForDay, doneOf, parseCards, pickCards, type TodayCard, type TodayCards as Saved } from "@/lib/curriculum/todayCards";
import { focusQuiz } from "@/lib/curriculum/quizFocus";
import { localDay } from "@/lib/curriculum/resume";
import { needsLetters, useLettersFirst } from "@/lib/curriculum/lettersFirst";
import { openLettersBank } from "@/lib/curriculum/lettersOpen";
import { useScript } from "@/components/studyMap/ScriptPractice";

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

/**
 * 0단계(글자부터, curriculum/lettersFirst.ts)면 카드 하나 — 오늘의 글자 묶음 → Languagebank 글자·소리 칸(2026-11-07 점검: 준호 카드 ▶ Quizbank가
 * Languagebank 첫 화면으로 떨어짐 — 0단계엔 Quizbank 칸이 없음). 그날 처음 고른 묶음을 지나면 ✓(todayLetters.v1).
 */
export function TodayCards({ ui, language, locale }: { ui: UICopy; language: string; locale: string }) {
  const [lettersFlag] = useLettersFirst(language);
  if (lettersFlag && needsLetters(language)) return <LettersToday ui={ui} language={language} locale={locale} />;
  return <QuizToday ui={ui} language={language} />;
}

const LETTERS_KEY = "todayLetters.v1";

function lettersTarget(language: string, next: string | null): string | null {
  const day = localDay();
  try {
    const kept = JSON.parse(localStorage.getItem(`${LETTERS_KEY}.${language}`) ?? "null") as { day: string; group: string } | null;
    if (kept?.day === day && kept.group) return kept.group;
    if (next) localStorage.setItem(`${LETTERS_KEY}.${language}`, JSON.stringify({ day, group: next }));
  } catch {
    // 이번에만.
  }
  return next;
}

function LettersToday({ ui, language, locale }: { ui: UICopy; language: string; locale: string }) {
  const tone = useBankTone();
  const { isPremium } = usePremium();
  const [data] = useScript(language, locale, isPremium);
  const groups = data?.course?.groups ?? [];
  const passed = new Set(data?.passed ?? []);
  const next = groups.find((group) => !passed.has(group.id))?.id ?? null;
  // 그날 처음 고른 묶음을 하루 그대로(이 폰).
  const target = data?.course ? lettersTarget(language, next) : null;
  const group = groups.find((one) => one.id === target);
  if (!data?.course || !group) return null;
  const done = passed.has(group.id);
  return (
    <section data-today-cards className="flex flex-col gap-2 rounded-xl border border-line p-3">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-note font-semibold text-ink">{ui.lbToday}</h3>
        {done ? <span data-today-done className="text-caption text-good">✓ {ui.planAllDone}</span> : null}
      </div>
      <TodayGrowth ui={ui} language={language} />
      <button
        type="button"
        data-today-card="letters"
        data-done={done ? "1" : undefined}
        onClick={() => openLettersBank(language)}
        className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-start ${done ? "border-line opacity-60" : tone.soft}`}
      >
        <span aria-hidden className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-caption ${done ? "border-good text-good" : "border-line text-slate-400"}`}>
          {done ? "✓" : ""}
        </span>
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="text-chat font-semibold text-ink">{ui.notebookScript}</span>
          <span dir="auto" className="truncate text-caption text-slate-400">
            {group.title} · {group.items.map((item) => item.char).join(" ")}
          </span>
        </span>
        <span className="shrink-0 text-caption text-slate-300">▶ {ui.languagebankTitle}</span>
      </button>
    </section>
  );
}

function QuizToday({ ui, language }: { ui: UICopy; language: string }) {
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
      <TodayGrowth ui={ui} language={language} />
      <HomeworkRow ui={ui} language={language} />
      {view.today.cards.map((card, index) => (
        <CardRow key={`${card.kind}-${index}`} ui={ui} card={card} done={view.done[index] ?? false} soft={tone.soft} language={language} />
      ))}
      <LessonDoor ui={ui} />
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

/**
 * 수업 통화 문(2026-11-07 사용자 "커리큘럼과 자유대화는 외부에서 분리"): My에서만 연다 — 📞(대화·사람 탭)은 자유대화.
 * 튜터가 큰 실수를 말로 짚고 다시 말해 보게 하는 통화(RoleplayScreen lesson). 통화 기록에도 수업으로 따로 남음.
 */
function LessonDoor({ ui }: { ui: UICopy }) {
  return (
    <button
      type="button"
      data-today-lesson
      onClick={() => sendAppIntent("startCall", { lesson: true })}
      className="flex w-full items-center gap-3 rounded-xl border border-line px-3 py-2.5 text-start hover:bg-white/5"
    >
      <span aria-hidden className="flex h-6 w-6 shrink-0 items-center justify-center text-title">📞</span>
      <span className="min-w-0 flex-1 text-chat font-semibold text-ink">{ui.callModeStudy}</span>
      <span aria-hidden className="shrink-0 text-caption text-slate-300">›</span>
    </button>
  );
}

/**
 * 수업 숙제 한 줄(2026-11-08, 설계 call-modes 5절 — 지금 종류는 🎭 이렇게도 말할 수 있었어요): 튜터 얼굴 + 숙제 + 🎭.
 * 누르면 그 통화 돌아보기에서 장면을 바로 연다(openCall replay). 끝냈으면 ✓, 그 통화 기록이 지워졌으면 안 보임.
 */
function HomeworkRow({ ui, language }: { ui: UICopy; language: string }) {
  const [homework, setHomework] = useState<Homework | null>(null);
  useEffect(() => {
    const load = () => {
      try {
        const row = readHomework(globalThis.localStorage, language);
        setHomework(row && readCalls().some((call) => call.id === row.callId) ? row : null);
      } catch {
        setHomework(null);
      }
    };
    load();
    window.addEventListener("focus", load);
    window.addEventListener("storage", load);
    return () => {
      window.removeEventListener("focus", load);
      window.removeEventListener("storage", load);
    };
  }, [language]);
  if (!homework) return null;
  return (
    <button
      type="button"
      data-today-homework={homework.done ? "done" : "open"}
      onClick={() => sendAppIntent("openCall", { id: homework.callId, replay: true })}
      className="flex w-full items-center gap-3 rounded-xl border border-line px-3 py-2.5 text-start hover:bg-white/5"
    >
      <AiAvatar size={24} language={language} />
      <span className="min-w-0 flex-1 truncate text-chat font-semibold text-ink">
        {ui.homeworkTag} · 🎭 {ui.replayTitle}
      </span>
      <span aria-hidden className="shrink-0 text-caption text-slate-300">{homework.done ? "✓" : "›"}</span>
    </button>
  );
}
