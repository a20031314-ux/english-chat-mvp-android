"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { UICopy } from "@/lib/copy";
import { roomCopy } from "@/lib/rooms/copy";
import { readCachedAccount, subscribeSession } from "@/lib/account/session";
import { AccountCard } from "@/components/account/AccountCard";
import { requestDm, requestPrivateCall } from "@/lib/rooms/openDm";
import {
  RandomApiError,
  openAdultVerification,
  portoneClientReady,
  randomJoin,
  randomLeave,
  randomStatus,
  takeReturnedVerification,
  verifyAdult,
} from "@/lib/random/client";
import type { RandomMatch, RandomMode, RandomStatus } from "@/lib/random/protocol";

/**
 * 창구 Spin의 첫 화면(🎲 랜덤 탭, lib/random/protocol.ts).
 * 성인인증한 사람만 랜덤 채팅·랜덤 영상통화. 미성년·미인증은 이 화면만 막히고 다른 탭은 그대로.
 * 짝이 정해지면 채팅은 그 사람과의 1:1 대화가, 영상은 둘만의 영상 방이 열린다(RoomsScreen이 그린다).
 * 서버 스위치(`RANDOM_ENABLED`)가 꺼져 있으면 "준비 중"만.
 */
type Phase = { kind: "idle" } | { kind: "searching"; mode: RandomMode; since: number } | { kind: "found"; match: RandomMatch };

const POLL_MS = 2_000;

