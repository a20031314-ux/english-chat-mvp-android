/**
 * The paid plans and what each one gives (hub/drafts/pricing-2026-10.md "최종").
 *
 * Every plan is the same shape — today's pack, a few minutes of free talk a
 * day, then points the learner bought — so a day of practice is the unit of
 * the subscription as it is the unit of learning: the minutes reset each day
 * and never carry over, which also keeps the worst case of what a subscriber
 * can cost known in advance.
 *
 *   3,900 won  lite_monthly     7 minutes a day   30 chats   library trial
 *   5,500 won  plus_monthly    10 minutes a day   50 chats   library trial
 *   8,900 won  premium_monthly 15 minutes a day  100 chats   whole library, 2 extra packs
 *
 * premium_monthly is the plan that already exists at 9,900 won with 80 points
 * a month. Its price is changed in Play by a person, on a day this server
 * cannot know, so its new terms wait behind PREMIUM_DAILY_PLAN_FROM: until that is
 * switched on, premium keeps exactly what its subscribers are paying for now.
 * lite and plus have no old terms — they apply the moment the products exist.
 *
 * Pure: the server, the screens and the tests read the same table.
 */

import {
  FREE_DAILY_CHAT_LIMIT,
  FREE_PACK_DAYS_PER_WEEK,
  PREMIUM_ENTITLEMENT_ID,
  PREMIUM_MONTHLY_IMPORT_POINTS,
  PREMIUM_MONTHLY_PRODUCT_ID,
} from "./config.ts";

export type PlanTier = "free" | "lite" | "plus" | "premium";

export const PAID_TIERS: readonly Exclude<PlanTier, "free">[] = ["lite", "plus", "premium"];

/** Play product ids, without the base plan RevenueCat may add after a colon. */
export const PLAN_PRODUCT_IDS: Record<Exclude<PlanTier, "free">, string> = {
  lite: "lite_monthly",
  plus: "plus_monthly",
  premium: PREMIUM_MONTHLY_PRODUCT_ID,
};

/**
 * The day premium moves to 8,900 won terms (15 minutes a day, no monthly
 * points), as "YYYY-MM-DD" in UTC. Null until a person has changed the price
 * in Play Console: set it in the same push as that change, or after, never
 * before — until then premium subscribers are paying 9,900 won for 80 points
 * a month, and that is what they get.
 *
 * The month of the switch still grants the 80 points, so nobody loses points
 * they were given for a month they already paid for; the next month they are
 * gone and the daily minutes are the plan.
 */
export const PREMIUM_DAILY_PLAN_FROM: string | null = "2026-10-22"; // 사용자 결정 2026-10-23 03:26 KST(UTC 10-22): Play·App Store 가격 8,900원으로 같은 날

/** Whether premium is on its daily terms at this moment, and whether this month still grants the old points. */
export function premiumDailyAt(now: number, from: string | null = PREMIUM_DAILY_PLAN_FROM): { daily: boolean; keepGrant: boolean } {
  if (!from) return { daily: false, keepGrant: true };
  const today = new Date(now).toISOString().slice(0, 10);
  if (today < from) return { daily: false, keepGrant: true };
  return { daily: true, keepGrant: today.slice(0, 7) === from.slice(0, 7) };
}

export type PlanTerms = {
  tier: PlanTier;
  /** Free-talk minutes a day before points are spent. Null where there is no daily allowance. */
  dailyCallMinutes: number | null;
  /** Points granted each month. Only the old premium terms have any. */
  monthlyGrantPoints: number;
  /** Chat messages a day; null for no limit. */
  dailyChat: number | null;
  /** Every video in this month's library, rather than the free trial. */
  libraryOpen: boolean;
  /** Daily packs beyond the free one. */
  extraPacks: number;
  /** Importing your own video with points. */
  canImport: boolean;
  /** Won a month, for the screen's comparison only; the store's price is the one shown on the button. */
  priceKrw: number | null;
  /**
   * 누를 때만 도는 AI 도움(번역·표현 카드·문장분석·표현 자세히·단위·단어 뜻)의 하루 한도.
   * 사람끼리 주고받는 것(메시지·묻기·방 대화)은 세지 않는다(hub/drafts/ai-help-limits.md).
   */
  dailyAiHelp: number;
  /** 말하는 방 자막(받아쓰기) 하루 줄 수. 한 줄 ≈ 6초라 100줄 ≈ 10분. 넘으면 자막만 멈추고 음성은 계속. */
  dailyCaptionLines: number;
  /** 오늘의 팩을 7일 동안 며칠까지. null이면 매일. */
  packDaysPerWeek: number | null;
};

/**
 * 요금별 AI 도움·방 자막 한도(흑자 구조 2026-10-20). 듣기(TTS)는 통화가 같은 길로 소리를 내서 한도를 두지 않는다.
 */
