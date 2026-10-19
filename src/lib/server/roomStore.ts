/**
 * 사용자끼리 말하는 방(시험 기능)의 서버 쪽 기억. 모두 짧게 산다.
 *
 * 키는 한 사람이 한 키만 쓰도록 나눴다. 사람 정보(room:m)는 그 사람의
 * 앱만 쓰고, 신호함(room:sig)과 자막(room:lines)은 RPUSH라서, 여러 사람이
 * 동시에 써도 서로 덮어쓰지 않는다(kv.ts kvListPush 설명).
 *
 * 자막 줄은 방이 살아 있는 동안만 서버에 있다(최대 6시간). 학습자 문장을
 * 서버에 남기지 않는다는 원칙의 예외라서, 시험 기능을 넘어서기 전에 동의와
 * 보관 방식을 정해야 한다(hub/drafts/voice-room-workspace.md).
 */
import { rowsAfter } from "./lateRows.ts";
import { roomMatches } from "../rooms/roomFilter.ts";
import {
  MAX_LINES_KEPT,
  MAX_MEMBERS,
  MAX_SPEAKERS,
  ROOM_TTL_SECONDS,
  canSeatFreely,
  liveMembers,
  newRoomId,
  type PollResponse,
  type RoomLine,
  type RoomMember,
  type RoomMeta,
  type RoomRole,
  type RoomFace,
  type RoomSignal,
  type RoomSummary,
} from "../rooms/protocol.ts";
import {
  kvGetJson,
  kvIncrBy,
  kvListPush,
  kvListRange,
  kvListTake,
  kvListTrim,
  kvDelete,
  kvSetJson,
} from "./kv.ts";

const MEMBER_TTL_SECONDS = 30;
const SIGNAL_TTL_SECONDS = 120;
const INDEX_KEY = "room:index";
const INDEX_KEEP = 60;

const metaKey = (id: string) => `room:meta:${id}`;
const peersKey = (id: string) => `room:peers:${id}`;
const memberKey = (id: string, peer: string) => `room:m:${id}:${peer}`;
const signalKey = (id: string, peer: string) => `room:sig:${id}:${peer}`;
const linesKey = (id: string) => `room:lines:${id}`;
const seqKey = (id: string) => `room:seq:${id}`;
/** 방장이 누군가를 올리거나 내린 결정. 그 사람의 다음 물음이 가져간다. */
const grantKey = (id: string, peer: string) => `room:grant:${id}:${peer}`;
const GRANT_TTL_SECONDS = 60;
/** 방장이 내보낸 계정. 그 방에는 다시 못 들어온다. */
const banKey = (id: string) => `room:ban:${id}`;

/** 방장의 결정: 올리기, 내리기, 내보내기. */
export type Grant = RoomRole | "out";

/**
 * 시험 입장 코드. Vercel 환경 변수 ROOM_INVITE_CODES(쉼표로 여러 개)가 있으면
 * 그것, 없으면 기본 코드 하나. 시험 기능을 아는 사람만 들어오게 하는 문일 뿐
 * 보안 장치는 아니다.
 */
export function inviteCodes(): string[] {
  const raw = process.env.ROOM_INVITE_CODES?.trim();
  const codes = (raw ? raw.split(",") : ["LB2026"]).map((code) => code.trim().toUpperCase()).filter(Boolean);
  return codes;
}

/**
 * 2.68부터 방은 탭으로 모두에게 열려 코드 없이 온다. Vercel에 ROOM_INVITE_CODES를
 * 넣으면 다시 코드를 아는 사람만(시험으로 되돌릴 때). 코드를 보내는 2.67 이하
 * 시험판의 기본 코드도 그대로 통한다.
 */
export function isInviteCode(value: unknown): boolean {
  const required = Boolean(process.env.ROOM_INVITE_CODES?.trim());
  if (!required && (value === undefined || value === null || value === "")) return true;
  return typeof value === "string" && inviteCodes().includes(value.trim().toUpperCase());
}

export async function readMeta(id: string): Promise<RoomMeta | null> {
  return kvGetJson<RoomMeta>(metaKey(id));
}

async function readMembers(id: string): Promise<RoomMember[]> {
  const peers = [...new Set(await kvListRange(peersKey(id)))];
  const rows = await Promise.all(peers.map((peer) => kvGetJson<RoomMember>(memberKey(id, peer))));
  return liveMembers(
    rows.filter((row): row is RoomMember => row !== null),
    Date.now(),
  );
}

