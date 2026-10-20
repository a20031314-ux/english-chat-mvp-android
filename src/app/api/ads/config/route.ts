import { NextRequest } from "next/server";
import { ADMOB_UNITS, adsApply, adsSettings } from "@/lib/billing/ads";
import { issueAdRewardToken } from "@/lib/server/adReward";
import { getAdRewardsToday } from "@/lib/server/entitlementStore";
import { isIdentified } from "@/lib/server/identity";
import { resolveRequestEntitlement } from "@/lib/server/premiumRequest";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";

/**
 * 앱이 광고를 어떻게 띄울지(billing/ads.ts). 구독자·광고 꺼짐이면 enabled=false라 앱은 아무것도 띄우지 않는다.
 * 비율·간격·상한은 여기서 오므로 Vercel 환경 변수만 바꾸면 앱 빌드 없이 바뀐다.
 */
export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request);
}

export async function GET(request: NextRequest) {
  const { userId, tier } = await resolveRequestEntitlement(request);
  const settings = adsSettings();
  const enabled = adsApply(tier, settings);
  const identified = isIdentified(userId);
  const rewardsToday = enabled && identified ? await getAdRewardsToday(userId) : 0;
  // 보상은 우리가 서명한 표가 있어야 줄 수 있다. 누군지 모르면(공용 익명) 보상형은 띄우지 않는다.
  const rewardToken = enabled && identified ? issueAdRewardToken(userId) : null;
  return jsonWithCors(request, {
    enabled,
    units: ADMOB_UNITS,
    interstitialMinGapSeconds: settings.interstitialMinGapSeconds,
    interstitialAfterChats: settings.interstitialAfterChats,
    appOpen: {
      enabled: enabled && settings.appOpenEnabled,
      afterDays: settings.appOpenAfterDays,
      gapHours: settings.appOpenGapHours,
      awayMinutes: settings.appOpenAwayMinutes,
    },
    banner: { enabled: enabled && settings.bannerEnabled },
    native: { enabled: enabled && settings.nativeEnabled },
    rewarded: {
      enabled: enabled && rewardToken !== null && settings.rewardedDailyMax > 0,
      chats: settings.rewardChats,
      dailyMax: settings.rewardedDailyMax,
      left: Math.max(0, settings.rewardedDailyMax - rewardsToday),
      token: rewardToken,
    },
  });
}
