/**
 * What the app spends to serve a point, and what a point is sold for.
 *
 * Every number below is a list price or an assumption, not a measurement. The
 * counters that would let this be measured — [call-ended] and [meter] — went in
 * on 2026-09-03 and had recorded no calls at all two days later, so there was
 * nothing to price against and these were derived instead. That is a fine way
 * to open, and a bad way to stay: when real usage exists, recompute here rather
 * than arguing from the same list prices a second time.
 *
 * Kept pure and in one file so the derivation is legible end to end. Nothing
 * here is read at request time; it exists to justify the constants in config.ts
 * and to stop a bundle being edited into a loss.
 */

/** Where the model prices came from, so the next person can check them. */
export const PRICE_SOURCE = {
  url: "https://developers.openai.com/api/docs/pricing",
  checkedOn: "2026-09-04",
} as const;

/** USD per 1M tokens, audio modality, gpt-realtime-2.1. */
export const REALTIME_AUDIO_USD_PER_MTOK = { input: 32, output: 64 } as const;

/** USD per minute, gpt-4o-mini-transcribe, which transcribes the learner. */
export const CALL_TRANSCRIBE_USD_PER_MINUTE = 0.003;

/**
 * Audio tokens a minute of speech comes to.
 *
 * The weakest numbers here: OpenAI prices realtime audio per token and does not
 * publish a per-minute conversion, so these are third-party measurements. They
 * are the first thing to replace with something measured.
 */
export const AUDIO_TOKENS_PER_MINUTE = { input: 600, output: 1200 } as const;

/**
 * How much of a call minute the tutor is the one talking.
 *
 * Input audio is billed for the whole call — the microphone streams throughout
 * — while output is billed only for speech actually generated. Half is the
 * assumption for a conversation where neither side dominates.
 */
export const TUTOR_SPEECH_SHARE = 0.5;

/** USD of model time in one minute of tutor call. */
export function callMinuteUsd(): number {
  const input =
    (AUDIO_TOKENS_PER_MINUTE.input * REALTIME_AUDIO_USD_PER_MTOK.input) / 1_000_000;
  const output =
    (AUDIO_TOKENS_PER_MINUTE.output *
      TUTOR_SPEECH_SHARE *
      REALTIME_AUDIO_USD_PER_MTOK.output) /
    1_000_000;
  return input + output + CALL_TRANSCRIBE_USD_PER_MINUTE;
}

/**
 * What one point is assumed to cost to serve.
 *
 * A point buys either a minute of call or three minutes of video preparation,
 * and the call is the more expensive of the two — whisper plus a handful of
 * gpt-4o-mini passes comes to roughly half a call minute. Pricing against the
 * expensive side means the cheap side can only be better than assumed.
 */
export function pointCostUsd(): number {
  return callMinuteUsd();
}

/**
 * The store's cut of a sale.
 *
 * Google Play takes 15% below $1M of annual revenue and 30% above it. This app
 * is nowhere near that line; if it ever is, this number changes and every
 * margin below moves with it.
 */
export const STORE_FEE_SHARE = 0.15;

/**
 * KRW per USD, used only to check a won price against a dollar cost.
 *
 * An assumption with a date on it, not a live rate. A large enough move here
 * changes whether the bundles below clear their margin, which is exactly why it
 * is written down instead of being done in someone's head.
 */
export const KRW_PER_USD = { rate: 1400, assumedOn: "2026-09-04" } as const;

/**
 * What has to be left after the store's cut and the model bill.
 *
 * Points are not the only thing a subscription pays for — chat, analysis,
 * glossing and speech all spend model time outside this ledger, and none of it
 * is billed to anyone. This margin is what covers them, plus refunds and the
 * free tier.
 */
export const MIN_BUNDLE_MARGIN = 0.5;

export type PointBundle = {
  /** Play product id. Consumable, not a subscription. */
  productId: string;
  points: number;
  priceKrw: number;
};

/**
 * Point bundles, cheaper per point as they get larger.
 *
 * Sized so the smallest is an ordinary impulse purchase next to a 9,900원
 * subscription rather than a second subscription, and so the largest still
 * clears MIN_BUNDLE_MARGIN even at the thinnest per-point price.
 */
export const POINT_BUNDLES: readonly PointBundle[] = [
  { productId: "points_60", points: 60, priceKrw: 14900 },
  { productId: "points_200", points: 200, priceKrw: 44900 },
  { productId: "points_500", points: 500, priceKrw: 99900 },
] as const;

/** What is left of a bundle's price after the store and the model bill. */
export function bundleMargin(bundle: PointBundle): {
  revenueUsd: number;
  netUsd: number;
  costUsd: number;
  marginShare: number;
} {
  const revenueUsd = bundle.priceKrw / KRW_PER_USD.rate;
  const netUsd = revenueUsd * (1 - STORE_FEE_SHARE);
  const costUsd = bundle.points * pointCostUsd();
  return {
    revenueUsd,
    netUsd,
    costUsd,
    marginShare: netUsd === 0 ? 0 : (netUsd - costUsd) / netUsd,
  };
}

/**
 * The same arithmetic for the subscription's own monthly grant.
 *
 * Worth keeping next to the bundles because it is the thinnest number in the
 * whole scheme: a subscriber who spends the entire grant on calls leaves far
 * less behind than a bundle buyer does, and everything else they use that month
 * comes out of what is left.
 */
export function grantMargin(
  monthlyPriceKrw: number,
  grantPoints: number,
): ReturnType<typeof bundleMargin> {
  return bundleMargin({
    productId: "grant",
    points: grantPoints,
    priceKrw: monthlyPriceKrw,
  });
}
