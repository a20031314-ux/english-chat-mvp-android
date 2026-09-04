"use client";

import { createContext, useContext } from "react";
import type { CallPhase } from "@/lib/callSession";
import type { LearningLanguageCode } from "@/lib/learningLanguages";
import type { CallLine } from "@/lib/realtimeCall";

export type CallStartResult =
  | { ok: true }
  | { ok: false; reason: "mic" | "connect" | "aborted" | "trial" };

export type CallContextValue = {
  phase: CallPhase;
  muted: boolean;
  /**
   * When the call connected, or null. Deliberately not a ticking counter — the
   * bar runs its own clock so a call does not re-render every consumer each second.
   */
  startedAt: number | null;
  start: (
    targetLanguage: LearningLanguageCode,
    nativeLanguage: LearningLanguageCode,
  ) => Promise<CallStartResult>;
  /** User-initiated. Emits an ended event so the chat can log the call. */
  hangUp: () => void;
  /** Silent teardown, e.g. the learner switched language. Emits nothing. */
  stop: () => void;
  toggleMuted: () => void;
  /** Give the tutor a typed line. False when no call is carrying it. */
  sendText: (text: string) => boolean;
  /** Finished turns of the current call, oldest first. Cleared when one starts. */
  lines: CallLine[];
  /**
   * Ask the tutor about a line the learner pointed at.
   *
   * The number on screen is for the person. The tutor is handed the line itself,
   * so nothing rests on it counting turns or on a number still meaning what it
   * meant a moment ago.
   */
  askAboutLine: (line: CallLine, question: string) => boolean;
  /**
   * Hand the tutor a line the learner tapped, without asking for an answer.
   *
   * Called on the tap itself so the question can be *spoken*. Without it a tap
   * changes nothing the tutor can see, and "why is this wrong?" said out loud
   * arrives with nothing for "this" to mean — the tutor then answers about the
   * last thing it heard, and the learner never finds out the pointing missed.
   */
  pointAtLine: (line: CallLine) => boolean;
  /** Fires when a call ends by hang-up or by the far end dropping. */
  subscribeEnded: (listener: (durationSeconds: number) => void) => () => void;
};

export const CallContext = createContext<CallContextValue | null>(null);

export function useCall(): CallContextValue {
  const value = useContext(CallContext);
  if (!value) throw new Error("useCall must be used inside CallProvider");
  return value;
}
