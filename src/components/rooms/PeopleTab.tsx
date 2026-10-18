"use client";

import { useState, useSyncExternalStore } from "react";
import type { UICopy } from "@/lib/copy";
import { AccountCard } from "@/components/account/AccountCard";
import { readCachedAccount, subscribeSession } from "@/lib/account/session";
import { roomCopy } from "@/lib/rooms/copy";
import { requestDm } from "@/lib/rooms/openDm";
import { PeopleList } from "./RoomPeople";
import { InviteButton } from "@/components/invite/InviteButton";
import { BoardView } from "./BoardView";

/**
 * 하단 "사람" 탭: 최근에 앱을 쓴 사람들의 프로필 목록(RoomPeople.tsx).
 * 카드에서 팔로우·메시지, 누르면 프로필 시트. 메시지는 말하는 방과 같은 대화 화면(openDm.ts).
 * 로그인해야 보인다 — 안 했으면 My와 같은 계정 카드.
 * 보는 방식(2026-10-19): 사람 / 게시판(BoardView.tsx), 고른 것은 기기에(`peopleViewMode`).
 */
type PeopleView = "people" | "board";
const VIEW_KEY = "peopleViewMode";

function readView(): PeopleView {
  try {
    return localStorage.getItem(VIEW_KEY) === "board" ? "board" : "people";
  } catch {
    return "people";
  }
}

export function PeopleTab({ ui, locale, targetLanguage }: { ui: UICopy; locale: string; targetLanguage: string }) {
  const t = roomCopy(locale);
  const account = useSyncExternalStore(subscribeSession, readCachedAccount, () => null);
  const [view, setView] = useState<PeopleView>(readView);
  const choose = (next: PeopleView) => {
    setView(next);
    try {
      localStorage.setItem(VIEW_KEY, next);
    } catch {
      // Kept for this session only.
    }
  };
  return (
    <div className="tb-panel flex h-full min-h-0 flex-col overflow-hidden rounded-2xl">
      <header className="flex shrink-0 items-center justify-between gap-2 border-b border-white/10 px-4 py-3">
        <h1 className="text-base font-semibold text-white">{ui.homeTabPeople}</h1>
        {/* 앱이 없는 친구도: 링크 → Play → 첫 실행에 서로 팔로우(lib/invite). */}
        {account ? <InviteButton locale={locale} /> : null}
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        {account ? (
          <>
            <div className="mb-3 flex gap-1" role="group">
              {(["people", "board"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  aria-pressed={view === mode}
                  onClick={() => choose(mode)}
                  className={`rounded-lg px-3 py-1.5 text-note ${view === mode ? "bg-white/15 text-ink" : "text-slate-400 hover:bg-white/10"}`}
                >
                  {mode === "people" ? t.peopleViewList : t.boardTab}
                </button>
              ))}
            </div>
            {view === "board" ? (
              <BoardView t={t} locale={locale} targetLanguage={targetLanguage} />
            ) : (
              <PeopleList t={t} locale={locale} targetLanguage={targetLanguage} onMessage={requestDm} />
            )}
          </>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-slate-300">{t.loginNeeded}</p>
            <AccountCard ui={ui} locale={locale} />
          </div>
        )}
      </div>
    </div>
  );
}
