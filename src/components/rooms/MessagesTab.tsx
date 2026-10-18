"use client";

import { useState, useSyncExternalStore } from "react";
import type { UICopy } from "@/lib/copy";
import { AccountCard } from "@/components/account/AccountCard";
import { readCachedAccount, subscribeSession } from "@/lib/account/session";
import { roomCopy } from "@/lib/rooms/copy";
import { requestDm } from "@/lib/rooms/openDm";
import type { DmSummary } from "@/lib/rooms/dm";
import type { GroupSummary } from "@/lib/rooms/group";
import { DmList } from "./RoomDm";
import { GroupCreateSheet, GroupList, GroupThreadView } from "./RoomGroups";

/**
 * 하단 "메시지" 탭(사람과 학습): 1:1 대화 목록. 받은 요청이 위에.
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
}: {
  ui: UICopy;
  locale: string;
  targetLanguage: string;
  threads: DmSummary[];
  groups: GroupSummary[];
  onGroupsChanged: () => void;
}) {
  const t = roomCopy(locale);
  const account = useSyncExternalStore(subscribeSession, readCachedAccount, () => null);
  // 단체방: 만들기 시트와 열린 대화.
  const [creating, setCreating] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  return (
    <div className="tb-panel flex h-full min-h-0 flex-col overflow-hidden rounded-2xl">
      <header className="flex shrink-0 items-center justify-between gap-2 border-b border-white/10 px-4 py-3">
        <h1 className="text-base font-semibold text-white">{ui.homeTabMessages}</h1>
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        {account ? (
          <div className="space-y-5">
            <GroupList t={t} locale={locale} groups={groups} onOpen={setOpenGroup} onCreate={() => setCreating(true)} onChanged={onGroupsChanged} />
            <DmList t={t} threads={threads} onOpen={requestDm} />
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-slate-300">{t.loginNeeded}</p>
            <AccountCard ui={ui} locale={locale} />
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
