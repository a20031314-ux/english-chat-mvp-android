import { apiUrl } from "@/lib/apiBase";
import { entitlementHeaders, readCachedTier } from "@/lib/billing/billingService";
import { adsAvailable } from "@/lib/platform";

/**
 * 광고(AdMob) — 무료 사용자에게만, 안드로이드 앱에서만(hub/drafts/ads-rewarded.md, 서버 billing/ads.ts).
 *
 * - 전면 광고: 자연스러운 끝(통화·오늘의 팩·미션이 끝날 때, 채팅 몇 번 뒤 채팅 화면을 나갈 때)에만,
 *   서버가 정한 최소 간격을 두고. 학습 도중(쓰는 중·답 기다리는 중·통화 중)과 앱을 열자마자는 띄우지 않는다.
 * - 보상형 광고: 채팅 한도 안내의 "광고 보고 채팅 더". 보상은 앱이 아니라 서버가 AdMob 콜백으로 확인해서 준다.
 * - 앱 오프닝 광고: 앱을 새로 켤 때·오래(서버 값, 30분) 떠났다 돌아올 때. 설치 며칠 뒤부터, 몇 시간에 한 번까지.
 *   통화·말하는 방에 있을 때와 시트가 열려 있을 때는 띄우지 않는다.
 * - 배너: 둘러보는 화면(My·영상·대화 목록) 아래, 하단 탭 바로 위. 시트가 열리거나 글을 쓰는 동안은 숨긴다.
 *
 * 어떤 실패도 학습을 막지 않는다 — 광고가 없으면 그냥 지나간다. 구독자는 서버가 enabled=false로 답한다.
 */

type AdsConfig = {
  enabled: boolean;
  units: { interstitial: string; rewarded: string; appOpen?: string; banner?: string; native?: string };
  interstitialMinGapSeconds: number;
  interstitialAfterChats: number;
  appOpen?: { enabled: boolean; afterDays: number; gapHours: number; awayMinutes: number };
  banner?: { enabled: boolean };
  native?: { enabled: boolean };
  rewarded: { enabled: boolean; chats: number; dailyMax: number; left: number; token: string | null };
};

export type InterstitialMoment = "callEnd" | "packEnd" | "missionDone" | "chatLeave";

/** Google 데모 광고 단위(개발·내부 테스트용). `NEXT_PUBLIC_ADS_TEST=1`로 빌드하면 실제 광고 대신 이것. */
const TEST_UNITS = {
  interstitial: "ca-app-pub-3940256099942544/1033173712",
  rewarded: "ca-app-pub-3940256099942544/5224354917",
  appOpen: "ca-app-pub-3940256099942544/9257395921",
  banner: "ca-app-pub-3940256099942544/9214589741",
};
const TESTING = process.env.NEXT_PUBLIC_ADS_TEST?.trim() === "1";

const CONFIG_TTL_MS = 10 * 60 * 1000;
const LAST_SHOWN_KEY = "adsLastInterstitialAt";

let config: AdsConfig | null = null;
let configAt = 0;
let started: Promise<boolean> | null = null;
let interstitialReady = false;
let interstitialLoading = false;
/** 마지막 전면 광고 뒤 보낸 채팅 수("채팅 몇 번 뒤 나갈 때"). */
let chatsSinceInterstitial = 0;

/** 채팅 한 번을 보냈을 때(채팅 화면이 부름). */
export function noteChatSent() {
  chatsSinceInterstitial += 1;
}

function unitFor(kind: keyof typeof TEST_UNITS, cfg: AdsConfig): string {
  return TESTING ? TEST_UNITS[kind] : (cfg.units[kind] ?? "");
}

function readLastShown(): number {
  try {
    return Number(window.localStorage.getItem(LAST_SHOWN_KEY) ?? 0) || 0;
  } catch {
    return 0;
  }
}

function writeLastShown(at: number) {
  try {
    window.localStorage.setItem(LAST_SHOWN_KEY, String(at));
  } catch {
    // 기기 저장이 막혀 있으면 이번 실행 동안만 간격을 지킨다.
  }
  memoryLastShown = at;
}
let memoryLastShown = 0;

