import { NextRequest } from "next/server";
import {
  FREE_DAILY_CHAT_LIMIT,
  FREE_DAILY_REPORT_LIMIT,
  FREE_CATALOG_TRIAL_COUNT,
} from "@/lib/billing/config";
import {
  monthlyImportPoints,
  monthlyVideoPrepAllowanceSeconds,
  videoPrepMinutes,
} from "@/lib/billing/videoPrep";
import {
  getCatalogTrialVideoIds,
  getDailyReportsUsed,
  getDailyUsed,
  getMonthlyImportPointsUsed,
  getMonthlyVideoPrepUsed,
} from "@/lib/server/entitlementStore";
import { isPremiumClientRequest } from "@/lib/server/premiumRequest";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";

function requestUserId(request: NextRequest) {
  return request.cookies.get("ec_uid")?.value ?? "local-anonymous";
}

export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request);
}

export async function GET(request: NextRequest) {
  const userId = requestUserId(request);
  const dailyUsed = getDailyUsed(userId);
  const reportsUsed = getDailyReportsUsed(userId);
  const isPremium = isPremiumClientRequest(request);

  return jsonWithCors(request, {
    plan: isPremium ? ("pro" as const) : ("free" as const),
    dailyUsed,
    dailyLimit: isPremium ? null : FREE_DAILY_CHAT_LIMIT,
    reportsUsed,
    reportLimit: isPremium ? null : FREE_DAILY_REPORT_LIMIT,
    videoPrepUsedMinutes: videoPrepMinutes(getMonthlyVideoPrepUsed(userId)),
    videoPrepLimitMinutes: videoPrepMinutes(
      monthlyVideoPrepAllowanceSeconds(isPremium),
    ),
    importPointsUsed: getMonthlyImportPointsUsed(userId),
    importPointsLimit: monthlyImportPoints(isPremium),
    catalogTrialUsed: getCatalogTrialVideoIds(userId).length,
    catalogTrialLimit: FREE_CATALOG_TRIAL_COUNT,
  });
}
