/**
 * Asks RevenueCat whether a subscriber really has the premium entitlement.
 *
 * The client used to be taken at its word: a request carrying `x-client-premium:
 * 1` was premium. That is fine while the only installs are on testers' phones
 * and worthless once the APK is public, because the header costs nothing to add
 * and what it unlocks — video preparation — is billed to us by the minute.
 *
 * Needs REVENUECAT_SECRET_KEY (a secret API key from the RevenueCat dashboard,
 * not the public SDK key the app ships with). Without it every lookup returns
 * "unknown" and the caller decides what to do, so the site keeps working before
 * the key is provisioned.
 */

import { PREMIUM_ENTITLEMENT_ID } from "@/lib/billing/config";
import { kvGetJson, kvSetJson } from "@/lib/server/kv";

/** Long enough to keep a busy session off the API, short enough that a
 *  cancellation is noticed the same day. */
const CACHE_TTL_SECONDS = 5 * 60;

const API_ROOT = "https://api.revenuecat.com/v1/subscribers";

function secretKey(): string | null {
  const key = process.env.REVENUECAT_SECRET_KEY?.trim();
  return key ? key : null;
}

export function revenueCatConfigured(): boolean {
  return secretKey() !== null;
}

type SubscriberResponse = {
  subscriber?: {
    entitlements?: Record<string, { expires_date?: string | null }>;
  };
};

function entitlementIsActive(body: SubscriberResponse): boolean {
  const entitlement = body.subscriber?.entitlements?.[PREMIUM_ENTITLEMENT_ID];
  if (!entitlement) return false;
  // A null expiry is a lifetime grant; anything else has to still be ahead of us.
  if (entitlement.expires_date === null) return true;
  if (!entitlement.expires_date) return false;
  const expiresAt = Date.parse(entitlement.expires_date);
  return Number.isFinite(expiresAt) && expiresAt > Date.now();
}

/**
 * True or false when RevenueCat answered, null when we could not find out —
 * no key configured, or the API was unreachable. Null is deliberately not
 * "false": an outage on their side should not log every paying subscriber out
 * of what they bought.
 */
export async function isPremiumInRevenueCat(
  appUserId: string,
): Promise<boolean | null> {
  const key = secretKey();
  if (!key || !appUserId) return null;

  const cacheKey = `rc:premium:${appUserId}`;
  const cached = await kvGetJson<boolean>(cacheKey);
  if (typeof cached === "boolean") return cached;

  try {
    const response = await fetch(
      `${API_ROOT}/${encodeURIComponent(appUserId)}`,
      {
        headers: { Authorization: `Bearer ${key}` },
        cache: "no-store",
      },
    );
    // An id RevenueCat has never seen is a real answer: nothing was bought.
    if (response.status === 404) {
      await kvSetJson(cacheKey, false, CACHE_TTL_SECONDS);
      return false;
    }
    if (!response.ok) {
      console.error("[revenuecat] lookup failed with", response.status);
      return null;
    }
    const body = (await response.json()) as SubscriberResponse;
    const active = entitlementIsActive(body);
    await kvSetJson(cacheKey, active, CACHE_TTL_SECONDS);
    return active;
  } catch (error) {
    console.error("[revenuecat] lookup threw", error);
    return null;
  }
}
