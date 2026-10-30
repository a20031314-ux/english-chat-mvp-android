"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { FullScreenLayer } from "@/components/FullScreenLayer";
import type { UICopy } from "@/lib/copy";

/**
 * 단어 맞추기(2026-10-30 사용자 "그냥 단순 단어맞추기도 만들어줘"): 왼쪽 낱말(학습 언어)과 오른쪽 뜻(앱 언어)을 짝지어 누른다.
 * 맞으면 둘 다 칠해져 빠지고, 틀리면 잠깐 표시만. 다 맞히면 같은 자리에서 새 묶음. 점수·기록은 남기지 않는 가벼운 연습.
 * 짝은 복습 칸(TodayPlan)이 단어장·이 단계 문장구조 예문에서 모아 넘긴다(matchPairs).
 */

export type MatchPair = { word: string; meaning: string };

export const MATCH_SIZE = 5;

function shuffle<T>(list: readonly T[], seed: number): T[] {
  const out = [...list];
  let state = seed || 1;
  for (let i = out.length - 1; i > 0; i -= 1) {
    state = (state * 1103515245 + 12345) % 2147483648;
    const j = state % (i + 1);
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

/** 낱말이 겹치지 않는 짝만, 뜻이 같은 짝도 하나만. */
export function matchPairs(candidates: readonly MatchPair[]): MatchPair[] {
  const words = new Set<string>();
  const meanings = new Set<string>();
  const out: MatchPair[] = [];
  for (const pair of candidates) {
    const word = pair.word.trim();
    const meaning = pair.meaning.trim();
    if (!word || !meaning || words.has(word.toLowerCase()) || meanings.has(meaning.toLowerCase())) continue;
    words.add(word.toLowerCase());
    meanings.add(meaning.toLowerCase());
    out.push({ word, meaning });
  }
  return out;
}

/** onNext: 어휘 계속 공부 — 짝을 다 맞히면 같은 낱말들의 예문 빈칸으로(2026-10-30 사용자 "단순하게 맞추기 > 예문 형태로"). */
export function WordMatch({
  ui,
  pairs,
  onClose,
  onNext,
  inline = false,
}: {
  ui: UICopy;
  pairs: readonly MatchPair[];
  onClose: () => void;
  onNext?: (words: string[]) => void;
  /** 퀴즈 칸 안에 바로(머리·닫기 없이, 다 맞히면 저절로 onNext — 2026-10-30). */
  inline?: boolean;
}) {
  const [round, setRound] = useState(0);
  const set = useMemo(() => {
    const start = (round * MATCH_SIZE) % Math.max(1, pairs.length);
    const picked = [...pairs.slice(start), ...pairs.slice(0, start)].slice(0, MATCH_SIZE);
    return { picked, left: shuffle(picked.map((_, i) => i), round + 7), right: shuffle(picked.map((_, i) => i), round + 31) };
  }, [pairs, round]);
  const [chosen, setChosen] = useState<number | null>(null);
  const [done, setDone] = useState<Set<number>>(new Set());
  const [miss, setMiss] = useState<number | null>(null);
  const finished = done.size === set.picked.length && set.picked.length > 0;
  const nextRef = useRef(onNext);
  useEffect(() => {
    nextRef.current = onNext;
  });
  useEffect(() => {
    if (!inline || !finished) return;
    const timer = window.setTimeout(() => nextRef.current?.(set.picked.map((one) => one.word)), 700);
    return () => window.clearTimeout(timer);
  }, [inline, finished, set]);

  const pickRight = (index: number) => {
    if (chosen === null || done.has(index)) return;
    if (chosen === index) {
      setDone((current) => new Set([...current, index]));
      setChosen(null);
      return;
    }
    setMiss(index);
    window.setTimeout(() => setMiss(null), 600);
  };

  const cell = "min-h-12 w-full rounded-xl border px-3 py-2 text-start text-note";
  if (inline) {
    return (
      <div data-word-match className="mt-1">
        <div className="grid grid-cols-2 gap-2">
          <ul className="flex flex-col gap-2">
            {set.left.map((i) => (
              <li key={`w${i}`}>
                <button
                  type="button"
                  data-match-word={i}
                  disabled={done.has(i)}
                  onClick={() => setChosen(i)}
                  dir="auto"
                  className={`${cell} ${
                    done.has(i) ? "border-good/40 bg-good/10 text-slate-500" : chosen === i ? "border-status-learned bg-status-learned/15 text-ink" : "border-line text-ink hover:bg-white/5"
                  }`}
                >
                  {set.picked[i]!.word}
                </button>
              </li>
            ))}
          </ul>
          <ul className="flex flex-col gap-2">
            {set.right.map((i) => (
              <li key={`m${i}`}>
                <button
                  type="button"
                  data-match-meaning={i}
                  disabled={done.has(i)}
                  onClick={() => pickRight(i)}
                  className={`${cell} ${
                    done.has(i) ? "border-good/40 bg-good/10 text-slate-500" : miss === i ? "border-warn bg-warn/10 text-ink" : "border-line text-slate-200 hover:bg-white/5"
                  }`}
                >
                  {set.picked[i]!.meaning}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
  return (
    <FullScreenLayer>
      <header className="flex shrink-0 items-center gap-2 border-b border-line px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <h2 className="min-w-0 flex-1 truncate text-body font-semibold text-ink">{ui.wordMatch}</h2>
        <span className="text-caption tabular-nums text-slate-400">
          {done.size}/{set.picked.length}
        </span>
        <button type="button" onClick={onClose} aria-label={ui.billingClose} className="rounded-lg px-2 py-1 text-note text-slate-400 hover:bg-white/10">
          ✕
        </button>
      </header>
      <div data-word-match className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        <div className="grid grid-cols-2 gap-2">
          <ul className="flex flex-col gap-2">
            {set.left.map((i) => (
              <li key={`w${i}`}>
                <button
                  type="button"
                  data-match-word={i}
                  disabled={done.has(i)}
                  onClick={() => setChosen(i)}
                  dir="auto"
                  className={`${cell} ${
                    done.has(i) ? "border-good/40 bg-good/10 text-slate-500" : chosen === i ? "border-status-learned bg-status-learned/15 text-ink" : "border-line text-ink hover:bg-white/5"
                  }`}
                >
                  {set.picked[i]!.word}
                </button>
              </li>
            ))}
          </ul>
          <ul className="flex flex-col gap-2">
            {set.right.map((i) => (
              <li key={`m${i}`}>
                <button
                  type="button"
                  data-match-meaning={i}
                  disabled={done.has(i)}
                  onClick={() => pickRight(i)}
                  className={`${cell} ${
                    done.has(i) ? "border-good/40 bg-good/10 text-slate-500" : miss === i ? "border-warn bg-warn/10 text-ink" : "border-line text-slate-200 hover:bg-white/5"
                  }`}
                >
                  {set.picked[i]!.meaning}
                </button>
              </li>
            ))}
          </ul>
        </div>
        {finished ? (
          <div className="mt-4 flex justify-center gap-2">
            <button type="button" onClick={onClose} className="rounded-full border border-line px-4 py-1.5 text-caption text-slate-200 hover:bg-white/10">
              {ui.billingClose}
            </button>
            {onNext ? (
              <button type="button" data-match-next onClick={() => onNext(set.picked.map((one) => one.word))} className="rounded-full bg-white/90 px-5 py-1.5 text-caption font-semibold text-slate-900">
                {ui.scriptNext}
              </button>
            ) : null}
            <button
              type="button"
              data-match-again
              hidden={Boolean(onNext)}
              onClick={() => {
                setDone(new Set());
                setChosen(null);
                setRound((n) => n + 1);
              }}
              className="rounded-full bg-white/90 px-5 py-1.5 text-caption font-semibold text-slate-900"
            >
              ✓ {ui.planAgain}
            </button>
          </div>
        ) : null}
      </div>
    </FullScreenLayer>
  );
}
