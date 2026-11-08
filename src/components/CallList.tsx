"use client";

import { useState, useSyncExternalStore } from "react";
import { FullScreenLayer } from "@/components/FullScreenLayer";
import { sendAppIntent } from "@/lib/appIntents";
import type { UICopy } from "@/lib/copy";
import { discardCall, readCalls, readCallsOnServer, subscribeCalls } from "@/lib/roleplay/callStore";
import { isUnfinished, type SavedConversation } from "@/lib/roleplay/saved";

/**
 * AI 통화 기록 — 채팅(메시지)과 따로(2026-10-27 사용자 "통화 기능과 메시지 기능은 분리해줘. 한 탭에 넣더라도 기록이 따로 남도록").
 * 예전엔 AI 대화 안에 🗒 카드로 섞여 있었다. 목록은 AI 튜터 프로필에서 연다. 사람 탭이 없을 때만 채팅 ⋮.
 * 위 칩 [자유대화 | 수업]으로 기록을 나눠 봄(2026-11-07, 📞는 지금 칩의 통화로). 새 통화(📞)·이어서 하기·돌아보기·지우기. 기록은 예전처럼 이 폰에만(callStore → saved.ts, 최근 20개).
 */
export function CallList({
  ui,
  locale,
  language,
  canCall,
  onClose,
}: {
  ui: UICopy;
  locale: string;
  /** 이 학습 언어의 통화만. */
  language: string;
  canCall: boolean;
  onClose: () => void;
}) {
  const all = useSyncExternalStore(subscribeCalls, readCalls, readCallsOnServer).filter((call) => call.language === language);
  // 자유대화 / 수업 기록을 따로(2026-11-07 사용자 "통화기록도 구분해서"). mode 없는 예전 기록은 자유대화.
  // 게임 통화도 따로(2026-11-08 사용자 "자유대화, 수업, 게임으로 나눠줘").
  const [kind, setKind] = useState<"talk" | "lesson" | "game">("talk");
  const kindOf = (call: { mode?: string }): "talk" | "lesson" | "game" => (call.mode === "lesson" ? "lesson" : call.mode === "game" ? "game" : "talk");
  const counts = { talk: 0, lesson: 0, game: 0 };
  for (const call of all) counts[kindOf(call)] += 1;
  const calls = all.filter((call) => kindOf(call) === kind);
  // 게임 칸의 📞는 마지막에 한 게임으로.
  const lastGame = all.find((call) => call.mode === "game")?.game ?? "twenty";
  return (
    <FullScreenLayer>
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
        <h2 className="min-w-0 truncate text-sm font-semibold text-white">{ui.callRecordsTitle}</h2>
        <div className="flex shrink-0 items-center gap-2">
          {canCall ? (
            <button
              type="button"
              onClick={() => {
                onClose();
                sendAppIntent("startCall", kind === "lesson" ? { lesson: true } : kind === "game" ? { game: lastGame } : {});
              }}
              aria-label={ui.talkAiCall}
              title={ui.talkAiCall}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-title hover:bg-white/10"
            >
              <span aria-hidden>📞</span>
            </button>
          ) : null}
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-white/15 px-3 py-1.5 text-meta text-slate-300 hover:bg-white/10"
          >
            {ui.billingClose}
          </button>
        </div>
      </header>
      <div role="tablist" className="flex shrink-0 gap-2 px-3 pt-3" data-call-kinds>
        {(["talk", "lesson", "game"] as const).map((one) => (
          <button
            key={one}
            type="button"
            role="tab"
            aria-selected={kind === one}
            data-call-kind={one}
            onClick={() => setKind(one)}
            className={`rounded-full border px-3 py-1 text-meta ${kind === one ? "border-white/50 bg-white/15 text-white" : "border-white/15 text-slate-400"}`}
          >
            {one === "talk" ? ui.callModeTalk : one === "lesson" ? ui.callModeStudy : ui.callModeGame} <span className="tabular-nums opacity-70">{counts[one]}</span>
          </button>
        ))}
      </div>
      <ol className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3">
        {calls.map((call) => (
          <CallRow key={call.id} call={call} ui={ui} locale={locale} onLeave={onClose} />
        ))}
      </ol>
    </FullScreenLayer>
  );
}

function CallRow({ call, ui, locale, onLeave }: { call: SavedConversation; ui: UICopy; locale: string; onLeave: () => void }) {
  const unfinished = isUnfinished(call);
  const when = new Date(call.updatedAt).toLocaleString(locale, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  return (
    <li className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-slate-200">
      <span className="min-w-0 flex-1">
        <bdi dir="auto" className="block truncate text-slate-100">{call.title}</bdi>
        <span className="block text-meta text-slate-500">{when}</span>
      </span>
      {unfinished ? (
        <button
          type="button"
          onClick={() => {
            onLeave();
            sendAppIntent("startCall", { resumeId: call.id });
          }}
          className="shrink-0 rounded-lg bg-emerald-500 px-2.5 py-1 text-xs font-medium text-black"
        >
          {ui.roleplayResume}
        </button>
      ) : null}
      <button
        type="button"
        onClick={() => sendAppIntent("openCall", { id: call.id })}
        className="shrink-0 rounded-lg border border-white/15 px-2.5 py-1 text-xs text-slate-200 hover:bg-white/10"
      >
        {ui.packSeeRetro}
      </button>
      <button
        type="button"
        onClick={() => discardCall(call.id)}
        aria-label={ui.delete}
        title={ui.delete}
        className="-me-1 shrink-0 rounded-full px-1.5 text-title leading-none text-slate-500 hover:bg-white/10 hover:text-slate-200"
      >
        ×
      </button>
    </li>
  );
}
