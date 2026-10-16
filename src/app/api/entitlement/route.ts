import { NextRequest } from "next/server";
import {
  FREE_CATALOG_TRIAL_COUNT,
  ROLEPLAY_POINT_SECONDS,
  VIDEO_IMPORT_POINT_SECONDS,
} from "@/lib/billing/config";
import { videoPrepMinutes } from "@/lib/billing/videoPrep";
import { localDay, PAID_TIERS, parseOffset, termsFor, TZ_OFFSET_HEADER } from "@/lib/billing/plans";
import {
  getCatalogTrialVideoIds,
  getDailyUsed,
  getMonthlyImportPointsUsed,
  getMonthlyVideoPrepUsed,
  dailyCallLeftMs,
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
  const { userId, isPremium, verified, tier, terms } = await resolveRequestEntitlement(request);
  const dailyUsed = await getDailyUsed(userId);
  const identified = isIdentified(userId);
  const todayLeftMs = identified
    ? await dailyCallLeftMs(
        userId,
        terms,
        localDay(Date.now(), parseOffset(request.headers.get(TZ_OFFSET_HEADER))),
      )
    : null;

  return jsonWithCors(request, {
    // "pro" for any paid plan: builds before there were three plans read only this.
    plan: isPremium ? ("pro" as const) : ("free" as const),
    // Which plan (billing/plans.ts), and what it gives.
    tier,
    dailyUsed,
    dailyLimit: terms.dailyChat,
    // Free talk a day on this plan, and what is left of today's. Null on a plan
    // without daily minutes (free, and premium before its switch).
    callDailyMinutes: terms.dailyCallMinutes,
    callTodayLeftSeconds: todayLeftMs === null ? null : Math.floor(todayLeftMs / 1000),
    libraryOpen: terms.libraryOpen,
    extraPacks: terms.extraPacks,
    // What each plan gives today, for the plan screen. From here rather than
    // from the build, so premium's switch to daily minutes shows the day it
    // happens on every installed version.
    plans: Object.fromEntries(
      PAID_TIERS.map((one) => {
        const t = termsFor(one);
        return [one, { dailyCallMinutes: t.dailyCallMinutes, dailyChat: t.dailyChat, libraryOpen: t.libraryOpen, extraPacks: t.extraPacks, monthlyGrantPoints: t.monthlyGrantPoints }];
      }),
    ),
    videoPrepUsedMinutes: videoPrepMinutes(
      await getMonthlyVideoPrepUsed(userId),
    ),
    videoPrepLimitMinutes: videoPrepMinutes(
      terms.monthlyGrantPoints * VIDEO_IMPORT_POINT_SECONDS,
    ),
    importPointsUsed: await getMonthlyImportPointsUsed(userId),
    importPointsLimit: terms.monthlyGrantPoints,
    catalogTrialUsed: (await getCatalogTrialVideoIds(userId)).length,
    catalogTrialLimit: FREE_CATALOG_TRIAL_COUNT,
    // What the call tab can still spend: points (each buys callPointSeconds of
    // call) and minutes carried over from calls that ended inside a block
    // (entitlementStore.ts). Null for a caller nobody can be charged as, who
    // is not counted against anything and so has nothing to show.
    callPointsLeft: identified ? await roleplayPointsLeft(userId, terms) : null,
    callCarrySeconds: identified
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
