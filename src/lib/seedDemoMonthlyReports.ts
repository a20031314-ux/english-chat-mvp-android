import {
  loadSessionReports,
  persistSessionReports,
  type SessionReport,
} from "@/lib/sessionReports";

export const DEMO_MONTHLY_SEED_KEY = "sessionReportsDemoSeedV1";

function isDemoReport(report: SessionReport): boolean {
  return (
    report.sessionId.startsWith("demo-") ||
    report.id.startsWith("report-demo-")
  );
}

/**
 * Strip leftover chart/demo SessionReports.
 * Demo seeding used to run on first launch for monthly UI checks — never do that in production builds.
 */
export function purgeDemoMonthlyReports(): SessionReport[] {
  if (typeof window === "undefined") return [];
  const existing = loadSessionReports();
  const next = existing.filter((report) => !isDemoReport(report));
  if (next.length !== existing.length) {
    persistSessionReports(next);
  }
  try {
    // Prevent any older client that still calls the seed helper from re-injecting.
    window.localStorage.setItem(DEMO_MONTHLY_SEED_KEY, "1");
  } catch {
    // ignore
  }
  return loadSessionReports();
}

/** @deprecated Demo seeding is disabled; purges leftover demos instead. */
export function seedDemoMonthlyReports(): SessionReport[] {
  return purgeDemoMonthlyReports();
}

/** Remove demo reports and allow a future re-seed only if explicitly re-enabled in code. */
export function clearDemoMonthlyReports() {
  if (typeof window === "undefined") return;
  const next = loadSessionReports().filter((report) => !isDemoReport(report));
  persistSessionReports(next);
  try {
    window.localStorage.setItem(DEMO_MONTHLY_SEED_KEY, "1");
  } catch {
    // ignore
  }
}
