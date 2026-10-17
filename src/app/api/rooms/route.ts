import { NextRequest } from "next/server";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import {
  addLine,
  createRoom,
  grantRole,
  isInviteCode,
  isMember,
  joinRoom,
  leaveRoom,
  listRooms,
  poll,
  readMeta,
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

export const dynamic = "force-dynamic";

/**
 * 사용자끼리 말하는 방(시험 기능). 음성은 여기를 지나지 않는다 — 사람끼리
 * 직접 오가고, 여기는 방 목록·사람·연결 신호·자막 줄만 다룬다
 * (lib/server/roomStore.ts).
 *
 * 모든 요청에 입장 코드가 붙어야 한다. 앱 안의 숨은 입구로만 들어오는
 * 시험이라, 코드를 모르는 요청은 방이 있다는 것도 모르게 한다.
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
  if (action === "unlock") return jsonWithCors(request, { ok: true });
  if (action === "list") return jsonWithCors(request, { rooms: await listRooms() });

  if (!isPeerId(body.peerId)) return bad(request, "BAD_PEER");
  const peerId = body.peerId;

  if (action === "create") {
    const name = cleanText(body.name, MAX_ROOM_NAME_CHARS);
    if (!name) return bad(request, "NO_NAME");
    const languages = Array.isArray(body.languages)
      ? body.languages.filter((code): code is string => typeof code === "string" && isLearningLanguageCode(code))
      : [];
    const meta = await createRoom({ name, languages, hostPeerId: peerId });
    return jsonWithCors(request, { room: meta });
  }

  if (!isRoomId(body.roomId)) return bad(request, "BAD_ROOM");
  const roomId = body.roomId;

  if (action === "join") {
    const nickname = cleanText(body.nickname, MAX_NICKNAME_CHARS);
    if (!nickname) return bad(request, "NO_NICKNAME");
    const result = await joinRoom({
      id: roomId,
      peerId,
      nickname,
      wantRole: body.role === "listener" ? "listener" : "speaker",
    });
    if (!result.ok) return bad(request, result.error, result.error === "NO_ROOM" ? 404 : 409);
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
    });
    if (!result) return bad(request, "NOT_IN_ROOM", 404);
    return jsonWithCors(request, result);
  }

  if (action === "leave") {
    await leaveRoom(roomId, peerId);
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
    if (!isPeerId(body.target) || (body.role !== "speaker" && body.role !== "listener")) return bad(request, "BAD_GRANT");
    const result = await grantRole({ id: roomId, hostPeerId: peerId, target: body.target, role: body.role });
    return result === "ok" ? jsonWithCors(request, { ok: true }) : bad(request, result, result === "NOT_HOST" ? 403 : 409);
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
    const line = await addLine(roomId, {
      kind,
      peerId,
      nickname: me.nickname,
      text,
      startedAt,
      endedAt,
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
