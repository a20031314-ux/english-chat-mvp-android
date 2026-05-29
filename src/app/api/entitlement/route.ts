import { NextRequest, NextResponse } from "next/server";
import { FREE_DAILY_CHAT_LIMIT } from "@/lib/billing/config";
import { getDailyUsed } from "@/lib/server/entitlementStore";
import { isPremiumClientRequest } from "@/lib/server/premiumRequest";

function requestUserId(request: NextRequest) {
  return request.cookies.get("ec_uid")?.value ?? "local-anonymous";
}

export async function GET(request: NextRequest) {
  const userId = requestUserId(request);
  const dailyUsed = getDailyUsed(userId);
  const isPremium = isPremiumClientRequest(request);

  return NextResponse.json({
    plan: isPremium ? ("pro" as const) : ("free" as const),
    dailyUsed,
    dailyLimit: isPremium ? null : FREE_DAILY_CHAT_LIMIT,
  });
}
