import {
  FREE_DAILY_REPORT_LIMIT,
  FREE_DAILY_REPORTS_STORAGE_KEY,
} from "@/lib/billing/config";

function todayKey() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

type DailyReportUsage = {
  date: string;
  used: number;
};

function readUsage(): DailyReportUsage {
  if (typeof window === "undefined") {
    return { date: todayKey(), used: 0 };
  }
  try {
    const raw = window.localStorage.getItem(FREE_DAILY_REPORTS_STORAGE_KEY);
    if (!raw) return { date: todayKey(), used: 0 };
    const parsed = JSON.parse(raw) as Partial<DailyReportUsage>;
    const date = typeof parsed.date === "string" ? parsed.date : todayKey();
    const used =
      typeof parsed.used === "number" && Number.isFinite(parsed.used)
        ? Math.max(0, Math.floor(parsed.used))
        : 0;
    if (date !== todayKey()) {
      return { date: todayKey(), used: 0 };
    }
    return { date, used };
  } catch {
    return { date: todayKey(), used: 0 };
  }
}

function writeUsage(usage: DailyReportUsage) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      FREE_DAILY_REPORTS_STORAGE_KEY,
      JSON.stringify(usage),
    );
  } catch {
    // ignore
  }
}

export function getFreeReportsUsedToday() {
  return readUsage().used;
}

export function canCreateFreeReport() {
  return getFreeReportsUsedToday() < FREE_DAILY_REPORT_LIMIT;
}

export function recordFreeReportCreated() {
  const current = readUsage();
  writeUsage({
    date: todayKey(),
    used: current.used + 1,
  });
}
