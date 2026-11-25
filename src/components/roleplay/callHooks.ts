"use client";

/**
 * AI 통화 화면(RoleplayScreen)의 곁가지 상태 — 대화 흐름과 상관없는 것들을 옮김(2026-11-01 통화 구조 정리).
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { apiUrl } from "@/lib/apiBase";
import { entitlementHeaders } from "@/lib/billing/billingService";
import type { UICopy } from "@/lib/copy";
import { buildRecap, recapLedgerKeys, wordLedgerKeys, recapReviewKeys } from "@/lib/roleplay/recap";
import { loadBank } from "@/lib/curriculum/vocabBank";
import { noteLedger } from "@/lib/curriculum/logLedger";
import { noteGrowthLines } from "@/lib/curriculum/growthLines";
import { growthLinesOf } from "@/lib/roleplay/talkGrowth";
import type { TranscriptLine } from "@/lib/roleplay/review";

/**
 * 남은 통화 시간 한 줄(통화 머리). 통화를 열 때 서버에 한 번 묻고, 그 뒤로는 통화가 도는 동안 흐른 시간을 빼서 줄인다 —
 * 한 번 묻고 그대로 두어 2분 넘게 통화해도 "10분 남음"이던 것(사용자 2026-11-23). 서버가 답을 못 하면 null(머리에는 튜터 역할).
 */
export function useCallTimeLine(ui: UICopy, isPremium: boolean, running = true, turns = 0): string | null {
  const [base, setBase] = useState<{ kind: "today"; seconds: number; daily: number } | { kind: "points"; seconds: number } | null>(null);
  const [spent, setSpent] = useState(0);
  // 열 때 한 번, 그리고 차례(turns)가 끝날 때마다 서버 셈으로 다시 맞춘다 — 벽시계로만 빼면 서버(첫 차례부터·차례 사이 60초 상한)보다 빨리 줆.
  useEffect(() => {
    let live = true;
    void fetch(apiUrl("/api/entitlement"), { headers: entitlementHeaders(isPremium) })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { callPointsLeft?: unknown; callCarrySeconds?: unknown; callPointSeconds?: unknown; callTodayLeftSeconds?: unknown; callDailyMinutes?: unknown } | null) => {
        if (!live || !data) return;
        if (typeof data.callTodayLeftSeconds === "number" && typeof data.callDailyMinutes === "number") {
          setBase({ kind: "today", seconds: data.callTodayLeftSeconds, daily: data.callDailyMinutes });
          setSpent(0);
          return;
        }
        if (typeof data.callPointsLeft === "number" && typeof data.callPointSeconds === "number") {
          const carry = typeof data.callCarrySeconds === "number" ? data.callCarrySeconds : 0;
          setBase({ kind: "points", seconds: data.callPointsLeft * data.callPointSeconds + carry });
          setSpent(0);
        }
      })
      .catch(() => undefined);
    return () => {
      live = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turns]);
  // 통화가 도는 동안만 흐른 시간을 센다(끝 화면에서는 멈춤).
  useEffect(() => {
    if (!running || !base) return;
    const timer = window.setInterval(() => setSpent((value) => value + 5), 5000);
    return () => window.clearInterval(timer);
  }, [running, base]);
  if (!base) return null;
  const left = Math.max(0, base.seconds - spent);
  return base.kind === "today"
    ? ui.roleplayTodayLeft.replace("{minutes}", String(Math.ceil(left / 60))).replace("{daily}", String(base.daily))
    : ui.roleplayTimeLeft.replace("{minutes}", String(Math.floor(left / 60)));
}

export { useStoredToggle } from "@/components/speech/CallKit";

/**
 * 통화 정리(roleplay/recap.ts): 끝나면 고친 줄·도움말·뜻 본 튜터 줄 → 문장구조를 찾아
 * 다시 볼 것에 자동으로(숙지는 그대로, from "call"). 같은 열쇠 묶음은 한 번만 보낸다.
 */
export function useCallRecap(callOver: boolean, language: string | null, said: TranscriptLine[], isPremium: boolean, since = 0) {
  const recap = useMemo(() => (callOver && language ? buildRecap(language, said) : []), [callOver, language, said]);
  const [saved, setSaved] = useState(false);
  const sentRef = useRef("");
  const ledgerRef = useRef(false);
  // Logbank 사건 장부: 끝난 통화마다 한 번 — 고친 말의 문장구조는 틀림, 그대로 쓴 문장구조는 씀(curriculum/logLedger.ts).
  useEffect(() => {
    if (!callOver) {
      ledgerRef.current = false;
      return;
    }
    if (!language || ledgerRef.current) return;
    ledgerRef.current = true;
    // 이어서 한 통화는 이번에 연 뒤 나온 줄만 — 앞 세션 줄은 그때 이미 장부에 들어갔다.
    const fresh = since ? said.filter((line) => (line.at ?? 0) >= since) : said;
    const note = (keys: { miss: string[]; used: string[] }) =>
      noteLedger(language, [...keys.miss.map((k) => ({ k, src: "call" as const, r: "miss" as const })), ...keys.used.map((k) => ({ k, src: "call" as const, r: "used" as const }))]);
    // 문장구조·문법·단계 표현은 바로, 낱말은 빈도 목록을 불러온 뒤(언어마다 한 번).
    note(recapLedgerKeys(language, fresh));
    // 고쳐 씀 재료(줄과 열쇠, 이 폰 growthLines.v1 — 2026-11-07): 낱말 열쇠까지 넣으려고 빈도 목록 뒤에, 못 받으면 문장구조만.
    const t = Math.round(Date.now() / 1000);
    void loadBank(language)
      .then((bank) => {
        const words = new Map(bank.map((word) => [word.w.toLocaleLowerCase(), word.pos]));
        note(wordLedgerKeys(language, fresh, words));
        noteGrowthLines(language, growthLinesOf(language, fresh, "call", t, words));
      })
      .catch(() => noteGrowthLines(language, growthLinesOf(language, fresh, "call", t, null)));
  }, [callOver, language, said, since]);
  useEffect(() => {
    if (!callOver || !language) return;
    const keys = recapReviewKeys(recap);
    const sig = keys.join(",");
    if (!keys.length || sentRef.current === sig) return;
    sentRef.current = sig;
    void fetch(apiUrl("/api/curriculum/scripts"), {
      method: "POST",
      headers: { "Content-Type": "application/json", ...entitlementHeaders(isPremium) },
      body: JSON.stringify({ language, from: "call", check: Object.fromEntries(keys.map((key) => [key, false])) }),
    })
      .then((response) => setSaved(response.ok))
      .catch(() => undefined);
  }, [callOver, language, recap, isPremium]);
  return { recap, saved };
}
