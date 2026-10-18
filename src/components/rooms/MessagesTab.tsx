"use client";

import { useSyncExternalStore } from "react";
import type { UICopy } from "@/lib/copy";
import { AccountCard } from "@/components/account/AccountCard";
import { readCachedAccount, subscribeSession } from "@/lib/account/session";
import { roomCopy } from "@/lib/rooms/copy";
import { requestDm } from "@/lib/rooms/openDm";
import type { DmSummary } from "@/lib/rooms/dm";
import { DmList } from "./RoomDm";

/**
 * 하단 "메시지" 탭(사람과 학습): 1:1 대화 목록. 받은 요청이 위에.
 * 목록은 AppHome이 받아 온 것(탭 바의 안 읽음 수와 같은 것)을 그린다.
 * 대화를 누르면 말하는 방과 같은 대화 화면(openDm.ts → RoomsScreen).
 */
export function MessagesTab({ ui, locale, threads }: { ui: UICopy; locale: string; threads: DmSummary[] }) {
  const t = roomCopy(locale);
  const account = useSyncExternalStore(subscribeSession, readCachedAccount, () => null);
  return (
    <div className="tb-panel flex h-full min-h-0 flex-col overflow-hidden rounded-2xl">
      <header className="flex shrink-0 items-center justify-between gap-2 border-b border-white/10 px-4 py-3">
        <h1 className="text-base font-semibold text-white">{ui.homeTabMessages}</h1>
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        {account ? (
          <DmList t={t} threads={threads} onOpen={requestDm} />
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
