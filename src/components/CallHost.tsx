"use client";

import { useEffect, useState } from "react";
import { BodyLayer } from "@/components/FullScreenLayer";
import { CallList } from "@/components/CallList";
import { RoleplayOwnLine } from "@/components/RoleplayOwnLine";
import { RoleplayPast } from "@/components/RoleplayPast";
import { RoleplayScreen } from "@/components/RoleplayScreen";
import type { PracticeRequest } from "@/components/NextStepCard";
import { usePremium } from "@/contexts/PremiumContext";
import { onAppIntent, takeAppIntent } from "@/lib/appIntents";
import type { UICopy } from "@/lib/copy";
import type { LearningLanguageCode } from "@/lib/learningLanguages";
import { scenariosForLanguage } from "@/lib/roleplay/catalog";
import { keepCall, readCalls } from "@/lib/roleplay/callStore";
import type { SavedConversation } from "@/lib/roleplay/saved";

/**
 * AI 튜터와의 통화 — 앱 어디서나 떠 있는 층(2026-10-23, `hub/drafts/conversation-unify-2026-10-23.md` 3단계).
 *
 * 예전 통화 탭의 첫 화면(팩·오늘 해볼 것·안내·남은 시간·내 문장 말해보기·지난 대화)을 없애고, 1:1처럼 📞를 누르면 바로 통화.
 * - 시작: `startCall`(AI 튜터 줄·AI 대화 머리의 📞), `practice`(tab roleplay — 오늘의 팩·오늘 해볼 것·지도).
 * - 끝나면 통화는 통화 기록 목록(CallList)에만 남는다 — 채팅과 따로(2026-10-27). `openCall` id 없음 = 목록, id = 돌아보기.
 * - 마이크는 사람이 누른 뒤에만 연다(링크 `?screen=roleplay`는 통화를 열지 않고 AI 대화로).
 */
export function hasRoleplay(targetLanguage: LearningLanguageCode): boolean {
  return scenariosForLanguage(targetLanguage).length > 0;
}

export function CallHost({
  targetLanguage,
  nativeLanguage,
  ui,
  enabled,
  onActiveChange,
}: {
  targetLanguage: LearningLanguageCode;
  nativeLanguage: LearningLanguageCode;
  ui: UICopy;
  /** 통화를 쓸 수 있는지(이 언어에 통화가 있고, 쓸 기능 고르기에서 숨기지 않음). */
  enabled: boolean;
  /** 통화 화면이 떠 있는 동안 true(앱 오프닝 광고를 막는 데 씀). */
  onActiveChange?: (active: boolean) => void;
}) {
  const openTalk = scenariosForLanguage(targetLanguage).find((scenario) => scenario.openEnded)?.id ?? null;
  // 이 층이 붙기 전에 보낸 요청(지도의 "말로" 등)은 붙을 때 한 번 가져간다.
  const [arrived] = useState(() => (enabled ? takeAppIntent("practice", (detail) => detail.tab === "roleplay") : null));
  const [playing, setPlaying] = useState<string | null>(() => (arrived && openTalk ? openTalk : null));
  const [practice, setPractice] = useState<PracticeRequest | null>(arrived);
  const [resuming, setResuming] = useState<SavedConversation | null>(null);
  const [reading, setReading] = useState<SavedConversation | null>(null);
  const [ownLine, setOwnLine] = useState(false);
  const [listing, setListing] = useState(false);
  const { isPremium } = usePremium();

  useEffect(() => {
    onActiveChange?.(Boolean(playing));
  }, [playing, onActiveChange]);

  useEffect(
    () =>
      onAppIntent("practice", (request) => {
        if (request.tab !== "roleplay" || !enabled || !openTalk) return;
        takeAppIntent("practice", (detail) => detail.tab === "roleplay");
        setPractice(request);
        setResuming(null);
        setPlaying(openTalk);
      }),
    [enabled, openTalk],
  );
  useEffect(
    () =>
      onAppIntent("startCall", ({ resumeId }) => {
        if (!enabled || !openTalk) return;
        const carry = resumeId ? (readCalls().find((row) => row.id === resumeId) ?? null) : null;
        setPractice(null);
        setResuming(carry);
        setPlaying(carry?.scenarioId ?? openTalk);
      }),
    [enabled, openTalk],
  );
  useEffect(
    () =>
      onAppIntent("openCall", ({ id }) => {
        if (!id) {
          setListing(true);
          return;
        }
        const row = readCalls().find((call) => call.id === id);
        if (row) setReading(row);
      }),
    [],
  );
  useEffect(() => onAppIntent("sayOwnLine", () => setOwnLine(true)), []);

  return (
    <>
      {/* RoleplayScreen은 스스로 몸(body)에 붙는 층이라 그대로 그린다. */}
      {playing ? (
        <RoleplayScreen
          scenarioId={playing}
          nativeLanguage={nativeLanguage}
          ui={ui}
          resume={resuming}
          onSaved={keepCall}
          practice={practice}
          onClose={() => {
            setPlaying(null);
            setResuming(null);
            setPractice(null);
          }}
        />
      ) : null}
      {listing ? (
        <CallList ui={ui} locale={nativeLanguage} language={targetLanguage} canCall={enabled && Boolean(openTalk)} onClose={() => setListing(false)} />
      ) : null}
      {reading ? (
        <RoleplayPast saved={reading} ui={ui} onClose={() => setReading(null)} nativeLanguage={nativeLanguage} isPremium={isPremium} />
      ) : null}
      {ownLine ? (
        <BodyLayer>
          <div className="fixed inset-0 z-[90] flex items-end justify-center bg-black/70 sm:items-center" role="dialog" aria-modal="true">
            <div className="flex w-full max-w-md justify-center rounded-t-2xl bg-surface px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-4 sm:rounded-2xl">
              <RoleplayOwnLine
                targetLanguage={targetLanguage}
                nativeLanguage={nativeLanguage}
                isPremium={isPremium}
                ui={ui}
                onClose={() => setOwnLine(false)}
              />
            </div>
          </div>
        </BodyLayer>
      ) : null}
    </>
  );
}
