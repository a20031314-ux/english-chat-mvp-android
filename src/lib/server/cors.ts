import { NextRequest, NextResponse } from "next/server";
import {
  APP_UPDATE_HEADER,
  requestAppVersion,
  updateLevelFor,
} from "@/lib/appVersion";

/** Capacitor Android/iOS WebView origins + deployed web app. */
const ALLOWED_ORIGIN_PREFIXES = [
  "https://localhost",
  "http://localhost",
  "capacitor://localhost",
  "https://english-chat-mvp.vercel.app",
  "https://english-chat-mvp-android.vercel.app",
];

// Every header the app actually sends. A missing one fails the preflight, which
// the Android build used to hide entirely because CapacitorHttp bypasses CORS.
// One call no longer does: the director is fetched around the native bridge so
// its answer can be read as it arrives (listen.ts), which is a plain browser
// fetch from https://localhost and is held to all of this. An omission here now
// breaks that call on a phone rather than staying invisible.
const ALLOWED_HEADERS =
  "Content-Type, x-client-premium, x-rc-user, x-learning-language, x-call-blocks, x-app-version, x-roleplay-points, x-roleplay-session, x-roleplay-bank, x-roleplay-stream";

/**
 * The call route answers with SDP and says what it charged in headers, which a
 * browser hides from script unless they are named here. The Android build does
 * not need this — CapacitorHttp bypasses CORS — so an omission would only ever
 * show up on the web path.
 */
const EXPOSED_HEADERS = "x-call-hold, x-call-seconds, x-app-update";

function resolveAllowOrigin(request: NextRequest): string {
  const origin = request.headers.get("origin");
  if (!origin) {
    return "https://localhost";
  }
  const allowed = ALLOWED_ORIGIN_PREFIXES.some(
    (prefix) => origin === prefix || origin.startsWith(`${prefix}:`),
  );
  return allowed ? origin : "https://localhost";
}

/**
 * What every answer carries, whatever route wrote it.
 *
 * The update signal rides here because this is the one thing every response
 * already goes through. No route has to know about it, no body changes shape,
 * and a build too old to understand it never sees it — headers it does not read
 * cost it nothing (appVersion.ts).
 */
export function corsHeaders(request: NextRequest): Record<string, string> {
  return {
    [APP_UPDATE_HEADER]: updateLevelFor(requestAppVersion(request.headers)),
    "Access-Control-Allow-Origin": resolveAllowOrigin(request),
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": ALLOWED_HEADERS,
    "Access-Control-Expose-Headers": EXPOSED_HEADERS,
    "Access-Control-Max-Age": "86400",
  };
}

export function applyCorsHeaders(
  request: NextRequest,
  response: NextResponse,
): NextResponse {
  const headers = corsHeaders(request);
  for (const [key, value] of Object.entries(headers)) {
    response.headers.set(key, value);
  }
  return response;
}

export function corsPreflightResponse(request: NextRequest): NextResponse {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(request),
  });
}

/**
 * An answer written a piece at a time, with everything a JSON one carries.
 *
 * Newline-delimited JSON rather than a single object, because the point is to
 * hand over the first useful part before the rest exists. `no-store` and the
 * buffering-off hint are not optional: a proxy that holds the body until it is
 * complete turns this back into the response it replaced, and silently.
 */
export function streamWithCors(
  request: NextRequest,
  stream: ReadableStream<Uint8Array>,
): NextResponse {
  return new NextResponse(stream, {
    headers: {
      ...corsHeaders(request),
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Accel-Buffering": "no",
    },
  });
}

export function jsonWithCors(
  request: NextRequest,
  data: unknown,
  init?: { status?: number },
): NextResponse {
  return NextResponse.json(data, {
    status: init?.status ?? 200,
    headers: corsHeaders(request),
  });
}
