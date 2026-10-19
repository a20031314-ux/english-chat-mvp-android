"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { maybeShowInterstitial, warmUpAds } from "@/lib/ads";
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
import { appVersion } from "@/lib/appVersion";
import { newGuideSections } from "@/lib/whatsNew";
import type { GuideGo } from "@/lib/guide/content";
import { FeedbackButton } from "@/components/FeedbackButton";
import { FeedbackFixedSheet } from "@/components/FeedbackFixedSheet";
import { RoomsScreen } from "@/components/rooms/RoomsScreen";
import { PeopleTab } from "@/components/rooms/PeopleTab";
import { InviteWelcome } from "@/components/invite/InviteWelcome";
import { InviteNewsSheet } from "@/components/invite/InviteRewards";
import { requestGroup } from "@/lib/rooms/openDm";
import { MessagesTab } from "@/components/rooms/MessagesTab";
import { AiTutorRow } from "@/components/AiTutorRow";
import { useInbox } from "@/components/rooms/RoomDm";
import { useGroups } from "@/components/rooms/RoomGroups";
import { readCachedAccount, subscribeSession } from "@/lib/account/session";
import { readMiniRoom, subscribeMiniRoom } from "@/lib/rooms/miniRoom";
import { isIosApp, socialFeaturesEnabled } from "@/lib/platform";
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

export type AppTab = "map" | "chat" | "roleplay" | "video" | "vocab" | "rooms" | "people" | "messages" | "talk";

const TABS: AppTab[] = ["map", "chat", "roleplay", "video", "vocab", "rooms", "people", "messages", "talk"];

/**
 * 하단 탭(2026-10-20, `hub/drafts/one-list-tabs.md`): 대화 · 영상 · 사람 · 룸 · My. 묶음 스위치는 없다.
 * "대화"(talk)는 목록: 맨 위 AI 튜터(줄 → 채팅, 📞 → 통화), 그 아래 단체방·1:1(예전 메시지 탭).
 * 채팅·통화는 대화 안에서 열리는 화면이라 하단에서는 대화가 켜져 보이고, 위에 "‹ 대화"가 생긴다.
 * 사람 기능이 꺼지면(iOS 1차, socialFeaturesEnabled) 채팅 · 통화 · 영상 · My — 목록 없이 지금과 같다.
 */
const PEOPLE_TABS: AppTab[] = ["people", "rooms", "messages", "talk"];
/** 대화 탭 안에서 열리는 화면들: 하단에서는 "대화"가 켜져 보인다. */
const TALK_SCREENS: AppTab[] = ["talk", "messages", "chat", "roleplay"];

function isAppTab(value: string | null): value is AppTab {
  return TABS.includes(value as AppTab);
}

