"use client";

import { TodayGrowth, TodayTitle } from "@/components/studyMap/Growth";
import { useEffect, useMemo, useState } from "react";
import type { UICopy } from "@/lib/copy";
import { usePremium } from "@/contexts/PremiumContext";
import { sendAppIntent } from "@/lib/appIntents";
import { AiAvatar } from "@/components/AiTutorProfile";
import { readHomework, type Homework } from "@/lib/roleplay/replay";
import { readCalls } from "@/lib/roleplay/callStore";
import { useBankTone } from "@/components/studyMap/bankTone";
import { LEDGER_EVENT, readLedger } from "@/lib/curriculum/logLedger";
import { dayOfSeconds } from "@/lib/curriculum/checkState";
import { answeredToday, TODAY_GOAL } from "@/lib/curriculum/todayCards";
import { focusQuiz } from "@/lib/curriculum/quizFocus";
import { localDay } from "@/lib/curriculum/resume";
import { needsLetters, useLettersFirst } from "@/lib/curriculum/lettersFirst";
import { openLettersBank } from "@/lib/curriculum/lettersOpen";
import { useScript } from "@/components/studyMap/ScriptPractice";

/**
 * Logbank 맨 위 "오늘"(2026-11-09 사용자 "합쳐줘, 써 보기는 없애줘"): 오늘 숫자(TodayGrowth) · 숙제 줄 · ▶ Quizbank 하나 · 📞 수업.
 * 갈래(막힌 것·다시 학습·새로 학습)는 화면에 없음 — 무엇을 낼지는 Quizbank가 todayCards.ts reviewKeys 순서로. ✓ = 오늘 답한 열쇠 TODAY_GOAL 이상.
 */
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
        <TodayTitle ui={ui} language={language} />
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
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const on = (event: Event) => {
      const detail = (event as CustomEvent<{ language?: string }>).detail;
      if (!detail?.language || detail.language === language) setTick((n) => n + 1);
    };
    window.addEventListener(LEDGER_EVENT, on);
    return () => window.removeEventListener(LEDGER_EVENT, on);
  }, [language]);
  const [today] = useState(() => dayOfSeconds(Math.floor(Date.now() / 1000)));
  const done = useMemo(() => {
    void tick;
    return answeredToday(readLedger(language), today, (t) => dayOfSeconds(t)) >= TODAY_GOAL;
  }, [language, tick, today]);
  return (
    <section data-today-cards className="flex flex-col gap-2 rounded-xl border border-line p-3">
      <div className="flex items-center justify-between gap-2">
        <TodayTitle ui={ui} language={language} />
        {done ? <span data-today-done className="text-caption text-good">✓ {ui.planAllDone}</span> : null}
      </div>
      <TodayGrowth ui={ui} language={language} />
      <HomeworkRow ui={ui} language={language} />
      <button
        type="button"
        data-today-card="study"
        data-done={done ? "1" : undefined}
        onClick={() => focusQuiz(language, [])}
        className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-start ${done ? "border-line" : tone.soft}`}
      >
        <span aria-hidden className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-caption ${done ? "border-good text-good" : "border-line text-slate-400"}`}>
          {done ? "✓" : ""}
        </span>
        <span className="min-w-0 flex-1 text-chat font-semibold text-ink">{ui.keepTitle}</span>
        <span aria-hidden className="shrink-0 text-caption text-slate-300">▶</span>
      </button>
      <LessonDoor ui={ui} />
    </section>
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
 * 수업 숙제 한 줄(2026-11-08, 설계 call-modes 5절): 튜터 얼굴 + 숙제 · 퀴즈 · 대화(🎭는 Room 게임과 겹쳐 뺌).
 * 누르면 그 통화 돌아보기 위에 숙제 화면 [퀴즈 | 대화](openCall replay → roleplay/CallReplay HomeworkSheet). 끝냈으면 ✓, 그 통화 기록이 지워졌으면 안 보임.
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
        {ui.homeworkTag}
        <span className="ms-2 font-normal text-slate-400">
          {ui.quizTag} · {ui.homeworkTalk}
        </span>
      </span>
      <span aria-hidden className="shrink-0 text-caption text-slate-300">{homework.done ? "✓" : "›"}</span>
    </button>
  );
}
