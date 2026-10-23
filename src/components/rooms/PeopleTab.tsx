"use client";

import { InviteRewardsCard } from "@/components/invite/InviteRewards";
import { GroupTitle, groupIcon } from "./RoomGroups";
import { teamCopy } from "@/lib/rooms/teamCopy";
import type { GroupSummary } from "@/lib/rooms/group";
import { useEffect, useState, useSyncExternalStore } from "react";
import type { UICopy } from "@/lib/copy";
import { AccountCard } from "@/components/account/AccountCard";
import { doorById, doorUrl, isDoorLang, readEntryDoor } from "@/lib/doors";
import { randomStatus } from "@/lib/random/client";
import { readCachedAccount, subscribeSession } from "@/lib/account/session";
import { roomCopy } from "@/lib/rooms/copy";
import { requestDm } from "@/lib/rooms/openDm";
import { PeopleList } from "./RoomPeople";
import { InviteButton } from "@/components/invite/InviteButton";
import { BoardView } from "./BoardView";
import { IconsView } from "./IconPacks";
import { iconCopy } from "@/lib/rooms/iconCopy";

/**
 * 하단 "사람" 탭: 최근에 앱을 쓴 사람들의 프로필 목록(RoomPeople.tsx).
 * 카드에서 팔로우·메시지, 누르면 프로필 시트. 메시지는 말하는 방과 같은 대화 화면(openDm.ts).
 * 로그인해야 보인다 — 안 했으면 My와 같은 계정 카드.
 * 보는 방식(2026-10-19): 사람 / 게시판(BoardView.tsx) / 아이콘(IconPacks.tsx, 2026-10-23), 고른 것은 기기에(`peopleViewMode`).
 */
type PeopleView = "people" | "board" | "icons";
const VIEW_KEY = "peopleViewMode";

function readView(): PeopleView {
  try {
    const saved = localStorage.getItem(VIEW_KEY);
    return saved === "board" || saved === "icons" ? saved : "people";
  } catch {
    return "people";
  }
}

export function PeopleTab({
  ui,
  locale,
  targetLanguage,
  teams = [],
  onOpenGroup,
}: {
  ui: UICopy;
  locale: string;
  targetLanguage: string;
  /** 내 러닝메이트·팀(AppHome의 단체방 목록에서). 누르면 메시지 탭에서 그 워크스페이스. */
  teams?: GroupSummary[];
  onOpenGroup?: (groupId: string) => void;
}) {
  const tt = teamCopy(locale);
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
        {/* 앱이 없는 친구도: 링크 → Play → 로그인·이름 정하고 입장(lib/invite, 팔로우 없음). */}
        {account ? <InviteButton locale={locale} /> : null}
      </header>
      {/* Pingo에서만: 랜덤이 켜져 있으면 랜덤 창구 Spin으로 가는 길(골라서 요청하는 Pingo와 랜덤은 떨어뜨려 둔다). */}
      <SpinLink locale={locale} label={t.randomTitle} />
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        {account ? (
          <>
            <InviteRewardsCard ui={ui} locale={locale} />
            {teams.length && onOpenGroup ? (
              <section className="mb-4">
                <h2 className="mb-2 text-sm font-semibold text-slate-300">🤝 {tt.myTeams}</h2>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {teams.map(({ group, unread }) => (
                    <button
                      key={group.id}
                      type="button"
                      onClick={() => onOpenGroup(group.id)}
                      className="flex shrink-0 items-center gap-2 rounded-xl border border-violet-300/30 bg-violet-500/10 px-3 py-2 text-start"
                    >
                      <span aria-hidden>{groupIcon(group)}</span>
                      <span className="max-w-[9rem] truncate text-note text-ink" dir="auto">
                        <GroupTitle group={group} me={account.id} />
                      </span>
                      {unread > 0 ? <span className="rounded-full bg-violet-500 px-1.5 text-meta text-white">{Math.min(unread, 99)}</span> : null}
                    </button>
                  ))}
                </div>
              </section>
            ) : null}
            <div className="mb-3 flex gap-1" role="group">
              {(["people", "board", "icons"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  aria-pressed={view === mode}
                  onClick={() => choose(mode)}
                  className={`rounded-lg px-3 py-1.5 text-note ${view === mode ? "bg-white/15 text-ink" : "text-slate-400 hover:bg-white/10"}`}
                >
                  {mode === "people" ? t.peopleViewList : mode === "board" ? t.boardTab : iconCopy(locale).tab}
                </button>
              ))}
            </div>
            {view === "board" ? (
              <BoardView t={t} locale={locale} targetLanguage={targetLanguage} />
            ) : view === "icons" ? (
              <IconsView locale={locale} targetLanguage={targetLanguage} />
            ) : (
              <PeopleList t={t} locale={locale} targetLanguage={targetLanguage} onMessage={requestDm} />
            )}
          </>
        ) : (
          <div className="space-y-3">
            <AccountCard ui={ui} locale={locale} />
          </div>
        )}
      </div>
    </div>
  );
}

function SpinLink({ locale, label }: { locale: string; label: string }) {
  const [href, setHref] = useState<string | null>(null);
  useEffect(() => {
    if (readEntryDoor()?.id !== "random-chat") return;
    const spin = doorById("random-meet");
    if (!spin) return;
    let alive = true;
    void randomStatus()
      .then((status) => {
        if (alive && status.state !== "off") setHref(doorUrl(spin, isDoorLang(locale) ? locale : spin.defaultLang));
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [locale]);
  if (!href) return null;
  return (
    <a href={href} className="mx-4 mt-3 block shrink-0 rounded-xl border border-violet-300/30 bg-violet-500/10 px-3 py-2 text-note text-ink">
      🎲 {label} · 🔞 →
    </a>
  );
}
