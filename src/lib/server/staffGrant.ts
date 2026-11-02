/**
 * 운영자·점검 계정에 주는 프리미엄(2026-11-02 사용자 "점검용 앱을 프리미엄버전으로 쓰게해줘").
 *
 * Vercel `STAFF_PREMIUM` = 쉼표로 이은 계정 id(`lb_…`)나 로그인 이메일. 저장소가 공개라 목록은 코드에 두지 않는다.
 * 로그인한 요청만 — 계정 id로 묶이니 헤더를 꾸며서는 못 얻는다. RevenueCat 밖에서 여는 요금이라
 * 산 요금과 높은 쪽(premiumRequest.ts). 값이 없으면 아무에게도 안 준다.
 */
import { readAccount } from "./accountStore.ts";

const CACHE_MS = 10 * 60 * 1000;
const cache = new Map<string, { staff: boolean; at: number }>();

export function staffList(raw: string | undefined = process.env.STAFF_PREMIUM): { ids: Set<string>; emails: Set<string> } {
  const ids = new Set<string>();
  const emails = new Set<string>();
  for (const one of (raw ?? "").split(",").map((part) => part.trim().toLowerCase()).filter(Boolean)) {
    if (one.includes("@")) emails.add(one);
    else ids.add(one);
  }
  return { ids, emails };
}

export async function isStaffAccount(accountId: string | null, raw?: string, now: number = Date.now()): Promise<boolean> {
  if (!accountId) return false;
  const { ids, emails } = staffList(raw);
  if (ids.has(accountId.toLowerCase())) return true;
  if (!emails.size) return false;
  const hit = cache.get(accountId);
  if (hit && now - hit.at < CACHE_MS) return hit.staff;
  const email = (await readAccount(accountId).catch(() => null))?.email?.trim().toLowerCase() ?? null;
  const staff = Boolean(email && emails.has(email));
  cache.set(accountId, { staff, at: now });
  return staff;
}
