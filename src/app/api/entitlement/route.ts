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
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";

export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request);
}

export async function GET(request: NextRequest) {
  const { userId, isPremium } = await resolveRequestEntitlement(request);
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
  });
}
