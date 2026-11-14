"use client";

import { Fragment, useEffect, useMemo, useState, type ReactNode } from "react";
import type { UICopy } from "@/lib/copy";
import { usePremium } from "@/contexts/PremiumContext";
import { sendAppIntent } from "@/lib/appIntents";
import { AiAvatar, AiTutorSheet } from "@/components/AiTutorProfile";
import { chatPartnerForLanguage } from "@/lib/chatPartner";
import { useTutorGender } from "@/lib/tutorGender";
import { scenariosForLanguage } from "@/lib/roleplay/catalog";
import { readHomework, type Homework } from "@/lib/roleplay/replay";
import { readCalls, subscribeCalls } from "@/lib/roleplay/callStore";
import { LEDGER_EVENT, readLedger } from "@/lib/curriculum/logLedger";
import { dayOfSeconds } from "@/lib/curriculum/checkState";
import { answeredToday, TODAY_GOAL } from "@/lib/curriculum/todayCards";
import { focusQuiz } from "@/lib/curriculum/quizFocus";
import { localDay } from "@/lib/curriculum/resume";
import { needsLetters, useLettersFirst } from "@/lib/curriculum/lettersFirst";
import { openLettersBank } from "@/lib/curriculum/lettersOpen";
import { useScript } from "@/components/studyMap/ScriptPractice";
import { TodaySlot, TodayTimeline } from "@/components/studyMap/Logbank";

/**
 * 오늘의 학습(My 맨 위, 프로필 카드 아래) = 오늘 타임라인(사용자 2026-11-14 "기준이 모호해 · Logbank에 이미 일일 타임라인 — 타임라인 중심으로 합치기, 구체화해서"):
 * 위는 오늘 한 학습 시간 줄(Logbank 그날 세부와 같은 줄 — TodayTimeline), 이어서 오늘 할 것 칸(TodaySlot):
 * ▶ Quizbank(기준 n/10 — 오늘 답한 서로 다른 것, 0단계면 오늘의 글자 묶음) · 고른 튜터와 통화(누르면 튜터 프로필 — 문 넷) · 숙제(있을 때).
 * 칸마다 끝나면 ✓, 다 끝나면 제목 옆 ✓. 날마다 지난 기록은 Logbank.
 */
export function TodayCards({ ui, language, locale, grammarName }: { ui: UICopy; language: string; locale: string; grammarName?: (stage: number, index: number) => string }) {
  const [lettersFlag] = useLettersFirst(language);
  const letters = lettersFlag && needsLetters(language);
  const answered = useQuizCount(language);
  const quiz = answered >= TODAY_GOAL;
  const called = useCalledToday(language);
  const tutor = useTutorGender(language);
  const [profile, setProfile] = useState(false);
  const homework = useHomework(language);
  const [lettersDone, setLettersDone] = useState(false);
  type Row = { id: string; done: boolean; render: (last: boolean) => ReactNode };
  const rows: Row[] = [];
  if (letters) rows.push({ id: "letters", done: lettersDone, render: (last) => <LettersRow ui={ui} language={language} locale={locale} last={last} onDone={setLettersDone} /> });
  else
    rows.push({
      id: "quiz",
      done: quiz,
      render: (last) => (
        <TodaySlot kind="study" done={quiz} last={last} icon="▶" name={ui.keepTitle} goal={`${Math.min(answered, TODAY_GOAL)}/${TODAY_GOAL}`} onClick={() => focusQuiz(language, [])} />
      ),
    });
  if (homework) {
    rows.push({
      id: "homework",
      done: Boolean(homework.done),
      render: (last) => (
        <TodaySlot
          kind="homework"
          done={Boolean(homework.done)}
          last={last}
          icon={<AiAvatar size={22} language={language} />}
          name={ui.homeworkTag}
          onClick={() => sendAppIntent("openCall", { id: homework.callId, replay: true })}
        />
      ),
    });
  }
  // 고른 튜터 한 칸(사용자 2026-11-14 "수업이 다른 방식이랑 같은 층위 — 튜터로"): 누르면 튜터 프로필(문 넷 · 메모 · 통화 기록), 오늘 어떤 모드든 통화 한 번이면 ✓.
  rows.push({
    id: "tutor",
    done: called,
    render: (last) => (
      <TodaySlot
        kind="tutor"
        done={called}
        last={last}
        icon={<AiAvatar size={22} language={language} gender={tutor} />}
        name={ui.todayTutorCall.replace("{name}", chatPartnerForLanguage(language, tutor).givenName)}
        onClick={() => setProfile(true)}
      />
    ),
  });
  const allDone = rows.every((one) => one.done);
  return (
    <section data-today-cards className="flex flex-col gap-2 rounded-xl border border-line p-3">
      <TodayTimeline
        ui={ui}
        language={language}
        locale={locale}
        grammarName={grammarName}
        title={
          <>
            <h3 className="text-note font-semibold text-ink">{ui.notebookToday}</h3>
            {allDone ? <span data-today-done aria-label={ui.planAllDone} className="text-caption text-good">✓</span> : null}
          </>
        }
      >
        {rows.map((one, i) => (
          <Fragment key={one.id}>{one.render(i === rows.length - 1)}</Fragment>
        ))}
      </TodayTimeline>
      {profile ? <AiTutorSheet ui={ui} targetLanguage={language} canCall={scenariosForLanguage(language).length > 0} gender={tutor} onClose={() => setProfile(false)} /> : null}
    </section>
  );
}

