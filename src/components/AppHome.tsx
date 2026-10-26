"use client";

import { AiConsentGate } from "@/components/AiConsentGate";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { maybeShowAppOpen, maybeShowInterstitial, setAppOpenAllowedHere, setBannerPlacement, warmUpAds, watchAppLifecycle } from "@/lib/ads";
import { ChatWindow } from "@/components/ChatWindow";
import { LanguageSelector } from "@/components/LanguageSelector";
import { readAppLocale } from "@/components/LearningBookPanel";
import { EnglishAnalysisProvider } from "@/components/EnglishAnalysisProvider";
import { ExpressionInsightProvider } from "@/components/ExpressionInsightProvider";
import { TAB_ICON_META } from "@/components/TabIcons";
import { TargetLanguageSelector } from "@/components/TargetLanguageSelector";
import { UpdateNotice } from "@/components/UpdateNotice";
import { WhatsNewSheet } from "@/components/WhatsNewSheet";
import { CallHost, hasRoleplay } from "@/components/CallHost";
import { PackCard } from "@/components/PackCard";
import { readCalls, readCallsOnServer, subscribeCalls } from "@/lib/roleplay/callStore";
import { StudyMapTab } from "@/components/studyMap/StudyMapTab";
import { onAppIntent, sendAppIntent } from "@/lib/appIntents";
import { VideoLearningTab } from "@/components/videoLearning/VideoLearningTab";
import { BillingUiProvider, BillingOpenButton } from "@/components/BillingScreen";
import { GuideButton } from "@/components/GuideSheet";
import { appVersion } from "@/lib/appVersion";
import { newGuideSections } from "@/lib/whatsNew";
import type { GuideGo } from "@/lib/guide/content";
import { FeedbackButton } from "@/components/FeedbackButton";
import { readEntryDoor } from "@/lib/doors";
import { FeedbackFixedSheet } from "@/components/FeedbackFixedSheet";
import { SuspendedNotice } from "@/components/SuspendedNotice";
import { RoomsScreen } from "@/components/rooms/RoomsScreen";
import { RandomScreen } from "@/components/rooms/RandomScreen";
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
import { isIosApp, socialFeaturesEnabled, voiceCallAvailable } from "@/lib/platform";
import { bottomTabs, featureOfTab, isFeatureOn, matchingPreset, readFeatures, readFeaturesOnServer, subscribeFeatures, type FeatureId } from "@/lib/features";
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

export type AppTab = "map" | "chat" | "roleplay" | "video" | "vocab" | "rooms" | "people" | "messages" | "talk" | "random";

const TABS: AppTab[] = ["map", "chat", "roleplay", "video", "vocab", "rooms", "people", "messages", "talk", "random"];
/** 광고 배너를 두는 둘러보는 화면(lib/ads.ts). 채팅·통화·말하는 방·사람 화면에는 없음. */
const BANNER_TABS: AppTab[] = ["map", "video", "vocab", "talk"];
/** 앱 오프닝 광고를 띄우지 않는 화면(통화·말하는 방 — 소리가 이어지는 곳). */
const NO_APP_OPEN_TABS: AppTab[] = ["roleplay", "rooms"];

/**
 * 하단 탭(2026-10-20, `hub/drafts/one-list-tabs.md`): 대화 · 영상 · 사람 · 룸 · My. 묶음 스위치는 없다.
 * "대화"(talk)는 목록: 맨 위 AI 튜터(줄 → 채팅, 📞 → 통화), 그 아래 단체방·1:1(예전 메시지 탭).
 * 채팅·통화는 대화 안에서 열리는 화면이라 하단에서는 대화가 켜져 보이고, 위에 "‹ 대화"가 생긴다.
 * 사람 기능이 꺼지면(iOS 1차, socialFeaturesEnabled) 채팅 · 통화 · 영상 · My — 목록 없이 지금과 같다.
 */
const PEOPLE_TABS: AppTab[] = ["people", "rooms", "messages", "talk", "random"];
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
  // AI 통화는 탭이 아니다(2026-10-23): 옛 링크는 AI 대화로(마이크는 사람이 📞를 눌렀을 때만 연다).
  if (raw === "roleplay") return "chat";
  if (isAppTab(raw)) return raw;
  return "chat";
}

type HistoryState = { talkbankScreen?: AppTab };