/** 서버가 정한 광고 설정. 구독자·광고 꺼짐이면 enabled=false. */
export async function loadAdsConfig(force = false): Promise<AdsConfig | null> {
  if (!adsAvailable()) return null;
  if (!force && config && Date.now() - configAt < CONFIG_TTL_MS) return config;
  try {
    const response = await fetch(apiUrl("/api/ads/config"), {
      headers: entitlementHeaders(readCachedTier() !== "free"),
    });
    if (!response.ok) return config;
    config = (await response.json()) as AdsConfig;
    configAt = Date.now();
  } catch {
    // 오프라인이면 마지막 설정 그대로(없으면 광고 없음).
  }
  return config;
}

/** 동의(EU 등에서만 창이 뜸) → SDK 시작. 한 번만. */
async function startAds(): Promise<boolean> {
  if (!adsAvailable()) return false;
  if (!started) {
    started = (async () => {
      try {
        const { AdMob, AdmobConsentStatus } = await import("@capacitor-community/admob");
        try {
          const info = await AdMob.requestConsentInfo();
          if (info.status === AdmobConsentStatus.REQUIRED && info.isConsentFormAvailable) {
            await AdMob.showConsentForm();
          }
        } catch {
          // 동의 정보를 못 받아도 SDK는 동의가 필요 없는 지역 기준으로 동작한다.
        }
        await AdMob.initialize({ initializeForTesting: TESTING });
        return true;
      } catch {
        return false;
      }
    })();
  }
  return started;
}

async function preloadInterstitial(cfg: AdsConfig) {
  if (interstitialReady || interstitialLoading) return;
  interstitialLoading = true;
  try {
    const { AdMob } = await import("@capacitor-community/admob");
    await AdMob.prepareInterstitial({ adId: unitFor("interstitial", cfg), isTesting: TESTING });
    interstitialReady = true;
  } catch {
    interstitialReady = false;
  } finally {
    interstitialLoading = false;
  }
}

/**
 * 앱이 준비된 뒤(첫 화면이 뜬 다음) 한 번 부른다. 설정을 받고, 무료면 SDK를 켜고 전면 광고를 미리 받아 둔다.
 * 여기서는 아무것도 띄우지 않는다(앱을 열자마자 광고 금지).
 */
export async function warmUpAds(): Promise<void> {
  const cfg = await loadAdsConfig();
  if (!cfg?.enabled) return;
  if (!(await startAds())) return;
  void preloadInterstitial(cfg);
}

/**
 * 자연스러운 끝에서 부른다. 조건이 맞을 때만(무료·간격·채팅 수), 미리 받아 둔 광고가 있을 때만 띄운다 —
 * 그 자리에서 광고를 받느라 화면을 붙잡지 않는다.
 */
export async function maybeShowInterstitial(moment: InterstitialMoment): Promise<void> {
  try {
    if (!adsAvailable()) return;
    if (moment === "chatLeave" && chatsSinceInterstitial === 0) return;
    const cfg = await loadAdsConfig();
    if (!cfg?.enabled) return;
    if (moment === "chatLeave" && chatsSinceInterstitial < cfg.interstitialAfterChats) return;
    const last = Math.max(readLastShown(), memoryLastShown);
    if (Date.now() - last < cfg.interstitialMinGapSeconds * 1000) return;
    if (!(await startAds())) return;
    if (!interstitialReady) {
      void preloadInterstitial(cfg);
      return;
    }
    const { AdMob } = await import("@capacitor-community/admob");
    interstitialReady = false;
    writeLastShown(Date.now());
    chatsSinceInterstitial = 0;
    await AdMob.showInterstitial();
    // 다음 끝을 위해 조금 뒤 다시 받아 둔다(닫히자마자 받으면 화면 전환과 겹침).
    window.setTimeout(() => void preloadInterstitial(cfg), 30_000);
  } catch {
    interstitialReady = false;
  }
}

export type RewardOffer = { chats: number; left: number };

/** 채팅 한도 안내에 "광고 보고 채팅 N번 더"를 보일지. 없으면 null. */
export async function rewardOffer(): Promise<RewardOffer | null> {
  const cfg = await loadAdsConfig(true);
  if (!cfg?.enabled || !cfg.rewarded.enabled || !cfg.rewarded.token || cfg.rewarded.left <= 0) return null;
  return { chats: cfg.rewarded.chats, left: cfg.rewarded.left };
}

