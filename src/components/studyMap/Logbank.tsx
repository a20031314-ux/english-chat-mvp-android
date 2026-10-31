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
import { DAY_LOG_EVENT, readDayResults, type DayResult } from "@/lib/curriculum/dayLog";
import { reviewLabel } from "@/lib/curriculum/dailyPlan";
import { sendAppIntent } from "@/lib/appIntents";
import { readCalls, subscribeCalls } from "@/lib/roleplay/callStore";
import { buildRecap } from "@/lib/roleplay/recap";
import type { SavedConversation } from "@/lib/roleplay/saved";
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
  const results = useDayResults(language);
  const allCalls = useSyncExternalStore(subscribeCalls, readCalls, () => [] as SavedConversation[]);
  const calls = useMemo(() => allCalls.filter((call) => call.language === language), [allCalls, language]);
  const days = useMemo(() => logDays(items, quiz, results, calls), [items, quiz, results, calls]);
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
                    <DayResults ui={ui} language={language} day={one} />
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

const RESULT_ICON: Record<DayResult["kind"], string> = { lesson: "🧩", recall: "🎯", script: "🎭" };

/**
 * 그날 결과 카드(2026-11-01 사용자 "결과 샷 — 통화면 학습 결과 창"): 수업·꺼내 쓰기·상황은 끝 화면의 맞힌 수와 내가 말한 줄,
 * 통화는 통화 정리(고친 말·💡) — 누르면 그 통화 돌아보기, Quizbank는 그날 틀린 것. 이 폰 기록만.
 */
function DayResults({ ui, language, day }: { ui: UICopy; language: string; day: Day }) {
  const wrong = (day.quiz?.wrong ?? []).map((key) => reviewLabel(language, key)).filter(Boolean);
  if (!day.results.length && !day.calls.length && !wrong.length) return null;
  const card = "mt-1.5 flex flex-col gap-1 rounded-lg border border-line bg-white/[0.02] px-2.5 py-2";
  return (
    <div data-day-results className="mt-1">
      {day.calls.map((call) => {
        const recap = buildRecap(language, call.said);
        const fixes = recap.filter((item) => item.kind === "fix");
        const hints = recap.filter((item) => item.kind === "hint").length;
        const minutes = Math.max(1, Math.round(((call.finishedAt ?? call.updatedAt) - call.startedAt) / 60000));
        return (
          <button key={call.id} type="button" data-day-call onClick={() => sendAppIntent("openCall", { id: call.id })} className={`${card} text-start hover:bg-white/5`}>
            <span className="flex items-center gap-2 text-caption">
              <span aria-hidden>📞</span>
              <span dir="auto" className="min-w-0 flex-1 truncate font-semibold text-ink">{call.title}</span>
              <span className="shrink-0 tabular-nums text-slate-400">{`${minutes}′`}</span>
              {fixes.length ? <span className="shrink-0 tabular-nums text-warn">{`✎ ${fixes.length}`}</span> : null}
              {hints ? <span className="shrink-0 tabular-nums text-slate-300">{`💡 ${hints}`}</span> : null}
            </span>
            {fixes.slice(0, 2).map((item, i) => (
              <span key={i} className="text-meta">
                {item.said ? <span dir="auto" className="text-slate-500 line-through">{item.said}</span> : null}
                {item.said ? <span aria-hidden className="mx-1 inline-block text-slate-500 rtl:rotate-180">→</span> : null}
                <span dir="auto" className="text-slate-200">{item.line}</span>
              </span>
            ))}
          </button>
        );
      })}
      {day.results.map((result, i) => (
        <div key={`${result.item}-${result.at}-${i}`} data-day-result={result.kind} className={card}>
          <span className="flex items-center gap-2 text-caption">
            <span aria-hidden>{RESULT_ICON[result.kind]}</span>
            <span dir="auto" className="min-w-0 flex-1 truncate font-semibold text-ink">{result.kind === "recall" ? ui.recallTitle : result.title}</span>
            <span className={`shrink-0 tabular-nums ${result.passed ? "text-good" : "text-slate-400"}`}>{`${result.right}/${result.total}${result.passed ? " ✓" : ""}`}</span>
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
          <span className="text-caption font-semibold text-ink">{`${ui.keepTitle} · ${ui.weakTitle}`}</span>
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
