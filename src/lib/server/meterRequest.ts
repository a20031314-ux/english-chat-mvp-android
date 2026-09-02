import type { NextRequest } from "next/server";
import { incrementDailyOpUsed } from "@/lib/server/entitlementStore";
import { requestUserId } from "@/lib/server/premiumRequest";

/**
 * Roughly how many model calls one request of each kind sets off, so the counts
 * can be read as spending rather than as clicks.
 *
 * A sentence analysis is the outlier: an overview call plus one per dimension
 * the language profile declares active, which is three or four. The rest ask
 * the model once. Keep these honest when a route's shape changes — they are the
 * multiplier anyone will reach for when turning counts into cost.
 */
export const MODEL_CALLS_PER_REQUEST = {
  analysisInput: 5,
  analysisElement: 1,
  expressionInsight: 1,
  vocabGloss: 1,
  learningSpans: 1,
  translate: 1,
  tts: 1,
} as const;

export type MeteredOp = keyof typeof MODEL_CALLS_PER_REQUEST;

/**
 * Counts one use of a route that spends model time.
 *
 * Chat and calls were the only routes anyone counted, so the daily chat limit
 * read as a fence around the spending while analysis, glossing, translation and
 * speech sat open beside it — reachable, like every route here, without an
 * account. This closes the gap in the ledger, not in the service: nothing here
 * refuses anyone, and no caller changes behaviour. What it buys is the ability
 * to set those limits, and the price, against measured use.
 *
 * It never throws and never fails a request. A lost count costs one data point;
 * a failed lookup costs the person mid-sentence, which is the trade the usage
 * counters already learned once.
 */
export async function meterRequest(
  request: NextRequest,
  op: MeteredOp,
): Promise<void> {
  try {
    const userId = requestUserId(request);
    const todayCount = await incrementDailyOpUsed(userId, op);
    // Grep [meter] to see what a day of use actually costs.
    console.log("[meter]", {
      op,
      userId,
      todayCount,
      modelCalls: MODEL_CALLS_PER_REQUEST[op],
    });
  } catch (error) {
    console.error("[meter] not recorded", op, error);
  }
}
