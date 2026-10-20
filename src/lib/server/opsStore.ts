/**
 * 운영자 신고함(/ops, api/ops/reports) 저장소. 사람이 판단하고 누른다 — 자동으로 정지하지 않는다.
 *
 *   ops:v1:ban:<계정>   사람 기능 정지 {at, until, note} — until이 null이면 풀 때까지
 *   ops:v1:done         처리한 신고 {신고 id: {at, note}} (90일, 신고와 같은 수명)
 *
 * 신고 자체는 socialStore의 `social:v1:reports`(사람이 보낸 신고 + AI 영상 검사가 남긴 것).
 * 정지되면 메시지·단체방·게시판 쓰기·방 만들기/들어가기·팔로우·사진 올리기·랜덤이 막힌다(`suspendedResponse`).
 * AI 채팅·통화·영상 학습·My는 그대로(학습은 막지 않는다). 신고하기도 그대로.
 */
import { createHash, timingSafeEqual } from "node:crypto";
import { canReadFeedback } from "./feedbackStore.ts";
import { kvDelete, kvGetJson, kvGetJsonMany, kvSetJson } from "./kv.ts";

const banKey = (id: string) => `ops:v1:ban:${id}`;
const DONE_KEY = "ops:v1:done";
const DONE_TTL_SECONDS = 90 * 24 * 60 * 60;
/** 기한 없는 정지도 키는 3년(계정 삭제 때 지움). */
const BAN_FOREVER_SECONDS = 3 * 365 * 24 * 60 * 60;

export type Ban = { at: number; until: number | null; note: string };
export type DoneMark = { at: number; note: string };

/**
 * 운영자 키: Vercel `OPS_KEY`(따로 정했으면), 아니면 의견함 읽기 키와 같은 키.
 * 키는 저장소에 두지 않는다.
 */
export function canOperate(key: string | null, env: NodeJS.ProcessEnv = process.env): boolean {
  if (!key) return false;
  const own = env.OPS_KEY?.trim();
  if (own) {
    const a = createHash("sha256").update(key.trim()).digest();
    const b = createHash("sha256").update(own).digest();
    return timingSafeEqual(a, b);
  }
  return canReadFeedback(key);
}

/** 신고 한 건의 id: 저장된 JSON 그대로의 해시(같은 줄이면 같은 id). */
export function reportId(raw: string): string {
  return createHash("sha256").update(raw).digest("hex").slice(0, 12);
}

export async function readBan(accountId: string, now: number = Date.now()): Promise<Ban | null> {
  const ban = await kvGetJson<Ban>(banKey(accountId));
  if (!ban) return null;
  return ban.until !== null && ban.until <= now ? null : ban;
}

export async function readBans(ids: string[], now: number = Date.now()): Promise<(Ban | null)[]> {
  const rows = await kvGetJsonMany<Ban>(ids.map(banKey));
  return rows.map((ban) => (ban && (ban.until === null || ban.until > now) ? ban : null));
}

export async function setBan(accountId: string, until: number | null, note: string, now: number = Date.now()): Promise<Ban> {
  const ban: Ban = { at: now, until, note: note.slice(0, 300) };
  const ttl = until === null ? BAN_FOREVER_SECONDS : Math.max(60, Math.ceil((until - now) / 1000));
  await kvSetJson(banKey(accountId), ban, ttl);
  return ban;
}

export async function liftBan(accountId: string): Promise<void> {
  await kvDelete([banKey(accountId)]);
}

export async function readDone(): Promise<Record<string, DoneMark>> {
  return (await kvGetJson<Record<string, DoneMark>>(DONE_KEY)) ?? {};
}

/** 처리함 표시/취소. 운영자 한 사람이 누르므로 읽고-쓰기로 충분하다. */
export async function markDone(id: string, done: boolean, note = "", now: number = Date.now()): Promise<void> {
  const all = await readDone();
  if (done) all[id] = { at: now, note: note.slice(0, 300) };
  else delete all[id];
  // 90일 지난 표시는 버린다(신고도 그때 사라짐).
  for (const [key, mark] of Object.entries(all)) if (now - mark.at > DONE_TTL_SECONDS * 1000) delete all[key];
  await kvSetJson(DONE_KEY, all, DONE_TTL_SECONDS);
}

/** 계정을 지울 때. */
export async function forgetOps(accountId: string): Promise<void> {
  await kvDelete([banKey(accountId)]);
}
