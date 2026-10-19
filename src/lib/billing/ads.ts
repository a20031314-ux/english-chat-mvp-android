/**
 * 광고: 무료 사용자에게만, 늘려 준 사용량은 광고 수익이 메우는 만큼만 (hub/drafts/ads-rewarded.md).
 *
 * - 전면 광고는 자연스러운 끝(통화·팩·미션이 끝날 때, 채팅 몇 번 뒤 화면을 나갈 때)에만, 최소 간격을 두고.
 * - 보상형 광고는 "광고 보고 채팅 더": 한 번 보면 채팅 몇 번, 하루 몇 번까지.
 * - 구독자에게는 어떤 광고도 띄우지 않는다.
 *
 * 비율·간격·상한은 앱이 서버(/api/ads/config)에서 받는다 — 실제 광고 단가와 채팅 원가를 보면서
 * Vercel 환경 변수만 바꿔 조정하고, 앱을 다시 빌드하지 않는다.
 *
 * Pure: 서버·화면·테스트가 같은 값을 읽는다.
 */

import type { PlanTier } from "./plans.ts";

/** AdMob 앱 ID(안드로이드). AndroidManifest.xml의 meta-data와 같아야 한다. */
export const ADMOB_ANDROID_APP_ID = "ca-app-pub-8959652589063151~4979642668";

/** 광고 단위(AdMob 콘솔에서 2026-10-20 만듦). 공개 값이라 코드에 둔다. */
export const ADMOB_UNITS = {
  interstitial: "ca-app-pub-8959652589063151/2248687484",
  rewarded: "ca-app-pub-8959652589063151/3513667692",
  appOpen: "ca-app-pub-8959652589063151/5222510193",
  banner: "ca-app-pub-8959652589063151/9312789287",
} as const;

/** SSV 콜백의 ad_unit은 "/" 뒤 숫자만 온다. */
export function adUnitNumber(unitId: string): string {
  return unitId.slice(unitId.lastIndexOf("/") + 1);
}

export type AdsSettings = {
  /** 꺼 두면 앱은 어떤 광고도 띄우지 않고, 보상도 주지 않는다. */
  enabled: boolean;
  /** 보상형 광고 한 번 = 채팅 몇 번. */
  rewardChats: number;
  /** 보상형 광고를 하루 몇 번까지. */
  rewardedDailyMax: number;
  /** 전면 광고 사이 최소 간격(초). */
  interstitialMinGapSeconds: number;
  /** 채팅 화면을 나갈 때 전면 광고를 띄우려면 그 화면에서 이만큼은 보냈어야 한다. */
  interstitialAfterChats: number;
  /** 앱을 열 때 광고(앱 오프닝 형식). */
  appOpenEnabled: boolean;
  /** 설치(이 기기에서 처음 연 날) 뒤 며칠이 지나야 앱 오프닝 광고를 띄우나 — 처음 쓰는 사람을 바로 놓치지 않게. */
  appOpenAfterDays: number;
  /** 앱 오프닝 광고 사이 최소 간격(시간). */
  appOpenGapHours: number;
  /** 다른 앱에 갔다 돌아올 때는 이만큼(분) 넘게 떠나 있었을 때만. */
  appOpenAwayMinutes: number;
  /** 둘러보는 화면(My·영상·대화 목록) 아래쪽 배너. 채팅·통화·말하는 방에는 없음. */
  bannerEnabled: boolean;
};

/**
 * 처음 값(보수적으로): 보상형 1회 = 채팅 5번(원가 약 10원 < 보상형 1회 수익 약 11~28원),
 * 하루 3번(무료 10 + 15 = 25번 < 라이트 30번), 전면은 5분에 한 번까지·채팅 4번 뒤.
 */
export const DEFAULT_ADS_SETTINGS: AdsSettings = {
  enabled: true,
  rewardChats: 5,
  rewardedDailyMax: 3,
  interstitialMinGapSeconds: 300,
  interstitialAfterChats: 4,
  appOpenEnabled: true,
  appOpenAfterDays: 3,
  appOpenGapHours: 4,
  appOpenAwayMinutes: 30,
  bannerEnabled: true,
};

