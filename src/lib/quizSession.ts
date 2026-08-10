import type { LearningPointType } from "@/lib/learningPoints";
import type { QuizSourceType } from "@/lib/quizReviewState";

export const QUIZ_TODAY_KEY = "quizTodaySession";

export type QuizQuestion = {
  id: string;
  /** @deprecated use sourceId — kept for older cached sessions */
  learningPointId: string;
  sourceId: string;
  sourceType: QuizSourceType;
  type: LearningPointType;
  concept: string;
  prompt: string;
  choices: string[];
  correctIndex: number;
  explanation: string;
  sourceHint: string;
  sourceReportId: string | null;
  sourceMessageId: string | null;
};

export type QuizAnswerRecord = {
  questionId: string;
  learningPointId: string;
  sourceId: string;
  sourceType: QuizSourceType;
  selectedIndex: number;
  correct: boolean;
};

export type TodayQuizSession = {
  dateKey: string;
  locale: string;
  questions: QuizQuestion[];
  answers: QuizAnswerRecord[];
  completedAt: number | null;
  composition: {
    grammar: number;
    vocabulary: number;
    expression: number;
  };
};

export function localDateKey(ts = Date.now()) {
  const d = new Date(ts);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function normalizeQuestion(raw: unknown): QuizQuestion | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const sourceId =
    typeof o.sourceId === "string"
      ? o.sourceId
      : typeof o.learningPointId === "string"
        ? o.learningPointId
        : "";
  if (!sourceId) return null;
  if (typeof o.prompt !== "string" || !Array.isArray(o.choices)) return null;
  const sourceType: QuizSourceType =
    o.sourceType === "saved_vocabulary" ||
    o.sourceType === "saved_expression" ||
    o.sourceType === "conversation_error"
      ? o.sourceType
      : "conversation_error";
  const type: LearningPointType =
    o.type === "grammar" || o.type === "vocabulary" || o.type === "expression"
      ? o.type
      : "vocabulary";
  return {
    id: typeof o.id === "string" ? o.id : `q-${sourceId}`,
    learningPointId: sourceId,
    sourceId,
    sourceType,
    type,
    concept: typeof o.concept === "string" ? o.concept : sourceId,
    prompt: o.prompt,
    choices: o.choices.filter((c): c is string => typeof c === "string"),
    correctIndex: typeof o.correctIndex === "number" ? o.correctIndex : 0,
    explanation: typeof o.explanation === "string" ? o.explanation : "",
    sourceHint: typeof o.sourceHint === "string" ? o.sourceHint : "",
    sourceReportId:
      typeof o.sourceReportId === "string" ? o.sourceReportId : null,
    sourceMessageId:
      typeof o.sourceMessageId === "string" ? o.sourceMessageId : null,
  };
}

export function loadTodayQuizSession(): TodayQuizSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = JSON.parse(localStorage.getItem(QUIZ_TODAY_KEY) || "null");
    if (!raw || typeof raw !== "object") return null;
    const o = raw as TodayQuizSession;
    if (o.dateKey !== localDateKey()) return null;
    if (!Array.isArray(o.questions) || o.questions.length === 0) return null;
    const questions = o.questions
      .map(normalizeQuestion)
      .filter((q): q is QuizQuestion => q !== null);
    if (questions.length === 0) return null;
    return { ...o, questions };
  } catch {
    return null;
  }
}

export function persistTodayQuizSession(session: TodayQuizSession) {
  if (typeof window === "undefined") return;
  localStorage.setItem(QUIZ_TODAY_KEY, JSON.stringify(session));
}

export function clearTodayQuizSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(QUIZ_TODAY_KEY);
}

export function compositionFromQuestions(questions: QuizQuestion[]) {
  return {
    grammar: questions.filter((q) => q.type === "grammar").length,
    vocabulary: questions.filter((q) => q.type === "vocabulary").length,
    expression: questions.filter((q) => q.type === "expression").length,
  };
}

export function summarizeQuizResults(
  session: TodayQuizSession,
): { remembered: string[]; reviewAgain: string[] } {
  const byPoint = new Map<string, { concept: string; correct: boolean }>();
  for (const q of session.questions) {
    const ans = session.answers.find((a) => a.questionId === q.id);
    if (!ans) continue;
    byPoint.set(q.sourceId || q.learningPointId, {
      concept: q.concept,
      correct: ans.correct,
    });
  }
  const remembered: string[] = [];
  const reviewAgain: string[] = [];
  for (const item of byPoint.values()) {
    if (item.correct) remembered.push(item.concept);
    else reviewAgain.push(item.concept);
  }
  return { remembered, reviewAgain };
}
