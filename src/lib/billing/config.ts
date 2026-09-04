/** Google Play subscription product identifier */
export const PREMIUM_MONTHLY_PRODUCT_ID = "premium_monthly";

/** RevenueCat entitlement identifier */
export const PREMIUM_ENTITLEMENT_ID = "premium";

/** Local cache key for last known premium state (UI only; native refreshes from RevenueCat). */
export const PREMIUM_CACHE_STORAGE_KEY = "ec_premium_cached";

/** MVP: client signals premium to API when RevenueCat entitlement is active (no server receipt validation yet). */
export const PREMIUM_CLIENT_HEADER = "x-client-premium";

/**
 * The RevenueCat subscriber id, so the server can ask RevenueCat directly
 * instead of believing the header above. Also what usage is counted against.
 */
export const REVENUECAT_USER_HEADER = "x-rc-user";

export const FREE_DAILY_CHAT_LIMIT = 10;

/**
 * What Play actually bills for `premium_monthly`.
 *
 * Kept in step with the Play Console by hand, which is exactly how it went
 * wrong once: this said 9,900 while the console charged 4,900, and every margin
 * derived from it was computed against a price nobody paid until the console
 * was corrected to match. Anything shown to a user should come from the store
 * product's own price string rather than from here, so that the next drift is
 * invisible to users even if it happens.
 *
 * See cost.ts for what this has to cover.
 */
export const PREMIUM_MONTHLY_PRICE_KRW = 9900;

/**
 * Internal meter only — not a Play IAP. Custom (user-imported) first prepares
 * round up to this many seconds per point. Library + replay are 0 points.
 */
export const VIDEO_IMPORT_POINT_SECONDS = 3 * 60;

/** Free users cannot import custom videos. They get catalog trial clips instead. */
export const FREE_MONTHLY_IMPORT_POINTS = 0;

/**
 * The monthly grant: 240 minutes of custom video prep, or 80 minutes of call,
 * or any mix — points buy both now.
 *
 * Knowingly generous for the price: eighty points spent on calls leave about a
 * fifth of the subscription behind, and everything else that month comes out of
 * that fifth. The margin the bundles hold to would want nearer fifty. Left at
 * eighty because cutting what subscribers already have is a product decision
 * that wants real usage behind it, and a test records the gap rather than
 * asserting it away.
 */
export const PREMIUM_MONTHLY_IMPORT_POINTS = 80;

/** Longest custom/library video that can be prepared. Matches Whisper's 15 min cap. */
export const MAX_VIDEO_PREP_SECONDS = 15 * 60;

/**
 * Lifetime free tutor calls. Two rather than one, so a call that drops on a
 * bad connection does not cost someone their only look at the feature.
 *
 * A count, not a budget of minutes, because once the SDP handshake is done
 * the audio runs straight between the phone and OpenAI — the server brokers
 * the offer and then has no session left to cut short. Whether to open one
 * at all is the only lever it holds.
 */
export const FREE_TRIAL_CALL_COUNT = 2;

/** How long a trial call runs before the app ends it itself. */
export const TRIAL_CALL_MAX_SECONDS = 3 * 60;

/**
 * What one point buys of a call.
 *
 * A minute, chosen so the point keeps the meaning it already had elsewhere: a
 * point is roughly a nickel of model time either way, whether it goes on a
 * minute of realtime audio or on three minutes of video preparation. That let
 * calls join the same currency without redefining VIDEO_IMPORT_POINT_SECONDS
 * or restating what anyone's existing balance is worth.
 */
export const POINT_CALL_SECONDS = 60;

/**
 * How much a call takes up front, and so how long it is allowed to run.
 *
 * The server cannot end a call — after the handshake the audio runs between the
 * phone and OpenAI — so it charges for a block at the moment it opens one and
 * hands back what went unused. This number is therefore the most that a single
 * call can cost if the app never reports back: the ceiling on being lied to,
 * not just a convenient unit.
 *
 * Ten minutes is long enough that ordinary calls are one block, and short
 * enough that a lost report is a small loss.
 */
export const CALL_BLOCK_POINTS = 10;

/**
 * Sent by a build that understands call blocks and will hang up at the end of
 * one. Only such a build is charged points.
 *
 * The server cannot enforce the block itself, so charging a client that ignores
 * it would take the points and still leave the audio running — the worst of
 * both. Older builds therefore keep the behaviour they shipped with, and this
 * heals as people update, the way the entitlement header did before it.
 */
export const CALL_BLOCK_CLIENT_HEADER = "x-call-blocks";

/** Names the hold on the way out, so the app can settle it on the way back. */
export const CALL_HOLD_HEADER = "x-call-hold";

/** How many seconds the block bought, so the app knows when to hang up. */
export const CALL_BLOCK_SECONDS_HEADER = "x-call-seconds";

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
