export const QUIZ_REVIEW_STATE_KEY = "quizReviewStates";

export type QuizSourceType =
  | "conversation_error"
  | "saved_vocabulary"
  | "saved_expression";

export type ReviewStatus = "new" | "learning" | "reviewing" | "mastered";

export type ReviewState = {
  sourceId: string;
  sourceType: QuizSourceType;
  reviewCount: number;
  correctCount: number;
  incorrectCount: number;
  consecutiveCorrect: number;
  lastReviewedAt: number | null;
  nextReviewAt: number;
  status: ReviewStatus;
};

function startOfLocalDay(ts = Date.now()) {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

function reviewKey(sourceType: QuizSourceType, sourceId: string) {
  return `${sourceType}:${sourceId}`;
}

function normalizeState(raw: unknown): ReviewState | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  if (typeof o.sourceId !== "string" || !o.sourceId) return null;
  if (
    o.sourceType !== "conversation_error" &&
    o.sourceType !== "saved_vocabulary" &&
    o.sourceType !== "saved_expression"
  ) {
    return null;
  }
  const status: ReviewStatus =
    o.status === "learning" ||
    o.status === "reviewing" ||
    o.status === "mastered" ||
    o.status === "new"
      ? o.status
      : "new";
  return {
    sourceId: o.sourceId,
    sourceType: o.sourceType,
    reviewCount:
      typeof o.reviewCount === "number" ? Math.max(0, o.reviewCount) : 0,
    correctCount:
      typeof o.correctCount === "number" ? Math.max(0, o.correctCount) : 0,
    incorrectCount:
      typeof o.incorrectCount === "number" ? Math.max(0, o.incorrectCount) : 0,
    consecutiveCorrect:
      typeof o.consecutiveCorrect === "number"
        ? Math.max(0, o.consecutiveCorrect)
        : 0,
    lastReviewedAt:
      typeof o.lastReviewedAt === "number" ? o.lastReviewedAt : null,
    nextReviewAt:
      typeof o.nextReviewAt === "number" ? o.nextReviewAt : startOfLocalDay(),
    status,
  };
}

export function loadReviewStates(): ReviewState[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = JSON.parse(localStorage.getItem(QUIZ_REVIEW_STATE_KEY) || "[]");
    if (!Array.isArray(raw)) return [];
    return raw
      .map(normalizeState)
      .filter((s): s is ReviewState => s !== null);
  } catch {
    return [];
  }
}

export function persistReviewStates(states: ReviewState[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(QUIZ_REVIEW_STATE_KEY, JSON.stringify(states));
}

export function getReviewState(
  sourceType: QuizSourceType,
  sourceId: string,
): ReviewState | null {
  const key = reviewKey(sourceType, sourceId);
  return (
    loadReviewStates().find(
      (s) => reviewKey(s.sourceType, s.sourceId) === key,
    ) ?? null
  );
}

export function ensureReviewState(
  sourceType: QuizSourceType,
  sourceId: string,
  createdAt = Date.now(),
): ReviewState {
  const existing = getReviewState(sourceType, sourceId);
  if (existing) return existing;
  return {
    sourceId,
    sourceType,
    reviewCount: 0,
    correctCount: 0,
    incorrectCount: 0,
    consecutiveCorrect: 0,
    lastReviewedAt: null,
    nextReviewAt: startOfLocalDay(createdAt),
    status: "new",
  };
}

function scheduleNext(state: ReviewState, correct: boolean): number {
  const day = 24 * 60 * 60 * 1000;
  const base = startOfLocalDay();
  if (!correct) return base + day;
  const streak = state.consecutiveCorrect + 1;
  if (streak >= 3) return base + 7 * day;
  if (state.reviewCount >= 1) return base + 3 * day;
  return base + day;
}

function nextStatus(state: ReviewState, correct: boolean): ReviewStatus {
  if (!correct) return "learning";
  if (state.consecutiveCorrect + 1 >= 3 && state.incorrectCount <= 1) {
    return "mastered";
  }
  if (state.reviewCount >= 1) return "reviewing";
  return "learning";
}

export function recordReviewAnswer(
  sourceType: QuizSourceType,
  sourceId: string,
  correct: boolean,
): ReviewState {
  const states = loadReviewStates();
  const key = reviewKey(sourceType, sourceId);
  const idx = states.findIndex(
    (s) => reviewKey(s.sourceType, s.sourceId) === key,
  );
  const prev =
    idx >= 0
      ? states[idx]
      : ensureReviewState(sourceType, sourceId);

  const updated: ReviewState = {
    ...prev,
    reviewCount: prev.reviewCount + 1,
    correctCount: prev.correctCount + (correct ? 1 : 0),
    incorrectCount: prev.incorrectCount + (correct ? 0 : 1),
    consecutiveCorrect: correct ? prev.consecutiveCorrect + 1 : 0,
    lastReviewedAt: Date.now(),
    nextReviewAt: scheduleNext(prev, correct),
    status: nextStatus(prev, correct),
  };

  if (idx >= 0) states[idx] = updated;
  else states.push(updated);
  persistReviewStates(states);
  return updated;
}

/** Higher = more valuable to review now. */
export function reviewPriorityScore(
  state: ReviewState | null,
  createdAt: number,
  now = Date.now(),
): number {
  const s = state;
  let score = 40;

  if (!s || s.reviewCount === 0) score += 50;
  if (s && s.incorrectCount > 0) score += 35 + s.incorrectCount * 8;
  if (s && s.consecutiveCorrect === 0 && s.reviewCount > 0) score += 20;
  if (s && s.nextReviewAt <= now) score += 25;
  if (s && s.status === "mastered") score -= 80;
  if (s && s.consecutiveCorrect >= 3) score -= 40;
  if (s && s.consecutiveCorrect >= 2) score -= 15;

  const ageDays = (now - createdAt) / (24 * 60 * 60 * 1000);
  if (ageDays <= 2) score += 15;
  else if (ageDays <= 7) score += 8;
  else if (ageDays > 30) score -= 5;

  return score;
}