export async function createRoom(input: {
  name: string;
  languages: string[];
  hostPeerId: string;
  hostAccountId?: string | null;
  hostNickname?: string;
  private?: boolean;
  allowed?: string[];
  threadId?: string;
  groupId?: string;
  /** 잠시 닫은 방을 다시 열 때: 같은 방 번호. */
  id?: string;
  /** 🌐 자유 대화(방 언어 없음). */
  free?: boolean;
}): Promise<RoomMeta> {
  let id = input.id ?? newRoomId();
  // 겹칠 일은 거의 없지만, 살아 있는 방을 덮어쓰지는 않게.
  for (let tries = 0; !input.id && tries < 3 && (await readMeta(id)); tries += 1) id = newRoomId();
  const meta: RoomMeta = {
    id,
    name: input.name,
    languages: input.free ? [] : input.languages.slice(0, 2),
    ...(input.free ? { free: true } : {}),
    hostPeerId: input.hostPeerId,
    hostAccountId: input.hostAccountId ?? null,
    hostNickname: input.hostNickname ?? "",
    ...(input.private
      ? { private: true, allowed: input.allowed ?? [], ...(input.threadId ? { threadId: input.threadId } : {}), ...(input.groupId ? { groupId: input.groupId } : {}) }
      : {}),
    createdAt: Date.now(),
  };
  await kvSetJson(metaKey(id), meta, ROOM_TTL_SECONDS);
  if (!meta.private) {
    await kvListPush(INDEX_KEY, [id], ROOM_TTL_SECONDS);
    await kvListTrim(INDEX_KEY, INDEX_KEEP);
  }
  return meta;
}

/**
 * 열린 방 목록. 아무도 없는 방(만든 지 1분 지난)은 뺀다 — 방장의 것이어도(2026-10-18,
 * 나가도 방이 남는다는 의견). 방장이 나가면 방은 닫힌다(`closeRoom`). 내 방은 `mine`으로 표시. 새 방이 위.
 */
export async function listRooms(viewerAccountId?: string | null, languages: string[] = []): Promise<RoomSummary[]> {
  // 언어로 거를 때는 색인 전체(최대 INDEX_KEEP)에서 찾고, 보여 주는 건 30개까지.
  const all = [...new Set(await kvListRange(INDEX_KEY))].reverse();
  const ids = languages.length ? all : all.slice(0, 30);
  const rows = await Promise.all(
    ids.map(async (id) => {
      const meta = await readMeta(id);
      if (!meta) return null;
      if (!roomMatches(meta.languages, languages, meta.free === true)) return null;
      const members = await readMembers(id);
      const mine = Boolean(viewerAccountId && meta.hostAccountId === viewerAccountId);
      if (members.length === 0 && Date.now() - meta.createdAt > 60_000) return null;
      const ordered = [...members].sort(
        (a, b) => Number(b.peerId === meta.hostPeerId) - Number(a.peerId === meta.hostPeerId) || a.joinedAt - b.joinedAt,
      );
      const faces: RoomFace[] = ordered.slice(0, 5).map((member) => ({
        accountId: member.accountId ?? null,
        nickname: member.nickname,
      }));
      const row: RoomSummary = {
        ...meta,
        speakers: members.filter((member) => member.role === "speaker").length,
        listeners: members.filter((member) => member.role === "listener").length,
        faces,
      };
      if (mine) row.mine = true;
      return row;
    }),
  );
  return rows.filter((row): row is RoomSummary => row !== null).slice(0, 30);
}

export type JoinResult =
  | { ok: true; member: RoomMember; meta: RoomMeta }
  | { ok: false; error: "NO_ROOM" | "ROOM_FULL" | "BANNED" };

/**
 * 들어가기. 방장(또는 방장이 없는 방)은 바로 말하기 자리에, 다른 사람은 듣는
 * 사람으로 들어가 손을 든다 — 방장이 올려 줘야 말한다(헬로우톡의 손들기).
 * 자리가 차 있어도 듣는 사람으로는 들어간다.
 */
