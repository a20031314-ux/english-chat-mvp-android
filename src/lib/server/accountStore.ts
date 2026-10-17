import { createHash, randomBytes, randomInt, timingSafeEqual } from "node:crypto";
import { kvDelete, kvGetJson, kvIncrBy, kvListPush, kvSetJson } from "./kv.ts";
import { isIdentified } from "./identity.ts";
import {
  EMAIL_CODE_LENGTH,
  EMAIL_CODE_TTL_SECONDS,
  type AccountProfile,
  type PublicAccount,
} from "../account/shared.ts";

/**
 * 계정 저장소 (KV).
 *
 *   account:v1:<id>            계정 한 줄 (아래 AccountRecord)
 *   account:v1:email:<email>   이메일 → 계정 id
 *   account:v1:google:<sub>    Google 사용자 → 계정 id
 *   account:v1:photo:<id>      프로필 사진 data URL (따로 두어 계정 읽기를 가볍게)
 *   account:v1:code:<email>    이메일 코드(해시·시도 수), 10분
 *   account:v1:send:<email>    코드 보낸 횟수, 1시간
 *   account:v1:purge           지운 계정의 기록 id 목록 — scripts/account-purge.mjs가 비움
 *
 * 기록을 옮기지 않는다. 처음 로그인한 기기의 사용자 id(`rc:…`)를 계정의
 * `dataUserId`로 정하고, 이후 어느 기기든 로그인 토큰이 있으면 그 id로 기록을
 * 읽고 쓴다(premiumRequest.requestUserId). 그래서 첫 기기의 기록은 그대로
 * 계정 기록이 되고, 두 번째 기기의 로그인 전 기록은 그 기기의 익명 id에 남는다.
 *
 * 계정은 지우지 않는 한 남는다(TTL 없음). 학습 기록 쪽 TTL은 각 저장소가 정한다.
 */

export type AccountRecord = {
  id: string;
  createdAt: string;
  dataUserId: string;
  email: string | null;
  googleSub: string | null;
  profile: { nickname: string; bio: string; hasPhoto: boolean; updatedAt: string };
};

const accountKey = (id: string) => `account:v1:${id}`;
const emailKey = (email: string) => `account:v1:email:${email}`;
const googleKey = (sub: string) => `account:v1:google:${sub}`;
const photoKey = (id: string) => `account:v1:photo:${id}`;
const codeKey = (email: string) => `account:v1:code:${email}`;
const sendKey = (email: string) => `account:v1:send:${email}`;

/** 한 주소에 한 시간 동안 보낼 수 있는 코드 수. */
export const EMAIL_SENDS_PER_HOUR = 5;
/** 코드 하나에 틀릴 수 있는 횟수. 넘으면 코드를 버리고 새로 받게 한다. */
export const EMAIL_CODE_ATTEMPTS = 5;

export function newAccountId(): string {
  return `lb_${randomBytes(12).toString("hex")}`;
}

export async function readAccount(id: string): Promise<AccountRecord | null> {
  if (!/^lb_[0-9a-f]{24}$/.test(id)) return null;
  return kvGetJson<AccountRecord>(accountKey(id));
}

export async function readPhoto(id: string): Promise<string | null> {
  const row = await kvGetJson<{ photo: string }>(photoKey(id));
  return row?.photo ?? null;
}

export async function toPublic(record: AccountRecord): Promise<PublicAccount> {
  return {
    id: record.id,
    createdAt: record.createdAt,
    email: record.email,
    google: record.googleSub !== null,
    profile: {
      nickname: record.profile.nickname,
      bio: record.profile.bio,
      photo: record.profile.hasPhoto ? await readPhoto(record.id) : null,
    },
  };
}

export type LoginIdentity =
  | { kind: "google"; sub: string; email: string | null; name: string | null }
  | { kind: "email"; email: string };

/**
 * 로그인한 신원으로 계정을 찾거나 만든다.
 *
 * Google이 확인한 이메일이 이메일 로그인 계정과 같으면 같은 계정으로 잇는다
 * (반대도 같다) — 같은 사람이 버튼을 바꿔 눌러 계정이 둘로 갈리지 않게.
 * `currentUserId`는 지금 이 기기의 사용자 id. 새 계정이면 그게 계정의 기록이 된다.
 */
