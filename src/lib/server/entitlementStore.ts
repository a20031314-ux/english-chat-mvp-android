/**
 * Usage counters that survive the request that wrote them.
 *
 * These used to be maps in module scope. That reads as a store and is not one:
 * serverless instances do not share memory and are recycled constantly, so the
 * free daily chat limit, the monthly import points and the catalog trial count
 * all silently reset. They are keyed rows in KV now — see kv.ts, which also
 * explains what happens when no KV credentials are configured.
 *
 * Every key names its own window, so nothing has to be reset on a rollover: the
 * old key simply stops being read and expires on its own.
 */

import {
  kvGetJson,
  kvGetNumber,
  kvGetNumbers,
  kvIncrBy,
  kvScanKeys,
  kvSetJson,
  kvSetJsonIfAbsent,
  kvListPush,
  kvListTrim,
  kvGetJsonMany,
  kvDelete,
} from "./kv.ts";
// Relative, not "@/": a script under scripts/ imports this directly and Node
// cannot resolve the alias there (see modelCalls.ts, which was split out over
// exactly this).
import { contentHash } from "../roleplay/script.ts";
import {
  FREE_LIFETIME_ROLEPLAY_POINTS,
  ROLEPLAY_POINT_SECONDS,
} from "../billing/config.ts";
import {
  planCallBlock,
  pointsForCallSeconds,
  refundSplit,
  splitSpend,
  spentPoints,
  totalPoints,
  type PointBalance,
  type PointSpend,
} from "../billing/points.ts";
import { monthlyImportPoints } from "../billing/videoPrep.ts";
import { callWindowStart, localDay, termsFor, type PlanTerms } from "../billing/plans.ts";
import { isIdentified } from "./identity.ts";

/** Long enough that a day's counter outlives the day in every timezone. */
const DAILY_TTL_SECONDS = 3 * 24 * 60 * 60;
/** Same idea for a month, with room for a late-arriving write. */
const MONTHLY_TTL_SECONDS = 70 * 24 * 60 * 60;

/**
 * How long the per-op ledger is kept, which is a different question from how
 * long a limit needs its counter.
 *
 * Three days is right for a daily allowance: tomorrow reads tomorrow's key and
 * yesterday's is dead weight. But these rows are read by a person weeks later,
 * asking what a fortnight of closed testing looked like — and a counter that
 * expires eleven days before the window closes cannot answer that. It could
 * only ever have described the last three days, which is the shape of an
 * anecdote rather than of evidence.
 *
 * Kept separate from DAILY_TTL_SECONDS rather than lengthening it, because the
 * chat limit has no reason to hold rows for a month and every key here already
 * names its own day — nothing reads a stale one either way.
 */
const OP_LEDGER_TTL_SECONDS = 45 * 24 * 60 * 60;

function dayKey() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

