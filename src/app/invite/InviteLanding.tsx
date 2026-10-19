"use client";

import { useEffect, useState } from "react";
import { fillInvite, inviteCopy, INVITE_COPY_LOCALES } from "@/lib/invite/copy";
import { androidIntentUrl, parseInviteParams, playStoreUrl, type InviteLookup, type PendingInvite } from "@/lib/invite/shared";
import { isLearningLanguageCode, learningLanguageUiLabel } from "@/lib/learningLanguages";

/**
 * /invite?c=코드&room=방 — 카카오톡·문자로 받은 링크를 누르면 여기.
 * 안드로이드: "앱에서 열기"가 intent:// — 앱이 있으면 앱의 환영 시트, 없으면 Play(초대 코드를 실어서,
 * 설치 후 첫 실행에 InviteLinkPlugin이 읽는다). 다른 기기: Play 링크와 iOS 준비 중 안내.
 * 글자는 브라우저 언어(14개 중), 아랍어는 오른쪽에서.
 */

function pickLocale(): string {
  const tags = typeof navigator === "undefined" ? [] : navigator.languages ?? [navigator.language];
  for (const tag of tags) {
    const base = tag.toLowerCase().split("-")[0];
    if (INVITE_COPY_LOCALES.includes(base)) return base;
  }
  return "en";
}

type State = { invite: PendingInvite | null; info: InviteLookup | null; failed: boolean; locale: string; android: boolean };

export function InviteLanding() {
  const [state, setState] = useState<State | null>(null);

  useEffect(() => {
    const invite = parseInviteParams(window.location.search);
    const base: State = { invite, info: null, failed: !invite, locale: pickLocale(), android: /android/i.test(navigator.userAgent) };
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 주소·브라우저 언어는 브라우저에서만 안다.
    setState(base);
    if (!invite) return;
    fetch("/api/invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "lookup", c: invite.code, room: invite.room ?? undefined }),
    })
      .then((response) => (response.ok ? (response.json() as Promise<InviteLookup>) : Promise.reject()))
      .then((info) => setState({ ...base, info }), () => setState({ ...base, failed: true }));
  }, []);

  if (!state) return <main className="min-h-dvh bg-canvas" />;
  const t = inviteCopy(state.locale);
  const { info, invite } = state;
  const name = info?.inviter.nickname ?? "";
  const lang = (code: string | null) =>
    code && isLearningLanguageCode(code) ? learningLanguageUiLabel(code, state.locale) : null;
  const speaks = lang(info?.inviter.ui ?? null);
  const learns = lang(info?.inviter.learn ?? null);

  return (
    <main lang={state.locale} dir={state.locale === "ar" ? "rtl" : "ltr"} className="flex min-h-dvh items-center justify-center bg-canvas px-4 py-10 text-ink">
      <div className="w-full max-w-md rounded-2xl border border-line bg-surface p-6">
        <p className="text-caption tracking-wide text-slate-400">languagebank</p>
        {info ? (
          <>
            <div className="mt-4 flex items-center gap-3">
              {info.inviter.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={info.inviter.photo} alt="" className="h-16 w-16 rounded-full object-cover" />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-500/30 text-heading">
                  {Array.from(name)[0] ?? "?"}
                </div>
              )}
              <h1 className="min-w-0 flex-1 text-title font-semibold" dir="auto">
                {fillInvite(t.pageTitle, { name })}
              </h1>
            </div>
            {speaks || learns ? (
              <p className="mt-3 flex flex-wrap gap-2 text-caption">
                {speaks ? <span className="rounded-lg bg-good/15 px-2 py-0.5 text-good">{t.speaks} · {speaks}</span> : null}
                {learns ? <span className="rounded-lg bg-violet-500/20 px-2 py-0.5 text-violet-100">{t.learns} · {learns}</span> : null}
              </p>
            ) : null}
            {info.inviter.bio ? (
              <p className="mt-3 whitespace-pre-line text-sm text-slate-200" dir="auto">
                {info.inviter.bio}
              </p>
            ) : null}
            {info.room ? (
              <p className="mt-4 rounded-xl bg-surface-sunk px-3 py-2 text-note text-slate-200" dir="auto">
                🎙 {fillInvite(t.pageRoom, { room: info.room.name, n: info.room.people })}
              </p>
            ) : null}
          </>
        ) : state.failed ? (
          <p className="mt-4 text-sm text-slate-300">{t.noInvite}</p>
        ) : (
          <div className="mt-4 h-16 animate-pulse rounded-xl bg-surface-sunk" />
        )}

        {info?.reward ? <p className="mt-4 rounded-xl bg-good/10 px-3 py-2 text-note text-good">🎁 {fillInvite(t.welcomeReward, { p: info.reward })}</p> : null}
        <p className="mt-5 text-sm text-slate-400">{t.pageLead}</p>

        <div className="mt-5 flex flex-col gap-2">
          {state.android && invite ? (
            <a href={androidIntentUrl(invite)} className="tb-btn w-full rounded-lg px-4 py-2.5 text-center text-sm font-semibold">
              {t.openApp}
            </a>
          ) : null}
          <a
            href={playStoreUrl(invite)}
            className={state.android && invite ? "w-full rounded-lg border border-line px-4 py-2.5 text-center text-sm hover:bg-white/5" : "tb-btn w-full rounded-lg px-4 py-2.5 text-center text-sm font-semibold"}
          >
            {t.getApp}
          </a>
          {state.android ? null : <p className="text-center text-caption text-slate-500">{t.iosSoon}</p>}
        </div>
      </div>
    </main>
  );
}