/** 숨긴 기능 → 사용법에서 그 기능의 장(guide/content.ts GUIDE_CHAPTERS). */
const FEATURE_CHAPTER: Record<FeatureId, string> = {
  call: "ai-call",
  video: "video",
  people: "people",
  rooms: "rooms",
  notes: "notes",
};

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
  const callBuilt = useSyncExternalStore(noSubscribe, voiceCallAvailable, () => true);
  const roleplayAvailable = callBuilt && hasRoleplay(targetLanguage);
  // 쓸 기능 고르기(lib/features.ts): 숨긴 기능은 탭·버튼에서 빠진다. 창구 모드는 창구 탭 그대로(고르기 없음).
  const door = useSyncExternalStore(noSubscribe, readEntryDoor, () => null);
  const features = useSyncExternalStore(subscribeFeatures, readFeatures, readFeaturesOnServer);
  const featureOff: FeatureId[] = door ? [] : features.off;
  const featureOn = (feature: FeatureId) => isFeatureOn(featureOff, feature);
  const callOn = roleplayAvailable && featureOn("call");

  // Derived rather than synced back into state. Switching the target language
  // can pull the tab out from under the person standing on it — including via
  // ?screen=roleplay on a language that has none — and correcting that in an
  // effect would render the empty tab once before replacing it.
  // 예전 메시지 탭은 대화 목록이 됐다(링크·초대·새로워진 점이 아직 "messages"로 연다).
  // 말하는 방: 하단 탭(2.68부터 모두에게). iOS 1차 출시엔 방·메시지를 통째로 끈다
  // (`lib/platform.ts`) — 그때는 탭도 ?screen=rooms도 채팅으로.
  const socialOn = useSyncExternalStore(noSubscribe, socialFeaturesEnabled, () => false);
  // 하단을 대화·사람·Room 모양으로 둘지: 플랫폼에 사람 기능이 있고, 사용자가 사람을 숨기지 않았을 때.
  // 사람을 숨기면 iOS 1차처럼 채팅 · 통화 · 영상 · My(숨긴 것 빼고).
  const socialLayout = socialOn && (Boolean(door) || featureOn("people"));
  const tabHidden = (value: AppTab): boolean => {
    if (value === "roleplay" && !roleplayAvailable) return true;
    if (PEOPLE_TABS.includes(value) && !socialFeaturesEnabled()) return true;
    const feature = featureOfTab(value);
    return feature !== null && !featureOn(feature);
  };
  const homeTab: AppTab = socialLayout ? "talk" : "chat";
  const shownTab: AppTab = tabHidden(tab) ? homeTab : tab === "messages" ? "talk" : tab;

  const miniRoom = useSyncExternalStore(subscribeMiniRoom, readMiniRoom, () => null);
  const signedIn = useSyncExternalStore(subscribeSession, () => readCachedAccount() !== null, () => false);
  // 메시지 목록과 안 읽음 수: 메시지 탭을 보는 동안은 8초, 아니면 30초마다(로그인했을 때만).
  const inbox = useInbox(socialLayout && signedIn, shownTab === "talk" ? 8_000 : 30_000);
  // 단체방(받은 초대·안 읽음 포함)도 같은 배지에.
  const groups = useGroups(socialLayout && signedIn, shownTab === "talk" ? 8_000 : 30_000);
  const messagesUnread = inbox.unread + groups.unread;
  // 하단에서 켜져 보일 칸: 채팅·통화는 대화 안의 화면.
  const bottomTab: AppTab = socialLayout && TALK_SCREENS.includes(shownTab) ? "talk" : shownTab;

  // 광고(lib/ads.ts, 무료·안드로이드만): 첫 화면이 뜬 뒤 조용히 준비만 하고(열자마자 띄우지 않음),
  // 채팅을 몇 번 주고받은 뒤 채팅 화면을 떠날 때를 자연스러운 끝으로 본다.
  useEffect(() => {
    // 앱 오프닝 광고는 설치 며칠 뒤부터·몇 시간에 한 번만(서버 값). 첫 화면이 그려진 뒤 시도한다.
    const openTimer = window.setTimeout(() => void maybeShowAppOpen("launch"), 1_500);
    const timer = window.setTimeout(() => void warmUpAds(), 8_000);
    const stopWatching = watchAppLifecycle();
    return () => {
      window.clearTimeout(openTimer);
      window.clearTimeout(timer);
      stopWatching();
    };
  }, []);
  // 통화·말하는 방에서는 앱 오프닝 광고를 띄우지 않는다. AI 통화는 탭이 아니라 어디서나 떠 있는 층(CallHost)이라 따로 받는다.
  const [callActive, setCallActive] = useState(false);
  // 통화가 끝나 저장되면 오늘의 팩 카드를 다시 읽는다.
  const savedCalls = useSyncExternalStore(subscribeCalls, readCalls, readCallsOnServer);
  const callsVersion = savedCalls.reduce((latest, call) => Math.max(latest, call.updatedAt), 0);
  useEffect(() => {
    setAppOpenAllowedHere(!callActive && !NO_APP_OPEN_TABS.includes(shownTab));
  }, [shownTab, callActive]);
  // 배너는 둘러보는 화면에만, 하단 탭 바로 위에.
  const navRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const wanted = BANNER_TABS.includes(shownTab);
    const place = () => setBannerPlacement(wanted, navRef.current?.getBoundingClientRect().height ?? 0);
    place();
    const nav = navRef.current;
    if (!nav || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(place);
    observer.observe(nav);
    return () => observer.disconnect();
  }, [shownTab]);
  const previousTab = useRef(shownTab);
  useEffect(() => {
    if (previousTab.current === "chat" && shownTab !== "chat") void maybeShowInterstitial("chatLeave");
    previousTab.current = shownTab;
  }, [shownTab]);
  const insideTalk = socialLayout && (shownTab === "chat" || shownTab === "roleplay");

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
      // 창구(lib/doors.ts)로 들어오면 그 창구의 첫 화면.
      const initial = fromQuery ? resolveTab(fromQuery) : (readEntryDoor()?.start ?? resolveTab(null));
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

  // 숨긴 기능으로 가려 하면(지도의 "영상에서 보기" 등) 탭을 바꾸지 않고 사용법의 그 장을 연다 — 거기서 다시 켤 수 있다.
  const offList = door ? "" : features.off.join(",");
  const openTab = useCallback(
    (requested: AppTab) => {
      const feature = featureOfTab(requested);
      const hidden = feature !== null && !isFeatureOn(offList ? (offList.split(",") as FeatureId[]) : [], feature) ? feature : null;
      if (hidden) {
        sendAppIntent("openGuide", { chapter: FEATURE_CHAPTER[hidden], hidden: true });
        return;
      }
      // AI 통화는 탭이 아니다(2026-10-23): 📞·"통화 해보기"는 바로 통화(CallHost), 화면은 그대로.
      if (requested === "roleplay") {
        sendAppIntent("startCall", {});
        return;
      }
      // 단어장은 탭이 아니라 My 노트 안에 있다: My로 가서 단어장을 연다.
      const next: AppTab = requested === "vocab" ? "map" : requested;
      if (requested === "vocab") sendAppIntent("openNotes", { section: "words" });
      setTab(next);
      syncUrl(next);
    },
    [syncUrl, offList],
  );

  // The study map sends learners to the tab a topic is practised in.
  useEffect(() => onAppIntent("openTab", ({ tab: next }) => openTab(next)), [openTab]);
  // A conversation to practise something goes to the tab it is held in; the
  // tab starts it (appIntents.ts). A map topic opens on the map.
  useEffect(
    () =>
      onAppIntent("practice", ({ tab: next }) => {
        // 통화로 하는 연습은 CallHost가 그 자리에서 연다. 통화를 숨겼으면 사용법의 그 장으로.
        if (next === "roleplay") {
          if (offList.split(",").includes("call")) sendAppIntent("openGuide", { chapter: FEATURE_CHAPTER.call, hidden: true });
          return;
        }
        openTab(next);
      }),
    [openTab, offList],
  );
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
    ...(callOn
      ? [{ id: "roleplay" as const, label: ui.homeTabCall }]
      : []),
    ...(featureOn("video") ? [{ id: "video" as const, label: ui.homeTabVideo }] : []),
    myItem,
  ];
  const socialTabItems: { id: AppTab; label: string }[] = [
    { id: "talk", label: ui.homeTabTalk },
    { id: "video", label: ui.homeTabVideo },
    { id: "people", label: ui.homeTabPeople },
    { id: "rooms", label: ui.homeTabRooms },
    myItem,
    // 🎲 랜덤(창구 Spin에서만 하단에 보인다 — 아래 창구 모드가 door.tabs로 고른다).
    { id: "random", label: ui.homeTabRandom },
  ];
  // 창구 모드(lib/doors.ts, 웹의 창구 주소): 하단은 그 창구의 탭만, 그 순서로. 계정·기록은 같은 앱.
  const tabItems = socialLayout
    ? door
      ? door.tabs.map((id) => socialTabItems.find((item) => item.id === id)).filter((item): item is { id: AppTab; label: string } => Boolean(item))
      : socialTabItems.filter((item) => item.id !== "random" && !tabHidden(item.id))
    : aiTabItems;
  // 창구가 아니면 쓸 기능 고르기의 하단 탭(lib/features.ts bottomTabs — 구조도 미리보기와 같은 계산)을 따른다.
  const featureTabs = bottomTabs(featureOff, { social: socialOn });
  const allItems = [...socialTabItems, ...aiTabItems.filter((item) => item.id === "chat" || item.id === "roleplay"), { id: "roleplay" as const, label: ui.homeTabCall }];
  const shownItems = door
    ? tabItems
    : featureTabs.map((id) => allItems.find((item) => item.id === id)).filter((item): item is { id: AppTab; label: string } => Boolean(item));
  // 창구 모드면 브라우저 탭·홈 화면 이름도 그 창구. Next가 머리말 제목을 다시 쓰면 다시 맞춘다.
  useEffect(() => {
    if (!door) return;
    const apply = () => {
      if (document.title !== door.name) document.title = door.name;
    };
    apply();
    const watcher = new MutationObserver(apply);
    watcher.observe(document.head, { subtree: true, childList: true, characterData: true });
    return () => watcher.disconnect();
  }, [door]);
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
  ] as { id: Exclude<AppTab, "people" | "messages" | "talk" | "random">; label: string }[];

  return (
    <BillingUiProvider locale={locale} ui={ui}>
    <AiConsentGate ui={ui} dir={learningLanguageTextDir(locale)} />
    <ExpressionInsightProvider locale={locale} ui={ui}>
      <EnglishAnalysisProvider locale={locale} ui={ui}>
          <div
            className="mx-auto flex h-[100dvh] w-full max-w-4xl flex-col bg-transparent"
            dir={learningLanguageTextDir(locale)}
            lang={locale}
          >
            <div data-app-chrome className="relative z-[60] flex shrink-0 flex-wrap items-center gap-2 overflow-visible border-b border-white/10 bg-[#050505]/80 px-3 py-1.5 backdrop-blur-md sm:px-4">
              {door ? (
                <span data-door={door.theme} className="me-1 text-body font-bold text-door-accent">
                  {door.name}
                </span>
              ) : null}
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
                features={door ? null : features}
                pickHeader={
                  <>
                    <TargetLanguageSelector label={ui.learningLanguageLabel} />
                    <LanguageSelector locale={locale} onChange={setLocale} label={ui.uiLanguageLabel} />
                  </>
                }
                onChosen={(off) => {
                  // "영상으로" 묶음이면 첫 화면을 영상으로.
                  if (matchingPreset(off) === "video") openTab("video");
                }}
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
            {/* 운영자가 사람 기능을 정지한 계정이 쓰려 할 때(lib/rooms/suspended.ts). */}
            <SuspendedNotice locale={locale} />
            {insideTalk && shownTab !== "chat" ? (
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
            <div
              className="relative z-0 min-h-0 flex-1 overflow-hidden p-2 pb-0 sm:p-4 sm:pb-0"
              // 광고 배너가 떠 있으면 그 높이만큼 비워 둔다(lib/ads.ts가 정하는 값, 없으면 0).
              style={{ paddingBottom: "var(--ad-banner-space, 0px)" }}
            >
              <div
                className={
                  shownTab === "chat"
                    ? "h-full"
                    : "pointer-events-none invisible absolute inset-0 -z-10 overflow-hidden opacity-0"
                }
                aria-hidden={shownTab !== "chat"}
              >
                <ChatWindow
                  tabMode
                  locale={locale}
                  back={insideTalk ? { label: ui.homeTabTalk, unread: messagesUnread, onBack: () => openTab("talk") } : null}
                  onCall={callOn ? () => openTab("roleplay") : null}
                  callLabel={ui.talkAiCall}
                  menuItems={[
                    ...(callOn ? [{ label: ui.callRecordsTitle, onSelect: () => sendAppIntent("openCall", {}) }] : []),
                    { label: ui.roleplayOwnLineOpen, onSelect: () => sendAppIntent("sayOwnLine", {}) },
                  ]}
                  showPack={callOn && !socialLayout}
                />
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

              {shownTab === "map" ? (
                <StudyMapTab
                  key={targetLanguage}
                  ui={ui}
                  locale={locale}
                  targetLanguage={targetLanguage}
                />
              ) : null}


              {shownTab === "talk" && socialLayout ? (
                <MessagesTab
                  ui={ui}
                  locale={locale}
                  targetLanguage={targetLanguage}
                  threads={inbox.threads}
                  groups={groups.groups}
                  onGroupsChanged={groups.refresh}
                  onThreadsChanged={inbox.refresh}
                  title={ui.homeTabTalk}
                  top={
                    <>
                      <AiTutorRow
                        ui={ui}
                        canCall={callOn}
                        onChat={() => openTab("chat")}
                        onCall={() => openTab("roleplay")}
                        targetLanguage={targetLanguage}
                      />
                      {/* 오늘의 팩: 예전 통화 첫 화면 맨 위 → 대화 목록 AI 튜터 바로 아래(2026-10-23). */}
                      {callOn ? (
                        <div className="mt-2">
                          <PackCard
                            ui={ui}
                            targetLanguage={targetLanguage}
                            onStart={(request) => sendAppIntent("practice", request)}
                            refreshKey={String(callsVersion)}
                          />
                        </div>
                      ) : null}
                    </>
                  }
                />
              ) : null}

              {shownTab === "people" && socialLayout ? (
                <PeopleTab
                  ui={ui}
                  locale={locale}
                  targetLanguage={targetLanguage}
                  teams={groups.groups.filter((row) => row.group.team && !row.invite)}
                  canCall={callOn}
                  onOpenGroup={(groupId) => {
                    openTab("talk");
                    requestGroup(groupId);
                  }}
                />
              ) : null}

              {shownTab === "random" && socialOn ? <RandomScreen ui={ui} locale={locale} targetLanguage={targetLanguage} /> : null}

              {/* 다른 탭에서도 떠 있어야 접어 둔 방이 끊기지 않는다(로비는 이 탭일 때만 그린다). */}
              {socialOn ? (
                <RoomsScreen ui={ui} locale={locale} targetLanguage={targetLanguage} visible={shownTab === "rooms"} />
              ) : null}
              {/* AI 튜터와 통화: 어디서나 떠 있는 층(📞·오늘의 팩·지도의 말로 하기). */}
              <CallHost
                targetLanguage={targetLanguage}
                nativeLanguage={isLearningLanguageCode(locale) ? locale : DEFAULT_LEARNING_LANGUAGE_CODE}
                ui={ui}
                enabled={Boolean(door) ? roleplayAvailable : callOn}
                onActiveChange={setCallActive}
              />
              {/* 초대 링크로 열었을 때 한 번(설치 직후 첫 실행 포함). */}
              {/* 처음 설치면 기능 고르기를 마친 뒤에. */}
              {socialOn && (door || features.chosen) ? <InviteWelcome ui={ui} locale={locale} onOpenTab={openTab} /> : null}
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
              ref={navRef}
              data-app-chrome
              className="shrink-0 border-t border-white/10 bg-[#050505]/95 px-1 pb-[env(safe-area-inset-bottom)] pt-1 backdrop-blur-md"
              aria-label="Main"
            >
              <div className="mx-auto flex max-w-4xl gap-0.5">
                {shownItems.map((item) => {
                  const active = bottomTab === item.id;
                  const meta = TAB_ICON_META[item.id];
                  const Icon = meta.Icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => openTab(item.id)}
                      aria-label={item.label}
                      title={item.label}
                      aria-current={active ? "page" : undefined}
                      className={`relative flex min-h-[3rem] flex-1 basis-0 flex-col items-center justify-center rounded-xl px-1 py-1.5 transition ${
                        active ? meta.activeBg : meta.idleBg
                      }`}
                    >
                      {/* 아이콘만(사용자 2026-10-23) — 이름은 aria-label·title로만. */}
                      <Icon active={active} />
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
