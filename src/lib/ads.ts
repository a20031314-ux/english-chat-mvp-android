import { apiUrl } from "@/lib/apiBase";
import { entitlementHeaders, readCachedTier } from "@/lib/billing/billingService";
import { adsAvailable } from "@/lib/platform";

/**
 * 광고(AdMob) — 무료 사용자에게만, 안드로이드 앱에서만(hub/drafts/ads-rewarded.md, 서버 billing/ads.ts).
 *
 * - 전면 광고: 자연스러운 끝(통화·오늘의 팩·미션이 끝날 때, 채팅 몇 번 뒤 채팅 화면을 나갈 때)에만,
 *   서버가 정한 최소 간격을 두고. 학습 도중(쓰는 중·답 기다리는 중·통화 중)과 앱을 열자마자는 띄우지 않는다.
 * - 보상형 광고: 채팅 한도 안내의 "광고 보고 채팅 더". 보상은 앱이 아니라 서버가 AdMob 콜백으로 확인해서 준다.
 *
 * 어떤 실패도 학습을 막지 않는다 — 광고가 없으면 그냥 지나간다. 구독자는 서버가 enabled=false로 답한다.
 */

type AdsConfig = {
  enabled: boolean;
  units: { interstitial: string; rewarded: string };
  interstitialMinGapSeconds: number;
  interstitialAfterChats: number;
  rewarded: { enabled: boolean; chats: number; dailyMax: number; left: number; token: string | null };
};

export type InterstitialMoment = "callEnd" | "packEnd" | "missionDone" | "chatLeave";

/** Google 데모 광고 단위(개발·내부 테스트용). `NEXT_PUBLIC_ADS_TEST=1`로 빌드하면 실제 광고 대신 이것. */
const TEST_UNITS = {
  interstitial: "ca-app-pub-3940256099942544/1033173712",
  rewarded: "ca-app-pub-3940256099942544/5224354917",
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

function unitFor(kind: "interstitial" | "rewarded", cfg: AdsConfig): string {
  return TESTING ? TEST_UNITS[kind] : cfg.units[kind];
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
