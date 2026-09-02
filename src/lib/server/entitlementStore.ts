/**
 * Usage counters that survive the request that wrote them.
 *
 * These used to be maps in module scope. That reads as a store and is not one:
 * serverless instances do not share memory and are recycled constantly, so the
 * free daily chat limit, the monthly import points and the catalog trial count
 * all silently reset. They are keyed rows in KV now — see kv.ts, which also
 * explains what happens when no KV credentials are configured.
 *
 * Every key names its own window, so nothing has to be reset on a rollover: the
 * old key simply stops being read and expires on its own.
 */

import { kvGetJson, kvGetNumber, kvIncrBy, kvSetJson } from "./kv.ts";

/** Long enough that a day's counter outlives the day in every timezone. */
const DAILY_TTL_SECONDS = 3 * 24 * 60 * 60;
/** Same idea for a month, with room for a late-arriving write. */
const MONTHLY_TTL_SECONDS = 70 * 24 * 60 * 60;

function dayKey() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

function monthKey() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${now.getFullYear()}-${month}`;
}

function dailyChatKey(userId: string) {
  return `usage:chat:${userId}:${dayKey()}`;
}

function videoPrepKey(userId: string) {
  return `usage:video:${userId}:${monthKey()}`;
}

function catalogTrialKey(userId: string) {
  return `usage:trial:${userId}`;
}

export async function getDailyUsed(userId: string): Promise<number> {
  return kvGetNumber(dailyChatKey(userId));
}

export async function incrementDailyUsed(
  userId: string,
  amount = 1,
): Promise<number> {
  return kvIncrBy(dailyChatKey(userId), amount, DAILY_TTL_SECONDS);
}

type VideoPrepRecord = {
  usedPoints: number;
  billedVideoIds: string[];
};

const EMPTY_VIDEO_PREP: VideoPrepRecord = {
  usedPoints: 0,
  billedVideoIds: [],
};

async function readVideoPrep(userId: string): Promise<VideoPrepRecord> {
  const stored = await kvGetJson<Partial<VideoPrepRecord>>(
    videoPrepKey(userId),
  );
  if (!stored) return EMPTY_VIDEO_PREP;
  return {
    usedPoints:
      typeof stored.usedPoints === "number" && stored.usedPoints > 0
        ? stored.usedPoints
        : 0,
    billedVideoIds: Array.isArray(stored.billedVideoIds)
      ? stored.billedVideoIds.filter(
          (id): id is string => typeof id === "string",
        )
      : [],
  };
}

export async function getMonthlyImportPointsUsed(
  userId: string,
): Promise<number> {
  return (await readVideoPrep(userId)).usedPoints;
}

export async function getBilledImportVideoIds(
  userId: string,
): Promise<string[]> {
  return (await readVideoPrep(userId)).billedVideoIds;
}

export async function addMonthlyImportPoints(
  userId: string,
  points: number,
  videoId?: string,
): Promise<number> {
  const billed = Math.max(0, Math.ceil(points));
  const current = await readVideoPrep(userId);
  const next: VideoPrepRecord = {
    usedPoints: current.usedPoints + billed,
    billedVideoIds:
      videoId && !current.billedVideoIds.includes(videoId)
        ? [...current.billedVideoIds, videoId]
        : current.billedVideoIds,
  };
  await kvSetJson(videoPrepKey(userId), next, MONTHLY_TTL_SECONDS);
  return next.usedPoints;
}

/** @deprecated Seconds view of import points, kept for the entitlement route. */
export async function getMonthlyVideoPrepUsed(
  userId: string,
): Promise<number> {
  return (await getMonthlyImportPointsUsed(userId)) * 180;
}

/** Lifetime, not monthly — so this key deliberately carries no expiry. */
export async function getCatalogTrialVideoIds(
  userId: string,
): Promise<string[]> {
  const stored = await kvGetJson<unknown>(catalogTrialKey(userId));
  if (!Array.isArray(stored)) return [];
  return stored.filter((id): id is string => typeof id === "string");
}

export async function addCatalogTrialVideo(
  userId: string,
  videoId: string,
): Promise<string[]> {
  const current = await getCatalogTrialVideoIds(userId);
  if (current.includes(videoId)) return current;
  const next = [...current, videoId];
  await kvSetJson(catalogTrialKey(userId), next);
  return next;
}
