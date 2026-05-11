import { NextRequest, NextResponse } from "next/server";
import { getDailyUsed } from "@/lib/server/entitlementStore";

const FREE_DAILY_LIMIT = 15;

function requestUserId(request: NextRequest) {
  return request.cookies.get("ec_uid")?.value ?? "local-anonymous";
}

export async function GET(request: NextRequest) {
  const userId = requestUserId(request);
  const dailyUsed = getDailyUsed(userId);

  return NextResponse.json({
    plan: "free" as const,
    dailyUsed,
    dailyLimit: FREE_DAILY_LIMIT,
  });
}
