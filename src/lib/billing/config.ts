/** Google Play subscription product identifier */
export const PREMIUM_MONTHLY_PRODUCT_ID = "premium_monthly";

/** RevenueCat entitlement identifier */
export const PREMIUM_ENTITLEMENT_ID = "premium";

/** Local cache key for last known premium state (UI only; native refreshes from RevenueCat). */
export const PREMIUM_CACHE_STORAGE_KEY = "ec_premium_cached";

/** MVP: client signals premium to API when RevenueCat entitlement is active (no server receipt validation yet). */
export const PREMIUM_CLIENT_HEADER = "x-client-premium";

export const FREE_DAILY_CHAT_LIMIT = 15;
