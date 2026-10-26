"use client";

import type { UICopy } from "@/lib/copy";
import { chatPartnerForLanguage } from "@/lib/chatPartner";
import { AiAvatar } from "@/components/AiTutorProfile";

/**
 * 대화 목록 맨 위의 AI 튜터(2026-10-20, `hub/drafts/one-list-tabs.md`).
 * 2026-10-27 사용자 "AI 튜터를 아예 사람들과 통합": 사람 탭에 프로필(AiTutorProfile)이 있고, 대화 목록에는 다른 대화처럼
 * 그 사람(이름·국기)과의 대화 한 줄 — 줄을 누르면 채팅, 📞는 바로 통화. 통화 기록은 프로필 시트·AI 대화 ⋮(CallList, 채팅과 따로).
 */
export function AiTutorRow({
  ui,
  targetLanguage,
  canCall,
  onChat,
  onCall,
}: {
  ui: UICopy;
  targetLanguage: string;
  /** 이 학습 언어에 통화가 있는지. 없으면 📞를 두지 않는다. */
  canCall: boolean;
  onChat: () => void;
  onCall: () => void;
}) {
  const partner = chatPartnerForLanguage(targetLanguage);
  return (
    <div className="flex items-center gap-2 rounded-xl border border-line bg-surface p-2">
      <button type="button" onClick={onChat} className="flex min-w-0 flex-1 items-center gap-3 rounded-lg p-1 text-start hover:bg-white/5">
        <AiAvatar size={44} />
        <span className="min-w-0">
          <span className="flex items-center gap-1.5 text-body font-semibold text-ink">
            <bdi className="truncate">{partner.givenName}</bdi>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/flags/${partner.flagCountry}.png`} alt="" className="h-3.5 w-5 shrink-0 object-cover" />
          </span>
          <span className="block truncate text-meta text-info">{ui.talkAiTutor}</span>
        </span>
      </button>
      {canCall ? (
        <button
          type="button"
          onClick={onCall}
          aria-label={ui.talkAiCall}
          title={ui.talkAiCall}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line text-title hover:bg-white/10"
        >
          <span aria-hidden>📞</span>
        </button>
      ) : null}
    </div>
  );
}
