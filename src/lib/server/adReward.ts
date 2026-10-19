import { createHmac, timingSafeEqual, verify as verifySignature } from "node:crypto";
import { purposeSecret } from "./authToken.ts";

/**
 * 보상형 광고의 서버 측 확인(SSV).
 *
 * 앱이 "광고 다 봤어요"라고 보내는 말은 믿지 않는다. 앱은 광고를 띄울 때 우리 서버가 서명한
 * 짧은 표(custom_data)를 AdMob에 넘기고, 광고를 끝까지 본 사람이 있으면 AdMob이 직접
 * /api/ads/ssv로 Google 키로 서명한 콜백을 보낸다. 서버는 ① Google 서명 ② 우리 표의 서명을
 * 둘 다 확인한 뒤에만 그날 채팅을 늘린다(entitlementStore grantAdReward).
 *
 * 표에는 사용자 id만 담는다 — 날짜를 넣지 않는 건, 자정 직전에 본 광고가 자정 뒤에 와도
 * 그 사람의 몫이 되게. 오래된 표의 재사용은 transaction_id 한 번만으로 막힌다.
 */

const TOKEN_PURPOSE = "adReward";

function tokenKey(): string | null {
  return purposeSecret(TOKEN_PURPOSE);
}

function sign(body: string, key: string): string {
  return createHmac("sha256", key).update(body).digest("base64url").slice(0, 32);
}

/** 앱이 광고를 띄울 때 custom_data로 넘길 표. 서명할 비밀이 없으면 null(보상형을 띄우지 않음). */
export function issueAdRewardToken(userId: string): string | null {
  const key = tokenKey();
  if (!key) return null;
  const body = Buffer.from(userId, "utf8").toString("base64url");
  return `${body}.${sign(body, key)}`;
}

/** 표가 우리 것이면 사용자 id, 아니면 null. */
export function readAdRewardToken(token: string | null | undefined): string | null {
  if (!token || token.length > 400) return null;
  const key = tokenKey();
  if (!key) return null;
  const dot = token.indexOf(".");
  if (dot <= 0) return null;
  const body = token.slice(0, dot);
  const given = Buffer.from(token.slice(dot + 1));
  const expected = Buffer.from(sign(body, key));
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return null;
  const userId = Buffer.from(body, "base64url").toString("utf8");
  return userId || null;
}

export type VerifierKey = { keyId: number | string; pem: string };

export type SsvCallback = {
  adUnit: string;
  customData: string;
  transactionId: string;
  rewardAmount: number;
  timestamp: number;
};

/**
 * AdMob SSV 콜백의 서명 확인. 서명할 내용은 쿼리 문자열에서 `&signature=` 앞부분 그대로
 * (signature, key_id는 늘 마지막 두 개). 서명은 web-safe base64 DER ECDSA(SHA-256).
 * https://developers.google.com/admob/android/ssv
 */
export function verifySsv(rawQuery: string, keys: VerifierKey[]): SsvCallback | null {
  const query = rawQuery.startsWith("?") ? rawQuery.slice(1) : rawQuery;
  const sigAt = query.indexOf("&signature=");
  if (sigAt <= 0) return null;
  const message = query.slice(0, sigAt);
  const tail = new URLSearchParams(query.slice(sigAt + 1));
  const signature = tail.get("signature");
  const keyId = tail.get("key_id");
  if (!signature || !keyId) return null;
  const key = keys.find((k) => String(k.keyId) === keyId);
  if (!key) return null;
  let ok = false;
  try {
    ok = verifySignature("sha256", Buffer.from(message, "utf8"), key.pem, Buffer.from(signature, "base64url"));
  } catch {
    return null;
  }
  if (!ok) return null;
  const params = new URLSearchParams(message);
  return {
    adUnit: params.get("ad_unit") ?? "",
    customData: params.get("custom_data") ?? "",
    transactionId: params.get("transaction_id") ?? "",
    rewardAmount: Number(params.get("reward_amount") ?? 0),
    timestamp: Number(params.get("timestamp") ?? 0),
  };
}

const VERIFIER_KEYS_URL = "https://www.gstatic.com/admob/reward/verifier-keys.json";
const KEYS_TTL_MS = 12 * 60 * 60 * 1000;
let cachedKeys: { at: number; keys: VerifierKey[] } | null = null;

/** Google의 공개 키(서버 인스턴스마다 12시간 보관, 모르는 key_id면 다시 받음). */
export async function admobVerifierKeys(force = false): Promise<VerifierKey[]> {
  if (!force && cachedKeys && Date.now() - cachedKeys.at < KEYS_TTL_MS) return cachedKeys.keys;
  const response = await fetch(VERIFIER_KEYS_URL, { cache: "no-store" });
  if (!response.ok) throw new Error(`verifier keys ${response.status}`);
  const data = (await response.json()) as { keys?: { keyId?: number | string; pem?: string }[] };
  const keys = (data.keys ?? [])
    .filter((k): k is { keyId: number | string; pem: string } => k.keyId !== undefined && typeof k.pem === "string")
    .map((k) => ({ keyId: k.keyId, pem: k.pem }));
  cachedKeys = { at: Date.now(), keys };
  return keys;
}

/** 쿼리의 key_id가 지금 받은 키에 없는지(키가 바뀐 직후 다시 받기용). */
export function ssvKeyId(rawQuery: string): string | null {
  const query = rawQuery.startsWith("?") ? rawQuery.slice(1) : rawQuery;
  const at = query.indexOf("&signature=");
  if (at <= 0) return null;
  return new URLSearchParams(query.slice(at + 1)).get("key_id");
}
