"use client";

import { usePremium } from "@/contexts/PremiumContext";
import type { Locale, UICopy } from "@/lib/copy";
import { useState } from "react";

type PaywallModalProps = {
  isOpen: boolean;
  locale: Locale;
  ui: UICopy;
  onClose: () => void;
  onPremiumActivated: (message: string) => void;
  onInfoToast: (message: string) => void;
};

export function PaywallModal({
  isOpen,
  locale,
  ui,
  onClose,
  onPremiumActivated,
  onInfoToast,
}: PaywallModalProps) {
  const { isBillingNative, purchasePremium, restorePurchases } = usePremium();
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  if (!isOpen) {
    return null;
  }

  const benefits = ui.paywallBenefits.split("\n");
  const busy = isPurchasing || isRestoring;

  const handlePurchase = async () => {
    console.log("PAYWALL_PURCHASE_CLICKED");
    if (!isBillingNative) {
      onInfoToast(ui.paywallNativeOnly);
      return;
    }

    setIsPurchasing(true);
    try {
      const result = await purchasePremium();
      if (result.status === "success") {
        onPremiumActivated(ui.paywallActivatedToast);
        onClose();
        return;
      }
      if (result.status === "cancelled") {
        onInfoToast(ui.paywallCancelled);
        return;
      }
      onInfoToast(ui.paywallPurchaseFailed);
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleRestore = async () => {
    if (!isBillingNative) {
      onInfoToast(ui.paywallNativeOnly);
      return;
    }

    setIsRestoring(true);
    try {
      const result = await restorePurchases();
      if (result.status === "restored") {
        onPremiumActivated(ui.paywallRestoredToast);
        onClose();
        return;
      }
      if (result.status === "not_found") {
        onInfoToast(ui.paywallRestoreEmpty);
        return;
      }
      onInfoToast(ui.paywallPurchaseFailed);
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <PaywallOverlay onClose={onClose}>
      <div
        className="rounded-2xl bg-white p-5 shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="paywall-title"
        lang={locale}
      >
        <h2 id="paywall-title" className="text-lg font-semibold text-slate-900">
          {ui.paywallTitle}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">{ui.paywallSubtitle}</p>

        <PaywallBenefits benefits={benefits} title={ui.paywallBenefitsTitle} />

        <div className="mt-5 flex flex-col gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={handlePurchase}
            className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {isPurchasing ? ui.paywallPurchasing : ui.paywallCta}
          </button>
          {!isBillingNative ? (
            <p className="text-center text-xs text-slate-500">{ui.paywallNativeOnly}</p>
          ) : null}
          <button
            type="button"
            disabled={busy}
            onClick={handleRestore}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isRestoring ? ui.paywallRestoring : ui.paywallRestore}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={onClose}
            className="w-full rounded-lg px-3 py-2 text-sm text-slate-500 hover:text-slate-800 disabled:cursor-not-allowed"
          >
            {ui.paywallLater}
          </button>
        </div>
      </div>
    </PaywallOverlay>
  );
}

function PaywallBenefits({
  title,
  benefits,
}: {
  title: string;
  benefits: string[];
}) {
  return (
    <div className="mt-4 rounded-xl bg-slate-50 px-3 py-3">
      <p className="text-xs font-semibold text-slate-800">{title}</p>
      <ul className="mt-2 space-y-1.5 text-sm text-slate-700">
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
  );
}

function PaywallOverlay({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-sm pointer-events-auto">{children}</div>
    </div>
  );
}
