import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { corsHeaders, corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { coerceLanguageCode } from "@/lib/learningLanguages";
import { realtimeCallSessionConfig } from "@/lib/realtimeCallSession";

export const dynamic = "force-dynamic";

const OPENAI_CALLS = "https://api.openai.com/v1/realtime/calls";

function requestUserId(request: NextRequest) {
  return request.cookies.get("ec_uid")?.value ?? "local-anonymous";
}

function safetyIdentifier(userId: string): string {
  return createHash("sha256").update(`call:${userId}`).digest("hex").slice(0, 32);
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

  const sdp = typeof body.sdp === "string" ? body.sdp.trim() : "";
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
