"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChatWindow } from "@/components/ChatWindow";
import { LanguageSelector } from "@/components/LanguageSelector";
import { readAppLocale } from "@/components/LearningBookPanel";
import { ReviewTab } from "@/components/ReviewTab";
import { ReportsTab } from "@/components/ReportsTab";
import { TAB_ICON_META } from "@/components/TabIcons";
import { VocabularyPanel } from "@/components/VocabularyPanel";
import { APP_LOCALE_STORAGE_KEY, copy, type Locale } from "@/lib/copy";
import { syncLearningPointsFromSources } from "@/lib/learningPoints";
import type { SessionReport } from "@/lib/sessionReports";

export type AppTab = "chat" | "reports" | "quiz" | "vocab";

const TABS: AppTab[] = ["chat", "reports", "quiz", "vocab"];

function isAppTab(value: string | null): value is AppTab {
  return TABS.includes(value as AppTab);
}

function resolveTab(raw: string | null | undefined): AppTab {
  if (!raw || raw === "home" || raw === "saved") return "chat";
  if (raw === "sessions" || raw === "monthly") return "reports";
  if (isAppTab(raw)) return raw;
  return "chat";
}

type HistoryState = { talkbankScreen?: AppTab };

export function AppHome() {
  const [locale, setLocale] = useState<Locale>("ko");
  const [tab, setTab] = useState<AppTab>("chat");
  const [pendingSessionReportId, setPendingSessionReportId] = useState<
    string | null
  >(null);
  const [isCreatingReport, setIsCreatingReport] = useState(false);
  const pendingReportIdRef = useRef<string | null>(null);

  const ui = copy[locale];

  useEffect(() => {
    setLocale(readAppLocale());
    try {
      const params = new URLSearchParams(window.location.search);
      const fromQuery = params.get("screen") ?? params.get("tab");
      const initial = resolveTab(fromQuery);
      setTab(initial);
      window.history.replaceState(
        { talkbankScreen: initial } satisfies HistoryState,
        "",
      );
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(APP_LOCALE_STORAGE_KEY, locale);
    } catch {
      // ignore
    }
  }, [locale]);

  const syncUrl = useCallback((next: AppTab) => {
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete("tab");
      if (next === "chat") {
        url.searchParams.delete("screen");
      } else {
        url.searchParams.set("screen", next);
      }
      window.history.pushState(
        { talkbankScreen: next } satisfies HistoryState,
        "",
        url.toString(),
      );
    } catch {
      // ignore
    }
  }, []);

  const openTab = useCallback(
    (next: AppTab) => {
      setTab(next);
      syncUrl(next);
    },
    [syncUrl],
  );

  useEffect(() => {
    const onPopState = (event: PopStateEvent) => {
      const raw = (event.state as { talkbankScreen?: string } | null)
        ?.talkbankScreen;
      setTab(resolveTab(raw));
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const handleSessionReportCreating = useCallback(() => {
    pendingReportIdRef.current = null;
    setPendingSessionReportId(null);
    setIsCreatingReport(true);
    openTab("reports");
  }, [openTab]);

  const handleSessionReportCreated = useCallback(
    (report: SessionReport) => {
      try {
        syncLearningPointsFromSources();
      } catch {
        // ignore
      }
      pendingReportIdRef.current = report.id;
      setPendingSessionReportId(report.id);
      openTab("reports");
    },
    [openTab],
  );

  const handleSessionReportCreateFinished = useCallback(() => {
    if (!pendingReportIdRef.current) {
      setIsCreatingReport(false);
    }
  }, []);

  const clearPendingReport = useCallback(() => {
    pendingReportIdRef.current = null;
    setPendingSessionReportId(null);
    setIsCreatingReport(false);
  }, []);

  const tabItems: { id: AppTab; label: string }[] = [
    { id: "chat", label: ui.homeTabChat },
    { id: "reports", label: ui.homeTabReports },
    { id: "quiz", label: ui.homeTabQuiz },
    { id: "vocab", label: ui.homeTabVocab },
  ];

  return (
    <div className="mx-auto flex h-[100dvh] w-full max-w-4xl flex-col bg-slate-100">
      <div className="relative min-h-0 flex-1 overflow-hidden p-2 pb-0 sm:p-4 sm:pb-0">
        <div
          className={
            tab === "chat"
              ? "h-full"
              : "pointer-events-none invisible absolute inset-0 -z-10 overflow-hidden opacity-0"
          }
          aria-hidden={tab !== "chat"}
        >
          <ChatWindow
            tabMode
            locale={locale}
            onLocaleChange={setLocale}
            onSessionReportCreating={handleSessionReportCreating}
            onSessionReportCreated={handleSessionReportCreated}
            onSessionReportCreateFinished={handleSessionReportCreateFinished}
          />
        </div>

        {tab === "reports" ? (
          <div className="h-full">
            <ReportsTab
              locale={locale}
              ui={ui}
              onLocaleChange={setLocale}
              isCreatingReport={isCreatingReport}
              initialReportId={pendingSessionReportId}
              onInitialReportConsumed={clearPendingReport}
            />
          </div>
        ) : null}

        <div
          className={
            tab === "quiz"
              ? "h-full"
              : "pointer-events-none invisible absolute inset-0 -z-10 overflow-hidden opacity-0"
          }
          aria-hidden={tab !== "quiz"}
        >
          <ReviewTab
            locale={locale}
            ui={ui}
            onLocaleChange={setLocale}
            onGoChat={() => openTab("chat")}
          />
        </div>

        {tab === "vocab" ? (
          <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
            <header className="flex shrink-0 items-center justify-between gap-2 border-b border-slate-200 px-4 py-3">
              <h1 className="text-base font-semibold text-slate-900">
                {ui.homeTabVocab}
              </h1>
              <LanguageSelector locale={locale} onChange={setLocale} />
            </header>
            <div className="min-h-0 flex-1 overflow-hidden">
              <VocabularyPanel locale={locale} ui={ui} />
            </div>
          </div>
        ) : null}
      </div>

      <nav
        className="shrink-0 border-t border-slate-200 bg-white px-1 pb-[env(safe-area-inset-bottom)] pt-1 shadow-[0_-4px_16px_rgba(15,23,42,0.04)]"
        aria-label="Main"
      >
        <div className="mx-auto grid max-w-4xl grid-cols-4 gap-0.5">
          {tabItems.map((item) => {
            const active = tab === item.id;
            const meta = TAB_ICON_META[item.id];
            const Icon = meta.Icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => openTab(item.id)}
                aria-label={item.label}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-[3.25rem] flex-col items-center justify-center rounded-xl px-1 py-1.5 transition ${
                  active ? meta.activeBg : meta.idleBg
                }`}
              >
                <Icon active={active} />
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