export async function joinRoom(input: {
  id: string;
  peerId: string;
  nickname: string;
  wantRole: RoomRole;
  accountId?: string | null;
  langs?: string[];
}): Promise<JoinResult> {
  const meta = await readMeta(input.id);
  if (!meta) return { ok: false, error: "NO_ROOM" };
  if (meta.private && (!input.accountId || !(meta.allowed ?? []).includes(input.accountId))) {
    return { ok: false, error: "BANNED" };
  }
  if (input.accountId) {
    const banned = (await kvGetJson<string[]>(banKey(input.id))) ?? [];
    if (banned.includes(input.accountId)) return { ok: false, error: "BANNED" };
    // 방장이 앱을 다시 열고 왔다: 새 이름표를 방장으로.
    if (meta.hostAccountId && meta.hostAccountId === input.accountId) meta.hostPeerId = input.peerId;
  }
  const members = (await readMembers(input.id)).filter((member) => member.peerId !== input.peerId);
  if (members.length >= MAX_MEMBERS) return { ok: false, error: "ROOM_FULL" };
  const speakers = members.filter((member) => member.role === "speaker").length;
  const free = meta.private || canSeatFreely(input.peerId, meta.hostPeerId, members);
  const seated = input.wantRole === "speaker" && free && speakers < MAX_SPEAKERS;
  const role: RoomRole = seated ? "speaker" : "listener";
  const now = Date.now();
  const member: RoomMember = {
    peerId: input.peerId,
    nickname: input.nickname,
    role,
    muted: false,
    hand: input.wantRole === "speaker" && !seated,
    accountId: input.accountId ?? null,
    langs: (input.langs ?? []).slice(0, 2),
    joinedAt: now,
    lastSeen: now,
  };
  await kvSetJson(memberKey(input.id, input.peerId), member, MEMBER_TTL_SECONDS);
  await kvListPush(peersKey(input.id), [input.peerId], ROOM_TTL_SECONDS);
  await kvListTrim(peersKey(input.id), MAX_MEMBERS * 4);
  await kvSetJson(metaKey(input.id), meta, ROOM_TTL_SECONDS);
  return { ok: true, member, meta };
}

/** 방장만: 손든 사람을 올리거나, 말하는 사람을 내리거나, 내보낸다. */
export async function grantRole(input: {
  id: string;
  hostPeerId: string;
  target: string;
  role: Grant;
}): Promise<"ok" | "NOT_HOST" | "NO_TARGET" | "SEATS_FULL"> {
  const meta = await readMeta(input.id);
  if (!meta || meta.hostPeerId !== input.hostPeerId) return "NOT_HOST";
  const members = await readMembers(input.id);
  const target = members.find((member) => member.peerId === input.target);
  if (!target || target.peerId === meta.hostPeerId) return "NO_TARGET";
  if (input.role === "out" && target.accountId) {
    // 방장만 쓰는 목록이라 읽고-고치고-쓰기가 엉키지 않는다.
    const banned = (await kvGetJson<string[]>(banKey(input.id))) ?? [];
    if (!banned.includes(target.accountId)) {
      await kvSetJson(banKey(input.id), [...banned, target.accountId].slice(-200), ROOM_TTL_SECONDS);
    }
  }
  if (input.role === "speaker") {
    const speakers = members.filter((member) => member.role === "speaker").length;
    if (speakers >= MAX_SPEAKERS) return "SEATS_FULL";
  }
  await kvSetJson(grantKey(input.id, input.target), input.role, GRANT_TTL_SECONDS);
  return "ok";
}

/**
 * 앱이 약 1.5초마다 부르는 한 번의 물음: 나 아직 있음 + 내 앞으로 온 신호 +
 * 새 자막 줄 + 지금 있는 사람들.
 */
