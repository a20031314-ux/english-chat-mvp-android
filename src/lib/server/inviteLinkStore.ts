import { randomInt } from "node:crypto";
import { kvDelete, kvGetJson, kvIncrBy, kvGetNumber, kvSetJsonIfAbsent } from "./kv.ts";
import { newJoinRecord } from "../invite/rewards.ts";

/**
 * 친구 초대 링크(앱 밖 사람을 앱으로). 말하는 방의 "입장 코드"(roomStore inviteCodes)와는 다른 것.
 *
 *   invite:v1:code:<코드>     코드 → 초대한 계정 id (한 번 만들면 그대로)
 *   invite:v1:by:<계정>       계정 → 그 사람의 코드
 *   invite:v1:joined:<계정>   이 계정을 처음 데려온 사람(한 번만 정해짐)
 *   invite:v1:count:<계정>    이 사람의 링크로 들어온 사람 수
 *
 * 링크는 계정마다 하나: /invite?c=<코드>(방 초대면 &room=<방 id>). 보상은 아직 없다(사용자 결정).
 */

const ALPHABET = "abcdefghjkmnpqrstuvwxyz23456789"; // 헷갈리는 0 o 1 l i 빼고
const CODE_LENGTH = 8;

const codeKey = (code: string) => `invite:v1:code:${code}`;
const byKey = (id: string) => `invite:v1:by:${id}`;
const joinedKey = (id: string) => `invite:v1:joined:${id}`;
const countKey = (id: string) => `invite:v1:count:${id}`;

export function isInviteLinkCode(value: unknown): value is string {
  return typeof value === "string" && new RegExp(`^[${ALPHABET}]{${CODE_LENGTH}}$`).test(value);
}

function newCode(): string {
  let code = "";
  for (let i = 0; i < CODE_LENGTH; i += 1) code += ALPHABET.charAt(randomInt(0, ALPHABET.length));
  return code;
}

/** 내 초대 코드. 없으면 만든다(겹치면 다시). 저장소에 못 닿으면 null. */
export async function inviteCodeFor(accountId: string): Promise<string | null> {
  const existing = await kvGetJson<string>(byKey(accountId));
  if (existing) return existing;
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const code = newCode();
    if (await kvSetJsonIfAbsent(codeKey(code), accountId)) {
      // 두 요청이 동시에 만들면 먼저 쓴 쪽을 쓴다.
      if (await kvSetJsonIfAbsent(byKey(accountId), code)) return code;
      return kvGetJson<string>(byKey(accountId));
    }
  }
  return null;
}

export async function inviterOf(code: string): Promise<string | null> {
  return isInviteLinkCode(code) ? kvGetJson<string>(codeKey(code)) : null;
}

/**
 * 초대받은 사람이 링크로 들어왔다. 처음 한 번만 세고, 처음이면 true.
 * 기록은 보상 규칙(invite/rewards.ts)의 JoinRecord — 가입한 지 48시간 안의 계정만 보상 대상.
 */
export async function noteJoined(inviter: string, invitee: string, inviteeCreatedAt: string | number | null = null, now: number = Date.now()): Promise<boolean> {
  if (inviter === invitee) return false;
  if (!(await kvSetJsonIfAbsent(joinedKey(invitee), newJoinRecord(inviter, inviteeCreatedAt, now), 400 * 24 * 60 * 60))) return false;
  await kvIncrBy(countKey(inviter), 1);
  return true;
}

export async function invitedCount(accountId: string): Promise<number> {
  return kvGetNumber(countKey(accountId));
}

/** 계정을 지울 때: 내 코드(링크가 더는 열리지 않음)·누가 나를 데려왔는지·데려온 수. */
export async function forgetInvites(accountId: string): Promise<void> {
  const code = await kvGetJson<string>(byKey(accountId));
  await kvDelete([
    byKey(accountId),
    joinedKey(accountId),
    countKey(accountId),
    ...(code ? [codeKey(code)] : []),
    // 보상 기록(inviteRewardStore) — 거기서 이 파일을 거꾸로 부르지 않게 키 이름만 같이 둔다.
    `invite:v1:friends:${accountId}`,
    `invite:v1:points:${accountId}`,
    `invite:v1:pass:${accountId}`,
    `invite:v1:news:${accountId}`,
  ]);
}
