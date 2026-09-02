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
import {
  RealtimeCallError,
  startRealtimeCall,
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

  const callRef = useRef<RealtimeCall | null>(null);
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
    ): Promise<CallStartResult> => {
      if (phase !== "idle") return { ok: true };
      const abort = new AbortController();
      abortRef.current = abort;
      setMuted(false);
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
        });
        if (abort.signal.aborted) {
          call.hangUp();
          return { ok: false, reason: "aborted" };
        }
        callRef.current = call;
        return { ok: true };
      } catch (error) {
        teardown();
        if (error instanceof DOMException && error.name === "AbortError") {
          return { ok: false, reason: "aborted" };
        }
        if (error instanceof RealtimeCallError) {
          if (error.code === "trial") return { ok: false, reason: "trial" };
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

  // A trial call ends itself. The server can refuse to open a call but cannot
  // close one — after the handshake the audio runs phone-to-OpenAI — so the
  // only place a length limit can live is here.
  useEffect(() => {
    if (isPremium || phase !== "connected") return;
    const timer = setTimeout(() => {
      hangUp();
    }, TRIAL_CALL_MAX_SECONDS * 1000);
    return () => clearTimeout(timer);
  }, [hangUp, isPremium, phase]);

  // Tell the server how long the call ran. It opened the call and then lost
  // sight of it — the audio runs phone-to-OpenAI — so this is the only account
  // of a call's length there is, and length is what realtime audio is billed by.
  // keepalive so a report survives the app being put away; failures are dropped
  // because nothing about the call should depend on the bookkeeping.
  useEffect(() => {
    return subscribeEnded((durationSeconds) => {
      if (durationSeconds <= 0) return;
      void fetch(apiUrl("/api/realtime/call/ended"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...entitlementHeaders(isPremium),
        },
        body: JSON.stringify({ seconds: durationSeconds }),
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
    }),
    [
      hangUp,
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
