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
  ensureBillingReady,
  fetchPremiumFromRevenueCat,
  initializeBilling,
  isBillingNativePlatform,
  purchaseMonthlyPremium,
  readCachedPremium,
  restorePremiumPurchases,
  writeCachedPremium,
  type BillingReadyResult,
  type BillingStepListener,
  type PurchaseFlowResult,
  type RestoreFlowResult,
} from "@/lib/billing/billingService";

type PremiumContextValue = {
  isPremium: boolean;
  isBillingNative: boolean;
  isBillingReady: boolean;
  ensureBillingReady: (onStep?: BillingStepListener) => Promise<BillingReadyResult>;
  refreshPremium: () => Promise<boolean>;
  purchasePremium: (onStep?: BillingStepListener) => Promise<PurchaseFlowResult>;
  restorePurchases: () => Promise<RestoreFlowResult>;
  setPremiumForUi: (value: boolean) => void;
};

const PremiumContext = createContext<PremiumContextValue | null>(null);

export function PremiumProvider({ children }: { children: ReactNode }) {
  const [isPremium, setIsPremium] = useState(false);
  const [isBillingNative, setIsBillingNative] = useState(false);
  const [isBillingReady, setIsBillingReady] = useState(false);

  const refreshPremium = useCallback(async () => {
    try {
      const active = await fetchPremiumFromRevenueCat();
      setIsPremium(active);
      writeCachedPremium(active);
      return active;
    } catch (error) {
      console.error("[premium] refresh failed", error);
      const cached = readCachedPremium();
      setIsPremium(cached);
      return cached;
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const boot = async () => {
      setIsPremium(readCachedPremium());
      const native = isBillingNativePlatform();
      setIsBillingNative(native);

      try {
        if (native) {
          const billing = await ensureBillingReady();
          if (!cancelled) {
            setIsBillingReady(billing.ready);
          }
        }

        const result = await initializeBilling();
        if (cancelled) {
          return;
        }
        setIsPremium(result.isPremium);
        setIsBillingNative(result.isNative);
      } catch (error) {
        console.error("[premium] init failed", error);
      }
    };

    void boot();

    return () => {
      cancelled = true;
    };
  }, []);

  const purchasePremium = useCallback(async (onStep?: BillingStepListener) => {
    const result = await purchaseMonthlyPremium(onStep);
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
      ensureBillingReady,
      refreshPremium,
      purchasePremium,
      restorePurchases,
      setPremiumForUi,
    }),
    [
      isPremium,
      isBillingNative,
      isBillingReady,
      ensureBillingReady,
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
