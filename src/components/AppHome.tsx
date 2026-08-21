"use client";

import { useCallback, useEffect, useState } from "react";
import { ChatWindow } from "@/components/ChatWindow";
import { LanguageSelector } from "@/components/LanguageSelector";
import { readAppLocale } from "@/components/LearningBookPanel";
import { EnglishAnalysisProvider } from "@/components/EnglishAnalysisProvider";
import { ExpressionInsightProvider } from "@/components/ExpressionInsightProvider";
import { TAB_ICON_META } from "@/components/TabIcons";
import { TargetLanguageSelector } from "@/components/TargetLanguageSelector";
import { VocabularyPanel } from "@/components/VocabularyPanel";
import { StudyMaterialsTab } from "@/components/studyMaterials/StudyMaterialsTab";
import { WebReadingTab } from "@/components/WebReadingTab";
import { VideoLearningTab } from "@/components/videoLearning/VideoLearningTab";
import { LearningLanguageProvider } from "@/contexts/LearningLanguageContext";
import { useUiCopy } from "@/hooks/useUiCopy";
import { APP_LOCALE_STORAGE_KEY, type Locale } from "@/lib/copy";
import { learningLanguageTextDir } from "@/lib/learningLanguages";

export type AppTab = "chat" | "read" | "study" | "video" | "vocab";

const TABS: AppTab[] = ["chat", "read", "study", "video", "vocab"];

function isAppTab(value: string | null): value is AppTab {
  return TABS.includes(value as AppTab);
}

function resolveTab(raw: string | null | undefined): AppTab {
  if (!raw || raw === "home" || raw === "saved") return "chat";
  if (raw === "reports" || raw === "sessions" || raw === "monthly") return "chat";
  if (raw === "quiz" || raw === "explore") return "chat";
  if (raw === "web" || raw === "reader") return "read";
  if (raw === "study" || raw === "materials" || raw === "library") return "study";
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
    { id: "read", label: ui.homeTabRead },
    { id: "study", label: ui.homeTabStudy },
    { id: "video", label: ui.homeTabVideo },
    { id: "vocab", label: ui.homeTabVocab },
  ];

  return (
    <ExpressionInsightProvider locale={locale} ui={ui}>
      <EnglishAnalysisProvider locale={locale} ui={ui}>
          <div
            className="mx-auto flex h-[100dvh] w-full max-w-4xl flex-col bg-slate-100"
            dir={learningLanguageTextDir(locale)}
            lang={locale}
          >
            <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-slate-200/80 bg-white/90 px-3 py-1.5 sm:px-4">
              <TargetLanguageSelector label={ui.learningLanguageLabel} />
              <LanguageSelector
                locale={locale}
                onChange={setLocale}
                label={ui.uiLanguageLabel}
              />
            </div>
            <div className="relative min-h-0 flex-1 overflow-hidden p-2 pb-0 sm:p-4 sm:pb-0">
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
                  tab === "read"
                    ? "h-full"
                    : "pointer-events-none invisible absolute inset-0 -z-10 overflow-hidden opacity-0"
                }
                aria-hidden={tab !== "read"}
              >
                <WebReadingTab
                  locale={locale}
                  ui={ui}
                  active={tab === "read"}
                />
              </div>

              <div
                className={
                  tab === "study"
                    ? "h-full"
                    : "pointer-events-none invisible absolute inset-0 -z-10 overflow-hidden opacity-0"
                }
                aria-hidden={tab !== "study"}
              >
                <StudyMaterialsTab locale={locale} ui={ui} />
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
                <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
                  <header className="flex shrink-0 items-center justify-between gap-2 border-b border-slate-200 px-4 py-3">
                    <h1 className="text-base font-semibold text-slate-900">
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
              className="shrink-0 border-t border-slate-200 bg-white px-1 pb-[env(safe-area-inset-bottom)] pt-1 shadow-[0_-4px_16px_rgba(15,23,42,0.04)]"
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
        </EnglishAnalysisProvider>
    </ExpressionInsightProvider>
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
      <AppHomeInner locale={locale} setLocale={setLocale} />
    </LearningLanguageProvider>
  );
}
