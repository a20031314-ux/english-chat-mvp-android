"use client";

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
};

export function RoleplayLine({
  line,
  ui,
  onReview,
}: {
  line: TranscriptLine;
  ui: UICopy;
  onReview: (turn: StuckTurn) => void;
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
        <p className="text-[14px] leading-snug">{line.text}</p>
        {line.translation ? (
          <p className="mt-1 text-[12px] text-neutral-500">{line.translation}</p>
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
}: {
  turn: StuckTurn;
  review: Review | null;
  failed: boolean;
  ui: UICopy;
  onClose: () => void;
}) {
  return (
    <div className="absolute inset-0 z-10 flex flex-col justify-end bg-black/70 p-3">
      <div className="max-h-[80%] overflow-y-auto rounded-2xl border border-white/10 bg-[#0e0e0e] p-4">
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
