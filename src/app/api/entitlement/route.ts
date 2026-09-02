import { NextRequest } from "next/server";
import {
  FREE_DAILY_CHAT_LIMIT,
  FREE_CATALOG_TRIAL_COUNT,
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
} from "@/lib/server/entitlementStore";
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
