import { NextRequest } from "next/server";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import {
  addMonthlyCallSeconds,
  getMonthlyCallSeconds,
} from "@/lib/server/entitlementStore";
import { resolveRequestEntitlement } from "@/lib/server/premiumRequest";

export const dynamic = "force-dynamic";

/**
 * Longer than a call anyone would actually hold, so a single bad report — a
 * clock jump, a client bug — cannot drown out a month of real ones.
 */
const MAX_REPORTED_SECONDS = 2 * 60 * 60;

export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request);
}

/**
 * Records how long a finished call ran.
 *
 * Realtime audio is the most expensive thing this app can start, and the
 * sibling route can only refuse to open one: after the handshake the audio runs
 * phone-to-OpenAI and the server never learns what happened. So the count of
 * started calls is all we have, and it cannot tell a two-minute call from a
 * forty-minute one — which is the difference that decides whether a 9,900원
 * subscription pays for itself.
 *
 * This is measurement, not enforcement. Nothing reads the total to refuse
 * anything; it is here so that a limit, when one is set, is set against a real
 * number rather than a guess. A lost report costs one data point, so the client
 * fires this and forgets it, and so does this route.
 */
export async function POST(request: NextRequest) {
  let body: { seconds?: unknown };
  try {
    body = await request.json();
  } catch {
    return jsonWithCors(request, { error: "Invalid JSON" }, { status: 400 });
  }

  const reported = typeof body.seconds === "number" ? body.seconds : NaN;
  if (!Number.isFinite(reported) || reported < 0) {
    return jsonWithCors(request, { error: "seconds required" }, { status: 400 });
  }

  const seconds = Math.min(Math.round(reported), MAX_REPORTED_SECONDS);
  const { userId, isPremium, verified } = await resolveRequestEntitlement(request);

  try {
    const monthSeconds = await addMonthlyCallSeconds(userId, seconds);
    // The line to read when working out what a month of calling costs.
    console.log("[call-ended]", {
      userId,
      seconds,
      monthSeconds,
      isPremium,
      verified,
    });
  } catch (error) {
    // Counting must never be the reason a request fails, least of all one the
    // user cannot see and does not benefit from.
    console.error("[call-ended] not recorded", error);
  }

  return jsonWithCors(request, { ok: true });
}
