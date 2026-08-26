"use client";

import { createContext, useContext } from "react";
import type { CallPhase } from "@/lib/callSession";
import type { LearningLanguageCode } from "@/lib/learningLanguages";

export type CallStartResult =
  | { ok: true }
  | { ok: false; reason: "mic" | "connect" | "aborted" };

export type CallContextValue = {
  phase: CallPhase;
  muted: boolean;
  /**
   * When the call connected, or null. Deliberately not a ticking counter — the
   * bar runs its own clock so a call does not re-render every consumer each second.
   */
  startedAt: number | null;
  start: (targetLanguage: LearningLanguageCode) => Promise<CallStartResult>;
  /** User-initiated. Emits an ended event so the chat can log the call. */
  hangUp: () => void;
  /** Silent teardown, e.g. the learner switched language. Emits nothing. */
  stop: () => void;
  toggleMuted: () => void;
  /** Fires when a call ends by hang-up or by the far end dropping. */
  subscribeEnded: (listener: (durationSeconds: number) => void) => () => void;
};

export const CallContext = createContext<CallContextValue | null>(null);

export function useCall(): CallContextValue {
  const value = useContext(CallContext);
  if (!value) throw new Error("useCall must be used inside CallProvider");
  return value;
}
