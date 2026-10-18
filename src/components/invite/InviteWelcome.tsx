"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { BodyLayer } from "@/components/FullScreenLayer";
import { AccountCard } from "@/components/account/AccountCard";
import { readCachedAccount, subscribeSession } from "@/lib/account/session";
import type { UICopy } from "@/lib/copy";
import { fillInvite, inviteCopy } from "@/lib/invite/copy";
import { acceptInvite, clearSavedInvite, lookupInvite, onInviteLink, takeInvite } from "@/lib/invite/client";
import type { InviteLookup, PendingInvite } from "@/lib/invite/shared";
import { requestDm, requestRoom } from "@/lib/rooms/openDm";

/**
 * 초대 링크로 앱을 열었을 때(설치 직후 첫 실행 포함) 한 번 뜨는 시트.
 * "○○님이 초대했어요" → 로그인 안 했으면 계정 카드, 했으면 팔로우하고 메시지 / 방 들어가기 / 나중에.
 * 받아들이면 서로 팔로우(서버 /api/invite accept). 내 링크면 아무것도 띄우지 않는다.
 */
export function InviteWelcome({ ui, locale, onOpenMessages }: { ui: UICopy; locale: string; onOpenMessages: () => void }) {
  const t = inviteCopy(locale);
  const account = useSyncExternalStore(subscribeSession, readCachedAccount, () => null);
  const [invite, setInvite] = useState<PendingInvite | null>(null);
  const [info, setInfo] = useState<InviteLookup | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let alive = true;
    void takeInvite().then((found) => {
      if (alive && found) setInvite(found);
    });
    const stop = onInviteLink((found) => setInvite(found));
    return () => {
      alive = false;
      stop();
    };
  }, []);

  useEffect(() => {
    if (!invite) return;
    let alive = true;
    lookupInvite(invite).then(
      (found) => {
        if (!alive) return;
        if (found.isMe) {
          clearSavedInvite();
          setInvite(null);
          return;
        }
        setInfo(found);
      },
      (error: Error) => {
        // 없는 코드는 버리고, 연결 문제면 다음 실행에 다시.
        if (alive && error.message === "NO_INVITE") {
          clearSavedInvite();
          setInvite(null);
        }
      },
    );
    return () => {
      alive = false;
    };
  }, [invite]);

  if (!invite || !info) return null;

  const close = () => {
    clearSavedInvite();
    setInvite(null);
    setInfo(null);
  };

  const accept = async (then: () => void) => {
    setBusy(true);
    try {
      await acceptInvite(invite.code);
    } catch {
      // 팔로우가 안 돼도(차단 등) 대화·방은 열어 본다 — 서버가 다시 막는다.
    }
    setBusy(false);
    close();
    then();
  };

  const name = info.inviter.nickname;
  return (
    <BodyLayer>
      <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/60 p-3 sm:items-center">
        <div role="dialog" aria-modal="true" aria-label={fillInvite(t.welcomeTitle, { name })} className="w-full max-w-md rounded-2xl border border-line bg-surface p-4 shadow-2xl">
          <div className="flex items-center gap-3">
            {info.inviter.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={info.inviter.photo} alt="" className="h-14 w-14 rounded-full object-cover" />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-violet-500/30 text-title text-ink">
                {Array.from(name)[0] ?? "?"}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-title font-semibold text-ink" dir="auto">
                {fillInvite(t.welcomeTitle, { name })}
              </p>
              {info.room ? (
                <p className="text-note text-slate-400" dir="auto">
                  {fillInvite(t.welcomeRoom, { room: info.room.name })}
                </p>
              ) : null}
            </div>
          </div>
          {info.inviter.bio ? (
            <p className="mt-3 line-clamp-3 text-sm text-slate-200" dir="auto">
              {info.inviter.bio}
            </p>
          ) : null}

          {account ? (
            <div className="mt-4 flex flex-col gap-2">
              {info.room ? (
                <button type="button" disabled={busy} onClick={() => void accept(() => requestRoom(info.room!.id))} className="tb-btn w-full rounded-lg px-4 py-2.5 text-sm font-semibold">
                  {t.joinRoom}
                </button>
              ) : null}
              <button
                type="button"
                disabled={busy}
                onClick={() =>
                  void accept(() => {
                    onOpenMessages();
                    requestDm(info.inviter.id);
                  })
                }
                className={info.room ? "w-full rounded-lg border border-line px-4 py-2.5 text-sm text-ink hover:bg-white/5" : "tb-btn w-full rounded-lg px-4 py-2.5 text-sm font-semibold"}
              >
                {t.followAndMessage}
              </button>
              <button type="button" onClick={close} className="w-full rounded-lg px-4 py-2 text-sm text-slate-400 hover:bg-white/5">
                {t.later}
              </button>
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              <p className="text-sm text-slate-300">{fillInvite(t.welcomeLogin, { name })}</p>
              {/* 로그인하면 앱이 다시 열리고, 저장해 둔 초대로 이 시트가 다시 뜬다. */}
              <AccountCard ui={ui} locale={locale} />
              <button type="button" onClick={close} className="w-full rounded-lg px-4 py-2 text-sm text-slate-400 hover:bg-white/5">
                {t.later}
              </button>
            </div>
          )}
        </div>
      </div>
    </BodyLayer>
  );
}
