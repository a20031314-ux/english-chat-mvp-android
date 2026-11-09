"use client";

/**
 * "늘었어요" 화면 조각(2026-11-07 사용자 "포인트 말고 학습한 단어 N개 식으로" · "틀렸던 문장 > 이후 활용한 문장" ·
 * "구사 문장의 길이·단어 수준·대화 소재를 실제 대화로 — 예전엔 이 정도, 지금은" → "진행해줘").
 *
 * - TodayGrowth: Logbank 오늘 칸 한 줄 — 새로 · 익힘 · 다시 맞힘 · 써 봄(오늘 것, 0이면 안 보임).
 * - PairList: 틀린 문장(날짜, 줄 그음 + 바른 꼴) → 다른 날 맞게 쓴 내 문장.
 * - CallGrowthPairs: 통화 끝 화면 — 이번 통화에서 예전에 고쳐진 것을 맞게 쓴 짝.
 * - TalkCompare: 같은 종류 질문에 한 대답 짝 · 처음 3통 vs 최근 3통 많이 나아진 칸 셋 · 처음 써 본 문법·표현(자유대화).
 * 재료는 이 폰뿐(장부 logbank.v1 · growthLines.v1 · callNotes.v1 · talkAnswers.v1 · talkFirstUse.v1). 모델 없음.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import type { UICopy } from "@/lib/copy";
import { LEDGER_EVENT, readLedger, type LogEvent } from "@/lib/curriculum/logLedger";
import { dayOfSeconds } from "@/lib/curriculum/checkState";
import { growthPairs, progressIn, type GrowthPair } from "@/lib/curriculum/growthView";
import { cardProgress } from "@/lib/curriculum/cardProgress";
import { knowTag, knowTagLabel, type KnowTag } from "@/lib/curriculum/studyTimeline";
import { GROWTH_LINES_EVENT, readGrowthLines } from "@/lib/curriculum/growthLines";
import { CALL_NOTES_EVENT, readCallNotes } from "@/lib/roleplay/callNotes";
import { bestAnswerPair, readAnswers, readFirstUses, TALK_MEMORY_EVENT } from "@/lib/roleplay/talkMemory";
import { compareTalk, type CompareRow } from "@/lib/roleplay/talkStats";
import { bankTone } from "@/components/studyMap/bankTone";
import { ladderFor } from "@/lib/curriculum/stages";

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

/** 오늘 한 줄(Logbank 오늘 칸 머리 아래 · Quizbank 문제 위). 숫자가 늘면 그 칸이 잠깐 커지고 밝아짐(2026-11-08 — 퀴즈 중 실시간). */
export function TodayGrowth({ ui, language }: { ui: UICopy; language: string }) {
  const tick = useTick(LEDGER_EVENTS, language);
  const [today] = useState(() => dayOfSeconds(Math.floor(Date.now() / 1000)));
  const counts = useMemo(() => {
    void tick;
    return progressIn(readLedger(language), (t) => dayOfSeconds(t) === today);
  }, [tick, language, today]);
  const parts = [
    // Logbank "배운 것" 표의 칸 이름 그대로 — 같은 숫자의 오늘 몫(2026-11-07 밤).
    { id: "studied", icon: "", label: ui.lbFresh, n: counts.studied.length },
    { id: "used", icon: "", label: ui.growUsed, n: counts.used.length },
    { id: "recovered", icon: "↺", label: ui.growRecovered, n: counts.recovered.length },
  ];
  const seen = useRef<Record<string, number> | null>(null);
  const [lit, setLit] = useState<Set<string>>(new Set());
  useEffect(() => {
    const now = Object.fromEntries(parts.map((one) => [one.id, one.n]));
    const before = seen.current;
    seen.current = now;
    if (!before) return;
    const grew = new Set(parts.filter((one) => one.n > (before[one.id] ?? 0)).map((one) => one.id));
    if (!grew.size) return;
    setLit(grew);
    const timer = window.setTimeout(() => setLit(new Set()), 900);
    return () => window.clearTimeout(timer);
    // parts는 counts에서 — counts가 바뀔 때만.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [counts]);
  const shown = parts.filter((one) => one.n > 0);
  if (!shown.length) return null;
  return (
    <p data-today-growth className="flex flex-wrap gap-x-3 gap-y-0.5 text-caption tabular-nums text-slate-300">
      {shown.map((one) => (
        <span key={one.id} data-today-part={one.id} className={`inline-block origin-left transition-all duration-300 ${lit.has(one.id) ? "scale-110 text-good" : ""}`}>
          {one.icon ? <span aria-hidden>{one.icon} </span> : null}
          {one.label} <span className={`font-semibold ${lit.has(one.id) ? "text-good" : "text-ink"}`}>{one.n}</span>
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
      <h3 className="text-caption font-semibold text-slate-300" title={ui.growFixed} aria-label={`${ui.growFixed} ${pairs.length}`}>
        <span aria-hidden>✎✓ </span>
        <span aria-hidden className="tabular-nums text-ink">{pairs.length}</span>
      </h3>
      <PairList pairs={pairs} locale={locale} max={3} />
    </section>
  );
}

function rowName(ui: UICopy, id: CompareRow["id"]): string {
  return { mine3: ui.talkMine3, share: ui.talkMineShare, shaped: ui.talkShaped, kinds: ui.talkKinds, top: ui.talkTop, words: ui.talkWords, level: ui.talkLevel, fixed: "✎", asked: ui.talkAsked, topics: ui.talkTopics }[id];
}

function rowValue(id: CompareRow["id"], value: number): string {
  if (id === "level" || id === "fixed" || id === "share" || id === "shaped") return `${Math.round(100 * value)}%`;
  if (id === "words" || id === "asked" || id === "kinds") return value.toFixed(1).replace(/\.0$/, "");
  return String(Math.round(value));
}

const TALK_EVENTS = [CALL_NOTES_EVENT, TALK_MEMORY_EVENT] as const;

/** g|단계:번호 → 단계 문법 이름(앱 언어, 없으면 영어) — 노트 칸 이름이 없을 때. */
export function ladderName(language: string, locale: string, key: string): string {
  const m = /^g\|(\d+):(\d+)$/.exec(key);
  if (!m) return "";
  const grammar = ladderFor(language)?.stages.find((stage) => stage.order === Number(m[1]))?.grammar[Number(m[2])];
  const names = grammar?.name as Record<string, string> | undefined;
  return names?.[locale] ?? names?.en ?? "";
}
const localDay = (ms: number) => dayOfSeconds(Math.floor(ms / 1000));

/**
 * 대화 비교(자유대화): 맨 위 같은 종류 튜터 질문에 한 대답 짝(처음 → 지금) · 처음 3통 vs 최근 3통 가운데 많이 나아진 칸 셋까지 ·
 * 처음 맞게 써 본 문법·표현(표시가 생긴 첫 통화 뒤, 최근 셋, 그 문장). 셋 다 없으면 없음. keyLabel = 열쇠 → 앱 언어 이름(Logbank).
 */
export function TalkCompare({ ui, language, locale, keyLabel }: { ui: UICopy; language: string; locale: string; keyLabel: (key: string) => string }) {
  const tick = useTick(TALK_EVENTS, language);
  const view = useMemo(() => {
    void tick;
    const notes = readCallNotes(language).filter((note) => note.talk);
    const compared = compareTalk(notes.map((note) => ({ at: note.at, talk: note.talk!, ...(note.topics ? { topics: note.topics } : {}) })));
    const pair = bestAnswerPair(readAnswers(language), localDay);
    const tagged = notes.filter((note) => note.talk?.shaped !== undefined).map((note) => note.at).sort((a, b) => a - b);
    const firstTagged = tagged[0];
    const fresh =
      firstTagged === undefined
        ? []
        : Object.entries(readFirstUses(language))
            .filter(([, use]) => localDay(use.at) !== localDay(firstTagged) && use.at > firstTagged)
            .sort((a, b) => b[1].at - a[1].at)
            .slice(0, 3)
            .map(([key, use]) => ({ key, ...use }));
    if (!compared && !pair && !fresh.length) return null;
    return { rows: compared?.rows ?? [], pair, fresh };
  }, [tick, language]);
  if (!view) return null;
  const day = (at: number) => shortDay(locale, Math.floor(at / 1000));
  return (
    <section data-talk-compare className="flex flex-col gap-2 rounded-xl border border-line p-3">
      <h3 className="text-caption font-semibold text-slate-300">
        <span aria-hidden>📞 </span>
        {ui.talkCompareTitle}
      </h3>
      {view.pair ? (
        <div data-talk-pair className="flex flex-col gap-1">
          <p dir="auto" className="text-caption text-slate-300">
            <span aria-hidden>🗨 </span>
            {view.pair.last.q}
          </p>
          <p className="flex items-baseline gap-2 text-caption text-slate-500">
            <span className="shrink-0 tabular-nums">{day(view.pair.first.at)}</span>
            <span dir="auto" className="min-w-0">{view.pair.first.a}</span>
            <span className="ms-auto shrink-0 tabular-nums">{view.pair.first.n}</span>
          </p>
          <p className={`flex items-baseline gap-2 rounded-lg p-1.5 text-chat text-ink ${LOG.soft}`}>
            <span className="shrink-0 text-caption tabular-nums text-slate-400">{day(view.pair.last.at)}</span>
            <span dir="auto" className="min-w-0 font-semibold">{view.pair.last.a}</span>
            <span className="ms-auto shrink-0 text-caption font-semibold tabular-nums">{view.pair.last.n}</span>
          </p>
        </div>
      ) : null}
      {view.rows.length ? (
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
                <td className="py-0.5 text-slate-300" title={row.id === "fixed" ? ui.talkFixed : undefined}>{rowName(ui, row.id)}</td>
                <td className="py-0.5 text-end text-slate-500">{rowValue(row.id, row.then)}</td>
                <td className="py-0.5 text-end font-semibold text-ink">{rowValue(row.id, row.now)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
      {view.fresh.length ? (
        <div data-talk-fresh className="flex flex-col gap-1">
          <p className="text-meta text-slate-500">{ui.talkNewUse}</p>
          {view.fresh.map((one) => (
            <p key={one.key} data-talk-fresh-key={one.key} className="flex flex-wrap items-baseline gap-x-2 text-caption">
              <span className={`rounded-full px-2 py-0.5 text-meta ${LOG.soft}`}>{keyLabel(one.key) || ladderName(language, locale, one.key) || one.key.slice(2)}</span>
              <span dir="auto" className="text-ink">{one.line}</span>
              <span className="text-meta tabular-nums text-slate-500">{day(one.at)}</span>
            </p>
          ))}
        </div>
      ) : null}
    </section>
  );
}

/**
 * 퀴즈 답한 순간 카드 아래 점 셋(lib/curriculum/cardProgress.ts, 2026-11-08 사용자 "점수 상승을 실시간으로, 수치는 아니더라도 가시적으로").
 * 답하기 전 장부(events — 부르는 쪽이 문제를 낼 때 잡아 둠, 답하면 곧바로 장부에 들어가서)로 전 점을 내고, 답하면 바뀐 점만 톡 커졌다 돌아옴. 앎이 되면 점 셋 둘레가 빛남,
 * 전에 틀린 걸 다른 날 맞히면 ↺ 그 날짜. 글 없이 — 이름은 aria-label(Logbank 표와 같은 말이 아니라 체크 셋 이름).
 */
/**
 * 답한 순간 그 소재의 표시(2026-11-09 사용자 "옛 상태 이름은 다 삭제" — 점 셋(체크 셋) 대신 있었던 일만):
 * 학습 · n번 학습 · 자주 씀(studyTimeline.ts knowTag), 이번 답으로 바뀌면 잠깐 커짐. ↺ = 틀렸던 것을 다른 날 다시 맞힘(그날).
 */
export function CardProgressDots({ ui, events, locale, bankKey, mode, correct }: { ui: UICopy; events: readonly LogEvent[]; locale: string; bankKey: string; mode: "write" | "pick" | "sure"; correct: boolean }) {
  const [at] = useState(() => Math.floor(Date.now() / 1000));
  const progress = useMemo(() => cardProgress(events, bankKey, { correct, mode, t: at }), [events, bankKey, correct, mode, at]);
  const tags = useMemo(() => {
    const dayOf = (t: number) => dayOfSeconds(t);
    const before = knowTag(events, bankKey, dayOf);
    const after = knowTag([...events, { k: bankKey, src: "quiz", r: correct ? "ok" : "miss", m: mode, t: at }], bankKey, dayOf);
    return { before, after };
  }, [events, bankKey, correct, mode, at]);
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const one = window.setTimeout(() => setPhase(1), 80);
    const two = window.setTimeout(() => setPhase(2), 700);
    return () => {
      window.clearTimeout(one);
      window.clearTimeout(two);
    };
  }, []);
  const label = (tag: KnowTag | null) => (tag ? `${knowTagLabel(ui, tag)}${tag.miss ? " ✗" : ""}` : "");
  const before = label(tags.before);
  const after = label(tags.after);
  if (!after) return null;
  const changed = before !== after;
  return (
    <span data-card-progress={after} className="inline-flex items-center gap-2">
      <span className={`inline-block rounded-full border border-line px-2 py-0.5 text-caption text-slate-200 transition-transform duration-300 ${changed && phase === 1 ? "scale-125 border-good text-good" : "scale-100"}`}>
        {phase === 0 && before ? before : after}
      </span>
      {progress.recoveredFrom !== null ? (
        <span data-card-recovered className={`text-caption font-semibold text-good transition-opacity duration-500 ${phase ? "opacity-100" : "opacity-0"}`}>
          ↺ {shortDay(locale, progress.recoveredFrom)}
        </span>
      ) : null}
    </span>
  );
}
