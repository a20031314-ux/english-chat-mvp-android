"use client";

import { useEffect, useState } from "react";
import type { UICopy } from "@/lib/copy";
import { compareToTarget, type Practice, type WordOutcome } from "@/lib/roleplay/practice";

/*
 * 말해 보기 공용 부품 — 한 줄을 말하고 어떻게 들렸는지 보여 준다.
 * AI 통화(돌아보기·내 문장 말해보기)와 My(문장구조 수업·꺼내 쓰기·퀴즈·대본)가 같이 쓴다(2026-11-01, 통화 쪽에서 옮김).
 */

/**
 * The line as it came out, with the words that did not survive marked.
 *
 * Shown before anything is said about it, because it is the finding: which word
 * turned into which is arithmetic the learner can check against their own ears,
 * and it stands whether or not the sentence explaining it ever arrives.
 */
export function Attempt({ outcomes, ui, pauses = [] }: { outcomes: WordOutcome[]; ui: UICopy; pauses?: readonly [string, number][] }) {
  // 멈칫한 곳(2026-10-29): 그 뒤에 나온 낱말 앞에 ⏸ — 들린 낱말(kept = 대본 낱말, changed = 들린 꼴)을 차례로 맞춰 본다.
  const bareWord = (text: string) => text.toLocaleLowerCase().replace(/[^\p{L}\p{M}\p{N}]+/gu, "");
  const pauseAt = new Set<number>();
  let next = 0;
  outcomes.forEach((outcome, index) => {
    const pause = pauses[next];
    if (!pause || outcome.kind === "dropped") return;
    const said = bareWord(outcome.kind === "changed" ? outcome.heardAs : outcome.word);
    const want = bareWord(pause[0]);
    if (said && want && (said === want || said.startsWith(want) || want.startsWith(said))) {
      pauseAt.add(index);
      next += 1;
    }
  });
  // 대본 모양(대소문자·문장부호, outcome.shown)으로 보인다 — 옛 서버 답은 shown이 없어 비교용 낱말 그대로(2026-10-29).
  const edge = (shown: string | undefined, at: "lead" | "trail") =>
    shown ? (shown.match(at === "lead" ? /^[^\p{L}\p{M}\p{N}']*/u : /[^\p{L}\p{M}\p{N}']*$/u)?.[0] ?? "") : "";
  return (
    <div className="mt-3 rounded-xl bg-white/5 p-3">
      <p className="text-[11px] text-neutral-500">{ui.roleplayPracticeHeard}</p>
      <p dir="auto" className="mt-1 text-[14px] leading-relaxed">
        {outcomes.map((outcome, index) => (
          <span key={index}>
            {pauseAt.has(index) ? <span className="text-warn">⏸ </span> : null}
            {outcome.kind === "kept" ? (
              <span className="text-neutral-100">{outcome.shown ?? outcome.word}</span>
            ) : outcome.kind === "changed" ? (
              <span className="text-amber-300">
                {edge(outcome.shown, "lead")}
                {outcome.heardAs}
                <span className="text-neutral-500"> ({outcome.shown ? outcome.shown.slice(edge(outcome.shown, "lead").length, outcome.shown.length - edge(outcome.shown, "trail").length) || outcome.word : outcome.word})</span>
                {edge(outcome.shown, "trail")}
              </span>
            ) : (
              <span className="text-neutral-500 line-through">{outcome.shown ?? outcome.word}</span>
            )}
            {outcome.space === false ? "" : " "}
          </span>
        ))}
      </p>
    </div>
  );
}

/**
 * Saying the line back, inside the panel.
 *
 * Its own microphone, opened and closed here. The scene's is shut for as long
 * as the panel is up, and it has to stay shut: a line said in practice must not
 * arrive as the next turn of the conversation.
 */
export function SayItBack({
  target,
  ui,
  onListen,
  onGrew,
}: {
  target: string;
  ui: UICopy;
  onListen: (target: string) => Promise<{ heard: string; practice: Practice | null }>;
  /** The panel got taller — bring what appeared into view. */
  onGrew: () => void;
}) {
  const [state, setState] = useState<
    | { at: "idle" }
    | { at: "listening" }
    | { at: "read"; heard: string; practice: Practice | null }
  >({ at: "idle" });

  const listen = async () => {
    setState({ at: "listening" });
    const result = await onListen(target);
    setState({ at: "read", ...result });
  };

  // An attempt lands below everything already on screen, and on a phone that is
  // below the fold: without this the learner says the line and nothing visibly
  // happens. After the paint, so the panel has its new height by then.
  useEffect(() => {
    if (state.at === "read") onGrew();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  if (state.at === "read") {
    return (
      <>
        <Attempt outcomes={compareToTarget(target, state.heard).outcomes} ui={ui} />
        {state.practice ? (
          <p className="mt-2 text-[13px] leading-relaxed text-neutral-200">
            {state.practice.note}
          </p>
        ) : null}
        <button
          type="button"
          onClick={() => void listen()}
          className="mt-2 rounded-full border border-white/20 px-3 py-1.5 text-[12px] text-neutral-300 hover:bg-white/10"
        >
          {ui.roleplayPracticeRetry}
        </button>
      </>
    );
  }

  return (
    <button
      type="button"
      onClick={() => void listen()}
      disabled={state.at === "listening"}
      className="mt-2 w-full rounded-xl border border-white/20 px-4 py-2.5 text-[13px] text-neutral-200 hover:bg-white/10 disabled:opacity-60"
    >
      {state.at === "listening" ? ui.roleplayPracticeListening : ui.roleplayPracticeCta}
    </button>
  );
}
