import { NextRequest } from "next/server";
import { clipQuote, type LineQuote } from "@/lib/rooms/quote";
import { cleanLanguages } from "@/lib/rooms/roomFilter";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import {
  addLine,
  createRoom,
  grantRole,
  isInviteCode,
  isMember,
  joinRoom,
  leaveRoom,
  closeRoom,
  listParked,
  pauseRoom,
  reopenRoom,
  transferHost,
  listRooms,
  poll,
  readMeta,
  readLines,
  sendSignal,
} from "@/lib/server/roomStore";
import {
  MAX_LINE_CHARS,
  MAX_NICKNAME_CHARS,
  MAX_ROOM_NAME_CHARS,
  MAX_SIGNAL_CHARS,
  cleanText,
  isPeerId,
  isRoomId,
  isSignalKind,
} from "@/lib/rooms/protocol";
import { isLearningLanguageCode } from "@/lib/learningLanguages";
import { requestAuth } from "@/lib/server/premiumRequest";
import { readAccount } from "@/lib/server/accountStore";
import { blockedEitherWay, noteHelped, noteHosted, readBlocked, readFollowing } from "@/lib/server/socialStore";

export const dynamic = "force-dynamic";

/**
 * 사용자끼리 말하는 방(시험 기능). 음성은 여기를 지나지 않는다 — 사람끼리
 * 직접 오가고, 여기는 방 목록·사람·연결 신호·자막 줄만 다룬다
 * (lib/server/roomStore.ts).
 *
 * 모든 요청에 입장 코드가 붙어야 한다. 앱 안의 숨은 입구로만 들어오는
 * 시험이라, 코드를 모르는 요청은 방이 있다는 것도 모르게 한다.
 *
 * 방을 만들거나 들어가려면 로그인해야 한다(2026-10-18). 이름·사진은 프로필에서
 * 오고, 팔로우·차단·내보내기가 계정을 기준으로 걸린다(api/social).
 */
export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request);
}

