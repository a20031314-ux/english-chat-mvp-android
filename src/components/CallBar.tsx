"use client";

import { useEffect, useState } from "react";
import { useCall } from "@/contexts/CallContext";
import { formatCallDuration } from "@/lib/callSession";
import type { UICopy } from "@/lib/copy";

function secondsSince(started: number) {
  return Math.max(0, Math.round((Date.now() - started) / 1000));
}

/** Keyed by startedAt so each call gets a fresh clock without resetting state in an effect. */
function CallDuration({ startedAt }: { startedAt: number }) {
  const [elapsedSeconds, setElapsedSeconds] = useState(() =>
    secondsSince(startedAt),
  );

  useEffect(() => {
    const timer = window.setInterval(
      () => setElapsedSeconds(secondsSince(startedAt)),
      1000,
    );
    return () => window.clearInterval(timer);
  }, [startedAt]);

  return <>{formatCallDuration(elapsedSeconds)}</>;
}

/**
 * Sits above the tab content so a call can be muted or ended from any tab.
 * Renders nothing while idle, and keeps the per-second clock to itself.
 */
export function CallBar({ ui }: { ui: UICopy }) {
  const call = useCall();
  const { phase, startedAt } = call;
  if (phase === "idle") return null;

  return (
    <div className="flex shrink-0 items-center justify-between gap-2 border-b border-white/20 bg-white/10 px-4 py-2 text-xs text-neutral-200">
      <p>
        {phase === "connected" && startedAt ? (
          <>
            {ui.chatInCall} · <CallDuration key={startedAt} startedAt={startedAt} />
          </>
        ) : (
          ui.chatCalling
        )}
      </p>
      <div className="flex gap-1">
        {phase === "connected" ? (
          <button
            type="button"
            onClick={call.toggleMuted}
            className="rounded-full border border-white/30 bg-[#121212] px-2 py-0.5 text-[11px] text-neutral-200"
          >
            {call.muted ? ui.chatUnmute : ui.chatMute}
          </button>
        ) : null}
        <button
          type="button"
          onClick={call.hangUp}
          className="rounded-full bg-rose-600 px-2 py-0.5 text-[11px] text-white"
        >
          {ui.chatHangUp}
        </button>
      </div>
    </div>
  );
}
