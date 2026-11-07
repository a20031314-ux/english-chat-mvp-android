"use client";

/**
 * "늘었어요" 화면 조각(2026-11-07 사용자 "포인트 말고 학습한 단어 N개 식으로" · "틀렸던 문장 > 이후 활용한 문장" ·
 * "구사 문장의 길이·단어 수준·대화 소재를 실제 대화로 — 예전엔 이 정도, 지금은" → "진행해줘").
 *
 * - TodayGrowth: Logbank 오늘 칸 한 줄 — 새로 · 익힘 · 다시 맞힘 · 써 봄(오늘 것, 0이면 안 보임).
 * - PairList: 틀린 문장(날짜, 줄 그음 + 바른 꼴) → 다른 날 맞게 쓴 내 문장.
 * - CallGrowthPairs: 통화 끝 화면 — 이번 통화에서 예전에 고쳐진 것을 맞게 쓴 짝.
 * - TalkCompare: 처음 3통 vs 최근 3통(자유대화) — 보기 문장 둘 + 나아진 칸만.
 * 재료는 이 폰뿐(장부 logbank.v1 · growthLines.v1 · callNotes.v1 · talkSample.v1 · 통화 기록). 모델 없음.
 */
import { useEffect, useMemo, useState } from "react";
import type { UICopy } from "@/lib/copy";
import { LEDGER_EVENT, readLedger } from "@/lib/curriculum/logLedger";
import { dayOfSeconds } from "@/lib/curriculum/checkState";
import { growthPairs, progressIn, type GrowthPair } from "@/lib/curriculum/growthView";
import { GROWTH_LINES_EVENT, readGrowthLines } from "@/lib/curriculum/growthLines";
import { CALL_NOTES_EVENT, readCallNotes, readTalkSample } from "@/lib/roleplay/callNotes";
import { compareTalk, sampleLines, type CompareRow } from "@/lib/roleplay/talkStats";
import { readCalls } from "@/lib/roleplay/callStore";
import { bankTone } from "@/components/studyMap/bankTone";

const LOG = bankTone("log");

function useTick(events: readonly string[], language: string): number {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const on = (event: Event) => {
      const detail = (event as CustomEvent<{ language?: string }>).detail;
      if (!detail?.language || detail.language === language) setTick((n) => n + 1);
    };
    for (const name of events) window.addEventListener(name, on);
    return () => {
      for (const name of events) window.removeEventListener(name, on);
    };
  }, [events, language]);
  return tick;
}

const LEDGER_EVENTS = [LEDGER_EVENT] as const;
const LINE_EVENTS = [GROWTH_LINES_EVENT] as const;
const NOTE_EVENTS = [CALL_NOTES_EVENT] as const;

/** 오늘 한 줄(오늘 칸 머리 아래). */
export function TodayGrowth({ ui, language }: { ui: UICopy; language: string }) {
  const tick = useTick(LEDGER_EVENTS, language);
  const [today] = useState(() => dayOfSeconds(Math.floor(Date.now() / 1000)));
  const counts = useMemo(() => {
    void tick;
    return progressIn(readLedger(language), (t) => dayOfSeconds(t) === today);
  }, [tick, language, today]);
  const parts = [
    { icon: "🆕", label: ui.lbFresh, n: counts.fresh.length },
    { icon: "✓", label: ui.growLearned, n: counts.learned.length },
    { icon: "↺", label: ui.growRecovered, n: counts.recovered.length },
    { icon: "💬", label: ui.growUsed, n: counts.used.length },
  ].filter((one) => one.n > 0);
  if (!parts.length) return null;
  return (
    <p data-today-growth className="flex flex-wrap gap-x-3 gap-y-0.5 text-caption tabular-nums text-slate-300">
      {parts.map((one) => (
        <span key={one.label}>
          <span aria-hidden>{one.icon} </span>
          {one.label} <span className="font-semibold text-ink">{one.n}</span>
        </span>
      ))}
    </p>
  );
}

/** 고쳐 씀 짝(이 폰). inTime = 쓴 줄 시각(초)으로 거름. */
export function useGrowthPairs(language: string, inTime: (t: number) => boolean): GrowthPair[] {
  const tick = useTick(LINE_EVENTS, language);
  return useMemo(() => {
    void tick;
    const lines = readGrowthLines(language);
    return growthPairs(lines.miss, lines.used).filter((pair) => inTime(pair.used.t));
    // inTime은 부르는 쪽이 기간마다 새로 — 기간이 바뀔 때 다시 셈.
     
  }, [tick, language, inTime]);
}

function shortDay(locale: string, t: number): string {
  try {
    return new Intl.DateTimeFormat(locale, { month: "short", day: "numeric" }).format(new Date(t * 1000));
  } catch {
    return dayOfSeconds(t);
  }
}

const SOURCE_ICON = { call: "📞", chat: "💬", people: "👤" } as const;

