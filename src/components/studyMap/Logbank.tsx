"use client";

import { useMemo, useState, useSyncExternalStore, type ReactNode } from "react";
import { FullScreenLayer } from "@/components/FullScreenLayer";
import { NativeAdSlot } from "@/components/NativeAdSlot";
import { useExpressionInsightOptional } from "@/contexts/ExpressionInsightContext";
import type { UICopy } from "@/lib/copy";
import { clearQuizDay, dayValue, readQuizDays, type QuizDays } from "@/lib/curriculum/quizDays";
import { clearDayResults, DAY_LOG_EVENT, readDayResults, removeDayResult, type DayResult } from "@/lib/curriculum/dayLog";
import { reviewLabel } from "@/lib/curriculum/dailyPlan";
import { openLesson, sendAppIntent } from "@/lib/appIntents";
import { expressionKeyOf, expressionKeysIn, grammarKeyOfNode } from "@/lib/curriculum/lessonKey";
import { discardCall, readCalls, subscribeCalls } from "@/lib/roleplay/callStore";
import { buildRecap } from "@/lib/roleplay/recap";
import { tallyCall } from "@/lib/roleplay/transcriptMarks";
import { CALL_DAYS_EVENT, callDayOf, readCallDays, type CallDay } from "@/lib/roleplay/callDays";
import { inPeriod, periodLastDay, periodOf, shiftPeriod, summarize, type Period, type PeriodKind, type PeriodSummary } from "@/lib/curriculum/periodSummary";
import { BASES, bars, ESTIMATE, partRows, resultMinutes, totals, type Bar, type Basis, type LogInputs, type PartRow } from "@/lib/curriculum/logbankData";
import { callSeconds, type SavedConversation } from "@/lib/roleplay/saved";
import type { LogItem, PartId } from "@/lib/notes/stageParts";

