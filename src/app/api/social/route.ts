import { NextRequest } from "next/server";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { requestAuth } from "@/lib/server/premiumRequest";
import { readAccount, readPhoto } from "@/lib/server/accountStore";
import {
  addReport,
  block,
  counts,
  follow,
  isAccountId,
  readBlocked,
  readFollowing,
  unblock,
  unfollow,
} from "@/lib/server/socialStore";
import { cleanText, isRoomId } from "@/lib/rooms/protocol";
import type { PublicProfile } from "@/lib/rooms/social";

export const dynamic = "force-dynamic";

/**
 * 사람 사이: 공개 프로필 보기, 팔로우·언팔로우, 차단·풀기, 신고.
 * 프로필 보기만 로그인 없이도 되고(팔로우 여부는 false), 나머지는 로그인해야 한다.
 *
 * 공개 프로필에는 닉네임·자기소개·사진·가입 시기·숫자만 — 아이디·이메일은 내보내지 않는다.
 */
export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request);
}

const bad = (request: NextRequest, error: string, status = 400) => jsonWithCors(request, { error }, { status });


export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return bad(request, "Invalid JSON");
  }
  const auth = requestAuth(request);
  const me = auth?.accountId ?? null;
  const action = body.action;

  if (action === "mine") {
    if (!me) return bad(request, "SIGNED_OUT", 401);
    const [following, blocked] = await Promise.all([readFollowing(me), readBlocked(me)]);
    return jsonWithCors(request, { following, blocked });
  }

  if (!isAccountId(body.target)) return bad(request, "BAD_TARGET");
  const target = body.target;

  if (action === "profile") {
    const account = await readAccount(target);
    if (!account) return bad(request, "NO_ACCOUNT", 404);
    const [numbers, photo, following, blocked] = await Promise.all([
      counts(target),
      account.profile.hasPhoto ? readPhoto(target) : Promise.resolve(null),
      me ? readFollowing(me) : Promise.resolve([] as string[]),
      me ? readBlocked(me) : Promise.resolve([] as string[]),
    ]);
    const profile: PublicProfile = {
      id: account.id,
      nickname: account.profile.nickname || account.username || "",
      bio: account.profile.bio,
      photo,
      since: account.createdAt.slice(0, 7),
      ...numbers,
      isMe: me === target,
      isFollowing: following.includes(target),
      blockedByMe: blocked.includes(target),
    };
    return jsonWithCors(request, { profile });
  }

  if (!me) return bad(request, "SIGNED_OUT", 401);
  if (!(await readAccount(target))) return bad(request, "NO_ACCOUNT", 404);

  if (action === "follow") {
    const result = await follow(me, target);
    return result === "ok" ? jsonWithCors(request, { ok: true }) : bad(request, result, 409);
  }
  if (action === "unfollow") {
    await unfollow(me, target);
    return jsonWithCors(request, { ok: true });
  }
  if (action === "block") {
    const result = await block(me, target);
    return result === "ok" ? jsonWithCors(request, { ok: true }) : bad(request, result, 409);
  }
  if (action === "unblock") {
    await unblock(me, target);
    return jsonWithCors(request, { ok: true });
  }
  if (action === "report") {
    if (me === target) return bad(request, "SELF");
    const reason = cleanText(body.reason, 300);
    if (!reason) return bad(request, "NO_REASON");
    const lines = Array.isArray(body.lines)
      ? body.lines.filter((line): line is string => typeof line === "string").slice(-5).map((line) => cleanText(line, 300))
      : [];
    await addReport({
      at: new Date().toISOString(),
      reporter: me,
      target,
      reason,
      roomId: isRoomId(body.roomId) ? body.roomId : null,
      lines,
    });
    return jsonWithCors(request, { ok: true });
  }
  return bad(request, "UNKNOWN_ACTION");
}
