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

import { ROLEPLAY_POINT_SECONDS } from "./config.ts";

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

/** USD per 1M tokens, gpt-4o-mini, which every text pass in the app uses. */
export const MINI_USD_PER_MTOK = { input: 0.15, output: 0.6 } as const;

/** USD per minute, whisper-1, used on video only when no caption track exists. */
export const WHISPER_USD_PER_MINUTE = 0.006;

/**
 * Tokens one subtitle pass moves.
 *
 * A window is twenty seconds of speech plus the context the pass is given, so
 * these are of that order rather than of a whole transcript. An assumption, like
 * the audio conversion above, and for the same reason: nothing measures it yet.
 */
export const SUBTITLE_PASS_TOKENS = { input: 1500, output: 400 } as const;

/** USD of one gpt-4o-mini pass over a subtitle window. */
function subtitlePassUsd(): number {
  return (
    (SUBTITLE_PASS_TOKENS.input * MINI_USD_PER_MTOK.input) / 1_000_000 +
    (SUBTITLE_PASS_TOKENS.output * MINI_USD_PER_MTOK.output) / 1_000_000
  );
}

/**
 * Model calls a video sets off, counted from the pipeline rather than guessed.
 *
 * Preparing refines the transcript and normalises it. Then every twenty seconds
 * of video is its own translation window, and each window interprets the line,
 * expresses it for the viewer, and updates the running context — three passes,
 * nine windows for a three-minute clip. Which is the point: preparation is the
 * small half, and the twenty-seven passes that follow are charged nothing.
 */
export const VIDEO_MODEL_CALLS = {
  prepare: 3,
  perWindow: 3,
  windowSeconds: 20,
} as const;

/**
 * USD of model time in one point's worth of video, which is three minutes.
 *
 * `transcribed` is the expensive path: a clip with no caption track of any kind
 * has to go through whisper first. A clip that carries captions — which the
 * library is curated to — skips that entirely.
 */
export function videoPointCostUsd(options: { transcribed: boolean }): number {
  const seconds = 3 * 60;
  const windows = Math.ceil(seconds / VIDEO_MODEL_CALLS.windowSeconds);
  const passes =
    VIDEO_MODEL_CALLS.prepare + windows * VIDEO_MODEL_CALLS.perWindow;
  const whisper = options.transcribed
    ? (seconds / 60) * WHISPER_USD_PER_MINUTE
    : 0;
  return passes * subtitlePassUsd() + whisper;
}

/** USD per 1M tokens, gpt-4.1-mini, which the call-learning character speaks through. */
export const TUTOR_USD_PER_MTOK = { input: 0.4, output: 1.6 } as const;

/**
 * USD per minute of speech from gpt-4o-mini-tts.
 *
 * The weakest number in this file and the largest share of what a minute of
 * call learning costs, so it is the one to check against a real bill first.
 * OpenAI quotes this model per token of text; this is that converted at the
 * rate the scene actually speaks at, which is roughly a spoken minute per
 * seven hundred characters.
 */
export const TTS_USD_PER_MINUTE = 0.015;

/**
 * A turn of call learning, measured rather than guessed.
 *
 * Taken on 2026-09-23 from six turns of a real open conversation against
 * gpt-4.1-mini, reading what the API itself reported rather than counting
 * characters: mean 1673 tokens in and 48 out. The figures before these were
 * 1060 and 120, and both had drifted, in opposite directions, so that the error
 * hid itself in the total.
 *
 * `input` went up because the bank is in the prompt. An open conversation is
 * offered the lines it may reach for, which is about 884 tokens of the 1673 —
 * bought deliberately, and it pays for itself several times over below.
 * `output` came down because a written line stopped carrying its translation:
 * that was half the answer and none of it was ever spoken, so it is fetched
 * when somebody taps the line instead.
 *
 * `turnSeconds` is a spoken exchange end to end: the character's line, the
 * learner's answer, and the moment in between.
 */
export const ROLEPLAY_TURN = {
  input: 1673,
  output: 48,
  turnSeconds: 15,
  tutorSpeakingSeconds: 5,
  learnerSpeakingSeconds: 6,
  /**
   * The share of the character's lines that cost a synthesis.
   *
   * A line out of the bank is the same words every time, so the edge holds it
   * and hands it back to everybody — and every one of them is warmed before a
   * release (scripts/warm-roleplay-speech.mjs), so in production a bank line is
   * a cache hit that never reaches the function at all. A line the model wrote
   * is a string nobody has asked for before and is always paid for.
   *
   * So this is one minus the bank's hit rate. Two readings of that: the ledger
   * says 36.8% over 285 lines, and six turns measured after the anaphoric lines
   * and the two-line turn landed came back at 69%. The ledger's is the older
   * and worse of the two — most of it was recorded before either of those
   * existed — and it is the one used here, because every price in this file is
   * set against the expensive case on purpose.
   */
  linesSynthesised: 0.63,
} as const;

