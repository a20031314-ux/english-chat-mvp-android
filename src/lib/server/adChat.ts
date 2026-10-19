import { adChatBonus, adsSettings } from "../billing/ads.ts";
import type { PlanTier } from "../billing/plans.ts";
import { getAdRewardsToday } from "./entitlementStore.ts";

/** 오늘 보상형 광고로 늘어난 채팅 수(무료만, billing/ads.ts). 채팅 한도를 세는 모든 곳이 같이 쓴다. */
export async function chatBonusToday(userId: string, tier: PlanTier): Promise<number> {
  const settings = adsSettings();
  if (tier !== "free" || !settings.enabled) return 0;
  return adChatBonus(tier, await getAdRewardsToday(userId), settings);
}
