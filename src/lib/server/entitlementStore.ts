type UsageRecord = {
  date: string;
  used: number;
  reportsUsed: number;
};

const globalUsageStore = globalThis as typeof globalThis & {
  __entitlementUsageByUser?: Map<string, UsageRecord>;
};

const usageByUser =
  globalUsageStore.__entitlementUsageByUser ??
  (globalUsageStore.__entitlementUsageByUser = new Map<string, UsageRecord>());

function getTodayKey() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

export function getTodayUsageKey() {
  return getTodayKey();
}

function getOrInitUsage(userId: string): UsageRecord {
  const today = getTodayKey();
  const current = usageByUser.get(userId);

  if (!current || current.date !== today) {
    const next: UsageRecord = { date: today, used: 0, reportsUsed: 0 };
    usageByUser.set(userId, next);
    return next;
  }

  if (typeof current.reportsUsed !== "number") {
    const next = { ...current, reportsUsed: 0 };
    usageByUser.set(userId, next);
    return next;
  }

  return current;
}

export function getDailyUsed(userId: string) {
  return getOrInitUsage(userId).used;
}

export function incrementDailyUsed(userId: string, amount = 1) {
  const current = getOrInitUsage(userId);
  const next = {
    ...current,
    used: Math.max(0, current.used + amount),
  };
  usageByUser.set(userId, next);
  return next.used;
}

export function getDailyReportsUsed(userId: string) {
  return getOrInitUsage(userId).reportsUsed;
}

export function incrementDailyReportsUsed(userId: string, amount = 1) {
  const current = getOrInitUsage(userId);
  const next = {
    ...current,
    reportsUsed: Math.max(0, current.reportsUsed + amount),
  };
  usageByUser.set(userId, next);
  return next.reportsUsed;
}

type VideoPrepRecord = {
  month: string;
  usedPoints: number;
  billedVideoIds: string[];
};

const globalVideoPrepStore = globalThis as typeof globalThis & {
  __videoPrepUsageByUser?: Map<string, VideoPrepRecord>;
};

const videoPrepByUser =
  globalVideoPrepStore.__videoPrepUsageByUser ??
  (globalVideoPrepStore.__videoPrepUsageByUser = new Map<
    string,
    VideoPrepRecord
  >());

const globalCatalogTrialStore = globalThis as typeof globalThis & {
  __catalogTrialByUser?: Map<string, string[]>;
};

const catalogTrialByUser =
  globalCatalogTrialStore.__catalogTrialByUser ??
  (globalCatalogTrialStore.__catalogTrialByUser = new Map<string, string[]>());

function monthKey() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${now.getFullYear()}-${month}`;
}

function getOrInitVideoPrep(userId: string): VideoPrepRecord {
  const month = monthKey();
  const current = videoPrepByUser.get(userId);
  if (!current || current.month !== month) {
    const next: VideoPrepRecord = {
      month,
      usedPoints: 0,
      billedVideoIds: [],
    };
    videoPrepByUser.set(userId, next);
    return next;
  }
  if (!Array.isArray(current.billedVideoIds)) {
    const next = { ...current, billedVideoIds: [] as string[] };
    videoPrepByUser.set(userId, next);
    return next;
  }
  return current;
}

export function getMonthlyImportPointsUsed(userId: string) {
  return getOrInitVideoPrep(userId).usedPoints;
}

export function getBilledImportVideoIds(userId: string) {
  return getOrInitVideoPrep(userId).billedVideoIds;
}

export function addMonthlyImportPoints(
  userId: string,
  points: number,
  videoId?: string,
) {
  const billed = Math.max(0, Math.ceil(points));
  const current = getOrInitVideoPrep(userId);
  const billedVideoIds =
    videoId && !current.billedVideoIds.includes(videoId)
      ? [...current.billedVideoIds, videoId]
      : current.billedVideoIds;
  const next = {
    ...current,
    usedPoints: current.usedPoints + billed,
    billedVideoIds,
  };
  videoPrepByUser.set(userId, next);
  return next.usedPoints;
}

/** @deprecated Seconds view of import points. */
export function getMonthlyVideoPrepUsed(userId: string) {
  return getMonthlyImportPointsUsed(userId) * 180;
}

/** @deprecated */
export function addMonthlyVideoPrepUsed(userId: string, seconds: number) {
  return addMonthlyImportPoints(userId, Math.ceil(seconds / 180));
}

export function getCatalogTrialVideoIds(userId: string) {
  return catalogTrialByUser.get(userId) ?? [];
}

export function addCatalogTrialVideo(userId: string, videoId: string) {
  const current = getCatalogTrialVideoIds(userId);
  if (current.includes(videoId)) return current;
  const next = [...current, videoId];
  catalogTrialByUser.set(userId, next);
  return next;
}

