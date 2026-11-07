"use client";

import { TodayCards } from "@/components/studyMap/TodayCards";
import { reformOn } from "@/lib/reform";
import { bankTone } from "@/components/studyMap/bankTone";
import { useEffect, useMemo, useState, useSyncExternalStore, type ReactNode } from "react";
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
import { CALL_NOTES_EVENT, readCallNotes, removeCallNote, type CallNote } from "@/lib/roleplay/callNotes";
import { TutorNote } from "@/components/roleplay/CallParts";
import { buildRecap } from "@/lib/roleplay/recap";
import { tallyCall } from "@/lib/roleplay/transcriptMarks";
import { CALL_DAYS_EVENT, callDayOf, readCallDays, type CallDay } from "@/lib/roleplay/callDays";
import { inPeriod, periodLastDay, periodOf, shiftPeriod, summarize, type Period, type PeriodKind, type PeriodSummary } from "@/lib/curriculum/periodSummary";
import { bars, ESTIMATE, partRows, resultMinutes, totals, type Bar, type Basis, type LogInputs, type PartRow } from "@/lib/curriculum/logbankData";
import { callSeconds, type SavedConversation } from "@/lib/roleplay/saved";
import type { LogItem, PartId } from "@/lib/notes/stageParts";
import type { KnownMap } from "@/lib/curriculum/known";
import type { CheckResult } from "@/lib/curriculum/checkup";
import { computeFill, fillCatalog, keysInCell, studyPoint, type Axis, type BankAxis, type FillCell, type FillEvent } from "@/lib/curriculum/fill";
import { COMPARE_MS, directionView, type DirectionView } from "@/lib/curriculum/directionView";
import { LEDGER_EVENT, migrateLedger, readLedger } from "@/lib/curriculum/logLedger";
import { callTurnsOf, fillEvents, ledgerFillEvents } from "@/lib/curriculum/fillInputs";
import { FILL_CHECK_EVENT, readFillCheck } from "@/lib/curriculum/fillCheck";
import { readFirstCheck } from "@/lib/curriculum/firstCheck";
import { fillDirection, saveFillFocus } from "@/lib/curriculum/fillFocus";
import { loadBank, peekBank } from "@/lib/curriculum/vocabBank";
import { segmentWords } from "@/lib/wordSegments";
import { AxisDetail, axisName, CellDetail, cellName, lackOf, planCells, SkillHexagon, tabOf, type CellPlan } from "@/components/studyMap/SkillHexagon";
import { SkillBands } from "@/components/studyMap/SkillBands";
import { SkillRecord } from "@/components/studyMap/SkillRecord";
import { CardFace } from "@/components/studyMap/QuizPlayer";
import { DictionarySheet } from "@/components/studyMap/Dictionary";
import { fillAt, fillChain, judgeFill } from "@/lib/curriculum/fillJudge";
import { progressIn, usedAt } from "@/lib/curriculum/growthView";
import { forgetGrowthDay } from "@/lib/curriculum/growthLines";
import { forgetTalkDay } from "@/lib/roleplay/talkMemory";
import { PairList, TalkCompare, useGrowthPairs } from "@/components/studyMap/Growth";
import { amountOf, curveOf, curveReady, dayEndMs, LEARN_PARTS, learnedIn, type AmountPoint, type LearnedItem } from "@/lib/curriculum/learnedView";
import { partOf, type CardPart } from "@/lib/curriculum/todayCards";
import { checkStates, dayOfSeconds } from "@/lib/curriculum/checkState";
import type { LogEvent } from "@/lib/curriculum/logLedger";
import { usePrepared } from "@/lib/curriculum/preparedLoad";
import { cardFaceOf } from "@/lib/curriculum/quiz";
import { quizGloss } from "@/lib/curriculum/stageScripts";
import { learningLanguageSpeechTag, type LearningLanguageCode } from "@/lib/learningLanguages";

const LOG = bankTone("log");

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

/** notes = 그날 통화 카드(callNotes — 튜터 메모, 원문이 밀려난 통화도). */
type Day = { day: string; items: LogItem[]; quiz: QuizDays[string] | null; results: DayResult[]; calls: SavedConversation[]; notes: CallNote[] };

/**
 * 날마다 묶기 — 그날 한 공부 전부(일일 총학습, 2026-11-01): 서버 배움·숙지·고침 + 이 폰의 결과(수업·꺼내 쓰기·상황·통화·Quizbank).
 * 같은 날 배움·숙지가 둘 다면 숙지 하나만, 고친 줄은 한 번만. 새 날 먼저.
 */
export function logDays(items: readonly LogItem[], quiz: QuizDays, results: readonly DayResult[] = [], calls: readonly SavedConversation[] = [], notes: readonly CallNote[] = []): Day[] {
  const byDay = new Map<string, Day>();
  const dayOf = (day: string): Day => {
    const have = byDay.get(day);
    if (have) return have;
    const fresh: Day = { day, items: [], quiz: quiz[day]?.n ? quiz[day]! : null, results: [], calls: [], notes: [] };
    byDay.set(day, fresh);
    return fresh;
  };
  for (const item of items) dayOf(localDay(item.at)).items.push(item);
  for (const day of Object.keys(quiz)) if (quiz[day]!.n) dayOf(day);
  for (const result of results) dayOf(result.day).results.push(result);
  for (const call of calls) if (call.said.some((line) => line.who === "learner")) dayOf(localDay(call.startedAt)).calls.push(call);
  for (const note of notes) dayOf(localDay(note.at)).notes.push(note);
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
      return { ...one, items: kept, results: [...one.results].sort((a, b) => a.at - b.at), calls: [...one.calls].sort((a, b) => a.startedAt - b.startedAt), notes: [...one.notes].sort((a, b) => a.at - b.at) };
    })
    .sort((a, b) => dayValue(b.day) - dayValue(a.day));
}

