import { NextRequest } from "next/server";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { accountFromRequest } from "@/lib/server/accountRequest";
import { toPublic } from "@/lib/server/accountStore";
import { noteInviteeActive } from "@/lib/server/inviteRewardStore";

export const dynamic = "force-dynamic";

/** GET → { account } | 401 { error: SIGNED_OUT | ACCOUNT_GONE } */
export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request);
}

export async function GET(request: NextRequest) {
  const found = await accountFromRequest(request);
  if ("response" in found) return found.response;
  // 친구 초대로 온 사람이면 오늘 쓴 날로 센다(7일 안에 2일이면 둘 다 보상, inviteRewardStore).
  await noteInviteeActive(found.account.id).catch(() => null);
  return jsonWithCors(request, { account: await toPublic(found.account) });
}