/** 짝 목록: 틀린 날 ✎ 틀린 꼴(줄 그음) · 바른 꼴 → 맞게 쓴 날 ✓ 내 문장. */
export function PairList({ pairs, locale, max }: { pairs: readonly GrowthPair[]; locale: string; max?: number }) {
  return (
    <ul data-growth-pairs className="flex flex-col gap-2">
      {pairs.slice(0, max ?? pairs.length).map((pair) => (
        <li key={`${pair.miss.t}-${pair.used.t}`} data-growth-pair={pair.key} className="flex flex-col gap-1 rounded-xl border border-line p-3">
          <p className="flex items-baseline gap-2 text-caption text-slate-500">
            <span className="shrink-0 tabular-nums">
              <span aria-hidden>{SOURCE_ICON[pair.miss.s]} </span>
              {shortDay(locale, pair.miss.t)}
            </span>
            <span dir="auto" className="min-w-0 line-through decoration-bad/70">{pair.miss.w}</span>
          </p>
          <p dir="auto" className="ps-6 text-caption text-slate-400">→ {pair.miss.r}</p>
          <p className="flex items-baseline gap-2 text-chat text-ink">
            <span className="shrink-0 text-caption tabular-nums text-good">
              <span aria-hidden>✓ {SOURCE_ICON[pair.used.s]} </span>
              {shortDay(locale, pair.used.t)}
            </span>
            <span dir="auto" className="min-w-0 font-semibold">{pair.used.x}</span>
          </p>
        </li>
      ))}
    </ul>
  );
}

/** 통화 끝 화면: 이번 통화(since 초 뒤)에 맞게 쓴 짝. 없으면 아무것도 안 보임. */
export function CallGrowthPairs({ ui, language, locale, since }: { ui: UICopy; language: string; locale: string; since: number }) {
  const inTime = useMemo(() => (t: number) => t >= since, [since]);
  const pairs = useGrowthPairs(language, inTime);
  if (!pairs.length) return null;
  return (
    <section data-call-growth className="flex flex-col gap-2">
      <h3 className="text-caption font-semibold text-slate-300">
        <span aria-hidden>✎✓ </span>
        {ui.growFixed} <span className="tabular-nums text-ink">{pairs.length}</span>
      </h3>
      <PairList pairs={pairs} locale={locale} max={3} />
    </section>
  );
}

function rowName(ui: UICopy, id: CompareRow["id"]): string {
  return { words: ui.talkWords, level: ui.talkLevel, fixed: ui.talkFixed, asked: ui.talkAsked, topics: ui.talkTopics }[id];
}

function rowValue(id: CompareRow["id"], value: number): string {
  if (id === "level" || id === "fixed") return `${Math.round(100 * value)}%`;
  if (id === "words" || id === "asked") return value.toFixed(1).replace(/\.0$/, "");
  return String(Math.round(value));
}

/** 처음 3통 vs 최근 3통. 통화가 모자라거나 나아진 칸이 둘 아래면 없음. */
export function TalkCompare({ ui, language, locale }: { ui: UICopy; language: string; locale: string }) {
  const tick = useTick(NOTE_EVENTS, language);
  const view = useMemo(() => {
    void tick;
    const notes = readCallNotes(language).filter((note) => note.talk);
    const compared = compareTalk(notes.map((note) => ({ at: note.at, talk: note.talk!, ...(note.topics ? { topics: note.topics } : {}) })));
    if (!compared) return null;
    const first = readTalkSample(language);
    // 지금 보기 문장: 숫자가 잡힌 가장 최근 자유대화의 원문(최근 20통 안).
    const talkIds = new Set(notes.map((note) => note.id));
    const latest = readCalls()
      .filter((call) => call.language === language && call.mode !== "lesson" && talkIds.has(call.id) && call.id !== first?.id)
      .sort((a, b) => b.startedAt - a.startedAt)[0];
    const now = latest ? { at: latest.startedAt, lines: sampleLines(language, latest.said) } : null;
    return { ...compared, first, now };
  }, [tick, language]);
  if (!view) return null;
  const day = (at: number) => shortDay(locale, Math.floor(at / 1000));
  return (
    <section data-talk-compare className="flex flex-col gap-2 rounded-xl border border-line p-3">
      <h3 className="text-caption font-semibold text-slate-300">
        <span aria-hidden>📞 </span>
        {ui.talkCompareTitle}
      </h3>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {view.first ? (
          <div data-talk-then className="flex flex-col gap-1 rounded-lg bg-white/5 p-2">
            <p className="text-meta text-slate-500">{day(view.first.at)}</p>
            {view.first.lines.map((line) => (
              <p key={line} dir="auto" className="text-caption text-slate-400">{line}</p>
            ))}
          </div>
        ) : null}
        {view.now?.lines.length ? (
          <div data-talk-now className={`flex flex-col gap-1 rounded-lg p-2 ${LOG.soft}`}>
            <p className="text-meta text-slate-400">{day(view.now.at)}</p>
            {view.now.lines.map((line) => (
              <p key={line} dir="auto" className="text-caption font-semibold text-ink">{line}</p>
            ))}
          </div>
        ) : null}
      </div>
      <table className="w-full text-caption tabular-nums">
        <thead>
          <tr className="text-meta text-slate-500">
            <th className="py-0.5 text-start font-normal" />
            <th className="py-0.5 text-end font-normal">{ui.talkFirst}</th>
            <th className="py-0.5 text-end font-normal">{ui.talkRecent}</th>
          </tr>
        </thead>
        <tbody>
          {view.rows.map((row) => (
            <tr key={row.id} data-talk-row={row.id}>
              <td className="py-0.5 text-slate-300">{rowName(ui, row.id)}</td>
              <td className="py-0.5 text-end text-slate-500">{rowValue(row.id, row.then)}</td>
              <td className="py-0.5 text-end font-semibold text-ink">{rowValue(row.id, row.now)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
