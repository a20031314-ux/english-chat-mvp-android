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
import { usePremium } from "@/contexts/PremiumContext";
import { apiUrl } from "@/lib/apiBase";
import {
  isLocalPlanDebugEnabled,
  resetBillingConfigure,
} from "@/lib/billing/billingService";
import {
  FREE_DAILY_CHAT_LIMIT,
  PREMIUM_CLIENT_HEADER,
} from "@/lib/billing/config";
import { monthlyImportPoints } from "@/lib/billing/videoPrep";
import {
  getImportPointsUsed,
  IMPORT_QUOTA_CHANGED_EVENT,
} from "@/lib/billing/videoPrepQuota";
import type { Locale, UICopy } from "@/lib/copy";

type BillingUiValue = {
  isOpen: boolean;
  openBilling: () => void;
  closeBilling: () => void;
};

const BillingUiContext = createContext<BillingUiValue | null>(null);

export function useBillingUi() {
  const value = useContext(BillingUiContext);
  if (!value) {
    throw new Error("useBillingUi must be used within BillingUiProvider");
  }
  return value;
}

export function BillingOpenButton({ ui }: { ui: UICopy }) {
  const { openBilling } = useBillingUi();
  const { isPremium } = usePremium();
  return (
    <div className="ml-auto flex items-center gap-2">
      <HeaderImportPoints ui={ui} onOpen={openBilling} />
      <button
        type="button"
        onClick={openBilling}
        className="rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-slate-100 hover:bg-white/10"
      >
        {isPremium ? ui.billingPremiumLabel : ui.billingOpen}
      </button>
    </div>
  );
}

function HeaderImportPoints({
  ui,
  onOpen,
}: {
  ui: UICopy;
  onOpen: () => void;
}) {
  const { isPremium } = usePremium();
  const [used, setUsed] = useState(0);

  useEffect(() => {
    const refresh = () => setUsed(getImportPointsUsed());
    refresh();
    window.addEventListener(IMPORT_QUOTA_CHANGED_EVENT, refresh);
    window.addEventListener("focus", refresh);
    return () => {
      window.removeEventListener(IMPORT_QUOTA_CHANGED_EVENT, refresh);
      window.removeEventListener("focus", refresh);
    };
  }, []);

  const remaining = Math.max(0, monthlyImportPoints(isPremium) - used);
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={ui.headerImportPoints.replace("{remaining}", String(remaining))}
      className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-2 py-1 text-[11px] font-medium text-slate-100 hover:bg-white/10"
    >
      <PointsIcon />
      <span className="tabular-nums">{remaining}</span>
    </button>
  );
}

function PointsIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      className="h-3.5 w-3.5 shrink-0"
      aria-hidden
    >
      <circle cx="8" cy="8" r="6.35" fill="#e8e8e4" />
      <circle cx="8" cy="8" r="4.2" stroke="#121212" strokeWidth="1.15" />
      <circle cx="8" cy="8" r="1.35" fill="#121212" />
    </svg>
  );
}

