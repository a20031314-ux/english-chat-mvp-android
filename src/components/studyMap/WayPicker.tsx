"use client";

import { useState } from "react";
import { BodyLayer } from "@/components/FullScreenLayer";
import type { UICopy } from "@/lib/copy";

/**
 * 연습 방식 고르기(2026-10-30 사용자 "학습방식 선택을 이미지로, 그 이미지가 뭘 뜻하는지는 간단한 대화로 파악하게"):
 * 버튼 하나(지금 방식 이름·n/m ▾) → 시트에 방식마다 카드 한 장. 카드 그림은 그 방식으로 실제로 하게 될 짧은 대화 —
 * 학습 언어 말풍선 둘셋(상대 왼쪽·나 오른쪽), 연습할 곳은 칠하고, 고친 줄은 그어 보인다. 설명 글은 두지 않는다(RULES "안내 글").
 * My 단계(StageScripts: 상황·표현·문장구조)와 복습(TodayPlan: 다시 볼 것·랜덤·어휘·문법·표현)이 같이 쓴다.
 */

export type Bubble = {
  side: "them" | "me";
  text: string;
  /** text 안에서 칠할 곳(연습할 표현·빈칸·낱말). */
  mark?: string;
  /** 고치기 전 줄(그어 보임). */
  strike?: boolean;
  /** 앱 언어 줄(뜻) — 학습 언어가 아니라 dir·색을 달리한다. */
  meaning?: boolean;
  /** 다시 나옴 표시(↻) — 복습에서 고친 줄이 아직 없을 때. */
  again?: boolean;
};

export type Way<T extends string> = { id: T; label: string; count?: string; bubbles: Bubble[] };

/** 칠한 곳이 잘리지 않게: 긴 줄은 칠한 곳 앞뒤만 남긴다(…). */
const AROUND = 12;
function BubbleText({ bubble }: { bubble: Bubble }) {
  const at = bubble.mark ? bubble.text.indexOf(bubble.mark) : -1;
  if (at < 0 || !bubble.mark) return <>{bubble.text}</>;
  const from = Math.max(0, at - AROUND);
  const to = Math.min(bubble.text.length, at + bubble.mark.length + AROUND);
  return (
    <>
      {from > 0 ? "…" : ""}
      {bubble.text.slice(from, at)}
      <span className="rounded-lg bg-status-learned px-0.5 text-slate-900">{bubble.mark}</span>
      {bubble.text.slice(at + bubble.mark.length, to)}
      {to < bubble.text.length ? "…" : ""}
    </>
  );
}

/** 짧은 대화 그림(카드 안). */
export function MiniDialogue({ bubbles }: { bubbles: readonly Bubble[] }) {
  return (
    <div aria-hidden className="flex w-full flex-col gap-1">
      {bubbles.slice(0, 3).map((bubble, index) => (
        <div key={index} className={`flex ${bubble.side === "me" ? "justify-end" : "justify-start"}`}>
          <span
            dir="auto"
            className={`line-clamp-2 max-w-[92%] break-words rounded-lg px-1.5 py-0.5 text-start text-meta ${
              bubble.strike
                ? "text-slate-500 line-through"
                : bubble.meaning
                  ? "border border-line text-slate-300"
                  : bubble.side === "me"
                    ? "bg-status-learned/20 text-ink"
                    : "bg-white/10 text-slate-200"
            }`}
          >
            {bubble.again ? "↻ " : ""}
            <BubbleText bubble={bubble} />
          </span>
        </div>
      ))}
    </div>
  );
}

export function WayPicker<T extends string>({
  ui,
  ways,
  value,
  onPick,
  data,
}: {
  ui: UICopy;
  ways: readonly Way<T>[];
  value: T;
  onPick: (id: T) => void;
  /** 점검 스크립트가 찾는 이름(data-…). */
  data: string;
}) {
  const [open, setOpen] = useState(false);
  const current = ways.find((one) => one.id === value) ?? ways[0];
  if (!current) return null;
  return (
    <>
      <button
        type="button"
        {...{ [`data-${data}`]: "" }}
        aria-haspopup="dialog"
        aria-label={`${ui.practiceWay}: ${current.label}`}
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 self-start rounded-full border border-line px-3 py-1 text-caption text-ink hover:bg-white/10"
      >
        <span>{current.label}</span>
        {current.count ? <span className="tabular-nums text-slate-400">{current.count}</span> : null}
        <span aria-hidden className="text-slate-500">▾</span>
      </button>
      {open ? (
        <BodyLayer>
          <div className="fixed inset-0 z-[90] flex items-end justify-center bg-black/60 sm:items-center" onClick={() => setOpen(false)}>
            <div
              role="dialog"
              aria-modal="true"
              aria-label={ui.practiceWay}
              data-way-sheet={data}
              onClick={(event) => event.stopPropagation()}
              className="max-h-[85vh] w-full max-w-md overflow-y-auto rounded-t-2xl border border-line bg-surface p-4 sm:rounded-2xl"
            >
              <div className="flex items-center gap-2">
                <h3 className="min-w-0 flex-1 text-note font-semibold text-ink">{ui.practiceWay}</h3>
                <button type="button" aria-label={ui.billingClose} onClick={() => setOpen(false)} className="rounded-lg px-2 py-1 text-note text-slate-400 hover:bg-white/10">
                  ✕
                </button>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {ways.map((one) => (
                  <button
                    key={one.id}
                    type="button"
                    aria-pressed={value === one.id}
                    data-way={one.id}
                    onClick={() => {
                      onPick(one.id);
                      setOpen(false);
                    }}
                    className={`flex min-w-0 flex-col gap-2 rounded-xl border p-2 text-start ${value === one.id ? "border-status-learned bg-status-learned/10" : "border-line hover:bg-white/5"}`}
                  >
                    <MiniDialogue bubbles={one.bubbles} />
                    <span className="flex items-baseline gap-1.5">
                      <span className="text-caption font-semibold text-ink">{one.label}</span>
                      {one.count ? <span className="text-meta tabular-nums text-slate-400">{one.count}</span> : null}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </BodyLayer>
      ) : null}
    </>
  );
}
