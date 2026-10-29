"use client";

import { useCallback, useEffect, useState } from "react";
import { usePremium } from "@/contexts/PremiumContext";
import { apiUrl } from "@/lib/apiBase";
import { entitlementHeaders } from "@/lib/billing/billingService";
import type { CheckResult } from "@/lib/curriculum/checkup";
import type { ReviewMap } from "@/lib/curriculum/dailyPlan";

const EVENT = "lb-checkups";

/**
 * 시험 결과(이번 주 확인·처음 시험·단계 시험 — 서버 stageScripts:v1 checkups, 최근 12번)를 읽고 남긴다.
 * 오늘 할 것(TodayPlan)과 단계 보기(NotebookSection "다음 단계로")가 같이 쓰므로, 남기면 같은 언어의 다른 화면도 새로 받는다.
 */
export function useCheckups(language: string): {
  checkups: CheckResult[];
  save: (result: CheckResult) => Promise<{ review?: ReviewMap } | null>;
} {
  const { isPremium } = usePremium();
  const [checkups, setCheckups] = useState<CheckResult[]>([]);
  useEffect(() => {
    let alive = true;
    void fetch(apiUrl(`/api/curriculum/scripts?lang=${encodeURIComponent(language)}&checkups=1`), { headers: entitlementHeaders(isPremium) })
      .then((response) => (response.ok ? response.json() : null))
      .then((body: { checkups?: CheckResult[] } | null) => {
        if (alive && Array.isArray(body?.checkups)) setCheckups(body.checkups);
      })
      .catch(() => undefined);
    const on = (event: Event) => {
      const detail = (event as CustomEvent<{ language: string; checkups: CheckResult[] }>).detail;
      if (detail?.language === language) setCheckups(detail.checkups);
    };
    window.addEventListener(EVENT, on);
    return () => {
      alive = false;
      window.removeEventListener(EVENT, on);
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
        .catch(() => null) as { checkups?: CheckResult[]; review?: ReviewMap } | null;
      if (Array.isArray(body?.checkups)) window.dispatchEvent(new CustomEvent(EVENT, { detail: { language, checkups: body.checkups } }));
      return body;
    },
    [language, isPremium],
  );
  return { checkups, save };
}
