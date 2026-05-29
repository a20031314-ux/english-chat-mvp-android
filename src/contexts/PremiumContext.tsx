"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  fetchPremiumFromRevenueCat,
  initializeBilling,
  isBillingNativePlatform,
  purchaseMonthlyPremium,
  readCachedPremium,
  restorePremiumPurchases,
  writeCachedPremium,
  type PurchaseFlowResult,
  type RestoreFlowResult,
} from "@/lib/billing/billingService";

type PremiumContextValue = {
  isPremium: boolean;
  isBillingNative: boolean;
  isBillingReady: boolean;
  refreshPremium: () => Promise<boolean>;
  purchasePremium: () => Promise<PurchaseFlowResult>;
  restorePurchases: () => Promise<RestoreFlowResult>;
  setPremiumForUi: (value: boolean) => void;
};

const PremiumContext = createContext<PremiumContextValue | null>(null);

export function PremiumProvider({ children }: { children: ReactNode }) {
  const [isPremium, setIsPremium] = useState(false);
  const [isBillingNative, setIsBillingNative] = useState(false);
  const [isBillingReady, setIsBillingReady] = useState(false);

  const refreshPremium = useCallback(async () => {
    const active = await fetchPremiumFromRevenueCat();
    setIsPremium(active);
    writeCachedPremium(active);
    return active;
  }, []);

  useEffect(() => {
    let cancelled = false;

    const boot = async () => {
      setIsPremium(readCachedPremium());
      setIsBillingNative(isBillingNativePlatform());

      try {
        const result = await initializeBilling();
        if (cancelled) {
          return;
        }
        setIsPremium(result.isPremium);
        setIsBillingNative(result.isNative);
      } catch (error) {
        console.error("[premium] init failed", error);
      } finally {
        if (!cancelled) {
          setIsBillingReady(true);
        }
      }
    };

    void boot();

    return () => {
      cancelled = true;
    };
  }, []);

  const purchasePremium = useCallback(async () => {
    const result = await purchaseMonthlyPremium();
    if (result.status === "success") {
      setIsPremium(true);
    }
    return result;
  }, []);

  const restorePurchases = useCallback(async () => {
    const result = await restorePremiumPurchases();
    if (result.status === "restored") {
      setIsPremium(true);
    } else if (result.status === "not_found") {
      setIsPremium(false);
      writeCachedPremium(false);
    }
    return result;
  }, []);

  const setPremiumForUi = useCallback((value: boolean) => {
    setIsPremium(value);
    writeCachedPremium(value);
  }, []);

  const value = useMemo(
    () => ({
      isPremium,
      isBillingNative,
      isBillingReady,
      refreshPremium,
      purchasePremium,
      restorePurchases,
      setPremiumForUi,
    }),
    [
      isPremium,
      isBillingNative,
      isBillingReady,
      refreshPremium,
      purchasePremium,
      restorePurchases,
      setPremiumForUi,
    ],
  );

  return (
    <PremiumContext.Provider value={value}>{children}</PremiumContext.Provider>
  );
}

export function usePremium(): PremiumContextValue {
  const context = useContext(PremiumContext);
  if (!context) {
    throw new Error("usePremium must be used within PremiumProvider");
  }
  return context;
}
