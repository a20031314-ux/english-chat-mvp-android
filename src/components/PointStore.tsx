"use client";

import { useCallback, useEffect, useState } from "react";
import { usePremium } from "@/contexts/PremiumContext";
import {
  fetchPointBundles,
  purchasePointBundle,
  syncPurchasedPoints,
  type PointBundleOffer,
} from "@/lib/billing/billingService";
import type { UICopy } from "@/lib/copy";

/**
 * Buying points, and seeing how many are left.
 *
 * Prices come from the store, never from the app. POINT_BUNDLES holds what we
 * intend to charge; what a given person in a given country is actually shown is
 * the store's business, and the subscription paywall already learned what
 * happens when the app decides otherwise — it advertised 9,900원 while Play
 * charged 4,900 for months.
 *
 * A bundle the store does not return is not shown at all rather than shown at a
 * price we invented, so a product id that exists here and not in the console
 * fails visibly instead of selling something that cannot be bought.
 */
export function PointStore({ ui }: { ui: UICopy }) {
  const { isBillingNative } = usePremium();
  const [offers, setOffers] = useState<PointBundleOffer[] | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [busyProductId, setBusyProductId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const refreshBalance = useCallback(async () => {
    // Doubles as the catch-up sync: a purchase that completed while the app was
    // being killed is still on the store's record, and this is what collects it.
    const result = await syncPurchasedPoints();
    if (result.status === "success") setBalance(result.purchasedPoints);
  }, []);

  useEffect(() => {
    if (!isBillingNative) return;
    let cancelled = false;
    void (async () => {
      const [loaded] = await Promise.all([fetchPointBundles(), refreshBalance()]);
      if (!cancelled) setOffers(loaded);
    })();
    return () => {
      cancelled = true;
    };
  }, [isBillingNative, refreshBalance]);

  // Nothing to sell off-device: Play is the only place a purchase can happen.
  if (!isBillingNative) return null;

  const buy = async (offer: PointBundleOffer) => {
    setBusyProductId(offer.productId);
    setNotice(null);
    const result = await purchasePointBundle(offer.productId);
    setBusyProductId(null);
    if (result.status === "cancelled") return;
    if (result.status === "error") {
      setNotice(ui.pointsUnavailable);
      return;
    }
    setBalance(result.purchasedPoints);
    // Says what was credited, which is not always what was bought: a purchase
    // already counted on an earlier sync credits nothing the second time.
    setNotice(
      ui.pointsPurchased.replace("{n}", String(result.creditedPoints)),
    );
  };

  return (
    <section className="flex flex-col gap-2 border-t border-white/10 pt-4">
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-sm font-semibold text-white">
          {ui.pointsSectionTitle}
        </h3>
        {balance === null ? null : (
          <span className="text-[12px] tabular-nums text-neutral-400">
            {ui.pointsBalance.replace("{n}", String(balance))}
          </span>
        )}
      </div>

      {offers !== null && offers.length === 0 ? (
        <p className="text-[12px] text-neutral-500">{ui.pointsUnavailable}</p>
      ) : null}

      <div className="flex flex-col gap-1.5">
        {(offers ?? []).map((offer) => (
          <button
            key={offer.productId}
            type="button"
            onClick={() => void buy(offer)}
            disabled={busyProductId !== null}
            className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-left transition hover:bg-white/10 disabled:opacity-50"
          >
            <span className="text-[13px] tabular-nums text-neutral-100">
              {offer.points}P
            </span>
            <span className="text-[13px] text-neutral-300">
              {busyProductId === offer.productId ? "…" : offer.priceLabel}
            </span>
          </button>
        ))}
      </div>

      {notice ? (
        <p className="text-[12px] text-neutral-400" role="status">
          {notice}
        </p>
      ) : null}
    </section>
  );
}
