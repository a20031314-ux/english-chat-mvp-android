import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { corsHeaders, corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { coerceLanguageCode } from "@/lib/learningLanguages";
import { realtimeCallSessionConfig } from "@/lib/realtimeCallSession";
import {
  CALL_BLOCK_CLIENT_HEADER,
  CALL_BLOCK_SECONDS_HEADER,
  CALL_HOLD_HEADER,
  FREE_TRIAL_CALL_COUNT,
  REVENUECAT_USER_HEADER,
} from "@/lib/billing/config";
import { monthlyImportPoints } from "@/lib/billing/videoPrep";
import {
  getCallsStarted,
  incrementCallsStarted,
  openCallHold,
  settleCallHold,
} from "@/lib/server/entitlementStore";
import { resolveRequestEntitlement } from "@/lib/server/premiumRequest";

export const dynamic = "force-dynamic";

const OPENAI_CALLS = "https://api.openai.com/v1/realtime/calls";
const CRLF = "\r\n";

function safetyIdentifier(userId: string): string {
  return createHash("sha256").update(`call:${userId}`).digest("hex").slice(0, 32);
}

/**
 * Every SDP line must end in CRLF, the last one included — trimming the offer
 * makes the parser hit EOF mid-line and reject the call as an invalid offer.
 */
function normalizeOffer(raw: string): string {
  const trimmed = raw.replace(/\s+$/, "");
  return trimmed ? trimmed + CRLF : "";
}

export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request);
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return jsonWithCors(request, { error: "MISSING_OPENAI_KEY" }, { status: 503 });
  }

  let body: {
    sdp?: unknown;
    targetLanguage?: unknown;
    interfaceLanguage?: unknown;
  };
  try {
    body = await request.json();
  } catch {
    return jsonWithCors(request, { error: "Invalid JSON" }, { status: 400 });
  }

  const sdp = normalizeOffer(typeof body.sdp === "string" ? body.sdp : "");
  if (!sdp.startsWith("v=")) {
    return jsonWithCors(request, { error: "sdp required" }, { status: 400 });
  }

  // Realtime audio is the most expensive thing this app can start, and once
  // the handshake below succeeds it runs phone-to-OpenAI with no session left
  // for us to end. Refusing to open it is the whole of the enforcement.
  const { userId, isPremium } = await resolveRequestEntitlement(request);

  // Builds before 2.41 sent no entitlement headers on this route at all, so a
  // subscriber calling from one is indistinguishable from a trial user and
  // would be cut off after two calls for something they had paid for. Those
  // builds are left alone; the gate applies to requests that say who they are.
  // Nothing regresses — the call was ungated for everyone until now — and this
  // heals itself as people update, with no flag anyone has to remember to flip.
  const identifiesItself = request.headers.has(REVENUECAT_USER_HEADER);

  if (
    identifiesItself &&
    !isPremium &&
    (await getCallsStarted(userId)) >= FREE_TRIAL_CALL_COUNT
  ) {
    return jsonWithCors(request, { error: "CALL_TRIAL_USED" }, { status: 403 });
  }

  // Points are charged only to a build that will hang up at the end of the block
  // it was sold. The server cannot end a call itself, so charging one that
  // ignores the block would take the points and leave the audio running anyway.
  const honoursBlocks =
    identifiesItself && request.headers.get(CALL_BLOCK_CLIENT_HEADER) === "1";

  let hold: { holdId: string; points: number; seconds: number } | null = null;
  if (honoursBlocks && isPremium) {
    hold = await openCallHold(userId, monthlyImportPoints(isPremium));
    if (!hold) {
      return jsonWithCors(request, { error: "NO_POINTS" }, { status: 402 });
    }
  }

  const targetLanguage = coerceLanguageCode(body.targetLanguage);
  const nativeLanguage = coerceLanguageCode(body.interfaceLanguage);
  const session = JSON.stringify(
    realtimeCallSessionConfig(targetLanguage, nativeLanguage),
  );
  const form = new FormData();
  form.set("sdp", sdp);
  form.set("session", session);

  try {
    const upstream = await fetch(OPENAI_CALLS, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "OpenAI-Safety-Identifier": safetyIdentifier(userId),
      },
      body: form,
    });
    const answer = await upstream.text();
    if (!upstream.ok || !answer.includes("v=")) {
      console.error("[realtime-call]", upstream.status, answer.slice(0, 500));
      // No call was opened, so nothing was spent. Settling at zero seconds
      // returns the whole block rather than charging for a failed handshake.
      if (hold) await settleCallHold(userId, hold.holdId, 0);
      return jsonWithCors(request, { error: "REALTIME_FAILED" }, { status: 502 });
    }
    if (identifiesItself && !isPremium) {
      await incrementCallsStarted(userId);
    }
    return new NextResponse(answer, {
      status: 200,
      headers: {
        ...corsHeaders(request),
        "Content-Type": "application/sdp",
        ...(hold
          ? {
              [CALL_HOLD_HEADER]: hold.holdId,
              [CALL_BLOCK_SECONDS_HEADER]: String(hold.seconds),
            }
          : {}),
      },
    });
  } catch (error) {
    console.error("[realtime-call]", error);
    if (hold) await settleCallHold(userId, hold.holdId, 0);
    return jsonWithCors(request, { error: "REALTIME_FAILED" }, { status: 502 });
  }
}
