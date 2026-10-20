import { NextRequest } from "next/server";
import { isMediaId } from "@/lib/rooms/media";
import { claimMedia } from "@/lib/server/mediaStore";
import { pollFrom } from "@/lib/server/lateRows";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { requestAuth } from "@/lib/server/premiumRequest";
import { readAccount } from "@/lib/server/accountStore";
import { blockedEitherWay, isAccountId } from "@/lib/server/socialStore";
import {
  answerInvite,
  createGroup,
  inviteToGroup,
  kickFromGroup,
  addSpaceItem,
  leaveGroup,
  logGroupCall,
  makeTeam,
  readSpace,
  removeSpaceItem,
  requestMate,
  updateTeam,
  noteGroupCall,
  saveGroupMeta,
  markGroupRead,
  myGroups,
  readGroup,
  readGroupMessages,
  sendToGroup,
  transferGroup,
} from "@/lib/server/groupStore";
import { allowInRoom, createRoom, isInviteCode, liveCount, readLines, readMeta } from "@/lib/server/roomStore";
import { kvSetJsonIfAbsent } from "@/lib/server/kv";
import { DM_MAX_CHARS } from "@/lib/rooms/dm";
import { GROUP_MAX_MEMBERS, GROUP_MAX_NAME_CHARS, SPACE_NOTE_MAX_CHARS, SPACE_TEXT_MAX_CHARS, TEAM_GOAL_MAX_CHARS, cleanSchedule, isGroupId } from "@/lib/rooms/group";
import { cleanText, isPeerId, isRoomId } from "@/lib/rooms/protocol";
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
 * 팀·러닝메이트(hub/drafts/team-workspace.md):
 *   mate { target, languages }            → { group, state }  두 사람 사이 메이트는 하나(상대 신청이 있으면 수락)
 *   team { groupId }                      → 단체방을 팀으로(방장만)
 *   space { groupId }                     → { group, space }  쌓인 것·같이 한 날
 *   goal { groupId, goal } · schedule { groupId, schedule|null } → 팀에 있는 사람 누구나
 *   share { groupId, text, note? } · unshare { groupId, itemId }(내 것만)
 */
export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request);
}

const bad = (request: NextRequest, error: string, status = 400) => jsonWithCors(request, { error }, { status });