function localDay(at: number): string {
  const d = new Date(at);
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

function subscribe(callback: () => void) {
  window.addEventListener("quiz-days", callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("quiz-days", callback);
    window.removeEventListener("storage", callback);
  };
}

function useQuizDays(language: string): QuizDays {
  const raw = useSyncExternalStore(
    subscribe,
    () => {
      try {
        return localStorage.getItem(`quizDays.v1.${language}`) ?? "{}";
      } catch {
        return "{}";
      }
    },
    () => "{}",
  );
  return useMemo(() => {
    void raw;
    return readQuizDays(language);
  }, [raw, language]);
}

function useDayResults(language: string): DayResult[] {
  const raw = useSyncExternalStore(
    (callback) => {
      window.addEventListener(DAY_LOG_EVENT, callback);
      window.addEventListener("storage", callback);
      return () => {
        window.removeEventListener(DAY_LOG_EVENT, callback);
        window.removeEventListener("storage", callback);
      };
    },
    () => {
      try {
        return localStorage.getItem(`dayLog.v1.${language}`) ?? "[]";
      } catch {
        return "[]";
      }
    },
    () => "[]",
  );
  return useMemo(() => {
    void raw;
    return readDayResults(language);
  }, [raw, language]);
}

type Day = { day: string; items: LogItem[]; quiz: QuizDays[string] | null; results: DayResult[]; calls: SavedConversation[] };

/**
 * 날마다 묶기 — 그날 한 공부 전부(일일 총학습, 2026-11-01): 서버 배움·숙지·고침 + 이 폰의 결과(수업·꺼내 쓰기·상황·통화·Quizbank).
 * 같은 날 배움·숙지가 둘 다면 숙지 하나만, 고친 줄은 한 번만. 새 날 먼저.
 */
export function logDays(items: readonly LogItem[], quiz: QuizDays, results: readonly DayResult[] = [], calls: readonly SavedConversation[] = []): Day[] {
  const byDay = new Map<string, Day>();
  const dayOf = (day: string): Day => {
    const have = byDay.get(day);
    if (have) return have;
    const fresh: Day = { day, items: [], quiz: quiz[day]?.n ? quiz[day]! : null, results: [], calls: [] };
    byDay.set(day, fresh);
    return fresh;
  };
  for (const item of items) dayOf(localDay(item.at)).items.push(item);
  for (const day of Object.keys(quiz)) if (quiz[day]!.n) dayOf(day);
  for (const result of results) dayOf(result.day).results.push(result);
  for (const call of calls) if (call.said.some((line) => line.who === "learner")) dayOf(localDay(call.startedAt)).calls.push(call);
  return [...byDay.values()]
    .map((one) => {
      const mastered = new Set(one.items.filter((item) => item.kind === "mastered").map((item) => `${item.part}|${item.text}`));
      const seenFix = new Set<string>();
      const kept = one.items.filter((item) => {
        if (item.kind === "learned") return !mastered.has(`${item.part}|${item.text}`);
        if (item.kind !== "fixed") return true;
        // 고친 줄이 여러 갈래에 걸쳐 두 번 오던 것(가상 사용자 2026-10-31) — 한 번만.
        const id = `${item.text}\u0000${item.right ?? ""}`;
        if (seenFix.has(id)) return false;
        seenFix.add(id);
        return true;
      });
      return { ...one, items: kept, results: [...one.results].sort((a, b) => a.at - b.at), calls: [...one.calls].sort((a, b) => a.startedAt - b.startedAt) };
    })
    .sort((a, b) => dayValue(b.day) - dayValue(a.day));
}

function useCallDays(language: string): Record<string, CallDay> {
  const raw = useSyncExternalStore(
    (callback) => {
      window.addEventListener(CALL_DAYS_EVENT, callback);
      window.addEventListener("storage", callback);
      return () => {
        window.removeEventListener(CALL_DAYS_EVENT, callback);
        window.removeEventListener("storage", callback);
      };
    },
    () => {
      try {
        return localStorage.getItem(`callDays.v1.${language}`) ?? "{}";
      } catch {
        return "{}";
      }
    },
    () => "{}",
  );
  return useMemo(() => {
    void raw;
    return readCallDays(language);
  }, [raw, language]);
}

const PERIOD_KEY = "logbankPeriod.v1";
const BASIS_KEY = "logbankBasis.v1";
function readPeriodKind(): PeriodKind {
  try {
    return localStorage.getItem(PERIOD_KEY) === "month" ? "month" : "week";
  } catch {
    return "week";
  }
}
function readBasis(): Basis {
  try {
    const raw = localStorage.getItem(BASIS_KEY);
    return BASES.includes(raw as Basis) ? (raw as Basis) : "time";
  } catch {
    return "time";
  }
}

const PART_ORDER: PartId[] = ["grammar", "vocab", "expression", "pronunciation"];
const BASIS_ICON: Record<Basis, string> = { time: "⏱", grammar: "📐", vocab: "🔤", expression: "💬" };
/** 어디서 했는지 → 아이콘(LogItem where · 수업 결과 종류 · 퀴즈). */
const WHERE_ICON: Record<string, string> = { chat: "💬", call: "📞", video: "🎬", vocab: "📖", map: "🧩", mission: "🎭", review: "📝", lesson: "🧩", recall: "🎯", script: "🎭", quiz: "📝" };

/**
 * Logbank(2026-11-02 사용자 "층위가 모호해서 난잡 — 기준을 하나로, 각 탭에서 학습한 걸 모은 자료, 누르면 세부(스크린샷·학습 내용)"):
 * [주 | 월] ‹기간› → 기준 탭 [⏱ 학습 시간 | 📐 문법 | 🔤 어휘 | 💬 표현] → 그 기간 날마다 막대(누르면 그날 세부 — 결과 카드·배운 것·고친 줄)
 * → 그 기준으로 모은 목록(시간이면 어디서 얼마나, 갈래면 소재 — 누르면 그 소재 세부: 수업 결과 카드·고친 줄·퀴즈 틀림, ▶ 그 수업).
 * 재료·자료 셈은 curriculum/logbankData.ts(순수).
 */
export function Logbank({
  ui,
  locale,
  language,
  items,
  nodeName,
  head,
}: {
  ui: UICopy;
  locale: string;
  language: string;
  items: readonly LogItem[];
  nodeName: (id: string) => string;
  head?: ReactNode;
}) {
  const insight = useExpressionInsightOptional();
  const quiz = useQuizDays(language);
  const results = useDayResults(language);
  const allCalls = useSyncExternalStore(subscribeCalls, readCalls, () => [] as SavedConversation[]);
  const calls = useMemo(() => allCalls.filter((call) => call.language === language), [allCalls, language]);
  const allDays = useMemo(() => logDays(items, quiz, results, calls), [items, quiz, results, calls]);
  const callDays = useCallDays(language);
  // 정리용 통화 숫자: 따로 남긴 줄(callDays, 1년) + 그 전에 저장돼 줄이 없는 통화 기록.
  const callRows = useMemo(() => {
    const rows: CallDay[] = Object.values(callDays);
    for (const call of calls) {
      if (callDays[call.id]) continue;
      const row = callDayOf(call);
      if (row) rows.push(row);
    }
    return rows;
  }, [callDays, calls]);
  // 오늘은 이 칸을 처음 그릴 때 한 번(그리는 동안 시계를 읽지 않게).
  const [today] = useState(() => localDay(Date.now()));
  const [kind, setKind] = useState<PeriodKind>(() => readPeriodKind());
  const [basis, setBasis] = useState<Basis>(() => readBasis());
  const [back, setBack] = useState(0);
  const [openDay, setOpenDay] = useState<string | null>(null);
  const [openRow, setOpenRow] = useState<string | null>(null);
  const period = useMemo(() => shiftPeriod(periodOf(kind, today), -back), [kind, today, back]);
  const input: LogInputs = useMemo(() => ({ language, items, results, quiz, calls: callRows, dayOf: localDay }), [language, items, results, quiz, callRows]);
  const summary = useMemo(() => summarize({ period, items, results, quiz, calls: callRows, dayOf: localDay }), [period, items, results, quiz, callRows]);
  const chart = useMemo(() => bars(period, basis, input), [period, basis, input]);
  const rows = useMemo(() => (basis === "time" ? [] : partRows(period, basis, input)), [period, basis, input]);
  const sum = useMemo(() => totals(period, basis, input), [period, basis, input]);
  const rangeFormat = useMemo(() => {
    try {
      return new Intl.DateTimeFormat(locale, { month: "short", day: "numeric" });
    } catch {
      return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" });
    }
  }, [locale]);
  const monthFormat = useMemo(() => {
    try {
      return new Intl.DateTimeFormat(locale, { year: "numeric", month: "long" });
    } catch {
      return new Intl.DateTimeFormat(undefined, { year: "numeric", month: "long" });
    }
  }, [locale]);
  const periodLabel =
    period.kind === "month" ? monthFormat.format(asDate(period.start)) : `${rangeFormat.format(asDate(period.start))} – ${rangeFormat.format(asDate(periodLastDay(period)))}`;
  const chooseKind = (next: PeriodKind) => {
    setKind(next);
    setBack(0);
    try {
      localStorage.setItem(PERIOD_KEY, next);
    } catch {
      // 이번에만.
    }
  };
  const chooseBasis = (next: Basis) => {
    setBasis(next);
    try {
      localStorage.setItem(BASIS_KEY, next);
    } catch {
      // 이번에만.
    }
  };
  const basisName = (one: Basis) => (one === "time" ? ui.logStudyTime : one === "grammar" ? ui.partGrammar : one === "vocab" ? ui.partVocab : ui.partExpression);
  const rowLabel = (row: PartRow) => (row.node ? nodeName(row.node) || row.text : row.key ? reviewLabel(language, row.key) || row.text : row.text);
  const chip = (on: boolean) => `rounded-full px-3 py-1 text-caption ${on ? "bg-ink text-surface" : "border border-line text-slate-300"}`;
  const legend: { cls: string; icon: string; title: string }[] =
    basis === "time"
      ? [
          { cls: "fill-info text-info", icon: "📞", title: ui.callRecordsTitle },
          { cls: "fill-status-mastered text-status-mastered", icon: "🧩", title: ui.framesTitle },
          { cls: "fill-warn text-warn", icon: "📝", title: ui.keepTitle },
        ]
      : [
          { cls: "fill-status-mastered text-status-mastered", icon: "✓", title: ui.itemsMastered },
          { cls: "fill-info text-info", icon: "•", title: ui.itemsLearned },
          { cls: "fill-warn text-warn", icon: "✗", title: ui.partFixed },
        ];
  const dayDetail = openDay ? allDays.find((one) => one.day === openDay) ?? null : null;
  const rowDetail = openRow ? rows.find((row) => row.id === openRow) ?? null : null;
  return (
    <div data-logbank data-log-basis={basis} className="flex flex-col gap-3">
      {head}
      <section data-log-period={kind} className="flex flex-col gap-3 rounded-xl border border-line p-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex gap-1" role="group">
            <button type="button" aria-pressed={kind === "week"} onClick={() => chooseKind("week")} className={chip(kind === "week")}>{ui.logWeek}</button>
            <button type="button" aria-pressed={kind === "month"} onClick={() => chooseKind("month")} className={chip(kind === "month")}>{ui.logMonth}</button>
          </div>
          <div className="flex items-center gap-1">
            <button type="button" onClick={() => setBack((n) => n + 1)} aria-label="‹" className="flex h-7 w-7 items-center justify-center rounded-full text-slate-300 hover:bg-white/10 rtl:rotate-180">‹</button>
            <span data-log-period-label className="min-w-0 text-note font-semibold tabular-nums text-ink">{periodLabel}</span>
            <button type="button" onClick={() => setBack((n) => Math.max(0, n - 1))} disabled={back === 0} aria-label="›" className="flex h-7 w-7 items-center justify-center rounded-full text-slate-300 hover:bg-white/10 disabled:opacity-30 rtl:rotate-180">›</button>
          </div>
        </div>
        <div role="tablist" className="grid grid-cols-4 gap-1">
          {BASES.map((one) => (
            <button
              key={one}
              type="button"
              role="tab"
              data-log-basis-tab={one}
              aria-selected={basis === one}
              onClick={() => chooseBasis(one)}
              className={`flex min-w-0 flex-col items-center gap-0.5 rounded-lg px-1 py-1.5 text-meta ${basis === one ? "bg-white/10 font-semibold text-ink" : "text-slate-400 hover:bg-white/5"}`}
            >
              <span aria-hidden className="text-body">{BASIS_ICON[one]}</span>
              <span className="w-full truncate text-center">{basisName(one)}</span>
            </button>
          ))}
        </div>
        <p data-log-total className="flex flex-wrap items-baseline gap-x-3 text-note tabular-nums text-slate-200">
          {basis === "time" ? (
            <>
              <span className="text-title font-semibold text-ink">{`${sum.minutes ?? 0}′`}</span>
              <span title={ui.logStudyDays} aria-label={`${ui.logStudyDays} ${summary.activeDays}`}>{`📅 ${summary.activeDays}`}</span>
            </>
          ) : (
            <>
              <span className="text-title font-semibold text-ink">{sum.rows ?? 0}</span>
              {sum.mastered ? <span className="text-status-mastered" title={ui.itemsMastered}>{`✓ ${sum.mastered}`}</span> : null}
              {sum.missed ? <span className="text-warn" title={ui.partFixed}>{`✗ ${sum.missed}`}</span> : null}
            </>
          )}
        </p>
        <LogChart bars={chart} kind={kind} legend={legend} unit={basis === "time" ? "′" : ""} dateLabel={(day) => (kind === "week" ? weekdayLabel(locale, day) : String(asDate(day).getDate()))} onDay={(day) => setOpenDay(day)} />
        <div className="flex flex-wrap gap-x-3 text-meta text-slate-400">
          {legend.map((one) => (
            <span key={one.icon} title={one.title} className="inline-flex items-center gap-1">
              <svg aria-hidden width="8" height="8" className={one.cls}><rect width="8" height="8" rx="2" /></svg>
              {`${one.icon} ${one.title}`}
            </span>
          ))}
        </div>
      </section>
      {basis === "time" ? (
        <TimeSources ui={ui} summary={summary} input={input} period={period} />
      ) : rows.length ? (
        <ol data-log-rows className="flex flex-col gap-1">
          {rows.map((row) => (
            <li key={row.id}>
              <button
                type="button"
                data-log-row={row.status}
                onClick={() => setOpenRow(row.id)}
                className="flex w-full items-center gap-2 rounded-lg border border-line px-3 py-2 text-start hover:bg-white/5"
              >
                <span aria-hidden className={`w-4 shrink-0 text-center text-caption ${row.status === "mastered" ? "text-status-mastered" : row.status === "missed" ? "text-warn" : "text-info"}`}>
                  {row.status === "mastered" ? "✓" : row.status === "missed" ? "✗" : "•"}
                </span>
                <span dir="auto" className="min-w-0 flex-1 truncate text-note text-ink">{rowLabel(row)}</span>
                <span aria-hidden className="shrink-0 text-meta">{[...new Set(row.events.map((one) => WHERE_ICON[one.where] ?? ""))].filter(Boolean).slice(0, 4).join("")}</span>
                <span className="shrink-0 text-meta tabular-nums text-slate-500">{row.events.length}</span>
              </button>
            </li>
          ))}
        </ol>
      ) : (
        <p className="text-note text-slate-500">—</p>
      )}
      {/* Logbank 아래 네이티브 하나(전체 화면에서만, 바닥 화면은 배너) — 둘러보는 목록 자리 규칙. */}
      <NativeAdSlot feedId="my-full" slotKey="logbank-list" spaced layerOnly />
      {dayDetail ? (
        <LogSheet title={dayFormat(locale, dayDetail.day)} ui={ui} onClose={() => setOpenDay(null)}>
          <DayBody ui={ui} language={language} day={dayDetail} label={(item) => (item.part === "grammar" && item.node ? nodeName(item.node) || item.text : item.text)} insight={insight} />
        </LogSheet>
      ) : openDay ? (
        <LogSheet title={dayFormat(locale, openDay)} ui={ui} onClose={() => setOpenDay(null)}>
          <p className="text-note text-slate-500">—</p>
        </LogSheet>
      ) : null}
      {rowDetail ? (
        <LogSheet title={rowLabel(rowDetail)} ui={ui} onClose={() => setOpenRow(null)}>
          <RowBody ui={ui} locale={locale} language={language} row={rowDetail} />
        </LogSheet>
      ) : null}
    </div>
  );
}

function asDate(day: string): Date {
  const [y, m, d] = day.split("-").map(Number);
  return new Date(y ?? 1970, (m ?? 1) - 1, d ?? 1);
}

function weekdayLabel(locale: string, day: string): string {
  try {
    return new Intl.DateTimeFormat(locale, { weekday: "narrow" }).format(asDate(day));
  } catch {
    return String(asDate(day).getDate());
  }
}

function dayFormat(locale: string, day: string): string {
  try {
    return new Intl.DateTimeFormat(locale, { month: "short", day: "numeric", weekday: "short" }).format(asDate(day));
  } catch {
    return day;
  }
}

/** 날마다 막대(쌓음) — 누르면 그날 세부. 칸 셋의 색은 legend 순서. 막대 위 합(0이면 없음). */
function LogChart({
  bars: list,
  kind,
  legend,
  unit,
  dateLabel,
  onDay,
}: {
  bars: Bar[];
  kind: PeriodKind;
  legend: { cls: string }[];
  unit: string;
  dateLabel: (day: string) => string;
  onDay: (day: string) => void;
}) {
  const max = Math.max(1, ...list.map((bar) => bar.parts[0] + bar.parts[1] + bar.parts[2]));
  const height = 120;
  return (
    <div data-log-chart className="flex h-[156px] items-end gap-[3px]">
      {list.map((bar, i) => {
        const total = bar.parts[0] + bar.parts[1] + bar.parts[2];
        const showLabel = kind === "week" || i % 5 === 0 || i === list.length - 1;
        let y = height;
        return (
          <button
            key={bar.day}
            type="button"
            data-log-bar={bar.day}
            aria-label={`${bar.day} ${Math.round(total)}${unit}`}
            onClick={() => onDay(bar.day)}
            className="flex min-w-0 flex-1 flex-col items-center gap-1 rounded-lg hover:bg-white/5"
          >
            <span className="h-4 text-meta tabular-nums text-slate-400">{total && kind === "week" ? `${Math.round(total)}${unit}` : ""}</span>
            <svg viewBox={`0 0 10 ${height}`} preserveAspectRatio="none" className="h-[120px] w-full max-w-[28px]">
              {bar.parts.map((n, slot) => {
                if (!n) return null;
                const h = Math.max(2, (n / max) * height);
                y -= h;
                return <rect key={slot} x="0" y={y} width="10" height={h} rx="1.5" className={legend[slot]?.cls ?? ""} />;
              })}
              {total ? null : <rect x="0" y={height - 2} width="10" height="2" className="fill-white/10" />}
            </svg>
            <span className="h-4 text-meta tabular-nums text-slate-500">{showLabel ? dateLabel(bar.day) : ""}</span>
          </button>
        );
      })}
    </div>
  );
}

/** ⏱ 학습 시간 기준의 목록: 어디서 얼마나(그 기간 합). */
function TimeSources({ ui, summary, input, period }: { ui: UICopy; summary: PeriodSummary; input: LogInputs; period: Period }) {
  const results = input.results.filter((one) => inPeriod(period, one.day));
  const minutesOf = (kind: DayResult["kind"]) => Math.round(results.filter((one) => one.kind === kind).reduce((n, one) => n + resultMinutes(one), 0));
  const rows: { icon: string; title: string; count: string; minutes: number; show: boolean }[] = [
    { icon: "📞", title: ui.callRecordsTitle, count: String(summary.calls), minutes: summary.callMinutes, show: summary.calls > 0 },
    { icon: "🧩", title: ui.framesTitle, count: String(summary.lessons), minutes: minutesOf("lesson"), show: summary.lessons > 0 },
    { icon: "🎯", title: ui.recallTitle, count: String(summary.recalls), minutes: minutesOf("recall"), show: summary.recalls > 0 },
    { icon: "🎭", title: ui.stageScriptsTitle, count: String(summary.scripts), minutes: minutesOf("script"), show: summary.scripts > 0 },
    { icon: "📝", title: ui.keepTitle, count: ui.quizScore.replace("{n}", String(summary.quizRight)).replace("{m}", String(summary.quizN)), minutes: Math.round(summary.quizN * ESTIMATE.quizQuestion), show: summary.quizN > 0 },
  ];
  const shown = rows.filter((one) => one.show);
  if (!shown.length) return <p className="text-note text-slate-500">—</p>;
  return (
    <ul data-log-sources className="flex flex-col gap-1">
      {shown.map((one) => (
        <li key={one.icon} className="flex items-center gap-2 rounded-lg border border-line px-3 py-2 text-note">
          <span aria-hidden>{one.icon}</span>
          <span className="min-w-0 flex-1 truncate text-ink">{one.title}</span>
          <span className="shrink-0 tabular-nums text-slate-300">{one.count}</span>
          <span className="w-12 shrink-0 text-end tabular-nums text-slate-400">{`${one.minutes}′`}</span>
        </li>
      ))}
      {summary.fixed || summary.redone ? (
        <li className="flex gap-3 px-3 pt-1 text-meta tabular-nums text-slate-400">
          {summary.fixed ? <span title={ui.partFixed}>{`✎ ${summary.fixed}`}</span> : null}
          {summary.redone ? <span title={ui.roleplaySayAgain}>{`🔁 ${summary.redone}`}</span> : null}
        </li>
      ) : null}
    </ul>
  );
}

/** 세부 화면(전체 화면 층 — My 전체 화면 위): 머리 제목 + ✕, 안은 스크롤. */
function LogSheet({ title, ui, onClose, children }: { title: string; ui: UICopy; onClose: () => void; children: ReactNode }) {
  return (
    <FullScreenLayer>
      {/* 포털이라도 누름은 React 트리로 올라가 뒤의 My 칸 크게 보기가 받는다 — 여기서 멈춤. */}
      <div className="contents" onClick={(event) => event.stopPropagation()}>
        <header className="flex shrink-0 items-center gap-2 border-b border-line px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
          <h2 dir="auto" className="min-w-0 flex-1 truncate text-body font-semibold text-ink">{title}</h2>
          <button type="button" onClick={onClose} aria-label={ui.billingClose} className="rounded-lg px-2 py-1 text-note text-slate-400 hover:bg-white/10">✕</button>
        </header>
        <div data-log-sheet className="min-h-0 flex-1 overflow-y-auto px-4 py-3">{children}</div>
      </div>
    </FullScreenLayer>
  );
}

/** 그날 세부: 결과 카드(수업·통화·Quizbank 틀린 것) + 배운·익힌 소재 칩 + 고친 줄 + 🗑. */
function DayBody({
  ui,
  language,
  day,
  label,
  insight,
}: {
  ui: UICopy;
  language: string;
  day: Day;
  label: (item: LogItem) => string;
  insight: ReturnType<typeof useExpressionInsightOptional>;
}) {
  const fixed = day.items.filter((item) => item.kind === "fixed");
  const partName = (part: PartId) => (part === "grammar" ? ui.partGrammar : part === "vocab" ? ui.partVocab : part === "expression" ? ui.partExpression : ui.partPronunciation);
  return (
    <div data-log-day={day.day} className="flex flex-col gap-2">
      <div className="flex items-center gap-2 text-caption tabular-nums text-slate-400">
        {day.quiz ? <span>{`📝 ${ui.quizScore.replace("{n}", String(day.quiz.right)).replace("{m}", String(day.quiz.n))}`}</span> : null}
        <ClearDay ui={ui} language={language} day={day} />
      </div>
      <DayResults ui={ui} language={language} day={day} />
      {PART_ORDER.map((part) => {
        const got = day.items.filter((item) => item.part === part && item.kind !== "fixed");
        if (!got.length) return null;
        return (
          <div key={part} className="flex flex-wrap items-center gap-1">
            <span className="me-1 text-meta text-slate-500">{partName(part)}</span>
            {got.map((item, i) => (
              <button
                key={`${item.text}-${i}`}
                type="button"
                dir="auto"
                onClick={() => {
                  const key = lessonKeyOf(language, item);
                  if (key) openLesson({ language, key });
                  else if (part !== "grammar") insight?.open({ sentence: item.text, selected: item.text });
                }}
                className={`rounded-full px-2 py-0.5 text-meta ${item.kind === "mastered" ? "bg-status-mastered/20 text-status-mastered" : "bg-info/15 text-info"}`}
              >
                {label(item)}
              </button>
            ))}
          </div>
        );
      })}
      {fixed.length ? (
        <ul className="flex flex-col gap-1">
          {fixed.map((item, i) => (
            <li key={`${item.at}-${i}`} className="text-meta">
              <span aria-hidden className="me-1">{WHERE_ICON[String(item.where ?? "")] ?? "✎"}</span>
              <span dir="auto" className="text-slate-500 line-through">{item.text}</span>
              {item.right ? (
                <>
                  <span aria-hidden className="mx-1 inline-block text-slate-500 rtl:rotate-180">→</span>
                  <span dir="auto" className="text-slate-200">{item.right}</span>
                </>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}
      {!day.results.length && !day.calls.length && !day.items.length && !day.quiz ? <p className="text-note text-slate-500">—</p> : null}
    </div>
  );
}

/** 소재 세부: ▶ 그 수업 + 그 기간 나온 일(새것부터) — 수업 결과 카드·고친 줄·퀴즈 틀림·배움/익힘. */
function RowBody({ ui, locale, language, row }: { ui: UICopy; locale: string; language: string; row: PartRow }) {
  const key = row.key ?? (row.node ? grammarKeyOfNode(language, row.node) : expressionKeyOf(language, row.text));
  return (
    <div data-log-row-detail className="flex flex-col gap-2">
      {key ? (
        <button type="button" data-log-row-open onClick={() => openLesson({ language, key })} className="self-start rounded-full bg-white/90 px-4 py-1.5 text-caption font-semibold text-slate-900">
          ▶
        </button>
      ) : null}
      <ol className="flex flex-col gap-2">
        {row.events.map((event, i) => (
          <li key={`${event.at}-${i}`} className="flex flex-col gap-1 rounded-lg border border-line bg-white/[0.02] px-2.5 py-2">
            <span className="flex items-center gap-2 text-caption">
              <span aria-hidden>{WHERE_ICON[event.where] ?? "·"}</span>
              <span className="min-w-0 flex-1 tabular-nums text-slate-400">{dayFormat(locale, event.day)}</span>
              {event.kind === "mastered" ? <span className="text-status-mastered">{`✓ ${ui.itemsMastered}`}</span> : null}
              {event.kind === "learned" ? <span className="text-info">{ui.itemsLearned}</span> : null}
              {event.kind === "quizWrong" ? <span className="text-warn">{`✗ ${ui.keepTitle}`}</span> : null}
              {event.kind === "fixed" ? <span className="text-warn">{`✎ ${ui.partFixed}`}</span> : null}
              {event.result ? (
                <span className={`tabular-nums ${event.result.passed ? "text-good" : "text-slate-400"}`}>{`${event.result.right}/${event.result.total}${event.result.passed ? " ✓" : ""}`}</span>
              ) : null}
            </span>
            {event.kind === "fixed" ? (
              <span className="text-meta">
                <span dir="auto" className="text-slate-500 line-through">{event.text}</span>
                {event.right ? (
                  <>
                    <span aria-hidden className="mx-1 inline-block text-slate-500 rtl:rotate-180">→</span>
                    <span dir="auto" className="text-slate-200">{event.right}</span>
                  </>
                ) : null}
              </span>
            ) : null}
            {event.result?.said.slice(0, 5).map((line, j) => (
              <span key={j} className="flex items-baseline gap-1.5 text-meta">
                <span aria-hidden className={line.good ? "text-good" : "text-warn"}>{line.good ? "✓" : "✗"}</span>
                <span dir="auto" className="min-w-0 text-slate-300">{line.text}</span>
              </span>
            ))}
          </li>
        ))}
      </ol>
    </div>
  );
}

const RESULT_ICON: Record<DayResult["kind"], string> = { lesson: "🧩", recall: "🎯", script: "🎭" };

/**
 * 그날 결과 카드(2026-11-01 사용자 "결과 샷 — 통화면 학습 결과 창"): 수업·꺼내 쓰기·상황은 끝 화면의 맞힌 수와 내가 말한 줄,
 * 통화는 통화 정리(고친 말·💡) — 누르면 그 통화 돌아보기, Quizbank는 그날 틀린 것. 이 폰 기록만.
 */
function DayResults({ ui, language, day }: { ui: UICopy; language: string; day: Day }) {
  // 통화 카드 ×는 통화 기록도 지워서 한 번 묻는다(2026-11-01 사용자 "X랑 일괄 삭제") — 지금 묻는 통화 id.
  const [asking, setAsking] = useState<string | null>(null);
  const wrong = (day.quiz?.wrong ?? []).map((key) => reviewLabel(language, key)).filter(Boolean);
  if (!day.results.length && !day.calls.length && !wrong.length) return null;
  const card = "mt-1.5 flex flex-col gap-1 rounded-lg border border-line bg-white/[0.02] px-2.5 py-2";
  const remove = (label: string, onClick: () => void, data: string) => (
    <button type="button" data-day-remove={data} aria-label={`${label} · ${ui.notebookDelete}`} title={ui.notebookDelete} onClick={onClick} className="-me-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-caption text-slate-500 hover:bg-white/10 hover:text-ink">
      ✕
    </button>
  );
  return (
    <div data-day-results className="mt-1">
      {day.calls.map((call) => {
        const recap = buildRecap(language, call.said);
        const fixes = recap.filter((item) => item.kind === "fix");
        const hints = recap.filter((item) => item.kind === "hint").length;
        // 튜터 수업에서 다시 말해 맞힌 줄 수 — 통화 끝 요약의 🔁와 같은 셈(2026-11-02 사용자 "학습결과창에도").
        const redone = tallyCall(call.said).redone;
        const minutes = Math.max(1, Math.round(callSeconds(call) / 60));
        return (
          <div key={call.id} data-day-call className={card}>
            <div className="flex items-start gap-2">
              <button type="button" data-day-call-open onClick={() => sendAppIntent("openCall", { id: call.id })} className="flex min-w-0 flex-1 flex-col gap-1 text-start">
                <span className="flex items-center gap-2 text-caption">
                  <span aria-hidden>📞</span>
                  <span dir="auto" className="min-w-0 flex-1 truncate font-semibold text-ink">{call.title}</span>
                  <span className="shrink-0 tabular-nums text-slate-400">{`${minutes}′`}</span>
                  {fixes.length ? <span className="shrink-0 tabular-nums text-warn">{`✎ ${fixes.length}`}</span> : null}
                  {hints ? <span className="shrink-0 tabular-nums text-slate-300">{`💡 ${hints}`}</span> : null}
                  {redone ? (
                    <span className="shrink-0 tabular-nums text-good" title={ui.roleplaySayAgain} aria-label={`${ui.roleplaySayAgain} ${redone}`}>{`🔁 ${redone}`}</span>
                  ) : null}
                </span>
              </button>
              {remove(call.title, () => setAsking(call.id), "call")}
            </div>
            {/* Each corrected line opens its Stagebank lesson carrying the sentence (or the call review when no topic is found). */}
            {fixes.slice(0, 2).map((item, i) => {
              const key = item.frames[0] ? `f|${item.frames[0].id}` : expressionKeysIn(language, item.line, 1)[0];
              return (
                <button
                  key={i}
                  type="button"
                  data-day-call-fix
                  onClick={() =>
                    key
                      ? openLesson({ language, key, scene: { line: item.line, ...(item.said ? { said: item.said } : {}), ...(item.before ? { before: item.before } : {}) } })
                      : sendAppIntent("openCall", { id: call.id })
                  }
                  className="text-start text-meta hover:opacity-80"
                >
                  {item.said ? <span dir="auto" className="text-slate-500 line-through">{item.said}</span> : null}
                  {item.said ? <span aria-hidden className="mx-1 inline-block text-slate-500 rtl:rotate-180">→</span> : null}
                  <span dir="auto" className="text-slate-200">{item.line}</span>
                  {key ? <span aria-hidden className="ms-1 text-slate-500">{key.startsWith("f|") ? "🧩" : "🔤"}</span> : null}
                </button>
              );
            })}
            {asking === call.id ? (
              <Confirm ui={ui} note={ui.callAlsoDeleted} onYes={() => { discardCall(call.id); setAsking(null); }} onNo={() => setAsking(null)} />
            ) : null}
          </div>
        );
      })}
      {day.results.map((result, i) => (
        <div key={`${result.item}-${result.at}-${i}`} data-day-result={result.kind} className={card}>
          <span className="flex items-center gap-2 text-caption">
            <span aria-hidden>{RESULT_ICON[result.kind]}</span>
            <span dir="auto" className="min-w-0 flex-1 truncate font-semibold text-ink">{result.kind === "recall" ? ui.recallTitle : result.title}</span>
            <span className={`shrink-0 tabular-nums ${result.passed ? "text-good" : "text-slate-400"}`}>{`${result.right}/${result.total}${result.passed ? " ✓" : ""}`}</span>
            {remove(result.title, () => removeDayResult(language, result.at, result.item), "result")}
          </span>
          {result.kind === "recall" && result.title ? <span dir="auto" className="truncate text-meta text-slate-400">{result.title}</span> : null}
          {result.said.slice(0, 3).map((line, j) => (
            <span key={j} className="flex items-baseline gap-1.5 text-meta">
              <span aria-hidden className={line.good ? "text-good" : "text-warn"}>{line.good ? "✓" : "✗"}</span>
              <span dir="auto" className="min-w-0 text-slate-300">{line.text}</span>
            </span>
          ))}
        </div>
      ))}
      {wrong.length ? (
        <div data-day-wrong className={card}>
          <span className="flex items-center gap-2">
            <span className="min-w-0 flex-1 text-caption font-semibold text-ink">{`${ui.keepTitle} · ${ui.weakTitle}`}</span>
            {remove(ui.weakTitle, () => clearQuizDay(language, day.day, true), "wrong")}
          </span>
          <span className="flex flex-wrap gap-1">
            {wrong.slice(0, 12).map((label) => (
              <span key={label} dir="auto" className="rounded-full bg-warn/10 px-2 py-0.5 text-meta text-warn">
                {label}
              </span>
            ))}
          </span>
        </div>
      ) : null}
    </div>
  );
}

/** 지우기 전에 한 번(누르기 직전 결과가 달라지는 것만 글로 — 통화 기록도 지워짐). */
function Confirm({ ui, note, onYes, onNo }: { ui: UICopy; note?: string; onYes: () => void; onNo: () => void }) {
  return (
    <div data-day-confirm className="mt-1 flex flex-wrap items-center gap-2 text-meta">
      {note ? <span className="min-w-0 flex-1 text-slate-400">{note}</span> : <span className="flex-1" />}
      <button type="button" data-day-confirm-yes onClick={onYes} className="rounded-full bg-bad/20 px-3 py-1 font-semibold text-bad hover:bg-bad/30">
        {ui.notebookDelete}
      </button>
      <button type="button" onClick={onNo} className="rounded-full border border-line px-3 py-1 text-slate-300 hover:bg-white/10">
        {ui.reportCancel}
      </button>
    </div>
  );
}

/** 날짜 줄 🗑: 그날 이 폰의 결과(수업·꺼내 쓰기·상황·Quizbank·통화)를 한 번에 — 계정 기록(칩·고친 줄)은 그대로. */
function ClearDay({ ui, language, day }: { ui: UICopy; language: string; day: Day }) {
  const [asking, setAsking] = useState(false);
  if (!day.results.length && !day.calls.length && !day.quiz) return null;
  return (
    <>
      <button type="button" data-day-clear aria-label={ui.notebookDelete} title={ui.notebookDelete} onClick={() => setAsking(true)} className="ms-auto flex h-6 w-6 items-center justify-center rounded-full text-caption text-slate-500 hover:bg-white/10 hover:text-ink">
        🗑
      </button>
      {asking ? (
        <div className="w-full">
          <Confirm
            ui={ui}
            {...(day.calls.length ? { note: ui.callAlsoDeleted } : {})}
            onYes={() => {
              clearDayResults(language, day.day);
              clearQuizDay(language, day.day);
              for (const call of day.calls) discardCall(call.id);
              setAsking(false);
            }}
            onNo={() => setAsking(false)}
          />
        </div>
      ) : null}
    </>
  );
}

/** Logbank 칩 → Stagebank 소재 열쇠: 문법 칸(노트 칸 id) · 그 단계 핵심 표현. 없으면 null. */
function lessonKeyOf(language: string, item: LogItem): string | null {
  if (item.part === "grammar") return grammarKeyOfNode(language, item.node);
  return expressionKeyOf(language, item.text);
}