export type RewardResult = "shown" | "unavailable" | "failed";

/**
 * 보상형 광고를 띄운다. 끝까지 보면 AdMob이 서버에 알리고, 서버가 그날 채팅을 늘린다(몇 초 걸림).
 * 화면은 이 함수가 끝난 뒤 waitForChatBonus로 늘어난 한도를 받아 온다.
 */
export async function showRewardedForChats(): Promise<RewardResult> {
  const cfg = await loadAdsConfig(true);
  if (!cfg?.enabled || !cfg.rewarded.enabled || !cfg.rewarded.token || cfg.rewarded.left <= 0) return "unavailable";
  if (!(await startAds())) return "unavailable";
  try {
    const { AdMob } = await import("@capacitor-community/admob");
    await AdMob.prepareRewardVideoAd({
      adId: unitFor("rewarded", cfg),
      isTesting: TESTING,
      ssv: { customData: cfg.rewarded.token },
    });
    await AdMob.showRewardVideoAd();
    configAt = 0; // 남은 횟수가 바뀌었으니 다음에 다시 받는다.
    return "shown";
  } catch {
    return "failed";
  }
}

/** 보상형 광고 뒤 서버가 한도를 늘릴 때까지 잠깐 기다린다. 늘었으면 새 한도, 아니면 null. */
export async function waitForChatBonus(previousLimit: number | null, attempts = 6): Promise<number | null> {
  for (let i = 0; i < attempts; i += 1) {
    await new Promise((resolve) => window.setTimeout(resolve, i === 0 ? 1500 : 2000));
    try {
      const response = await fetch(apiUrl("/api/entitlement"), {
        headers: entitlementHeaders(readCachedTier() !== "free"),
      });
      if (!response.ok) continue;
      const data = (await response.json()) as { dailyLimit?: number | null };
      if (typeof data.dailyLimit === "number" && (previousLimit === null || data.dailyLimit > previousLimit)) {
        return data.dailyLimit;
      }
    } catch {
      // 다음 시도
    }
  }
  return null;
}

// ─── 앱 오프닝 광고 ────────────────────────────────────────────────────────────

const FIRST_SEEN_KEY = "adsFirstSeenAt";
const APP_OPEN_LAST_KEY = "adsLastAppOpenAt";
/** 앱을 켤 때 광고가 이만큼 안에 준비되지 않으면 그냥 넘어간다(첫 화면을 붙잡지 않음). */
const APP_OPEN_LOAD_WAIT_MS = 4000;

function readNumber(key: string): number {
  try {
    return Number(window.localStorage.getItem(key) ?? 0) || 0;
  } catch {
    return 0;
  }
}

function writeNumber(key: string, value: number) {
  try {
    window.localStorage.setItem(key, String(value));
  } catch {
    // 저장이 막혀 있으면 이번 실행 동안만.
  }
}

/** 이 기기에서 처음 연 때(설치 며칠 뒤부터 앱 오프닝 광고). 없으면 지금으로 적는다. */
function firstSeenAt(): number {
  const seen = readNumber(FIRST_SEEN_KEY);
  if (seen) return seen;
  const now = Date.now();
  writeNumber(FIRST_SEEN_KEY, now);
  return now;
}

let appOpenLoaded = false;
let appOpenLoading: Promise<boolean> | null = null;
let memoryLastAppOpen = 0;
/** 지금 보고 있는 화면이 앱 오프닝 광고를 띄워도 되는 곳인지(통화·방이면 false, AppHome이 알려 줌). */
let appOpenAllowedHere = true;

export function setAppOpenAllowedHere(allowed: boolean) {
  appOpenAllowedHere = allowed;
}

function loadAppOpen(cfg: AdsConfig): Promise<boolean> {
  if (appOpenLoaded) return Promise.resolve(true);
  if (!appOpenLoading) {
    appOpenLoading = (async () => {
      try {
        const { AdMob } = await import("@capacitor-community/admob");
        await AdMob.loadAppOpen({ adId: unitFor("appOpen", cfg) });
        appOpenLoaded = true;
      } catch {
        appOpenLoaded = false;
      } finally {
        appOpenLoading = null;
      }
      return appOpenLoaded;
    })();
  }
  return appOpenLoading;
}

