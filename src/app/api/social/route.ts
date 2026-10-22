import { NextRequest } from "next/server";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { requestAuth } from "@/lib/server/premiumRequest";
import { readAccount, readAccounts, readPhoto } from "@/lib/server/accountStore";
import { readPresence, recentPeople, touchPresence } from "@/lib/server/presenceStore";
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
import { suspendedResponse } from "@/lib/server/suspension";
import { factsOf, sharedInterests, showOf } from "@/lib/account/profileFacts";
import { badgesFor, contribScore, peopleBoostMs } from "@/lib/rooms/contribution";
import { readContrib, readContribMany, recordThank, type ThankTarget } from "@/lib/server/contribStore";
import { readSelfCheck } from "@/lib/server/selfCheckStore";
import { localDay, parseOffset, TZ_OFFSET_HEADER } from "@/lib/billing/plans";

export const dynamic = "force-dynamic";

/**
 * 사람 사이: 공개 프로필 보기, 사람 목록, 팔로우·언팔로우, 차단·풀기, 신고.
 * 프로필 보기만 로그인 없이도 되고(팔로우 여부는 false), 나머지는 로그인해야 한다.
 *
 * 공개 프로필에는 닉네임·자기소개·사진·가입 시기·숫자, 나에 대한 사실(칩), 켠 칸(기여·꾸준함·목표)만 —
 * 아이디·이메일·학습 상태(실수·약점·레벨·문장)는 내보내지 않는다(hub/drafts/profile-2026-10-23.md).
 *
 * thank: "도움됐어요" — 질문한 사람만 그 답에(server/contribStore.ts findAnswerer).
 */

const LANG = /^[a-z]{2}$/;

/** 앱이 보낸 답 위치. 모양이 틀리면 null. */
function thankTarget(body: Record<string, unknown>): ThankTarget | null {
  const seq = typeof body.seq === "number" && Number.isInteger(body.seq) && body.seq >= 0 ? body.seq : null;
  const id = (value: unknown) => (typeof value === "string" && /^[\w:.-]{1,80}$/.test(value) ? value : null);
  if (body.kind === "room" && isRoomId(body.roomId) && seq !== null) return { kind: "room", roomId: body.roomId, seq };
  if (body.kind === "dm" && id(body.threadId) && seq !== null) return { kind: "dm", threadId: id(body.threadId)!, seq };
  if (body.kind === "board" && id(body.postId) && id(body.commentId)) {
    return { kind: "board", postId: id(body.postId)!, commentId: id(body.commentId)! };
  }
  return null;
}
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
    const [accounts, theirBlocks, contribs, meAccount] = await Promise.all([
      readAccounts(candidates.map((row) => row.id)),
      readBlockedMany(candidates.map((row) => row.id)),
      readContribMany(candidates.map((row) => row.id)),
      readAccount(me),
    ]);
    const myInterests = factsOf(meAccount?.profile.facts).interests;
    const now = Date.now();
    // 정렬: 마지막으로 본 시각 + 기여 가산(최근 30일, 최대 6시간) + 관심사 겹침(하나에 20분, 최대 1시간).
    // 14일 창은 그대로라 오래 안 온 사람이 기여만으로 위에 오지는 않는다.
    const ranked: { card: PersonCard; rank: number }[] = [];
    candidates.forEach((row, index) => {
      const account = accounts.at(index);
      if (!account || account.profile.hidden === true) return;
      if (theirBlocks.at(index)?.includes(me)) return;
      const nickname = account.profile.nickname || account.username || "";
      if (!nickname) return;
      const facts = factsOf(account.profile.facts);
      const show = showOf(account.profile.show);
      const contrib = contribs.at(index);
      const shared = sharedInterests(myInterests, facts.interests);
      const boost = contrib ? peopleBoostMs(contribScore(contrib, now)) : 0;
      ranked.push({
        rank: row.presence.at + boost + Math.min(shared, 3) * 20 * 60 * 1000,
        card: {
          id: account.id,
          nickname,
          bio: Array.from(account.profile.bio).slice(0, 140).join(""),
          hasPhoto: account.profile.hasPhoto,
          ui: row.presence.ui,
          learn: row.presence.learn,
          lastSeen: row.presence.at,
          isFollowing: following.includes(account.id),
          native: facts.native,
          country: facts.country,
          interests: facts.interests.slice(0, 3),
          sharedInterests: shared,
          meetModes: facts.meetModes,
          ...(show.help && contrib && contrib.help > 0 ? { help: contrib.help } : {}),
        },
      });
    });
    ranked.sort((a, b) => b.rank - a.rank);
    const people: PersonCard[] = ranked.slice(0, 60).map((row) => row.card);
    return jsonWithCors(request, { people });
  }

  if (action === "thank") {
    if (!me) return bad(request, "SIGNED_OUT", 401);
    const stop = await suspendedResponse(request, me);
    if (stop) return stop;
    const target = thankTarget(body);
    if (!target) return bad(request, "BAD_TARGET");
    const result = await recordThank({
      me,
      target,
      lang: typeof body.learn === "string" && LANG.test(body.learn) ? body.learn : null,
      day: localDay(Date.now(), parseOffset(request.headers.get(TZ_OFFSET_HEADER))),
    });
    if ("error" in result) {
      const status = result.error === "NOT_FOUND" ? 404 : result.error === "NOT_ASKER" ? 403 : 409;
      return bad(request, result.error, status);
    }
    return jsonWithCors(request, result);
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
    const show = showOf(account.profile.show);
    // 목표 한 줄은 그 사람이 지금 배우는 언어의 체크 답 — 보낸 learn이 없으면 그 사람의 마지막 접속 언어.
    const learn =
      typeof body.learn === "string" && LANG.test(body.learn)
        ? body.learn
        : show.goal
          ? ((await readPresence(target))?.learn ?? null)
          : null;
    const [numbers, photo, following, blocked, contrib, check] = await Promise.all([
      counts(target),
      account.profile.hasPhoto ? readPhoto(target) : Promise.resolve(null),
      me ? readFollowing(me) : Promise.resolve([] as string[]),
      me ? readBlocked(me) : Promise.resolve([] as string[]),
      readContrib(target),
      // 목표 한 줄: 그 사람이 지금 배우는 언어(사람 목록에서 받은 learn)의 체크 답.
      show.goal && learn ? readSelfCheck(account.dataUserId, learn) : Promise.resolve(null),
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
      facts: factsOf(account.profile.facts),
      badges: badgesFor(contrib, show, localDay(Date.now(), null)),
      ...(check && learn ? { goal: { language: learn, use: check.use ?? null, focus: check.focus } } : {}),
      ...(me === target ? { show } : {}),
    };
    return jsonWithCors(request, { profile });
  }

  if (!me) return bad(request, "SIGNED_OUT", 401);
  if (!(await readAccount(target))) return bad(request, "NO_ACCOUNT", 404);

  // 운영자가 사람 기능을 정지한 계정은 쓰기만 막는다(opsStore.ts).
  if (typeof action === "string" && ["follow"].includes(action)) {
    const stop = await suspendedResponse(request, me);
    if (stop) return stop;
  }
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
