"use client";

import { useRef, useState } from "react";
import type { UICopy } from "@/lib/copy";
import type { Practice } from "@/lib/roleplay/practice";

/** 한 줄 말하기의 공용 조각 — 평가 줄(LineGrade)·듣는 동안 버튼(useHearing·HearingButtons)·멈칫한 곳 칩(PauseChips). 수업·퀴즈가 같이 쓴다. */

/**
 * 맞힌 줄의 평가(2026-10-28 사용자 "잘 들렸어요보다 perfect 느낌으로, 아니면 이 부분 발음이 약간 어긋났다"):
 * 낱말이 대본 그대로 + 받아쓰기가 망설인 낱말이 없으면 ★ 완벽해요, 아니면 ✓ 잘 들렸어요 + 흐릿했던 낱말 칩.
 */
export function LineGrade({
  ui,
  exact,
  unclear,
  practice = null,
  pauses = [],
}: {
  ui: UICopy;
  exact: boolean;
  unclear: readonly string[];
  /** 낱말 사이 멈칫한 곳 — 있으면 ★ 완벽해요 대신 ✓ + 칩. */
  pauses?: readonly [string, number][];
  /** 떠올려 말한 줄의 세 갈래(natural·awkward) — 대본과 낱말이 다를 때만 의미가 있다. */
  practice?: Practice | null;
}) {
  const perfect = exact && unclear.length === 0 && pauses.length === 0;
  const awkward = !exact && practice?.verdict === "awkward";
  const natural = !exact && practice?.verdict === "natural";
  const label = perfect ? `★ ${ui.scriptPerfect}` : awkward ? `△ ${ui.scriptAwkward}` : natural ? `✓ ${ui.scriptNatural}` : `✓ ${ui.scriptClean}`;
  return (
    <div className="mt-1.5 flex flex-col gap-1">
      <p className={`text-caption font-semibold ${perfect ? "text-status-learned" : awkward ? "text-warn" : "text-emerald-300"}`}>{label}</p>
      {awkward && practice?.better ? (
        <p dir="auto" className="text-chat text-ink">
          {practice.better}
        </p>
      ) : null}
      <PauseChips ui={ui} pauses={pauses} />
      {unclear.length ? (
        <p className="flex flex-wrap items-center gap-1.5 text-caption text-slate-400">
          <span>{ui.scriptUnclear}</span>
          {unclear.map((word) => (
            <span key={word} dir="auto" className="rounded-full border border-warn/50 px-2 py-0.5 text-warn">
              {word}
            </span>
          ))}
        </p>
      ) : null}
    </div>
  );
}


/**
 * 말하는 동안(2026-10-29 사용자 "망설이면 바로 끊어버리는데 잘 모르겠어요 버튼을"): 연습 마이크는 멈칫해도 끊지 않고(patient),
 * 듣는 동안 "잘 모르겠어요", 멈칫하면 "다 말했어요"도. 잘 모르겠어요 = 들린 데까지 보내고 원문을 연다(통과로는 안 셈).
 */
export function useHearing() {
  const [paused, setPaused] = useState(false);
  const end = useRef<(() => void) | null>(null);
  const stuck = useRef(false);
  return {
    /** sayLine에 그대로 펼쳐 넣는다. */
    options: {
      patient: true,
      onPaused: setPaused,
      onReady: (endNow: () => void) => {
        stuck.current = false;
        end.current = endNow;
      },
    },
    /** 듣기가 끝난 뒤: 잘 모르겠어요를 눌렀는지(한 번 읽으면 지움). */
    takeStuck: () => {
      const was = stuck.current;
      stuck.current = false;
      end.current = null;
      setPaused(false);
      return was;
    },
    paused,
    unsure: () => {
      stuck.current = true;
      end.current?.();
    },
    saidAll: () => end.current?.(),
  };
}

export function HearingButtons({ ui, hearing }: { ui: UICopy; hearing: ReturnType<typeof useHearing> }) {
  return (
    <>
      <button type="button" onClick={hearing.unsure} className="rounded-full border border-warn/60 px-3 py-1.5 text-caption text-warn hover:bg-white/10">
        {ui.scriptUnsure}
      </button>
      {hearing.paused ? (
        <button type="button" onClick={hearing.saidAll} className="rounded-full bg-white/90 px-3 py-1.5 text-caption font-semibold text-slate-900">
          {ui.scriptSaidAll}
        </button>
      ) : null}
    </>
  );
}

/** 멈칫한 곳 칩(서버 pauses — 그 뒤에 나온 낱말과 쉰 초). */
export function PauseChips({ ui, pauses }: { ui: UICopy; pauses: readonly [string, number][] }) {
  if (!pauses.length) return null;
  return (
    <p className="flex flex-wrap items-center gap-1.5 text-caption text-slate-400">
      <span>{ui.scriptPaused}</span>
      {pauses.map(([word, sec], i) => (
        <span key={`${word}-${i}`} dir="auto" className="rounded-full border border-warn/50 px-2 py-0.5 text-warn">
          ⏸ <bdi>{word.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, "")}</bdi> · {sec}s
        </span>
      ))}
    </p>
  );
}
