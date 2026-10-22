/**
 * 사람 사이 사진 저장소(규칙은 rooms/media.ts).
 *
 *   media:v1:meta:<id>        사진 한 장(누가·어디에·저장 경로·크기·보낸 곳·지울 때)
 *   media:v1:day:<계정>:<날짜>  오늘 올린 장수(하루 상한)
 *   media:v1:owner:<계정>      그 사람이 올린 사진 id(계정 지울 때 같이 지움)
 *   media:v1:sweep:<날짜>      그날 지울 사진(예약 작업 /api/media/sweep이 읽음)
 *
 * 파일은 Vercel Blob(private) `media/<id>.<ext>`. KV의 보관 기간이 끝나도 파일은 저절로 사라지지 않아서
 * 지울 날짜마다 목록을 두고 매일 지운다. 사진 자체는 서버 밖으로(검사 모델 말고) 나가지 않는다.
 */
import { del, get, put } from "@vercel/blob";
import {
  MEDIA_CHAT_TTL_SECONDS,
  MEDIA_MAX_BYTES,
  MEDIA_TYPES,
  MEDIA_UNSENT_TTL_SECONDS,
  newMediaId,
  type MediaRef,
} from "../rooms/media.ts";
import { kvDelete, kvGetJson, kvIncrBy, kvListPush, kvListRange, kvSetJson } from "./kv.ts";

/** 이 사진을 어디에 붙였는지(보는 사람 확인용). 게시판은 글 id가 붙기 전엔 "board". */
export type MediaPlace = { kind: "dm"; threadId: string } | { kind: "group"; groupId: string } | { kind: "board"; postId?: string };

export type MediaMeta = {
  id: string;
  owner: string;
  path: string;
  type: string;
  w: number;
  h: number;
  bytes: number;
  place: MediaPlace;
  createdAt: number;
  /** 메시지·글에 붙였는지(한 번만). */
  used: boolean;
  /** 지울 때(ms). 게시판에 붙은 사진은 null — 글을 지울 때 같이 지운다. */
  expiresAt: number | null;
};

const metaKey = (id: string) => `media:v1:meta:${id}`;
const dayKey = (owner: string, day: string) => `media:v1:day:${owner}:${day}`;
const ownerKey = (owner: string) => `media:v1:owner:${owner}`;
const sweepKey = (day: string) => `media:v1:sweep:${day}`;
/** 게시판 사진 정보는 글이 있는 동안 — KV 기간은 넉넉히(1년, 글을 지우면 같이 지움). */
const BOARD_META_TTL = 365 * 24 * 60 * 60;
const SWEEP_LIST_TTL = 40 * 24 * 60 * 60;

/** Vercel Blob 연결 때 "Add a read-write token env var"를 체크해야 이 값이 생긴다(새 연결 방식은 기본으로 안 만듦, 2026-10-22). */
export function blobConfigured(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim());
}

const utcDay = (ms: number) => new Date(ms).toISOString().slice(0, 10);

async function scheduleSweep(id: string, at: number): Promise<void> {
  await kvListPush(sweepKey(utcDay(at)), [id], SWEEP_LIST_TTL);
}

export type UploadError = "TOO_BIG" | "BAD_TYPE" | "LIMIT" | "REJECTED" | "UNAVAILABLE";

/** 한 장 올리기: 하루 상한 → 검사(부르는 쪽이 넘긴 check) → 저장. 보내기 전이라 하루 뒤 지울 목록에. */
export async function uploadMedia(input: {
  owner: string;
  place: MediaPlace;
  bytes: Uint8Array;
  type: string;
  w: number;
  h: number;
  dailyLimit: number;
  /** 성인·폭력 등이면 false. 검사를 못 하면(키 없음·오류) 막는다 — 사람이 올린 사진은 검사 없이 두지 않는다. */
  check: (dataUrl: string) => Promise<boolean>;
  now?: number;
}): Promise<{ ok: true; ref: MediaRef } | { ok: false; error: UploadError }> {
  if (!blobConfigured()) return { ok: false, error: "UNAVAILABLE" };
  if (!(MEDIA_TYPES as readonly string[]).includes(input.type)) return { ok: false, error: "BAD_TYPE" };
  if (input.bytes.byteLength === 0 || input.bytes.byteLength > MEDIA_MAX_BYTES) return { ok: false, error: "TOO_BIG" };
  const now = input.now ?? Date.now();
  const used = await kvIncrBy(dayKey(input.owner, utcDay(now)), 1, 2 * 24 * 60 * 60);
  if (used > input.dailyLimit) return { ok: false, error: "LIMIT" };
  const dataUrl = `data:${input.type};base64,${Buffer.from(input.bytes).toString("base64")}`;
  if (!(await input.check(dataUrl))) return { ok: false, error: "REJECTED" };
  const id = newMediaId();
  const ext = input.type === "image/png" ? "png" : input.type === "image/jpeg" ? "jpg" : "webp";
  const path = `media/${id}.${ext}`;
  await put(path, Buffer.from(input.bytes), { access: "private", contentType: input.type, addRandomSuffix: false });
  const meta: MediaMeta = {
    id,
    owner: input.owner,
    path,
    type: input.type,
    w: input.w,
    h: input.h,
    bytes: input.bytes.byteLength,
    place: input.place,
    createdAt: now,
    used: false,
    expiresAt: now + MEDIA_UNSENT_TTL_SECONDS * 1000,
  };
  await kvSetJson(metaKey(id), meta, MEDIA_CHAT_TTL_SECONDS + 7 * 24 * 60 * 60);
  await kvListPush(ownerKey(input.owner), [id], BOARD_META_TTL);
  await scheduleSweep(id, meta.expiresAt!);
  return { ok: true, ref: { id, w: input.w, h: input.h } };
}

