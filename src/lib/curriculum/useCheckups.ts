"use client";

import { useCallback, useEffect, useState } from "react";
import { usePremium } from "@/contexts/PremiumContext";
import { apiUrl } from "@/lib/apiBase";
import { entitlementHeaders } from "@/lib/billing/billingService";
import type { CheckResult } from "@/lib/curriculum/checkup";
import type { ReviewMap } from "@/lib/curriculum/dailyPlan";
import { cleanKnown, type KnownMap } from "@/lib/curriculum/known";

const EVENT = "lb-checkups";
const KNOWN_EVENT = "lb-known";

/** 서버가 돌려준 known을 같은 언어의 모든 화면에(퀴즈 답·시험 결과 뒤). */
export function announceKnown(language: string, known: unknown): void {
  window.dispatchEvent(new CustomEvent(KNOWN_EVENT, { detail: { language, known } }));
}

/**
 * 시험 결과(이번 주 확인·처음 시험·단계 시험 — 서버 stageScripts:v1 checkups, 최근 12번)를 읽고 남긴다.
 * 오늘 할 것(TodayPlan)과 단계 보기(NotebookSection "다음 단계로")가 같이 쓰므로, 남기면 같은 언어의 다른 화면도 새로 받는다.
 */
export function useCheckups(language: string): {
  checkups: CheckResult[];
  /** 시험에서 맞힌 열쇠(확인 중·이미 앎, curriculum/known.ts). */
  known: KnownMap;
  save: (result: CheckResult) => Promise<{ review?: ReviewMap } | null>;
} {
  const { isPremium } = usePremium();
  const [checkups, setCheckups] = useState<CheckResult[]>([]);
  const [known, setKnown] = useState<KnownMap>({});
  useEffect(() => {
    let alive = true;
    void fetch(apiUrl(`/api/curriculum/scripts?lang=${encodeURIComponent(language)}&checkups=1`), { headers: entitlementHeaders(isPremium) })
      .then((response) => (response.ok ? response.json() : null))
      .then((body: { checkups?: CheckResult[]; known?: unknown } | null) => {
        if (!alive) return;
        if (Array.isArray(body?.checkups)) setCheckups(body.checkups);
        if (body?.known) setKnown(cleanKnown(body.known));
      })
      .catch(() => undefined);
    const on = (event: Event) => {
      const detail = (event as CustomEvent<{ language: string; checkups: CheckResult[] }>).detail;
      if (detail?.language === language) setCheckups(detail.checkups);
    };
    const onKnown = (event: Event) => {
      const detail = (event as CustomEvent<{ language: string; known: unknown }>).detail;
      if (detail?.language === language) setKnown(cleanKnown(detail.known));
    };
    window.addEventListener(EVENT, on);
    window.addEventListener(KNOWN_EVENT, onKnown);
    return () => {
      alive = false;
      window.removeEventListener(EVENT, on);
      window.removeEventListener(KNOWN_EVENT, onKnown);
    };
  }, [language, isPremium]);
  const save = useCallback(
    async (result: CheckResult) => {
      // 서버가 답하기 전에도 화면은 바로(같은 날 다시 보지 않기 등).
      setCheckups((current) => [...current, result]);
      const body = await fetch(apiUrl("/api/curriculum/scripts"), {
        method: "POST",
        headers: { "Content-Type": "application/json", ...entitlementHeaders(isPremium) },
        body: JSON.stringify({ language, checkup: result }),
      })
        .then((response) => response.json().catch(() => null))
        .catch(() => null) as { checkups?: CheckResult[]; review?: ReviewMap; known?: unknown } | null;
      if (Array.isArray(body?.checkups)) window.dispatchEvent(new CustomEvent(EVENT, { detail: { language, checkups: body.checkups } }));
      if (body?.known) announceKnown(language, body.known);
      return body;
    },
    [language, isPremium],
  );
  return { checkups, known, save };
}
