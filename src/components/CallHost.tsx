"use client";

import { useEffect, useState } from "react";
import { CallList } from "@/components/CallList";
import { RoleplayPast } from "@/components/RoleplayPast";
import { RoleplayScreen } from "@/components/RoleplayScreen";
import { usePremium } from "@/contexts/PremiumContext";
import { onAppIntent } from "@/lib/appIntents";
import type { UICopy } from "@/lib/copy";
import type { LearningLanguageCode } from "@/lib/learningLanguages";
import { scenariosForLanguage } from "@/lib/roleplay/catalog";
import { keepCall, readCalls } from "@/lib/roleplay/callStore";
import type { SavedConversation } from "@/lib/roleplay/saved";

/**
 * AI 튜터와의 통화 — 앱 어디서나 떠 있는 층(2026-10-23, `hub/work/drafts/conversation-unify-2026-10-23.md` 3단계).
 *
 * 예전 통화 탭의 첫 화면(팩·오늘 해볼 것·안내·남은 시간·내 문장 말해보기·지난 대화)을 없애고, 1:1처럼 📞를 누르면 바로 통화.
 * - 시작: `startCall`(AI 튜터 줄·튜터 프로필·AI 대화 머리의 📞 — 통화는 하나, 2026-11-19).
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
  const [playing, setPlaying] = useState<string | null>(null);
  const [resuming, setResuming] = useState<SavedConversation | null>(null);
  const [reading, setReading] = useState<SavedConversation | null>(null);
  const [replayOpen, setReplayOpen] = useState(false);
  const [listing, setListing] = useState(false);
  const { isPremium } = usePremium();

  useEffect(() => {
    onActiveChange?.(Boolean(playing));
  }, [playing, onActiveChange]);

  useEffect(
    () =>
      onAppIntent("startCall", ({ resumeId }) => {
        if (!enabled || !openTalk) return;
        const carry = resumeId ? (readCalls().find((row) => row.id === resumeId) ?? null) : null;
        setResuming(carry);
        setPlaying(carry?.scenarioId ?? openTalk);
      }),
    [enabled, openTalk],
  );
  useEffect(
    () =>
      onAppIntent("openCall", ({ id, replay }) => {
        if (!id) {
          setListing(true);
          return;
        }
        const row = readCalls().find((call) => call.id === id);
        if (row) {
          setReplayOpen(Boolean(replay));
          setReading(row);
        }
      }),
    [],
  );

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
          onClose={() => {
            setPlaying(null);
            setResuming(null);
          }}
        />
      ) : null}
      {listing ? (
        <CallList ui={ui} locale={nativeLanguage} language={targetLanguage} canCall={enabled && Boolean(openTalk)} onClose={() => setListing(false)} />
      ) : null}
      {reading ? (
        <RoleplayPast
          saved={reading}
          openReplay={replayOpen}
          ui={ui}
          onClose={() => setReading(null)}
          onLeave={() => {
            setReading(null);
            setListing(false);
          }}
          nativeLanguage={nativeLanguage}
          isPremium={isPremium}
        />
      ) : null}
    </>
  );
}