/** 단체방 통화가 열려 있으면 들어와 있는 사람 수. */
async function callStatus(roomId: string | undefined): Promise<{ roomId: string; live: number } | null> {
  if (!roomId) return null;
  const meta = await readMeta(roomId);
  return meta ? { roomId, live: await liveCount(roomId) } : null;
}

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

  if (action === "mate") {
    const target = await inviteable(me, body.target);
    if (!target) return bad(request, "BAD_TARGET");
    return jsonWithCors(request, await requestMate(me, target, cleanLanguages(body.languages)));
  }

  if (!isGroupId(body.groupId)) return bad(request, "BAD_GROUP");
  const group = await readGroup(body.groupId);
  // 방장이 내보낸 사람: 앱이 "내보내졌어요"를 띄우게 따로 알린다.
  if (group && (group.kicked ?? []).includes(me) && !group.members.includes(me) && !group.invited.includes(me)) {
    return bad(request, "REMOVED", 403);
  }
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
    const [messages, call] = await Promise.all([readGroupMessages(group.id, pollFrom(since)), callStatus(group.callRoomId)]);
    if (group.lastSeq) await markGroupRead(me, group.id, group.lastSeq);
    return jsonWithCors(request, { group, messages, call });
  }

  // 📞 단체방 통화: 열려 있으면 그 방(나도 들어갈 수 있게), 없으면 새 비공개 방 + "통화 시작" 줄.
  if (action === "call") {
    if (!isPeerId(body.peerId)) return bad(request, "BAD_PEER");
    const open = group.callRoomId ? await allowInRoom(group.callRoomId, me) : null;
    if (open) return jsonWithCors(request, { room: open });
    const account = await readAccount(me);
    const room = await createRoom({
      name: `📞 ${group.name || "🤝"}`,
      languages: group.languages,
      hostPeerId: body.peerId,
      hostAccountId: me,
      hostNickname: cleanText(account?.profile.nickname || account?.username || "", 20),
      private: true,
      allowed: [...group.members],
      groupId: group.id,
      // 러닝메이트(둘)만 영상. 팀 영상은 사람이 많아 중계가 필요해 아직(hub/drafts/video-workspace.md).
      ...(group.team?.kind === "mate" ? { video: true } : {}),
    });
    await noteGroupCall(group, me, room.id);
    return jsonWithCors(request, { room });
  }

  // 통화에서 나갈 때: 모두 나갔으면 자막을 기록으로 한 번 남기고, 다음 📞은 새 방으로.
  if (action === "endCall") {
    if (!isRoomId(body.roomId)) return bad(request, "BAD_ROOM");
    const meta = await readMeta(body.roomId);
    if (!meta?.private || meta.groupId !== group.id) return bad(request, "BAD_ROOM");
    if ((await liveCount(meta.id)) > 0) return jsonWithCors(request, { logged: false });
    const lines = await readLines(meta.id);
    if (!(await kvSetJsonIfAbsent(`grp:v1:log:${meta.id}`, 1, 7 * 24 * 60 * 60))) return jsonWithCors(request, { logged: false });
    const fresh = (await readGroup(group.id)) ?? group;
    const rest = { ...fresh, callRoomId: fresh.callRoomId === meta.id ? undefined : fresh.callRoomId };
    if (lines.length === 0) {
      await saveGroupMeta(rest);
      return jsonWithCors(request, { logged: false });
    }
    await logGroupCall(
      rest,
      me,
      meta.id,
      lines
        .sort((a, b) => a.startedAt - b.startedAt || a.seq - b.seq)
        .slice(-120)
        .map((line) => ({ from: line.accountId ?? null, nickname: line.nickname, text: line.text })),
    );
    return jsonWithCors(request, { logged: true });
  }

  if (action === "send") {
    const text = cleanText(body.text, DM_MAX_CHARS);
    // 사진: 이 단체방에 올린 내 사진만, 한 번(server/mediaStore.ts).
    const image = isMediaId(body.imageId) ? await claimMedia(body.imageId, me, { kind: "group", groupId: group.id }) : null;
    if (isMediaId(body.imageId) && !image) return bad(request, "BAD_IMAGE");
    if (!text && !image) return bad(request, "NO_TEXT");
    const result = await sendToGroup({
      from: me,
      id: group.id,
      text,
      ...(image ? { image } : {}),
      ...(typeof body.quoteSeq === "number" ? { quoteSeq: body.quoteSeq, ask: body.ask === true } : {}),
    });
    if (!result.ok) return bad(request, result.error, result.error === "NO_QUOTE" ? 404 : 403);
    await markGroupRead(me, group.id, result.message.seq);
    return jsonWithCors(request, { group: result.group, message: result.message });
  }

  if (action === "team") {
    const result = await makeTeam(me, group.id);
    return typeof result === "object" ? jsonWithCors(request, { group: result }) : bad(request, result, result === "NOT_OWNER" ? 403 : 409);
  }

  if (action === "space" || action === "goal" || action === "schedule" || action === "share" || action === "unshare") {
    if (!group.team) return bad(request, "NOT_TEAM", 409);
    if (action === "goal" || action === "schedule") {
      const patch =
        action === "goal"
          ? { goal: cleanText(body.goal, TEAM_GOAL_MAX_CHARS) }
          : { schedule: body.schedule === null ? null : cleanSchedule(body.schedule) };
      if (action === "schedule" && body.schedule !== null && !patch.schedule) return bad(request, "BAD_SCHEDULE");
      const next = await updateTeam(me, group.id, patch);
      return next ? jsonWithCors(request, { group: next }) : bad(request, "NOT_MEMBER", 403);
    }
    if (action === "share") {
      const text = cleanText(body.text, SPACE_TEXT_MAX_CHARS);
      if (!text) return bad(request, "NO_TEXT");
      const note = cleanText(body.note, SPACE_NOTE_MAX_CHARS);
      const item = await addSpaceItem(group, { kind: "share", by: me, text, ...(note ? { note } : {}) });
      return jsonWithCors(request, { item });
    }
    if (action === "unshare") {
      const ok = typeof body.itemId === "string" && (await removeSpaceItem(group, me, body.itemId));
      return ok ? jsonWithCors(request, { ok: true }) : bad(request, "NOT_YOURS", 403);
    }
    return jsonWithCors(request, { group, space: await readSpace(group.id) });
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
