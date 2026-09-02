import { Capacitor } from "@capacitor/core";
import {
  Purchases,
  type CustomerInfo,
  type PurchasesPackage,
  type PurchasesStoreProduct,
  type SubscriptionOption,
} from "@revenuecat/purchases-capacitor";
import {
  PREMIUM_CACHE_STORAGE_KEY,
  PREMIUM_CLIENT_HEADER,
  PREMIUM_ENTITLEMENT_ID,
  PREMIUM_MONTHLY_PRODUCT_ID,
  REVENUECAT_USER_HEADER,
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

const BILLING_CONFIGURE_TIMEOUT_MS = 20_000;
const BILLING_FETCH_TIMEOUT_MS = 30_000;
const BILLING_PURCHASE_TIMEOUT_MS = 120_000;

async function withBillingTimeout<T>(
  label: string,
  promise: Promise<T>,
  timeoutMs: number,
): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<T>((_, reject) => {
        timeoutId = setTimeout(() => {
          reject(new Error(`BILLING_TIMEOUT:${label}`));
        }, timeoutMs);
      }),
    ]);
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
}

type PurchaseTarget =
  | { kind: "package"; value: PurchasesPackage }
  | { kind: "subscriptionOption"; value: SubscriptionOption }
  | { kind: "product"; value: PurchasesStoreProduct };

export type BillingStepListener = (step: string) => void;

export type BillingReadyResult = {
  ready: boolean;
  step: string;
  reason: string | null;
};

function formatBillingError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (error && typeof error === "object") {
    const record = error as Record<string, unknown>;
    if (typeof record.message === "string" && record.message) {
      return record.message;
    }
    if (typeof record.errorMessage === "string" && record.errorMessage) {
      return record.errorMessage;
    }
    try {
      return JSON.stringify(error);
    } catch {
      return String(error);
    }
  }
  return String(error);
}

function reportStep(onStep: BillingStepListener | undefined, step: string): void {
  if (onStep) {
    onStep(step);
  }
}

function isDevPremiumOverrideEnabled(): boolean {
  return process.env.NEXT_PUBLIC_BILLING_DEV_PREMIUM === "true";
}

