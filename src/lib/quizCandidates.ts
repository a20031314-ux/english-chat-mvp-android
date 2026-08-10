import {
  loadLearningPoints,
  syncLearningPointsFromSources,
  type LearningPoint,
  type LearningPointType,
} from "@/lib/learningPoints";
import {
  ensureReviewState,
  reviewPriorityScore,
  type QuizSourceType,
  type ReviewState,
} from "@/lib/quizReviewState";
import { loadVocabulary, type VocabularyEntry } from "@/lib/vocabulary";

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

function isPhrase(word: string) {
  return /\s/.test(word.trim()) || word.trim().split(/-/).length > 2;
}

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

function fromVocabulary(entry: VocabularyEntry): QuizCandidate {
  const phrase = isPhrase(entry.word);
  const sourceType: QuizSourceType = phrase
    ? "saved_expression"
    : "saved_vocabulary";
  const review = ensureReviewState(sourceType, entry.id, entry.createdAt);
  return {
    id: entry.id,
    sourceType,
    category: phrase ? "expression" : "vocabulary",
    concept: entry.word,
    createdAt: entry.createdAt,
    weight: reviewPriorityScore(review, entry.createdAt),
    word: entry.word,
    gloss: entry.gloss,
    example: entry.example,
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

/**
 * Build today's quiz mix from conversation errors + saved vocabulary.
 * Weighted by review value; not pure random.
 */
export function collectQuizCandidates(): QuizCandidate[] {
  syncLearningPointsFromSources();
  const points = loadLearningPoints().filter((p) => p.status !== "mastered");
  const vocab = loadVocabulary();

  const fromLp = points.map(fromLearningPoint);
  const fromVocab = vocab
    .map(fromVocabulary)
    .filter((c) => {
      // Skip mastered vocab reviews
      const review = ensureReviewState(c.sourceType, c.id, c.createdAt);
      return review.status !== "mastered";
    });

  return [...fromLp, ...fromVocab].sort((a, b) => b.weight - a.weight);
}

export function selectQuizCandidates(limit = 5): QuizCandidate[] {
  const all = collectQuizCandidates();
  if (all.length === 0) return [];

  const conversation = all.filter((c) => c.sourceType === "conversation_error");
  const saved = all.filter((c) => c.sourceType !== "conversation_error");
  const used = new Set<string>();
  const picked: QuizCandidate[] = [];

  // Mild mix when both pools exist
  if (conversation.length > 0 && saved.length > 0 && limit >= 2) {
    const savedTarget = Math.min(
      saved.length,
      Math.max(1, Math.round(limit * 0.4)),
    );
    const convTarget = Math.min(conversation.length, limit - savedTarget);
    picked.push(...pickWeighted(conversation, convTarget, used));
    picked.push(...pickWeighted(saved, savedTarget, used));
  }

  if (picked.length < limit) {
    picked.push(...pickWeighted(all, limit - picked.length, used));
  }

  return picked.slice(0, limit);
}

export function compositionFromCandidates(candidates: QuizCandidate[]) {
  return {
    grammar: candidates.filter((c) => c.category === "grammar").length,
    vocabulary: candidates.filter((c) => c.category === "vocabulary").length,
    expression: candidates.filter((c) => c.category === "expression").length,
  };
}
