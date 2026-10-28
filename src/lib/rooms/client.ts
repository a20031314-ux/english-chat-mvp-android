"use client";

import type { LangMatch } from "./langMatch";
import { apiUrl } from "@/lib/apiBase";
import { noteSuspended } from "./suspended";
import { entitlementHeaders } from "@/lib/billing/billingService";
import { readCachedAccount } from "@/lib/account/session";
import type { LineKind, PollResponse, RoomLine, RoomMember, RoomMeta, RoomRole, RoomSummary, SignalKind } from "./protocol";
import type { PersonCard, PublicProfile } from "./social";
import type { LiarMode, LiarTopic, LiarView } from "./liarGame";
import type { MafiaView } from "./mafiaGame";
import type { DmMessage, DmSummary, DmThread } from "./dm";
import type { Group, GroupCall, GroupMessage, GroupSummary, SpaceItem, TeamSchedule, TeamSpace } from "./group";
import type { BoardAuthor, BoardComment, BoardGroupView, BoardPost, BoardTopic } from "./board";
import { normalizeHowToSayExpression, type HowToSayExpression } from "@/lib/howToSay";

/** 방(시험 기능)의 기기 저장값. 모두 이 기기에만 있다. */
const CODE_KEY = "roomsInviteCode";
const NICK_KEY = "roomsNickname";

export function readInviteCode(): string {
  try {
    return localStorage.getItem(CODE_KEY) ?? "";
  } catch {
    return "";
  }
}

export function writeInviteCode(code: string): void {
  try {
    if (code) localStorage.setItem(CODE_KEY, code);
    else localStorage.removeItem(CODE_KEY);
  } catch {
    // ignore
  }
}

export function roomsUnlocked(): boolean {
  return readInviteCode() !== "";
}

export function readNickname(): string {
  try {
    // 방에서 정한 이름이 없으면 프로필 닉네임으로.
    return localStorage.getItem(NICK_KEY) ?? readCachedAccount()?.profile.nickname ?? "";
  } catch {
    return "";
  }
}

export function writeNickname(nickname: string): void {
  try {
    localStorage.setItem(NICK_KEY, nickname);
  } catch {
    // ignore
  }
}

