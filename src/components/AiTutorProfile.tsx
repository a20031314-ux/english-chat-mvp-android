"use client";

import { useState } from "react";
import { BodyLayer } from "@/components/FullScreenLayer";
import { sendAppIntent } from "@/lib/appIntents";
import type { UICopy } from "@/lib/copy";
import { chatPartnerForLanguage } from "@/lib/chatPartner";

/**
 * AI 튜터도 사람 중 하나(2026-10-27 사용자 "AI 튜터를 아예 사람들과 통합해줘. 프로필 탭에 가면 AI 튜터가 있고 대화를 걸 수 있는 흐름으로").
 * 사람 탭 목록 맨 위에 사람 카드처럼 한 줄, 누르면 프로필 시트 — 💬 메시지(AI 대화) · 📞 통화 · 통화 기록.
 * 이름·국기는 학습 언어별 튜터(lib/chatPartner.ts — AI 대화 머리와 같은 사람). 로그인 없이도 보인다(AI 기능은 로그인 없이).
 * 소개 글 `aiTutorBio` — 사람이 아니라 AI 튜터임과 할 수 있는 것(사용자가 이 화면에 넣으라고 함, DESIGN.md "안내 글" 예외).
 */
/**
 * AI 튜터 그림(2026-10-27 사용자 "AI 아이콘으로 이미지와 프로필을 만들어 넣어줘. 사람처럼 만들 필요는 없고"):
 * 사람 얼굴 대신 말풍선 + 반짝임. 색은 토큰(info)에서 — currentColor.
 */
export function AiAvatar({ size = 60 }: { size?: number }) {
  return (
    <span
      aria-hidden
      style={{ width: size, height: size }}
      className="flex shrink-0 items-center justify-center rounded-full border border-info/40 bg-info/15 text-info"
    >
      <svg viewBox="0 0 48 48" width={Math.round(size * 0.6)} height={Math.round(size * 0.6)} fill="none" stroke="currentColor" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round">
        {/* 말풍선 */}
        <path d="M9 12.5A5.5 5.5 0 0 1 14.5 7h19A5.5 5.5 0 0 1 39 12.5v13A5.5 5.5 0 0 1 33.5 31H22l-8 7v-7h0.5A5.5 5.5 0 0 1 9 25.5z" />
        {/* 반짝임(큰 별 + 작은 별) */}
        <path d="M23 12.5l1.6 4.2 4.2 1.6-4.2 1.6L23 24.1l-1.6-4.2-4.2-1.6 4.2-1.6z" fill="currentColor" stroke="none" />
        <path d="M31.5 21.5l0.8 2 2 0.8-2 0.8-0.8 2-0.8-2-2-0.8 2-0.8z" fill="currentColor" stroke="none" />
      </svg>
    </span>
  );
}

function TutorName({ targetLanguage, className = "" }: { targetLanguage: string; className?: string }) {
  const partner = chatPartnerForLanguage(targetLanguage);
  return (
    <span className={`flex min-w-0 items-center gap-1.5 ${className}`}>
      <bdi className="truncate">{partner.givenName}</bdi>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`/flags/${partner.flagCountry}.png`} alt="" className="h-3.5 w-5 shrink-0 object-cover" />
    </span>
  );
}

const openChat = () => sendAppIntent("openTab", { tab: "chat" });

/** 사람 탭 목록 맨 위 한 줄(사람 카드와 같은 모양). */
export function AiTutorPerson({ ui, targetLanguage, canCall, messageLabel }: { ui: UICopy; targetLanguage: string; canCall: boolean; messageLabel: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="flex gap-3 border-b border-white/[0.07] pb-3">
        <button type="button" onClick={() => setOpen(true)} className="shrink-0 self-start" aria-label={ui.talkAiTutor}>
          <AiAvatar />
        </button>
        <div className="min-w-0 flex-1">
          <button type="button" onClick={() => setOpen(true)} className="block w-full text-start">
            <TutorName targetLanguage={targetLanguage} className="text-body font-semibold text-white" />
            <span className="mt-1 inline-block rounded-full bg-info/15 px-2 py-0.5 text-meta text-info">{ui.talkAiTutor}</span>
            <p className="mt-1.5 line-clamp-2 text-note leading-relaxed text-slate-300">{ui.aiTutorBio}</p>
          </button>
          <div className="mt-1.5 flex items-center justify-end gap-2">
            {canCall ? (
              <button
                type="button"
                onClick={() => sendAppIntent("startCall", {})}
                aria-label={ui.talkAiCall}
                title={ui.talkAiCall}
                className="rounded-full border border-white/20 px-3 py-1 text-meta text-slate-100"
              >
                📞 {ui.homeTabCall}
              </button>
            ) : null}
            <button type="button" onClick={openChat} className="rounded-full border border-violet-400/50 px-3 py-1 text-meta text-violet-100">
              💬 {messageLabel}
            </button>
          </div>
        </div>
      </div>
      {open ? <AiTutorSheet ui={ui} targetLanguage={targetLanguage} canCall={canCall} messageLabel={messageLabel} onClose={() => setOpen(false)} /> : null}
    </>
  );
}

/** AI 튜터 프로필 시트 — 사람 프로필 시트처럼 아래에서 올라온다. */
export function AiTutorSheet({
  ui,
  targetLanguage,
  canCall,
  messageLabel,
  onClose,
}: {
  ui: UICopy;
  targetLanguage: string;
  canCall: boolean;
  messageLabel: string;
  onClose: () => void;
}) {
  const go = (action: () => void) => () => {
    onClose();
    action();
  };
  return (
    <BodyLayer>
      <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/70 sm:items-center" role="dialog" aria-modal="true" onClick={onClose}>
        <div
          className="w-full max-w-md rounded-t-2xl bg-surface px-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-5 sm:rounded-2xl"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex items-center gap-4">
            <AiAvatar size={72} />
            <div className="min-w-0">
              <TutorName targetLanguage={targetLanguage} className="text-title font-semibold text-white" />
              <span className="mt-1 inline-block rounded-full bg-info/15 px-2 py-0.5 text-meta text-info">{ui.talkAiTutor}</span>
            </div>
            <button type="button" onClick={onClose} aria-label={ui.billingClose} className="ms-auto self-start rounded-full px-2 text-title text-slate-400 hover:text-slate-100">
              ×
            </button>
          </div>
          <p className="mt-4 text-body leading-relaxed text-slate-200">{ui.aiTutorBio}</p>
          <div className="mt-5 grid grid-cols-2 gap-2">
            <button type="button" onClick={go(openChat)} className="rounded-xl bg-violet-500 px-3 py-2.5 text-body font-medium text-white">
              💬 {messageLabel}
            </button>
            {canCall ? (
              <button type="button" onClick={go(() => sendAppIntent("startCall", {}))} className="rounded-xl border border-white/20 px-3 py-2.5 text-body text-slate-100">
                📞 {ui.homeTabCall}
              </button>
            ) : null}
          </div>
          {canCall ? (
            <button
              type="button"
              onClick={go(() => sendAppIntent("openCall", {}))}
              className="mt-2 w-full rounded-xl border border-white/10 px-3 py-2.5 text-body text-slate-300 hover:bg-white/5"
            >
              {ui.callRecordsTitle}
            </button>
          ) : null}
        </div>
      </div>
    </BodyLayer>
  );
}