const bad = (request: NextRequest, error: string, status = 400) =>
  jsonWithCors(request, { error }, { status });

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return bad(request, "Invalid JSON");
  }
  if (!isInviteCode(body.code)) return bad(request, "BAD_CODE", 403);

  const action = body.action;
  const auth = requestAuth(request);
  if (action === "unlock") return jsonWithCors(request, { ok: true });
  if (action === "list") {
    const rooms = await listRooms(auth?.accountId ?? null, cleanLanguages(body.langs));
    if (!auth) return jsonWithCors(request, { rooms });
    // 팔로우한 방장의 방은 위로, 서로 차단한 방장의 방은 안 보이게.
    const [following, blocked] = await Promise.all([readFollowing(auth.accountId), readBlocked(auth.accountId)]);
    const shown = rooms
      .filter((room) => !room.hostAccountId || !blocked.includes(room.hostAccountId))
      .map((room) => ({ ...room, followed: Boolean(room.hostAccountId && following.includes(room.hostAccountId)) }));
    shown.sort((a, b) => Number(Boolean(b.mine)) - Number(Boolean(a.mine)) || Number(b.followed) - Number(a.followed));
    return jsonWithCors(request, { rooms: shown });
  }

  // 내가 잠시 닫아 둔 방(로비 "내 방 · 다시 열기").
  if (action === "parked") {
    if (!auth) return bad(request, "SIGNED_OUT", 401);
    return jsonWithCors(request, { rooms: (await listParked(auth.accountId)).map((row) => ({ id: row.id, name: row.name, languages: row.languages, parkedAt: row.parkedAt })) });
  }

  if (!isPeerId(body.peerId)) return bad(request, "BAD_PEER");
  const peerId = body.peerId;

  // 만들기·들어가기는 로그인한 사람만. 이름은 프로필 닉네임(없으면 아이디).
  const needsAccount = action === "create" || action === "join" || action === "reopen";
  const account = auth && needsAccount ? await readAccount(auth.accountId) : null;
  if (needsAccount && !account) return bad(request, "SIGNED_OUT", 401);
  const profileName = account
    ? cleanText(account.profile.nickname || account.username || "", MAX_NICKNAME_CHARS)
    : "";

  if (action === "create") {
    const name = cleanText(body.name, MAX_ROOM_NAME_CHARS);
    if (!name) return bad(request, "NO_NAME");
    const languages = Array.isArray(body.languages)
      ? body.languages.filter((code): code is string => typeof code === "string" && isLearningLanguageCode(code))
      : [];
    const meta = await createRoom({
      name,
      languages,
      free: body.free === true,
      hostPeerId: peerId,
      hostAccountId: account?.id ?? null,
      hostNickname: profileName,
    });
    if (account) await noteHosted(account.id);
    return jsonWithCors(request, { room: meta });
  }

  if (!isRoomId(body.roomId)) return bad(request, "BAD_ROOM");
  const roomId = body.roomId;

  if (action === "reopen") {
    const meta = await reopenRoom({ accountId: account!.id, id: roomId, hostPeerId: peerId, hostNickname: profileName });
    return meta ? jsonWithCors(request, { room: meta }) : bad(request, "NO_ROOM", 404);
  }

  // 들어가기 전에 방 모양만(1:1 통화 받기). 비공개 방은 그 두 사람에게만.
  if (action === "peek") {
    const meta = await readMeta(roomId);
    if (!meta || (meta.private && !(auth && (meta.allowed ?? []).includes(auth.accountId)))) return bad(request, "NO_ROOM", 404);
    return jsonWithCors(request, { room: meta });
  }

  if (action === "join") {
    const nickname = profileName || cleanText(body.nickname, MAX_NICKNAME_CHARS);
    if (!nickname) return bad(request, "NO_NICKNAME");
    const meta = await readMeta(roomId);
    if (meta?.hostAccountId && account && (await blockedEitherWay(meta.hostAccountId, account.id))) {
      return bad(request, "BANNED", 403);
    }
    const langs = Array.isArray(body.langs)
      ? body.langs.filter((code): code is string => typeof code === "string" && isLearningLanguageCode(code))
      : [];
    const result = await joinRoom({
      id: roomId,
      peerId,
      nickname,
      wantRole: body.role === "listener" ? "listener" : "speaker",
      accountId: account?.id ?? null,
      langs,
    });
    if (!result.ok) {
      return bad(request, result.error, result.error === "NO_ROOM" ? 404 : result.error === "BANNED" ? 403 : 409);
    }
    return jsonWithCors(request, { member: result.member, room: result.meta, now: Date.now() });
  }

  if (action === "poll") {
    const since = typeof body.since === "number" && Number.isFinite(body.since) ? body.since : 0;
    const result = await poll({
      id: roomId,
      peerId,
      since,
      muted: typeof body.muted === "boolean" ? body.muted : undefined,
      role: body.role === "listener" || body.role === "speaker" ? body.role : undefined,
      hand: typeof body.hand === "boolean" ? body.hand : undefined,
      textOnly: typeof body.textOnly === "boolean" ? body.textOnly : undefined,
    });
    if (result === "KICKED") return bad(request, "KICKED", 403);
    if (!result) return bad(request, "NOT_IN_ROOM", 404);
    return jsonWithCors(request, result);
  }

  if (action === "leave") {
    await leaveRoom(roomId, peerId);
    // 방장이 나가면 방을 닫는다(1:1 통화 방은 둘 다 나간 뒤 기록을 남겨야 해서 그대로).
    const meta = await readMeta(roomId);
    if (meta && !meta.private && meta.hostPeerId === peerId) {
      await closeRoom(roomId);
      return jsonWithCors(request, { ok: true, closed: true });
    }
    return jsonWithCors(request, { ok: true });
  }

  const me = await isMember(roomId, peerId);
  if (!me) return bad(request, "NOT_IN_ROOM", 404);

  if (action === "signal") {
    if (!isPeerId(body.to) || !isSignalKind(body.kind)) return bad(request, "BAD_SIGNAL");
    const data = typeof body.data === "string" ? body.data : "";
    if (data.length > MAX_SIGNAL_CHARS) return bad(request, "BAD_SIGNAL", 413);
    await sendSignal(roomId, { from: peerId, to: body.to, kind: body.kind, data, at: Date.now() });
    return jsonWithCors(request, { ok: true });
  }

  if (action === "grant") {
    const role = body.role;
    if (!isPeerId(body.target) || (role !== "speaker" && role !== "listener" && role !== "out")) return bad(request, "BAD_GRANT");
    const result = await grantRole({ id: roomId, hostPeerId: peerId, target: body.target, role });
    if (result !== "ok") return bad(request, result, result === "NOT_HOST" ? 403 : 409);
    // 손든 사람을 올려 준 횟수 — 방장(튜터)이 도운 만큼의 첫 지표.
    if (role === "speaker" && me.accountId) await noteHelped(me.accountId);
    return jsonWithCors(request, { ok: true });
  }

  if (action === "transfer") {
    if (!isPeerId(body.target)) return bad(request, "BAD_TARGET");
    const result = await transferHost({ id: roomId, hostPeerId: peerId, target: body.target });
    return result === "ok" ? jsonWithCors(request, { ok: true }) : bad(request, result, result === "NOT_HOST" ? 403 : 409);
  }

  if (action === "pause") {
    const result = await pauseRoom({ id: roomId, hostPeerId: peerId });
    return result === "ok" ? jsonWithCors(request, { ok: true }) : bad(request, result, 403);
  }

  if (action === "line") {
    // 받아쓴 말은 말하기 자리에서만, 손으로 쓴 댓글은 누구나(듣는 사람도).
    const kind = body.kind === "text" ? "text" : "speech";
    if (kind === "speech" && me.role !== "speaker") return bad(request, "NOT_SPEAKER", 403);
    const text = cleanText(body.text, MAX_LINE_CHARS);
    if (!text) return bad(request, "NO_TEXT");
    const now = Date.now();
    const startedAt = clampTime(body.startedAt, now);
    const endedAt = Math.max(startedAt, clampTime(body.endedAt, now));
    // 남의 줄을 집은 댓글(묻기·답하기): 앱은 번호만, 인용 글은 서버가 방 기록에서 채운다.
    let quote: LineQuote | undefined;
    if (kind === "text" && typeof body.quoteSeq === "number") {
      const found = (await readLines(roomId)).find((row) => row.seq === body.quoteSeq);
      if (!found) return bad(request, "NO_QUOTE", 404);
      quote = { seq: found.seq, nickname: found.nickname, text: clipQuote(found.text), peerId: found.peerId, accountId: found.accountId ?? null };
    }
    const line = await addLine(roomId, {
      kind,
      peerId,
      accountId: me.accountId ?? null,
      nickname: me.nickname,
      text,
      startedAt,
      endedAt,
      ...(quote ? { quote, ask: body.ask === true } : {}),
      // 받아쓴 말의 언어(앱이 글자로 가른 것). 모르는 코드는 버린다.
      ...(kind === "speech" && typeof body.lang === "string" && isLearningLanguageCode(body.lang) ? { lang: body.lang } : {}),
    });
    return jsonWithCors(request, { line });
  }

  if (action === "meta") {
    const meta = await readMeta(roomId);
    return meta ? jsonWithCors(request, { room: meta }) : bad(request, "NO_ROOM", 404);
  }

  return bad(request, "UNKNOWN_ACTION");
}

/** 앱이 보낸 시각은 서버 시계로 맞춘 값이지만, 터무니없으면 지금으로. */
function clampTime(value: unknown, now: number): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return now;
  if (value > now + 5_000 || value < now - 5 * 60_000) return now;
  return Math.round(value);
}