/**
 * 앱을 켤 때("launch")·오래 떠났다 돌아올 때("resume") 부른다. 조건이 하나라도 안 맞으면 아무것도 하지 않는다:
 * 무료·설정 켜짐·설치 며칠 지남·마지막 앱 오프닝 광고에서 몇 시간 지남·통화/방 아님·시트 없음·막 전면 광고를 본 직후 아님.
 */
export async function maybeShowAppOpen(_moment: "launch" | "resume"): Promise<void> {
  try {
    if (!adsAvailable()) return;
    const installedAt = firstSeenAt();
    const cfg = await loadAdsConfig();
    const rule = cfg?.appOpen;
    if (!cfg?.enabled || !rule?.enabled || !cfg.units.appOpen) return;
    const now = Date.now();
    if (now - installedAt < rule.afterDays * 24 * 60 * 60 * 1000) return;
    const last = Math.max(readNumber(APP_OPEN_LAST_KEY), memoryLastAppOpen);
    if (now - last < rule.gapHours * 60 * 60 * 1000) return;
    if (now - Math.max(readLastShown(), memoryLastShown) < 60_000) return;
    if (!appOpenAllowedHere || layersOpen > 0) return;
    if (!(await startAds())) return;
    const ready = await Promise.race([
      loadAppOpen(cfg),
      new Promise<boolean>((resolve) => window.setTimeout(() => resolve(false), APP_OPEN_LOAD_WAIT_MS)),
    ]);
    // 기다리는 동안 사용자가 통화로 들어갔거나 시트를 열었으면 띄우지 않는다(받아 둔 건 다음에).
    if (!ready || !appOpenAllowedHere || layersOpen > 0) return;
    const { AdMob } = await import("@capacitor-community/admob");
    appOpenLoaded = false;
    memoryLastAppOpen = now;
    writeNumber(APP_OPEN_LAST_KEY, now);
    await AdMob.showAppOpen();
  } catch {
    appOpenLoaded = false;
  }
}

let hiddenAt = 0;
let lifecycleWatched = false;

/** 다른 앱에 갔다가 오래(서버 값) 지나 돌아오면 앱 오프닝 광고를 시도한다. 광고 화면에서 돌아오는 건 세지 않는다. */
export function watchAppLifecycle(): () => void {
  if (!adsAvailable() || lifecycleWatched) return () => undefined;
  lifecycleWatched = true;
  const onVisibility = () => {
    if (document.visibilityState === "hidden") {
      hiddenAt = Date.now();
      return;
    }
    const away = hiddenAt ? Date.now() - hiddenAt : 0;
    hiddenAt = 0;
    const awayMinutes = config?.appOpen?.awayMinutes ?? 30;
    if (away >= awayMinutes * 60 * 1000) void maybeShowAppOpen("resume");
  };
  document.addEventListener("visibilitychange", onVisibility);
  return () => {
    document.removeEventListener("visibilitychange", onVisibility);
    lifecycleWatched = false;
  };
}

// ─── 배너 ────────────────────────────────────────────────────────────────────

/** 화면을 덮는 시트·전체 화면 수(FullScreenLayer·BodyLayer가 셈). 하나라도 있으면 배너를 숨긴다. */
let layersOpen = 0;
let bannerWanted = false;
let bannerBottomMargin = 0;
let typing = false;
let bannerState: "none" | "shown" | "hidden" = "none";
let bannerHeight = 0;
let bannerListening = false;
let bannerSync: Promise<void> = Promise.resolve();

/** 배너가 차지하는 높이를 화면이 비워 둘 수 있게 CSS 변수로(AppHome의 내용 칸이 아래 여백으로 씀). */
function publishBannerSpace(px: number) {
  try {
    document.documentElement.style.setProperty("--ad-banner-space", `${Math.max(0, Math.round(px))}px`);
  } catch {
    // 서버 렌더링 중에는 없음
  }
}

export function noteLayerOpened(): () => void {
  layersOpen += 1;
  queueBannerSync();
  syncNativeFeeds();
  return () => {
    layersOpen = Math.max(0, layersOpen - 1);
    queueBannerSync();
    syncNativeFeeds();
  };
}

