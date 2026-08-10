import type { NextRequest } from "next/server";
import { PREMIUM_CLIENT_HEADER } from "@/lib/billing/config";

/** MVP: trusts native client when RevenueCat reports premium (no receipt API yet). */
export function isPremiumClientRequest(request: NextRequest): boolean {
  if (process.env.NODE_ENV === "development") {
    return true;
  }
  return request.headers.get(PREMIUM_CLIENT_HEADER) === "1";
}