/** 방 안에서 쓰는 이 기기의 이름표. 앱을 열 때마다 새로 — 사용자 id와 무관. */
export function newPeerId(): string {
  const bytes = new Uint8Array(12);
  crypto.getRandomValues(bytes);
  return "p_" + Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export class RoomApiError extends Error {
  constructor(readonly code: string, readonly status: number) {
    super(code);
  }
}

async function call<T>(action: string, payload: Record<string, unknown>, code = readInviteCode()): Promise<T> {
  const response = await fetch(apiUrl("/api/rooms"), {
    method: "POST",
    headers: { "Content-Type": "application/json", ...entitlementHeaders() },
    body: JSON.stringify({ action, code, ...payload }),
  });
  const body = (await response.json().catch(() => ({}))) as { error?: string } & T;
  if (!response.ok) {
    noteSuspended(response.status, body);
    throw new RoomApiError(body.error ?? "FAILED", response.status);
  }
  return body;
}

export async function unlock(code: string): Promise<boolean> {
  try {
    await call("unlock", {}, code.trim());
    return true;
  } catch {
    return false;
  }
}

/** 방 목록. languages를 주면 그 언어가 모두 들어간 방만(순서 상관없음, rooms/roomFilter.ts). */
export async function listRooms(languages: string[] = []): Promise<RoomSummary[]> {
  return (await call<{ rooms: RoomSummary[] }>("list", languages.length ? { langs: languages } : {})).rooms;
}

/** `free`: 🌐 자유 대화(방 언어 없음, 자막은 말하는 사람마다 그 사람의 언어로). */
export async function createRoom(peerId: string, name: string, languages: string[], free = false): Promise<RoomMeta> {
  return (await call<{ room: RoomMeta }>("create", { peerId, name, languages, ...(free ? { free: true } : {}) })).room;
}

export async function joinRoom(input: {
  roomId: string;
  peerId: string;
  nickname: string;
  role: RoomRole;
  /** [배우는 언어, 앱 언어]. */
  langs: string[];
}): Promise<{ member: RoomMember; room: RoomMeta; now: number }> {
  return call("join", input);
}

export async function pollRoom(input: {
  roomId: string;
  peerId: string;
  since: number;
  muted: boolean;
  role: RoomRole;
  hand: boolean;
  /** 💬 채팅만(소리 안 이음). */
  textOnly?: boolean;
}): Promise<PollResponse> {
  return call("poll", input);
}

/** 방 게임(라이어 게임·마피아, api/rooms/game). 답은 이 사람에게 보일 판(끝내면 null). 실패하면 RoomApiError(NOT_ENOUGH·GAME_LIMIT·WORD_FAILED 등). */
export async function roomGame(
  input:
    | { action: "start"; roomId: string; peerId: string; game: "liar" | "mafia"; mode: LiarMode; topic: LiarTopic; laps: 1 | 2; word?: string }
    | { action: "next" | "end"; roomId: string; peerId: string }
    | { action: "vote" | "predict"; roomId: string; peerId: string; target: string }
    | { action: "guess"; roomId: string; peerId: string; text: string },
): Promise<LiarView | MafiaView | null> {
  const response = await fetch(apiUrl("/api/rooms/game"), {
    method: "POST",
    headers: { "Content-Type": "application/json", ...entitlementHeaders() },
    body: JSON.stringify(input),
  });
  const body = (await response.json().catch(() => ({}))) as { error?: string; game?: LiarView | MafiaView | null };
  if (!response.ok) {
    noteSuspended(response.status, body);
    throw new RoomApiError(body.error ?? "FAILED", response.status);
  }
  return body.game ?? null;
}

/** 방장: 말하기 자리 수(2~8). 앉은 사람보다 적게는 못 막는다(SEATS_TAKEN). */
export async function setRoomSeats(roomId: string, peerId: string, seats: number): Promise<number> {
  return (await call<{ seats: number }>("seats", { roomId, peerId, seats })).seats;
}

export async function sendSignal(roomId: string, peerId: string, to: string, kind: SignalKind, data: string) {
  await call("signal", { roomId, peerId, to, kind, data });
}

/** 통화 연결 길. 비공개 통화 방이면 중계(TURN)가 붙어 온다. 못 받으면 null(그러면 메시가 STUN만 쓴다). */
export async function fetchIceServers(roomId: string, peerId: string): Promise<RTCIceServer[] | null> {
  try {
    const found = await call<{ iceServers?: RTCIceServer[] }>("ice", { roomId, peerId });
    return Array.isArray(found.iceServers) && found.iceServers.length ? found.iceServers : null;
  } catch {
    return null;
  }
}

/** 들어가기 전에 방 모양(1:1 통화 받기). 없으면 null. */
export async function peekRoom(roomId: string, peerId: string): Promise<RoomMeta | null> {
  try {
    return (await call<{ room: RoomMeta }>("peek", { roomId, peerId })).room;
  } catch {
    return null;
  }
}

/** 방장만: 손든 사람 올리기 / 말하는 사람 내리기. */
export async function grantRole(roomId: string, peerId: string, target: string, role: RoomRole | "out"): Promise<void> {
  await call("grant", { roomId, peerId, target, role });
}

export async function postLine(input: {
  roomId: string;
  peerId: string;
  kind: LineKind;
  text: string;
  startedAt: number;
  endedAt: number;
  /** 집은 남의 줄 번호(묻기·답하기). 인용 글은 서버가 채운다. */
  quoteSeq?: number;
  ask?: boolean;
  /** 집은 줄 안에서 고른 부분(단어·구절). */
  quoteFocus?: string;
  /** 받아쓴 말의 언어(자유 대화방에서 줄 옆에 표시). */
  lang?: string;
  /** 같은 말(말풍선)의 조각끼리 같은 번호와 순번 — 화면이 한 말풍선으로 잇는다(protocol.ts joinParts). */
  uid?: string;
  part?: number;
  /** 받아쓰기가 확신이 낮았음 — 말풍선 끝에 "?". */
  unsure?: boolean;
  /** 채팅 줄에 붙일 아이콘(🙂). 글이 비어도 된다. */
  icon?: { pack: string; id: string };
}): Promise<RoomLine> {
  return (await call<{ line: RoomLine }>("line", input)).line;
}

/** 방장만: 말하기 자리의 사람에게 방장 넘기기. */
export async function transferHost(roomId: string, peerId: string, target: string): Promise<void> {
  await call("transfer", { roomId, peerId, target });
}

/** 방장만: 잠시 닫기(설정만 방장 계정에 30일, 자막은 지움). */
export async function pauseRoom(roomId: string, peerId: string): Promise<void> {
  await call("pause", { roomId, peerId });
}

export type ParkedRoom = { id: string; name: string; languages: string[]; free?: boolean; parkedAt: number };

export async function listParkedRooms(): Promise<ParkedRoom[]> {
  return (await call<{ rooms: ParkedRoom[] }>("parked", {})).rooms;
}

/** 잠시 닫은 내 방을 같은 번호로 다시 열기. */
export async function reopenRoom(roomId: string, peerId: string): Promise<RoomMeta> {
  return (await call<{ room: RoomMeta }>("reopen", { roomId, peerId })).room;
}

/** soft: 앱을 닫거나 내려놓을 때 — 자리만 비우고, 방장이어도 방은 닫지 않는다. */
export function leaveRoom(roomId: string, peerId: string, soft = false): Promise<void> {
  // 화면을 닫는 순간이라 부르는 쪽은 보통 기다리지 않는다(1:1 통화만 기다린 뒤 기록을 남긴다).
  return call("leave", { roomId, peerId, ...(soft ? { soft: true } : {}) }).then(
    () => undefined,
    () => undefined,
  );
}

async function toBase64(blob: Blob): Promise<string> {
  const buffer = new Uint8Array(await blob.arrayBuffer());
  let binary = "";
  for (let i = 0; i < buffer.length; i += 8192) {
    binary += String.fromCharCode(...buffer.subarray(i, i + 8192));
  }
  return btoa(binary);
}

/**
 * 내 마이크 한 조각을 받아쓴다. 통화 학습과 같은 빠른 길(room 표시).
 * 같은 말의 뒷조각이면 말 번호·순번과 앞에서 받아쓴 글을 같이 보낸다: 서버는 말 하나를 자막 한 줄로 세고(조각마다 세지 않음),
 * 앞 글을 맥락으로 이어 받아쓴다.
 */
export type FixTrust = "high" | "check";

export async function transcribeUtterance(
  blob: Blob,
  mimeType: string,
  languages: string[] = [],
  piece?: { utterance: string; part: number; previous?: string },
  options: { fix?: boolean } = {},
): Promise<{ text: string; unsure: boolean; fix: FixTrust | null; extrasOff: boolean }> {
  const response = await fetch(apiUrl("/api/roleplay/listen"), {
    method: "POST",
    headers: { "Content-Type": "application/json", ...entitlementHeaders() },
    body: JSON.stringify({
      audioBase64: await toBase64(blob),
      filename: mimeType.includes("wav") ? "line.wav" : mimeType.includes("mp4") ? "line.mp4" : "line.webm",
      mimeType: mimeType || "audio/webm",
      room: true,
      ...(piece ? { utterance: piece.utterance, part: piece.part, ...(piece.previous ? { previous: piece.previous } : {}) } : {}),
      // 방의 언어(보통 둘), 자유 대화방이면 말하는 사람의 두 언어 — 이 밖의 글자로 나온 자막은 지어낸 것으로 본다(서버).
      languages,
      // 내 줄 교정을 원함(서버가 믿을 만한 조각에 표를 남기고 fix로 알려 줌).
      ...(options.fix ? { fix: true } : {}),
    }),
  });
  // 2026-10-22부터 서버는 한도를 넘어도 자막을 계속 준다(429 없음). 옛 서버 대비로만 남김.
  if (response.status === 429) throw new RoomApiError("CAPTION_LIMIT", 429);
  if (!response.ok) return { text: "", unsure: false, fix: null, extrasOff: false };
  const body = (await response.json()) as { text?: unknown; unsure?: unknown; fix?: unknown; extras?: unknown };
  return {
    text: typeof body.text === "string" ? body.text.trim() : "",
    unsure: body.unsure === true,
    fix: body.fix === "high" || body.fix === "check" ? body.fix : null,
    // 오늘 방 자막 한도를 넘음: 자막은 계속, 교정 같은 덧붙임만 멈춤.
    extrasOff: body.extras === false,
  };
}

export type RoomFixResult = { original: string; corrected: string; explanation: string; disputed: string[] };

/**
 * 내 말 한 마디(조각들)를 교정해 달라고(서버 `/api/rooms/fix`). 고칠 게 없거나 교정할 수 없는 줄이면 null.
 * 확신이 어중간한(check) 조각은 소리도 같이 — 서버가 다른 모델로 한 번 더 받아써 견준다.
 */
export async function fixMyLine(input: {
  utterance: string;
  parts: { part: number; text: string; blob?: Blob; mimeType?: string }[];
  targetLanguage: string;
  locale: string;
  recent: string[];
}): Promise<RoomFixResult | null> {
  const parts = await Promise.all(
    input.parts.map(async (row) => ({
      part: row.part,
      text: row.text,
      ...(row.blob ? { audioBase64: await toBase64(row.blob), mimeType: row.mimeType || "audio/webm" } : {}),
    })),
  );
  const response = await fetch(apiUrl("/api/rooms/fix"), {
    method: "POST",
    headers: { "Content-Type": "application/json", ...entitlementHeaders() },
    body: JSON.stringify({
      utterance: input.utterance,
      parts,
      targetLanguage: input.targetLanguage,
      interfaceLanguage: input.locale,
      recent: input.recent,
    }),
  });
  if (!response.ok) return null;
  const body = (await response.json()) as {
    skip?: unknown;
    hasError?: unknown;
    original?: unknown;
    corrected?: unknown;
    explanation?: unknown;
    disputed?: unknown;
  };
  if (body.skip || body.hasError !== true || typeof body.corrected !== "string" || typeof body.original !== "string") return null;
  return {
    original: body.original,
    corrected: body.corrected,
    explanation: typeof body.explanation === "string" ? body.explanation : "",
    disputed: Array.isArray(body.disputed) ? body.disputed.filter((word): word is string => typeof word === "string") : [],
  };
}

/** 내 줄 교정을 확인 모델에 한 번 더(위험한 줄만 — 서버도 같은 규칙으로 거른다). 바뀐 교정, 고칠 게 없으면 null. */
export async function verifyMyLine(input: {
  original: string;
  corrected: string;
  explanation: string;
  disputed: string[];
  targetLanguage: string;
  locale: string;
}): Promise<{ corrected: string; explanation: string } | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 9000);
  try {
    const response = await fetch(apiUrl("/api/chat/verify"), {
      method: "POST",
      signal: controller.signal,
      headers: { "Content-Type": "application/json", ...entitlementHeaders() },
      body: JSON.stringify({
        original: input.original,
        corrected: input.corrected,
        explanation: input.explanation,
        targetLanguage: input.targetLanguage,
        interfaceLanguage: input.locale,
        locale: input.locale,
        spoken: true,
        unsure: input.disputed,
      }),
    });
    if (!response.ok) return { corrected: input.corrected, explanation: input.explanation };
    const data = (await response.json()) as { changed?: boolean; noError?: boolean; corrected?: string; explanation?: string };
    if (data.noError) return null;
    if (data.changed && data.corrected?.trim()) {
      return { corrected: data.corrected.trim(), explanation: data.explanation?.trim() || input.explanation };
    }
  } catch {
    // 확인을 못 하면 처음 교정 그대로.
  } finally {
    clearTimeout(timer);
  }
  return { corrected: input.corrected, explanation: input.explanation };
}

