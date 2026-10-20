"use client";

import { useEffect, useState, useSyncExternalStore, type ReactNode } from "react";
import type { UICopy } from "@/lib/copy";
import { AccountCard } from "@/components/account/AccountCard";
import { readCachedAccount, subscribeSession } from "@/lib/account/session";
import { roomCopy } from "@/lib/rooms/copy";
import { onGroupRequest, requestDm } from "@/lib/rooms/openDm";
import type { DmSummary } from "@/lib/rooms/dm";
import type { GroupSummary } from "@/lib/rooms/group";
import { DmList } from "./RoomDm";
import { GroupCreateSheet, GroupList, GroupThreadView } from "./RoomGroups";
import { NativeAdSlot } from "@/components/NativeAdSlot";

/**
 * 하단 "대화" 탭(2026-10-20): 맨 위에 AI 튜터(`top`, AppHome), 그 아래 단체방·1:1 대화 목록. 받은 요청이 위에.
 * 로그인 전에는 AI 튜터 아래에 계정 카드 — AI 튜터는 로그인 없이 쓴다.
 * 목록은 AppHome이 받아 온 것(탭 바의 안 읽음 수와 같은 것)을 그린다.
 * 대화를 누르면 말하는 방과 같은 대화 화면(openDm.ts → RoomsScreen).
 */
export function MessagesTab({
  ui,
  locale,
  targetLanguage,
  threads,
  groups,
  onGroupsChanged,
  title,
  top,
}: {
  ui: UICopy;
  locale: string;
  targetLanguage: string;
  threads: DmSummary[];
  groups: GroupSummary[];
  onGroupsChanged: () => void;
  /** 머리 제목(없으면 "메시지"). */
  title?: string;
  /** 목록 맨 위에 늘 보이는 줄(AI 튜터). */
  top?: ReactNode;
}) {
  const t = roomCopy(locale);
  const account = useSyncExternalStore(subscribeSession, readCachedAccount, () => null);
  // 단체방: 만들기 시트와 열린 대화.
  const [creating, setCreating] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  // 단체방 통화에서 나오면 그 단체방으로 돌아온다(RoomsScreen → requestGroup).
  useEffect(() => onGroupRequest(setOpenGroup), []);
  return (
    <div className="tb-panel flex h-full min-h-0 flex-col overflow-hidden rounded-2xl">
      <header className="flex shrink-0 items-center justify-between gap-2 border-b border-white/10 px-4 py-3">
        <h1 className="text-base font-semibold text-white">{title ?? ui.homeTabMessages}</h1>
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        {top ? <div className="mb-5">{top}</div> : null}
        {account ? (
          <div className="space-y-5">
            <GroupList t={t} me={account.id} locale={locale} groups={groups} onOpen={setOpenGroup} onCreate={() => setCreating(true)} onChanged={onGroupsChanged} />
            {/* 목록 사이 네이티브 광고(무료·안드로이드만). 단체방 대화가 열리면 시트가 덮으므로 광고는 멈춘다. */}
            <NativeAdSlot feedId="talk-list" slotKey="talk-between-lists" active={!openGroup && !creating} />
            <DmList t={t} threads={threads} onOpen={requestDm} />
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-slate-300">{t.loginNeeded}</p>
            <AccountCard ui={ui} locale={locale} />
            <NativeAdSlot feedId="talk-list" slotKey="talk-after-account" />
          </div>
        )}
      </div>
      {account && creating ? (
        <GroupCreateSheet
          t={t}
          locale={locale}
          targetLanguage={targetLanguage}
          me={account.id}
          onClose={() => setCreating(false)}
          onCreated={(groupId) => {
            setCreating(false);
            onGroupsChanged();
            setOpenGroup(groupId);
          }}
        />
      ) : null}
      {account && openGroup ? (
        <GroupThreadView
          key={openGroup}
          t={t}
          me={account.id}
          groupId={openGroup}
          locale={locale}
          targetLanguage={targetLanguage}
          onClose={() => {
            setOpenGroup(null);
            onGroupsChanged();
          }}
        />
      ) : null}
    </div>
  );
}
