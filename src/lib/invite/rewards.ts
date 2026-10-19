/**
 * 친구 초대 보상(사용자 결정 2026-10-20). 앱·서버가 같이 쓰는 숫자와 규칙.
 *
 * - 초대받은 사람이 링크로 들어온 뒤 7일 안에 서로 다른 2일 앱을 쓰면 둘 다 포인트.
 * - 초기 혜택은 기간이 아니라 **횟수**로 끝난다: 전체 보상이 EARLY_LIMIT번 나갈 때까지 큰 숫자,
 *   그 뒤 작은 숫자(서버 환경 변수 INVITE_EARLY_LIMIT로 바꿀 수 있음).
 * - 초대한 사람은 한 달에 MONTHLY_CAP명까지만 포인트(초대받은 사람은 늘 받음).
 * - 단계 보상: 보상받은 친구가 3명이면 플러스 7일, 10명이면 프리미엄 30일(한 번씩).
 * 포인트는 산 포인트와 같은 자리에 들어가 사라지지 않는다(entitlementStore addPurchasedPoints).
 */

import type { PlanTier } from "../billing/plans.ts";

export const EARLY_LIMIT_DEFAULT = 1000;
export const REWARD_EARLY = { inviter: 20, invitee: 10 } as const;
export const REWARD_LATER = { inviter: 10, invitee: 5 } as const;
export const MONTHLY_CAP = 10;
export const ACTIVE_DAYS_NEEDED = 2;
export const ACTIVE_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;
/** 가입한 지 이만큼 안 된 계정만 "새로 온 사람"으로 본다(이미 쓰던 사람끼리 주고받기 막기). */
export const NEW_ACCOUNT_MS = 48 * 60 * 60 * 1000;

export type Milestone = { friends: number; tier: Exclude<PlanTier, "free" | "lite">; days: number };
export const MILESTONES: Milestone[] = [
  { friends: 3, tier: "plus", days: 7 },
  { friends: 10, tier: "premium", days: 30 },
];

export function rewardFor(rewardNumber: number, earlyLimit: number): { inviter: number; invitee: number; early: boolean } {
  const early = rewardNumber <= earlyLimit;
  return { ...(early ? REWARD_EARLY : REWARD_LATER), early };
}

/** 이번 보상으로 막 넘은 단계(없으면 null). */
export function milestoneReached(friendsBefore: number, friendsAfter: number): Milestone | null {
  return MILESTONES.find((row) => friendsBefore < row.friends && friendsAfter >= row.friends) ?? null;
}

export function nextMilestone(friends: number): Milestone | null {
  return MILESTONES.find((row) => friends < row.friends) ?? null;
}

/** 초대받은 사람의 기록: 누가 데려왔는지, 언제, 보상 대상인지, 쓴 날. */
export type JoinRecord = {
  inviter: string;
  at: number;
  eligible: boolean;
  days: string[];
  done?: "rewarded" | "expired";
};

/** 링크로 들어온 사람의 기록을 처음 만들 때. 가입한 지 얼마 안 된 계정만 보상 대상. */
export function newJoinRecord(inviter: string, accountCreatedAt: string | number | null, now: number): JoinRecord {
  const created = typeof accountCreatedAt === "number" ? accountCreatedAt : Date.parse(accountCreatedAt ?? "");
  const eligible = Number.isFinite(created) && now - created <= NEW_ACCOUNT_MS;
  return { inviter, at: now, eligible, days: [] };
}

/** 오늘 쓴 날을 더하고, 보상할 때가 됐는지. */
export function noteDay(record: JoinRecord, day: string, now: number): { record: JoinRecord; reward: boolean } {
  if (record.done || !record.eligible) return { record, reward: false };
  if (now - record.at > ACTIVE_WINDOW_MS) return { record: { ...record, done: "expired" }, reward: false };
  if (record.days.includes(day)) return { record, reward: false };
  const days = [...record.days, day];
  if (days.length >= ACTIVE_DAYS_NEEDED) return { record: { ...record, days, done: "rewarded" }, reward: true };
  return { record: { ...record, days }, reward: false };
}

/** 앱에 보여 줄 내 초대 현황(/api/invite status). */
export type InviteStatus = {
  friends: number;
  points: number;
  earlyLeft: number;
  reward: { inviter: number; invitee: number; early: boolean };
  pass: { tier: PlanTier; until: number } | null;
  /** 앱을 열 때 한 번 보여 줄 소식(보여 준 뒤 서버에서 지움). */
  news: InviteNews[];
};

export type InviteNews =
  | { kind: "inviter"; points: number; friend: string }
  | { kind: "invitee"; points: number }
  | { kind: "pass"; tier: PlanTier; days: number; friends: number };