export async function findOrCreateAccount(
  identity: LoginIdentity,
  currentUserId: string,
  now: Date = new Date(),
): Promise<{ account: AccountRecord; created: boolean }> {
  let id: string | null = null;
  if (identity.kind === "google") {
    id = await kvGetJson<string>(googleKey(identity.sub));
    if (!id && identity.email) id = await kvGetJson<string>(emailKey(identity.email));
  } else {
    id = await kvGetJson<string>(emailKey(identity.email));
  }

  const existing = id ? await readAccount(id) : null;
  if (existing) {
    let changed = false;
    if (identity.kind === "google" && existing.googleSub !== identity.sub) {
      existing.googleSub = identity.sub;
      await kvSetJson(googleKey(identity.sub), existing.id);
      changed = true;
    }
    const email = identity.email;
    if (email && !existing.email) {
      existing.email = email;
      await kvSetJson(emailKey(email), existing.id);
      changed = true;
    }
    if (changed) await kvSetJson(accountKey(existing.id), existing);
    return { account: existing, created: false };
  }

  const accountId = newAccountId();
  const email = identity.email ?? null;
  const record: AccountRecord = {
    id: accountId,
    createdAt: now.toISOString(),
    // 로그인 전 기록이 없던 기기(웹 등)는 계정 자신의 id로 새로 시작.
    dataUserId: isIdentified(currentUserId) ? currentUserId : `acct:${accountId}`,
    email,
    googleSub: identity.kind === "google" ? identity.sub : null,
    profile: {
      nickname: identity.kind === "google" ? defaultNickname(identity.name) : "",
      bio: "",
      hasPhoto: false,
      updatedAt: now.toISOString(),
    },
  };
  await kvSetJson(accountKey(accountId), record);
  if (email) await kvSetJson(emailKey(email), accountId);
  if (record.googleSub) await kvSetJson(googleKey(record.googleSub), accountId);
  return { account: record, created: true };
}

function defaultNickname(name: string | null): string {
  return (name ?? "").trim().slice(0, 20);
}

export async function saveProfile(
  record: AccountRecord,
  next: { nickname: string; bio: string; photo?: string | null },
  now: Date = new Date(),
): Promise<AccountRecord> {
  const updated: AccountRecord = {
    ...record,
    profile: {
      nickname: next.nickname,
      bio: next.bio,
      hasPhoto: next.photo === undefined ? record.profile.hasPhoto : next.photo !== null,
      updatedAt: now.toISOString(),
    },
  };
  if (next.photo === null) await kvDelete([photoKey(record.id)]);
  else if (typeof next.photo === "string") await kvSetJson(photoKey(record.id), { photo: next.photo });
  await kvSetJson(accountKey(record.id), updated);
  return updated;
}

export const PURGE_QUEUE_KEY = "account:v1:purge";

/**
 * 계정을 지운다: 계정 줄, 이메일·Google 연결, 사진, 코드는 바로.
 * 학습 기록(계정의 dataUserId로 키가 잡힌 모든 줄)은 키 공간을 훑어야 해서
 * 요청 안에서 지우지 않고(kv.ts kvScanKeys 주석) 목록에 넣는다 —
 * `scripts/account-purge.mjs`가 그 목록을 비우며 지운다.
 */
export async function deleteAccount(record: AccountRecord): Promise<void> {
  const keys = [accountKey(record.id), photoKey(record.id)];
  if (record.email) keys.push(emailKey(record.email), codeKey(record.email), sendKey(record.email));
  if (record.googleSub) keys.push(googleKey(record.googleSub));
  await kvDelete(keys);
  await kvListPush(PURGE_QUEUE_KEY, [record.dataUserId], 400 * 24 * 60 * 60);
}

// ── 이메일 코드 ──────────────────────────────────────────────

type CodeRow = { hash: string; attempts: number };

function hashCode(email: string, code: string): string {
  return createHash("sha256").update(`${email}:${code}`).digest("hex");
}

export function newEmailCode(): string {
  return String(randomInt(0, 10 ** EMAIL_CODE_LENGTH)).padStart(EMAIL_CODE_LENGTH, "0");
}

/** 보낼 수 있으면 코드를 저장하고 돌려준다. 한도를 넘으면 null. */
export async function createEmailCode(email: string): Promise<string | null> {
  const sent = await kvIncrBy(sendKey(email), 1, 60 * 60);
  if (sent > EMAIL_SENDS_PER_HOUR) return null;
  const code = newEmailCode();
  await kvSetJson(codeKey(email), { hash: hashCode(email, code), attempts: 0 } satisfies CodeRow, EMAIL_CODE_TTL_SECONDS);
  return code;
}

export type CodeCheck = "ok" | "wrong" | "expired" | "locked";

export async function checkEmailCode(email: string, code: string): Promise<CodeCheck> {
  const row = await kvGetJson<CodeRow>(codeKey(email));
  if (!row) return "expired";
  if (row.attempts >= EMAIL_CODE_ATTEMPTS) return "locked";
  const given = Buffer.from(hashCode(email, code));
  const expected = Buffer.from(row.hash);
  if (given.length === expected.length && timingSafeEqual(given, expected)) {
    await kvDelete([codeKey(email)]);
    return "ok";
  }
  const attempts = row.attempts + 1;
  if (attempts >= EMAIL_CODE_ATTEMPTS) {
    await kvDelete([codeKey(email)]);
    return "locked";
  }
  await kvSetJson(codeKey(email), { ...row, attempts }, EMAIL_CODE_TTL_SECONDS);
  return "wrong";
}

export type { AccountProfile };
