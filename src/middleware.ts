import { NextRequest, NextResponse } from "next/server";
import { applyCorsHeaders, corsPreflightResponse } from "@/lib/server/cors";

export function middleware(request: NextRequest) {
  if (request.method === "OPTIONS") {
    return corsPreflightResponse(request);
  }

  const response = NextResponse.next();
  return applyCorsHeaders(request, response);
}

export const config = {
  matcher: "/api/:path*",
};
