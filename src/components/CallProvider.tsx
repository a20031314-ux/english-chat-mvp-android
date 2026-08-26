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
    async (targetLanguage: LearningLanguageCode): Promise<CallStartResult> => {
      if (phase !== "idle") return { ok: true };
      const abort = new AbortController();
      abortRef.current = abort;
      setMuted(false);
      setPhase("calling");
      try {
        const call = await startRealtimeCall({
          targetLanguage,
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
        return {
          ok: false,
          reason:
            error instanceof RealtimeCallError && error.code === "mic"
              ? "mic"
              : "connect",
        };
      }
    },
    [emitEnded, phase, teardown],
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
      toggleMuted,
    ],
  );

  return <CallContext.Provider value={value}>{children}</CallContext.Provider>;
}