export function BillingUiProvider({
  locale,
  ui,
  children,
}: {
  locale: Locale;
  ui: UICopy;
  children: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const openBilling = useCallback(() => setIsOpen(true), []);
  const closeBilling = useCallback(() => setIsOpen(false), []);
  const value = useMemo(
    () => ({ isOpen, openBilling, closeBilling }),
    [isOpen, openBilling, closeBilling],
  );

  return (
    <BillingUiContext.Provider value={value}>
      {children}
      <BillingScreen
        isOpen={isOpen}
        locale={locale}
        ui={ui}
        onClose={closeBilling}
      />
    </BillingUiContext.Provider>
  );
}

export function BillingScreen({
  isOpen,
  locale,
  ui,
  onClose,
}: {
  isOpen: boolean;
  locale: Locale;
  ui: UICopy;
  onClose: () => void;
}) {
  const {
    isPremium,
    isBillingNative,
    ensureBillingReady,
    purchasePremium,
    restorePurchases,
    refreshPremium,
    setPremiumForUi,
  } = usePremium();
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [dailyUsed, setDailyUsed] = useState(0);
  const [dailyLimit, setDailyLimit] = useState(FREE_DAILY_CHAT_LIMIT);

  useEffect(() => {
    if (!isOpen) return;
    setNotice(null);
    let cancelled = false;
    void (async () => {
      try {
        const response = await fetch(apiUrl("/api/entitlement"), {
          headers: isPremium ? { [PREMIUM_CLIENT_HEADER]: "1" } : {},
        });
        if (!response.ok || cancelled) return;
        const data = (await response.json()) as {
          dailyUsed?: number;
          dailyLimit?: number | null;
        };
        if (typeof data.dailyUsed === "number") setDailyUsed(data.dailyUsed);
        if (typeof data.dailyLimit === "number") setDailyLimit(data.dailyLimit);
      } catch {
        // keep defaults
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isOpen, isPremium]);

  if (!isOpen) return null;

  const benefits = ui.paywallBenefits.split("\n");
  const busy = isPurchasing || isRestoring;
  const statusText = isPremium
    ? ui.planPremium.replace("{limit}", "80")
    : ui.planFree
        .replace("{used}", String(dailyUsed))
        .replace("{limit}", String(dailyLimit));

  const purchaseErrorMessage = (message?: string) => {
    if (!message) return ui.paywallPurchaseFailed;
    if (message.startsWith("BILLING_TIMEOUT:")) return ui.paywallPurchaseTimeout;
    if (message === "NO_PACKAGE") return ui.paywallNoProduct;
    return ui.paywallPurchaseFailed;
  };

  const handlePurchase = async () => {
    if (!isBillingNative) {
      setNotice(ui.paywallNativeOnly);
      return;
    }
    setIsPurchasing(true);
    setNotice(null);
    try {
      let billing = await ensureBillingReady();
      if (!billing.ready) {
        resetBillingConfigure();
        billing = await ensureBillingReady();
      }
      if (!billing.ready) {
        setNotice(ui.paywallPurchaseFailed);
        return;
      }
      const result = await purchasePremium();
      if (result.status === "success") {
        setNotice(ui.paywallActivatedToast);
        void refreshPremium();
        return;
      }
      if (result.status === "cancelled") {
        setNotice(ui.paywallCancelled);
        return;
      }
      setNotice(purchaseErrorMessage(result.message));
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleRestore = async () => {
    if (!isBillingNative) {
      setNotice(ui.paywallNativeOnly);
      return;
    }
    setIsRestoring(true);
    setNotice(null);
    try {
      const billing = await ensureBillingReady();
      if (!billing.ready) {
        setNotice(ui.paywallPurchaseFailed);
        return;
      }
      const result = await restorePurchases();
      if (result.status === "restored") {
        setNotice(ui.paywallRestoredToast);
        void refreshPremium();
        return;
      }
      if (result.status === "not_found") {
        setNotice(ui.paywallRestoreEmpty);
        return;
      }
      setNotice(ui.paywallPurchaseFailed);
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex flex-col bg-black">
      <header className="flex shrink-0 items-center gap-2 border-b border-white/10 px-3 py-3">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg px-2 py-1.5 text-sm text-slate-300 hover:bg-white/10 hover:text-white"
        >
          ← {ui.billingClose}
        </button>
        <h1
          id="billing-screen-title"
          className="text-base font-semibold text-white"
        >
          {ui.billingScreenTitle}
        </h1>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5">
        <section
          className="mx-auto w-full max-w-md"
          role="dialog"
          aria-labelledby="billing-screen-title"
          lang={locale}
        >
          <div className="rounded-2xl border border-white/10 bg-[#121212] px-4 py-4">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              {isPremium ? ui.billingPremiumLabel : ui.billingFreeLabel}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-slate-200">
              {statusText}
            </p>
          </div>

          <h2 className="mt-6 text-lg font-semibold text-white">
            {ui.paywallTitle}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-300">
            {ui.paywallSubtitle}
          </p>

          <div className="mt-4 rounded-xl bg-white/5 px-3 py-3">
            <p className="text-xs font-semibold text-slate-100">
              {ui.paywallBenefitsTitle}
            </p>
            <ul className="mt-2 space-y-1.5 text-sm text-slate-300">
              {benefits.map((line) => (
                <li key={line} className="flex gap-2">
                  <span className="text-slate-400" aria-hidden>
                    ·
                  </span>
                  <span>{line.replace(/^[-•]\s*/, "")}</span>
                </li>
              ))}
            </ul>
          </div>

          {isLocalPlanDebugEnabled() ? (
            <div className="mt-4 flex overflow-hidden rounded-full border border-white/10 text-[11px] font-medium">
              <button
                type="button"
                onClick={() => setPremiumForUi(false)}
                className={`flex-1 px-3 py-1.5 ${
                  !isPremium
                    ? "bg-[#e8e8e4] text-neutral-900"
                    : "bg-[#121212] text-slate-300 hover:bg-white/10"
                }`}
              >
                {ui.billingFreeLabel}
              </button>
              <button
                type="button"
                onClick={() => setPremiumForUi(true)}
                className={`flex-1 px-3 py-1.5 ${
                  isPremium
                    ? "bg-[#e8e8e4] text-neutral-900"
                    : "bg-[#121212] text-slate-300 hover:bg-white/10"
                }`}
              >
                {ui.billingPremiumLabel}
              </button>
            </div>
          ) : null}

          <div className="mt-5 flex flex-col gap-2">
            <button
              type="button"
              disabled={busy || isPremium}
              onClick={() => void handlePurchase()}
              className="w-full rounded-xl bg-[#e8e8e4] px-4 py-3 text-sm font-medium text-neutral-900 shadow-[0_0_16px_rgba(255,255,255,0.28)] transition hover:bg-[#f5f5f3] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
            >
              {isPremium
                ? ui.billingPremiumLabel
                : isPurchasing
                  ? ui.paywallPurchasing
                  : ui.paywallCta}
            </button>
            {!isBillingNative ? (
              <p className="text-center text-xs text-slate-500">
                {ui.paywallNativeOnly}
              </p>
            ) : null}
            <button
              type="button"
              disabled={busy}
              onClick={() => void handleRestore()}
              className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-slate-200 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isRestoring ? ui.paywallRestoring : ui.paywallRestore}
            </button>
            {notice ? (
              <p className="text-center text-sm text-slate-300">{notice}</p>
            ) : null}
          </div>
        </section>
      </div>
    </div>
  );
}
