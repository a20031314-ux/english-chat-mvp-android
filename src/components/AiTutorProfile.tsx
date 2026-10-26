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
 */
export function AiAvatar({ size = 60 }: { size?: number }) {
  return (
    <span
      aria-hidden
      style={{ width: size, height: size }}
      className="flex shrink-0 items-center justify-center rounded-full border border-info/40 bg-info/15 text-caption font-semibold text-info"
    >
      AI
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
