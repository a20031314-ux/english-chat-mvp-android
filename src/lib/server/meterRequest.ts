import type { NextRequest } from "next/server";
import { requestAppVersion } from "@/lib/appVersion";
import {
  MODEL_CALLS_PER_REQUEST,
  type MeteredOp,
} from "./modelCalls.ts";
import { incrementDailyOpUsed } from "@/lib/server/entitlementStore";
import { requestUserId } from "@/lib/server/premiumRequest";
import { kvIncrBy } from "@/lib/server/kv";
import { adoptSimRoutes } from "@/lib/server/llm";

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
  // await 앞에서(같은 요청 흐름에 남도록): 점검 사용자의 모델 경로 바꾸기(llm.ts).
  try {
    adoptSimRoutes(requestUserId(request), request.headers.get("x-sim-model-routes"));
  } catch {
    // 무시
  }
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

const TOKEN_TTL_SECONDS = 45 * 24 * 60 * 60;

/**
 * The tokens a model call actually used, summed per op and day.
 *
 * The cost report priced a call turn from one measurement of its prompt
 * (cost.ts ROLEPLAY_TURN) and a chat line from a guess, while the prompts kept
 * growing — the learner brief, the practice goal, the pack all ride on every
 * turn. Summing what the API reports lets scripts/cost-report.mjs use the
 * real average instead. Not per user: one total per op per day is enough to
 * price a call, and says nothing about anyone.
 */
export async function recordTokens(
  op: MeteredOp,
  usage: { prompt_tokens?: number | null; completion_tokens?: number | null } | null | undefined,
): Promise<void> {
  if (!usage || typeof usage.prompt_tokens !== "number") return;
  try {
    const day = new Date().toISOString().slice(0, 10);
    await Promise.all([
      kvIncrBy(`usage:tok:${op}:${day}:in`, usage.prompt_tokens, TOKEN_TTL_SECONDS),
      kvIncrBy(`usage:tok:${op}:${day}:out`, usage.completion_tokens ?? 0, TOKEN_TTL_SECONDS),
      kvIncrBy(`usage:tok:${op}:${day}:n`, 1, TOKEN_TTL_SECONDS),
    ]);
  } catch (error) {
    console.error("[meter] tokens not recorded", op, error);
  }
}

