"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  CallContext,
  type CallContextValue,
  type CallStartResult,
} from "@/contexts/CallContext";
import type { CallPhase } from "@/lib/callSession";
import { apiUrl } from "@/lib/apiBase";
import { entitlementHeaders } from "@/lib/billing/billingService";
import { TRIAL_CALL_MAX_SECONDS } from "@/lib/billing/config";
import { usePremium } from "@/contexts/PremiumContext";
import type { LearningLanguageCode } from "@/lib/learningLanguages";
import { askAboutLineText } from "@/lib/callLines";
import {
  RealtimeCallError,
  startRealtimeCall,
  type CallLine,
  type RealtimeCall,
} from "@/lib/realtimeCall";

function secondsSince(started: number | null) {
  return started ? Math.max(0, Math.round((Date.now() - started) / 1000)) : 0;
}

/**
 * Owns the live call so it outlives the chat tab. The peer connection used to sit
 * inside ChatWindow, which meant leaving the tab hid the hang-up button while the
 * audio kept playing.
 */
export function CallProvider({ children }: { children: ReactNode }) {
  const { isPremium } = usePremium();
  const [phase, setPhase] = useState<CallPhase>("idle");
  const [muted, setMuted] = useState(false);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [lines, setLines] = useState<CallLine[]>([]);
  /** How long this call was sold, when it was opened against a points block. */
  const [blockSeconds, setBlockSeconds] = useState<number | null>(null);

  const callRef = useRef<RealtimeCall | null>(null);
  /** The line the tutor was last handed by a tap, or null. */
  const pointedLineIdRef = useRef<string | null>(null);
  /**
   * The hold this call was charged against. Deliberately not cleared by
   * teardown: the report that returns the unused points is sent after the call
   * object is already gone.
   */
  const holdIdRef = useRef<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const startedAtRef = useRef<number | null>(null);
  const endedListeners = useRef(new Set<(durationSeconds: number) => void>());

  const teardown = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    callRef.current?.hangUp();
    callRef.current = null;
    startedAtRef.current = null;
    setPhase("idle");
    setMuted(false);
    setStartedAt(null);
  }, []);

  const emitEnded = useCallback((durationSeconds: number) => {
    for (const listener of endedListeners.current) listener(durationSeconds);
  }, []);

  const stop = useCallback(() => {
    teardown();
  }, [teardown]);

  const hangUp = useCallback(() => {
    const seconds = secondsSince(startedAtRef.current);
    teardown();
    emitEnded(seconds);
  }, [emitEnded, teardown]);

  const start = useCallback(
    async (
      targetLanguage: LearningLanguageCode,
      nativeLanguage: LearningLanguageCode,
      opening?: { scene: string; ask: string },
    ): Promise<CallStartResult> => {
      if (phase !== "idle") return { ok: true };
      const abort = new AbortController();
      abortRef.current = abort;
      setMuted(false);
      // Cleared here rather than on teardown: the transcript is most useful
      // after the call, when there is time to ask about what went past.
      setLines([]);
      pointedLineIdRef.current = null;
      holdIdRef.current = null;
      setBlockSeconds(null);
      setPhase("calling");
      try {
        const call = await startRealtimeCall({
          targetLanguage,
          nativeLanguage,
          isPremium,
          signal: abort.signal,
          onConnected: () => {
            const now = Date.now();
            startedAtRef.current = now;
            setStartedAt(now);
            setPhase("connected");
          },
          onDisconnected: () => {
            const wasConnected = startedAtRef.current !== null;
            const seconds = secondsSince(startedAtRef.current);
            teardown();
            if (wasConnected) emitEnded(seconds);
          },
          onLine: (line) => setLines((current) => [...current, line]),
          // Present when a roleplay called for help: the tutor arrives into a
          // scene rather than picking up the phone.
          opening,
        });
        if (abort.signal.aborted) {
          call.hangUp();
          return { ok: false, reason: "aborted" };
        }
        callRef.current = call;
        holdIdRef.current = call.holdId;
        setBlockSeconds(call.blockSeconds);
        return { ok: true };
      } catch (error) {
        teardown();
        if (error instanceof DOMException && error.name === "AbortError") {
          return { ok: false, reason: "aborted" };
        }
        if (error instanceof RealtimeCallError) {
          if (error.code === "trial") return { ok: false, reason: "trial" };
          if (error.code === "points") return { ok: false, reason: "points" };
          if (error.code === "mic") return { ok: false, reason: "mic" };
        }
        return { ok: false, reason: "connect" };
      }
    },
    [emitEnded, isPremium, phase, teardown],
  );

  const sendText = useCallback(
    (text: string) => callRef.current?.sendText(text) ?? false,
    [],
  );

  const pointAtLine = useCallback((line: CallLine) => {
    const sent = callRef.current?.pointAtLine(line.text) ?? false;
    // Remembered so a typed question does not repeat a sentence the tutor was
    // just handed. Only a note that actually went out counts.
    pointedLineIdRef.current = sent ? line.id : null;
    return sent;
  }, []);

  const askAboutLine = useCallback(
    (line: CallLine, question: string) => {
      // The tutor gets the line, never its number. Nothing here depends on the
      // model counting turns or on a number holding still.
      const text = askAboutLineText(line.text, question, {
        alreadyPointed: pointedLineIdRef.current === line.id,
      });
      if (!text) return false;
      return sendText(text);
    },
    [sendText],
  );

  const toggleMuted = useCallback(() => {
    setMuted((value) => {
      const next = !value;
      callRef.current?.setMuted(next);
      return next;
    });
  }, []);

  const subscribeEnded = useCallback(
    (listener: (durationSeconds: number) => void) => {
      endedListeners.current.add(listener);
      return () => {
        endedListeners.current.delete(listener);
      };
    },
    [],
  );

  // A call ends itself. The server can refuse to open one but cannot close it —
  // after the handshake the audio runs phone-to-OpenAI — so the only place a
  // length limit can live is here.
  //
  // A call opened against a points block runs for exactly what was paid for:
  // the block was charged up front precisely because this is the only thing
  // that can honour it, and running past it would spend audio nobody bought.
  // Otherwise the old rule stands, a trial call is capped and a subscriber's
  // is not.
  useEffect(() => {
    if (phase !== "connected") return;
    const limitSeconds =
      blockSeconds ?? (isPremium ? null : TRIAL_CALL_MAX_SECONDS);
    if (limitSeconds === null) return;
    const timer = setTimeout(() => {
      hangUp();
    }, limitSeconds * 1000);
    return () => clearTimeout(timer);
  }, [blockSeconds, hangUp, isPremium, phase]);

  // Tell the server how long the call ran. It opened the call and then lost
  // sight of it — the audio runs phone-to-OpenAI — so this is the only account
  // of a call's length there is, and length is what realtime audio is billed by.
  // keepalive so a report survives the app being put away; failures are dropped
  // because nothing about the call should depend on the bookkeeping.
  useEffect(() => {
    return subscribeEnded((durationSeconds) => {
      if (durationSeconds <= 0) return;
      // The hold rides along: this report is what returns the unused part of
      // the block, and a report that never arrives leaves it spent.
      const holdId = holdIdRef.current;
      holdIdRef.current = null;
      void fetch(apiUrl("/api/realtime/call/ended"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...entitlementHeaders(isPremium),
        },
        body: JSON.stringify({
          seconds: durationSeconds,
          ...(holdId ? { holdId } : {}),
        }),
        keepalive: true,
      }).catch(() => undefined);
    });
  }, [isPremium, subscribeEnded]);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      callRef.current?.hangUp();
    };
  }, []);

  const value = useMemo<CallContextValue>(
    () => ({
      phase,
      muted,
      startedAt,
      start,
      hangUp,
      stop,
      toggleMuted,
      sendText,
      subscribeEnded,
      lines,
      askAboutLine,
      pointAtLine,
    }),
    [
      askAboutLine,
      hangUp,
      lines,
      pointAtLine,
      muted,
      phase,
      start,
      startedAt,
      stop,
      subscribeEnded,
      sendText,
      toggleMuted,
    ],
  );

  return <CallContext.Provider value={value}>{children}</CallContext.Provider>;
}