/** 오늘 퀴즈로 답한 서로 다른 열쇠 수(todayCards.ts answeredToday) — TODAY_GOAL 이상이면 ✓. */
function useQuizCount(language: string): number {
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
  return useMemo(() => {
    void tick;
    return answeredToday(readLedger(language), today, (t) => dayOfSeconds(t));
  }, [language, tick, today]);
}

/** 오늘 이 언어로 통화를 한 번이라도 했으면 ✓ — 모드는 가리지 않음(통화 기록, 이 폰 — 사용자 2026-11-14 튜터 한 칸). 통화 기록엔 튜터가 없어 언어로만 본다. */
function useCalledToday(language: string): boolean {
  const [tick, setTick] = useState(0);
  useEffect(() => subscribeCalls(() => setTick((n) => n + 1)), []);
  return useMemo(() => {
    void tick;
    const today = localDay();
    return readCalls().some((call) => call.language === language && (localDay(new Date(call.startedAt)) === today || localDay(new Date(call.updatedAt)) === today));
  }, [language, tick]);
}

/** 수업 숙제(있고, 그 통화 기록이 남아 있을 때만). 누르면 그 통화 돌아보기 위 숙제 화면(openCall replay → CallReplay HomeworkSheet). */
function useHomework(language: string): Homework | null {
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
    const off = subscribeCalls(load);
    window.addEventListener("focus", load);
    window.addEventListener("storage", load);
    return () => {
      off();
      window.removeEventListener("focus", load);
      window.removeEventListener("storage", load);
    };
  }, [language]);
  return homework;
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

/**
 * 0단계(글자부터, curriculum/lettersFirst.ts)면 퀴즈 줄 자리에 오늘의 글자 묶음 → Languagebank 글자·소리 칸
 * (0단계엔 Quizbank 칸이 없음). 그날 처음 고른 묶음을 지나면 ✓(todayLetters.v1).
 */
function LettersRow({ ui, language, locale, last, onDone }: { ui: UICopy; language: string; locale: string; last: boolean; onDone: (done: boolean) => void }) {
  const { isPremium } = usePremium();
  const [data] = useScript(language, locale, isPremium);
  const groups = data?.course?.groups ?? [];
  const passed = new Set(data?.passed ?? []);
  const next = groups.find((group) => !passed.has(group.id))?.id ?? null;
  // 그날 처음 고른 묶음을 하루 그대로(이 폰).
  const target = data?.course ? lettersTarget(language, next) : null;
  const group = groups.find((one) => one.id === target);
  const done = Boolean(group && passed.has(group.id));
  useEffect(() => onDone(done), [done, onDone]);
  if (!data?.course || !group) return null;
  return (
    <TodaySlot
      kind="letters"
      done={done}
      last={last}
      icon="▶"
      name={ui.notebookScript}
      sub={`${group.title} · ${group.items.map((item) => item.char).join(" ")}`}
      onClick={() => openLettersBank(language)}
    />
  );
}
