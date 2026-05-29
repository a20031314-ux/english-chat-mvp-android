import type { NextRequest } from "next/server";
import { PREMIUM_CLIENT_HEADER } from "@/lib/billing/config";

/** MVP: trusts native client when RevenueCat reports premium (no receipt API yet). */
export function isPremiumClientRequest(request: NextRequest): boolean {
  return request.headers.get(PREMIUM_CLIENT_HEADER) === "1";
}
