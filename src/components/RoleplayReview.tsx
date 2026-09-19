"use client";

import { useEffect, useRef, useState } from "react";
import { compareToTarget, type WordOutcome } from "@/lib/roleplay/practice";
import type { Practice } from "@/lib/roleplay/practice";
import type { Review, StuckTurn } from "@/lib/roleplay/review";
import type { UICopy } from "@/lib/copy";

/**
 * Looking back at a turn: the button that offers it, and the panel it opens.
 *
 * Both halves live here because they are one decision. The scene is never
 * stopped for the learner; it is offered, on the turn it happened, and they
 * take it or they do not. Everything about the shape of these two follows from
 * that — see roleplay/review.ts for the reasoning and RoleplayScreen for the
 * microphone the panel closes on its way in.
 *
 * Kept out of RoleplayScreen so it can be looked at without a microphone and
 * without spending a turn: /dev/roleplay-review renders exactly these.
 */

/** A line of the transcript, with the offer on it when the turn was a struggle. */
export type TranscriptLine = {
  who: "tutor" | "learner";
  text: string;
  translation?: string;
  stuck?: StuckTurn;
  /** Their own sentence, said better. Shown under it, never spoken. */
  better?: string;
  /** A word about that sentence, in their own language. Also never spoken. */
  about?: string;
};

export function RoleplayLine({
  line,
  ui,
  onReview,
  onTranslate,
}: {
  line: TranscriptLine;
  ui: UICopy;
  onReview: (turn: StuckTurn) => void;
  /** Ask for the gloss of a line that has none. Absent where nothing can. */
  onTranslate?: (text: string) => void;
}) {
  return (
    <li className={`mb-2 flex ${line.who === "learner" ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-3 py-2 ${
          line.who === "learner"
            ? "bg-white/10 text-neutral-200"
            : "bg-[#141414] text-neutral-100"
        }`}
      >
        {/* Tapping a line the character wrote asks for its gloss. Written
            lines arrive without one on purpose: the answer is spoken as soon as
            the words exist, and a translation nobody has asked to read should
            not be standing between them and the sound. */}
        {line.who === "tutor" && !line.translation && onTranslate ? (
          <button
            type="button"
            onClick={() => onTranslate(line.text)}
            className="text-left text-[14px] leading-snug"
          >
            {line.text}
          </button>
        ) : (
          <p className="text-[14px] leading-snug">{line.text}</p>
        )}
        {line.translation ? (
          <p className="mt-1 text-[12px] text-neutral-500">{line.translation}</p>
        ) : null}
        {/* Read in the seconds after they stop talking, while they wait to be
            answered — the one moment in a spoken turn when their eyes are free.
            Never said aloud; the character does not know it is here. */}
        {line.better || line.about ? (
          <div className="mt-1.5 border-t border-white/10 pt-1.5">
            {line.better ? (
              <>
                <p className="text-[10px] uppercase tracking-wide text-neutral-500">
                  {ui.roleplayBetter}
                </p>
                <p className="mt-0.5 text-[13px] leading-snug text-emerald-200">
                  {line.better}
                </p>
              </>
            ) : null}
            {line.about ? (
              <p
                className={`text-[12px] leading-snug text-neutral-400 ${
                  line.better ? "mt-1" : ""
                }`}
              >
                {line.about}
              </p>
            ) : null}
          </div>
        ) : null}
        {/* Stays on the turn for the rest of the scene. Pressing it is a
            decision the learner can take later, when they are not in the
            middle of being asked to speak. */}
        {line.stuck ? (
          <button
            type="button"
            onClick={() => onReview(line.stuck!)}
            className="mt-1.5 rounded-full border border-white/20 px-2.5 py-1 text-[11px] text-neutral-300 hover:bg-white/10"
          >
            {ui.roleplayWhyStuck}
          </button>
        ) : null}
      </div>
    </li>
  );
}

