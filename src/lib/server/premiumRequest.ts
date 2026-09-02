import type { NextRequest } from "next/server";
import {
  PREMIUM_CLIENT_HEADER,
  REVENUECAT_USER_HEADER,
} from "@/lib/billing/config";
import {
  isPremiumInRevenueCat,
  revenueCatConfigured,
} from "@/lib/server/revenueCat";

export type RequestEntitlement = {
  /** Whose counters this request spends. */
  userId: string;
  isPremium: boolean;
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

function claimsPremium(request: NextRequest): boolean {
  return request.headers.get(PREMIUM_CLIENT_HEADER) === "1";
}

function revenueCatUserId(request: NextRequest): string | null {
  const value = request.headers.get(REVENUECAT_USER_HEADER)?.trim();
  // Long enough for RevenueCat's anonymous ids, short enough to not be a payload.
  if (!value || value.length > 128) return null;
  return value;
}

/** Falls back to a client-set cookie, which is only as stable as the install. */
function cookieUserId(request: NextRequest): string {
  return request.cookies.get("ec_uid")?.value ?? "local-anonymous";
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

  if (appUserId && revenueCatConfigured()) {
    const active = await isPremiumInRevenueCat(appUserId);
    if (active !== null) {
      return { userId: `rc:${appUserId}`, isPremium: active, verified: true };
    }
    // RevenueCat could not be reached. Keep the id for counting, but fall
    // through to the claim rather than locking a subscriber out mid-outage.
    return {
      userId: `rc:${appUserId}`,
      isPremium: requireVerified() ? false : claimsPremium(request),
      verified: false,
    };
  }

  return {
    userId: appUserId ? `rc:${appUserId}` : cookieUserId(request),
    isPremium: requireVerified() ? false : claimsPremium(request),
    verified: false,
  };
}