/** localhost `next dev` only — never shipped in production builds. */
export function isLocalPlanDebugEnabled(): boolean {
  return process.env.NODE_ENV === "development";
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

/**
 * Never return the Capacitor plugin object from an `async` function.
 * Promise resolution treats plugin Proxies as thenables (via `.then`) and
 * hangs forever waiting for a native method named "then".
 */
function getPurchasesPlugin() {
  if (!isBillingNativePlatform()) {
    return null;
  }
  if (!Capacitor.isPluginAvailable("Purchases")) {
    return null;
  }
  return Purchases;
}

let configurePromise: Promise<void> | null = null;
let lastConfigureStep = "IDLE";
let lastConfigureError: string | null = null;

export function resetBillingConfigure(): void {
  configurePromise = null;
}


/**
 * The RevenueCat subscriber id for this install, remembered once billing has
 * configured. The server uses it to ask RevenueCat what this user actually
 * bought, rather than believing a header, and counts usage against it.
 */
let cachedAppUserId: string | null = null;

export function revenueCatUserId(): string | null {
  return cachedAppUserId;
}

/** Headers that tell the API who is asking. Safe to call before billing is ready. */
export function entitlementHeaders(isPremium?: boolean): Record<string, string> {
  const headers: Record<string, string> = {};
  if (isPremium) headers[PREMIUM_CLIENT_HEADER] = "1";
  if (cachedAppUserId) headers[REVENUECAT_USER_HEADER] = cachedAppUserId;
  return headers;
}

async function ensureConfigured(onStep?: BillingStepListener): Promise<boolean> {
  if (!isBillingNativePlatform()) {
    lastConfigureStep = "NOT_NATIVE";
    lastConfigureError = "NOT_NATIVE";
    return false;
  }

  const apiKey = getRevenueCatApiKey();
  if (!apiKey) {
    lastConfigureError = "NO_API_KEY";
    reportStep(onStep, "NO_API_KEY");
    console.warn("[billing] RevenueCat API key missing for this platform.");
    return false;
  }

  if (!configurePromise) {
    configurePromise = (async () => {
      lastConfigureStep = "CHECKING_PLUGIN";
      reportStep(onStep, "CHECKING_PLUGIN");
      const plugin = getPurchasesPlugin();
      if (!plugin) {
        lastConfigureError = "PLUGIN_UNAVAILABLE";
        throw new Error("Purchases plugin unavailable");
      }

      lastConfigureStep = "CALLING_CONFIGURE";
      lastConfigureError = null;
      reportStep(onStep, "CALLING_CONFIGURE");
      await withBillingTimeout(
        "configure",
        plugin.configure({ apiKey }),
        BILLING_CONFIGURE_TIMEOUT_MS,
      );
      lastConfigureStep = "CONFIGURED";
      lastConfigureError = null;
      try {
        const { appUserID } = await plugin.getAppUserID();
        cachedAppUserId = appUserID?.trim() || null;
      } catch (error) {
        console.warn("[billing] could not read the RevenueCat user id", error);
      }
    })();
  }

  try {
    await configurePromise;
    reportStep(onStep, "CONFIGURED");
    return true;
  } catch (error) {
    lastConfigureStep = "CONFIGURE_FAILED";
    lastConfigureError = formatBillingError(error);
    reportStep(onStep, `CONFIGURE_FAILED:${lastConfigureError}`);
    console.error("[billing] configure failed", error);
    configurePromise = null;
    return false;
  }
}

/** Wait until RevenueCat Purchases.configure() has completed. Safe to call before purchase. */
export async function ensureBillingReady(
  onStep?: BillingStepListener,
): Promise<BillingReadyResult> {
  if (isDevPremiumOverrideEnabled()) {
    return { ready: true, step: "DEV_OVERRIDE", reason: null };
  }
  if (!isBillingNativePlatform()) {
    return { ready: false, step: "NOT_NATIVE", reason: "NOT_NATIVE" };
  }
  const ready = await ensureConfigured(onStep);
  return {
    ready,
    step: lastConfigureStep,
    reason: lastConfigureError,
  };
}

export async function initializeBilling(): Promise<BillingInitResult> {
  if (isDevPremiumOverrideEnabled()) {
    writeCachedPremium(true);
    return { isPremium: true, isNative: isBillingNativePlatform() };
  }

  if (!isBillingNativePlatform()) {
    const cached = readCachedPremium();
    return { isPremium: cached, isNative: false };
  }

  const ready = await ensureConfigured();
  if (!ready) {
    const cached = readCachedPremium();
    return { isPremium: cached, isNative: true };
  }

  const cached = readCachedPremium();
  void fetchPremiumFromRevenueCat().catch((error) => {
    console.error("[billing] background premium refresh failed", error);
  });
  return { isPremium: cached, isNative: true };
}

export async function fetchPremiumFromRevenueCat(): Promise<boolean> {
  if (!isBillingNativePlatform()) {
    return readCachedPremium();
  }

  const ready = await ensureConfigured();
  if (!ready) {
    return readCachedPremium();
  }

  try {
    const plugin = getPurchasesPlugin();
    if (!plugin) {
      return readCachedPremium();
    }
    const { customerInfo } = await withBillingTimeout(
      "getCustomerInfo",
      plugin.getCustomerInfo(),
      BILLING_FETCH_TIMEOUT_MS,
    );
    const isPremium = isPremiumFromCustomerInfo(customerInfo);
    writeCachedPremium(isPremium);
    return isPremium;
  } catch (error) {
    console.error("[billing] getCustomerInfo failed", error);
    return readCachedPremium();
  }
}

export async function findMonthlyPackage(): Promise<PurchasesPackage | null> {
  const target = await findMonthlyPurchaseTarget();
  return target?.kind === "package" ? target.value : null;
}

async function findMonthlyPurchaseTarget(
  onStep?: BillingStepListener,
): Promise<PurchaseTarget | null> {
  if (!isBillingNativePlatform()) {
    return null;
  }

  reportStep(onStep, "CONFIGURING");
  const ready = await ensureConfigured();
  if (!ready) {
    reportStep(onStep, "CONFIGURE_FAILED");
    return null;
  }

  const plugin = getPurchasesPlugin();
  if (!plugin) {
    return null;
  }

  try {
    reportStep(onStep, "FETCHING_OFFERINGS");
    const offerings = await withBillingTimeout(
      "getOfferings",
      plugin.getOfferings(),
      BILLING_FETCH_TIMEOUT_MS,
    );
    const current = offerings.current;
    if (current) {
      const fromPackages = current.availablePackages.find(
        (pkg) =>
          pkg.product.identifier === PREMIUM_MONTHLY_PRODUCT_ID ||
          pkg.identifier === PREMIUM_MONTHLY_PRODUCT_ID,
      );
      if (fromPackages) {
        reportStep(onStep, "OFFERING_PACKAGE_FOUND");
        return { kind: "package", value: fromPackages };
      }

      if (current.monthly) {
        reportStep(onStep, "OFFERING_MONTHLY_FOUND");
        return { kind: "package", value: current.monthly };
      }

      const firstPackage = current.availablePackages[0];
      if (firstPackage) {
        reportStep(onStep, "OFFERING_FIRST_FOUND");
        return { kind: "package", value: firstPackage };
      }
    }
    reportStep(onStep, "NO_CURRENT_OFFERING");
  } catch (error) {
    reportStep(onStep, "OFFERINGS_ERROR");
    console.error("[billing] getOfferings failed", error);
  }

  try {
    reportStep(onStep, "FETCHING_PRODUCTS");
    const { products } = await withBillingTimeout(
      "getProducts",
      plugin.getProducts({
        productIdentifiers: [PREMIUM_MONTHLY_PRODUCT_ID],
      }),
      BILLING_FETCH_TIMEOUT_MS,
    );
    const product =
      products.find((item) => item.identifier === PREMIUM_MONTHLY_PRODUCT_ID) ??
      products[0];
    if (!product) {
      reportStep(onStep, "NO_PRODUCT_RETURNED");
      return null;
    }

    if (product.defaultOption) {
      reportStep(onStep, "PRODUCT_OPTION_FOUND");
      return { kind: "subscriptionOption", value: product.defaultOption };
    }

    reportStep(onStep, "PRODUCT_FOUND");
    return { kind: "product", value: product };
  } catch (error) {
    console.error("[billing] getProducts failed", error);
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

export async function purchaseMonthlyPremium(
  onStep?: BillingStepListener,
): Promise<PurchaseFlowResult> {
  if (!isBillingNativePlatform()) {
    return { status: "error", message: "NOT_NATIVE" };
  }

  const purchaseTarget = await findMonthlyPurchaseTarget(onStep);
  if (!purchaseTarget) {
    return { status: "error", message: "NO_PACKAGE" };
  }

  try {
    reportStep(onStep, "OPENING_PLAY_DIALOG");
    const plugin = getPurchasesPlugin();
    if (!plugin) {
      return { status: "error", message: "PLUGIN_UNAVAILABLE" };
    }

    let customerInfo: CustomerInfo;
    if (purchaseTarget.kind === "package") {
      const result = await withBillingTimeout(
        "purchasePackage",
        plugin.purchasePackage({
          aPackage: purchaseTarget.value,
        }),
        BILLING_PURCHASE_TIMEOUT_MS,
      );
      customerInfo = result.customerInfo;
    } else if (purchaseTarget.kind === "subscriptionOption") {
      const result = await withBillingTimeout(
        "purchaseSubscriptionOption",
        plugin.purchaseSubscriptionOption({
          subscriptionOption: purchaseTarget.value,
        }),
        BILLING_PURCHASE_TIMEOUT_MS,
      );
      customerInfo = result.customerInfo;
    } else {
      const result = await withBillingTimeout(
        "purchaseStoreProduct",
        plugin.purchaseStoreProduct({
          product: purchaseTarget.value,
        }),
        BILLING_PURCHASE_TIMEOUT_MS,
      );
      customerInfo = result.customerInfo;
    }
    const isPremium = isPremiumFromCustomerInfo(customerInfo);
    writeCachedPremium(isPremium);
    if (isPremium) {
      return { status: "success", isPremium: true };
    }
    return { status: "error", message: "ENTITLEMENT_INACTIVE" };
  } catch (error) {
    if (isPurchaseCancelledError(error)) {
      return { status: "cancelled" };
    }
    const message =
      error instanceof Error && error.message.startsWith("BILLING_TIMEOUT:")
        ? error.message
        : undefined;
    console.error("[billing] purchase failed", error);
    return { status: "error", message };
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
    const plugin = getPurchasesPlugin();
    if (!plugin) {
      return { status: "error" };
    }

    const { customerInfo } = await withBillingTimeout(
      "restorePurchases",
      plugin.restorePurchases(),
      BILLING_FETCH_TIMEOUT_MS,
    );
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
