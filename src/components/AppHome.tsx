"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { ChatWindow } from "@/components/ChatWindow";
import { LanguageSelector } from "@/components/LanguageSelector";
import { readAppLocale } from "@/components/LearningBookPanel";
import { EnglishAnalysisProvider } from "@/components/EnglishAnalysisProvider";
import { ExpressionInsightProvider } from "@/components/ExpressionInsightProvider";
import { TAB_ICON_META } from "@/components/TabIcons";
import { TargetLanguageSelector } from "@/components/TargetLanguageSelector";
import { UpdateNotice } from "@/components/UpdateNotice";
import { WhatsNewSheet } from "@/components/WhatsNewSheet";
import { RoleplayTab, hasRoleplay } from "@/components/RoleplayTab";
import { StudyMapTab } from "@/components/studyMap/StudyMapTab";
import { onAppIntent, sendAppIntent } from "@/lib/appIntents";
import { VideoLearningTab } from "@/components/videoLearning/VideoLearningTab";
import { BillingUiProvider, BillingOpenButton } from "@/components/BillingScreen";
import { GuideButton } from "@/components/GuideSheet";
import { FeedbackButton } from "@/components/FeedbackButton";
import { RoomsScreen } from "@/components/rooms/RoomsScreen";
import { PeopleTab } from "@/components/rooms/PeopleTab";
import { MessagesTab } from "@/components/rooms/MessagesTab";
import { useInbox } from "@/components/rooms/RoomDm";
import { useGroups } from "@/components/rooms/RoomGroups";
import { readCachedAccount, subscribeSession } from "@/lib/account/session";
import { readMiniRoom, subscribeMiniRoom } from "@/lib/rooms/miniRoom";
import { socialFeaturesEnabled } from "@/lib/platform";
import { LearningLanguageProvider, useLearningLanguage } from "@/contexts/LearningLanguageContext";
import { useUiCopy } from "@/hooks/useUiCopy";
import { APP_LOCALE_STORAGE_KEY, type Locale } from "@/lib/copy";
import {
  DEFAULT_LEARNING_LANGUAGE_CODE,
  isLearningLanguageCode,
  learningLanguageTextDir,
} from "@/lib/learningLanguages";

/** 방 입장 코드는 이 기기의 저장값이라 바뀌었다고 알려 주는 곳이 없다. */
const noSubscribe = () => () => {};

export type AppTab = "map" | "chat" | "roleplay" | "video" | "vocab" | "rooms" | "people" | "messages";

const TABS: AppTab[] = ["map", "chat", "roleplay", "video", "vocab", "rooms", "people", "messages"];

/**
 * 하단 탭은 두 묶음: AI와 학습(My·채팅·통화·영상·단어장)과 사람과 학습(사람·말하는 방·메시지).
 * 맨 위 스위치로 묶음을 바꾸면 하단 탭이 통째로 바뀌고, 그 묶음에서 마지막으로 본 탭이 열린다.
 * 사람과 학습은 iOS 1차엔 없다(socialFeaturesEnabled) — 그때는 스위치도 없다.
 */
