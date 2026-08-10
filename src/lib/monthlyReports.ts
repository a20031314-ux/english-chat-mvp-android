import type { Locale } from "@/lib/copy";
import type { SessionReport } from "@/lib/sessionReports";

export type YearMonth = {
  year: number;
  month: number; // 1–12
};

export type ScoredReportPoint = {
  report: SessionReport;
  score: number;
  endedAt: number;
};

export type MonthlyScoreChange = {
  firstScore: number;
  lastScore: number;
  delta: number;
};

export type MonthlyLearningStats = {
  sessionCount: number;
  scoredSessionCount: number;
  totalMessageCount: number;
  learningDayCount: number;
  currentScore: number | null;
  scoreChange: MonthlyScoreChange | null;
};

function startOfMonth(year: number, month: number) {
  return new Date(year, month - 1, 1, 0, 0, 0, 0).getTime();
}

function endOfMonth(year: number, month: number) {
  return new Date(year, month, 0, 23, 59, 59, 999).getTime();
}

export function getCurrentYearMonth(now = new Date()): YearMonth {
  return { year: now.getFullYear(), month: now.getMonth() + 1 };
}

export function shiftYearMonth(ym: YearMonth, delta: number): YearMonth {
  const d = new Date(ym.year, ym.month - 1 + delta, 1);
  return { year: d.getFullYear(), month: d.getMonth() + 1 };
}

export function compareYearMonth(a: YearMonth, b: YearMonth) {
  if (a.year !== b.year) return a.year - b.year;
  return a.month - b.month;
}

export function isFutureYearMonth(ym: YearMonth, now = new Date()) {
  return compareYearMonth(ym, getCurrentYearMonth(now)) > 0;
}

export function canGoNextMonth(ym: YearMonth, now = new Date()) {
  return !isFutureYearMonth(shiftYearMonth(ym, 1), now);
}

const YEAR_MONTH_TAGS: Partial<Record<Locale, string>> = {
  ko: "ko-KR",
  en: "en-US",
  es: "es-ES",
  ja: "ja-JP",
  zh: "zh-CN",
  vi: "vi-VN",
  fr: "fr-FR",
  pt: "pt-BR",
  id: "id-ID",
};

export function formatYearMonthLabel(ym: YearMonth, locale: Locale): string {
  if (locale === "ko") {
    return `${ym.year}년 ${ym.month}월`;
  }
  if (locale === "ja") {
    return `${ym.year}年${ym.month}月`;
  }
  if (locale === "zh") {
    return `${ym.year}年${ym.month}月`;
  }
  const tag = YEAR_MONTH_TAGS[locale] ?? "en-US";
  const name = new Date(ym.year, ym.month - 1, 1).toLocaleString(tag, {
    month: "long",
  });
  return `${name} ${ym.year}`;
}

/** Session reports that ended within the given calendar month. */
export function getReportsByMonth(
  reports: SessionReport[],
  year: number,
  month: number,
): SessionReport[] {
  const from = startOfMonth(year, month);
  const to = endOfMonth(year, month);
  return reports
    .filter((r) => r.endedAt >= from && r.endedAt <= to)
    .sort((a, b) => b.endedAt - a.endedAt);
}

/**
 * Reports with a usable score, chronological (oldest → newest).
 * Each session remains its own point — no daily averaging.
 */
export function getValidScoredReports(
  reports: SessionReport[],
): ScoredReportPoint[] {
  return reports
    .filter(
      (r): r is SessionReport & { score: number } =>
        typeof r.score === "number" && !Number.isNaN(r.score),
    )
    .map((r) => ({
      report: r,
      score: r.score,
      endedAt: r.endedAt,
    }))
    .sort((a, b) => a.endedAt - b.endedAt);
}

/** Latest valid session score (current ability proxy). */
export function getLatestScore(reports: SessionReport[]): number | null {
  const scored = getValidScoredReports(reports);
  if (scored.length === 0) return null;
  return scored[scored.length - 1].score;
}

/**
 * Month change = last valid score − first valid score in the month.
 * Needs at least two scored sessions.
 */
export function getMonthlyScoreChange(
  reports: SessionReport[],
): MonthlyScoreChange | null {
  const scored = getValidScoredReports(reports);
  if (scored.length < 2) return null;
  const firstScore = scored[0].score;
  const lastScore = scored[scored.length - 1].score;
  return {
    firstScore,
    lastScore,
    delta: lastScore - firstScore,
  };
}

export function getMonthlyLearningStats(
  reports: SessionReport[],
): MonthlyLearningStats {
  const scored = getValidScoredReports(reports);
  const days = new Set(
    reports.map((r) => {
      const d = new Date(r.endedAt);
      return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    }),
  );

  return {
    sessionCount: reports.length,
    scoredSessionCount: scored.length,
    totalMessageCount: reports.reduce((sum, r) => sum + (r.messageCount || 0), 0),
    learningDayCount: days.size,
    currentScore: getLatestScore(reports),
    scoreChange: getMonthlyScoreChange(reports),
  };
}

/** Earliest month that has any session report, or current month if empty. */
export function getEarliestYearMonth(
  reports: SessionReport[],
  fallback = getCurrentYearMonth(),
): YearMonth {
  if (reports.length === 0) return fallback;
  let min = reports[0].endedAt;
  for (const r of reports) {
    if (r.endedAt < min) min = r.endedAt;
  }
  const d = new Date(min);
  return { year: d.getFullYear(), month: d.getMonth() + 1 };
}

export function formatDelta(delta: number): string {
  if (delta > 0) return `+${delta}`;
  return String(delta);
}

/** Local calendar day key: `YYYY-M-D` (month 0-based in key for uniqueness). */
export function dayKeyFromTimestamp(ts: number): string {
  const d = new Date(ts);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

export function dayKeyFromParts(year: number, month: number, day: number): string {
  return `${year}-${month - 1}-${day}`;
}

/** Group reports by local calendar day (newest first within each day). */
export function groupReportsByDay(
  reports: SessionReport[],
): Map<string, SessionReport[]> {
  const map = new Map<string, SessionReport[]>();
  const sorted = [...reports].sort((a, b) => b.endedAt - a.endedAt);
  for (const report of sorted) {
    const key = dayKeyFromTimestamp(report.endedAt);
    const list = map.get(key);
    if (list) list.push(report);
    else map.set(key, [report]);
  }
  return map;
}

export function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

/** 0 = Sunday … 6 = Saturday for the 1st of the month. */
export function firstWeekdayOfMonth(year: number, month: number): number {
  return new Date(year, month - 1, 1).getDay();
}