/**
 * AppHome이 지금 화면이 배너를 둘 곳인지와 하단 탭 높이(배너를 그 바로 위에)를 알려 준다.
 * 하단 탭 버튼과 바로 붙지 않게 몇 픽셀 띄운다(실수 클릭 방지).
 */
export function setBannerPlacement(wanted: boolean, bottomNavHeight: number) {
  const margin = Math.round(bottomNavHeight) + 4;
  const marginChanged = bannerState !== "none" && Math.abs(margin - bannerBottomMargin) > 2;
  bannerWanted = wanted;
  bannerBottomMargin = margin;
  if (marginChanged) {
    // 위치는 다시 띄워야 바뀐다.
    bannerSync = bannerSync.then(async () => {
      try {
        const { AdMob } = await import("@capacitor-community/admob");
        await AdMob.removeBanner();
      } catch {
        // 없던 배너
      }
      bannerState = "none";
      publishBannerSpace(0);
    });
  }
  queueBannerSync();
}

function onFocusIn(event: FocusEvent) {
  const el = event.target as HTMLElement | null;
  if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable)) {
    typing = true;
    queueBannerSync();
  }
}

function onFocusOut() {
  // 다음 칸으로 옮겨 가는 사이에 깜빡이지 않게 잠깐 뒤에 본다.
  window.setTimeout(() => {
    const el = document.activeElement as HTMLElement | null;
    typing = Boolean(el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable));
    queueBannerSync();
  }, 150);
}

function queueBannerSync() {
  if (!adsAvailable()) return;
  bannerSync = bannerSync.then(syncBanner, syncBanner);
}

async function syncBanner(): Promise<void> {
  try {
    const cfg = config ?? (await loadAdsConfig());
    const show = Boolean(cfg?.enabled && cfg.banner?.enabled && cfg.units.banner) && bannerWanted && layersOpen === 0 && !typing;
    const { AdMob, BannerAdPluginEvents, BannerAdPosition, BannerAdSize } = await import("@capacitor-community/admob");
    if (!bannerListening) {
      bannerListening = true;
      document.addEventListener("focusin", onFocusIn);
      document.addEventListener("focusout", onFocusOut);
      void AdMob.addListener(BannerAdPluginEvents.SizeChanged, (size) => {
        bannerHeight = size.height;
        if (bannerState === "shown") publishBannerSpace(bannerHeight);
      });
      void AdMob.addListener(BannerAdPluginEvents.FailedToLoad, () => {
        bannerHeight = 0;
        publishBannerSpace(0);
      });
    }
    if (!show) {
      if (bannerState === "shown") {
        await AdMob.hideBanner();
        bannerState = "hidden";
      }
      publishBannerSpace(0);
      return;
    }
    if (!cfg || !(await startAds())) return;
    if (bannerState === "none") {
      await AdMob.showBanner({
        adId: unitFor("banner", cfg),
        adSize: BannerAdSize.ADAPTIVE_BANNER,
        position: BannerAdPosition.BOTTOM_CENTER,
        margin: bannerBottomMargin,
        isTesting: TESTING,
      });
    } else if (bannerState === "hidden") {
      await AdMob.resumeBanner();
    }
    bannerState = "shown";
    publishBannerSpace(bannerHeight);
  } catch {
    publishBannerSpace(0);
  }
}

// ─── 네이티브 광고(목록 사이, 앱 카드 모양) ─────────────────────────────────────
//
// 플러그인의 NativeAdFeed(미리보기 기능): 웹 화면에 자리(높이 고정 div)를 두면 그 위치를 따라 네이티브 광고 보기를 얹는다.
// 웹 화면 위에 떠 있어서 시트·전체 화면이 열리거나 탭이 숨으면 멈춰야 한다(layersOpen·active).
// 한 화면(feedId)에 광고 최대 3개, 동시에 화면 2개까지 — 대화 목록·영상 목록 둘만 쓴다.

/** 네이티브 광고 자리 높이(작은 틀, 플러그인 최소 120px). */
export const NATIVE_SLOT_HEIGHT = 120;