/** 번역·다듬기가 실패했을 때 보일 말: 오늘 AI 도움을 다 썼으면 그 안내, 아니면 실패 문구. */
export function aiFailText(t: { translateFailed: string; aiHelpLimit: string }, error: unknown): string {
  return error instanceof RoomApiError && error.code === "AI_HELP_LIMIT" ? t.aiHelpLimit : t.translateFailed;
}

/** 자막 줄 하나를 내 앱 언어로. 앞 줄들을 맥락으로 같이 보낸다. */
export async function translateLine(input: {
  text: string;
  context: string[];
  locale: string;
  targetLanguage: string;
}): Promise<string> {
  const response = await fetch(apiUrl("/api/translate"), {
    method: "POST",
    headers: { "Content-Type": "application/json", ...entitlementHeaders() },
    body: JSON.stringify({
      text: input.text,
      locale: input.locale,
      interfaceLanguage: input.locale,
      targetLanguage: input.targetLanguage,
      sourceType: "conversation",
      context: input.context,
    }),
  });
  if (response.status === 429) throw new RoomApiError("AI_HELP_LIMIT", 429);
  if (!response.ok) throw new Error(`translate ${response.status}`);
  const body = (await response.json()) as { translated?: unknown };
  return typeof body.translated === "string" ? body.translated : "";
}

