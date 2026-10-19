import { NextRequest } from "next/server";
import { pollFrom } from "@/lib/server/lateRows";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { requestAuth } from "@/lib/server/premiumRequest";
import { readAccount } from "@/lib/server/accountStore";
import { blockedEitherWay, isAccountId } from "@/lib/server/socialStore";
import { claimCallLog, decline, findQuote, inbox, markRead, readMessages, readThread, send } from "@/lib/server/dmStore";
import { createRoom, isInviteCode, liveCount, readLines, readMeta } from "@/lib/server/roomStore";
import { clipQuote } from "@/lib/rooms/quote";
import { DM_MAX_CHARS, isThreadId, otherOf, threadIdFor } from "@/lib/rooms/dm";
import { cleanText, isPeerId, isRoomId } from "@/lib/rooms/protocol";
import { isMediaId } from "@/lib/rooms/media";
import { claimMedia } from "@/lib/server/mediaStore";

export const dynamic = "force-dynamic";

/**
 * 1:1 메시지(시험 기능, rooms/dm.ts). 로그인한 사람만, 말하는 방과 같은 입장 코드.
 *
 *   inbox                     → { threads: DmSummary[] }
 *   open { target }           → { thread | null, messages }   (읽음 표시)
 *   poll { threadId, since }  → { thread, messages }           (읽음 표시)
 *   send { target, text }     → { thread, message }
 *   decline { threadId }      → 받은 요청 거절
 *   call { threadId, peerId } → 둘만의 통화 방을 열고 대화에 "통화" 줄 → { room }
 *   endCall { roomId }        → 둘 다 나갔으면 그 통화의 자막을 대화에 기록으로 한 번 남김
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
  if (!isInviteCode(body.code)) return bad(request, "BAD_CODE", 403);
  const auth = requestAuth(request);
  if (!auth) return bad(request, "SIGNED_OUT", 401);
  const me = auth.accountId;
  const action = body.action;

  if (action === "inbox") return jsonWithCors(request, { threads: await inbox(me) });

  if (action === "open" || action === "send") {
    if (!isAccountId(body.target) || body.target === me) return bad(request, "BAD_TARGET");
    const target = body.target;
    if (!(await readAccount(target))) return bad(request, "NO_ACCOUNT", 404);
    const blocked = await blockedEitherWay(me, target);
    const id = threadIdFor(me, target);
    if (action === "open") {
      const thread = await readThread(id);
      const messages = thread ? await readMessages(id) : [];
      if (thread?.lastSeq) await markRead(me, id, thread.lastSeq);
      return jsonWithCors(request, { thread, messages, blocked });
    }
    if (blocked) return bad(request, "BLOCKED", 403);
    const text = cleanText(body.text, DM_MAX_CHARS);
    // 사진: 이 대화에 올린 내 사진만, 한 번(server/mediaStore.ts).
    const image = isMediaId(body.imageId) ? await claimMedia(body.imageId, me, { kind: "dm", threadId: id }) : null;
    if (isMediaId(body.imageId) && !image) return bad(request, "BAD_IMAGE");
    if (!text && !image) return bad(request, "NO_TEXT");
    let quote = undefined;
    const roomQuote = body.roomQuote as { roomId?: unknown; seq?: unknown } | undefined;
    if (roomQuote && isRoomId(roomQuote.roomId) && typeof roomQuote.seq === "number") {
      // 쪽지: 말하는 방의 줄을 집어 둘만 묻기. 인용 글은 방 기록에서.
      const found = (await readLines(roomQuote.roomId)).find((row) => row.seq === roomQuote.seq);
      if (!found) return bad(request, "NO_QUOTE", 404);
      quote = {
        seq: found.seq,
        nickname: found.nickname,
        text: clipQuote(found.text),
        peerId: found.peerId,
        accountId: found.accountId ?? null,
        roomId: roomQuote.roomId,
      };
    } else if (typeof body.quoteSeq === "number") {
      quote = await findQuote(id, body.quoteSeq, typeof body.quoteIndex === "number" ? body.quoteIndex : undefined);
      if (!quote) return bad(request, "NO_QUOTE", 404);
    }
    const result = await send({ from: me, to: target, kind: "text", text, ...(quote ? { quote, ask: body.ask === true } : {}), ...(image ? { image } : {}) });
    if (!result.ok) return bad(request, result.error, 409);
    return jsonWithCors(request, { thread: result.thread, message: result.message });
  }

  if (action === "endCall") {
    if (!isRoomId(body.roomId)) return bad(request, "BAD_ROOM");
    const meta = await readMeta(body.roomId);
    if (!meta?.private || !meta.threadId || !(meta.allowed ?? []).includes(me)) return bad(request, "BAD_ROOM");
    // 한쪽이 아직 통화 중이면 그 사람이 나갈 때 남긴다.
    if ((await liveCount(meta.id)) > 0) return jsonWithCors(request, { logged: false });
    const lines = await readLines(meta.id);
    if (lines.length === 0 || !(await claimCallLog(meta.id))) return jsonWithCors(request, { logged: false });
    const thread = await readThread(meta.threadId);
    if (!thread) return jsonWithCors(request, { logged: false });
    const result = await send({
      from: me,
      to: otherOf(thread, me),
      kind: "callLog",
      text: `${lines.length}`,
      roomId: meta.id,
      lines: lines
        .sort((a, b) => a.startedAt - b.startedAt || a.seq - b.seq)
        .slice(-120)
        .map((line) => ({ from: line.accountId ?? null, nickname: line.nickname, text: line.text })),
    });
    return jsonWithCors(request, { logged: result.ok });
  }

  if (!isThreadId(body.threadId)) return bad(request, "BAD_THREAD");
  const thread = await readThread(body.threadId);
  if (!thread || !thread.members.includes(me)) return bad(request, "NO_THREAD", 404);
  const other = otherOf(thread, me);

  if (action === "poll") {
    const since = typeof body.since === "number" && Number.isFinite(body.since) ? body.since : 0;
    const messages = await readMessages(thread.id, pollFrom(since));
    if (thread.lastSeq) await markRead(me, thread.id, thread.lastSeq);
    return jsonWithCors(request, { thread, messages });
  }

  if (action === "decline") {
    return (await decline(me, thread.id)) ? jsonWithCors(request, { ok: true }) : bad(request, "CANNOT_DECLINE", 409);
  }

  if (action === "call") {
    if (!isPeerId(body.peerId)) return bad(request, "BAD_PEER");
    if (thread.status !== "open") return bad(request, "NOT_OPEN", 409);
    if (await blockedEitherWay(me, other)) return bad(request, "BLOCKED", 403);
    const account = await readAccount(me);
    const nickname = cleanText(account?.profile.nickname || account?.username || "", 20);
    const room = await createRoom({
      name: "📞",
      languages: [],
      hostPeerId: body.peerId,
      hostAccountId: me,
      hostNickname: nickname,
      private: true,
      allowed: [...thread.members],
      threadId: thread.id,
    });
    const result = await send({ from: me, to: other, kind: "call", text: "", roomId: room.id });
    if (!result.ok) return bad(request, result.error, 409);
    return jsonWithCors(request, { room, message: result.message });
  }

  return bad(request, "UNKNOWN_ACTION");
}