export async function readMediaMeta(id: string): Promise<MediaMeta | null> {
  return kvGetJson<MediaMeta>(metaKey(id));
}

function samePlace(a: MediaPlace, b: MediaPlace): boolean {
  if (a.kind === "dm" && b.kind === "dm") return a.threadId === b.threadId;
  if (a.kind === "group" && b.kind === "group") return a.groupId === b.groupId;
  return a.kind === "board" && b.kind === "board";
}

/**
 * 보낼 때 붙이기: 올린 사람·같은 곳·아직 안 쓴 사진만. 1:1·단체방은 지금부터 30일, 게시판은 글과 같이 산다.
 * 다른 사람이 올린 사진 id를 가져와 붙이거나, 한 장을 두 번 붙이지 못한다.
 */
export async function claimMedia(id: string, owner: string, place: MediaPlace, now = Date.now()): Promise<MediaRef | null> {
  const meta = await readMediaMeta(id);
  if (!meta || meta.owner !== owner || meta.used || !samePlace(meta.place, place)) return null;
  const board = place.kind === "board";
  const next: MediaMeta = { ...meta, used: true, place, expiresAt: board ? null : now + MEDIA_CHAT_TTL_SECONDS * 1000 };
  await kvSetJson(metaKey(id), next, board ? BOARD_META_TTL : MEDIA_CHAT_TTL_SECONDS + 7 * 24 * 60 * 60);
  if (next.expiresAt) await scheduleSweep(id, next.expiresAt);
  return { id, w: meta.w, h: meta.h };
}

/** 파일 읽기(서버가 보는 사람을 확인한 뒤). */
export async function openMedia(meta: MediaMeta): Promise<ReadableStream<Uint8Array> | null> {
  if (!blobConfigured()) return null;
  const found = await get(meta.path, { access: "private" });
  return found?.stream ?? null;
}

/** 지우기(게시판 글·댓글을 지울 때, 계정을 지울 때, 기간이 끝났을 때). */
export async function deleteMedia(ids: string[]): Promise<void> {
  const metas = (await Promise.all(ids.map((id) => readMediaMeta(id)))).filter((row): row is MediaMeta => row !== null);
  if (metas.length && blobConfigured()) await del(metas.map((meta) => meta.path)).catch(() => {});
  if (metas.length) await kvDelete(metas.map((meta) => metaKey(meta.id)));
}

/** 계정을 지울 때: 그 사람이 올린 사진 전부. */
export async function forgetMedia(owner: string): Promise<void> {
  const ids = [...new Set(await kvListRange(ownerKey(owner), 0, -1))];
  for (let i = 0; i < ids.length; i += 100) await deleteMedia(ids.slice(i, i + 100));
  await kvDelete([ownerKey(owner)]);
}

/**
 * 매일 정리: 지난 날짜(오늘 포함, 최근 days일)의 목록을 읽어 기간이 끝난 사진만 지운다.
 * 그 사이 게시판에 붙었거나(기간 없음) 30일로 늘어난 사진은 건너뛴다(그 날짜 목록에 다시 들어가 있음).
 */
export async function sweepMedia(now = Date.now(), days = 3): Promise<{ checked: number; deleted: number }> {
  let checked = 0;
  let deleted = 0;
  for (let back = 0; back < days; back += 1) {
    const day = utcDay(now - back * 24 * 60 * 60 * 1000);
    const ids = [...new Set(await kvListRange(sweepKey(day), 0, -1))];
    const due: string[] = [];
    for (const id of ids) {
      checked += 1;
      const meta = await readMediaMeta(id);
      if (meta && meta.expiresAt !== null && meta.expiresAt <= now) due.push(id);
    }
    if (due.length) await deleteMedia(due);
    deleted += due.length;
    if (back > 0) await kvDelete([sweepKey(day)]);
  }
  return { checked, deleted };
}