function monthKey() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${now.getFullYear()}-${month}`;
}

function dailyChatKey(userId: string) {
  return `usage:chat:${userId}:${dayKey()}`;
}

function videoPrepKey(userId: string) {
  return `usage:video:${userId}:${monthKey()}`;
}

function callsKey(userId: string) {
  return `usage:calls:${userId}`;
}

function catalogTrialKey(userId: string) {
  return `usage:trial:${userId}`;
}

function callSecondsKey(userId: string) {
  return `usage:callsec:${userId}:${monthKey()}`;
}

function opKey(userId: string, op: string) {
  return `usage:op:${op}:${userId}:${dayKey()}`;
}

/** Deliberately not month-scoped and given no expiry: this was paid for. */
function purchasedPointsKey(userId: string) {
  return `points:bought:${userId}`;
}

/** Lifetime, like the catalog trial: the free fifteen minutes do not come back. */
function roleplayTrialKey(userId: string) {
  return `usage:rptrial:${userId}`;
}

/** One conversation's clock, so a charge knows how long it has been running. */
function roleplaySessionKey(userId: string, sessionId: string) {
  return `points:rpsession:${userId}:${sessionId}`;
}

/**
 * Long enough to outlive any conversation — the scene closes itself after forty
 * turns — and short enough that abandoned rows do not pile up. A row that
 * expires mid-conversation restarts the clock, which charges the learner for
 * one more block than they owed; a lost row cannot overcharge by more than that.
 */
const ROLEPLAY_SESSION_TTL_SECONDS = 6 * 60 * 60;

/** The conversation this person had last, so the next one can settle it. */
function roleplayLastSessionKey(userId: string) {
  return `points:rplast:${userId}`;
}

/**
 * Paid-for call time a conversation did not use, waiting for the next one.
 *
 * Month-scoped like the grant it mostly came out of, and read from the month
 * of the turn rather than the wall clock so the rule is the same in a test as
 * on the server. A free learner's carry lapses at the month's end too, which
 * costs them at most the unused part of one block.
 */
function roleplayCarryKey(userId: string, now: number) {
  const at = new Date(now);
  return `points:rpcarry:${userId}:${at.getFullYear()}-${String(at.getMonth() + 1).padStart(2, "0")}`;
}

const ROLEPLAY_CARRY_TTL_SECONDS = 40 * 24 * 60 * 60;

/**
 * How long past its last turn a conversation is taken to have run.
 *
 * The server sees a conversation only when the director is asked for a line,
 * and the call does not end there: the line is still to be spoken, and the
 * learner may answer it before they hang up, which is speech the server pays
 * to hear. Half a minute covers both. It is the only part of settling that
 * the learner cannot see and the only part that favours the house.
 */
const ROLEPLAY_SETTLE_GRACE_MS = 30 * 1000;

/** No one's unused time grows past this, whatever goes wrong with settling. */
const ROLEPLAY_CARRY_MAX_MS = 30 * 60 * 1000;

function callHoldKey(userId: string, holdId: string) {
  return `points:hold:${userId}:${holdId}`;
}

/**
 * Long enough that no real call outlives its own hold, short enough that
 * abandoned rows do not accumulate. A hold that expires unsettled simply stays
 * spent, which is the safe direction.
 */
const HOLD_TTL_SECONDS = 6 * 60 * 60;

/** 오늘(채팅 한도와 같은 날) 본 보상형 광고 수. */
function adRewardKey(userId: string) {
  return `usage:adreward:${userId}:${dayKey()}`;
}

export async function getAdRewardsToday(userId: string): Promise<number> {
  return kvGetNumber(adRewardKey(userId));
}

export type AdRewardResult = "granted" | "duplicate" | "capped" | "anonymous";

/**
 * AdMob이 서명해 보낸 보상 한 건을 오늘 몫에 더한다(billing/ads.ts).
 * 같은 transaction_id는 한 번만(AdMob은 응답이 늦으면 다시 보낸다), 하루 상한을 넘으면 세지 않는다.
 */
export async function grantAdReward(
  userId: string,
  transactionId: string,
  dailyMax: number,
): Promise<AdRewardResult> {
  if (!isIdentified(userId)) return "anonymous";
  const fresh = await kvSetJsonIfAbsent(`ads:tx:${transactionId}`, { u: userId }, 7 * 24 * 60 * 60);
  if (!fresh) return "duplicate";
  if ((await kvGetNumber(adRewardKey(userId))) >= dailyMax) return "capped";
  await kvIncrBy(adRewardKey(userId), 1, DAILY_TTL_SECONDS);
  return "granted";
}

/** AI 도움·방 자막 하루 수(채팅 한도와 같은 날, server/aiHelp.ts). */
export type HelpBucket = "help" | "caption";

function helpKey(userId: string, bucket: HelpBucket) {
  return `usage:aihelp:${bucket}:${userId}:${dayKey()}`;
}

export async function getDailyHelp(userId: string, bucket: HelpBucket): Promise<number> {
  return kvGetNumber(helpKey(userId, bucket));
}

/** 하나 더하고 새 합계. */
export async function addDailyHelp(userId: string, bucket: HelpBucket): Promise<number> {
  return kvIncrBy(helpKey(userId, bucket), 1, DAILY_TTL_SECONDS);
}

/**
 * 채팅 고친 문장을 확인 모델에 다시 보인 횟수(오늘) — 하나 더하고 새 합계(`/api/chat/verify`, 하루 상한 `VERIFY_DAILY_MAX`).
 * 사용자의 AI 도움 한도와는 따로 센다: 확인은 앱이 품질을 위해 고르는 일이라 사용자 몫을 쓰지 않는다.
 */
export async function addDailyVerify(userId: string): Promise<number> {
  return kvIncrBy(`usage:aihelp:verify:${userId}:${dayKey()}`, 1, DAILY_TTL_SECONDS);
}

/**
 * 말하는 방 자막은 말(말풍선) 하나를 한 줄로 센다. 쉼마다 조각으로 받아쓰게 된 뒤(rooms/speechParts.ts)
 * 같은 말의 뒷조각은 세지 않는다 — 다만 한 말에 조각이 너무 많으면(PART_FREE 넘음) 그때부터 조각마다 센다.
 * 앱이 말 번호를 마음대로 붙여도 한 번호로 아낄 수 있는 건 2분 동안 조각 몇 개뿐이다.
 */
const CAPTION_PART_FREE = 8;
const CAPTION_PART_TTL_SECONDS = 120;

export async function captionPartCounts(userId: string, utterance: string): Promise<boolean> {
  // 누군지 모르는 요청은 aiHelp도 세지 않는다 — 저장할 필요도 없다.
  if (!isIdentified(userId)) return true;
  const seen = await kvIncrBy(`usage:aihelp:part:${userId}:${utterance}`, 1, CAPTION_PART_TTL_SECONDS);
  return seen === 1 || seen > CAPTION_PART_FREE;
}

/**
 * 방 내 줄 교정 표(2026-10-22): 받아쓰기(`/api/roleplay/listen`)가 이 조각을 교정해도 된다고 본 흔적 —
 * 글의 지문(해시)과 믿음 정도(high·check)만, 글 자체는 저장하지 않는다. 교정(`/api/rooms/fix`)은 이 표가 있는 글만 고치고 표를 지운다.
 * 그래서 받아쓰기를 거치지 않은 아무 글이나 공짜 교정으로 보낼 수 없다. 10분이면 저절로 사라진다.
 */
const FIX_MARK_TTL_SECONDS = 600;

export type FixMark = { h: string; trust: "high" | "check" };

function fixMarkKey(userId: string, utterance: string, part: number) {
  return `usage:aihelp:fix:${userId}:${utterance}:${part}`;
}

export async function markFixable(userId: string, utterance: string, part: number, mark: FixMark): Promise<void> {
  if (!isIdentified(userId)) return;
  await kvSetJson(fixMarkKey(userId, utterance, part), mark, FIX_MARK_TTL_SECONDS);
}

/** 조각마다 표(없으면 null), 읽은 표는 지운다(한 번만 쓰임). */
export async function takeFixMarks(userId: string, utterance: string, parts: number[]): Promise<(FixMark | null)[]> {
  if (!isIdentified(userId) || parts.length === 0) return parts.map(() => null);
  const keys = parts.map((part) => fixMarkKey(userId, utterance, part));
  const marks = await kvGetJsonMany<FixMark>(keys);
  await kvDelete(keys).catch(() => {});
  return marks;
}

/**
 * My 단계 대본에서 오늘 확인받은 내 줄 수(plans.ts dailyScriptLines, 사용자 시간대의 날). 한도 안이면 하나 올리고 true.
 * 모르는 사람(공유 익명 id)은 세지 않는다 — 한 사람의 한도를 모두가 나눠 쓰게 되므로.
 */
export async function takeScriptLine(userId: string, limit: number, day: string): Promise<boolean> {
  if (!isIdentified(userId)) return true;
  const key = `script:daily:${userId}:${day}`;
  if ((await kvGetNumber(key)) >= limit) return false;
  await kvIncrBy(key, 1, DAILY_TTL_SECONDS);
  return true;
}

export async function getDailyUsed(userId: string): Promise<number> {
  return kvGetNumber(dailyChatKey(userId));
}

export async function incrementDailyUsed(
  userId: string,
  amount = 1,
): Promise<number> {
  return kvIncrBy(dailyChatKey(userId), amount, DAILY_TTL_SECONDS);
}

type VideoPrepRecord = {
  usedPoints: number;
  billedVideoIds: string[];
};

const EMPTY_VIDEO_PREP: VideoPrepRecord = {
  usedPoints: 0,
  billedVideoIds: [],
};

async function readVideoPrep(userId: string): Promise<VideoPrepRecord> {
  const stored = await kvGetJson<Partial<VideoPrepRecord>>(
    videoPrepKey(userId),
  );
  if (!stored) return EMPTY_VIDEO_PREP;
  return {
    usedPoints:
      typeof stored.usedPoints === "number" && stored.usedPoints > 0
        ? stored.usedPoints
        : 0,
    billedVideoIds: Array.isArray(stored.billedVideoIds)
      ? stored.billedVideoIds.filter(
          (id): id is string => typeof id === "string",
        )
      : [],
  };
}

export async function getMonthlyImportPointsUsed(
  userId: string,
): Promise<number> {
  return (await readVideoPrep(userId)).usedPoints;
}

export async function getBilledImportVideoIds(
  userId: string,
): Promise<string[]> {
  return (await readVideoPrep(userId)).billedVideoIds;
}

export async function addMonthlyImportPoints(
  userId: string,
  points: number,
  videoId?: string,
): Promise<number> {
  const billed = Math.max(0, Math.ceil(points));
  const current = await readVideoPrep(userId);
  const next: VideoPrepRecord = {
    usedPoints: current.usedPoints + billed,
    billedVideoIds:
      videoId && !current.billedVideoIds.includes(videoId)
        ? [...current.billedVideoIds, videoId]
        : current.billedVideoIds,
  };
  await kvSetJson(videoPrepKey(userId), next, MONTHLY_TTL_SECONDS);
  return next.usedPoints;
}

/**
 * Charge a video import, granted points first and then purchased ones.
 *
 * The same split the call uses (splitSpend), so a subscriber who has spent the
 * month's grant can still import with points they bought. Returns null and
 * charges nothing when both pots together cannot cover it. The video is
 * remembered as billed either way it is paid, so reopening it this month is
 * free.
 */
export async function chargeImportPoints(
  userId: string,
  points: number,
  videoId?: string,
  grant: number = monthlyImportPoints(true),
): Promise<PointSpend | null> {
  // 쓴 만큼(소수): 영상 길이만큼 정확히 깎는다(importPointsForDuration). 정수 포인트는 모자랄 때만 꺼낸다.
  const paid = await spendMilli(userId, { free: false, grant }, Math.ceil(Math.max(0, points) * MILLI_PER_POINT - 1e-6));
  if (!paid) return null;
  // spendMilli가 월 지급분을 꺼냈으면 이미 usedPoints에 더했다(applySpend). 여기서는 영상 id만 남긴다.
  if (videoId) {
    const current = await readVideoPrep(userId);
    if (!current.billedVideoIds.includes(videoId)) {
      await kvSetJson(
        videoPrepKey(userId),
        { usedPoints: current.usedPoints, billedVideoIds: [...current.billedVideoIds, videoId] } satisfies VideoPrepRecord,
        MONTHLY_TTL_SECONDS,
      );
    }
  }
  return paid.spend;
}

/** @deprecated Seconds view of import points, kept for the entitlement route. */
export async function getMonthlyVideoPrepUsed(
  userId: string,
): Promise<number> {
  return (await getMonthlyImportPointsUsed(userId)) * 180;
}

/** Lifetime, like the catalog trial, so this key carries no expiry either. */
export async function getCallsStarted(userId: string): Promise<number> {
  return kvGetNumber(callsKey(userId));
}

export async function incrementCallsStarted(userId: string): Promise<number> {
  return kvIncrBy(callsKey(userId), 1);
}

/**
 * How many seconds of realtime audio a subscriber has spent this month.
 *
 * Counted, not enforced. Opening a call is the only lever the server holds, so
 * this exists to answer a question the counter above cannot: a started call and
 * a forty-minute call cost very different amounts, and premium currently has no
 * limit on either. Monthly, because that is the window a subscription is sold in.
 *
 * Read it as a floor. The number arrives from the client — the server never sees
 * a call end — so a killed app loses its report, and a hostile one could inflate
 * it. Good enough to price a plan, not good enough to bill against.
 */
export async function getMonthlyCallSeconds(userId: string): Promise<number> {
  return kvGetNumber(callSecondsKey(userId));
}

export async function addMonthlyCallSeconds(
  userId: string,
  seconds: number,
): Promise<number> {
  const rounded = Math.max(0, Math.round(seconds));
  if (rounded === 0) return getMonthlyCallSeconds(userId);
  return kvIncrBy(callSecondsKey(userId), rounded, MONTHLY_TTL_SECONDS);
}

/**
 * How many times someone used one metered route today.
 *
 * The daily chat counter above answers this for chat alone. Every other route
 * that spends model time — analysis, glossing, translation, speech — went
 * uncounted, which made the chat limit look like a fence around the spending
 * when most of the spending was happening beside it.
 *
 * Daily, like chat, because the question these answer is what a normal day of
 * use costs. Nothing reads them to refuse anything.
 */
export async function getDailyOpUsed(
  userId: string,
  op: string,
): Promise<number> {
  return kvGetNumber(opKey(userId, op));
}

export async function incrementDailyOpUsed(
  userId: string,
  op: string,
  amount = 1,
): Promise<number> {
  return kvIncrBy(opKey(userId, op), amount, OP_LEDGER_TTL_SECONDS);
}

/** Lifetime, not monthly — so this key deliberately carries no expiry. */
export async function getCatalogTrialVideoIds(
  userId: string,
): Promise<string[]> {
  const stored = await kvGetJson<unknown>(catalogTrialKey(userId));
  if (!Array.isArray(stored)) return [];
  return stored.filter((id): id is string => typeof id === "string");
}

export async function addCatalogTrialVideo(
  userId: string,
  videoId: string,
): Promise<string[]> {
  const current = await getCatalogTrialVideoIds(userId);
  if (current.includes(videoId)) return current;
  const next = [...current, videoId];
  await kvSetJson(catalogTrialKey(userId), next);
  return next;
}

/**
 * Points someone bought, as opposed to points the subscription granted them.
 *
 * No month in the key and no expiry on the row: these were paid for separately,
 * and letting them lapse at a month boundary would be taking money for nothing.
 */
export async function getPurchasedPoints(userId: string): Promise<number> {
  return Math.max(0, await kvGetNumber(purchasedPointsKey(userId)));
}

/** Credit a purchase. The caller is responsible for having verified it. */
export async function addPurchasedPoints(
  userId: string,
  points: number,
): Promise<number> {
  const amount = Math.max(0, Math.ceil(points));
  if (amount === 0) return getPurchasedPoints(userId);
  return kvIncrBy(purchasedPointsKey(userId), amount);
}

/**
 * Both pots, as the arithmetic in billing/points.ts expects them.
 *
 * `grant` is what the plan gives this month; what is left of it is the grant
 * minus what has been spent. A KV read that fails reads as zero, which here
 * means "no points" and so "no call" — the safe direction to fail in once there
 * is money involved.
 */
export async function readPointBalance(
  userId: string,
  grant: number,
): Promise<PointBalance> {
  const [used, purchased] = await Promise.all([
    getMonthlyImportPointsUsed(userId),
    getPurchasedPoints(userId),
  ]);
  return { granted: Math.max(0, grant - used), purchased };
}

/** Move points between the pots. Negative deltas give them back. */
async function applySpend(userId: string, spend: PointSpend, sign: 1 | -1) {
  if (spend.fromGranted !== 0) {
    const current = await readVideoPrep(userId);
    await kvSetJson(
      videoPrepKey(userId),
      {
        usedPoints: Math.max(0, current.usedPoints + sign * spend.fromGranted),
        billedVideoIds: current.billedVideoIds,
      } satisfies VideoPrepRecord,
      MONTHLY_TTL_SECONDS,
    );
  }
  if (spend.fromPurchased !== 0) {
    await kvIncrBy(purchasedPointsKey(userId), -sign * spend.fromPurchased);
  }
}

type CallHold = {
  spend: PointSpend;
  seconds: number;
  settled: boolean;
};

/**
 * Charge for a call before opening it, and say how long that buys.
 *
 * The charge has to come first because it cannot come later: once the handshake
 * is done the audio runs between the phone and OpenAI, and the server has no
 * session left to stop. So the whole block is taken here and the unused part is
 * returned when the call reports in. A call that never reports keeps its block,
 * which bounds what one silent call can cost.
 *
 * Returns null when the balance cannot open a call at all.
 */
export async function openCallHold(
  userId: string,
  grant: number,
): Promise<{ holdId: string; points: number; seconds: number } | null> {
  const balance = await readPointBalance(userId, grant);
  const block = planCallBlock(balance);
  if (!block) return null;
  const spend = splitSpend(balance, block.points);
  if (!spend) return null;

  const holdId = crypto.randomUUID();
  // Written before the pots move, so a charge is never invisible: if a pot
  // write fails after this, the hold still says what was meant to happen and
  // reconciliation has something to find.
  await kvSetJson(
    callHoldKey(userId, holdId),
    { spend, seconds: block.seconds, settled: false } satisfies CallHold,
    HOLD_TTL_SECONDS,
  );
  await applySpend(userId, spend, 1);
  return { holdId, points: block.points, seconds: block.seconds };
}

/**
 * Give back the part of a block the call did not use.
 *
 * Settling is one-shot: the row is marked before anything is returned, so a
 * report that arrives twice — a retry, a resent keepalive — cannot be refunded
 * twice. An unknown or already-settled hold returns null and changes nothing.
 */
export async function settleCallHold(
  userId: string,
  holdId: string,
  seconds: number,
): Promise<{ refundedPoints: number } | null> {
  const key = callHoldKey(userId, holdId);
  const hold = await kvGetJson<CallHold>(key);
  if (!hold || hold.settled || !hold.spend) return null;

  await kvSetJson(key, { ...hold, settled: true }, HOLD_TTL_SECONDS);

  // Never credit more than the block: a report claiming a shorter call than it
  // was cannot conjure points, it can only decline to spend them.
  const used = Math.min(
    pointsForCallSeconds(seconds),
    spentPoints(hold.spend),
  );
  const refund = refundSplit(hold.spend, used);
  const refunded = spentPoints(refund);
  if (refunded > 0) await applySpend(userId, refund, -1);
  return { refundedPoints: refunded };
}

/**
 * A line said, counted against the sentence that said it.
 *
 * Lifetime, not monthly: the question this answers is whether a sentence ever
 * earns its place, and a month is too short a window to retire one on. A tally
 * and the day it was last said, which together say both "is it used" and "is it
 * still used".
 */
function sentenceSaidKey(language: string, id: string) {
  return `bank:said:${language}:${id}`;
}

function sentenceLastKey(language: string, id: string) {
  return `bank:last:${language}:${id}`;
}

/**
 * Note that the character said a line out of the bank.
 *
 * Never throws and never blocks the turn: a lost tally costs one data point,
 * and the conversation is worth more than the count of it.
 */
export async function noteSentenceSaid(language: string, id: string): Promise<void> {
  try {
    await kvIncrBy(sentenceSaidKey(language, id), 1);
    await kvSetJson(sentenceLastKey(language, id), { at: Date.now() }, MONTHLY_TTL_SECONDS);
  } catch {
    // Counting is not the product.
  }
}

/**
 * Lines the character wrote itself, kept so that one day they can be read.
 *
 * The bank grows by drafting, and only by drafting: a line the model writes is
 * counted and then thrown away, which means the app has never once learned
 * anything from what it actually says. The "harvested" source in script.ts has
 * always described this and nothing has ever written one.
 *
 * This is the cheap half of that, on purpose. Reading the pile — grouping lines
 * that mean the same thing, deciding which have earned a place — wants
 * clustering, a review pass, and enough traffic for a repeat to mean something,
 * and none of that can be done with the few hundred near-unique sentences ten
 * learners produce. It can all be done later, from what is kept here.
 *
 * Keeping cannot. A line not written down is gone, and the months before
 * somebody gets round to the other half are exactly the months whose data would
 * have been most worth having. So the halves ship apart, and this one first.
 *
 * Only the character's own lines. What the learner said is a different question
 * with a different answer, and nothing here goes near it.
 *
 * Counted by exact text rather than appended to a list: incrementing is atomic
 * where appending to a JSON array is a read, a change and a write that two
 * turns can interleave. The count is nearly always one — the model rarely
 * writes the same sentence twice — and the rare line that does repeat is
 * exactly the one worth noticing, so the shape costs nothing and answers
 * something.
 */

/** Longest line kept. A turn is one or two spoken sentences; this is generous. */
const WRITTEN_MAX_CHARS = 300;

/**
 * How long a written line is kept. Long enough to look back over a season of
 * use, short enough that the pile cannot grow without end while nobody reads
 * it.
 */
const WRITTEN_TTL_SECONDS = 90 * 24 * 60 * 60;

function writtenCountKey(language: string, hash: string) {
  return `bank:written:${language}:${hash}`;
}

function writtenTextKey(language: string, hash: string) {
  return `bank:written:text:${language}:${hash}`;
}

/**
 * Where each sighting of a written line came from.
 *
 * The count and text above say what the character said and how often; they
 * cannot say when it could be said. Whether "That must have been tough" only
 * ever follows someone describing a bad day is the question a bank needs
 * answered before it offers a line, and it can only be answered from the
 * situations recorded as it happened. Kept beside the existing keys rather
 * than in them, so nothing that reads those changes.
 *
 * The learner's own words are not here: the turn they answered is named by
 * its session and index (learnerMetrics.ts), and the tutor line before it by
 * a hash. Same ninety days as the line itself, and the latest fifty sightings,
 * which is more than any line has had.
 */
function writtenContextKey(language: string, hash: string) {
  return `bank:written:ctx:${language}:${hash}`;
}

const WRITTEN_CONTEXTS_KEPT = 50;

export type WrittenLineContext = {
  scenario_id: string;
  node_id: string;
  mode: "script" | "free";
  level: number;
  /** contentHash of the character's previous line, or null at the start. */
  prev_tutor_hash: string | null;
  /** The learner turn this line answered, as learnerMetrics.ts records it. */
  prev_turn_ref: { session_id: string | null; turn_index: number | null };
};

/**
 * Note that the character wrote this line rather than reaching for one.
 *
 * Never throws and nothing waits on it: a lost line costs one row of a pile
 * nobody is reading yet, and a learner mid-sentence costs more than that.
 */
export async function noteSentenceWritten(
  language: string,
  text: string,
  context?: WrittenLineContext,
): Promise<void> {
  const line = text.trim().slice(0, WRITTEN_MAX_CHARS);
  if (!line) return;
  try {
    const hash = contentHash(line);
    await kvIncrBy(writtenCountKey(language, hash), 1, WRITTEN_TTL_SECONDS);
    await kvSetJson(
      writtenTextKey(language, hash),
      { text: line, at: Date.now() },
      WRITTEN_TTL_SECONDS,
    );
    if (context) {
      const key = writtenContextKey(language, hash);
      await kvListPush(key, [JSON.stringify({ ...context, at: Date.now() })], WRITTEN_TTL_SECONDS);
      await kvListTrim(key, WRITTEN_CONTEXTS_KEPT);
    }
  } catch {
    // Keeping is not the product either.
  }
}

/** Every line written in a language, with how often, newest information last. */
export async function readWrittenLines(
  language: string,
): Promise<{ text: string; said: number; at: number }[]> {
  const keys = await kvScanKeys(`bank:written:text:${language}:*`);
  const out: { text: string; said: number; at: number }[] = [];
  for (const key of keys) {
    const hash = key.slice(`bank:written:text:${language}:`.length);
    const row = await kvGetJson<{ text: string; at: number }>(key);
    if (!row?.text) continue;
    out.push({
      text: row.text,
      said: await kvGetNumber(writtenCountKey(language, hash)),
      at: row.at ?? 0,
    });
  }
  return out.sort((a, b) => b.said - a.said);
}

/** How often each of these has been said, and when it last was. */
export async function readSentenceTally(
  language: string,
  ids: string[],
): Promise<Record<string, { said: number; lastAt: number | null }>> {
  const counts = await kvGetNumbers(ids.map((id) => sentenceSaidKey(language, id)));
  const lasts = await Promise.all(
    ids.map((id) => kvGetJson<{ at: number }>(sentenceLastKey(language, id))),
  );
  const out: Record<string, { said: number; lastAt: number | null }> = {};
  ids.forEach((id, index) => {
    out[id] = { said: counts[index] ?? 0, lastAt: lasts[index]?.at ?? null };
  });
  return out;
}

/**
 * 포인트를 쓴 만큼 소수로 깎는다(2026-10-23 사용자 결정 "A", hub/drafts/points-gauge-2026-10-23.md).
 *
 * 잔액(월 지급분·구매분·무료 평생 체험)은 예전처럼 정수 포인트로 둔다 — 구매 적립·초대 보상·환불 셈이
 * 그대로 맞고 옮길 데이터가 없다. 그 위에 "이미 꺼낸 포인트 중 남은 부분"을 1/1000 단위(밀리)로 하나 둔다.
 * 쓸 때는 남은 부분에서 먼저 깎고, 모자라면 정수 포인트를 필요한 만큼만 꺼내(월 지급분 먼저, splitSpend)
 * 남는 부분에 더한다. 보여 주는 잔액 = 정수 포인트 + 남은 부분 / 1000.
 *
 * 남은 부분은 만료가 없다. 월 지급분에서 꺼낸 것이 달이 바뀌어도 남는 셈인데, 많아야 1포인트 미만이다.
 */
export const MILLI_PER_POINT = 1000;

function pointPartKey(userId: string) {
  return `points:part:${userId}`;
}

/** 꺼낸 포인트 중 아직 안 쓴 부분(밀리). */
export async function getPointPart(userId: string): Promise<number> {
  return Math.max(0, await kvGetNumber(pointPartKey(userId)));
}

/** 어디서 포인트를 꺼내는지: 무료는 평생 체험분, 유료는 이번 달 지급분 + 구매분. */
type PointSource = { free: true; trial: number } | { free: false; grant: number };

function sourceOf(terms: PlanTerms): PointSource {
  return terms.tier === "free" ? { free: true, trial: terms.freeTrialPoints } : { free: false, grant: terms.monthlyGrantPoints };
}

/** 꺼낼 수 있는 정수 포인트. */
async function wholePointsLeft(userId: string, source: PointSource): Promise<number> {
  if (source.free) {
    const used = await kvGetNumber(roleplayTrialKey(userId));
    return Math.max(0, source.trial - used);
  }
  return totalPoints(await readPointBalance(userId, source.grant));
}

/** 쓸 수 있는 전부(밀리): 꺼낼 수 있는 정수 포인트 + 꺼내 두고 남은 부분. */
export async function availableMilli(userId: string, source: PointSource): Promise<number> {
  const [whole, part] = await Promise.all([wholePointsLeft(userId, source), getPointPart(userId)]);
  return whole * MILLI_PER_POINT + part;
}

/**
 * 밀리만큼 쓴다. 모자라면 아무것도 깎지 않고 null(`partial`이면 남은 만큼 다 쓰고 그만큼만).
 * 꺼낸 정수 포인트가 어느 칸에서 나왔는지 돌려준다(영상 화면이 이번 달 지급분 쓴 양을 보여 줌).
 */
export async function spendMilli(
  userId: string,
  source: PointSource,
  wanted: number,
  options: { partial?: boolean } = {},
): Promise<{ spentMilli: number; spend: PointSpend } | null> {
  let milli = Math.max(0, Math.ceil(wanted));
  const none: PointSpend = { fromGranted: 0, fromPurchased: 0 };
  if (milli === 0) return { spentMilli: 0, spend: none };
  const part = await getPointPart(userId);
  if (part >= milli) {
    await kvIncrBy(pointPartKey(userId), -milli);
    return { spentMilli: milli, spend: none };
  }
  const whole = await wholePointsLeft(userId, source);
  if (whole * MILLI_PER_POINT + part < milli) {
    if (!options.partial) return null;
    milli = whole * MILLI_PER_POINT + part;
    if (milli === 0) return null;
  }
  const open = Math.ceil((milli - part) / MILLI_PER_POINT);
  let spend = none;
  if (open > 0) {
    if (source.free) {
      await kvIncrBy(roleplayTrialKey(userId), open);
    } else {
      const split = splitSpend(await readPointBalance(userId, source.grant), open);
      // 확인과 꺼내기 사이에 다른 곳(다른 기기의 통화)이 썼다.
      if (!split) return null;
      await applySpend(userId, split, 1);
      spend = split;
    }
  }
  const delta = open * MILLI_PER_POINT - milli;
  if (delta !== 0) await kvIncrBy(pointPartKey(userId), delta);
  return { spentMilli: milli, spend };
}

/** 보여 줄 잔액(포인트, 소수 첫째 자리에서 버림 — 실제보다 많아 보이지 않게). */
export function pointsForDisplay(milli: number): number {
  return Math.floor(Math.max(0, milli) / 100) / 10;
}

type RoleplaySession = {
  startedAt: number;
  /** Points this conversation has taken (예전 5분 블록 방식만). */
  charged: number;
  /** 예전 블록 방식에서 이 대화가 미리 산 통화 시간(ms). */
  paidMs?: number;
  /** When the server last saw a turn of it. */
  lastTurnAt?: number;
  /** 2 = 쓴 만큼 깎는 방식. 없으면 예전 블록 방식 줄 — 처음 만날 때 남은 시간을 포인트 부분으로 돌려준다. */
  v?: 2;
};

const BLOCK_MS = ROLEPLAY_POINT_SECONDS * 1000;

/** 통화 시간(ms) → 밀리. 1포인트 = ROLEPLAY_POINT_SECONDS. */
export function milliForCallMs(ms: number): number {
  return Math.ceil((Math.max(0, ms) * MILLI_PER_POINT) / BLOCK_MS);
}

function paidMsOf(session: RoleplaySession): number {
  return session.paidMs ?? session.charged * BLOCK_MS;
}

/** 예전 방식의 이월 시간(ms). 쓴 만큼 방식에서는 처음 깎을 때 포인트 부분으로 옮겨져 0이 된다. */
export async function roleplayCarryMs(userId: string, now: number): Promise<number> {
  return Math.max(0, await kvGetNumber(roleplayCarryKey(userId, now)));
}

/** 예전 이월 시간을 포인트 부분으로 옮긴다(한 번). */
async function moveCarryToPart(userId: string, now: number): Promise<void> {
  const carry = await roleplayCarryMs(userId, now);
  if (carry <= 0) return;
  await kvIncrBy(roleplayCarryKey(userId, now), -carry, ROLEPLAY_CARRY_TTL_SECONDS);
  await kvIncrBy(pointPartKey(userId), Math.floor((carry * MILLI_PER_POINT) / BLOCK_MS));
}

/**
 * 예전 블록 방식 대화가 미리 사 두고 안 쓴 시간을 포인트 부분으로 돌려준다(배포 때 진행 중이던 대화,
 * 또는 그 뒤 처음 시작하는 대화가 만나는 직전 대화). 돌려준 뒤 그 줄은 쓴 만큼 방식(v2)이 된다.
 */
async function settleLegacySession(userId: string, key: string, session: RoleplaySession, usedUntil: number): Promise<void> {
  if (session.v === 2) return;
  const usedMs = Math.max(0, usedUntil - session.startedAt) + ROLEPLAY_SETTLE_GRACE_MS;
  const unusedMs = Math.min(paidMsOf(session) - usedMs, ROLEPLAY_CARRY_MAX_MS);
  await kvSetJson(key, { ...session, paidMs: undefined, v: 2 } satisfies RoleplaySession, ROLEPLAY_SESSION_TTL_SECONDS);
  if (unusedMs > 0) await kvIncrBy(pointPartKey(userId), Math.floor((unusedMs * MILLI_PER_POINT) / BLOCK_MS));
}

/** 새 대화가 시작될 때 직전 대화가 예전 방식이면 남은 시간을 돌려준다. */
async function settlePreviousRoleplaySession(userId: string, currentSessionId: string): Promise<void> {
  const pointer = roleplayLastSessionKey(userId);
  const previous = await kvGetJson<{ sessionId: string }>(pointer);
  await kvSetJson(pointer, { sessionId: currentSessionId }, ROLEPLAY_SESSION_TTL_SECONDS);
  if (!previous || previous.sessionId === currentSessionId) return;
  const key = roleplaySessionKey(userId, previous.sessionId);
  const session = await kvGetJson<RoleplaySession>(key);
  if (!session) return;
  await settleLegacySession(userId, key, session, session.lastTurnAt ?? session.startedAt);
}

/** Older callers pass whether the person has paid; paid then meant premium. */
function planTerms(plan: boolean | PlanTerms): PlanTerms {
  return typeof plan === "boolean" ? termsFor(plan ? "premium" : "free") : plan;
}

/** 통화에 쓸 수 있는 포인트(소수, 0.001 단위): 무료는 평생 체험분, 유료는 잔액 — 꺼내 두고 남은 부분 포함. */
export async function roleplayPointsLeft(
  userId: string,
  plan: boolean | PlanTerms,
): Promise<number> {
  return (await availableMilli(userId, sourceOf(planTerms(plan)))) / MILLI_PER_POINT;
}

/**
 * Free-talk time a plan gives each day (plans.ts), counted as talk rather than
 * as the clock: each turn adds the time since the one before it, but never more
 * than a minute, so a call left open while the learner looks something up does
 * not eat the day. The first turn of a conversation counts a little, so a run
 * of one-line conversations is not free either.
 */
export const DAILY_CALL_STEP_CAP_MS = 60_000;
export const DAILY_CALL_FIRST_STEP_MS = 15_000;

function dailyCallKey(userId: string, day: string) {
  return `rp:daily:${userId}:${day}`;
}

/** Milliseconds of today's free talk left, or null on a plan without one. */
export async function dailyCallLeftMs(
  userId: string,
  plan: PlanTerms,
  day: string,
): Promise<number | null> {
  if (!plan.dailyCallMinutes) return null;
  const used = Math.max(0, await kvGetNumber(dailyCallKey(userId, callWindowStart(day, plan.callWindowDays))));
  return Math.max(0, plan.dailyCallMinutes * 60_000 - used);
}

/**
 * 지금까지의 대화를 깎고, 이어 가도 되는지 말한다.
 *
 * 쓴 만큼(2026-10-23): 턴마다 지난 턴 뒤로 흐른 시간을 깎는다 — 하루 무료 분과 같은 셈(턴 간격은 최대 1분,
 * 대화 첫 턴은 15초)이라 찾아보느라 멈춘 시간은 깎이지 않는다. 오늘 무료 분이 먼저, 모자란 만큼만 포인트에서
 * 소수로(1포인트 = ROLEPLAY_POINT_SECONDS). 포인트가 조금이라도 남아 있으면 그 턴은 받고 남은 만큼 다 쓴다.
 * 하나도 없을 때만 거절해서, 대화가 끝나는 자리는 잔액 0이다.
 *
 * `charged`는 이 턴에 쓴 포인트(소수), `left`는 남은 포인트(소수).
 */
export async function chargeRoleplayTurn(
  userId: string,
  plan: boolean | PlanTerms,
  sessionId: string,
  now: number,
  /** Minutes the learner's clock is ahead of UTC, so their day resets at their midnight. */
  offsetMinutes: number | null = null,
): Promise<{ ok: boolean; charged: number; left: number; todayLeftMs: number | null }> {
  const terms = planTerms(plan);
  const source = sourceOf(terms);
  // Nobody in particular is asking, so there is nobody to charge (공유 익명 id 하나에 한도를 걸면
  // 첫 대화가 모두의 몫을 써 버린다). The failure to identify someone is ours, not theirs.
  if (!isIdentified(userId)) {
    return { ok: true, charged: 0, left: FREE_LIFETIME_ROLEPLAY_POINTS, todayLeftMs: null };
  }
  await moveCarryToPart(userId, now);
  const key = roleplaySessionKey(userId, sessionId);
  const stored = await kvGetJson<RoleplaySession>(key);
  if (!stored) await settlePreviousRoleplaySession(userId, sessionId);
  else if (stored.v !== 2) await settleLegacySession(userId, key, stored, stored.lastTurnAt ?? stored.startedAt);

  const sinceLast = stored ? now - (stored.lastTurnAt ?? stored.startedAt) : DAILY_CALL_FIRST_STEP_MS;
  let stepMs = Math.min(DAILY_CALL_STEP_CAP_MS, Math.max(0, sinceLast));

  // 오늘 무료 분이 먼저: 자정에 사라지고, 포인트는 남는다.
  const day = localDay(now, offsetMinutes);
  let todayLeft = await dailyCallLeftMs(userId, terms, day);
  let fromDay = 0;
  if (todayLeft !== null && todayLeft > 0 && stepMs > 0) {
    fromDay = Math.min(stepMs, todayLeft);
    const used = await kvIncrBy(dailyCallKey(userId, callWindowStart(day, terms.callWindowDays)), fromDay, (terms.callWindowDays + 1) * 24 * 60 * 60);
    todayLeft = Math.max(0, (terms.dailyCallMinutes ?? 0) * 60_000 - used);
    stepMs -= fromDay;
  }

  const save = () =>
    kvSetJson(
      key,
      { startedAt: stored?.startedAt ?? now, charged: 0, lastTurnAt: now, v: 2 } satisfies RoleplaySession,
      ROLEPLAY_SESSION_TTL_SECONDS,
    );

  if (stepMs <= 0) {
    await save();
    return { ok: true, charged: 0, left: await roleplayPointsLeft(userId, terms), todayLeftMs: todayLeft };
  }
  const paid = await spendMilli(userId, source, milliForCallMs(stepMs), { partial: true });
  // 오늘 무료 분이 이 턴을 일부라도 덮었으면 받는다(무료 분이 끝나는 턴). 다음 턴부터 포인트가 없으면 거절.
  if (!paid && fromDay > 0) {
    await save();
    return { ok: true, charged: 0, left: 0, todayLeftMs: todayLeft };
  }
  if (!paid) {
    // 거절된 턴도 시각은 남긴다 — 포인트를 사러 간 동안이 다음 턴에 깎이지 않게.
    await save();
    return { ok: false, charged: 0, left: await roleplayPointsLeft(userId, terms), todayLeftMs: todayLeft };
  }
  await save();
  return {
    ok: true,
    charged: paid.spentMilli / MILLI_PER_POINT,
    left: await roleplayPointsLeft(userId, terms),
    todayLeftMs: todayLeft,
  };
}

function creditedPurchaseKey(userId: string, transactionId: string) {
  return `points:credited:${userId}:${transactionId}`;
}

/**
 * Credit a purchase once, and say whether this call was the one that did it.
 *
 * The marker is written before the points are added, so a crash between the two
 * loses a credit rather than repeating one — the safe direction when the
 * alternative is handing out points every time an app restarts and re-syncs.
 * It carries no expiry: a purchase is credited once, forever, and a row that
 * lapsed would let the same transaction pay out twice.
 */
export async function creditPurchaseOnce(
  userId: string,
  transactionId: string,
  points: number,
): Promise<boolean> {
  const key = creditedPurchaseKey(userId, transactionId);
  const already = await kvGetJson<{ points: number }>(key);
  if (already) return false;
  await kvSetJson(key, { points, at: Date.now() });
  await addPurchasedPoints(userId, points);
  return true;
}