const PEOPLE_TABS: AppTab[] = ["people", "rooms", "messages"];
type TabGroup = "ai" | "people";
const groupOf = (tab: AppTab): TabGroup => (PEOPLE_TABS.includes(tab) ? "people" : "ai");

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
  // 단어장 탭은 My의 노트로 들어갔다(2026-10-19).
  if (raw === "vocab") return "map";
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
  const { targetLanguage } = useLearningLanguage();
  // Hidden rather than shown empty: only English has scenarios written, so a
  // learner of anything else would get a tab with nothing behind it.
  const roleplayAvailable = hasRoleplay(targetLanguage);

  // Derived rather than synced back into state. Switching the target language
  // can pull the tab out from under the person standing on it — including via
  // ?screen=roleplay on a language that has none — and correcting that in an
  // effect would render the empty tab once before replacing it.
  const shownTab: AppTab =
    (tab === "roleplay" && !roleplayAvailable) || (PEOPLE_TABS.includes(tab) && !socialFeaturesEnabled()) ? "chat" : tab;

  // 말하는 방: 하단 탭(2.68부터 모두에게). iOS 1차 출시엔 방·메시지를 통째로 끈다
  // (`lib/platform.ts`) — 그때는 탭도 ?screen=rooms도 채팅으로.
  const socialOn = useSyncExternalStore(noSubscribe, socialFeaturesEnabled, () => false);
  const miniRoom = useSyncExternalStore(subscribeMiniRoom, readMiniRoom, () => null);
  const signedIn = useSyncExternalStore(subscribeSession, () => readCachedAccount() !== null, () => false);
  // 메시지 목록과 안 읽음 수: 메시지 탭을 보는 동안은 8초, 아니면 30초마다(로그인했을 때만).
  const inbox = useInbox(socialOn && signedIn, shownTab === "messages" ? 8_000 : 30_000);
  // 단체방(받은 초대·안 읽음 포함)도 같은 배지에.
  const groups = useGroups(socialOn && signedIn, shownTab === "messages" ? 8_000 : 30_000);
  const messagesUnread = inbox.unread + groups.unread;
  const group = groupOf(shownTab);
  // 묶음마다 마지막으로 본 탭. 스위치를 누르면 그리로.
  const [lastInGroup, setLastInGroup] = useState<Record<TabGroup, AppTab>>({ ai: "chat", people: "people" });

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = learningLanguageTextDir(locale);
  }, [locale]);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const fromQuery = params.get("screen") ?? params.get("tab");
      const initial = resolveTab(fromQuery);
      // 예전 단어장 탭 링크: My로 와서 노트의 단어장을 연다.
      if (fromQuery === "vocab") sendAppIntent("openNotes", { section: "words" });
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
    (requested: AppTab) => {
      // 단어장은 탭이 아니라 My 노트 안에 있다: My로 가서 단어장을 연다.
      const next: AppTab = requested === "vocab" ? "map" : requested;
      if (requested === "vocab") sendAppIntent("openNotes", { section: "words" });
      setTab(next);
      setLastInGroup((last) => ({ ...last, [groupOf(next)]: next }));
      syncUrl(next);
    },
    [syncUrl],
  );

  // The study map sends learners to the tab a topic is practised in.
  useEffect(() => onAppIntent("openTab", ({ tab: next }) => openTab(next)), [openTab]);
  // A conversation to practise something goes to the tab it is held in; the
  // tab starts it (appIntents.ts). A map topic opens on the map.
  useEffect(() => onAppIntent("practice", ({ tab: next }) => openTab(next)), [openTab]);
  useEffect(() => onAppIntent("openTopic", () => openTab("map")), [openTab]);

  useEffect(() => {
    const onPopState = (event: PopStateEvent) => {
      const raw = (event.state as { talkbankScreen?: string } | null)
        ?.talkbankScreen;
      setTab(resolveTab(raw));
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const aiTabItems: { id: AppTab; label: string }[] = [
    // Still "map" inside (links, intents, screenshots); a profile on screen.
    { id: "map", label: ui.homeTabProfile },
    { id: "chat", label: ui.homeTabChat },
    ...(roleplayAvailable
      ? [{ id: "roleplay" as const, label: ui.homeTabCall }]
      : []),
    { id: "video", label: ui.homeTabVideo },
  ];
  const peopleTabItems: { id: AppTab; label: string }[] = [
    { id: "people", label: ui.homeTabPeople },
    { id: "rooms", label: ui.homeTabRooms },
    { id: "messages", label: ui.homeTabMessages },
  ];
  const tabItems = group === "people" && socialOn ? peopleTabItems : aiTabItems;
  // 사용법(?)은 AI 쪽 탭만 따로 있고, 사람과 학습은 말하는 방 안내 하나를 같이 쓴다.
  const guideTab = group === "people" ? "rooms" : shownTab;
  const guideTabs = [
    ...aiTabItems,
    // 단어장은 탭에서 빠졌지만(노트 안) 사용법은 그대로 둔다.
    { id: "vocab" as const, label: ui.homeTabVocab },
    ...(socialOn ? [{ id: "rooms" as const, label: ui.homeTabRooms }] : []),
  ] as { id: Exclude<AppTab, "people" | "messages">; label: string }[];

  return (
    <BillingUiProvider locale={locale} ui={ui}>
    <ExpressionInsightProvider locale={locale} ui={ui}>
      <EnglishAnalysisProvider locale={locale} ui={ui}>
          <div
            className="mx-auto flex h-[100dvh] w-full max-w-4xl flex-col bg-transparent"
            dir={learningLanguageTextDir(locale)}
            lang={locale}
          >
            <div data-app-chrome className="relative z-[60] flex shrink-0 flex-wrap items-center gap-2 overflow-visible border-b border-white/10 bg-[#050505]/80 px-3 py-1.5 backdrop-blur-md sm:px-4">
              <TargetLanguageSelector label={ui.learningLanguageLabel} />
              <LanguageSelector
                locale={locale}
                onChange={setLocale}
                label={ui.uiLanguageLabel}
              />
              <BillingOpenButton ui={ui} />
              {/* 사람 탭은 말하는 방의 일부라 사용법도 말하는 방 것을 연다. */}
              <GuideButton
                ui={ui}
                locale={locale}
                tab={guideTab as Exclude<AppTab, "people" | "messages">}
                tabs={guideTabs}
              />
              <FeedbackButton ui={ui} locale={locale} tab={shownTab} />
            </div>
            {/* Above everything, because it is about everything: this is the
                only way anyone gets told their build has to be replaced. */}
            <UpdateNotice ui={ui} locale={locale} />
            {/* Once, on the first launch after an update. */}
            <WhatsNewSheet ui={ui} locale={locale} onOpenTab={openTab} />
            {socialOn ? (
              <div className="shrink-0 px-2 pt-2 sm:px-4">
                <div className="mx-auto flex max-w-md gap-1 rounded-full bg-white/[0.06] p-1" role="tablist">
                  {(["ai", "people"] as const).map((option) => {
                    const on = group === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        role="tab"
                        aria-selected={on}
                        onClick={() => {
                          if (on) return;
                          // 떠나는 묶음의 지금 탭을 기억해 두고(링크로 열린 탭도), 다른 묶음의 마지막 탭으로.
                          setLastInGroup((last) => ({ ...last, [group]: shownTab }));
                          openTab(lastInGroup[option]);
                        }}
                        className={`relative flex-1 rounded-full px-3 py-1.5 text-[13px] font-medium transition ${
                          on ? "bg-[#e8e8e4] text-neutral-900" : "text-slate-300 hover:bg-white/5"
                        }`}
                      >
                        {option === "ai" ? ui.modeAi : ui.modePeople}
                        {option === "people" && !on && messagesUnread > 0 ? (
                          <span className="absolute end-3 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-violet-400" aria-hidden />
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}
            <div className="relative z-0 min-h-0 flex-1 overflow-hidden p-2 pb-0 sm:p-4 sm:pb-0">
              <div
                className={
                  shownTab === "chat"
                    ? "h-full"
                    : "pointer-events-none invisible absolute inset-0 -z-10 overflow-hidden opacity-0"
                }
                aria-hidden={shownTab !== "chat"}
              >
                <ChatWindow tabMode locale={locale} />
              </div>

              <div
                className={
                  shownTab === "video"
                    ? "h-full"
                    : "pointer-events-none invisible absolute inset-0 -z-10 overflow-hidden opacity-0"
                }
                aria-hidden={shownTab !== "video"}
              >
                <VideoLearningTab
                  key={targetLanguage}
                  locale={locale}
                  ui={ui}
                  active={shownTab === "video"}
                />
              </div>

              {shownTab === "roleplay" ? (
                <div className="tb-panel flex h-full min-h-0 flex-col overflow-hidden rounded-2xl">
                  <header className="flex shrink-0 items-center justify-between gap-2 border-b border-white/10 px-4 py-3">
                    <h1 className="text-base font-semibold text-white">
                      {ui.roleplayTitle}
                    </h1>
                  </header>
                  <div className="min-h-0 flex-1 overflow-hidden">
                    <RoleplayTab
                      targetLanguage={targetLanguage}
                      nativeLanguage={
                        isLearningLanguageCode(locale)
                          ? locale
                          : DEFAULT_LEARNING_LANGUAGE_CODE
                      }
                      locale={locale}
                      ui={ui}
                    />
                  </div>
                </div>
              ) : null}

              {shownTab === "map" ? (
                <StudyMapTab
                  key={targetLanguage}
                  ui={ui}
                  locale={locale}
                  targetLanguage={targetLanguage}
                />
              ) : null}


              {shownTab === "messages" && socialOn ? (
                <MessagesTab ui={ui} locale={locale} targetLanguage={targetLanguage} threads={inbox.threads} groups={groups.groups} onGroupsChanged={groups.refresh} />
              ) : null}

              {shownTab === "people" && socialOn ? (
                <PeopleTab ui={ui} locale={locale} targetLanguage={targetLanguage} />
              ) : null}

              {/* 다른 탭에서도 떠 있어야 접어 둔 방이 끊기지 않는다(로비는 이 탭일 때만 그린다). */}
              {socialOn ? (
                <RoomsScreen ui={ui} locale={locale} targetLanguage={targetLanguage} visible={shownTab === "rooms"} />
              ) : null}
            </div>

            {miniRoom ? (
              <div className="shrink-0 px-3 pb-1.5 pt-1">
                {/* 접어 둔 말하는 방: 누르면 방으로(연결·마이크는 그대로였다). */}
                <button
                  type="button"
                  onClick={miniRoom.open}
                  className="mx-auto flex w-full max-w-2xl items-center gap-2 rounded-2xl border border-emerald-400/40 bg-[#0c1a14] px-4 py-2.5 text-start"
                >
                  <span className="relative flex h-2.5 w-2.5 shrink-0">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm font-medium text-white" dir="auto">
                    🎙 {miniRoom.title}
                  </span>
                  <span className="shrink-0 text-xs text-emerald-200">{miniRoom.back}</span>
                </button>
              </div>
            ) : null}

            <nav
              data-app-chrome
              className="shrink-0 border-t border-white/10 bg-[#050505]/95 px-1 pb-[env(safe-area-inset-bottom)] pt-1 backdrop-blur-md"
              aria-label="Main"
            >
              <div className="mx-auto flex max-w-4xl gap-0.5">
                {tabItems.map((item) => {
                  const active = shownTab === item.id;
                  const meta = TAB_ICON_META[item.id];
                  const Icon = meta.Icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => openTab(item.id)}
                      aria-label={item.label}
                      aria-current={active ? "page" : undefined}
                      className={`relative flex min-h-[3.5rem] flex-1 basis-0 flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-1.5 transition ${
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
                      {item.id === "messages" && messagesUnread > 0 ? (
                        <span className="absolute end-[22%] top-1 min-w-[1.1rem] rounded-full bg-violet-500 px-1 text-center text-[10px] font-semibold leading-4 text-white">
                          {Math.min(messagesUnread, 99)}
                        </span>
                      ) : null}
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

  // The stored choice cannot be read during the first render. This page is
  // built ahead of time and shipped inside the APK, so the render that HTML
  // came from knew nothing about this reader; starting anywhere but "ko" here
  // would disagree with it and tear the hydration. It is read once the page
  // is alive instead.
  useEffect(() => {
    setLocale(readAppLocale());
  }, []);

  /**
   * Store the language when somebody picks one, and at no other moment.
   *
   * This used to be an effect that wrote `locale` whenever it changed, which
   * sounds like the same thing and is not: on the very first commit it wrote
   * the initial "ko" — and children run their effects before their parent, so
   * ChatWindow's copy of that effect wrote "ko" before the read above had even
   * run. The read then found the "ko" it had just written. Every start of the
   * app overwrote the language the learner had chosen, which is why setting
   * the app to Italian never survived closing it.
   */
  const chooseLocale = useCallback((next: Locale) => {
    setLocale(next);
    try {
      localStorage.setItem(APP_LOCALE_STORAGE_KEY, next);
    } catch {
      // ignore
    }
  }, []);

  return (
    <LearningLanguageProvider>
      <AppHomeInner locale={locale} setLocale={chooseLocale} />
    </LearningLanguageProvider>
  );
}