/**
 * The line as it came out, with the words that did not survive marked.
 *
 * Shown before anything is said about it, because it is the finding: which word
 * turned into which is arithmetic the learner can check against their own ears,
 * and it stands whether or not the sentence explaining it ever arrives.
 */
function Attempt({ outcomes, ui }: { outcomes: WordOutcome[]; ui: UICopy }) {
  return (
    <div className="mt-3 rounded-xl bg-white/5 p-3">
      <p className="text-[11px] text-neutral-500">{ui.roleplayPracticeHeard}</p>
      <p className="mt-1 text-[14px] leading-relaxed">
        {outcomes.map((outcome, index) => (
          <span key={index}>
            {outcome.kind === "kept" ? (
              <span className="text-neutral-100">{outcome.word}</span>
            ) : outcome.kind === "changed" ? (
              <span className="text-amber-300">
                {outcome.heardAs}
                <span className="text-neutral-500"> ({outcome.word})</span>
              </span>
            ) : (
              <span className="text-neutral-500 line-through">{outcome.word}</span>
            )}{" "}
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
function SayItBack({
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

/**
 * The panel itself. `review` is null while it is being put together, and
 * `failed` says the attempt came back with nothing.
 *
 * Anchored to the bottom rather than centred: it is read on a phone, with a
 * thumb on the close button, and it is capped so the conversation it is about
 * stays visible behind it.
 */
export function RoleplayReviewPanel({
  turn,
  review,
  failed,
  ui,
  onClose,
  onSayItBack,
}: {
  turn: StuckTurn;
  review: Review | null;
  failed: boolean;
  ui: UICopy;
  onClose: () => void;
  /** Listen once and read the attempt. Absent where there is no microphone. */
  onSayItBack?: (target: string) => Promise<{ heard: string; practice: Practice | null }>;
}) {
  const scroller = useRef<HTMLDivElement | null>(null);
  const toBottom = () => {
    const panel = scroller.current;
    if (!panel) return;
    panel.scrollTo({ top: panel.scrollHeight, behavior: "smooth" });
  };

  return (
    <div className="absolute inset-0 z-10 flex flex-col justify-end bg-black/70 p-3">
      <div
        ref={scroller}
        className="max-h-[80%] overflow-y-auto rounded-2xl border border-white/10 bg-[#0e0e0e] p-4"
      >
        <h3 className="text-sm font-semibold text-white">{ui.roleplayReviewTitle}</h3>
        <p className="mt-1 text-[12px] text-neutral-500">{turn.asked}</p>

        {review ? (
          <>
            <p className="mt-3 whitespace-pre-line text-[13px] leading-relaxed text-neutral-200">
              {review.why}
            </p>
            {review.say ? (
              <div className="mt-3 rounded-xl bg-white/5 p-3">
                <p className="text-[11px] text-neutral-500">{ui.roleplayReviewSay}</p>
                <p className="mt-1 text-[14px] text-neutral-100">{review.say}</p>
                {review.meaning ? (
                  <p className="mt-0.5 text-[12px] text-neutral-500">{review.meaning}</p>
                ) : null}
                {/* Reading it is not saying it. The line is right here and the
                    scene is already stopped, so this is the cheapest moment
                    there will ever be to try it. */}
                {onSayItBack ? (
                  <SayItBack
                    target={review.say}
                    ui={ui}
                    onListen={onSayItBack}
                    onGrew={toBottom}
                  />
                ) : null}
              </div>
            ) : null}
          </>
        ) : (
          <p className="mt-3 text-[13px] text-neutral-400">
            {failed ? ui.roleplayReviewFailed : ui.roleplayReviewLoading}
          </p>
        )}

        <button
          type="button"
          onClick={onClose}
          className="mt-4 w-full rounded-xl bg-white/15 px-4 py-3 text-sm text-neutral-100"
        >
          {ui.billingClose}
        </button>
      </div>
    </div>
  );
}
