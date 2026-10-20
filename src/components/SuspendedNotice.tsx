"use client";

import { useSyncExternalStore } from "react";
import { roomCopy } from "@/lib/rooms/copy";
import { clearSuspended, readSuspended, subscribeSuspended } from "@/lib/rooms/suspended";

/**
 * 운영자가 사람 기능을 정지한 계정이 메시지·방·게시판 등에 쓰려 할 때 한 줄(lib/rooms/suspended.ts).
 * 누르면 닫히고, 다시 쓰려 하면 다시 뜬다. AI 학습 화면은 막지 않는다.
 */
export function SuspendedNotice({ locale }: { locale: string }) {
  const suspension = useSyncExternalStore(subscribeSuspended, readSuspended, () => null);
  if (!suspension) return null;
  const t = roomCopy(locale);
  const text = suspension.until
    ? t.suspended.replace(
        "{time}",
        new Date(suspension.until).toLocaleString(locale, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }),
      )
    : t.suspendedForever;
  return (
    <div className="shrink-0 px-2 pt-1.5 sm:px-4">
      <button
        type="button"
        onClick={clearSuspended}
        role="status"
        className="w-full rounded-xl border border-bad/30 bg-bad/10 px-3 py-2 text-start text-note text-bad"
        dir="auto"
      >
        ⛔ {text}
      </button>
    </div>
  );
}
