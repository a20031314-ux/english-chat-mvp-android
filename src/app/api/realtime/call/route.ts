import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { corsHeaders, corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { coerceLanguageCode } from "@/lib/learningLanguages";
import { realtimeCallSessionConfig } from "@/lib/realtimeCallSession";

export const dynamic = "force-dynamic";

const OPENAI_CALLS = "https://api.openai.com/v1/realtime/calls";
const CRLF = "\r\n";

function requestUserId(request: NextRequest) {
  return request.cookies.get("ec_uid")?.value ?? "local-anonymous";
}

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

  let body: { sdp?: unknown; targetLanguage?: unknown };
  try {
    body = await request.json();
  } catch {
    return jsonWithCors(request, { error: "Invalid JSON" }, { status: 400 });
  }

  const sdp = normalizeOffer(typeof body.sdp === "string" ? body.sdp : "");
  if (!sdp.startsWith("v=")) {
    return jsonWithCors(request, { error: "sdp required" }, { status: 400 });
  }

  const targetLanguage = coerceLanguageCode(body.targetLanguage);
  const session = JSON.stringify(realtimeCallSessionConfig(targetLanguage));
  const form = new FormData();
  form.set("sdp", sdp);
  form.set("session", session);

  try {
    const upstream = await fetch(OPENAI_CALLS, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "OpenAI-Safety-Identifier": safetyIdentifier(requestUserId(request)),
      },
      body: form,
    });
    const answer = await upstream.text();
    if (!upstream.ok || !answer.includes("v=")) {
      console.error("[realtime-call]", upstream.status, answer.slice(0, 500));
      return jsonWithCors(request, { error: "REALTIME_FAILED" }, { status: 502 });
    }
    return new NextResponse(answer, {
      status: 200,
      headers: {
        ...corsHeaders(request),
        "Content-Type": "application/sdp",
      },
    });
  } catch (error) {
    console.error("[realtime-call]", error);
    return jsonWithCors(request, { error: "REALTIME_FAILED" }, { status: 502 });
  }
}