/**
 * 편한 말로 쓴 댓글을 학습 언어로 — 채팅의 "표현 보기"와 같은 길(how_to_say,
 * expressionOnly). 채팅 횟수로 세지 않는다. 방의 앞 줄들을 맥락으로 보낸다.
 */
export async function howToSay(input: {
  message: string;
  recent: string[];
  locale: string;
  targetLanguage: string;
}): Promise<HowToSayExpression | null> {
  const response = await fetch(apiUrl("/api/chat"), {
    method: "POST",
    headers: { "Content-Type": "application/json", ...entitlementHeaders() },
    body: JSON.stringify({
      message: input.message,
      mode: "how_to_say",
      expressionOnly: true,
      locale: input.locale,
      interfaceLanguage: input.locale,
      targetLanguage: input.targetLanguage,
      recent: input.recent.slice(-6),
    }),
  });
  if (response.status === 429) {
    const body = (await response.json().catch(() => ({}))) as { error?: string };
    throw new RoomApiError(body.error ?? "AI_HELP_LIMIT", 429);
  }
  if (!response.ok) throw new Error(`how_to_say ${response.status}`);
  const data = (await response.json()) as HowToSayExpression;
  if (!data.expression?.trim()) return null;
  return normalizeHowToSayExpression(input.message, data);
}

