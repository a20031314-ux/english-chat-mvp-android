import { kvDelete, kvGetJson, kvGetNumber, kvIncrBy, kvListPush, kvListRange, kvSetJson, kvSetJsonIfAbsent } from "./kv.ts";
import { readAccount } from "./accountStore.ts";
import { addPurchasedPoints } from "./entitlementStore.ts";
import { localDay, type PlanTier } from "../billing/plans.ts";
import {
  EARLY_LIMIT_DEFAULT,
  MONTHLY_CAP,
  milestoneReached,
  noteDay,
  rewardFor,
  type InviteNews,
  type InviteStatus,
  type JoinRecord,
} from "../invite/rewards.ts";

/**
 * 친구 초대 보상 저장소(규칙은 invite/rewards.ts).
 *
 *   invite:v1:joined:<초대받은 계정>   JoinRecord(옛 기록은 초대한 계정 id 글자 하나) — inviteLinkStore가 처음 만든다
 *   invite:v1:rewarded                전체 보상 번호(초기 혜택이 몇 번 남았는지)
 *   invite:v1:friends:<계정>          보상받은 친구 수(단계 보상)
 *   invite:v1:points:<계정>           초대로 받은 포인트 합
 *   invite:v1:month:<계정>:<YYYY-MM>  이번 달 초대 포인트를 받은 횟수(MONTHLY_CAP)
 *   invite:v1:pass:<계정>             단계 보상으로 열린 요금 { tier, until }
 *   invite:v1:news:<계정>             앱을 열 때 보여 줄 소식(보여 주면 지움)
 *   invite:v1:paid:<초대받은 계정>      같은 사람으로 두 번 주지 않게(SET NX)
 * 포인트는 계정의 기록 id(dataUserId)에 산 포인트로 들어간다. 계정을 지우면 inviteLinkStore.forgetInvites가 같이 지운다.
 */

const TTL = 400 * 24 * 60 * 60;
const joinedKey = (id: string) => `invite:v1:joined:${id}`;
const REWARDED_KEY = "invite:v1:rewarded";
const friendsKey = (id: string) => `invite:v1:friends:${id}`;
const pointsKey = (id: string) => `invite:v1:points:${id}`;
const monthKey = (id: string, month: string) => `invite:v1:month:${id}:${month}`;
const passKey = (id: string) => `invite:v1:pass:${id}`;
const newsKey = (id: string) => `invite:v1:news:${id}`;
const paidKey = (id: string) => `invite:v1:paid:${id}`;

export function earlyLimit(): number {
  const raw = Number(process.env.INVITE_EARLY_LIMIT);
  return Number.isFinite(raw) && raw >= 0 ? Math.floor(raw) : EARLY_LIMIT_DEFAULT;
}

async function readJoin(invitee: string): Promise<JoinRecord | null> {
  const raw = await kvGetJson<JoinRecord | string>(joinedKey(invitee));
  if (!raw) return null;
  // 보상 전 옛 기록(초대한 사람 id만): 보상 대상 아님.
  if (typeof raw === "string") return { inviter: raw, at: 0, eligible: false, days: [], done: "expired" };
  return raw;
}

async function pushNews(account: string, news: InviteNews): Promise<void> {
  await kvListPush(newsKey(account), [JSON.stringify(news)], 60 * 24 * 60 * 60);
}

/** 단계 보상: 같은 요금이 이미 열려 있으면 그 끝에서 늘린다. */
async function grantPass(account: string, tier: PlanTier, days: number, now: number): Promise<void> {
  const current = await kvGetJson<{ tier: PlanTier; until: number }>(passKey(account));
  const start = current && current.until > now && current.tier === tier ? current.until : now;
  const until = start + days * 24 * 60 * 60 * 1000;
  // 더 높은 요금이 남아 있으면 그건 두고 새 것이 끝난 뒤로 미루지 않는다 — 높은 쪽을 그대로 둔다.
  if (current && current.until > now && current.tier === "premium" && tier !== "premium") return;
  await kvSetJson(passKey(account), { tier, until }, TTL);
}

