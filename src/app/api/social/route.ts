import { NextRequest } from "next/server";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { requestAuth } from "@/lib/server/premiumRequest";
import { readAccount, readAccounts, readPhoto } from "@/lib/server/accountStore";
import { recentPeople, touchPresence } from "@/lib/server/presenceStore";
import {
  addReport,
  block,
  counts,
  follow,
  isAccountId,
  readBlocked,
  readBlockedMany,
  readFollowing,
  unblock,
  unfollow,
} from "@/lib/server/socialStore";
import { cleanText, isRoomId } from "@/lib/rooms/protocol";
import { PEOPLE_WINDOW_MS, type PersonCard, type PublicProfile } from "@/lib/rooms/social";

export const dynamic = "force-dynamic";

/**
 * 사람 사이: 공개 프로필 보기, 사람 목록, 팔로우·언팔로우, 차단·풀기, 신고.
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

  // 앱을 쓰는 중이라는 신호(사람 목록의 순서). 학습 언어·앱 언어를 같이 받는다.
  if (action === "ping") {
    if (!me) return bad(request, "SIGNED_OUT", 401);
    await touchPresence(me, { learn: body.learn, ui: body.ui });
    return jsonWithCors(request, { ok: true });
  }

  // 사람 목록: 최근 14일 안에 앱을 쓴 사람, 최근 순. 나, 서로 차단한 사람, 숨긴 사람, 이름 없는 사람은 뺀다.
  if (action === "people") {
    if (!me) return bad(request, "SIGNED_OUT", 401);
    await touchPresence(me, { learn: body.learn, ui: body.ui });
    const recent = (await recentPeople(200, Date.now() - PEOPLE_WINDOW_MS)).filter((row) => row.id !== me);
    const [mine, following] = await Promise.all([readBlocked(me), readFollowing(me)]);
    const candidates = recent.filter((row) => !mine.includes(row.id));
    const [accounts, theirBlocks] = await Promise.all([
      readAccounts(candidates.map((row) => row.id)),
      readBlockedMany(candidates.map((row) => row.id)),
    ]);
    const people: PersonCard[] = [];
    candidates.forEach((row, index) => {
      const account = accounts.at(index);
      if (!account || account.profile.hidden === true) return;
      if (theirBlocks.at(index)?.includes(me)) return;
      const nickname = account.profile.nickname || account.username || "";
      if (!nickname) return;
      people.push({
        id: account.id,
        nickname,
        bio: Array.from(account.profile.bio).slice(0, 140).join(""),
        hasPhoto: account.profile.hasPhoto,
        ui: row.presence.ui,
        learn: row.presence.learn,
        lastSeen: row.presence.at,
        isFollowing: following.includes(account.id),
      });
    });
    return jsonWithCors(request, { people: people.slice(0, 60) });
  }

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
