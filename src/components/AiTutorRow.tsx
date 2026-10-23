"use client";

import type { UICopy } from "@/lib/copy";

/**
 * 대화 목록 맨 위의 AI 튜터(2026-10-20, `hub/drafts/one-list-tabs.md`).
 * AI 튜터도 대화 상대 중 하나로 보이되 늘 맨 위에 있다. 줄을 누르면 채팅,
 * 📞를 누르면 통화 — 사람과의 1:1 대화에서 📞로 통화하는 것과 같은 자리.
 */
export function AiTutorRow({
  ui,
  canCall,
  onChat,
  onCall,
}: {
  ui: UICopy;
  /** 이 학습 언어에 통화가 있는지. 없으면 📞를 두지 않는다. */
  canCall: boolean;
  onChat: () => void;
  onCall: () => void;
}) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-line bg-surface p-2">
      <button type="button" onClick={onChat} className="flex min-w-0 flex-1 items-center gap-3 rounded-lg p-1 text-start hover:bg-white/5">
        <span
          aria-hidden
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-info/40 bg-info/15 text-caption font-semibold text-info"
        >
          AI
        </span>
        <span className="min-w-0">
          <span className="block truncate text-body font-semibold text-ink">{ui.talkAiTutor}</span>
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