/** 통화 카드(callNotes.v1.<언어>) — 끝난 통화가 남기거나 튜터 메모가 오면 다시 읽는다. */
function useCallNotes(language: string): CallNote[] {
  const raw = useSyncExternalStore(
    (callback) => {
      window.addEventListener(CALL_NOTES_EVENT, callback);
      window.addEventListener("storage", callback);
      return () => {
        window.removeEventListener(CALL_NOTES_EVENT, callback);
        window.removeEventListener("storage", callback);
      };
    },
    () => {
      try {
        return localStorage.getItem(`callNotes.v1.${language}`) ?? "[]";
      } catch {
        return "[]";
      }
    },
    () => "[]",
  );
  // eslint-disable-next-line react-hooks/exhaustive-deps -- raw가 바뀔 때만 다시 읽음
  return useMemo(() => readCallNotes(language), [raw, language]);
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
const VIEW_KEY = "logbankView.v1";
type LogView = "bands" | "hexagon";
function readLogView(): LogView {
  try {
    return localStorage.getItem(VIEW_KEY) === "hexagon" ? "hexagon" : "bands";
  } catch {
    return "bands";
  }
}

function readPeriodKind(): PeriodKind {
  try {
    return localStorage.getItem(PERIOD_KEY) === "month" ? "month" : "week";
  } catch {
    return "week";
  }
}

const PART_ORDER: PartId[] = ["grammar", "vocab", "expression", "pronunciation"];
/** 어디서 했는지 → 아이콘(LogItem where · 수업 결과 종류 · 퀴즈). */
const WHERE_ICON: Record<string, string> = { chat: "💬", call: "📞", video: "🎬", vocab: "📖", map: "🧩", mission: "🎭", review: "📝", lesson: "🧩", recall: "🎯", script: "🎭", quiz: "📝" };

const pct = (n: number) => String(Math.round(n * 100));
const put = (template: string, vars: Record<string, string>) => Object.entries(vars).reduce((text, [key, value]) => text.replaceAll(`{${key}}`, value), template);

/**
 * 지난 2주 비교: 오른 눈금과 예상보다 아래인 칸만(2026-11-06 개편안 4절 ③ — 설명·"다음" 줄·권유 문장 없음).
 * 아래인 칸을 누르면 그 칸 세부(부족한 것·틀린 기록 순서).
 */
function DirectionFlow({
  ui,
  view,
  nameOf,
  onLack,
}: {
  ui: UICopy;
  view: DirectionView;
  nameOf: (cell: FillCell) => string;
  onLack: (cell: FillCell) => void;
}) {
  if (!view.gains.length && !view.lacks.length) return <p data-direction="empty" className="text-note text-slate-500">{ui.dirEmpty}</p>;
  return (
    <div data-direction className="flex flex-col gap-3">
      {view.gains.length ? (
        <section className="flex flex-col gap-1">
          <h3 className="text-caption font-semibold text-slate-300">{ui.dirGain}</h3>
          <ul className="flex flex-col gap-1">
            {view.gains.slice(0, 2).map((row) => (
              <li key={row.axis} data-dir-gain={row.axis} className="text-note text-ink">
                {put(ui.dirUp, { name: axisName(ui, row.axis), before: pct(row.before), now: pct(row.now) })}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      {view.lacks.length ? (
        <section className="flex flex-col gap-1">
          <h3 className="text-caption font-semibold text-slate-300">{ui.dirLack}</h3>
          <ul className="flex flex-col gap-1">
            {view.lacks.slice(0, 1).map((row) => (
              <li key={`${row.cell.axis}:${row.cell.id}`}>
                <button
                  type="button"
                  data-dir-lack={row.cell.id}
                  onClick={() => onLack(row.cell)}
                  className="tb-btn w-full rounded-xl px-3 py-2 text-start text-note text-ink"
                >
                  {put(ui.dirUnder, { name: nameOf(row.cell), expected: pct(row.expected), actual: pct(row.actual) })}
                </button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

/**
 * Logbank(2026-11-02 사용자 "층위가 모호해서 난잡 — 기준을 하나로, 각 탭에서 학습한 걸 모은 자료, 누르면 세부(스크린샷·학습 내용)"):
 * [주 | 월] ‹기간› → 기준 탭 [⏱ 학습 시간 | 📐 문법 | 🔤 어휘 | 💬 표현] → 그 기간 날마다 막대(누르면 그날 세부 — 결과 카드·배운 것·고친 줄)
 * → 그 기준으로 모은 목록은 꼭짓점·시간을 눌렀을 때만.
 * 육각형 아래는 목록 대신 지난 2주 비교(directionView): 오른 눈금, 예상보다 아래인 칸, 설명, 다음 하나.
 * 재료·자료 셈은 curriculum/logbankData.ts(순수).
 */
export function Logbank({
  ui,
  locale,
  language,
  items,
  nodeName,
  grammarName = () => "",
  known = {},
  checkups = [],
  stage = 1,
  head,
}: {
  ui: UICopy;
  locale: string;
  language: string;
  items: readonly LogItem[];
  nodeName: (id: string) => string;
  /** 단계·문법 칸 번호 → 이름(육각형 세부 칸 "문법"). */
  grammarName?: (stage: number, index: number) => string;
  /** 익힘 기록(맞힌 날) · 시험 결과 · 지금 단계 — 육각형 재료(curriculum/fillInputs.ts). */
  known?: KnownMap;
  checkups?: readonly CheckResult[];
  stage?: number;
  head?: ReactNode;
}) {
  const insight = useExpressionInsightOptional();
  // 개편 3단계: 맨 위 오늘 카드(lib/reform.ts가 켜진 앱만).
  const [reform] = useState(reformOn);
  const quiz = useQuizDays(language);
  const results = useDayResults(language);
  const allCalls = useSyncExternalStore(subscribeCalls, readCalls, () => [] as SavedConversation[]);
  const calls = useMemo(() => allCalls.filter((call) => call.language === language), [allCalls, language]);
  const callNotes = useCallNotes(language);
  const allDays = useMemo(() => logDays(items, quiz, results, calls, callNotes), [items, quiz, results, calls, callNotes]);
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
  // 띠 | 육각형(같은 데이터, 기본 띠 — 2026-11-06, RULES 4 "보는 방식 고르기").
  const [view, setView] = useState<LogView>(() => readLogView());
  const chooseView = (next: LogView) => {
    setView(next);
    try {
      localStorage.setItem(VIEW_KEY, next);
    } catch {
      // 이번에만.
    }
  };
  // 사건 장부(curriculum/logLedger.ts): 예전 퀴즈 기록을 이 언어로 처음 열 때 한 번 옮김.
  useEffect(() => {
    migrateLedger(language, readQuizDays);
  }, [language]);
  // 육각형 아래 ⏱ 한 줄을 누르면 학습 시간 막대(예전 기준 탭 ⏱ 자리, 2026-11-02 기준 탭은 육각형 꼭짓점으로).
  const [showTime, setShowTime] = useState(false);
  const [recordOpen, setRecordOpen] = useState(false);
  const [openAxis, setOpenAxis] = useState<Axis | null>(null);
  const [openCell, setOpenCell] = useState<FillCell | null>(null);
  const [back, setBack] = useState(0);
  const [openDay, setOpenDay] = useState<string | null>(null);
  const [openRow, setOpenRow] = useState<string | null>(null);
  const period = useMemo(() => shiftPeriod(periodOf(kind, today), -back), [kind, today, back]);
  const input: LogInputs = useMemo(() => ({ language, items, results, quiz, calls: callRows, dayOf: localDay }), [language, items, results, quiz, callRows]);
  const summary = useMemo(() => summarize({ period, items, results, quiz, calls: callRows, dayOf: localDay }), [period, items, results, quiz, callRows]);
  const chart = useMemo(() => bars(period, "time", input), [period, input]);
  const sum = useMemo(() => totals(period, "time", input), [period, input]);
  const partLists = useMemo(
    () => ({ grammar: partRows(period, "grammar", input), vocab: partRows(period, "vocab", input), expression: partRows(period, "expression", input) }),
    [period, input],
  );
  const rowsOf = (one: Exclude<Basis, "time">) => partLists[one];
  // 언어능력 육각형(curriculum/fill.ts): 낱말 은행을 받으면 어휘 분모가 찬다.
  const [words, setWords] = useState(() => peekBank(language));
  useEffect(() => {
    let live = true;
    void loadBank(language).then((list) => {
      if (live) setWords(list);
    });
    return () => {
      live = false;
    };
  }, [language]);
  const check = useSyncExternalStore(
    (callback) => {
      window.addEventListener(FILL_CHECK_EVENT, callback);
      window.addEventListener("storage", callback);
      return () => {
        window.removeEventListener(FILL_CHECK_EVENT, callback);
        window.removeEventListener("storage", callback);
      };
    },
    () => readFillCheck(language),
    () => null,
  );
  const catalog = useMemo(() => fillCatalog(language, words), [language, words]);
  // 첫 측정(firstCheck.v1) — 안 푼 아래 단계의 근거(fill.ts placed, 2026-11-07).
  const placed = useMemo(() => readFirstCheck(language), [language]);
  // 개편: 띠·육각형 재료 = 사건 장부(오늘 카드·Quizbank와 같은 기록) + 수업 결과·AI 채팅 서버 기록(fillInputs.ts ledgerFillEvents).
  const [ledgerTick, setLedgerTick] = useState(0);
  useEffect(() => {
    if (!reform) return;
    const on = () => setLedgerTick((n) => n + 1);
    window.addEventListener(LEDGER_EVENT, on);
    return () => window.removeEventListener(LEDGER_EVENT, on);
  }, [reform]);
  const ledger = useMemo(() => {
    void ledgerTick;
    return reform ? readLedger(language) : [];
  }, [reform, ledgerTick, language]);
  const events = useMemo(() => {
    const segment = (text: string) => segmentWords(text, language);
    if (reform) return ledgerFillEvents({ ledger, results, items, language, segment });
    return fillEvents({ language, known, quiz, results, items, checkups, segment });
  }, [reform, ledger, language, known, quiz, results, items, checkups]);
  const callTurns = useMemo(() => callTurnsOf(callRows), [callRows]);
  const [nowAt] = useState(() => Date.now());
  // 개편: 하루 한 번 판정(fillJudge.ts — 공부한 날 끝마다 꼭짓점당 ±2%p, 오늘 답은 미세 몫). 2주 비교·기간 시작·곡선도 같은 값.
  const fillInput = useMemo(() => ({ catalog, check, stage, placed, events, calls: callTurns, now: nowAt }), [catalog, check, stage, placed, events, callTurns, nowAt]);
  const chain = useMemo(() => (reform ? fillChain(fillInput) : null), [reform, fillInput]);
  const fill = useMemo(() => (chain ? judgeFill(computeFill(fillInput), chain, fillInput) : computeFill(fillInput)), [chain, fillInput]);
  const earlier = useMemo(() => {
    const cut = nowAt - COMPARE_MS;
    if (chain) return fillAt(chain, fillInput, cut);
    return computeFill({
      catalog,
      check,
      stage,
      placed,
      events: events.filter((one) => one.at < cut),
      calls: callTurns.filter((one) => one.at < cut),
      now: cut,
    });
  }, [chain, fillInput, catalog, check, stage, placed, events, callTurns, nowAt]);
  const direction = useMemo(() => directionView(fill, earlier), [fill, earlier]);
  // 학습 방향: 부족한 칸·아직 모름 칸 열쇠를 이 폰에 — 오늘 할 것이 읽는다(curriculum/fillFocus.ts).
  useEffect(() => {
    if (words) saveFillFocus(language, fillDirection(fill, catalog, events, stage));
  }, [language, words, fill, catalog, events, stage]);
  // 흐린 선 = 고른 기간이 시작할 때(그 전 기록만).
  const before = useMemo(() => {
    // 이 폰 지역의 그날 0시(예전엔 UTC+9로 고정 — 2026-11-02 변경 감시).
    const [y, m, d] = period.start.split("-").map(Number);
    const start = new Date(y ?? 1970, (m ?? 1) - 1, d ?? 1).getTime();
    if (!events.some((one) => one.at >= start) && !callTurns.some((one) => one.at >= start)) return null;
    if (chain) return fillAt(chain, fillInput, Math.min(start, nowAt));
    return computeFill({ catalog, check, stage, placed, events: events.filter((one) => one.at < start), calls: callTurns.filter((one) => one.at < start), now: start });
  }, [chain, fillInput, nowAt, catalog, check, stage, placed, events, callTurns, period.start]);
  // 학습 곡선 선 = 날마다 그날 끝까지 활용(대화에서 맞게 쓴 것) 누적(growthView.ts usedAt — 2026-11-07 밤 사용자 "학습곡선은 누적으로" → 표에서 익힘을 빼며 "1번으로").
  const knownDays = useMemo(() => {
    if (!reform) return [] as (number | null)[];
    return periodDays(period, today).map((day) => {
      const end = dayEndMs(day);
      if (end - 86_400_000 > nowAt) return null;
      return usedAt(ledger, Math.floor(Math.min(end, nowAt) / 1000));
    });
  }, [reform, ledger, period, today, nowAt]);
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
  const rowLabel = (row: PartRow) => (row.node ? nodeName(row.node) || row.text : row.key ? reviewLabel(language, row.key) || row.text : row.text);
  const chip = (on: boolean) => `rounded-full px-3 py-1 text-caption ${on ? bankTone("log").chip : "border border-line text-slate-300"}`;
  const timeLegend: { cls: string; icon: string; title: string }[] = [
    { cls: "fill-info text-info", icon: "📞", title: ui.callRecordsTitle },
    { cls: "fill-info/55 text-info/70", icon: "🧩", title: ui.framesTitle },
    { cls: "fill-slate-400 text-slate-400", icon: "📝", title: ui.keepTitle },
  ];
  const partLegend: { cls: string; icon: string; title: string }[] = [
    { cls: "fill-info text-info", icon: "✓", title: ui.itemsMastered },
    { cls: "fill-info/45 text-info/60", icon: "•", title: ui.itemsLearned },
    { cls: "fill-bad text-bad", icon: "✗", title: ui.partFixed },
  ];
  const dayDetail = openDay ? allDays.find((one) => one.day === openDay) ?? null : null;
  const rowDetail = openRow ? (["grammar", "vocab", "expression"] as const).flatMap((one) => rowsOf(one)).find((row) => row.id === openRow) ?? null : null;
  const dateLabel = (day: string) => (kind === "week" ? weekdayLabel(locale, day) : String(asDate(day).getDate()));
  const rowList = (list: readonly PartRow[]) =>
    list.length ? (
      <ol data-log-rows className="flex flex-col gap-1">
        {list.map((row) => (
          <li key={row.id}>
            <button
              type="button"
              data-log-row={row.status}
              onClick={() => setOpenRow(row.id)}
              className="flex w-full items-center gap-2 rounded-lg border border-line px-3 py-2 text-start hover:bg-white/5"
            >
              <span aria-hidden className={`w-4 shrink-0 text-center text-caption ${row.status === "mastered" ? "text-info" : row.status === "missed" ? "text-bad" : "text-info/60"}`}>
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
    );
  /** 📎 기록: 지금 Logbank의 그 갈래 막대·목록(꼭짓점 몫) — 어휘는 어휘, 문장은 문법 + 덩어리 표현, 듣기·실전 대화는 그 기간 통화. */
  const recordsFor = (axis: Axis): ReactNode => {
    if (axis === "talk" || axis === "listen") {
      const callDaysIn = allDays.filter((one) => (one.calls.length || one.notes.length) && inPeriod(period, one.day));
      return callDaysIn.length ? (
        <ol data-log-calls className="flex flex-col gap-1">
          {callDaysIn.map((one) => (
            <li key={one.day}>
              <button type="button" onClick={() => setOpenDay(one.day)} className="flex w-full items-center gap-2 rounded-lg border border-line px-3 py-2 text-start hover:bg-white/5">
                <span className="min-w-0 flex-1 truncate text-note text-ink">{dayFormat(locale, one.day)}</span>
                <span className="shrink-0 text-meta tabular-nums text-slate-400">{(() => {
                  const gone = orphanNotes(one);
                  const secs = one.calls.reduce((n, call) => n + callSeconds(call), 0) + gone.reduce((n, note) => n + note.secs, 0);
                  return `📞 ${one.calls.length + gone.length} · ${Math.max(1, Math.round(secs / 60))}′`;
                })()}</span>
              </button>
            </li>
          ))}
        </ol>
      ) : (
        <p className="text-note text-slate-500">—</p>
      );
    }
    const basisOf: Exclude<Basis, "time"> = axis.startsWith("vocab") ? "vocab" : "grammar";
    const list = basisOf === "vocab" ? rowsOf("vocab") : [...rowsOf("grammar"), ...rowsOf("expression")];
    return (
      <div className="flex flex-col gap-3">
        <LogChart bars={bars(period, basisOf, input)} kind={kind} legend={partLegend} unit="" dateLabel={dateLabel} onDay={(day) => setOpenDay(day)} />
        {rowList(list)}
      </div>
    );
  };
  const keyLabel = (key: string) => reviewLabel(language, key) || key.slice(2);
  const openKey = (key: string) => {
    if (key.startsWith("w|")) insight?.open({ sentence: key.slice(2), selected: key.slice(2) });
    else openLesson({ language, key });
  };
  /** 3층: 부족한 점 한 줄, 틀린 기록만 순서. 안 푼 표현은 "공부하세요"로 넣지 않는다. */
  const planFor = (axis: Axis, cell: FillCell): CellPlan => {
    const rows = planCells(fill.axes[axis].cells, tabOf(cell.id));
    const order = Math.max(1, rows.findIndex((one) => one.id === cell.id) + 1);
    const lack = lackOf(ui, cell);
    if (axis === "talk" || axis === "listen") {
      const thin = cell.state === "weak" || cell.state === "unknown";
      return {
        order,
        lack,
        why: thin ? (axis === "listen" ? ui.fillListenWhy : ui.fillTalkWhy) : "",
        steps: [],
        recommend: thin ? { icon: "📞", label: axisName(ui, axis), go: () => sendAppIntent("startCall", {}) } : null,
      };
    }
    const bank = axis as BankAxis;
    const use = bank.endsWith("Use");
    const items = bank.startsWith("vocab") ? catalog.vocab : catalog.sent;
    const mine = (one: FillEvent) => one.use === use && items.has(one.key);
    const latest = new Map<string, FillEvent>();
    for (const one of [...events].sort((a, b) => a.at - b.at)) {
      if (!mine(one)) continue;
      latest.set(one.key, one);
    }
    const inCell = cell.id.startsWith("miss:")
      ? [...latest.values()].filter((one) => !one.correct && one.miss === cell.id.slice(5)).map((one) => one.key)
      : keysInCell(catalog, bank, cell.id);
    const missed = inCell.filter((key) => latest.get(key) && !latest.get(key)!.correct).sort((a, b) => latest.get(b)!.at - latest.get(a)!.at);
    const steps: { key: string; label: string }[] = [];
    const seen = new Set<string>();
    for (const key of missed) {
      const point = studyPoint(language, key, grammarName);
      if (!point || seen.has(point.key)) continue;
      seen.add(point.key);
      steps.push(point);
      if (steps.length === 4) break;
    }
    const first = steps[0];
    return {
      order,
      lack,
      why: first ? ui.fillMissedLast : "",
      steps,
      recommend: first
        ? { icon: first.key.startsWith("w|") ? "📖" : "🧩", label: first.label, go: () => openKey(first.key) }
        : null,
    };
  };
  return (
    <div data-logbank className="flex flex-col gap-3">
      {reform ? <TodayCards ui={ui} language={language} locale={locale} /> : null}
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
        {reform ? (
          <Learned
            ui={ui}
            language={language}
            locale={locale}
            ledger={ledger}
            period={period}
            today={today}
            known={knownDays}
            calls={calls}
            notes={callNotes}
            grammarName={grammarName}
            keyLabel={keyLabel}
            dateLabel={dateLabel}
          />
        ) : null}
        <div className="flex gap-1 self-end" role="group">
          {(["bands", "hexagon"] as const).map((one) => (
            <button
              key={one}
              type="button"
              data-log-view={one}
              aria-pressed={view === one}
              aria-label={one === "bands" ? ui.logViewBands : ui.logViewHexagon}
              title={one === "bands" ? ui.logViewBands : ui.logViewHexagon}
              onClick={() => chooseView(one)}
              className={chip(view === one)}
            >
              {one === "bands" ? "☰" : "⬡"}
            </button>
          ))}
        </div>
        {view === "bands" ? (
          <SkillBands
            ui={ui}
            result={fill}
            before={before}
            onAxis={setOpenAxis}
            onRecord={!reform && checkups?.length ? () => setRecordOpen(true) : undefined}
            recordLabel={ui.skillRecord}
          />
        ) : (
          <SkillHexagon
            ui={ui}
            result={fill}
            before={before}
            onAxis={setOpenAxis}
            onRecord={!reform && checkups?.length ? () => setRecordOpen(true) : undefined}
            recordLabel={ui.skillRecord}
          />
        )}
        <DirectionFlow
          ui={ui}
          view={direction}
          nameOf={(cell) => cellName(ui, cell.id, grammarName)}
          onLack={(cell) => {
            setOpenAxis(cell.axis);
            setOpenCell(cell);
          }}
        />
        {recordOpen && checkups?.length ? (
          <SkillRecord
            ui={ui}
            locale={locale}
            checkups={checkups}
            labelOf={(key) => {
              if (key.startsWith("g|") && grammarName) {
                const [stage, index] = key.slice(2).split(":").map(Number);
                return grammarName(stage!, index!);
              }
              return keyLabel(key);
            }}
            onClose={() => setRecordOpen(false)}
          />
        ) : null}
        <button
          type="button"
          data-log-time
          aria-expanded={showTime}
          onClick={() => setShowTime((open) => !open)}
          className="flex items-center gap-3 self-start rounded-full border border-line px-3 py-1 text-note tabular-nums text-slate-200 hover:bg-white/5"
        >
          <span title={ui.logStudyTime}>{`⏱ ${sum.minutes ?? 0}′`}</span>
          <span title={ui.logStudyDays} aria-label={`${ui.logStudyDays} ${summary.activeDays}`}>{`📅 ${summary.activeDays}`}</span>
        </button>
        {showTime ? (
          <>
            <LogChart bars={chart} kind={kind} legend={timeLegend} unit="′" dateLabel={dateLabel} onDay={(day) => setOpenDay(day)} />
            <div className="flex flex-wrap gap-x-3 text-meta text-slate-400">
              {timeLegend.map((one) => (
                <span key={one.icon} title={one.title} className="inline-flex items-center gap-1">
                  <svg aria-hidden width="8" height="8" className={one.cls}><rect width="8" height="8" rx="2" /></svg>
                  {`${one.icon} ${one.title}`}
                </span>
              ))}
            </div>
          </>
        ) : null}
      </section>
      {showTime ? <TimeSources ui={ui} summary={summary} input={input} period={period} /> : null}
      {/* Logbank 아래 네이티브 하나(전체 화면에서만, 바닥 화면은 배너) — 둘러보는 목록 자리 규칙. */}
      <NativeAdSlot feedId="my-full" slotKey="logbank-list" spaced layerOnly />
      {openAxis ? (
        <LogSheet title={axisName(ui, openAxis)} ui={ui} onClose={() => setOpenAxis(null)}>
          <AxisDetail ui={ui} axis={openAxis} fill={fill.axes[openAxis]} grammarName={grammarName} records={recordsFor(openAxis)} onCell={setOpenCell} />
        </LogSheet>
      ) : null}
      {openAxis && openCell ? (
        <LogSheet title={`${axisName(ui, openAxis)} · ${cellName(ui, openCell.id, grammarName)}`} ui={ui} onClose={() => setOpenCell(null)}>
          <CellDetail ui={ui} plan={planFor(openAxis, openCell)} onKey={openKey} />
        </LogSheet>
      ) : null}
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
                className={`rounded-full px-2 py-0.5 text-meta ${item.kind === "mastered" ? "bg-info/20 text-info" : "bg-info/10 text-info/70"}`}
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
      {!day.results.length && !day.calls.length && !day.notes.length && !day.items.length && !day.quiz ? <p className="text-note text-slate-500">—</p> : null}
    </div>
  );
}

/** 소재 세부: ▶ 그 수업 + 그 기간 나온 일(새것부터) — 수업 결과 카드·고친 줄·퀴즈 틀림·배움/익힘. */
function RowBody({ ui, locale, language, row }: { ui: UICopy; locale: string; language: string; row: PartRow }) {
  const key = row.key ?? (row.node ? grammarKeyOfNode(language, row.node) : expressionKeyOf(language, row.text));
  return (
    <div data-log-row-detail className="flex flex-col gap-2">
      {key ? (
        <button type="button" data-log-row-open onClick={() => openLesson({ language, key })} className="self-start rounded-full bg-info px-4 py-1.5 text-caption font-semibold text-slate-900">
          ▶
        </button>
      ) : null}
      <ol className="flex flex-col gap-2">
        {row.events.map((event, i) => (
          <li key={`${event.at}-${i}`} className="flex flex-col gap-1 rounded-lg border border-line bg-white/[0.02] px-2.5 py-2">
            <span className="flex items-center gap-2 text-caption">
              <span aria-hidden>{WHERE_ICON[event.where] ?? "·"}</span>
              <span className="min-w-0 flex-1 tabular-nums text-slate-400">{dayFormat(locale, event.day)}</span>
              {event.kind === "mastered" ? <span className="text-info">{`✓ ${ui.itemsMastered}`}</span> : null}
              {event.kind === "learned" ? <span className="text-info">{ui.itemsLearned}</span> : null}
              {event.kind === "quizWrong" ? <span className="text-bad">{`✗ ${ui.keepTitle}`}</span> : null}
              {event.kind === "fixed" ? <span className="text-bad">{`✎ ${ui.partFixed}`}</span> : null}
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
                <span aria-hidden className={line.good ? "text-good" : "text-bad"}>{line.good ? "✓" : "✗"}</span>
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

/** 그날 카드 중 원문(통화 기록)이 이제 없는 것. */
function orphanNotes(day: Pick<Day, "calls" | "notes">): CallNote[] {
  const kept = new Set(day.calls.map((call) => call.id));
  return day.notes.filter((note) => !kept.has(note.id));
}

/**
 * 그날 결과 카드(2026-11-01 사용자 "결과 샷 — 통화면 학습 결과 창"): 수업·꺼내 쓰기·상황은 끝 화면의 맞힌 수와 내가 말한 줄,
 * 통화는 통화 정리(고친 말·💡) — 누르면 그 통화 돌아보기, Quizbank는 그날 틀린 것. 이 폰 기록만.
 */
function DayResults({ ui, language, day }: { ui: UICopy; language: string; day: Day }) {
  // 통화 카드 ×는 통화 기록도 지워서 한 번 묻는다(2026-11-01 사용자 "X랑 일괄 삭제") — CallResultCard 안에서.
  const wrong = (day.quiz?.wrong ?? []).map((key) => reviewLabel(language, key)).filter(Boolean);
  const gone = orphanNotes(day);
  const noteOf = (id: string) => day.notes.find((note) => note.id === id)?.summary ?? "";
  if (!day.results.length && !day.calls.length && !gone.length && !wrong.length) return null;
  const card = "mt-1.5 flex flex-col gap-1 rounded-lg border border-line bg-white/[0.02] px-2.5 py-2";
  const remove = (label: string, onClick: () => void, data: string) => (
    <button type="button" data-day-remove={data} aria-label={`${label} · ${ui.notebookDelete}`} title={ui.notebookDelete} onClick={onClick} className="-me-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-caption text-slate-500 hover:bg-white/10 hover:text-ink">
      ✕
    </button>
  );
  return (
    <div data-day-results className="mt-1">
      {day.calls.map((call) => (
        <CallResultCard key={call.id} ui={ui} language={language} call={call} note={noteOf(call.id)} />
      ))}
      {/* 원문이 20통 밖으로 밀려난 통화 — 카드와 튜터 메모만(열 수 없음, 2026-11-06). */}
      {gone.map((note) => (
        <div key={note.id} data-day-call-note className={card}>
          <div className="flex items-start gap-2">
            <span className="flex min-w-0 flex-1 items-center gap-2 text-caption">
              <span aria-hidden>📞</span>
              <span dir="auto" className="min-w-0 flex-1 truncate font-semibold text-ink">{note.title}</span>
              <span className="shrink-0 tabular-nums text-slate-400">{`${Math.max(1, Math.round(note.secs / 60))}′`}</span>
              {note.fixed ? <span className="shrink-0 tabular-nums text-bad">{`✎ ${note.fixed}`}</span> : null}
              {note.hints ? <span className="shrink-0 tabular-nums text-slate-300">{`💡 ${note.hints}`}</span> : null}
              {note.redone ? <span className="shrink-0 tabular-nums text-good" title={ui.roleplaySayAgain} aria-label={`${ui.roleplaySayAgain} ${note.redone}`}>{`🔁 ${note.redone}`}</span> : null}
            </span>
            {remove(note.title, () => removeCallNote(language, note.id), "call-note")}
          </div>
          {note.summary ? <TutorNote compact text={note.summary} language={language} {...(note.gender ? { gender: note.gender } : {})} /> : null}
        </div>
      ))}
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
              <span aria-hidden className={line.good ? "text-good" : "text-bad"}>{line.good ? "✓" : "✗"}</span>
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
              <span key={label} dir="auto" className="rounded-full bg-bad/10 px-2 py-0.5 text-meta text-bad">
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
/**
 * 통화 결과 카드 하나(그날 세부·"배운 것" 통화 목록이 같이 씀 — 2026-11-07 사용자 "통화학습은 이미 있는 통화결과창"):
 * 제목·분·✎·💡·🔁 + 튜터 메모 + 고친 줄 둘, 누르면 그 통화 돌아보기(openCall). removable이면 ×(통화 기록도 지움 — 한 번 묻기).
 */
function CallResultCard({ ui, language, call, note, removable = true }: { ui: UICopy; language: string; call: SavedConversation; note: string; removable?: boolean }) {
  const [asking, setAsking] = useState<string | null>(null);
  const card = "mt-1.5 flex flex-col gap-1 rounded-lg border border-line bg-white/[0.02] px-2.5 py-2";
  const remove = (label: string, onClick: () => void, data: string) => (
    <button type="button" data-day-remove={data} aria-label={`${label} · ${ui.notebookDelete}`} title={ui.notebookDelete} onClick={onClick} className="-me-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-caption text-slate-500 hover:bg-white/10 hover:text-ink">
      ✕
    </button>
  );
        const recap = buildRecap(language, call.said);
        const fixes = recap.filter((item) => item.kind === "fix");
        const hints = recap.filter((item) => item.kind === "hint").length;
        // 튜터 수업에서 다시 말해 맞힌 줄 수 — 통화 끝 요약의 🔁와 같은 셈(2026-11-02 사용자 "학습결과창에도").
        const redone = tallyCall(call.said).redone;
        const minutes = Math.max(1, Math.round(callSeconds(call) / 60));
  return (
          <div data-day-call className={card}>
            <div className="flex items-start gap-2">
              <button type="button" data-day-call-open onClick={() => sendAppIntent("openCall", { id: call.id })} className="flex min-w-0 flex-1 flex-col gap-1 text-start">
                <span className="flex items-center gap-2 text-caption">
                  <span aria-hidden>📞</span>
                  <span dir="auto" className="min-w-0 flex-1 truncate font-semibold text-ink">{call.title}</span>
                  <span className="shrink-0 tabular-nums text-slate-400">{`${minutes}′`}</span>
                  {fixes.length ? <span className="shrink-0 tabular-nums text-bad">{`✎ ${fixes.length}`}</span> : null}
                  {hints ? <span className="shrink-0 tabular-nums text-slate-300">{`💡 ${hints}`}</span> : null}
                  {redone ? (
                    <span className="shrink-0 tabular-nums text-good" title={ui.roleplaySayAgain} aria-label={`${ui.roleplaySayAgain} ${redone}`}>{`🔁 ${redone}`}</span>
                  ) : null}
                </span>
              </button>
              {removable ? remove(call.title, () => setAsking(call.id), "call") : null}
            </div>
            {note ? <TutorNote compact text={note} language={language} /> : null}
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
              <Confirm ui={ui} note={ui.callAlsoDeleted} onYes={() => { discardCall(call.id); removeCallNote(language, call.id); setAsking(null); }} onNo={() => setAsking(null)} />
            ) : null}
          </div>
        );
}

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
  if (!day.results.length && !day.calls.length && !day.notes.length && !day.quiz) return null;
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
              forgetGrowthDay(language, day.day, (t) => dayOfSeconds(t));
              forgetTalkDay(language, day.day, (ms) => dayOfSeconds(Math.floor(ms / 1000)));
              for (const call of day.calls) discardCall(call.id);
              for (const note of day.notes) removeCallNote(language, note.id);
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

/** 기간의 날짜 목록(오래된 것부터, 오늘까지만). */
function periodDays(period: Period, today: string): string[] {
  const last = periodLastDay(period);
  const end = dayValue(last) < dayValue(today) ? last : today;
  const out: string[] = [];
  for (let value = dayValue(period.start); value <= dayValue(end); value += 86_400_000) out.push(new Date(value).toISOString().slice(0, 10));
  return out;
}

const LEARN_ICON: Record<CardPart, string> = { word: "🔤", grammar: "📐", expression: "💬", frame: "🧩" };

type GrowCol = "studied" | "used";
const GROW_COLS: readonly GrowCol[] = ["studied", "used"];

function learnPartName(ui: UICopy, part: CardPart): string {
  return { word: ui.partVocab, grammar: ui.partGrammar, expression: ui.partExpression, frame: ui.framesTitle }[part];
}

/**
 * 개편 Logbank "배운 것"(2026-11-07 사용자 "학습한 게 확실하게 보이게"): 고른 기간에 푼 것 — 요소마다 개수(누르면 그 카드들) + 📞 통화 수(누르면 통화 결과 카드).
 * 그 아래 학습 곡선(답한 날이 둘 이상일 때) — 날마다 푼 수 막대와 맞힌 비율 선, 요소 칩으로 바꿔 봄. 재료는 사건 장부(curriculum/learnedView.ts).
 */
function Learned({
  ui,
  language,
  locale,
  ledger,
  period,
  today,
  known,
  calls,
  notes,
  grammarName,
  keyLabel,
  dateLabel,
}: {
  ui: UICopy;
  language: string;
  locale: string;
  ledger: readonly LogEvent[];
  period: Period;
  today: string;
  /** 날마다 그날 끝의 확인된 실력(days와 같은 차례, 오늘 뒤는 null). */
  known: readonly (number | null)[];
  calls: readonly SavedConversation[];
  notes: readonly CallNote[];
  grammarName: (stage: number, index: number) => string;
  keyLabel: (key: string) => string;
  dateLabel: (day: string) => string;
}) {
  // 배운 것 = 표 하나(2026-11-07 밤 사용자 "배운 것·늘어난 것·어휘·새로가 UI로 구분이 안 돼" → "바꿔줘, 대화에서 씀은 활용으로"):
  // 줄 = 무엇(어휘·문법·표현·문장구조), 칸 = 학습(그 기간에 푼 것) · 활용(대화에서 맞게 씀) — 익힘은 뺌(같은 밤 "기준이 모호, 활용과 겹침"),
  // 아래 다시 맞힘 · 고쳐 씀 · 통화. 계산 curriculum/growthView.ts.
  const [open, setOpen] = useState<{ part: CardPart; col: GrowCol } | "call" | "recovered" | "fixed" | null>(null);
  const days = useMemo(() => periodDays(period, today), [period, today]);
  const progress = useMemo(() => progressIn(ledger, (t) => inPeriod(period, dayOfSeconds(t))), [ledger, period]);
  const inTime = useMemo(() => (t: number) => inPeriod(period, dayOfSeconds(t)), [period]);
  const pairs = useGrowthPairs(language, inTime);
  const allItems = useMemo(() => {
    const all = learnedIn(ledger, () => true);
    return new Map(LEARN_PARTS.flatMap((part) => all[part]).map((one) => [one.key, one]));
  }, [ledger]);
  const itemsOf = (keys: readonly string[]): LearnedItem[] => keys.map((key) => allItems.get(key) ?? { key, ok: 0, miss: 0, last: 0, lastOk: false });
  const cell = (part: CardPart, col: GrowCol) => progress[col].filter((key) => partOf(key) === part);
  const rows = LEARN_PARTS.filter((part) => GROW_COLS.some((col) => cell(part, col).length));
  const periodCalls = useMemo(() => calls.filter((call) => inPeriod(period, localDay(call.startedAt))).sort((a, b) => b.startedAt - a.startedAt), [calls, period]);
  const all = useMemo(() => curveOf(ledger, days, null, (t) => dayOfSeconds(t)), [ledger, days]);
  const amounts = useMemo(() => amountOf(ledger, days, (t) => dayOfSeconds(t)), [ledger, days]);
  const extras = [
    { id: "recovered" as const, icon: "↺", label: ui.growRecovered, n: progress.recovered.length },
    { id: "fixed" as const, icon: "✎✓", label: ui.growFixed, n: pairs.length },
    { id: "call" as const, icon: "📞", label: ui.homeTabCall, n: periodCalls.length },
  ].filter((one) => one.n > 0);
  if (!rows.length && !extras.length) return null;
  const chip = "flex items-center gap-1 rounded-full border border-line px-3 py-1 text-note tabular-nums text-slate-200 hover:bg-white/5";
  const colName = (col: GrowCol) => ({ studied: ui.lbFresh, used: ui.growUsed })[col];
  const openCell = typeof open === "object" && open ? open : null;
  return (
    <div data-learned className="flex flex-col gap-2">
      <h3 className="text-caption font-semibold text-slate-300">{ui.itemsLearned}</h3>
      {rows.length ? (
        <table data-learned-table className="w-full text-note tabular-nums">
          <thead>
            <tr className="text-meta text-slate-500">
              <th className="py-1 text-start font-normal" />
              {GROW_COLS.map((col) => (
                <th key={col} className="py-1 text-end font-normal">{colName(col)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((part) => (
              <tr key={part} data-learned-part={part} className="border-t border-line">
                <td className="py-1.5 text-slate-300">
                  <span aria-hidden>{LEARN_ICON[part]} </span>
                  {learnPartName(ui, part)}
                </td>
                {GROW_COLS.map((col) => {
                  const n = cell(part, col).length;
                  return (
                    <td key={col} className="py-1 text-end">
                      {n ? (
                        <button type="button" data-learned-cell={`${part}-${col}`} onClick={() => setOpen({ part, col })} className="rounded-full px-2 py-0.5 font-semibold text-ink hover:bg-white/5">
                          {n}
                        </button>
                      ) : (
                        <span className="px-2 text-slate-600">0</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
      {extras.length ? (
        <div data-growth className="flex flex-wrap gap-1.5">
          {extras.map((one) => (
            <button key={one.id} type="button" data-growth-chip={one.id} onClick={() => setOpen(one.id)} className={chip}>
              <span aria-hidden>{one.icon}</span>
              <span>{one.label}</span>
              <span className="font-semibold text-ink">{one.n}</span>
            </button>
          ))}
        </div>
      ) : null}
      <TalkCompare ui={ui} language={language} locale={locale} keyLabel={keyLabel} />
      {curveReady(all) ? (
        <LearnCurve ui={ui} amounts={amounts} known={known} dateLabel={dateLabel} />
      ) : null}
      {openCell ? (
        <LogSheet title={`${LEARN_ICON[openCell.part]} ${learnPartName(ui, openCell.part)} · ${colName(openCell.col)} · ${cell(openCell.part, openCell.col).length}`} ui={ui} onClose={() => setOpen(null)}>
          <LearnedCards ui={ui} language={language} locale={locale} items={itemsOf(cell(openCell.part, openCell.col).slice(0, 120))} ledger={ledger} grammarName={grammarName} keyLabel={keyLabel} />
        </LogSheet>
      ) : null}
      {open === "recovered" ? (
        <LogSheet title={`↺ ${ui.growRecovered} · ${progress.recovered.length}`} ui={ui} onClose={() => setOpen(null)}>
          <LearnedCards ui={ui} language={language} locale={locale} items={itemsOf(progress.recovered.slice(0, 120))} ledger={ledger} grammarName={grammarName} keyLabel={keyLabel} />
        </LogSheet>
      ) : null}
      {open === "fixed" ? (
        <LogSheet title={`✎✓ ${ui.growFixed} · ${pairs.length}`} ui={ui} onClose={() => setOpen(null)}>
          <PairList pairs={pairs} locale={locale} />
        </LogSheet>
      ) : null}
      {open === "call" ? (
        <LogSheet title={`📞 ${ui.homeTabCall} · ${periodCalls.length}`} ui={ui} onClose={() => setOpen(null)}>
          <div data-learned-calls className="flex flex-col gap-1">
            {periodCalls.map((call) => (
              <div key={call.id}>
                <p className="mt-2 text-meta text-slate-500">{dayFormat(locale, localDay(call.startedAt))}</p>
                <CallResultCard ui={ui} language={language} call={call} note={notes.find((note) => note.id === call.id)?.summary ?? ""} removable={false} />
              </div>
            ))}
          </div>
        </LogSheet>
      ) : null}
    </div>
  );
}

/** 푼 카드들: 퀴즈에서 본 카드 그대로(낱말·뜻·예문·예문 뜻) + 체크 셋 표시·맞힘/틀림 수 + 📕(사전·그 수업). */
function LearnedCards({
  ui,
  language,
  locale,
  items,
  ledger,
  grammarName,
  keyLabel,
}: {
  ui: UICopy;
  language: string;
  locale: string;
  items: readonly LearnedItem[];
  ledger: readonly LogEvent[];
  grammarName: (stage: number, index: number) => string;
  keyLabel: (key: string) => string;
}) {
  const [word, setWord] = useState<string | null>(null);
  const states = useMemo(() => checkStates(ledger), [ledger]);
  const prepared = usePrepared(language, locale);
  const tag = learningLanguageSpeechTag(language as LearningLanguageCode);
  const markOf = (key: string) => {
    const level = states.get(key)?.level ?? "new";
    return level === "known" ? { icon: "✓", label: ui.knownTag, cls: "text-good" } : level === "hard" ? { icon: "◐", label: ui.lbCardHard, cls: "text-warn" } : { icon: "○", label: ui.lbCardNew, cls: "text-slate-400" };
  };
  const face = (key: string) => {
    if (key.startsWith("w|") || key.startsWith("e|")) {
      const one = cardFaceOf(language, key);
      if (!one) return null;
      const at = one.text.indexOf(one.piece);
      return {
        word: one.word,
        meaning: one.meaning,
        line: (
          <>
            {one.text.slice(0, at)}
            <strong className="font-semibold text-ink">{one.piece}</strong>
            {one.text.slice(at + one.piece.length)}
          </>
        ),
        lineGloss: quizGloss(one.gloss, locale, language),
        speak: { text: one.text, tag },
      };
    }
    const item = key.startsWith("g|") ? prepared?.find((one) => one.key === key) : undefined;
    if (!item) return null;
    const [stage, index] = key.slice(2).split(":").map(Number);
    return {
      word: grammarName(stage ?? 0, index ?? 0) || item.answer,
      meaning: item.why,
      line: (
        <>
          {item.before}
          <strong className="font-semibold text-ink">{item.answer}</strong>
          {item.after}
        </>
      ),
      lineGloss: item.gloss,
      speak: { text: `${item.before}${item.answer}${item.after}`, tag },
    };
  };
  return (
    <ul data-learned-cards className="flex flex-col gap-3">
      {items.map((one) => {
        const mark = markOf(one.key);
        const card = face(one.key);
        return (
          <li key={one.key} data-learned-card={one.key} className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-caption">
              <span className={`font-semibold ${mark.cls}`} aria-label={mark.label} title={mark.label}>
                {mark.icon}
              </span>
              <span className="tabular-nums text-good">{`✓ ${one.ok}`}</span>
              {one.miss ? <span className="tabular-nums text-bad">{`✗ ${one.miss}`}</span> : null}
              <span className="flex-1" />
              <button
                type="button"
                data-learned-open
                onClick={() => (one.key.startsWith("w|") ? setWord(one.key.slice(2)) : openLesson({ language, key: one.key }))}
                className="rounded-full border border-line px-3 py-0.5 text-caption text-slate-300 hover:bg-white/10"
              >
                <span aria-hidden>📕 </span>
                {ui.languagebankTitle}
              </button>
            </div>
            {card ? (
              <CardFace word={card.word} meaning={card.meaning} line={card.line} lineGloss={card.lineGloss} speak={card.speak} />
            ) : (
              <p dir="auto" className="rounded-xl border border-line p-3 text-chat font-semibold text-ink">
                {keyLabel(one.key)}
              </p>
            )}
          </li>
        );
      })}
      {word ? <DictionarySheet ui={ui} language={language} locale={locale} word={word} title={ui.languagebankTitle} onClose={() => setWord(null)} /> : null}
    </ul>
  );
}

/**
 * 학습 곡선(2026-11-07 사용자 "Logbank는 학습량 + 채운 %, 학습량은 푼 수"): 아래 막대 = 날마다 푼 수(새로 · 다시 두 색),
 * 위 선 = 그날 끝까지 활용 누적(growthView.ts usedAt — 대화에서 맞게 쓴 열쇠 수, 줄지 않음, 2026-11-07 밤).
 * 눈금이 둘이라 숫자 눈금은 없고, 날을 누르면 그날 "학습 n · 복습 m · 지금까지 활용 N". 선의 세로는 기간 첫날 값 아래 여유 ~ 가장 높은 값 위 여유로 잡아 오름이 보이게.
 */
function LearnCurve({ ui, amounts, known, dateLabel }: { ui: UICopy; amounts: readonly AmountPoint[]; known: readonly (number | null)[]; dateLabel: (day: string) => string }) {
  const [pick, setPick] = useState<number | null>(null);
  const W = 320;
  const H = 120;
  const top = 10;
  const barTop = H * 0.55;
  const max = Math.max(1, ...amounts.map((one) => one.fresh + one.again));
  const step = W / Math.max(1, amounts.length);
  const barW = Math.max(2, Math.min(18, step * 0.6));
  const x = (i: number) => step * i + step / 2;
  const values = known.filter((one): one is number => one !== null);
  const high = Math.max(1, ...values);
  const low = Math.max(0, Math.min(high, ...values) - Math.max(1, (high - Math.min(high, ...values)) * 0.25));
  const span = Math.max(1, (high - low) * 1.15);
  const ySure = (value: number) => top + (1 - (value - low) / span) * (barTop - top);
  const dots = known.map((one, i) => (one === null ? null : ([x(i), ySure(one)] as const)));
  const line = dots.filter(Boolean).map((p, i) => `${i ? "L" : "M"}${p![0].toFixed(1)},${p![1].toFixed(1)}`).join(" ");
  const every = amounts.length > 10 ? 5 : 1;
  const shown = pick ?? (() => {
    for (let i = known.length - 1; i >= 0; i -= 1) if (known[i] !== null) return i;
    return amounts.length - 1;
  })();
  const at = amounts[shown];
  return (
    <figure data-learn-curve className="m-0 flex flex-col gap-2 rounded-xl border border-line p-3">
      <figcaption className="text-caption font-semibold text-slate-300">{ui.lbCurve}</figcaption>
      <svg viewBox={`0 0 ${W} ${H + 16}`} role="img" aria-label={ui.lbCurve} direction="ltr" className="h-auto w-full">
        <line x1={0} x2={W} y1={H} y2={H} className="stroke-white/10" strokeWidth="0.6" />
        {amounts.map((one, i) => {
          const h1 = (one.fresh / max) * (H - barTop - 4);
          const h2 = (one.again / max) * (H - barTop - 4);
          return (
            <g key={one.day} data-curve-day={one.day} onClick={() => setPick(i)} className="cursor-pointer">
              <rect x={x(i) - step / 2} y={0} width={step} height={H} className="fill-transparent" />
              {one.again ? <rect x={x(i) - barW / 2} y={H - h2} width={barW} height={h2} rx="1.5" className={`${LOG.fill} opacity-25`} /> : null}
              {one.fresh ? <rect x={x(i) - barW / 2} y={H - h2 - h1} width={barW} height={h1} rx="1.5" className={`${LOG.fill} opacity-60`} /> : null}
              {i === shown ? <rect x={x(i) - step / 2 + 1} y={1} width={step - 2} height={H - 1} rx="3" className="fill-white/5" /> : null}
            </g>
          );
        })}
        {line ? <path d={line} className={`pointer-events-none fill-none ${LOG.stroke}`} strokeWidth="1.8" strokeLinejoin="round" /> : null}
        {dots.map((p, i) => (p ? <circle key={amounts[i]!.day} cx={p[0]} cy={p[1]} r={i === shown ? 3.4 : 2.4} className={`pointer-events-none ${LOG.fill}`} /> : null))}
        {amounts.map((one, i) =>
          i % every === 0 || i === amounts.length - 1 ? (
            <text key={`d-${one.day}`} x={x(i)} y={H + 12} textAnchor="middle" className="fill-slate-500 text-meta">
              {dateLabel(one.day)}
            </text>
          ) : null,
        )}
      </svg>
      {at ? (
        <p data-curve-detail className="flex flex-wrap items-center gap-x-3 text-meta tabular-nums text-slate-400">
          <span className="text-slate-300">{dateLabel(at.day)}</span>
          <span className="inline-flex items-center gap-1">
            <svg aria-hidden width="8" height="8" className={`${LOG.fill} opacity-60`}><rect width="8" height="8" rx="2" /></svg>
            {`${ui.lbFresh} ${at.fresh + at.again}`}
          </span>
          <span className="inline-flex items-center gap-1">
            <svg aria-hidden width="8" height="8" className={`${LOG.fill} opacity-25`}><rect width="8" height="8" rx="2" /></svg>
            {`${ui.lbAgain} ${at.again}`}
          </span>
          <span className="inline-flex items-center gap-1">
            <svg aria-hidden width="8" height="8" className={LOG.fill}><circle cx="4" cy="4" r="3" /></svg>
            {`${ui.growUsedAll} ${known[shown] ?? 0}`}
          </span>
        </p>
      ) : null}
    </figure>
  );
}
