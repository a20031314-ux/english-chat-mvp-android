import type { NextRequest } from "next/server";
import { requestAppVersion } from "@/lib/appVersion";
import {
  MODEL_CALLS_PER_REQUEST,
  type MeteredOp,
} from "./modelCalls.ts";
import { incrementDailyOpUsed } from "@/lib/server/entitlementStore";
import { requestUserId } from "@/lib/server/premiumRequest";

/**
 * Counts one use of a route that spends model time.
 *
 * Chat and calls were the only routes anyone counted, so the daily chat limit
 * read as a fence around the spending while analysis, glossing, translation and
 * speech sat open beside it — reachable, like every route here, without an
 * account. The video routes were missed in that first pass and are counted now
 * too. This closes the gap in the ledger, not in the service: nothing here
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
    // Grep [meter] to see what a day of use actually costs, and which builds
    // are doing the spending — "unknown" is every install older than the one
    // that started saying so.
    console.log("[meter]", {
      op,
      userId,
      todayCount,
      modelCalls: MODEL_CALLS_PER_REQUEST[op],
      appVersion: requestAppVersion(request.headers),
    });
  } catch (error) {
    console.error("[meter] not recorded", op, error);
  }
}

export { MODEL_CALLS_PER_REQUEST, type MeteredOp };
