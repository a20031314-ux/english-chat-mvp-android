import { NextRequest } from "next/server";
import { FREE_DAILY_CHAT_LIMIT } from "@/lib/billing/config";
import { getDailyUsed } from "@/lib/server/entitlementStore";
import { isPremiumClientRequest } from "@/lib/server/premiumRequest";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";

function requestUserId(request: NextRequest) {
  return request.cookies.get("ec_uid")?.value ?? "local-anonymous";
}

export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request);
}

export async function GET(request: NextRequest) {
  const userId = requestUserId(request);
  const dailyUsed = getDailyUsed(userId);
  const isPremium = isPremiumClientRequest(request);

  return jsonWithCors(request, {
    plan: isPremium ? ("pro" as const) : ("free" as const),
    dailyUsed,
    dailyLimit: isPremium ? null : FREE_DAILY_CHAT_LIMIT,
  });
}