export async function poll(input: {
  id: string;
  peerId: string;
  since: number;
  muted?: boolean;
  role?: RoomRole;
  hand?: boolean;
  textOnly?: boolean;
}): Promise<PollResponse | null | "KICKED"> {
  const meta = await readMeta(input.id);
  if (!meta) return null;
  const mine = await kvGetJson<RoomMember>(memberKey(input.id, input.peerId));
  if (!mine) return null;
  const now = Date.now();
  let role = mine.role;
  const live = await readMembers(input.id);
  const others = live.filter((member) => member.peerId !== input.peerId);
  const seatsLeft = others.filter((member) => member.role === "speaker").length < MAX_SPEAKERS;
  const granted = await kvGetJson<Grant>(grantKey(input.id, input.peerId));
  if (granted) {
    // 방장의 결정이 앱이 바라는 것보다 먼저. 한 번 쓰고 지운다.
    await kvDelete([grantKey(input.id, input.peerId)]);
    if (granted === "out") {
      await kvSetJson(memberKey(input.id, input.peerId), { ...mine, lastSeen: 0 }, 5);
      return "KICKED";
    }
    if (granted === "listener") role = "listener";
    else if (seatsLeft) role = "speaker";
  } else if (input.role === "listener" && input.peerId !== meta.hostPeerId) {
    // 방장은 말하기 자리에서 내려가지 않는다(조용히 하려면 마이크 끄기).
    role = "listener";
  } else if (input.role === "speaker" && mine.role !== "speaker") {
    // 손들기 없이 앉기는 방장이거나 방장이 없을 때만.
    if (seatsLeft && (meta.private || canSeatFreely(input.peerId, meta.hostPeerId, others))) role = "speaker";
  }
  const updated: RoomMember = {
    ...mine,
    role,
    muted: typeof input.muted === "boolean" ? input.muted : mine.muted,
    hand: role === "speaker" ? false : typeof input.hand === "boolean" ? input.hand : mine.hand,
    ...(typeof input.textOnly === "boolean" ? { textOnly: input.textOnly && role !== "speaker" } : {}),
    lastSeen: now,
  };
  await kvSetJson(memberKey(input.id, input.peerId), updated, MEMBER_TTL_SECONDS);

  const members = [...others, updated].sort((a, b) => a.joinedAt - b.joinedAt);
  const [rawSignals, rawLines] = await Promise.all([
    kvListTake(signalKey(input.id, input.peerId)),
    kvListRange(linesKey(input.id), -MAX_LINES_KEPT, -1),
  ]);
  const signals = parseRows<RoomSignal>(rawSignals);
  const lines = rowsAfter(parseRows<RoomLine>(rawLines), input.since);
  return { now, room: meta, members, signals, lines };
}

export async function sendSignal(id: string, signal: RoomSignal): Promise<void> {
  await kvListPush(signalKey(id, signal.to), [JSON.stringify(signal)], SIGNAL_TTL_SECONDS);
}

export async function addLine(
  id: string,
  line: Omit<RoomLine, "seq">,
): Promise<RoomLine> {
  const seq = await kvIncrBy(seqKey(id), 1, ROOM_TTL_SECONDS);
  const row: RoomLine = { ...line, seq };
  await kvListPush(linesKey(id), [JSON.stringify(row)], ROOM_TTL_SECONDS);
  await kvListTrim(linesKey(id), MAX_LINES_KEPT);
  return row;
}

/** 나가기: 사람 정보를 바로 지워 다른 사람 화면에서 곧 빠지게. */
export async function leaveRoom(id: string, peerId: string): Promise<void> {
  const mine = await kvGetJson<RoomMember>(memberKey(id, peerId));
  if (!mine) return;
  // 지우는 대신 이미 지난 lastSeen으로 덮는다(짧은 TTL로 곧 사라짐).
  await kvSetJson(memberKey(id, peerId), { ...mine, lastSeen: 0 }, 5);
}

/**
 * 방 닫기: 방장이 나가면 부른다. 정보를 지우면 남은 사람의 다음 물음이 404 →
 * 앱이 "방이 닫혔어요"를 띄우고, 목록·들어가기에서도 사라진다. 자막 줄은 TTL로 사라진다.
 */
export async function closeRoom(id: string): Promise<void> {
  // 자막 줄도 같이 지운다 — 닫힌 방(잠시 닫은 방 포함)의 학습자 문장을 남기지 않게.
  await kvDelete([metaKey(id), linesKey(id), seqKey(id), banKey(id)]);
}

export async function isMember(id: string, peerId: string): Promise<RoomMember | null> {
  const mine = await kvGetJson<RoomMember>(memberKey(id, peerId));
  return mine && mine.lastSeen > 0 ? mine : null;
}

function parseRows<T>(rows: string[]): T[] {
  const out: T[] = [];
  for (const row of rows) {
    try {
      out.push(JSON.parse(row) as T);
    } catch {
      // 깨진 줄은 건너뛴다.
    }
  }
  return out;
}

/** 방의 자막 줄 전부(통화가 끝난 뒤 1:1 대화에 기록으로 남길 때). */
export async function readLines(id: string): Promise<RoomLine[]> {
  return parseRows<RoomLine>(await kvListRange(linesKey(id), -MAX_LINES_KEPT, -1));
}

/** 방에 지금 있는 사람 수. */
export async function liveCount(id: string): Promise<number> {
  return (await readMembers(id)).length;
}

/**
 * 방장 넘기기: 지금 방장만, 말하기 자리에 있는(계정 있는) 사람에게. 받은 사람의 다음
 * 물음부터 방 정보의 방장이 그 사람이라 앱이 "방장이 됐어요"를 띄운다.
 */