/* ---- 사람 사이(api/social) ---- */

async function social<T>(action: string, payload: Record<string, unknown>): Promise<T> {
  const response = await fetch(apiUrl("/api/social"), {
    method: "POST",
    headers: { "Content-Type": "application/json", ...entitlementHeaders() },
    body: JSON.stringify({ action, ...payload }),
  });
  const body = (await response.json().catch(() => ({}))) as { error?: string } & T;
  if (!response.ok) {
    noteSuspended(response.status, body);
    throw new RoomApiError(body.error ?? "FAILED", response.status);
  }
  return body;
}

const profiles = new Map<string, Promise<PublicProfile | null>>();

/** 공개 프로필. 사진이 커서 한 번 받으면 이 실행 동안 들고 있는다. */
export function fetchProfile(id: string, fresh = false): Promise<PublicProfile | null> {
  if (fresh || !profiles.has(id)) {
    profiles.set(
      id,
      social<{ profile: PublicProfile }>("profile", { target: id })
        .then((body) => body.profile)
        .catch(() => {
          profiles.delete(id);
          return null;
        }),
    );
  }
  return profiles.get(id)!;
}

/** 답 하나의 위치 — "도움됐어요"(질문한 사람만, 서버 contribStore.findAnswerer가 다시 확인). */
export type ThankTarget =
  | { kind: "room"; roomId: string; seq: number }
  | { kind: "dm"; threadId: string; seq: number }
  | { kind: "board"; postId: string; commentId: string };

