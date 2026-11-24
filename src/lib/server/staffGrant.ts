/**
 * 운영자·점검 계정에 주는 프리미엄(2026-11-02 사용자 "점검용 앱을 프리미엄버전으로 쓰게해줘").
 *
 * Vercel `STAFF_PREMIUM` = 쉼표로 이은 계정 id(`lb_…`)·로그인 이메일·로그인 아이디. 저장소가 공개라 목록은 코드에 두지 않는다.
 * 아이디는 시험 앱(디버그 서명)에서 Google 로그인이 안 되고 계정 id는 화면에 없어서 받는다(2026-11-25) — 아이디는 계정마다 하나라 계정 id와 같다.
 * 로그인한 요청만 — 계정 id로 묶이니 헤더를 꾸며서는 못 얻는다. RevenueCat 밖에서 여는 요금이라
 * 산 요금과 높은 쪽(premiumRequest.ts). 값이 없으면 아무에게도 안 준다.
 */
import { readAccount } from "./accountStore.ts";

const CACHE_MS = 10 * 60 * 1000;
const cache = new Map<string, { staff: boolean; at: number }>();

export function staffList(raw: string | undefined = process.env.STAFF_PREMIUM): { ids: Set<string>; emails: Set<string>; usernames: Set<string> } {
  const ids = new Set<string>();
  const emails = new Set<string>();
  const usernames = new Set<string>();
  for (const one of (raw ?? "").split(",").map((part) => part.trim().toLowerCase()).filter(Boolean)) {
    if (one.includes("@")) emails.add(one);
    else if (/^lb_[0-9a-f]{24}$/.test(one)) ids.add(one);
    else usernames.add(one);
  }
  return { ids, emails, usernames };
}

type AccountLookup = (accountId: string) => Promise<{ email?: string | null; username?: string | null } | null>;

export async function isStaffAccount(
  accountId: string | null,
  raw?: string,
  now: number = Date.now(),
  lookup: AccountLookup = readAccount,
): Promise<boolean> {
  if (!accountId) return false;
  const { ids, emails, usernames } = staffList(raw);
  if (ids.has(accountId.toLowerCase())) return true;
  if (!emails.size && !usernames.size) return false;
  const hit = cache.get(accountId);
  if (hit && now - hit.at < CACHE_MS) return hit.staff;
  const record = await lookup(accountId).catch(() => null);
  const email = record?.email?.trim().toLowerCase() ?? null;
  const username = record?.username?.trim().toLowerCase() ?? null;
  const staff = Boolean((email && emails.has(email)) || (username && usernames.has(username)));
  cache.set(accountId, { staff, at: now });
  return staff;
}
