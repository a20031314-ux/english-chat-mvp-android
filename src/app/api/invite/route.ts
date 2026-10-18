import { NextRequest } from "next/server";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { requestAuth } from "@/lib/server/premiumRequest";
import { readAccount, readPhoto } from "@/lib/server/accountStore";
import { blockedEitherWay, follow } from "@/lib/server/socialStore";
import { readMeta, liveCount } from "@/lib/server/roomStore";
import { readPresence } from "@/lib/server/presenceStore";
import { inviteCodeFor, inviterOf, isInviteLinkCode, noteJoined } from "@/lib/server/inviteLinkStore";
import { isRoomId } from "@/lib/rooms/protocol";
import type { InviteLookup } from "@/lib/invite/shared";

export const dynamic = "force-dynamic";

/**
 * 친구 초대 링크.
 *   mine              (로그인) → { code }
 *   lookup {c, room?} (누구나) → InviteLookup — 초대 웹 페이지와 앱의 환영 시트가 쓴다
 *   accept {c}        (로그인) → 서로 팔로우, 처음 데려온 사람 기록 → { inviterId }
 * 방 초대는 공개 방만(1:1·단체방 통화는 보이지 않음).
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
    return bad(request, "BAD_REQUEST");
  }
  const me = requestAuth(request)?.accountId ?? null;

  if (body.action === "mine") {
    if (!me) return bad(request, "SIGNED_OUT", 401);
    const code = await inviteCodeFor(me);
    return code ? jsonWithCors(request, { code }) : bad(request, "STORE_FAILED", 503);
  }

  if (!isInviteLinkCode(body.c)) return bad(request, "BAD_CODE");
  const inviterId = await inviterOf(body.c);
  const inviter = inviterId ? await readAccount(inviterId) : null;
  if (!inviter) return bad(request, "NO_INVITE", 404);

  if (body.action === "lookup") {
    const [photo, seen] = await Promise.all([
      inviter.profile.hasPhoto ? readPhoto(inviter.id) : Promise.resolve(null),
      readPresence(inviter.id),
    ]);
    let room: InviteLookup["room"] = null;
    if (isRoomId(body.room)) {
      const meta = await readMeta(body.room);
      if (meta && !meta.private && !meta.groupId) {
        room = { id: meta.id, name: meta.name, languages: meta.languages, people: await liveCount(meta.id) };
      }
    }
    const result: InviteLookup = {
      inviter: {
        id: inviter.id,
        nickname: inviter.profile.nickname || inviter.username || "",
        bio: Array.from(inviter.profile.bio).slice(0, 140).join(""),
        photo,
        learn: seen?.learn ?? null,
        ui: seen?.ui ?? null,
      },
      room,
      isMe: me === inviter.id,
    };
    return jsonWithCors(request, result);
  }

  if (body.action === "accept") {
    if (!me) return bad(request, "SIGNED_OUT", 401);
    if (me === inviter.id) return jsonWithCors(request, { inviterId: inviter.id, self: true });
    if (await blockedEitherWay(me, inviter.id)) return bad(request, "BLOCKED", 409);
    await follow(me, inviter.id);
    await follow(inviter.id, me);
    await noteJoined(inviter.id, me);
    return jsonWithCors(request, { inviterId: inviter.id });
  }

  return bad(request, "UNKNOWN_ACTION");
}