/** 도움됐어요. 이미 누른 답·오늘 이미 그 사람에게 누름은 오류 코드로(ALREADY·TODAY). */
export async function sendThank(target: ThankTarget, learn: string): Promise<void> {
  await social("thank", { ...target, learn });
}

export async function setFollow(target: string, on: boolean): Promise<void> {
  await social(on ? "follow" : "unfollow", { target });
}

export async function setBlock(target: string, on: boolean): Promise<void> {
  await social(on ? "block" : "unblock", { target });
}

export async function reportPerson(input: { target: string; reason: string; roomId: string; lines: string[] }): Promise<void> {
  await social("report", input);
}

/** 사람 목록(최근에 앱을 쓴 사람). 부르는 것 자체가 "나도 지금 쓰는 중" 신호. */
/** 사람 목록. `match`를 주면 서버가 언어 칩으로 거른 뒤 60명을 준다(lib/rooms/langMatch.ts). */
export async function listPeople(langs: { learn: string; ui: string; match?: LangMatch }): Promise<PersonCard[]> {
  return (await social<{ people: PersonCard[] }>("people", langs)).people;
}

/** 앱을 쓰는 중 — 사람 목록에서 "접속 중"으로 보이게. 실패해도 조용히. */
export function pingPresence(langs: { learn: string; ui: string }): void {
  void social("ping", langs).catch(() => {});
}

export async function myRelations(): Promise<{ following: string[]; blocked: string[] }> {
  return social("mine", {});
}

/* ---- 1:1 메시지(api/dm) ---- */

async function dm<T>(action: string, payload: Record<string, unknown>): Promise<T> {
  const response = await fetch(apiUrl("/api/dm"), {
    method: "POST",
    headers: { "Content-Type": "application/json", ...entitlementHeaders() },
    body: JSON.stringify({ action, code: readInviteCode(), ...payload }),
  });
  const body = (await response.json().catch(() => ({}))) as { error?: string } & T;
  if (!response.ok) {
    noteSuspended(response.status, body);
    throw new RoomApiError(body.error ?? "FAILED", response.status);
  }
  return body;
}

export function dmInbox(): Promise<{ threads: DmSummary[] }> {
  return dm("inbox", {});
}

export function dmOpen(target: string): Promise<{ thread: DmThread | null; messages: DmMessage[]; blocked: boolean; gone?: number[]; peerRead?: number }> {
  return dm("open", { target });
}

export function dmPoll(threadId: string, since: number): Promise<{ thread: DmThread; messages: DmMessage[]; gone?: number[]; peerRead?: number }> {
  return dm("poll", { threadId, since });
}

/** 보낸 줄 지우기 — 상대에게서도 사라진다(내 글·사진·통화 요청, 통화 기록은 둘 다). */
export function dmUnsend(threadId: string, seq: number): Promise<{ ok: true }> {
  return dm("unsend", { threadId, seq });
}

export function dmSend(
  target: string,
  text: string,
  quote?: { seq: number; index?: number; ask: boolean; roomId?: string; focus?: string },
  /** 먼저 올린 사진(mediaClient uploadImage) — 이 대화에 한 번만 붙는다. */
  imageId?: string,
  /** 받아 둔 묶음의 아이콘(rooms/icons.ts) — 서버가 묶음에서 채운다. */
  icon?: { pack: string; id: string },
): Promise<{ thread: DmThread; message: DmMessage }> {
  const image = { ...(imageId ? { imageId } : {}), ...(icon ? { icon } : {}) };
  if (!quote) return dm("send", { target, text, ...image });
  // roomId가 있으면 쪽지: 방 자막 줄을 집은 것(서버가 방 기록에서 채움).
  const focus = quote.focus ? { quoteFocus: quote.focus } : {};
  if (quote.roomId) return dm("send", { target, text, roomQuote: { roomId: quote.roomId, seq: quote.seq }, ask: quote.ask, ...focus, ...image });
  return dm("send", { target, text, quoteSeq: quote.seq, quoteIndex: quote.index, ask: quote.ask, ...focus, ...image });
}

