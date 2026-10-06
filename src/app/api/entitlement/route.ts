import { NextRequest } from "next/server";
import {
  FREE_DAILY_CHAT_LIMIT,
  FREE_CATALOG_TRIAL_COUNT,
  ROLEPLAY_POINT_SECONDS,
} from "@/lib/billing/config";
import {
  monthlyImportPoints,
  monthlyVideoPrepAllowanceSeconds,
  videoPrepMinutes,
} from "@/lib/billing/videoPrep";
import {
  getCatalogTrialVideoIds,
  getDailyUsed,
  getMonthlyImportPointsUsed,
  getMonthlyVideoPrepUsed,
  roleplayCarryMs,
  roleplayPointsLeft,
} from "@/lib/server/entitlementStore";
import { isIdentified } from "@/lib/server/identity";
import { resolveRequestEntitlement } from "@/lib/server/premiumRequest";
import { kvConfigured } from "@/lib/server/kv";
import { revenueCatConfigured } from "@/lib/server/revenueCat";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";

export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request);
}

export async function GET(request: NextRequest) {
  const { userId, isPremium, verified } = await resolveRequestEntitlement(request);
  const dailyUsed = await getDailyUsed(userId);

  return jsonWithCors(request, {
    plan: isPremium ? ("pro" as const) : ("free" as const),
    dailyUsed,
    dailyLimit: isPremium ? null : FREE_DAILY_CHAT_LIMIT,
    videoPrepUsedMinutes: videoPrepMinutes(
      await getMonthlyVideoPrepUsed(userId),
    ),
    videoPrepLimitMinutes: videoPrepMinutes(
      monthlyVideoPrepAllowanceSeconds(isPremium),
    ),
    importPointsUsed: await getMonthlyImportPointsUsed(userId),
    importPointsLimit: monthlyImportPoints(isPremium),
    catalogTrialUsed: (await getCatalogTrialVideoIds(userId)).length,
    catalogTrialLimit: FREE_CATALOG_TRIAL_COUNT,
    // What the call tab can still spend: points (each buys callPointSeconds of
    // call) and minutes carried over from calls that ended inside a block
    // (entitlementStore.ts). Null for a caller nobody can be charged as, who
    // is not counted against anything and so has nothing to show.
    callPointsLeft: isIdentified(userId) ? await roleplayPointsLeft(userId, isPremium) : null,
    callCarrySeconds: isIdentified(userId)
      ? Math.floor((await roleplayCarryMs(userId, Date.now())) / 1000)
      : null,
    callPointSeconds: ROLEPLAY_POINT_SECONDS,
    // Both of these degrade quietly when their environment variables are
    // missing, so say which way they went rather than making someone read
    // the function logs to find out.
    storage: kvConfigured() ? ("kv" as const) : ("memory" as const),
    premiumSource: verified
      ? ("revenuecat" as const)
      : revenueCatConfigured()
        ? ("client-claim" as const)
        : ("client-claim-unconfigured" as const),
  });
}
