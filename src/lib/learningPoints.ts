import type { ChatMessage, ConversationSession } from "@/components/ArchivePanel";
import { loadLearningCards } from "@/lib/learningCards";
import { loadSessionReports, type SessionReport } from "@/lib/sessionReports";

export const LEARNING_POINTS_KEY = "learningPoints";
const CONVERSATION_SESSIONS_KEY = "conversationSessions";

export type LearningPointType = "grammar" | "vocabulary" | "expression";
export type LearningPointStatus =
  | "new"
  | "learning"
  | "reviewing"
  | "mastered";

export type LearningPoint = {
  id: string;
  type: LearningPointType;
  concept: string;
  originalSentence: string;
  correctedSentence: string;
  explanation: string;
  sourceSessionId: string | null;
  sourceReportId: string | null;
  sourceMessageId: string | null;
  createdAt: number;
  reviewCount: number;
  correctCount: number;
  incorrectCount: number;
  lastReviewedAt: number | null;
  nextReviewAt: number;
  status: LearningPointStatus;
};

function startOfLocalDay(ts = Date.now()) {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

function fingerprint(original: string, corrected: string) {
  const a = original.replace(/\s+/g, " ").trim().toLowerCase();
  const b = corrected.replace(/\s+/g, " ").trim().toLowerCase();
  return `${a}::${b}`;
}

function inferType(
  original: string,
  corrected: string,
  explanation: string,
): LearningPointType {
  const blob = `${original} ${corrected} ${explanation}`.toLowerCase();
  if (
    /\b(tense|grammar|if |conditional|article|preposition|subject.?verb|plural|singular|문법|시제|전치사|관사)\b/.test(
      blob,
    )
  ) {
    return "grammar";
  }
  const oWords: string[] = original.toLowerCase().match(/[a-z']+/g) ?? [];
  const cWords: string[] = corrected.toLowerCase().match(/[a-z']+/g) ?? [];
  const changed =
    oWords.filter((w) => !cWords.includes(w)).length +
    cWords.filter((w) => !oWords.includes(w)).length;
  if (changed <= 2) return "vocabulary";
  return "expression";
}

function inferConcept(
  original: string,
  corrected: string,
  explanation: string,
): string {
  const short = explanation.replace(/\s+/g, " ").trim();
  if (short) {
    return short.length > 72 ? `${short.slice(0, 69)}…` : short;
  }
  return `${original.trim()} → ${corrected.trim()}`.slice(0, 72);
}

function normalizePoint(raw: unknown): LearningPoint | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  if (typeof o.id !== "string" || !o.id) return null;
  if (typeof o.originalSentence !== "string") return null;
  if (typeof o.correctedSentence !== "string") return null;
  const type: LearningPointType =
    o.type === "grammar" || o.type === "vocabulary" || o.type === "expression"
      ? o.type
      : "grammar";
  const status: LearningPointStatus =
    o.status === "learning" ||
    o.status === "reviewing" ||
    o.status === "mastered" ||
    o.status === "new"
      ? o.status
      : "new";
  return {
    id: o.id,
    type,
    concept:
      typeof o.concept === "string" && o.concept.trim()
        ? o.concept.trim()
        : inferConcept(
            o.originalSentence,
            o.correctedSentence,
            typeof o.explanation === "string" ? o.explanation : "",
          ),
    originalSentence: o.originalSentence,
    correctedSentence: o.correctedSentence,
    explanation: typeof o.explanation === "string" ? o.explanation : "",
    sourceSessionId:
      typeof o.sourceSessionId === "string" ? o.sourceSessionId : null,
    sourceReportId:
      typeof o.sourceReportId === "string" ? o.sourceReportId : null,
    sourceMessageId:
      typeof o.sourceMessageId === "string" ? o.sourceMessageId : null,
    createdAt: typeof o.createdAt === "number" ? o.createdAt : Date.now(),
    reviewCount:
      typeof o.reviewCount === "number" ? Math.max(0, o.reviewCount) : 0,
    correctCount:
      typeof o.correctCount === "number" ? Math.max(0, o.correctCount) : 0,
    incorrectCount:
      typeof o.incorrectCount === "number" ? Math.max(0, o.incorrectCount) : 0,
    lastReviewedAt:
      typeof o.lastReviewedAt === "number" ? o.lastReviewedAt : null,
    nextReviewAt:
      typeof o.nextReviewAt === "number"
        ? o.nextReviewAt
        : startOfLocalDay(),
    status,
  };
}

export function loadLearningPoints(): LearningPoint[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = JSON.parse(localStorage.getItem(LEARNING_POINTS_KEY) || "[]");
    if (!Array.isArray(raw)) return [];
    return raw
      .map(normalizePoint)
      .filter((p): p is LearningPoint => p !== null);
  } catch {
    return [];
  }
}

export function persistLearningPoints(points: LearningPoint[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LEARNING_POINTS_KEY, JSON.stringify(points));
}

type ErrorExtract = {
  original: string;
  corrected: string;
  explanation: string;
  sourceSessionId: string | null;
  sourceReportId: string | null;
  sourceMessageId: string | null;
  createdAt: number;
};

function extractFromMessages(
  messages: ChatMessage[],
  meta: {
    sessionId: string | null;
    reportId: string | null;
    createdAt: number;
  },
): ErrorExtract[] {
  const out: ErrorExtract[] = [];
  let pending: ChatMessage | null = null;

  for (const message of messages) {
    if (message.role === "user") {
      pending = message;
      continue;
    }
    if (!pending || message.role !== "assistant") {
      if (message.role === "helper") pending = null;
      continue;
    }

    try {
      const parsed = JSON.parse(message.content) as {
        correctionResult?: {
          corrected?: string;
          natural?: string;
          explanation?: string;
          hasError?: boolean;
        } | null;
      };
      const c = parsed.correctionResult;
      if (!c) {
        pending = null;
        continue;
      }
      const original = pending.content.trim();
      const corrected = (c.corrected || "").trim();
      if (!original || !corrected) {
        pending = null;
        continue;
      }
      const hasError =
        typeof c.hasError === "boolean"
          ? c.hasError
          : original.replace(/\s+/g, " ").toLowerCase() !==
            corrected.replace(/\s+/g, " ").toLowerCase();
      if (!hasError) {
        pending = null;
        continue;
      }
      out.push({
        original,
        corrected,
        explanation: (c.explanation || "").trim(),
        sourceSessionId: meta.sessionId,
        sourceReportId: meta.reportId,
        sourceMessageId: pending.id,
        createdAt: meta.createdAt,
      });
    } catch {
      // ignore
    }
    pending = null;
  }

  return out;
}

function extractsFromReports(reports: SessionReport[]): ErrorExtract[] {
  const all: ErrorExtract[] = [];
  for (const report of reports) {
    all.push(
      ...extractFromMessages(report.messages, {
        sessionId: report.sessionId,
        reportId: report.id,
        createdAt: report.endedAt || report.createdAt,
      }),
    );
  }
  return all;
}

function loadConversationSessionsLocal(): ConversationSession[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CONVERSATION_SESSIONS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ConversationSession[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function extractsFromConversationSessions(): ErrorExtract[] {
  const all: ErrorExtract[] = [];
  for (const session of loadConversationSessionsLocal()) {
    all.push(
      ...extractFromMessages(session.messages || [], {
        sessionId: session.id,
        reportId: null,
        createdAt: session.endedAt || session.createdAt,
      }),
    );
  }
  return all;
}

function extractsFromLearningCards(): ErrorExtract[] {
  const cards = loadLearningCards();
  return cards
    .filter((c) => {
      const o = c.original.replace(/\s+/g, " ").trim().toLowerCase();
      const corr = c.corrected.replace(/\s+/g, " ").trim().toLowerCase();
      return o && corr && o !== corr;
    })
    .map((c) => ({
      original: c.original.trim(),
      corrected: c.corrected.trim(),
      explanation: c.explanation.trim(),
      sourceSessionId: null,
      sourceReportId: null,
      sourceMessageId: null,
      createdAt: c.createdAt,
    }));
}

/** Merge new errors from reports + learning cards into the LearningPoint store. */
export function syncLearningPointsFromSources(): LearningPoint[] {
  const existing = loadLearningPoints();
  const byFp = new Map<string, LearningPoint>();
  for (const p of existing) {
    byFp.set(fingerprint(p.originalSentence, p.correctedSentence), p);
  }

  const extracts = [
    ...extractsFromReports(loadSessionReports()),
    ...extractsFromConversationSessions(),
    ...extractsFromLearningCards(),
  ].sort((a, b) => b.createdAt - a.createdAt);

  let changed = false;
  for (const item of extracts) {
    const fp = fingerprint(item.original, item.corrected);
    if (byFp.has(fp)) continue;
    const point: LearningPoint = {
      id: `lp-${item.createdAt}-${Math.random().toString(36).slice(2, 8)}`,
      type: inferType(item.original, item.corrected, item.explanation),
      concept: inferConcept(item.original, item.corrected, item.explanation),
      originalSentence: item.original,
      correctedSentence: item.corrected,
      explanation: item.explanation,
      sourceSessionId: item.sourceSessionId,
      sourceReportId: item.sourceReportId,
      sourceMessageId: item.sourceMessageId,
      createdAt: item.createdAt,
      reviewCount: 0,
      correctCount: 0,
      incorrectCount: 0,
      lastReviewedAt: null,
      nextReviewAt: startOfLocalDay(item.createdAt + 24 * 60 * 60 * 1000),
      status: "new",
    };
    // Make freshly captured points available for review starting next calendar day,
    // but if older than 1 day already, due immediately.
    if (point.nextReviewAt > Date.now()) {
      // keep tomorrow for brand-new same-day captures
    }
    if (Date.now() - item.createdAt >= 12 * 60 * 60 * 1000) {
      point.nextReviewAt = startOfLocalDay();
    }
    byFp.set(fp, point);
    changed = true;
  }

  const merged = [...byFp.values()].sort((a, b) => b.createdAt - a.createdAt);
  if (changed) persistLearningPoints(merged);
  return merged;
}

export function countPointsByType(points: LearningPoint[]) {
  return {
    grammar: points.filter((p) => p.type === "grammar").length,
    vocabulary: points.filter((p) => p.type === "vocabulary").length,
    expression: points.filter((p) => p.type === "expression").length,
  };
}

/**
 * Prefer due points, then newest unreviewed. Cap at `limit`.
 * For MVP: also allow same-day points so users can try the feature after chatting.
 */
export function selectPointsForQuiz(
  points: LearningPoint[],
  limit = 5,
): LearningPoint[] {
  const now = Date.now();
  const due = points
    .filter((p) => p.status !== "mastered" && p.nextReviewAt <= now)
    .sort((a, b) => a.nextReviewAt - b.nextReviewAt || b.createdAt - a.createdAt);

  const picked: LearningPoint[] = [];
  const used = new Set<string>();
  for (const p of due) {
    if (picked.length >= limit) break;
    picked.push(p);
    used.add(p.id);
  }

  if (picked.length < limit) {
    const rest = points
      .filter((p) => !used.has(p.id) && p.status !== "mastered")
      .sort((a, b) => b.createdAt - a.createdAt);
    for (const p of rest) {
      if (picked.length >= limit) break;
      picked.push(p);
      used.add(p.id);
    }
  }

  return picked.slice(0, limit);
}

function scheduleNextReview(point: LearningPoint, correct: boolean): number {
  const day = 24 * 60 * 60 * 1000;
  const base = startOfLocalDay();
  if (!correct) return base + day; // tomorrow
  if (point.correctCount + 1 >= 3 && point.incorrectCount === 0) {
    return base + 7 * day;
  }
  if (point.reviewCount >= 1) return base + 3 * day;
  return base + day;
}

function nextStatus(point: LearningPoint, correct: boolean): LearningPointStatus {
  if (!correct) return "learning";
  if (point.correctCount + 1 >= 3 && point.incorrectCount <= 1) return "mastered";
  if (point.reviewCount >= 1) return "reviewing";
  return "learning";
}

export function recordLearningPointAnswer(
  pointId: string,
  correct: boolean,
): LearningPoint[] {
  const points = loadLearningPoints();
  const next = points.map((p) => {
    if (p.id !== pointId) return p;
    const updated: LearningPoint = {
      ...p,
      reviewCount: p.reviewCount + 1,
      correctCount: p.correctCount + (correct ? 1 : 0),
      incorrectCount: p.incorrectCount + (correct ? 0 : 1),
      lastReviewedAt: Date.now(),
      nextReviewAt: scheduleNextReview(p, correct),
      status: nextStatus(p, correct),
    };
    return updated;
  });
  persistLearningPoints(next);
  return next;
}