const HELP_LIMITS = {
  free: { dailyAiHelp: 20, dailyCaptionLines: 100 },
  lite: { dailyAiHelp: 100, dailyCaptionLines: 300 },
  plus: { dailyAiHelp: 150, dailyCaptionLines: 600 },
  premium: { dailyAiHelp: 300, dailyCaptionLines: 1200 },
} as const;

export function termsFor(tier: PlanTier, now = Date.now(), from: string | null = PREMIUM_DAILY_PLAN_FROM): PlanTerms {
  const premium = premiumDailyAt(now, from);
  switch (tier) {
    case "lite":
      return { tier, dailyCallMinutes: 7, monthlyGrantPoints: 0, dailyChat: 30, libraryOpen: false, extraPacks: 0, canImport: true, priceKrw: 3900, ...HELP_LIMITS.lite, packDaysPerWeek: null };
    case "plus":
      return { tier, dailyCallMinutes: 10, monthlyGrantPoints: 0, dailyChat: 50, libraryOpen: false, extraPacks: 0, canImport: true, priceKrw: 5500, ...HELP_LIMITS.plus, packDaysPerWeek: null };
    case "premium":
      return premium.daily
        ? { tier, dailyCallMinutes: 15, monthlyGrantPoints: premium.keepGrant ? PREMIUM_MONTHLY_IMPORT_POINTS : 0, dailyChat: 100, libraryOpen: true, extraPacks: 2, canImport: true, priceKrw: 8900, ...HELP_LIMITS.premium, packDaysPerWeek: null }
        : { tier, dailyCallMinutes: null, monthlyGrantPoints: PREMIUM_MONTHLY_IMPORT_POINTS, dailyChat: null, libraryOpen: true, extraPacks: 0, canImport: true, priceKrw: 9900, ...HELP_LIMITS.premium, packDaysPerWeek: null };
    default:
      return { tier: "free", dailyCallMinutes: null, monthlyGrantPoints: 0, dailyChat: FREE_DAILY_CHAT_LIMIT, libraryOpen: false, extraPacks: 0, canImport: false, priceKrw: null, ...HELP_LIMITS.free, packDaysPerWeek: FREE_PACK_DAYS_PER_WEEK };
  }
}

/** The plan a store product belongs to. RevenueCat names Play subscriptions "product:base-plan". */
export function tierForProduct(productId: string | null | undefined): Exclude<PlanTier, "free"> | null {
  if (!productId) return null;
  const base = productId.split(":")[0]!.trim();
  for (const tier of PAID_TIERS) if (PLAN_PRODUCT_IDS[tier] === base) return tier;
  return null;
}

export function isPlanTier(value: unknown): value is PlanTier {
  return value === "free" || value === "lite" || value === "plus" || value === "premium";
}

/** As much of RevenueCat's subscriber record as telling the plan needs. */
export type SubscriberEntitlements = {
  subscriber?: {
    entitlements?: Record<string, { expires_date?: string | null; product_identifier?: string | null }>;
  };
};

/**
 * Which plan the active entitlement came from. Every plan unlocks the same
 * "premium" entitlement, so the product behind it is what tells 3,900 won from
 * 8,900. A product this table does not know — a promotional grant, a lifetime
 * entitlement given by hand — reads as premium, the plan everyone who had the
 * entitlement before there were three plans was on.
 */
export function planFromSubscriber(body: SubscriberEntitlements, now = Date.now()): PlanTier {
  const entitlement = body.subscriber?.entitlements?.[PREMIUM_ENTITLEMENT_ID];
  if (!entitlement) return "free";
  // A null expiry is a lifetime grant; anything else has to still be ahead of us.
  if (entitlement.expires_date !== null) {
    if (!entitlement.expires_date) return "free";
    const expiresAt = Date.parse(entitlement.expires_date);
    if (!Number.isFinite(expiresAt) || expiresAt <= now) return "free";
  }
  return tierForProduct(entitlement.product_identifier) ?? "premium";
}

/** The highest of several plans, for someone who somehow holds two. */
export function bestTier(tiers: PlanTier[]): PlanTier {
  const order: PlanTier[] = ["free", "lite", "plus", "premium"];
  return tiers.reduce<PlanTier>((best, tier) => (order.indexOf(tier) > order.indexOf(best) ? tier : best), "free");
}

/**
 * The learner's day, from the minutes their clock is ahead of UTC. Allowances
 * reset at their midnight. Without an offset the day is Korea's, where most
 * learners are.
 */
export function localDay(now: number, offsetMinutes: number | null): string {
  const offset = offsetMinutes ?? 9 * 60;
  return new Date(now + offset * 60_000).toISOString().slice(0, 10);
}

/** Minutes the learner's clock is ahead of UTC (the negative of Date#getTimezoneOffset). */
export const TZ_OFFSET_HEADER = "x-tz-offset";

/** An offset a request may claim: whole minutes within a day either way. */
export function parseOffset(value: string | null | undefined): number | null {
  if (value === null || value === undefined || value.trim() === "") return null;
  const n = Number(value);
  return Number.isInteger(n) && Math.abs(n) <= 14 * 60 ? n : null;
}