export async function transferHost(input: {
  id: string;
  hostPeerId: string;
  target: string;
}): Promise<"ok" | "NOT_HOST" | "NO_TARGET" | "NOT_SPEAKER"> {
  const meta = await readMeta(input.id);
  if (!meta || meta.private || meta.hostPeerId !== input.hostPeerId) return "NOT_HOST";
  const target = (await readMembers(input.id)).find((member) => member.peerId === input.target);
  if (!target || target.peerId === input.hostPeerId || !target.accountId) return "NO_TARGET";
  if (target.role !== "speaker") return "NOT_SPEAKER";
  await kvSetJson(
    metaKey(input.id),
    { ...meta, hostPeerId: target.peerId, hostAccountId: target.accountId, hostNickname: target.nickname },
    ROOM_TTL_SECONDS,
  );
  return "ok";
}

/**
 * 잠시 닫은 방(방장 계정마다, 30일): 다시 열 때 같은 번호·이름·언어·내보낸 사람 목록.
 * 자막 줄은 남기지 않는다 — 학습자 문장은 방이 열린 동안(최대 6시간)만.
 */
export type ParkedRoom = { id: string; name: string; languages: string[]; free?: boolean; banned: string[]; parkedAt: number };

const PARKED_TTL_SECONDS = 30 * 24 * 60 * 60;
const PARKED_KEEP = 5;
const parkedKey = (accountId: string) => `room:parked:${accountId}`;

export async function listParked(accountId: string): Promise<ParkedRoom[]> {
  const rows = (await kvGetJson<ParkedRoom[]>(parkedKey(accountId))) ?? [];
  return rows.filter((row) => Date.now() - row.parkedAt < PARKED_TTL_SECONDS * 1000);
}

/** 잠시 닫기: 방장만. 방은 닫히고(남은 사람은 "방이 닫혔어요") 설정만 방장 계정에 보관. */
export async function pauseRoom(input: { id: string; hostPeerId: string }): Promise<"ok" | "NOT_HOST"> {
  const meta = await readMeta(input.id);
  if (!meta || meta.private || meta.hostPeerId !== input.hostPeerId || !meta.hostAccountId) return "NOT_HOST";
  const banned = (await kvGetJson<string[]>(banKey(input.id))) ?? [];
  const parked: ParkedRoom = { id: meta.id, name: meta.name, languages: meta.languages, ...(meta.free ? { free: true } : {}), banned, parkedAt: Date.now() };
  const rest = (await listParked(meta.hostAccountId)).filter((row) => row.id !== meta.id);
  await kvSetJson(parkedKey(meta.hostAccountId), [parked, ...rest].slice(0, PARKED_KEEP), PARKED_TTL_SECONDS);
  await closeRoom(meta.id);
  return "ok";
}

/** 다시 열기: 보관한 방을 같은 번호로. 이미 열려 있으면 그 방 그대로. */
export async function reopenRoom(input: {
  accountId: string;
  id: string;
  hostPeerId: string;
  hostNickname: string;
}): Promise<RoomMeta | null> {
  const open = await readMeta(input.id);
  if (open) return open.hostAccountId === input.accountId ? open : null;
  const all = await listParked(input.accountId);
  const parked = all.find((row) => row.id === input.id);
  if (!parked) return null;
  const meta = await createRoom({
    id: parked.id,
    name: parked.name,
    languages: parked.languages,
    free: parked.free === true,
    hostPeerId: input.hostPeerId,
    hostAccountId: input.accountId,
    hostNickname: input.hostNickname,
  });
  if (parked.banned.length) await kvSetJson(banKey(meta.id), parked.banned, ROOM_TTL_SECONDS);
  await kvSetJson(parkedKey(input.accountId), all.filter((row) => row.id !== input.id), PARKED_TTL_SECONDS);
  return meta;
}

/** 비공개 방(단체방 통화)에 나중에 들어온 단체방 사람도 들어올 수 있게. */
export async function allowInRoom(id: string, accountId: string): Promise<RoomMeta | null> {
  const meta = await readMeta(id);
  if (!meta || !meta.private) return null;
  if ((meta.allowed ?? []).includes(accountId)) return meta;
  const next = { ...meta, allowed: [...(meta.allowed ?? []), accountId] };
  await kvSetJson(metaKey(id), next, ROOM_TTL_SECONDS);
  return next;
}
