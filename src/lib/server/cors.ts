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
// the Android build hides today because CapacitorHttp bypasses CORS entirely —
// so an omission here stays invisible until something makes a plain fetch.
const ALLOWED_HEADERS =
  "Content-Type, x-client-premium, x-rc-user, x-learning-language, x-call-blocks, x-app-version, x-roleplay-points, x-roleplay-session";

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
