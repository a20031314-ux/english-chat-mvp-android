"use client";

import { useEffect } from "react";
import type { ConversationSession } from "@/components/ArchivePanel";
import type { Locale, UICopy } from "@/lib/copy";
import { formatShortDate } from "@/lib/dateLabels";

type ChatHistoryPanelProps = {
  isOpen: boolean;
  sessions: ConversationSession[];
  currentSessionId: string;
  locale: Locale;
  ui: UICopy;
  onClose: () => void;
  onOpenSession: (session: ConversationSession) => void;
  onDeleteSession: (id: string) => void;
  onClearSessions: () => void;
  onStartNewChat: () => void;
};

export function ChatHistoryPanel({
  isOpen,
  sessions,
  currentSessionId,
  locale,
  ui,
  onClose,
  onOpenSession,
  onDeleteSession,
  onClearSessions,
  onStartNewChat,
}: ChatHistoryPanelProps) {
  useEffect(() => {
    if (!isOpen || typeof document === "undefined") {
      return;
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Close chat history"
        onClick={onClose}
        className="absolute inset-0 bg-black/50"
      />
      <aside
        className="absolute right-0 top-0 flex h-full w-[88%] max-w-sm flex-col border-l border-white/10 bg-[#0a0a0a] shadow-2xl"
      >
        <header className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <h2 className="text-base font-semibold text-white">
            {ui.chatHistoryTitle}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-white/15 px-2 py-1 text-xs text-slate-200 hover:bg-white/10"
          >
            {ui.closeArchive}
          </button>
        </header>

        <div className="border-b border-white/10 px-4 py-3">
          <button
            type="button"
            onClick={() => {
              onStartNewChat();
              onClose();
            }}
            className="w-full rounded-xl bg-[#e8e8e4] px-3 py-2.5 text-sm font-medium text-neutral-900 shadow-[0_0_14px_rgba(255,255,255,0.28)] hover:bg-[#f5f5f3]"
          >
            {ui.chatHistoryNew}
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-200">
              {ui.chatHistoryListTitle}
            </p>
            {sessions.length > 0 ? (
              <button
                type="button"
                onClick={onClearSessions}
                className="rounded-md border border-rose-400/30 bg-rose-500/15 px-2 py-1 text-[11px] text-rose-200 hover:bg-rose-500/25"
              >
                {ui.chatHistoryClear}
              </button>
            ) : null}
          </div>

          {sessions.length === 0 ? (
            <p className="rounded-lg border border-dashed border-white/15 p-3 text-xs leading-relaxed text-slate-300">
              {ui.chatHistoryEmpty}
            </p>
          ) : (
            <div className="space-y-2">
              {sessions.map((session) => {
                const isCurrent = session.id === currentSessionId;
                return (
                  <article
                    key={session.id}
                    className={`rounded-lg border p-3 text-xs ${
                      isCurrent
                        ? "border-white/30 bg-white/10"
                        : "border-white/10 bg-[#121212]"
                    }`}
                  >
                    <p className="font-medium leading-snug text-slate-100">
                      {session.title}
                    </p>
                    <p className="mt-1.5 text-slate-500">
                      {formatShortDate(
                        session.endedAt ?? session.createdAt,
                        locale,
                      )}
                      {" · "}
                      {ui.reportTurnCount.replace(
                        "{count}",
                        String(session.messageCount),
                      )}
                      {isCurrent ? ` · ${ui.chatHistoryCurrent}` : ""}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => onOpenSession(session)}
                        className="rounded-md border border-white/15 bg-[#121212] px-2 py-1 text-[11px] text-slate-200 hover:bg-white/10"
                      >
                        {ui.chatHistoryContinue}
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteSession(session.id)}
                        disabled={isCurrent}
                        className="rounded-md border border-white/15 bg-[#121212] px-2 py-1 text-[11px] text-slate-200 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        {ui.delete}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
