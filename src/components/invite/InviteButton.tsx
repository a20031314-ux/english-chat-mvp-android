"use client";

import { useState } from "react";
import { inviteCopy } from "@/lib/invite/copy";
import { shareInvite } from "@/lib/invite/client";

/**
 * 친구 초대 버튼 — 사람 탭 머리(앱 초대)와 말하는 방 머리(방 초대, 공개 방만).
 * 안드로이드는 공유 창, 웹은 navigator.share 또는 링크 복사.
 */
export function InviteButton({
  locale,
  room,
  compact = false,
}: {
  locale: string;
  room?: { id: string; name: string } | null;
  compact?: boolean;
}) {
  const t = inviteCopy(locale);
  const [note, setNote] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const label = room ? t.inviteRoom : t.invite;

  const flash = (text: string) => {
    setNote(text);
    window.setTimeout(() => setNote(null), 2500);
  };

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        disabled={busy}
        aria-label={label}
        title={label}
        onClick={async () => {
          setBusy(true);
          try {
            if ((await shareInvite(locale, room)) === "copied") flash(t.copied);
          } catch {
            flash(t.shareFailed);
          }
          setBusy(false);
        }}
        className="inline-flex items-center gap-1 rounded-lg border border-line px-2.5 py-1 text-caption text-slate-200 hover:bg-white/10 disabled:opacity-50"
      >
        <span aria-hidden>➕</span>
        {compact ? null : label}
      </button>
      {note ? (
        <span role="status" className="absolute end-0 top-full z-10 mt-1 w-max max-w-[16rem] rounded-lg bg-surface-raised px-2.5 py-1.5 text-caption text-ink shadow-lg">
          {note}
        </span>
      ) : null}
    </span>
  );
}
