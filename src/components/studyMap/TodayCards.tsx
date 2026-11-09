"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import type { UICopy } from "@/lib/copy";
import { usePremium } from "@/contexts/PremiumContext";
import { sendAppIntent } from "@/lib/appIntents";
import { AiAvatar } from "@/components/AiTutorProfile";
import { FullScreenLayer } from "@/components/FullScreenLayer";
import { FirstCheck } from "@/components/studyMap/FirstCheck";
import { readHomework, type Homework } from "@/lib/roleplay/replay";
import { readCalls, subscribeCalls } from "@/lib/roleplay/callStore";
import { LEDGER_EVENT, readLedger } from "@/lib/curriculum/logLedger";
import { dayOfSeconds } from "@/lib/curriculum/checkState";
import { answeredToday, TODAY_GOAL } from "@/lib/curriculum/todayCards";
import { focusQuiz } from "@/lib/curriculum/quizFocus";
import { localDay } from "@/lib/curriculum/resume";
import { needsLetters, useLettersFirst } from "@/lib/curriculum/lettersFirst";
import { openLettersBank } from "@/lib/curriculum/lettersOpen";
import { readFirstCheck } from "@/lib/curriculum/firstCheck";
import { checkHistory, readRechecks, recheckDue, SKILL_CHECK_EVENT } from "@/lib/curriculum/skillCheck";
import { maybeShowInterstitial } from "@/lib/ads";
import { useScript } from "@/components/studyMap/ScriptPractice";

/**
 * 오늘의 학습(My 맨 위, 프로필 카드 아래 — 사용자 2026-11-10 "데이터 기록을 제외한 학습 요소는 사용자 프로필에 통합,
 * 오늘의 학습·수업·실력 확인 다 같은 층위로" → "오늘의 학습 안에 수업·실력 확인·숙제 다 넣기" → "숫자는 필요 없으면 넣지 마").
 * 오늘 할 것만 같은 모양 줄로: ▶ 퀴즈(0단계면 오늘의 글자 묶음) · 숙제(있을 때) · 📞 수업 · 📏 실력 확인(14일이 된 날만).
 * 줄마다 끝나면 ✓, 다 끝나면 제목 옆 ✓. 숫자·설명 글 없음(DESIGN.md "값 꼬리표"). 기록(지난 확인 표·배운 것)은 Logbank.
 */
export function TodayCards({ ui, language, locale }: { ui: UICopy; language: string; locale: string }) {
  const [lettersFlag] = useLettersFirst(language);
  const letters = lettersFlag && needsLetters(language);
  const quiz = useQuizDone(language);
  const lesson = useLessonDone(language);
  const homework = useHomework(language);
  const check = useSkillCheck(language);
  const [lettersDone, setLettersDone] = useState(false);
  const rows: { id: string; done: boolean; node: ReactNode }[] = [];
  if (letters) rows.push({ id: "letters", done: lettersDone, node: <LettersRow ui={ui} language={language} locale={locale} onDone={setLettersDone} /> });
  else rows.push({ id: "quiz", done: quiz, node: <TodayRow kind="study" done={quiz} icon="▶" name={ui.keepTitle} onClick={() => focusQuiz(language, [])} /> });
  if (homework) {
    rows.push({
      id: "homework",
      done: Boolean(homework.done),
      node: (
        <TodayRow
          kind="homework"
          done={Boolean(homework.done)}
          icon={<AiAvatar size={22} language={language} />}
          name={ui.homeworkTag}
          onClick={() => sendAppIntent("openCall", { id: homework.callId, replay: true })}
        />
      ),
    });
  }
  rows.push({ id: "lesson", done: lesson, node: <TodayRow kind="lesson" done={lesson} icon="📞" name={ui.callModeStudy} onClick={() => sendAppIntent("startCall", { lesson: true })} /> });
  if (check.show) rows.push({ id: "check", done: check.doneToday, node: <TodayRow kind="check" done={check.doneToday} icon="📏" name={ui.skillCheckTitle} onClick={check.open} /> });
  const allDone = rows.every((one) => one.done);
  return (
    <section data-today-cards className="flex flex-col gap-2 rounded-xl border border-line p-3">
      <div className="flex items-center gap-2">
        <h3 className="text-note font-semibold text-ink">{ui.notebookToday}</h3>
        {allDone ? <span data-today-done aria-label={ui.planAllDone} className="text-caption text-good">✓</span> : null}
      </div>
      {rows.map((one) => (
        <div key={one.id}>{one.node}</div>
      ))}
      {check.sheet(ui, locale)}
    </section>
  );
}

