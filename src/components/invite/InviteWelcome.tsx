"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { BodyLayer } from "@/components/FullScreenLayer";
import { AccountCard } from "@/components/account/AccountCard";
import { readCachedAccount, subscribeSession } from "@/lib/account/session";
import { saveProfile } from "@/lib/account/client";
import { cleanNickname, NICKNAME_MAX } from "@/lib/account/shared";
import type { UICopy } from "@/lib/copy";
import { fillInvite, inviteCopy } from "@/lib/invite/copy";
import { acceptInvite, clearSavedInvite, lookupInvite, onInviteLink, takeInvite } from "@/lib/invite/client";
import type { InviteLookup, PendingInvite } from "@/lib/invite/shared";
import { requestDm, requestRoom } from "@/lib/rooms/openDm";

/**
 * 초대 링크로 앱을 열었을 때(설치 직후 첫 실행 포함) 한 번 뜨는 시트.
 * "○○님이 초대했어요" → 로그인 안 했으면 계정 카드 → 이름이 없으면 이름 정하기 → 방 들어가기(방 초대) 또는 사람 보기 / 메시지 / 나중에.
 * 팔로우는 하지 않는다(링크를 여러 사람에게 뿌려도 되게, 사용자 결정 2026-10-19). 서버는 누가 데려왔는지만 센다. 내 링크면 안 뜸.
 */
export function InviteWelcome({ ui, locale, onOpenTab }: { ui: UICopy; locale: string; onOpenTab: (tab: "people" | "messages") => void }) {
  const t = inviteCopy(locale);
  const account = useSyncExternalStore(subscribeSession, readCachedAccount, () => null);
  const [invite, setInvite] = useState<PendingInvite | null>(null);
  const [info, setInfo] = useState<InviteLookup | null>(null);
  const [busy, setBusy] = useState(false);
  const [nameDraft, setNameDraft] = useState("");

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

  const needsName = Boolean(account && !account.profile.nickname);
  const nameOk = !needsName || cleanNickname(nameDraft).length > 0;

  /** 이름이 없으면 먼저 저장, 데려온 사람 기록(팔로우 없음), 그다음 방·사람·대화로. */
  const go = async (then: () => void) => {
    setBusy(true);
    try {
      if (needsName && account) {
        await saveProfile({ nickname: nameDraft, bio: account.profile.bio, hidden: account.profile.hidden === true });
      }
    } catch {
      setBusy(false);
      return;
    }
    try {
      await acceptInvite(invite.code);
    } catch {
      // 기록이 안 돼도 들어가는 데는 상관없다.
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
          {info.reward ? <p className="mt-2 rounded-lg bg-good/10 px-2.5 py-1.5 text-note text-good">🎁 {fillInvite(t.welcomeReward, { p: info.reward })}</p> : null}

          {account ? (
            <div className="mt-4 flex flex-col gap-2">
              {/* 이름이 없으면 여기서 정하고 바로 들어간다(방·사람 목록에 이름 없는 사람은 안 보임). */}
              {needsName ? (
                <label className="mb-1 block">
                  <span className="text-sm text-slate-300">{t.nameStep}</span>
                  <input
                    value={nameDraft}
                    onChange={(event) => setNameDraft(event.target.value)}
                    placeholder={t.namePlaceholder}
                    maxLength={NICKNAME_MAX * 2}
                    dir="auto"
                    className="mt-2 w-full rounded-lg border border-line bg-surface-sunk px-3 py-2.5 text-body text-ink outline-none focus:border-white/30"
                  />
                </label>
              ) : null}
              {/* 방 초대가 아니고 이름도 정할 게 없으면 t.browse(사람 탭으로 옮기기만)는 그리지 않는다(사용자 2026-10-30). */}
              {info.room || needsName ? (
                <button
                  type="button"
                  disabled={busy || !nameOk}
                  onClick={() => void go(() => (info.room ? requestRoom(info.room.id) : onOpenTab("people")))}
                  className="tb-btn w-full rounded-lg px-4 py-2.5 text-sm font-semibold disabled:opacity-50"
                >
                  {info.room ? t.joinRoom : t.enter}
                </button>
              ) : null}
              <button
                type="button"
                disabled={busy || !nameOk}
                onClick={() =>
                  void go(() => {
                    onOpenTab("messages");
                    requestDm(info.inviter.id);
                  })
                }
                className="w-full rounded-lg border border-line px-4 py-2.5 text-sm text-ink hover:bg-white/5 disabled:opacity-50"
              >
                {t.message}
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