/** 내 목록에서 대화 지우기(상대 쪽은 그대로, 새 줄이 오면 다시 나옴). */
export function dmHide(threadId: string): Promise<{ ok: true }> {
  return dm("hide", { threadId });
}

export function dmDecline(threadId: string): Promise<{ ok: true }> {
  return dm("decline", { threadId });
}

export function dmCall(threadId: string, peerId: string): Promise<{ room: RoomMeta; message: DmMessage }> {
  return dm("call", { threadId, peerId });
}

export function dmEndCall(roomId: string): Promise<{ logged: boolean }> {
  return dm("endCall", { roomId });
}

/* ── 단체방(워크스페이스 1단계, rooms/group.ts) ───────────────────────── */

async function groups<T>(action: string, payload: Record<string, unknown>): Promise<T> {
  const response = await fetch(apiUrl("/api/groups"), {
    method: "POST",
    headers: { "Content-Type": "application/json", ...entitlementHeaders() },
    body: JSON.stringify({ action, code: readInviteCode(), ...payload }),
  });
  const body = (await response.json().catch(() => ({}))) as { error?: string } & T;
  if (!response.ok) {
    noteSuspended(response.status, body);
    throw new RoomApiError(body.error ?? "FAILED", response.status);
  }
  return body;
}

export function groupMine(): Promise<{ groups: GroupSummary[] }> {
  return groups("mine", {});
}

export function groupCreate(name: string, languages: string[], invite: string[]): Promise<{ group: Group }> {
  return groups("create", { name, languages, invite });
}

export function groupOpen(groupId: string): Promise<{ group: Group; messages: GroupMessage[]; call?: GroupCall; gone?: number[]; reads?: number[] }> {
  return groups("open", { groupId });
}

export function groupPoll(groupId: string, since: number): Promise<{ group: Group; messages: GroupMessage[]; call?: GroupCall; gone?: number[]; reads?: number[] }> {
  return groups("poll", { groupId, since });
}

/** 보낸 줄 지우기 — 모두에게서 사라진다(내 글·사진, 통화 기록은 남긴 사람이나 방장). */
export function groupUnsend(groupId: string, seq: number): Promise<{ ok: true }> {
  return groups("unsend", { groupId, seq });
}

/** 📞 단체방 통화: 열려 있으면 그 방, 없으면 새 비공개 방. */
export function groupCall(groupId: string, peerId: string): Promise<{ room: RoomMeta }> {
  return groups("call", { groupId, peerId });
}

/** 통화에서 나갈 때: 모두 나갔으면 서버가 자막을 기록으로 남긴다. */
export function groupEndCall(groupId: string, roomId: string): Promise<{ logged: boolean }> {
  return groups("endCall", { groupId, roomId });
}

export function groupSend(
  groupId: string,
  text: string,
  quote?: { seq: number; ask: boolean; focus?: string },
  imageId?: string,
  icon?: { pack: string; id: string },
): Promise<{ group: Group; message: GroupMessage }> {
  const image = { ...(imageId ? { imageId } : {}), ...(icon ? { icon } : {}) };
  const focus = quote?.focus ? { quoteFocus: quote.focus } : {};
  return groups("send", quote ? { groupId, text, quoteSeq: quote.seq, ask: quote.ask, ...focus, ...image } : { groupId, text, ...image });
}

export function groupInvite(groupId: string, target: string): Promise<{ ok: true }> {
  return groups("invite", { groupId, target });
}

export function groupAnswer(groupId: string, accept: boolean): Promise<{ group: Group }> {
  return groups("answer", { groupId, accept });
}

export function groupLeave(groupId: string): Promise<{ ok: true }> {
  return groups("leave", { groupId });
}

