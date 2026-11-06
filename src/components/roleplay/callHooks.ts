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
import type { TranscriptLine } from "@/lib/roleplay/review";

/**
 * 남은 통화 시간 한 줄: 예전 통화 첫 화면의 줄 → 통화 머리의 상태 한 줄(2026-10-23, conversation-unify 3단계).
 * 통화를 열 때 한 번 묻고, 서버가 답을 못 하면 null(머리에는 튜터 역할이 대신 나온다).
 */
export function useCallTimeLine(ui: UICopy, isPremium: boolean): string | null {
  const [timeLine, setTimeLine] = useState<string | null>(null);
  useEffect(() => {
    let live = true;
    void fetch(apiUrl("/api/entitlement"), { headers: entitlementHeaders(isPremium) })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { callPointsLeft?: unknown; callCarrySeconds?: unknown; callPointSeconds?: unknown; callTodayLeftSeconds?: unknown; callDailyMinutes?: unknown } | null) => {
        if (!live || !data) return;
        if (typeof data.callTodayLeftSeconds === "number" && typeof data.callDailyMinutes === "number") {
          setTimeLine(
            ui.roleplayTodayLeft
              .replace("{minutes}", String(Math.ceil(data.callTodayLeftSeconds / 60)))
              .replace("{daily}", String(data.callDailyMinutes)),
          );
          return;
        }
        if (typeof data.callPointsLeft === "number" && typeof data.callPointSeconds === "number") {
          const carry = typeof data.callCarrySeconds === "number" ? data.callCarrySeconds : 0;
          setTimeLine(ui.roleplayTimeLeft.replace("{minutes}", String(Math.floor((data.callPointsLeft * data.callPointSeconds + carry) / 60))));
        }
      })
      .catch(() => undefined);
    return () => {
      live = false;
    };
    // 통화를 열 때 한 번.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return timeLine;
}

export { useStoredToggle } from "@/components/speech/CallKit";

/**
 * 통화 정리(roleplay/recap.ts): 끝나면 고친 줄·도움말·뜻 본 튜터 줄 → 문장구조를 찾아
 * 다시 볼 것에 자동으로(숙지는 그대로, from "call"). 같은 열쇠 묶음은 한 번만 보낸다.
 */
export function useCallRecap(callOver: boolean, language: string | null, said: TranscriptLine[], isPremium: boolean) {
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
    const note = (keys: { miss: string[]; used: string[] }) =>
      noteLedger(language, [...keys.miss.map((k) => ({ k, src: "call" as const, r: "miss" as const })), ...keys.used.map((k) => ({ k, src: "call" as const, r: "used" as const }))]);
    // 문장구조·문법·단계 표현은 바로, 낱말은 빈도 목록을 불러온 뒤(언어마다 한 번).
    note(recapLedgerKeys(language, said));
    void loadBank(language)
      .then((bank) => note(wordLedgerKeys(language, said, new Map(bank.map((word) => [word.w.toLocaleLowerCase(), word.pos])))))
      .catch(() => undefined);
  }, [callOver, language, said]);
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
