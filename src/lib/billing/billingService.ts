import { Capacitor } from "@capacitor/core";
import type { CustomerInfo, PurchasesPackage } from "@revenuecat/purchases-capacitor";
import {
  PREMIUM_CACHE_STORAGE_KEY,
  PREMIUM_ENTITLEMENT_ID,
  PREMIUM_MONTHLY_PRODUCT_ID,
} from "./config";

export type BillingInitResult = {
  isPremium: boolean;
  isNative: boolean;
};

export type PurchaseFlowResult =
  | { status: "success"; isPremium: true }
  | { status: "cancelled" }
  | { status: "error"; message?: string };

export type RestoreFlowResult =
  | { status: "restored"; isPremium: true }
  | { status: "not_found" }
  | { status: "error"; message?: string };

function isDevPremiumOverrideEnabled(): boolean {
  return process.env.NEXT_PUBLIC_BILLING_DEV_PREMIUM === "true";
}

export function isBillingNativePlatform(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  return Capacitor.isNativePlatform();
}

export function readCachedPremium(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  if (isDevPremiumOverrideEnabled()) {
    return true;
  }
  try {
    return window.localStorage.getItem(PREMIUM_CACHE_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export function writeCachedPremium(isPremium: boolean): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.localStorage.setItem(PREMIUM_CACHE_STORAGE_KEY, isPremium ? "1" : "0");
  } catch {
    // ignore
  }
}

export function isPremiumFromCustomerInfo(customerInfo: CustomerInfo): boolean {
  return customerInfo.entitlements.active[PREMIUM_ENTITLEMENT_ID] !== undefined;
}

function getRevenueCatApiKey(): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  const platform = Capacitor.getPlatform();
  if (platform === "android") {
    return process.env.NEXT_PUBLIC_REVENUECAT_ANDROID_API_KEY?.trim() || null;
  }
  if (platform === "ios") {
    return process.env.NEXT_PUBLIC_REVENUECAT_IOS_API_KEY?.trim() || null;
  }
  return null;
}

async function loadPurchases() {
  if (!isBillingNativePlatform()) {
    return null;
  }
  const { Purchases } = await import("@revenuecat/purchases-capacitor");
  return Purchases;
}

let configurePromise: Promise<void> | null = null;

async function ensureConfigured(): Promise<boolean> {
  if (!isBillingNativePlatform()) {
    return false;
  }

  const apiKey = getRevenueCatApiKey();
  if (!apiKey) {
    console.warn("[billing] RevenueCat API key missing for this platform.");
    return false;
  }

  if (!configurePromise) {
    configurePromise = (async () => {
      const Purchases = await loadPurchases();
      if (!Purchases) {
        return;
      }
      await Purchases.configure({ apiKey });
    })();
  }

  try {
    await configurePromise;
    return true;
  } catch (error) {
    console.error("[billing] configure failed", error);
    configurePromise = null;
    return false;
  }
}

export async function initializeBilling(): Promise<BillingInitResult> {
  if (isDevPremiumOverrideEnabled()) {
    writeCachedPremium(true);
    return { isPremium: true, isNative: isBillingNativePlatform() };
  }

  if (!isBillingNativePlatform()) {
    writeCachedPremium(false);
    return { isPremium: false, isNative: false };
  }

  const ready = await ensureConfigured();
  if (!ready) {
    const cached = readCachedPremium();
    return { isPremium: cached, isNative: true };
  }

  const isPremium = await fetchPremiumFromRevenueCat();
  writeCachedPremium(isPremium);
  return { isPremium, isNative: true };
}

export async function fetchPremiumFromRevenueCat(): Promise<boolean> {
  if (!isBillingNativePlatform()) {
    return isDevPremiumOverrideEnabled();
  }

  const ready = await ensureConfigured();
  if (!ready) {
    return readCachedPremium();
  }

  try {
    const Purchases = await loadPurchases();
    if (!Purchases) {
      return readCachedPremium();
    }
    const { customerInfo } = await Purchases.getCustomerInfo();
    const isPremium = isPremiumFromCustomerInfo(customerInfo);
    writeCachedPremium(isPremium);
    return isPremium;
  } catch (error) {
    console.error("[billing] getCustomerInfo failed", error);
    return readCachedPremium();
  }
}

export async function findMonthlyPackage(): Promise<PurchasesPackage | null> {
  if (!isBillingNativePlatform()) {
    return null;
  }

  const ready = await ensureConfigured();
  if (!ready) {
    return null;
  }

  try {
    const Purchases = await loadPurchases();
    if (!Purchases) {
      return null;
    }

    const offerings = await Purchases.getOfferings();
    const current = offerings.current;
    if (!current) {
      return null;
    }

    const fromPackages = current.availablePackages.find(
      (pkg) =>
        pkg.product.identifier === PREMIUM_MONTHLY_PRODUCT_ID ||
        pkg.identifier === PREMIUM_MONTHLY_PRODUCT_ID,
    );
    if (fromPackages) {
      return fromPackages;
    }

    if (current.monthly) {
      return current.monthly;
    }

    return current.availablePackages[0] ?? null;
  } catch (error) {
    console.error("[billing] getOfferings failed", error);
    return null;
  }
}

function isPurchaseCancelledError(error: unknown): boolean {
  if (!error || typeof error !== "object") {
    return false;
  }
  const record = error as { code?: string; userCancelled?: boolean | null };
  if (record.userCancelled === true) {
    return true;
  }
  return record.code === "1" || record.code === "PURCHASE_CANCELLED_ERROR";
}

export async function purchaseMonthlyPremium(): Promise<PurchaseFlowResult> {
  if (!isBillingNativePlatform()) {
    return { status: "error", message: "NOT_NATIVE" };
  }

  const monthlyPackage = await findMonthlyPackage();
  if (!monthlyPackage) {
    return { status: "error", message: "NO_PACKAGE" };
  }

  try {
    console.log("REVENUECAT_PURCHASE_START");
    const Purchases = await loadPurchases();
    if (!Purchases) {
      return { status: "error" };
    }

    const { customerInfo } = await Purchases.purchasePackage({
      aPackage: monthlyPackage,
    });
    const isPremium = isPremiumFromCustomerInfo(customerInfo);
    writeCachedPremium(isPremium);
    if (isPremium) {
      console.log("REVENUECAT_PURCHASE_SUCCESS");
      return { status: "success", isPremium: true };
    }
    console.log("REVENUECAT_PURCHASE_ERROR");
    return { status: "error", message: "ENTITLEMENT_INACTIVE" };
  } catch (error) {
    if (isPurchaseCancelledError(error)) {
      console.log("REVENUECAT_PURCHASE_ERROR");
      return { status: "cancelled" };
    }
    console.error("[billing] purchase failed", error);
    console.log("REVENUECAT_PURCHASE_ERROR");
    return { status: "error" };
  }
}

export async function restorePremiumPurchases(): Promise<RestoreFlowResult> {
  if (!isBillingNativePlatform()) {
    return { status: "error", message: "NOT_NATIVE" };
  }

  const ready = await ensureConfigured();
  if (!ready) {
    return { status: "error" };
  }

  try {
    const Purchases = await loadPurchases();
    if (!Purchases) {
      return { status: "error" };
    }

    const { customerInfo } = await Purchases.restorePurchases();
    const isPremium = isPremiumFromCustomerInfo(customerInfo);
    writeCachedPremium(isPremium);
    if (isPremium) {
      return { status: "restored", isPremium: true };
    }
    return { status: "not_found" };
  } catch (error) {
    console.error("[billing] restore failed", error);
    return { status: "error" };
  }
}
