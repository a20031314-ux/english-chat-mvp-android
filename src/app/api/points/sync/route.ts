import { NextRequest } from "next/server";
import { pointsForProduct } from "@/lib/billing/cost";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import {
  creditPurchaseOnce,
  getPurchasedPoints,
} from "@/lib/server/entitlementStore";
import {
  resolveRequestEntitlement,
  revenueCatUserId,
} from "@/lib/server/premiumRequest";
import {
  fetchNonSubscriptions,
  revenueCatConfigured,
} from "@/lib/server/revenueCat";

export const dynamic = "force-dynamic";

export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request);
}

/**
 * Turns point purchases into a balance.
 *
 * RevenueCat records that someone bought a bundle; it does not track whether
 * they have spent it, and says so — keeping count of consumables is the app's
 * job. So this asks what they have bought, credits anything not credited
 * before, and returns the balance.
 *
 * Called after a purchase completes and again on launch, because a purchase can
 * finish while the app is being killed, and the store will still have it. That
 * is also why crediting is keyed on the transaction id rather than on the call:
 * syncing twice must not pay twice.
 *
 * Never trusts the client for what was bought. The client says who it is; what
 * that person owns comes from RevenueCat over a secret key, because the whole
 * point of a balance is that it cannot be granted by asking nicely.
 */
export async function POST(request: NextRequest) {
  const { userId } = await resolveRequestEntitlement(request);
  const appUserId = revenueCatUserId(request);

  if (!appUserId) {
    // No RevenueCat id means an older build, or the web. Nothing to look up.
    return jsonWithCors(request, {
      ok: true,
      credited: 0,
      purchasedPoints: await getPurchasedPoints(userId),
    });
  }

  if (!revenueCatConfigured()) {
    // Without the secret key there is no way to tell a real purchase from a
    // claim, so nothing is credited. Loud, because a subscriber who paid and
    // saw no points will report it as the app losing their money.
    console.error("[points-sync] REVENUECAT_SECRET_KEY missing; not crediting");
    return jsonWithCors(
      request,
      { error: "PURCHASES_UNVERIFIABLE" },
      { status: 503 },
    );
  }

  const purchases = await fetchNonSubscriptions(appUserId);
  if (purchases === null) {
    // Could not find out, which is not the same as "bought nothing". Saying so
    // lets the app try again instead of showing a balance that is missing money.
    return jsonWithCors(request, { error: "LOOKUP_FAILED" }, { status: 502 });
  }

  let credited = 0;
  for (const purchase of purchases) {
    const points = pointsForProduct(purchase.productId);
    if (points === null) {
      // A product RevenueCat knows and this build does not. Almost always a
      // console and code that disagree about an id, which is worth seeing.
      console.error("[points-sync] unknown product", purchase.productId);
      continue;
    }
    if (await creditPurchaseOnce(userId, purchase.transactionId, points)) {
      credited += points;
      console.log("[points-sync] credited", {
        userId,
        productId: purchase.productId,
        points,
      });
    }
  }

  return jsonWithCors(request, {
    ok: true,
    credited,
    purchasedPoints: await getPurchasedPoints(userId),
  });
}