/**
 * USD of model time in one minute of call learning.
 *
 * Three bills, not one: the character deciding what to say, the speech it is
 * said in, and the transcription of the answer. Speech is still the largest,
 * but only just — 43% against 41% for deciding, where it used to be 58%
 * against 28%. The two are close enough now that neither can be called the
 * number to check first without looking.
 *
 * The bank did that, from both ends at once. Most of what the character says is
 * a line that already exists, served from the edge for nothing, so only the
 * lines it writes itself are paid for; and the prompt grew by the list of lines
 * it may reach for.
 *
 * Those two very nearly cancel, which is worth saying plainly because an
 * earlier version of this comment did not. Measured against the real model on
 * the same turn, a language with a bank sends 1809 tokens and one without sends
 * 820; the first pays $0.00311 a minute to think and $0.00315 to speak, the
 * second $0.00161 and $0.00500. That is $0.00746 against $0.00781 — the bank is
 * about five per cent cheaper, not twice. The fall from $0.00866 to $0.00733
 * was mostly this file being corrected, not the bank being added.
 *
 * So the bank is not a cost measure and nothing here should be read as saying
 * it is. What it buys is measured elsewhere: a line already at the edge comes
 * back in about a fifth of a second instead of being synthesised, it holds the
 * scene's register where a model writing fresh drifts, and it is the only thing
 * a repetition cooldown can act on. At scale the edge would tell a different
 * story, since one warmed line serves everybody and a written one is paid for
 * every time it is said — but that is not today's arithmetic.
 */
export function roleplayMinuteUsd(): number {
  const turns = 60 / ROLEPLAY_TURN.turnSeconds;
  const think =
    (ROLEPLAY_TURN.input * TUTOR_USD_PER_MTOK.input) / 1_000_000 +
    (ROLEPLAY_TURN.output * TUTOR_USD_PER_MTOK.output) / 1_000_000;
  const speak =
    (ROLEPLAY_TURN.tutorSpeakingSeconds / 60) *
    TTS_USD_PER_MINUTE *
    ROLEPLAY_TURN.linesSynthesised;
  const hear =
    (ROLEPLAY_TURN.learnerSpeakingSeconds / 60) * CALL_TRANSCRIBE_USD_PER_MINUTE;
  return turns * (think + speak + hear);
}

/** USD of model time in one point's worth of call learning. */
export function roleplayPointCostUsd(): number {
  return roleplayMinuteUsd() * (ROLEPLAY_POINT_SECONDS / 60);
}

/**
 * What one point is assumed to cost to serve.
 *
 * A point buys either a minute of call or three minutes of video, and the call
 * is the more expensive of the two even against video's worst path. Pricing
 * against the expensive side means the cheap side can only come in under what
 * was assumed — a test holds that ordering, because the whole price rests on it
 * and nothing else in here would notice if it flipped.
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
 * Priced as near MIN_BUNDLE_MARGIN as clean won figures allow, because the
 * number that matters here is not the margin but the step up out of the
 * subscription. The grant works out at about 124원 a point and the floor sits
 * at about 200원, so someone who runs out mid-month pays roughly 1.7 times what
 * the same point cost them inside the plan.
 *
 * That gap cannot be closed much further from this side. At the floor exactly
 * it is still 1.61 times, and going under it would mean selling points at a
 * loss to make the cliff look gentler. Closing it properly means moving the
 * subscription — its price or its grant — which is a decision that wants real
 * usage behind it.
 *
 * The smallest bundle is the one to keep honest: someone who runs out reaches
 * for that one, not for five hundred points.
 */
export const POINT_BUNDLES: readonly PointBundle[] = [
  { productId: "points_60", points: 60, priceKrw: 12900 },
  { productId: "points_200", points: 200, priceKrw: 41900 },
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

/**
 * How many points a store product is worth, or null if it is not one of ours.
 *
 * Null rather than zero on purpose. A product id RevenueCat reports that this
 * table does not know about is a configuration mistake — a typo in the console,
 * a bundle added in one place and not the other — and it should be visible as
 * one, not silently credited as nothing.
 */
export function pointsForProduct(productId: string): number | null {
  const bundle = POINT_BUNDLES.find((entry) => entry.productId === productId);
  return bundle ? bundle.points : null;
}