export function groupKick(groupId: string, target: string): Promise<{ ok: true }> {
  return groups("kick", { groupId, target });
}

export function groupTransfer(groupId: string, target: string): Promise<{ ok: true }> {
  return groups("transfer", { groupId, target });
}

// ── 게시판(rooms/board.ts, /api/board) ─────────────────────────

async function board<T>(action: string, payload: Record<string, unknown>): Promise<T> {
  const response = await fetch(apiUrl("/api/board"), {
    method: "POST",
    headers: { "Content-Type": "application/json", ...entitlementHeaders() },
    body: JSON.stringify({ action, ...payload }),
  });
  const body = (await response.json().catch(() => ({}))) as { error?: string } & T;
  if (!response.ok) {
    noteSuspended(response.status, body);
    throw new RoomApiError(body.error ?? "FAILED", response.status);
  }
  return body;
}

export function boardList(input: { language?: string; topic?: BoardTopic; offset?: number; match?: "both"; ui?: string }): Promise<{ posts: BoardPost[]; authors: BoardAuthor[]; next: number }> {
  return board("list", input);
}
export function boardOpen(postId: string): Promise<{ post: BoardPost; comments: BoardComment[]; authors: BoardAuthor[] }> {
  return board("open", { postId });
}
export function boardWrite(
  language: string,
  text: string,
  imageIds: string[] = [],
  link: { topic?: BoardTopic; roomId?: string; groupId?: string } = {},
): Promise<{ post: BoardPost }> {
  return board("post", { language, text, ...(imageIds.length ? { imageIds } : {}), ...link });
}
/** 단체방 모집 글에서 참여하기(글쓴이 이름으로 초대되고 바로 참여). */
export function boardJoinGroup(postId: string): Promise<{ group: BoardGroupView }> {
  return board("joinGroup", { postId });
}
export function boardEdit(postId: string, text: string): Promise<{ post: BoardPost }> {
  return board("edit", { postId, text });
}
/** 좋아요 켜기·끄기 → 지금 수와 내 상태. */
export function boardLike(postId: string, on: boolean): Promise<{ like: { likes: number; liked: boolean } }> {
  return board("like", { postId, on });
}
export function boardDelete(postId: string): Promise<{ ok: true }> {
  return board("delete", { postId });
}
export function boardComment(postId: string, text: string, imageId?: string, replyTo?: string, icon?: { pack: string; id: string }): Promise<{ comment: BoardComment }> {
  return board("comment", { postId, text, ...(imageId ? { imageId } : {}), ...(replyTo ? { replyTo } : {}), ...(icon ? { icon } : {}) });
}
export function boardEditComment(postId: string, commentId: string, text: string): Promise<{ comment: BoardComment }> {
  return board("editComment", { postId, commentId, text });
}
export function boardDeleteComment(postId: string, commentId: string): Promise<{ ok: true }> {
  return board("deleteComment", { postId, commentId });
}

/* ── 팀·러닝메이트 (hub/drafts/team-workspace.md) ───────────────────────── */

export function mateRequest(target: string, languages: string[]): Promise<{ group: Group; state: "pending" | "joined" | "mates" }> {
  return groups("mate", { target, languages });
}

export function groupMakeTeam(groupId: string): Promise<{ group: Group }> {
  return groups("team", { groupId });
}

export function teamSpace(groupId: string): Promise<{ group: Group; space: TeamSpace }> {
  return groups("space", { groupId });
}

export function teamGoal(groupId: string, goal: string): Promise<{ group: Group }> {
  return groups("goal", { groupId, goal });
}

export function teamSchedule(groupId: string, schedule: TeamSchedule | null): Promise<{ group: Group }> {
  return groups("schedule", { groupId, schedule });
}

export function teamShare(groupId: string, text: string, note: string): Promise<{ item: SpaceItem }> {
  return groups("share", { groupId, text, note });
}

export function teamUnshare(groupId: string, itemId: string): Promise<{ ok: true }> {
  return groups("unshare", { groupId, itemId });
}
