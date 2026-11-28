"use client";

/**
 * "늘었어요" 화면 조각(2026-11-07 사용자 "포인트 말고 학습한 단어 N개 식으로" · "틀렸던 문장 > 이후 활용한 문장" ·
 * "구사 문장의 길이·단어 수준·대화 소재를 실제 대화로 — 예전엔 이 정도, 지금은" → "진행해줘").
 *
 * - PairList: 틀린 문장(날짜, 줄 그음 + 바른 꼴) → 다른 날 맞게 쓴 내 문장.
 * - CallGrowthPairs: 통화 끝 화면 — 이번 통화에서 예전에 고쳐진 것을 맞게 쓴 짝.
 * - TalkCompare: 같은 종류 질문에 한 대답 짝 · 처음 3통 vs 최근 3통 많이 나아진 칸 셋 · 처음 써 본 문법·표현(자유대화).
 * 재료는 이 폰뿐(장부 logbank.v1 · growthLines.v1 · callNotes.v1 · talkAnswers.v1 · talkFirstUse.v1). 모델 없음.
 */
import { useEffect, useMemo, useState } from "react";
import type { UICopy } from "@/lib/copy";
import { dayOfSeconds } from "@/lib/curriculum/checkState";
import { growthPairs, type GrowthPair } from "@/lib/curriculum/growthView";
import { GROWTH_LINES_EVENT, readGrowthLines } from "@/lib/curriculum/growthLines";
import { CALL_NOTES_EVENT } from "@/lib/roleplay/callNotes";
import { answerGain, readAnswers, readFirstUses, TALK_MEMORY_EVENT } from "@/lib/roleplay/talkMemory";
import { ladderFor } from "@/lib/curriculum/stages";
import { SaidWithMistakes } from "@/components/RoleplayReview";


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

const LINE_EVENTS = [GROWTH_LINES_EVENT] as const;

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
            <SaidWithMistakes said={pair.miss.w} right={pair.miss.r} className="min-w-0" />
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
 * 대화 비교(사용자 2026-11-28 "캡처샷에 표시를 넣어 더 나아졌음을 명시적으로, 나아진 게 없으면 억지로 띄우지 말고"):
 * 같은 종류 튜터 질문에 한 처음·최근 대답을 통화 대본처럼 말풍선 두 장면으로 — 최근 대답의 나아진 곳에 밑줄,
 * 아래 칩(처음 맞게 쓴 문법·표현 이름 · 내 말 낱말 수 처음 → 지금). 나아진 게 없으면(talkMemory.ts answerGain) 칸 없음.
 */
export function TalkCompare({ ui, language, locale, keyLabel }: { ui: UICopy; language: string; locale: string; keyLabel: (key: string) => string }) {
  const tick = useTick(TALK_EVENTS, language);
  const gain = useMemo(() => {
    void tick;
    return answerGain(language, readAnswers(language), readFirstUses(language), localDay);
  }, [tick, language]);
  if (!gain) return null;
  const day = (at: number) => shortDay(locale, Math.floor(at / 1000));
  const names = gain.keys.map((key) => keyLabel(key) || ladderName(language, locale, key)).filter(Boolean);
  const grew = gain.after - gain.before >= 3;
  return (
    <section data-talk-compare className="flex flex-col gap-1.5 rounded-xl border border-line p-3">
      <h3 className="text-caption font-semibold text-slate-300">
        <span aria-hidden>📞 </span>
        {ui.talkCompareTitle}
      </h3>
      <p className="mt-1 text-meta tabular-nums text-slate-500">{day(gain.first.at)}</p>
      <TalkBubble who="tutor" text={gain.first.q} />
      <TalkBubble who="me" text={gain.first.a} dim />
      <div className="my-1 border-t border-line" />
      <p className="text-meta tabular-nums text-slate-500">{day(gain.last.at)}</p>
      <TalkBubble who="tutor" text={gain.last.q} />
      <TalkBubble who="me" text={gain.last.a} marks={gain.marks} />
      {names.length || grew ? (
        <div data-talk-gain className="flex flex-wrap justify-end gap-1">
          {names.map((name) => (
            <span key={name} className="rounded-full bg-good/15 px-2 py-0.5 text-meta text-good">{name}</span>
          ))}
          {grew ? <span className="rounded-full bg-good/15 px-2 py-0.5 text-meta tabular-nums text-good">{ui.talkWordsGrew.replace("{a}", String(gain.before)).replace("{b}", String(gain.after))}</span> : null}
        </div>
      ) : null}
    </section>
  );
}

/** 대화 비교 말풍선 — 튜터는 왼쪽, 나는 오른쪽(아랍어는 거꾸로), marks = 밑줄 칠 글자 범위. */
function TalkBubble({ who, text, dim = false, marks = [] }: { who: "tutor" | "me"; text: string; dim?: boolean; marks?: readonly [number, number][] }) {
  const parts: { text: string; mark: boolean }[] = [];
  let at = 0;
  for (const [a, b] of marks) {
    if (a > at) parts.push({ text: text.slice(at, a), mark: false });
    parts.push({ text: text.slice(a, b), mark: true });
    at = b;
  }
  if (at < text.length) parts.push({ text: text.slice(at), mark: false });
  return (
    <div className={`flex ${who === "me" ? "justify-end" : ""}`}>
      <p
        dir="auto"
        className={`max-w-[85%] rounded-2xl px-3 py-1.5 text-chat ${who === "me" ? `rounded-ee-sm bg-info/15 text-ink ${dim ? "opacity-70" : ""}` : "rounded-es-sm bg-white/[0.06] text-slate-200"}`}
      >
        {parts.map((part, index) =>
          part.mark ? (
            <span key={index} className="underline decoration-good decoration-2 underline-offset-4">{part.text}</span>
          ) : (
            <span key={index}>{part.text}</span>
          ),
        )}
      </p>
    </div>
  );
}

