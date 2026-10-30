"use client";

/**
 * Logbank(2026-10-31 사용자 "복습 칸 자리에 데이터로 — 공부한 날·분은 프로필에 있으니, 날마다·주마다 학습한 걸 요약·정리" → 목록만, AI 없이):
 * 주마다 묶고(머리에 그 주 합), 날마다 배운 것·익힌 것(문장구조·낱말·표현·문법)·튜터가 고친 줄·푼 퀴즈 수.
 * 재료: 서버 logItems(/api/notebook — 지금 단계까지 모든 단계 최근 14일, notes/stageParts.ts LogItem) + 이 폰 퀴즈 수(curriculum/quizDays.ts).
 * 낱말·표현을 누르면 표현 자세히. 머리 아이콘(📈 실력 기록·📝 이번 주 확인)은 TodayPlan이 준다(head).
 */
import { useMemo, useSyncExternalStore, type ReactNode } from "react";
import { useExpressionInsightOptional } from "@/contexts/ExpressionInsightContext";
import type { UICopy } from "@/lib/copy";
import { dayValue, readQuizDays, weekOf, type QuizDays } from "@/lib/curriculum/quizDays";
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

type Day = { day: string; items: LogItem[]; quiz: { n: number; right: number } | null };

/** 날마다 묶기(같은 날 배움·숙지가 둘 다면 숙지 하나만), 새 날 먼저. */
export function logDays(items: readonly LogItem[], quiz: QuizDays): Day[] {
  const byDay = new Map<string, LogItem[]>();
  for (const item of items) {
    const day = localDay(item.at);
    byDay.set(day, [...(byDay.get(day) ?? []), item]);
  }
  for (const day of Object.keys(quiz)) if (quiz[day]!.n && !byDay.has(day)) byDay.set(day, []);
  return [...byDay.entries()]
    .map(([day, list]) => {
      const mastered = new Set(list.filter((item) => item.kind === "mastered").map((item) => `${item.part}|${item.text}`));
      const kept = list.filter((item) => item.kind !== "learned" || !mastered.has(`${item.part}|${item.text}`));
      return { day, items: kept, quiz: quiz[day]?.n ? quiz[day]! : null };
    })
    .sort((a, b) => dayValue(b.day) - dayValue(a.day));
}

const PART_ORDER: PartId[] = ["grammar", "vocab", "expression", "pronunciation"];

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
  const days = useMemo(() => logDays(items, quiz), [items, quiz]);
  const weeks = useMemo(() => {
    const out: { week: string; days: Day[] }[] = [];
    for (const day of days) {
      const week = weekOf(day.day);
      const last = out[out.length - 1];
      if (last && last.week === week) last.days.push(day);
      else out.push({ week, days: [day] });
    }
    return out;
  }, [days]);
  const dateFormat = useMemo(() => {
    try {
      return new Intl.DateTimeFormat(locale, { month: "short", day: "numeric", weekday: "short" });
    } catch {
      return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" });
    }
  }, [locale]);
  const rangeFormat = useMemo(() => {
    try {
      return new Intl.DateTimeFormat(locale, { month: "short", day: "numeric" });
    } catch {
      return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" });
    }
  }, [locale]);
  const asDate = (day: string) => {
    const [y, m, d] = day.split("-").map(Number);
    return new Date(y ?? 1970, (m ?? 1) - 1, d ?? 1);
  };
  const partName = (part: PartId) => (part === "grammar" ? ui.partGrammar : part === "vocab" ? ui.partVocab : part === "expression" ? ui.partExpression : ui.partPronunciation);
  const label = (item: LogItem) => (item.part === "grammar" && item.node ? nodeName(item.node) || item.text : item.text);
  const counts = (list: readonly LogItem[]) => ({
    learned: list.filter((item) => item.kind === "learned").length,
    mastered: list.filter((item) => item.kind === "mastered").length,
    fixed: list.filter((item) => item.kind === "fixed").length,
  });
  const tally = (c: ReturnType<typeof counts>, q: { n: number; right: number } | null) => (
    <span className="flex flex-wrap gap-x-3 text-caption tabular-nums text-slate-400">
      {c.mastered ? <span className="text-status-mastered">{`${ui.itemsMastered} +${c.mastered}`}</span> : null}
      {c.learned ? <span className="text-status-learned">{`${ui.itemsLearned} +${c.learned}`}</span> : null}
      {c.fixed ? <span className="text-warn">{`${ui.partFixed} ${c.fixed}`}</span> : null}
      {q ? <span>{`${ui.keepTitle} ${ui.quizScore.replace("{n}", String(q.right)).replace("{m}", String(q.n))}`}</span> : null}
    </span>
  );

  return (
    <div data-logbank className="flex flex-col gap-3">
      {head}
      {weeks.length ? null : <p className="text-note text-slate-500">—</p>}
      {weeks.map(({ week, days: list }) => {
        const all = list.flatMap((one) => one.items);
        const quizWeek = list.reduce<{ n: number; right: number } | null>((sum, one) => (one.quiz ? { n: (sum?.n ?? 0) + one.quiz.n, right: (sum?.right ?? 0) + one.quiz.right } : sum), null);
        const start = asDate(week);
        const end = new Date(start.getTime() + 6 * 24 * 60 * 60 * 1000);
        return (
          <section key={week} data-log-week={week} className="rounded-xl border border-line p-3">
            <div className="flex flex-col gap-1">
              <h4 className="text-note font-semibold text-ink">{`${rangeFormat.format(start)} – ${rangeFormat.format(end)}`}</h4>
              {tally(counts(all), quizWeek)}
            </div>
            <ol className="mt-2 flex flex-col gap-3">
              {list.map((one) => {
                const fixed = one.items.filter((item) => item.kind === "fixed");
                return (
                  <li key={one.day} data-log-day={one.day} className="border-t border-line pt-2">
                    <div className="flex flex-wrap items-baseline gap-x-2">
                      <span className="text-caption font-semibold text-slate-200">{dateFormat.format(asDate(one.day))}</span>
                      {tally(counts(one.items), one.quiz)}
                    </div>
                    {PART_ORDER.map((part) => {
                      const got = one.items.filter((item) => item.part === part && item.kind !== "fixed");
                      if (!got.length) return null;
                      return (
                        <div key={part} className="mt-1.5 flex flex-wrap items-center gap-1">
                          <span className="me-1 text-meta text-slate-500">{partName(part)}</span>
                          {got.map((item, i) => (
                            <button
                              key={`${item.text}-${i}`}
                              type="button"
                              dir="auto"
                              onClick={() => (part === "grammar" ? undefined : insight?.open({ sentence: item.text, selected: item.text }))}
                              className={`rounded-full px-2 py-0.5 text-meta ${item.kind === "mastered" ? "bg-status-mastered/20 text-status-mastered" : "bg-status-learned/15 text-status-learned"}`}
                            >
                              {label(item)}
                            </button>
                          ))}
                        </div>
                      );
                    })}
                    {fixed.length ? (
                      <ul className="mt-1.5 flex flex-col gap-1">
                        {fixed.slice(0, 5).map((item, i) => (
                          <li key={`${item.at}-${i}`} className="text-meta">
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
                  </li>
                );
              })}
            </ol>
          </section>
        );
      })}
    </div>
  );
}
