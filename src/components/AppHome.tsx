"use client";

import { useCallback, useEffect, useState } from "react";
import { CallBar } from "@/components/CallBar";
import { CallProvider } from "@/components/CallProvider";
import { ChatWindow } from "@/components/ChatWindow";
import { LanguageSelector } from "@/components/LanguageSelector";
import { readAppLocale } from "@/components/LearningBookPanel";
import { EnglishAnalysisProvider } from "@/components/EnglishAnalysisProvider";
import { ExpressionInsightProvider } from "@/components/ExpressionInsightProvider";
import { TAB_ICON_META } from "@/components/TabIcons";
import { TargetLanguageSelector } from "@/components/TargetLanguageSelector";
import { VocabularyPanel } from "@/components/VocabularyPanel";
import { VideoLearningTab } from "@/components/videoLearning/VideoLearningTab";
import { BillingUiProvider, BillingOpenButton } from "@/components/BillingScreen";
import { LearningLanguageProvider } from "@/contexts/LearningLanguageContext";
import { useUiCopy } from "@/hooks/useUiCopy";
import { APP_LOCALE_STORAGE_KEY, type Locale } from "@/lib/copy";
import { learningLanguageTextDir } from "@/lib/learningLanguages";

export type AppTab = "chat" | "video" | "vocab";

const TABS: AppTab[] = ["chat", "video", "vocab"];

function isAppTab(value: string | null): value is AppTab {
  return TABS.includes(value as AppTab);
}

function resolveTab(raw: string | null | undefined): AppTab {
  if (!raw || raw === "home" || raw === "saved") return "chat";
  if (raw === "reports" || raw === "sessions" || raw === "monthly") return "chat";
  if (raw === "quiz" || raw === "explore") return "chat";
  // Retired tabs: web reading and study materials both fall back to chat.
  if (raw === "read" || raw === "web" || raw === "reader") return "chat";
  if (raw === "study" || raw === "materials" || raw === "library") return "chat";
  if (raw === "watch" || raw === "youtube") return "video";
  if (isAppTab(raw)) return raw;
  return "chat";
}

type HistoryState = { talkbankScreen?: AppTab };

function AppHomeInner({
  locale,
  setLocale,
}: {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}) {
  const [tab, setTab] = useState<AppTab>("chat");
  const ui = useUiCopy(locale);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = learningLanguageTextDir(locale);
  }, [locale]);

  useEffect(() => {
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

  const tabItems: { id: AppTab; label: string }[] = [
    { id: "chat", label: ui.homeTabChat },
    { id: "video", label: ui.homeTabVideo },
    { id: "vocab", label: ui.homeTabVocab },
  ];

  return (
    <BillingUiProvider locale={locale} ui={ui}>
    <ExpressionInsightProvider locale={locale} ui={ui}>
      <EnglishAnalysisProvider locale={locale} ui={ui}>
          <div
            className="mx-auto flex h-[100dvh] w-full max-w-4xl flex-col bg-transparent"
            dir={learningLanguageTextDir(locale)}
            lang={locale}
          >
            <div className="relative z-50 flex shrink-0 flex-wrap items-center gap-2 overflow-visible border-b border-white/10 bg-[#050505]/80 px-3 py-1.5 backdrop-blur-md sm:px-4">
              <TargetLanguageSelector label={ui.learningLanguageLabel} />
              <LanguageSelector
                locale={locale}
                onChange={setLocale}
                label={ui.uiLanguageLabel}
              />
              <BillingOpenButton ui={ui} />
            </div>
            <CallBar ui={ui} />
            <div className="relative z-0 min-h-0 flex-1 overflow-hidden p-2 pb-0 sm:p-4 sm:pb-0">
              <div
                className={
                  tab === "chat"
                    ? "h-full"
                    : "pointer-events-none invisible absolute inset-0 -z-10 overflow-hidden opacity-0"
                }
                aria-hidden={tab !== "chat"}
              >
                <ChatWindow tabMode locale={locale} />
              </div>

              <div
                className={
                  tab === "video"
                    ? "h-full"
                    : "pointer-events-none invisible absolute inset-0 -z-10 overflow-hidden opacity-0"
                }
                aria-hidden={tab !== "video"}
              >
                <VideoLearningTab
                  locale={locale}
                  ui={ui}
                  active={tab === "video"}
                />
              </div>

              {tab === "vocab" ? (
                <div className="tb-panel flex h-full min-h-0 flex-col overflow-hidden rounded-2xl">
                  <header className="flex shrink-0 items-center justify-between gap-2 border-b border-white/10 px-4 py-3">
                    <h1 className="text-base font-semibold text-white">
                      {ui.homeTabVocab}
                    </h1>
                  </header>
                  <div className="min-h-0 flex-1 overflow-hidden">
                    <VocabularyPanel locale={locale} ui={ui} />
                  </div>
                </div>
              ) : null}
            </div>

            <nav
              className="shrink-0 border-t border-white/10 bg-[#050505]/95 px-1 pb-[env(safe-area-inset-bottom)] pt-1 backdrop-blur-md"
              aria-label="Main"
            >
              <div className="mx-auto grid max-w-4xl grid-cols-5 gap-0.5">
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
                      className={`flex min-h-[3.5rem] flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-1.5 transition ${
                        active ? meta.activeBg : meta.idleBg
                      }`}
                    >
                      <Icon active={active} />
                      <span
                        className={`max-w-full truncate text-[10px] font-medium ${
                          active ? "text-[#e4e4e0]" : "text-slate-400"
                        }`}
                      >
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </nav>
          </div>
        </EnglishAnalysisProvider>
    </ExpressionInsightProvider>
    </BillingUiProvider>
  );
}

export function AppHome() {
  const [locale, setLocale] = useState<Locale>("ko");

  useEffect(() => {
    setLocale(readAppLocale());
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(APP_LOCALE_STORAGE_KEY, locale);
    } catch {
      // ignore
    }
  }, [locale]);

  return (
    <LearningLanguageProvider>
      <CallProvider>
        <AppHomeInner locale={locale} setLocale={setLocale} />
      </CallProvider>
    </LearningLanguageProvider>
  );
}
