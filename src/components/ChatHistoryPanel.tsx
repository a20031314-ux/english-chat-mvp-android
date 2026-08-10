"use client";

import { useEffect } from "react";
import type { ConversationSession } from "@/components/ArchivePanel";
import type { Locale, UICopy } from "@/lib/copy";
import { formatReportDate } from "@/lib/sessionReports";

type ChatHistoryPanelProps = {
  isOpen: boolean;
  sessions: ConversationSession[];
  currentSessionId: string;
  reportedSessionIds: Set<string>;
  locale: Locale;
  ui: UICopy;
  onClose: () => void;
  onOpenSession: (session: ConversationSession) => void;
  onCreateReport: (session: ConversationSession) => void;
  onDeleteSession: (id: string) => void;
  onClearSessions: () => void;
  onStartNewChat: () => void;
};

export function ChatHistoryPanel({
  isOpen,
  sessions,
  currentSessionId,
  reportedSessionIds,
  locale,
  ui,
  onClose,
  onOpenSession,
  onCreateReport,
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

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-200 ${
        isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <button
        type="button"
        aria-label="Close chat history"
        onClick={onClose}
        className="absolute inset-0 bg-black/50"
      />
      <aside
        className={`absolute right-0 top-0 flex h-full w-[88%] max-w-sm flex-col border-l border-slate-200 bg-white shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
          <h2 className="text-base font-semibold text-slate-900">
            {ui.chatHistoryTitle}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-700 hover:bg-slate-50"
          >
            {ui.closeArchive}
          </button>
        </header>

        <div className="border-b border-slate-100 px-4 py-3">
          <button
            type="button"
            onClick={() => {
              onStartNewChat();
              onClose();
            }}
            className="w-full rounded-xl bg-slate-900 px-3 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
          >
            {ui.chatHistoryNew}
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-700">
              {ui.chatHistoryListTitle}
            </p>
            {sessions.length > 0 ? (
              <button
                type="button"
                onClick={onClearSessions}
                className="rounded-md border border-rose-200 bg-rose-50 px-2 py-1 text-[11px] text-rose-700 hover:bg-rose-100"
              >
                {ui.chatHistoryClear}
              </button>
            ) : null}
          </div>

          {sessions.length === 0 ? (
            <p className="rounded-lg border border-dashed border-slate-300 p-3 text-xs leading-relaxed text-slate-600">
              {ui.chatHistoryEmpty}
            </p>
          ) : (
            <div className="space-y-2">
              {sessions.map((session) => {
                const isCurrent = session.id === currentSessionId;
                const hasReport = reportedSessionIds.has(session.id);
                return (
                  <article
                    key={session.id}
                    className={`rounded-lg border p-3 text-xs ${
                      isCurrent
                        ? "border-teal-200 bg-teal-50/50"
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    <p className="font-medium leading-snug text-slate-900">
                      {session.title}
                    </p>
                    <p className="mt-1.5 text-slate-500">
                      {formatReportDate(
                        session.endedAt ?? session.createdAt,
                        locale,
                      )}
                      {" · "}
                      {ui.reportTurnCount.replace(
                        "{count}",
                        String(session.messageCount),
                      )}
                      {isCurrent ? ` · ${ui.chatHistoryCurrent}` : ""}
                      {hasReport ? ` · ${ui.chatHistoryHasReport}` : ""}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => onOpenSession(session)}
                        className="rounded-md border border-slate-300 bg-white px-2 py-1 text-[11px] text-slate-700 hover:bg-slate-100"
                      >
                        {ui.chatHistoryContinue}
                      </button>
                      {!hasReport ? (
                        <button
                          type="button"
                          onClick={() => onCreateReport(session)}
                          className="rounded-md border border-teal-700 bg-teal-800 px-2 py-1 text-[11px] text-white hover:bg-teal-700"
                        >
                          {ui.createReport}
                        </button>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => onDeleteSession(session.id)}
                        disabled={isCurrent}
                        className="rounded-md border border-slate-300 bg-white px-2 py-1 text-[11px] text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
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