/**
 * 초대받은 사람이 앱을 썼다(로그인한 채 앱을 열 때 /api/account/me, 초대를 받아들일 때).
 * 7일 안에 서로 다른 2일이 되면 둘 다 보상. 아무 일도 없으면 null.
 */
export async function noteInviteeActive(invitee: string, now: number = Date.now()): Promise<{ inviterPoints: number; inviteePoints: number } | null> {
  const record = await readJoin(invitee);
  if (!record || record.done || !record.eligible) return null;
  const { record: next, reward } = noteDay(record, localDay(now, null), now);
  if (next !== record) await kvSetJson(joinedKey(invitee), next, TTL);
  if (!reward) return null;
  if (!(await kvSetJsonIfAbsent(paidKey(invitee), now, TTL))) return null;

  const number = await kvIncrBy(REWARDED_KEY, 1);
  const amount = rewardFor(number, earlyLimit());
  const [inviterAccount, inviteeAccount] = await Promise.all([readAccount(record.inviter), readAccount(invitee)]);

  let inviteePoints = 0;
  if (inviteeAccount) {
    inviteePoints = amount.invitee;
    await addPurchasedPoints(inviteeAccount.dataUserId, inviteePoints);
    await pushNews(invitee, { kind: "invitee", points: inviteePoints });
  }

  let inviterPoints = 0;
  if (inviterAccount) {
    const month = new Date(now).toISOString().slice(0, 7);
    const thisMonth = await kvIncrBy(monthKey(record.inviter, month), 1, 40 * 24 * 60 * 60);
    if (thisMonth <= MONTHLY_CAP) {
      inviterPoints = amount.inviter;
      await addPurchasedPoints(inviterAccount.dataUserId, inviterPoints);
      await kvIncrBy(pointsKey(record.inviter), inviterPoints);
    }
    const friends = await kvIncrBy(friendsKey(record.inviter), 1);
    await pushNews(record.inviter, {
      kind: "inviter",
      points: inviterPoints,
      friend: inviteeAccount?.profile.nickname || inviteeAccount?.username || "",
    });
    const milestone = milestoneReached(friends - 1, friends);
    if (milestone) {
      await grantPass(record.inviter, milestone.tier, milestone.days, now);
      await pushNews(record.inviter, { kind: "pass", tier: milestone.tier, days: milestone.days, friends: milestone.friends });
    }
  }
  return { inviterPoints, inviteePoints };
}

/** 지금 들어오면 받을 숫자(초대 페이지·환영 시트에 보여 줌). */
export async function currentReward(): Promise<{ inviter: number; invitee: number; early: boolean }> {
  return rewardFor((await kvGetNumber(REWARDED_KEY)) + 1, earlyLimit());
}

/** 단계 보상으로 지금 열려 있는 요금(없으면 null). 서버의 요금 판단과 앱 화면이 같이 쓴다. */
export async function readInvitePass(account: string, now: number = Date.now()): Promise<{ tier: PlanTier; until: number } | null> {
  const pass = await kvGetJson<{ tier: PlanTier; until: number }>(passKey(account));
  return pass && pass.until > now ? pass : null;
}

/** 내 초대 현황. takeNews면 소식을 한 번 보여 주고 지운다. */
export async function readInviteStatus(account: string, takeNews: boolean): Promise<InviteStatus> {
  const [friends, points, rewarded, pass, rows] = await Promise.all([
    kvGetNumber(friendsKey(account)),
    kvGetNumber(pointsKey(account)),
    kvGetNumber(REWARDED_KEY),
    readInvitePass(account),
    kvListRange(newsKey(account)),
  ]);
  if (takeNews && rows.length) await kvDelete([newsKey(account)]);
  const news: InviteNews[] = [];
  for (const row of rows) {
    try {
      news.push(JSON.parse(row) as InviteNews);
    } catch {
      // 깨진 줄은 건너뛴다.
    }
  }
  const limit = earlyLimit();
  return {
    friends,
    points,
    earlyLeft: Math.max(0, limit - rewarded),
    reward: rewardFor(rewarded + 1, limit),
    pass,
    news: takeNews ? news : [],
  };
}

