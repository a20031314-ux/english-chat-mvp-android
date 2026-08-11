import {
  loadLearningPoints,
  syncLearningPointsFromSources,
  type LearningPoint,
  type LearningPointType,
} from "@/lib/learningPoints";
import { isGrammarQuizSource } from "@/lib/quizGrammar";
import {
  ensureReviewState,
  reviewPriorityScore,
  type QuizSourceType,
  type ReviewState,
} from "@/lib/quizReviewState";

export type QuizCandidate = {
  id: string;
  sourceType: QuizSourceType;
  category: LearningPointType;
  concept: string;
  createdAt: number;
  weight: number;
  /** conversation_error */
  originalSentence?: string;
  correctedSentence?: string;
  explanation?: string;
  sourceReportId?: string | null;
  sourceMessageId?: string | null;
  /** saved vocab */
  word?: string;
  gloss?: string;
  example?: string;
};

function fromLearningPoint(point: LearningPoint): QuizCandidate {
  const review = ensureReviewState(
    "conversation_error",
    point.id,
    point.createdAt,
  );
  // Prefer LearningPoint's own counters when richer
  const blended: ReviewState = {
    ...review,
    reviewCount: Math.max(review.reviewCount, point.reviewCount),
    correctCount: Math.max(review.correctCount, point.correctCount),
    incorrectCount: Math.max(review.incorrectCount, point.incorrectCount),
    lastReviewedAt: point.lastReviewedAt ?? review.lastReviewedAt,
    nextReviewAt: Math.min(review.nextReviewAt, point.nextReviewAt),
    status:
      point.status === "mastered"
        ? "mastered"
        : point.status === "reviewing"
          ? "reviewing"
          : point.status === "learning"
            ? "learning"
            : review.status,
  };

  return {
    id: point.id,
    sourceType: "conversation_error",
    category: point.type,
    concept: point.concept,
    createdAt: point.createdAt,
    weight: reviewPriorityScore(blended, point.createdAt),
    originalSentence: point.originalSentence,
    correctedSentence: point.correctedSentence,
    explanation: point.explanation,
    sourceReportId: point.sourceReportId,
    sourceMessageId: point.sourceMessageId,
  };
}

function pickWeighted(
  pool: QuizCandidate[],
  count: number,
  used: Set<string>,
): QuizCandidate[] {
  const out: QuizCandidate[] = [];
  while (out.length < count) {
    const available = pool
      .filter((c) => !used.has(`${c.sourceType}:${c.id}`))
      .sort((a, b) => b.weight - a.weight);
    if (available.length === 0) break;

    const top = available.slice(0, Math.min(available.length, Math.max(4, count)));
    const total = top.reduce((sum, c) => sum + Math.max(1, c.weight), 0);
    let r = Math.random() * total;
    let chosen = top[0];
    for (const c of top) {
      r -= Math.max(1, c.weight);
      if (r <= 0) {
        chosen = c;
        break;
      }
    }
    used.add(`${chosen.sourceType}:${chosen.id}`);
    out.push(chosen);
  }
  return out;
}

export function collectQuizCandidates(): QuizCandidate[] {
  syncLearningPointsFromSources();
  return loadLearningPoints()
    .filter((p) => p.status !== "mastered")
    .map(fromLearningPoint)
    .filter((c) =>
      isGrammarQuizSource({
        category: c.category,
        originalSentence: c.originalSentence,
        correctedSentence: c.correctedSentence,
        explanation: c.explanation,
      }),
    )
    .sort((a, b) => b.weight - a.weight);
}

export function selectQuizCandidates(limit = 5): QuizCandidate[] {
  const grammar = collectQuizCandidates();
  if (grammar.length === 0) return [];

  return pickWeighted(grammar, limit, new Set()).map((c) => ({
    ...c,
    category: "grammar" as const,
    sourceType: "conversation_error" as const,
  }));
}

export function compositionFromCandidates(candidates: QuizCandidate[]) {
  return {
    grammar: candidates.filter((c) => c.category === "grammar").length,
    vocabulary: candidates.filter((c) => c.category === "vocabulary").length,
    expression: candidates.filter((c) => c.category === "expression").length,
  };
}
