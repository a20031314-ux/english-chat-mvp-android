"use client";

import { TabTitle } from "@/components/TabIcons";
import { saveLettersFirst } from "@/lib/curriculum/lettersFirst";
import { useEffect, useState } from "react";
import { usePremium } from "@/contexts/PremiumContext";
import { apiUrl } from "@/lib/apiBase";
import { entitlementHeaders } from "@/lib/billing/billingService";
import type { UICopy } from "@/lib/copy";
import { fetchStudyMap } from "@/lib/studyMapClient";
import { NotebookSection } from "@/components/notes/NotebookSection";
import { FirstCheck } from "@/components/studyMap/FirstCheck";
import { startStageOf } from "@/lib/curriculum/firstCheck";
import { AccountCard } from "@/components/account/AccountCard";
import { TodayCards } from "@/components/studyMap/TodayCards";
import { saveFillCheck } from "@/lib/curriculum/fillCheck";

type StageRef = { id: string; order: number };

/**
 * My 탭: 계정 카드 → 칸 셋 [Logbank · Quizbank · Languagebank](NotebookSection).
 * 학습 언어로 처음 열면(서버에 단계가 없음) 첫 측정(FirstCheck) → 결과 단계를 서버에(POST /api/learner/self-check), 건너뛰면 1단계.
 * 옛 지도 기록(api/curriculum)이 있는 사람도 시작한 것으로 본다.
 */
export function StudyMapTab({ ui, locale, targetLanguage }: { ui: UICopy; locale: string; targetLanguage: string }) {
  const { isPremium } = usePremium();
  const [hasMap, setHasMap] = useState<boolean | null>(null);
  const [chosenStage, setChosenStage] = useState<string | null | undefined>(undefined);
  const [stages, setStages] = useState<StageRef[] | null>(null);
  const [saving, setSaving] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void fetchStudyMap(targetLanguage, isPremium).then((result) => {
      if (!cancelled) setHasMap(result.ok && Boolean(result.record.map));
    });
    void fetch(apiUrl(`/api/learner/self-check?lang=${encodeURIComponent(targetLanguage)}`), { headers: entitlementHeaders(isPremium) })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { selfCheck?: { stage?: string } | null } | null) => {
        if (!cancelled) setChosenStage(data?.selfCheck?.stage ?? null);
      })
      .catch(() => {
        if (!cancelled) setChosenStage(null);
      });
    void fetch(apiUrl(`/api/curriculum/stages?lang=${encodeURIComponent(targetLanguage)}&ui=${encodeURIComponent(locale)}`), { headers: entitlementHeaders(isPremium) })
      .then((response) => (response.ok ? response.json() : null))
      .then((body: { stages?: StageRef[] | null } | null) => {
        if (!cancelled) setStages(body?.stages ?? []);
      })
      .catch(() => {
        if (!cancelled) setStages([]);
      });
    return () => {
      cancelled = true;
    };
  }, [targetLanguage, locale, isPremium]);

  const loading = hasMap === null || chosenStage === undefined || stages === null;
  const started = Boolean(hasMap || chosenStage);
  const idOf = (order: number) => {
    const sorted = [...(stages ?? [])].sort((a, b) => a.order - b.order);
    return (sorted.find((entry) => entry.order === order) ?? sorted[0])?.id ?? null;
  };
  const start = async (order: number) => {
    const id = idOf(order);
    if (!id || saving) return;
    setSaving(true);
    setFailed(false);
    const ok = await fetch(apiUrl("/api/learner/self-check"), {
      method: "POST",
      headers: { "Content-Type": "application/json", ...entitlementHeaders(isPremium) },
      body: JSON.stringify({ language: targetLanguage, stage: id }),
    })
      .then((response) => response.ok)
      .catch(() => false);
    setSaving(false);
    if (ok) setChosenStage(id);
    else setFailed(true);
  };

  return (
    <div className="tb-panel flex h-full min-h-0 flex-col overflow-hidden rounded-2xl">
      <header className="flex shrink-0 items-center justify-between gap-2 border-b border-white/10 px-4 py-3">
        <TabTitle tab="map" label={ui.homeTabProfile} />
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        {/* 프로필 = 계정 카드 + 오늘의 학습(할 것 — 퀴즈·숙제·수업·실력 확인). 기록은 아래 Logbank(사용자 2026-11-10). */}
        <div className="mx-auto mb-4 flex max-w-2xl flex-col gap-3">
          <AccountCard ui={ui} locale={locale} />
          {!loading && started ? <TodayCards ui={ui} language={targetLanguage} locale={locale} /> : null}
        </div>
        {loading ? (
          <p className="text-sm text-slate-400">{ui.mapLoading}</p>
        ) : started ? (
          <div className="mx-auto max-w-2xl">
            <NotebookSection ui={ui} locale={locale} language={targetLanguage} isPremium={isPremium} />
          </div>
        ) : (
          <div className="mx-auto flex max-w-md flex-col gap-4">
            <FirstCheck
              ui={ui}
              locale={locale}
              language={targetLanguage}
              onSkip={() => void start(1)}
              onDone={(result) => {
                if (result.letters) {
                  saveLettersFirst(targetLanguage, true);
                  saveFillCheck(targetLanguage, "letters");
                }
                void start(startStageOf(result));
              }}
            />
            {failed ? <p className="text-sm text-rose-300">{ui.mapFailed}</p> : null}
          </div>
        )}
      </div>
    </div>
  );
}
