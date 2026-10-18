import { NextRequest } from "next/server";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { requestAuth } from "@/lib/server/premiumRequest";
import { readAccount } from "@/lib/server/accountStore";
import { blockedEitherWay, isAccountId } from "@/lib/server/socialStore";
import {
  answerInvite,
  createGroup,
  inviteToGroup,
  kickFromGroup,
  leaveGroup,
  markGroupRead,
  myGroups,
  readGroup,
  readGroupMessages,
  sendToGroup,
  transferGroup,
} from "@/lib/server/groupStore";
import { isInviteCode } from "@/lib/server/roomStore";
import { DM_MAX_CHARS } from "@/lib/rooms/dm";
import { GROUP_MAX_MEMBERS, GROUP_MAX_NAME_CHARS, isGroupId } from "@/lib/rooms/group";
import { cleanText } from "@/lib/rooms/protocol";
import { cleanLanguages } from "@/lib/rooms/roomFilter";

export const dynamic = "force-dynamic";

/**
 * 단체방(워크스페이스 1단계, rooms/group.ts). 로그인한 사람만, 초대로만 들어온다.
 *
 *   mine                                  → { groups: GroupSummary[] }
 *   create { name, languages, invite[] }  → { group }
 *   open { groupId }                      → { group, messages }   (참여한 사람만 줄, 읽음 표시)
 *   poll { groupId, since }               → { group, messages }
 *   send { groupId, text, quoteSeq?, ask? } → { group, message }
 *   invite { groupId, target }            → 방에 있는 사람이면 누구나
 *   answer { groupId, accept }            → 받은 초대에 참여/거절
 *   leave { groupId } · kick/transfer { groupId, target } (방장만)
 */
export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request);
}

const bad = (request: NextRequest, error: string, status = 400) => jsonWithCors(request, { error }, { status });

async function inviteable(me: string, target: unknown): Promise<string | null> {
  if (!isAccountId(target) || target === me) return null;
  if (!(await readAccount(target))) return null;
  if (await blockedEitherWay(me, target)) return null;
  return target;
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return bad(request, "Invalid JSON");
  }
  if (!isInviteCode(body.code)) return bad(request, "BAD_CODE", 403);
  const auth = requestAuth(request);
  if (!auth) return bad(request, "SIGNED_OUT", 401);
  const me = auth.accountId;
  const action = body.action;

  if (action === "mine") return jsonWithCors(request, { groups: await myGroups(me) });

  if (action === "create") {
    const name = cleanText(body.name, GROUP_MAX_NAME_CHARS);
    if (!name) return bad(request, "NO_NAME");
    const raw = Array.isArray(body.invite) ? body.invite.slice(0, GROUP_MAX_MEMBERS - 1) : [];
    const invite = (await Promise.all(raw.map((target) => inviteable(me, target)))).filter((id): id is string => Boolean(id));
    const group = await createGroup({ owner: me, name, languages: cleanLanguages(body.languages), invite: [...new Set(invite)] });
    return jsonWithCors(request, { group });
  }

  if (!isGroupId(body.groupId)) return bad(request, "BAD_GROUP");
  const group = await readGroup(body.groupId);
  if (!group || !(group.members.includes(me) || group.invited.includes(me))) return bad(request, "NO_GROUP", 404);

  if (action === "answer") {
    const next = await answerInvite(me, group.id, body.accept === true);
    return next ? jsonWithCors(request, { group: next }) : bad(request, "NO_INVITE", 409);
  }

  // 여기부터는 참여한 사람만(초대만 받은 사람은 이름·사람만 보고 줄은 못 본다).
  if (!group.members.includes(me)) {
    if (action === "open") return jsonWithCors(request, { group, messages: [] });
    return bad(request, "NOT_MEMBER", 403);
  }

  if (action === "open" || action === "poll") {
    const since = action === "poll" && typeof body.since === "number" && Number.isFinite(body.since) ? body.since : 0;
    const messages = await readGroupMessages(group.id, since);
    if (group.lastSeq) await markGroupRead(me, group.id, group.lastSeq);
    return jsonWithCors(request, { group, messages });
  }

  if (action === "send") {
    const text = cleanText(body.text, DM_MAX_CHARS);
    if (!text) return bad(request, "NO_TEXT");
    const result = await sendToGroup({
      from: me,
      id: group.id,
      text,
      ...(typeof body.quoteSeq === "number" ? { quoteSeq: body.quoteSeq, ask: body.ask === true } : {}),
    });
    if (!result.ok) return bad(request, result.error, result.error === "NO_QUOTE" ? 404 : 403);
    await markGroupRead(me, group.id, result.message.seq);
    return jsonWithCors(request, { group: result.group, message: result.message });
  }

  if (action === "invite") {
    const target = await inviteable(me, body.target);
    if (!target) return bad(request, "BAD_TARGET");
    const result = await inviteToGroup(me, group.id, target);
    return result === "ok" ? jsonWithCors(request, { ok: true }) : bad(request, result, 409);
  }

  if (action === "leave") {
    return (await leaveGroup(me, group.id)) ? jsonWithCors(request, { ok: true }) : bad(request, "NOT_MEMBER", 409);
  }

  if (action === "kick" || action === "transfer") {
    if (!isAccountId(body.target)) return bad(request, "BAD_TARGET");
    const result = action === "kick" ? await kickFromGroup(me, group.id, body.target) : await transferGroup(me, group.id, body.target);
    return result === "ok" ? jsonWithCors(request, { ok: true }) : bad(request, result, result === "NOT_OWNER" ? 403 : 409);
  }

  return bad(request, "UNKNOWN_ACTION");
}
