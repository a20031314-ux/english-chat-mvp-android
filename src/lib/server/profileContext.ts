import type { NextRequest } from "next/server";
import { requestAuth } from "./premiumRequest.ts";
import { readAccount } from "./accountStore.ts";
import { markStudyDay } from "./contribStore.ts";
import { factsOf, factsPrompt, showOf } from "../account/profileFacts.ts";
import { localDay, parseOffset, TZ_OFFSET_HEADER } from "../billing/plans.ts";

/**
 * 채팅·통화 한 턴에 프로필이 하는 일(hub/drafts/profile-2026-10-23.md):
 * - 튜터에게 관심사·하는 일 한 줄(로그인했고 "튜터 사용"을 켰을 때만, account/profileFacts.ts factsPrompt)
 * - 공부한 날 표시(꾸준함 칸, 하루 한 번만 씀)
 *
 * 로그인하지 않았으면 아무것도 하지 않는다. 실패해도 대화는 그대로(빈 줄).
 */
export async function profileTurn(request: NextRequest): Promise<string> {
  const accountId = requestAuth(request)?.accountId;
  if (!accountId) return "";
  try {
    const day = localDay(Date.now(), parseOffset(request.headers.get(TZ_OFFSET_HEADER)));
    const [account] = await Promise.all([readAccount(accountId), markStudyDay(accountId, day)]);
    if (!account) return "";
    return factsPrompt(factsOf(account.profile.facts), showOf(account.profile.show));
  } catch (error) {
    console.error("[profile-turn]", error);
    return "";
  }
}

/** 튜터 요약 뒤에 프로필 줄을 붙인다(둘 다 비면 빈 문자열). */
export function withProfileLine(brief: string, line: string): string {
  if (!line) return brief;
  return brief ? `${brief}\n${line}` : line;
}
