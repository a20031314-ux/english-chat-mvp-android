import {
  loadSessionReports,
  persistSessionReports,
  type SessionReport,
} from "@/lib/sessionReports";
import {
  REVIEW_PACK_KEY,
  REVIEW_QUEUE_KEY,
  persistReviewQueue,
  type ReviewQueue,
} from "@/lib/reviewMaterials";

export const DEMO_MONTHLY_SEED_KEY = "sessionReportsDemoSeedV1";

const CONVERSATION_SESSIONS_KEY = "conversationSessions";

function isSeedId(value: string | undefined): boolean {
  if (!value) return false;
  return /(?:^|-)(demo|verify)(?:-|$)/i.test(value);
}

function isSeedReport(report: SessionReport): boolean {
  return isSeedId(report.sessionId) || isSeedId(report.id);
}

function loadJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/**
 * Strip leftover chart/demo/verify SessionReports and matching local chats.
 */
export function purgeDemoMonthlyReports(): SessionReport[] {
  if (typeof window === "undefined") return [];

  const existing = loadSessionReports();
  const keptReports = existing
    .filter((report) => !isSeedReport(report))
    .map((report) => ({
      ...report,
      learningItems: (report.learningItems || []).filter(
        (item) => item.expression !== "I'd like to ~",
      ),
    }));
  const droppedReportIds = new Set(
    existing
      .filter((report) => isSeedReport(report))
      .map((report) => report.id),
  );
  if (JSON.stringify(keptReports) !== JSON.stringify(existing)) {
    persistSessionReports(keptReports);
  }

  const sessions = loadJson<Array<{ id?: string }>>(
    CONVERSATION_SESSIONS_KEY,
    [],
  );
  if (Array.isArray(sessions)) {
    const nextSessions = sessions.filter(
      (session) => !isSeedId(typeof session.id === "string" ? session.id : ""),
    );
    if (nextSessions.length !== sessions.length) {
      window.localStorage.setItem(
        CONVERSATION_SESSIONS_KEY,
        JSON.stringify(nextSessions),
      );
    }
  }

  const queue = loadJson<ReviewQueue>(REVIEW_QUEUE_KEY, { packs: [] });
  if (Array.isArray(queue.packs)) {
    const nextPacks = queue.packs.filter(
      (pack) =>
        !isSeedId(pack.reportId) && !droppedReportIds.has(pack.reportId),
    );
    if (nextPacks.length !== queue.packs.length) {
      persistReviewQueue({ packs: nextPacks });
    }
  }
  try {
    const legacyPack = window.localStorage.getItem(REVIEW_PACK_KEY);
    if (legacyPack && /demo|verify/i.test(legacyPack)) {
      window.localStorage.removeItem(REVIEW_PACK_KEY);
    }
  } catch {
    // ignore
  }

  try {
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
  purgeDemoMonthlyReports();
}