function intFrom(value: string | undefined, fallback: number, min: number, max: number): number {
  if (value === undefined || value.trim() === "") return fallback;
  const n = Number(value);
  if (!Number.isInteger(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

function flagFrom(value: string | undefined, fallback: boolean): boolean {
  const flag = value?.trim().toLowerCase();
  if (flag === undefined || flag === "") return fallback;
  return !(flag === "0" || flag === "false" || flag === "off");
}

/**
 * 광고 1회 수익 가정(한국, AdMob eCPM 대략값, 달러). 잰 값이 아니다 — AdMob 보고서의 실제 eCPM이 쌓이면 고친다.
 * 비용 표(scripts/plan-cost.mjs → hub/costs.md)가 읽는다.
 */
export const AD_REVENUE_USD = {
  rewarded: { low: 0.008, high: 0.02 },
  interstitial: { low: 0.003, high: 0.01 },
  appOpen: { low: 0.002, high: 0.008 },
  /** 배너는 노출 1,000번에 $0.3~1. 새로고침(약 60초)마다 한 번. */
  banner: { low: 0.0003, high: 0.001 },
  source: "한국 AdMob eCPM 대략값(보상형 $8~20, 전면 $3~10), 가정 2026-10-18",
} as const;

/** 환경 변수(ADS_ENABLED, ADS_REWARD_CHATS, ADS_REWARDED_DAILY_MAX, ADS_INTERSTITIAL_GAP_SECONDS, ADS_INTERSTITIAL_AFTER_CHATS, ADS_APP_OPEN, ADS_APP_OPEN_AFTER_DAYS, ADS_APP_OPEN_GAP_HOURS, ADS_APP_OPEN_AWAY_MINUTES, ADS_BANNER)가 있으면 그것으로. */
export function adsSettings(env: Record<string, string | undefined> = process.env): AdsSettings {
  const d = DEFAULT_ADS_SETTINGS;
  const flag = env.ADS_ENABLED?.trim().toLowerCase();
  return {
    enabled: flagFrom(flag, d.enabled),
    rewardChats: intFrom(env.ADS_REWARD_CHATS, d.rewardChats, 1, 20),
    rewardedDailyMax: intFrom(env.ADS_REWARDED_DAILY_MAX, d.rewardedDailyMax, 0, 10),
    interstitialMinGapSeconds: intFrom(env.ADS_INTERSTITIAL_GAP_SECONDS, d.interstitialMinGapSeconds, 60, 3600),
    interstitialAfterChats: intFrom(env.ADS_INTERSTITIAL_AFTER_CHATS, d.interstitialAfterChats, 1, 50),
    appOpenEnabled: flagFrom(env.ADS_APP_OPEN, d.appOpenEnabled),
    appOpenAfterDays: intFrom(env.ADS_APP_OPEN_AFTER_DAYS, d.appOpenAfterDays, 0, 60),
    appOpenGapHours: intFrom(env.ADS_APP_OPEN_GAP_HOURS, d.appOpenGapHours, 1, 48),
    appOpenAwayMinutes: intFrom(env.ADS_APP_OPEN_AWAY_MINUTES, d.appOpenAwayMinutes, 5, 720),
    bannerEnabled: flagFrom(env.ADS_BANNER, d.bannerEnabled),
  };
}

/** 광고는 무료 사용자에게만. 구독(라이트·플러스·프리미엄)은 광고 없음. */
export function adsApply(tier: PlanTier, settings: AdsSettings): boolean {
  return settings.enabled && tier === "free";
}

/** 오늘 본 보상형 광고 수로 늘어나는 채팅 수. 구독자·광고 꺼짐은 0. */
export function adChatBonus(tier: PlanTier, rewardsToday: number, settings: AdsSettings): number {
  if (!adsApply(tier, settings)) return 0;
  const counted = Math.min(Math.max(0, Math.floor(rewardsToday)), settings.rewardedDailyMax);
  return counted * settings.rewardChats;
}
