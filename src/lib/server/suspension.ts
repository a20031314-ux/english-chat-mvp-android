import type { NextRequest } from "next/server";
import { jsonWithCors } from "./cors";
import { readBan } from "./opsStore";

/**
 * 운영자가 사람 기능을 정지한 계정이면 403 `{error: "SUSPENDED", until}`(opsStore.ts).
 * 쓰는 동작(보내기·올리기·만들기·들어가기)에서만 부른다 — 읽기·신고·차단은 그대로.
 */
export async function suspendedResponse(request: NextRequest, me: string) {
  const ban = await readBan(me);
  return ban ? jsonWithCors(request, { error: "SUSPENDED", until: ban.until }, { status: 403 }) : null;
}
