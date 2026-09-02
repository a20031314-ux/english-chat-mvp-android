import { NextRequest, NextResponse } from "next/server";

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
  "Content-Type, x-client-premium, x-rc-user, x-learning-language";

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

export function corsHeaders(request: NextRequest): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": resolveAllowOrigin(request),
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": ALLOWED_HEADERS,
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
