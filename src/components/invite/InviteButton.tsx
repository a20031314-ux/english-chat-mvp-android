"use client";

import { useState, type ReactNode } from "react";
import { BodyLayer } from "@/components/FullScreenLayer";
import { inviteCopy } from "@/lib/invite/copy";
import { shareInvite } from "@/lib/invite/client";

/**
 * 친구 초대 버튼 — 사람 탭 머리(앱 초대)와 말하는 방 머리(방 초대, 공개 방만).
 * 안드로이드는 공유 창, 웹은 navigator.share 또는 링크 복사.
 * `sheet`가 있으면(사람 탭 — 친구 초대 보상 카드, 2026-10-24 사용자 "보상 배너는 초대 버튼을 누르면") 먼저 그 시트를 열고 거기서 공유한다.
 */
export function InviteButton({
  locale,
  room,
  compact = false,
  sheet,
}: {
  locale: string;
  room?: { id: string; name: string } | null;
  compact?: boolean;
  sheet?: ReactNode;
}) {
  const t = inviteCopy(locale);
  const [note, setNote] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState(false);
  const label = room ? t.inviteRoom : t.invite;

  const flash = (text: string) => {
    setNote(text);
    window.setTimeout(() => setNote(null), 2500);
  };

  const share = async () => {
    setBusy(true);
    try {
      if ((await shareInvite(locale, room)) === "copied") flash(t.copied);
    } catch {
      flash(t.shareFailed);
    }
    setBusy(false);
  };

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        disabled={busy}
        aria-label={label}
        title={label}
        onClick={() => (sheet ? setOpen(true) : void share())}
        className="inline-flex items-center gap-1 rounded-lg border border-line px-2.5 py-1 text-caption text-slate-200 hover:bg-white/10 disabled:opacity-50"
      >
        <span aria-hidden>➕</span>
        {compact ? null : label}
      </button>
      {open && sheet ? (
        <BodyLayer>
          <div className="fixed inset-0 z-[82] flex items-end justify-center bg-black/60 p-3 sm:items-center" onClick={() => setOpen(false)}>
            <div role="dialog" aria-modal="true" aria-label={label} className="w-full max-w-md rounded-2xl border border-line bg-surface p-4" onClick={(event) => event.stopPropagation()}>
              <div className="mb-2 flex items-center justify-between gap-2">
                <p className="text-title font-semibold text-ink">➕ {label}</p>
                <button type="button" onClick={() => setOpen(false)} aria-label={t.later} className="rounded-lg px-2 py-1 text-sm text-slate-400 hover:bg-white/10">
                  ✕
                </button>
              </div>
              {sheet}
              <button
                type="button"
                disabled={busy}
                onClick={() => void share()}
                className="tb-btn w-full rounded-lg px-4 py-2.5 text-sm font-semibold disabled:opacity-50"
              >
                {label}
              </button>
              {note ? (
                <p role="status" className="mt-2 text-center text-caption text-slate-300">
                  {note}
                </p>
              ) : null}
            </div>
          </div>
        </BodyLayer>
      ) : null}
      {note && !open ? (
        <span role="status" className="absolute end-0 top-full z-10 mt-1 w-max max-w-[16rem] rounded-lg bg-surface-raised px-2.5 py-1.5 text-caption text-ink shadow-lg">
          {note}
        </span>
      ) : null}
    </span>
  );
}
