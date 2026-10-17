import { SHARED_ANONYMOUS_ID } from "./identity.ts";
import { verifyAuthToken, type AuthClaims } from "./authToken.ts";
import { AUTH_TOKEN_HEADER } from "@/lib/account/shared";
import type { NextRequest } from "next/server";
import {
  PREMIUM_CLIENT_HEADER,
  REVENUECAT_USER_HEADER,
} from "@/lib/billing/config";
import {
  planInRevenueCat,
  revenueCatConfigured,
} from "@/lib/server/revenueCat";
import { isPlanTier, termsFor, type PlanTerms, type PlanTier } from "@/lib/billing/plans";

export type RequestEntitlement = {
  /** Whose counters this request spends. */
  userId: string;
  /** Any paid plan. What every feature that is simply "paid or not" reads. */
  isPremium: boolean;
  /** Which plan, for what differs between them: daily minutes, chat limits, the library. */
  tier: PlanTier;
  terms: PlanTerms;
  /** True only when RevenueCat confirmed it, rather than the client claiming it. */
  verified: boolean;
};

/**
 * Once builds that send their RevenueCat id are the ones in people's hands,
 * set REQUIRE_VERIFIED_PREMIUM=true and a bare `x-client-premium` header stops
 * being worth anything. Doing it before then would take premium away from
 * everyone still on an older build, so it is a switch rather than a rewrite.
 */
function requireVerified(): boolean {
  return process.env.REQUIRE_VERIFIED_PREMIUM?.trim() === "true";
}

/**
 * The plan the client says it is on. Builds before there were three plans send
 * "1", and the only plan there was then is premium; later builds send the
 * plan's name.
 */
function claimedTier(request: NextRequest): PlanTier {
  if (requireVerified()) return "free";
  const value = request.headers.get(PREMIUM_CLIENT_HEADER)?.trim();
  if (value === "1") return "premium";
  return isPlanTier(value) ? value : "free";
}

function withTier(userId: string, tier: PlanTier, verified: boolean): RequestEntitlement {
  return { userId, isPremium: tier !== "free", tier, terms: termsFor(tier), verified };
}

export function revenueCatUserId(request: NextRequest): string | null {
  const value = request.headers.get(REVENUECAT_USER_HEADER)?.trim();
  // Long enough for RevenueCat's anonymous ids, short enough to not be a payload.
  if (!value || value.length > 128) return null;
  return value;
}

/**
 * 로그인한 사람이면 그 계정의 기록이 묶인 id. 기기마다 RevenueCat id가 달라도
 * 같은 계정이면 같은 기록을 읽게 하는 자리 — 사용량·지도·표현 장부가 전부
 * 이 id로 키를 잡는다(server/accountStore.ts가 첫 로그인 때 정함).
 */
export function requestAuth(request: NextRequest): AuthClaims | null {
  return verifyAuthToken(request.headers.get(AUTH_TOKEN_HEADER)?.trim());
}

/** Falls back to a client-set cookie, which is only as stable as the install. */
function cookieUserId(request: NextRequest): string {
  return request.cookies.get("ec_uid")?.value ?? SHARED_ANONYMOUS_ID;
}

/**
 * Who is asking, worked out without asking RevenueCat.
 *
 * The full resolve below makes a network call to learn whether someone has
 * paid. That is worth a round trip on a route that may refuse service, and pure
 * waste on one that only wants to count — it would put a call to RevenueCat in
 * front of every word lookup to learn something the counter never reads.
 */
export function requestUserId(request: NextRequest): string {
  const auth = requestAuth(request);
  if (auth) return auth.dataUserId;
  const appUserId = revenueCatUserId(request);
  return appUserId ? `rc:${appUserId}` : cookieUserId(request);
}

/**
 * Works out who is asking and whether they have paid.
 *
 * Prefers the RevenueCat subscriber id, because that is both an identity worth
 * keying usage on and something we can check against RevenueCat. Falls back to
 * the old cookie-and-header pair for builds that predate the id being sent.
 */
export async function resolveRequestEntitlement(
  request: NextRequest,
): Promise<RequestEntitlement> {
  const appUserId = revenueCatUserId(request);
  // 구독은 RevenueCat id로 묻고(로그인하면 앱이 계정 id로 RevenueCat에 로그인함),
  // 기록은 계정에 묶인 id로 센다.
  const userId = requestUserId(request);

  if (appUserId && revenueCatConfigured()) {
    const plan = await planInRevenueCat(appUserId);
    if (plan !== null) return withTier(userId, plan, true);
    // RevenueCat could not be reached. Keep the id for counting, but fall
    // through to the claim rather than locking a subscriber out mid-outage.
    return withTier(userId, claimedTier(request), false);
  }

  return withTier(userId, claimedTier(request), false);
}
