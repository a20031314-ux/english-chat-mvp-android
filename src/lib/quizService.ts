import { apiUrl } from "@/lib/apiBase";
import type { Locale } from "@/lib/copy";
import {
  selectQuizCandidates,
  type QuizCandidate,
} from "@/lib/quizCandidates";
import { syncLearningPointsFromSources } from "@/lib/learningPoints";
import type { QuizSourceType } from "@/lib/quizReviewState";
import {
  compositionFromQuestions,
  localDateKey,
  persistTodayQuizSession,
  type QuizQuestion,
  type TodayQuizSession,
} from "@/lib/quizSession";

export const QUIZ_SESSION_UPDATED_EVENT = "quizSessionUpdated";

type ApiQuestion = {
  sourceId?: string;
  learningPointId?: string;
  sourceType?: QuizSourceType;
  type: "grammar" | "vocabulary" | "expression";
  concept: string;
  prompt: string;
  choices: string[];
  correctIndex: number;
  explanation: string;
  sourceHint: string;
};

function notifyQuizSessionUpdated() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(QUIZ_SESSION_UPDATED_EVENT));
}

export async function generateTodayQuiz(
  candidates: QuizCandidate[],
  locale: Locale,
): Promise<TodayQuizSession> {
  const response = await fetch(apiUrl("/api/quiz"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      locale,
      items: candidates.map((c) => ({
        id: c.id,
        sourceType: c.sourceType,
        type: c.category,
        concept: c.concept,
        originalSentence: c.originalSentence,
        correctedSentence: c.correctedSentence,
        explanation: c.explanation,
        word: c.word,
        gloss: c.gloss,
        example: c.example,
        sourceReportId: c.sourceReportId,
        sourceMessageId: c.sourceMessageId,
      })),
    }),
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as {
      error?: string;
    };
    throw new Error(body.error || "QUIZ_FAILED");
  }

  const data = (await response.json()) as { questions?: ApiQuestion[] };
  const byId = new Map(candidates.map((c) => [c.id, c]));
  const questions: QuizQuestion[] = (data.questions || [])
    .map((q) => {
      const sourceId = q.sourceId || q.learningPointId || "";
      const candidate = byId.get(sourceId);
      if (!candidate) return null;
      return {
        id: `q-${localDateKey()}-${sourceId}`,
        learningPointId: sourceId,
        sourceId,
        sourceType: q.sourceType || candidate.sourceType,
        type: q.type || candidate.category,
        concept: q.concept || candidate.concept,
        prompt: q.prompt,
        choices: q.choices,
        correctIndex: q.correctIndex,
        explanation: q.explanation,
        sourceHint: q.sourceHint,
        sourceReportId: candidate.sourceReportId ?? null,
        sourceMessageId: candidate.sourceMessageId ?? null,
      } satisfies QuizQuestion;
    })
    .filter((q): q is QuizQuestion => q !== null);

  if (questions.length === 0) {
    throw new Error("QUIZ_EMPTY");
  }

  const session: TodayQuizSession = {
    dateKey: localDateKey(),
    locale,
    questions,
    answers: [],
    completedAt: null,
    composition: compositionFromQuestions(questions),
  };
  persistTodayQuizSession(session);
  notifyQuizSessionUpdated();
  return session;
}

/**
 * After a session report is saved: sync learning points and pre-build today's quiz
 * so the Review tab can start immediately on click.
 */
export async function prepareQuizAfterReport(
  locale: Locale,
): Promise<TodayQuizSession | null> {
  try {
    syncLearningPointsFromSources();
    const pool = selectQuizCandidates(5);
    if (pool.length === 0) {
      return null;
    }
    return await generateTodayQuiz(pool, locale);
  } catch (error) {
    console.error("[quiz] prepare after report failed", error);
    return null;
  }
}