export function RandomScreen({ ui, locale, targetLanguage }: { ui: UICopy; locale: string; targetLanguage: string }) {
  const t = roomCopy(locale);
  const account = useSyncExternalStore(subscribeSession, readCachedAccount, () => null);
  const [status, setStatus] = useState<RandomStatus | null>(null);
  const [phase, setPhase] = useState<Phase>({ kind: "idle" });
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const searching = useRef<RandomMode | null>(null);

  const load = useCallback(async () => {
    try {
      setStatus(await randomStatus());
    } catch {
      setStatus({ state: "off" });
    }
  }, []);

  // 모바일 인증 창에서 돌아왔으면 마저 확인한다.
  useEffect(() => {
    const returned = takeReturnedVerification();
    if (!returned) {
      void load();
      return;
    }
    setBusy(true);
    void verifyAdult(returned)
      .then(setStatus, (error) => {
        setNotice(verifyError(error, t));
        void load();
      })
      .finally(() => setBusy(false));
    // 처음 한 번만.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account?.id]);

  const verify = async () => {
    if (!account) return;
    setBusy(true);
    setNotice("");
    try {
      const id = await openAdultVerification(account.id);
      if (!id) {
        setNotice(t.randomVerifyFailed);
        return;
      }
      setStatus(await verifyAdult(id));
    } catch (error) {
      setNotice(verifyError(error, t));
    } finally {
      setBusy(false);
    }
  };

  const stop = useCallback(() => {
    searching.current = null;
    setPhase({ kind: "idle" });
    void randomLeave();
  }, []);

  // 찾는 동안 2초마다 묻는다. 화면을 떠나면 줄에서 빠진다.
  useEffect(() => {
    if (phase.kind !== "searching") return;
    let timer = 0;
    let alive = true;
    const tick = async () => {
      if (!alive || searching.current !== phase.mode) return;
      try {
        const match = await randomJoin(phase.mode, targetLanguage, locale);
        if (!alive) return;
        if (match) {
          searching.current = null;
          setPhase({ kind: "found", match });
          if (match.mode === "video" && match.roomId) requestPrivateCall(match.roomId, `🎲 ${match.nickname}`, match.other);
          else requestDm(match.other);
          return;
        }
      } catch (error) {
        if (!alive) return;
        searching.current = null;
        setPhase({ kind: "idle" });
        if (error instanceof RandomApiError && error.code !== "FAILED") void load();
        else setNotice(t.error);
        return;
      }
      timer = window.setTimeout(() => void tick(), POLL_MS);
    };
    void tick();
    return () => {
      alive = false;
      window.clearTimeout(timer);
    };
  }, [phase, targetLanguage, locale, load, t.error]);
  useEffect(() => () => void (searching.current ? randomLeave() : undefined), []);

  const start = (mode: RandomMode) => {
    setNotice("");
    searching.current = mode;
    setPhase({ kind: "searching", mode, since: Date.now() });
  };

  const waitedLong = phase.kind === "searching" && Date.now() - phase.since > 30_000;

  return (
    <div className="tb-panel flex h-full min-h-0 flex-col overflow-hidden rounded-2xl">
      <header className="shrink-0 border-b border-white/10 px-4 py-3">
        <h1 className="text-base font-semibold text-white">🎲 {t.randomTitle}</h1>
        <p className="mt-0.5 text-caption text-slate-400">🔞 {t.randomAdultOnly}</p>
      </header>
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4">
        {notice ? (
          <button type="button" onClick={() => setNotice("")} className="w-full rounded-xl bg-amber-400/10 px-3 py-2 text-start text-sm text-amber-200" dir="auto">
            {notice}
          </button>
        ) : null}

        {!status ? <p className="text-sm text-slate-400">{t.connecting}</p> : null}

        {status?.state === "off" ? <Card>{t.randomOff}</Card> : null}

        {status?.state === "signedOut" || (status && status.state !== "off" && !account) ? (
          <div className="space-y-3">
            <p className="text-sm text-slate-300">{t.randomLogin}</p>
            <AccountCard ui={ui} locale={locale} />
          </div>
        ) : null}

        {status?.state === "unverified" && account ? (
          <div className="space-y-3">
            <Card>{t.randomVerifyNote}</Card>
            <button
              type="button"
              disabled={busy || !status.verifyReady || !portoneClientReady()}
              onClick={() => void verify()}
              className="w-full rounded-xl bg-platinum px-4 py-3 text-chat font-semibold text-black hover:bg-platinum-hover disabled:opacity-40"
            >
              🔞 {t.randomVerify}
            </button>
            {!status.verifyReady || !portoneClientReady() ? <p className="text-caption text-slate-500">{t.randomOff}</p> : null}
            {/* 해외 접속: 한국 휴대폰 번호가 없으면 해외용 나이 확인(업체 계약 뒤 globalReady). */}
            {status.country && status.country !== "KR" ? (
              <>
                <button
                  type="button"
                  disabled={!status.globalReady}
                  className="w-full rounded-xl border border-white/20 px-4 py-3 text-chat text-slate-200 disabled:opacity-40"
                >
                  🌐 {t.randomVerifyGlobal}
                </button>
                {status.globalReady ? null : <p className="text-caption text-slate-500">{t.randomGlobalSoon}</p>}
              </>
            ) : null}
          </div>
        ) : null}

        {status?.state === "paused" ? (
          <Card>{t.randomPaused.replace("{time}", new Date(status.until).toLocaleString(locale, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }))}</Card>
        ) : null}

        {status?.state === "minor" ? <Card>{t.randomMinor}</Card> : null}
        {status?.state === "blocked" ? <Card>{t.randomBanned}</Card> : null}

        {status?.state === "ready" && account ? (
          phase.kind === "searching" ? (
            <div className="space-y-3 rounded-2xl border border-line bg-surface-sunk px-4 py-6 text-center">
              <p className="text-chat text-ink" aria-live="polite">
                {phase.mode === "video" ? "📹" : "💬"} {t.randomWaiting}
              </p>
              {waitedLong ? <p className="text-caption text-slate-400">{t.randomNoOne}</p> : null}
              <button type="button" onClick={stop} className="rounded-xl border border-white/20 px-4 py-2 text-sm text-slate-200">
                {t.randomCancel}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {phase.kind === "found" ? (
                <Card>
                  {t.randomFound.replace("{name}", phase.match.nickname)}
                  <button
                    type="button"
                    onClick={() =>
                      phase.match.mode === "video" && phase.match.roomId
                        ? requestPrivateCall(phase.match.roomId, `🎲 ${phase.match.nickname}`, phase.match.other)
                        : requestDm(phase.match.other)
                    }
                    className="ms-2 underline"
                  >
                    {t.randomOpenAgain}
                  </button>
                </Card>
              ) : null}
              <button
                type="button"
                onClick={() => start("chat")}
                className="w-full rounded-xl bg-platinum px-4 py-3 text-chat font-semibold text-black hover:bg-platinum-hover"
              >
                💬 {phase.kind === "found" && phase.match.mode === "chat" ? t.randomNext : t.randomChat}
              </button>
              <button
                type="button"
                onClick={() => start("video")}
                className="w-full rounded-xl border border-violet-300/40 bg-violet-500/15 px-4 py-3 text-chat font-semibold text-ink"
              >
                📹 {phase.kind === "found" && phase.match.mode === "video" ? t.randomNext : t.randomVideo}
              </button>
            </div>
          )
        ) : null}

        <p className="text-caption leading-relaxed text-slate-500">
          {t.randomRules} {t.randomAiRule}
        </p>
      </div>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-xl border border-line bg-surface px-4 py-3 text-note text-slate-200">{children}</div>;
}

function verifyError(error: unknown, t: ReturnType<typeof roomCopy>): string {
  if (error instanceof RandomApiError) {
    if (error.code === "CI_TAKEN" || error.code === "USED") return t.randomUsedElsewhere;
    if (error.code === "OFF") return t.randomBanned;
  }
  return t.randomVerifyFailed;
}