/** 앱의 어두운 카드와 맞춘 색(hub/DESIGN.md 토큰 값). */
const NATIVE_STYLE = {
  backgroundColor: "#121212",
  borderColor: "#FFFFFF1A",
  borderWidth: 1,
  cornerRadius: 16,
  headlineColor: "#F1F5F9",
  headlineFontSize: 14,
  bodyColor: "#94A3B8",
  bodyFontSize: 12,
  callToActionBackgroundColor: "#E8E8E4",
  callToActionTextColor: "#111111",
  callToActionFontSize: 13,
};

type NativeFeedHandle = {
  attach(slotKey: string, element: HTMLElement): void;
  detach(element: HTMLElement): void;
  pause(): Promise<void>;
  resume(): void;
  destroy(): Promise<void>;
};

type FeedEntry = { feed: Promise<NativeFeedHandle | null>; refs: number; active: boolean; paused: boolean };
const nativeFeeds = new Map<string, FeedEntry>();
const failedSlots = new Set<string>();
const failListeners = new Set<() => void>();

/** 이 사용자에게 네이티브 광고를 둘지(안드로이드·무료·서버 설정). */
export async function nativeAdsEnabled(): Promise<boolean> {
  if (!adsAvailable()) return false;
  const cfg = await loadAdsConfig();
  return Boolean(cfg?.enabled && cfg.native?.enabled && (cfg.units.native || TESTING));
}

function createFeed(feedId: string): Promise<NativeFeedHandle | null> {
  return (async () => {
    try {
      const cfg = await loadAdsConfig();
      if (!cfg?.enabled || !cfg.native?.enabled) return null;
      if (!(await startAds())) return null;
      const { NativeAdFeed, NativeAdPluginEvents, NativeAdTemplate } = await import("@capacitor-community/admob");
      const feed = await NativeAdFeed.create({
        feedId,
        template: NativeAdTemplate.Small,
        style: NATIVE_STYLE,
        ...(TESTING ? { isTesting: true } : { adId: cfg.units.native }),
      });
      // 채우지 못한 자리는 빈칸으로 남기지 않고 접는다.
      void feed.addListener(NativeAdPluginEvents.FailedToLoad, (event) => {
        failedSlots.add(`${feedId}:${event.slotKey}`);
        for (const listener of failListeners) listener();
      });
      return feed as unknown as NativeFeedHandle;
    } catch {
      return null;
    }
  })();
}

function syncNativeFeeds() {
  for (const entry of nativeFeeds.values()) {
    const show = entry.active && layersOpen === 0;
    void entry.feed.then((feed) => {
      if (!feed) return;
      if (show && entry.paused) {
        entry.paused = false;
        feed.resume();
      } else if (!show && !entry.paused) {
        entry.paused = true;
        void feed.pause().catch(() => undefined);
      }
    });
  }
}

/** 자리 하나를 광고에 붙인다. 돌려준 함수로 뗀다(마지막 자리가 떨어지면 그 화면의 광고를 모두 치움). */
export function attachNativeSlot(feedId: string, slotKey: string, element: HTMLElement): () => void {
  let entry = nativeFeeds.get(feedId);
  if (!entry) {
    entry = { feed: createFeed(feedId), refs: 0, active: true, paused: false };
    nativeFeeds.set(feedId, entry);
  }
  const current = entry;
  current.refs += 1;
  void current.feed.then((feed) => {
    feed?.attach(slotKey, element);
    syncNativeFeeds();
  });
  return () => {
    void current.feed.then((feed) => feed?.detach(element));
    current.refs -= 1;
    if (current.refs <= 0) {
      nativeFeeds.delete(feedId);
      void current.feed.then((feed) => feed?.destroy().catch(() => undefined));
    }
  };
}

/** 그 화면(탭)이 지금 보이는지. 숨으면 광고를 멈춘다(탭은 숨겨도 그려져 있어서). */
export function setNativeFeedActive(feedId: string, active: boolean) {
  const entry = nativeFeeds.get(feedId);
  if (!entry) return;
  entry.active = active;
  syncNativeFeeds();
}

export function nativeSlotFailed(feedId: string, slotKey: string): boolean {
  return failedSlots.has(`${feedId}:${slotKey}`);
}

export function watchNativeFailures(listener: () => void): () => void {
  failListeners.add(listener);
  return () => {
    failListeners.delete(listener);
  };
}
