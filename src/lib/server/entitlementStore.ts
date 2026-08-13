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
