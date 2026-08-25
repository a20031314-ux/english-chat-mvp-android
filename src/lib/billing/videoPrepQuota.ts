import {
  CATALOG_TRIAL_STORAGE_KEY,
  VIDEO_IMPORT_POINT_SECONDS,
  VIDEO_IMPORT_USAGE_STORAGE_KEY,
  VIDEO_PREP_SECONDS_STORAGE_KEY,
} from "@/lib/billing/config";

function monthKey() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${now.getFullYear()}-${month}`;
}

type MonthlyImportUsage = {
  month: string;
  usedPoints: number;
  billedVideoIds: string[];
};

function migrateLegacySeconds(): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = window.localStorage.getItem(VIDEO_PREP_SECONDS_STORAGE_KEY);
    if (!raw) return 0;
    const parsed = JSON.parse(raw) as { month?: string; usedSeconds?: number };
    if (parsed.month !== monthKey()) return 0;
    const seconds =
      typeof parsed.usedSeconds === "number" && Number.isFinite(parsed.usedSeconds)
        ? Math.max(0, parsed.usedSeconds)
        : 0;
    return Math.ceil(seconds / VIDEO_IMPORT_POINT_SECONDS);
  } catch {
    return 0;
  }
}

function readUsage(): MonthlyImportUsage {
  const month = monthKey();
  if (typeof window === "undefined") {
    return { month, usedPoints: 0, billedVideoIds: [] };
  }
  try {
    const raw = window.localStorage.getItem(VIDEO_IMPORT_USAGE_STORAGE_KEY);
    if (!raw) {
      const migrated = migrateLegacySeconds();
      return { month, usedPoints: migrated, billedVideoIds: [] };
    }
    const parsed = JSON.parse(raw) as Partial<MonthlyImportUsage>;
    const storedMonth = typeof parsed.month === "string" ? parsed.month : month;
    if (storedMonth !== month) {
      return { month, usedPoints: 0, billedVideoIds: [] };
    }
    const usedPoints =
      typeof parsed.usedPoints === "number" && Number.isFinite(parsed.usedPoints)
        ? Math.max(0, Math.floor(parsed.usedPoints))
        : 0;
    const billedVideoIds = Array.isArray(parsed.billedVideoIds)
      ? parsed.billedVideoIds.filter((id): id is string => typeof id === "string")
      : [];
    return { month: storedMonth, usedPoints, billedVideoIds };
  } catch {
    return { month, usedPoints: 0, billedVideoIds: [] };
  }
}

function writeUsage(usage: MonthlyImportUsage) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      VIDEO_IMPORT_USAGE_STORAGE_KEY,
      JSON.stringify(usage),
    );
  } catch {
    // ignore quota / private mode
  }
}

export function getImportPointsUsed() {
  return readUsage().usedPoints;
}

export function getBilledImportVideoIds() {
  return readUsage().billedVideoIds;
}

export function recordImportCharge(videoId: string, points: number) {
  const billed = Math.max(0, Math.ceil(points));
  const current = readUsage();
  if (billed <= 0) {
    if (!current.billedVideoIds.includes(videoId)) {
      writeUsage({
        ...current,
        billedVideoIds: [...current.billedVideoIds, videoId],
      });
    }
    return current.usedPoints;
  }
  const billedVideoIds = current.billedVideoIds.includes(videoId)
    ? current.billedVideoIds
    : [...current.billedVideoIds, videoId];
  const next = {
    month: current.month,
    usedPoints: current.usedPoints + billed,
    billedVideoIds,
  };
  writeUsage(next);
  return next.usedPoints;
}

export function getCatalogTrialVideoIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CATALOG_TRIAL_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as { videoIds?: unknown };
    return Array.isArray(parsed.videoIds)
      ? parsed.videoIds.filter((id): id is string => typeof id === "string")
      : [];
  } catch {
    return [];
  }
}

export function recordCatalogTrial(videoId: string) {
  const current = getCatalogTrialVideoIds();
  if (current.includes(videoId)) return current;
  const next = [...current, videoId];
  if (typeof window === "undefined") return next;
  try {
    window.localStorage.setItem(
      CATALOG_TRIAL_STORAGE_KEY,
      JSON.stringify({ videoIds: next }),
    );
  } catch {
    // ignore
  }
  return next;
}

/** @deprecated Use getImportPointsUsed. */
export function getVideoPrepUsedSeconds() {
  return getImportPointsUsed() * VIDEO_IMPORT_POINT_SECONDS;
}

/** @deprecated Use recordImportCharge. */
export function recordVideoPrepSeconds(seconds: number) {
  return recordImportCharge("", Math.ceil(seconds / VIDEO_IMPORT_POINT_SECONDS));
}