/** 오늘의 학습 한 줄: 왼쪽 동그라미(끝나면 ✓) · 아이콘 · 이름 · ›. */
function TodayRow({ kind, done, icon, name, onClick, sub }: { kind: string; done: boolean; icon: ReactNode; name: string; onClick: () => void; sub?: string }) {
  return (
    <button
      type="button"
      data-today-card={kind}
      data-done={done ? "1" : undefined}
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-start hover:bg-white/5 ${done ? "border-line opacity-70" : "border-line"}`}
    >
      <span aria-hidden className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-caption ${done ? "border-good text-good" : "border-line text-slate-400"}`}>
        {done ? "✓" : ""}
      </span>
      <span aria-hidden className="flex w-6 shrink-0 items-center justify-center text-title">{icon}</span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-chat font-semibold text-ink">{name}</span>
        {sub ? <span dir="auto" className="truncate text-caption text-slate-400">{sub}</span> : null}
      </span>
      <span aria-hidden className="shrink-0 text-caption text-slate-300 rtl:rotate-180">›</span>
    </button>
  );
}

/** 오늘 퀴즈로 답한 서로 다른 열쇠가 TODAY_GOAL 이상이면 ✓(todayCards.ts answeredToday). */
function useQuizDone(language: string): boolean {
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
    return answeredToday(readLedger(language), today, (t) => dayOfSeconds(t)) >= TODAY_GOAL;
  }, [language, tick, today]);
}

/** 오늘 이 언어로 수업 통화를 한 번이라도 했으면 ✓(통화 기록 mode "lesson", 이 폰 — 사용자 2026-11-10 "그대로"). */
function useLessonDone(language: string): boolean {
  const [tick, setTick] = useState(0);
  useEffect(() => subscribeCalls(() => setTick((n) => n + 1)), []);
  return useMemo(() => {
    void tick;
    const today = localDay();
    return readCalls().some((call) => call.language === language && call.mode === "lesson" && (localDay(new Date(call.startedAt)) === today || localDay(new Date(call.updatedAt)) === today));
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

/** 📏 실력 확인 줄: 14일이 된 날(recheckDue)과 오늘 끝낸 날만. 누르면 첫 측정과 같은 시험(FirstCheck recheck), 기록 표는 Logbank. */
function useSkillCheck(language: string) {
  const [tick, setTick] = useState(0);
  const [openSheet, setOpenSheet] = useState(false);
  useEffect(() => {
    const on = () => setTick((n) => n + 1);
    window.addEventListener(SKILL_CHECK_EVENT, on);
    return () => window.removeEventListener(SKILL_CHECK_EVENT, on);
  }, []);
  const history = useMemo(() => {
    void tick;
    return checkHistory(readFirstCheck(language), readRechecks(language));
  }, [language, tick]);
  const last = history[history.length - 1] ?? null;
  const rechecks = useMemo(() => {
    void tick;
    return readRechecks(language);
  }, [language, tick]);
  const lastRecheck = rechecks[rechecks.length - 1];
  const doneToday = Boolean(lastRecheck && localDay(new Date(lastRecheck.at)) === localDay());
  const [now] = useState(() => Date.now());
  const show = doneToday || recheckDue(history, now);
  const sheet = (ui: UICopy, locale: string) =>
    openSheet ? (
      <FullScreenLayer>
        <div className="contents" onClick={(event) => event.stopPropagation()}>
          <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-6 pt-[max(1rem,env(safe-area-inset-top))]">
            <FirstCheck
              ui={ui}
              locale={locale}
              language={language}
              recheck={{ last }}
              onSkip={() => setOpenSheet(false)}
              onDone={() => {
                setOpenSheet(false);
                setTick((n) => n + 1);
                // 결과를 보고 닫을 때 전면 한 번(시험 끝 — 콘텐츠 사이 논리적 쉼). 시험 도중·줄을 누를 때는 없음.
                void maybeShowInterstitial("skillCheckEnd");
              }}
            />
          </div>
        </div>
      </FullScreenLayer>
    ) : null;
  return { show, doneToday, open: () => setOpenSheet(true), sheet };
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
function LettersRow({ ui, language, locale, onDone }: { ui: UICopy; language: string; locale: string; onDone: (done: boolean) => void }) {
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
    <TodayRow
      kind="letters"
      done={done}
      icon="▶"
      name={ui.notebookScript}
      sub={`${group.title} · ${group.items.map((item) => item.char).join(" ")}`}
      onClick={() => openLettersBank(language)}
    />
  );
}
