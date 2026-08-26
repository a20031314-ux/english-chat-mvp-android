/** Google Play subscription product identifier */
export const PREMIUM_MONTHLY_PRODUCT_ID = "premium_monthly";

/** RevenueCat entitlement identifier */
export const PREMIUM_ENTITLEMENT_ID = "premium";

/** Local cache key for last known premium state (UI only; native refreshes from RevenueCat). */
export const PREMIUM_CACHE_STORAGE_KEY = "ec_premium_cached";

/** MVP: client signals premium to API when RevenueCat entitlement is active (no server receipt validation yet). */
export const PREMIUM_CLIENT_HEADER = "x-client-premium";

export const FREE_DAILY_CHAT_LIMIT = 10;

/** Display price only. Play Console still owns the billed amount for `premium_monthly`. */
export const PREMIUM_MONTHLY_PRICE_KRW = 9900;

/**
 * Internal meter only — not a Play IAP. Custom (user-imported) first prepares
 * round up to this many seconds per point. Library + replay are 0 points.
 */
export const VIDEO_IMPORT_POINT_SECONDS = 3 * 60;

/** Free users cannot import custom videos. They get catalog trial clips instead. */
export const FREE_MONTHLY_IMPORT_POINTS = 0;

/** 240 minutes of custom prep, billed in 3-minute points. */
export const PREMIUM_MONTHLY_IMPORT_POINTS = 80;

/** Longest custom/library video that can be prepared. Matches Whisper's 15 min cap. */
export const MAX_VIDEO_PREP_SECONDS = 15 * 60;

/** Lifetime free catalog opens (not a monthly reset). */
export const FREE_CATALOG_TRIAL_COUNT = 3;

export const VIDEO_IMPORT_USAGE_STORAGE_KEY = "ec_video_import_usage";
export const CATALOG_TRIAL_STORAGE_KEY = "ec_catalog_trial";

/** @deprecated Kept so older localStorage rows can be migrated. */
export const VIDEO_PREP_SECONDS_STORAGE_KEY = "ec_video_prep_seconds";
export const FREE_MONTHLY_VIDEO_PREP_SECONDS = 0;
export const PREMIUM_MONTHLY_VIDEO_PREP_SECONDS =
  PREMIUM_MONTHLY_IMPORT_POINTS * VIDEO_IMPORT_POINT_SECONDS;
export const FREE_MAX_VIDEO_PREP_SECONDS = MAX_VIDEO_PREP_SECONDS;
export const PREMIUM_MAX_VIDEO_PREP_SECONDS = MAX_VIDEO_PREP_SECONDS;
