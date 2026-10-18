"use client";

import { useEffect, useState } from "react";
import { BodyLayer } from "@/components/FullScreenLayer";
import { groupMine, mateRequest } from "@/lib/rooms/client";
import { fillTeam, teamCopy } from "@/lib/rooms/teamCopy";
import { Face, useProfile } from "./RoomParts";

/**
 * 러닝메이트 신청(hub/drafts/team-workspace.md). 프로필 시트의 버튼과, 1:1 통화가 끝났을 때 한 번 묻는 시트.
 * 두 사람 사이 메이트는 하나 — 상대가 먼저 신청했으면 누르는 순간 수락(서버 requestMate).
 */
export function MateButton({ accountId, locale }: { accountId: string; locale: string }) {
  const tt = teamCopy(locale);
  const [state, setState] = useState<"" | "busy" | "pending" | "joined" | "mates" | "error">("");
  const notice = state === "pending" ? tt.mateRequested : state === "joined" ? tt.mateJoined : state === "mates" ? tt.mateAlready : "";
  return (
    <div className="mt-2 space-y-1">
      <button
        type="button"
        disabled={state !== "" && state !== "error"}
        onClick={async () => {
          setState("busy");
          try {
            setState((await mateRequest(accountId, [])).state);
          } catch {
            setState("error");
          }
        }}
        className="w-full rounded-xl border border-good/40 px-3 py-2 text-sm font-medium text-good disabled:opacity-60"
      >
        {tt.mateRequest}
      </button>
      {notice ? <p className="text-caption text-good">{notice}</p> : null}
    </div>
  );
}

const ASKED_KEY = (id: string) => `mateAsked:${id}`;
const ASK_AGAIN_MS = 7 * 24 * 60 * 60 * 1000;

/** 이 사람에게 최근(7일)에 물었으면 다시 묻지 않는다. 기기에만 기억. */
function askedRecently(id: string): boolean {
  try {
    const at = Number(localStorage.getItem(ASKED_KEY(id)) ?? 0);
    return Date.now() - at < ASK_AGAIN_MS;
  } catch {
    return false;
  }
}

function rememberAsked(id: string): void {
  try {
    localStorage.setItem(ASKED_KEY(id), String(Date.now()));
  } catch {
    // 기억 못 하면 다음 통화에 한 번 더 묻는다.
  }
}

/** 1:1 통화가 끝나면: 이미 메이트이거나 최근에 물었으면 바로 닫힌다. */
export function MateAskSheet({ accountId, me, locale, onClose }: { accountId: string; me: string; locale: string; onClose: () => void }) {
  const tt = teamCopy(locale);
  const profile = useProfile(accountId);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (askedRecently(accountId)) {
      onClose();
      return;
    }
    let alive = true;
    void groupMine().then(
      ({ groups }) => {
        if (!alive) return;
        const mates = groups.some(
          ({ group }) => group.team?.kind === "mate" && group.members.includes(me) && [...group.members, ...group.invited].includes(accountId),
        );
        if (mates) onClose();
        else {
          rememberAsked(accountId);
          setShow(true);
        }
      },
      () => onClose(),
    );
    return () => {
      alive = false;
    };
  }, [accountId, me, onClose]);

  if (!show) return null;
  const name = profile?.nickname || "…";
  return (
    <BodyLayer>
      <div className="fixed inset-0 z-[96] flex items-end justify-center bg-black/60 p-3 sm:items-center" onClick={onClose}>
        <div role="dialog" aria-modal="true" className="w-full max-w-md rounded-2xl border border-line bg-surface p-4" onClick={(event) => event.stopPropagation()}>
          <div className="flex items-center gap-3">
            <Face accountId={accountId} name={name} size={48} />
            <p className="min-w-0 flex-1 text-title font-semibold text-ink" dir="auto">
              {fillTeam(tt.callAskTitle, { name })}
            </p>
          </div>
          <p className="mt-2 text-note text-slate-300">{tt.callAskHint}</p>
          <MateButton accountId={accountId} locale={locale} />
          <button type="button" onClick={onClose} className="mt-1 w-full rounded-lg px-3 py-2 text-sm text-slate-400 hover:bg-white/5">
            {tt.notNow}
          </button>
        </div>
      </div>
    </BodyLayer>
  );
}