function resolveTab(raw: string | null | undefined): AppTab {
  if (!raw) return socialFeaturesEnabled() ? "talk" : "chat";
  if (raw === "home" || raw === "saved") return "chat";
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
  // 예전 메시지 탭은 대화 목록이 됐다(링크·초대·새로워진 점이 아직 "messages"로 연다).
  const shownTab: AppTab =
    (tab === "roleplay" && !roleplayAvailable) || (PEOPLE_TABS.includes(tab) && !socialFeaturesEnabled())
      ? "chat"
      : tab === "messages"
        ? "talk"
        : tab;

  // 말하는 방: 하단 탭(2.68부터 모두에게). iOS 1차 출시엔 방·메시지를 통째로 끈다
  // (`lib/platform.ts`) — 그때는 탭도 ?screen=rooms도 채팅으로.
  const socialOn = useSyncExternalStore(noSubscribe, socialFeaturesEnabled, () => false);
  const miniRoom = useSyncExternalStore(subscribeMiniRoom, readMiniRoom, () => null);
  const signedIn = useSyncExternalStore(subscribeSession, () => readCachedAccount() !== null, () => false);
  // 메시지 목록과 안 읽음 수: 메시지 탭을 보는 동안은 8초, 아니면 30초마다(로그인했을 때만).
  const inbox = useInbox(socialOn && signedIn, shownTab === "talk" ? 8_000 : 30_000);
  // 단체방(받은 초대·안 읽음 포함)도 같은 배지에.
  const groups = useGroups(socialOn && signedIn, shownTab === "talk" ? 8_000 : 30_000);
  const messagesUnread = inbox.unread + groups.unread;
  // 하단에서 켜져 보일 칸: 채팅·통화는 대화 안의 화면.
  const bottomTab: AppTab = socialOn && TALK_SCREENS.includes(shownTab) ? "talk" : shownTab;

  // 광고(lib/ads.ts, 무료·안드로이드만): 첫 화면이 뜬 뒤 조용히 준비만 하고(열자마자 띄우지 않음),
  // 채팅을 몇 번 주고받은 뒤 채팅 화면을 떠날 때를 자연스러운 끝으로 본다.
  useEffect(() => {
    const timer = window.setTimeout(() => void warmUpAds(), 8_000);
    return () => window.clearTimeout(timer);
  }, []);
  const previousTab = useRef(shownTab);
  useEffect(() => {
    if (previousTab.current === "chat" && shownTab !== "chat") void maybeShowInterstitial("chatLeave");
    previousTab.current = shownTab;
  }, [shownTab]);
  const insideTalk = socialOn && (shownTab === "chat" || shownTab === "roleplay");

  useEffect(() => {
    // iOS: 화면은 1배로 고정 — 글자가 16px보다 작은 입력칸을 누르면 WebKit이 확대하고
    // 돌아오지 않는다. 안드로이드는 손대지 않는다.
    if (!isIosApp()) return;
    const meta = document.querySelector('meta[name="viewport"]');
    meta?.setAttribute("content", "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no");
  }, []);

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

  // Still "map" inside (links, intents, screenshots); "My" on screen.
  const myItem = { id: "map" as const, label: ui.homeTabProfile };
  const aiTabItems: { id: AppTab; label: string }[] = [
    { id: "chat", label: ui.homeTabChat },
    ...(roleplayAvailable
      ? [{ id: "roleplay" as const, label: ui.homeTabCall }]
      : []),
    { id: "video", label: ui.homeTabVideo },
    myItem,
  ];
  const socialTabItems: { id: AppTab; label: string }[] = [
    { id: "talk", label: ui.homeTabTalk },
    { id: "video", label: ui.homeTabVideo },
    { id: "people", label: ui.homeTabPeople },
    { id: "rooms", label: ui.homeTabRooms },
    myItem,
  ];
  const tabItems = socialOn ? socialTabItems : aiTabItems;
  // 사용법(?): 대화 목록은 채팅 안내, 사람은 말하는 방 안내를 같이 쓴다.
  // 사용법 창: "?"는 지금 화면의 기능 칸으로 열고(GuideSheet SCREEN_CHAPTER), 묶음마다 "이 화면으로 가기".
  const guideGo: GuideGo[] = [
    "chat",
    ...(roleplayAvailable ? (["roleplay"] as const) : []),
    "video",
    "map",
    "notes",
    ...(socialOn ? (["talk", "people", "rooms"] as const) : []),
  ];
  const goFromGuide = (go: GuideGo) => openTab(go === "notes" ? "vocab" : go);
  const guideTabs = [
    ...aiTabItems,
    // 단어장은 탭에서 빠졌지만(노트 안) 사용법은 그대로 둔다.
    { id: "vocab" as const, label: ui.homeTabVocab },
    ...(socialOn ? [{ id: "rooms" as const, label: ui.homeTabRooms }] : []),
  ] as { id: Exclude<AppTab, "people" | "messages" | "talk">; label: string }[];

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
                tab={shownTab}
                tabs={guideTabs}
                availableGo={guideGo}
                onGo={goFromGuide}
                newSections={newGuideSections(appVersion())}
              />
              <FeedbackButton ui={ui} locale={locale} tab={shownTab} />
            </div>
            {/* Above everything, because it is about everything: this is the
                only way anyone gets told their build has to be replaced. */}
            <UpdateNotice ui={ui} locale={locale} />
            {/* Once, on the first launch after an update. */}
            <WhatsNewSheet ui={ui} locale={locale} onOpenTab={openTab} />
            {/* 앱을 열 때 한 번: 내가 보낸 의견이 반영됐다는 소식(고치기 전·후 그림). */}
            <FeedbackFixedSheet locale={locale} />
            {insideTalk ? (
              <div className="shrink-0 px-2 pt-1.5 sm:px-4">
                {/* 채팅·통화는 대화 목록 안의 화면: 목록으로 돌아가는 길. */}
                <button
                  type="button"
                  onClick={() => openTab("talk")}
                  className="flex items-center gap-1 rounded-lg px-2 py-1 text-note text-slate-300 hover:bg-white/5"
                >
                  <span aria-hidden className="rtl:rotate-180">‹</span>
                  {ui.homeTabTalk}
                  {messagesUnread > 0 ? (
                    <span className="ms-1 rounded-full bg-violet-500 px-1.5 text-meta font-semibold text-white">{Math.min(messagesUnread, 99)}</span>
                  ) : null}
                </button>
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


              {shownTab === "talk" && socialOn ? (
                <MessagesTab
                  ui={ui}
                  locale={locale}
                  targetLanguage={targetLanguage}
                  threads={inbox.threads}
                  groups={groups.groups}
                  onGroupsChanged={groups.refresh}
                  title={ui.homeTabTalk}
                  top={
                    <AiTutorRow
                      ui={ui}
                      canCall={roleplayAvailable}
                      onChat={() => openTab("chat")}
                      onCall={() => openTab("roleplay")}
                    />
                  }
                />
              ) : null}

              {shownTab === "people" && socialOn ? (
                <PeopleTab
                  ui={ui}
                  locale={locale}
                  targetLanguage={targetLanguage}
                  teams={groups.groups.filter((row) => row.group.team && !row.invite)}
                  onOpenGroup={(groupId) => {
                    openTab("talk");
                    requestGroup(groupId);
                  }}
                />
              ) : null}

              {/* 다른 탭에서도 떠 있어야 접어 둔 방이 끊기지 않는다(로비는 이 탭일 때만 그린다). */}
              {socialOn ? (
                <RoomsScreen ui={ui} locale={locale} targetLanguage={targetLanguage} visible={shownTab === "rooms"} />
              ) : null}
              {/* 초대 링크로 열었을 때 한 번(설치 직후 첫 실행 포함). */}
              {socialOn ? <InviteWelcome ui={ui} locale={locale} onOpenTab={openTab} /> : null}
              {/* 친구 초대 보상 소식(지급·단계 보상)을 앱을 열 때 한 번. 이때 서버가 사용한 날도 센다. */}
              {socialOn && signedIn ? <InviteNewsSheet ui={ui} locale={locale} /> : null}
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
                  const active = bottomTab === item.id;
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
                      {item.id === "talk" && messagesUnread > 0 ? (
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
