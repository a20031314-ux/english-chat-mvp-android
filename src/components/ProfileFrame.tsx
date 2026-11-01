"use client";

import type { ReactNode } from "react";
import { BodyLayer } from "@/components/FullScreenLayer";

/**
 * 프로필 시트 틀 하나(사용자 2026-11-02 "사용자랑 튜터의 프로필 구조가 달라, 통일해줘"):
 * 사람 프로필(rooms/RoomParts ProfileSheet)과 AI 튜터 프로필(AiTutorProfile AiTutorSheet)이 같은 자리·크기로 —
 * 얼굴 64 · 이름 줄(이름 + 국기 등) · 그 아래 한 줄(가입 달 / AI 튜터 칩) · 오른쪽 위 "닫기" · 자기소개 · 아래 버튼(children).
 */
export function ProfileFrame({
  layer = 90,
  label,
  face,
  name,
  sub,
  bio,
  closeLabel,
  onClose,
  children,
}: {
  /** 층(z) — 1:1·단체방 위에서 열면 97 등. */
  layer?: number;
  label: string;
  face: ReactNode;
  name: ReactNode;
  sub?: ReactNode;
  /** 자기소개 칸(글 + 번역 줄 등). */
  bio?: ReactNode;
  closeLabel: string;
  onClose: () => void;
  children?: ReactNode;
}) {
  return (
    <BodyLayer>
      <div className="fixed inset-0 flex items-end justify-center bg-black/60 p-3 sm:items-center" style={{ zIndex: layer }} onClick={onClose}>
        <div
          role="dialog"
          aria-modal="true"
          aria-label={label}
          data-profile-sheet
          className="max-h-[calc(100dvh-1.5rem)] w-full max-w-md overflow-y-auto rounded-2xl border border-line bg-surface-sunk p-4 shadow-2xl"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex items-start gap-3">
            <span className="relative shrink-0">{face}</span>
            <div className="min-w-0 flex-1">
              <div className="min-w-0 text-title font-semibold text-white" dir="auto">
                {name}
              </div>
              {sub ? <div className="mt-0.5">{sub}</div> : null}
            </div>
            <button type="button" onClick={onClose} className="rounded-lg px-2 py-1 text-body text-slate-400 hover:bg-white/10">
              {closeLabel}
            </button>
          </div>
          {bio ? <div className="mt-3">{bio}</div> : null}
          {children}
        </div>
      </div>
    </BodyLayer>
  );
}

/** 프로필 아래 줄 버튼(메시지·통화·통화 기록 — 가로 꽉 찬 테두리 버튼, 두 시트가 같게). */
export const PROFILE_WIDE_BUTTON = "mt-2 w-full rounded-xl border border-line px-3 py-2.5 text-body font-medium text-slate-100 hover:bg-white/5";
