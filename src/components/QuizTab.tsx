"use client";

import { useCallback, useEffect, useState } from "react";
import { LanguageSelector } from "@/components/LanguageSelector";
import type { Locale, UICopy } from "@/lib/copy";
import { syncLearningPointsFromSources } from "@/lib/learningPoints";
import {
  selectQuizCandidates,
  type QuizCandidate,
} from "@/lib/quizCandidates";
import { recordReviewAnswer } from "@/lib/quizReviewState";
import { recordLearningPointAnswer } from "@/lib/learningPoints";
import { generateTodayQuiz, QUIZ_SESSION_UPDATED_EVENT } from "@/lib/quizService";
import {
  loadTodayQuizSession,
  persistTodayQuizSession,
  type QuizQuestion,
  type TodayQuizSession,
} from "@/lib/quizSession";

type QuizTabProps = {
  locale: Locale;
  ui: UICopy;
  onLocaleChange: (locale: Locale) => void;
  onGoChat: () => void;
};

type View = "home" | "playing" | "result";

const CHOICE_LETTERS = ["A", "B", "C", "D"];

function typeLabel(type: QuizQuestion["type"], ui: UICopy) {
  if (type === "grammar") return ui.quizTypeGrammar;
  if (type === "vocabulary") return ui.quizTypeVocabulary;
  return ui.quizTypeExpression;
}

export function QuizTab({
  locale,
  ui,
  onLocaleChange,
  onGoChat,
}: QuizTabProps) {
  const [candidates, setCandidates] = useState<QuizCandidate[]>([]);
  const [session, setSession] = useState<TodayQuizSession | null>(null);
  const [view, setView] = useState<View>("home");
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(() => {
    syncLearningPointsFromSources();
    setCandidates(selectQuizCandidates(5));
    const cached = loadTodayQuizSession();
    if (cached && cached.locale === locale) {
      setSession(cached);
      if (cached.completedAt) setView("result");
      else if (cached.answers.length > 0 && !cached.completedAt) {
        setView("home");
      }
    } else {
      setSession(null);
      setView("home");
    }
    setReady(true);
  }, [locale]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    const onUpdated = () => refresh();
    window.addEventListener(QUIZ_SESSION_UPDATED_EVENT, onUpdated);
    return () =>
      window.removeEventListener(QUIZ_SESSION_UPDATED_EVENT, onUpdated);
  }, [refresh]);

  const questionCount = session?.questions.length ?? candidates.length;
  const canStart =
    Boolean(session && session.questions.length > 0) || candidates.length > 0;

  const ensureSession = async (forceNew = false) => {
    if (
      !forceNew &&
      session &&
      !session.completedAt &&
      session.questions.length > 0 &&
      session.locale === locale
    ) {
      return session;
    }
    if (!forceNew) {
      const cached = loadTodayQuizSession();
      if (
        cached &&
        cached.locale === locale &&
        !cached.completedAt &&
        cached.questions.length > 0
      ) {
        setSession(cached);
        return cached;
      }
    }
    const pool = forceNew ? selectQuizCandidates(5) : candidates;
    if (pool.length === 0) {
      throw new Error("EMPTY");
    }
    setIsGenerating(true);
    setError(null);
    try {
      const created = await generateTodayQuiz(pool, locale);
      setSession(created);
      setCandidates(pool);
      return created;
    } finally {
      setIsGenerating(false);
    }
  };

  const startQuiz = async (forceNew = false) => {
    try {
      const active = await ensureSession(forceNew);
      setSelected(null);
      setRevealed(false);
      setView("playing");

      if (!forceNew && active.answers.length > 0 && !active.completedAt) {
        const nextIdx = active.answers.length;
        if (nextIdx >= active.questions.length) {
          const done = {
            ...active,
            completedAt: Date.now(),
          };
          persistTodayQuizSession(done);
          setSession(done);
          setView("result");
          return;
        }
        setIndex(nextIdx);
        return;
      }
      setIndex(0);
    } catch {
      setError(ui.quizGenerateFailed);
    }
  };

  const current = session?.questions[index] ?? null;
  const total = session?.questions.length ?? 0;

  const choose = (choiceIndex: number) => {
    if (!session || !current || revealed) return;
    const correct = choiceIndex === current.correctIndex;
    setSelected(choiceIndex);
    setRevealed(true);

    const sourceId = current.sourceId || current.learningPointId;
    const sourceType = current.sourceType || "conversation_error";
    recordReviewAnswer(sourceType, sourceId, correct);
    if (sourceType === "conversation_error") {
      recordLearningPointAnswer(sourceId, correct);
    }

    const answers = [
      ...session.answers.filter((a) => a.questionId !== current.id),
      {
        questionId: current.id,
        learningPointId: sourceId,
        sourceId,
        sourceType,
        selectedIndex: choiceIndex,
        correct,
      },
    ];
    const updated: TodayQuizSession = { ...session, answers };
    persistTodayQuizSession(updated);
    setSession(updated);
  };

  const goNext = () => {
    if (!session) return;
    if (index + 1 >= session.questions.length) {
      const done: TodayQuizSession = {
        ...session,
        completedAt: Date.now(),
      };
      persistTodayQuizSession(done);
      setSession(done);
      setView("result");
      return;
    }
    setIndex((v) => v + 1);
    setSelected(null);
    setRevealed(false);
  };

  const progressPct =
    total > 0 ? ((index + (revealed ? 1 : 0)) / total) * 100 : 0;

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
      {view === "playing" && current && session ? (
        <>
          <header className="flex shrink-0 items-center justify-between gap-2 px-4 pt-3">
            <button
              type="button"
              onClick={() => {
                setView("home");
                setSelected(null);
                setRevealed(false);
              }}
              className="text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              ← {ui.homeTabQuiz}
            </button>
            <span className="text-xs tabular-nums text-slate-500">
              {ui.quizProgress
                .replace("{current}", String(index + 1))
                .replace("{total}", String(total))}
            </span>
          </header>
          <div className="mt-3 h-1 w-full bg-slate-100">
            <div
              className="h-full bg-slate-900 transition-[width]"
              style={{ width: `${Math.min(100, progressPct)}%` }}
            />
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            <div className="mx-auto flex w-full max-w-lg flex-col px-4 py-8 sm:px-6">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                {typeLabel(current.type, ui)}
              </p>
              <p
                className="mt-4 text-xl font-semibold leading-snug text-slate-900"
                translate="no"
              >
                {current.prompt}
              </p>

              <div className="mt-8 space-y-3">
                {current.choices.map((choice, choiceIndex) => {
                  const letter =
                    CHOICE_LETTERS[choiceIndex] ?? String(choiceIndex + 1);
                  let style =
                    "border-slate-200 bg-white text-slate-900 hover:border-slate-300";
                  if (revealed) {
                    if (choiceIndex === current.correctIndex) {
                      style = "border-teal-500 bg-teal-50 text-teal-950";
                    } else if (choiceIndex === selected) {
                      style = "border-rose-400 bg-rose-50 text-rose-950";
                    } else {
                      style = "border-slate-100 bg-slate-50 text-slate-400";
                    }
                  }
                  return (
                    <button
                      key={`${current.id}-${choiceIndex}`}
                      type="button"
                      disabled={revealed}
                      onClick={() => choose(choiceIndex)}
                      className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-4 text-left text-[15px] transition ${style}`}
                    >
                      <span className="w-6 shrink-0 text-sm font-semibold text-slate-500">
                        {letter}
                      </span>
                      <span translate="no">{choice}</span>
                    </button>
                  );
                })}
              </div>

              {revealed ? (
                <div className="mt-8 space-y-3 border-t border-slate-100 pt-6">
                  {current.explanation.trim() ? (
                    <p className="text-sm leading-relaxed text-slate-700">
                      {current.explanation}
                    </p>
                  ) : null}
                  <button
                    type="button"
                    onClick={goNext}
                    className="mt-2 w-full rounded-2xl bg-slate-900 px-4 py-3.5 text-sm font-medium text-white hover:bg-slate-800"
                  >
                    {index + 1 >= total ? ui.quizSeeResult : ui.quizNext}
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </>
      ) : (
        <>
          <header className="flex shrink-0 items-center justify-between gap-2 border-b border-slate-200 px-4 py-3">
            <h1 className="text-base font-semibold text-slate-900">
              {ui.homeTabQuiz}
            </h1>
            <LanguageSelector locale={locale} onChange={onLocaleChange} />
          </header>

          <div className="min-h-0 flex-1 overflow-y-auto">
            {!ready ? (
              <p className="px-4 py-10 text-center text-sm text-slate-500">
                {ui.quizLoading}
              </p>
            ) : view === "result" && session ? (
              <div className="mx-auto w-full max-w-lg px-4 py-8 sm:px-6">
                <ul className="space-y-5">
                  {session.questions.map((question, qIndex) => {
                    const explanation = question.explanation.trim();
                    if (!explanation) return null;
                    return (
                      <li
                        key={question.id}
                        className="border-b border-slate-100 pb-5 last:border-b-0 last:pb-0"
                      >
                        <p className="text-[11px] font-medium text-slate-400">
                          {qIndex + 1}. {typeLabel(question.type, ui)}
                        </p>
                        <p className="mt-2 text-sm leading-relaxed text-slate-800">
                          {explanation}
                        </p>
                      </li>
                    );
                  })}
                </ul>

                <button
                  type="button"
                  onClick={() => {
                    setView("home");
                    setIndex(0);
                    setSelected(null);
                    setRevealed(false);
                  }}
                  className="mt-10 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-800 hover:bg-slate-50"
                >
                  {ui.quizBackHome}
                </button>
              </div>
            ) : !canStart ? (
              <div className="mx-auto flex w-full max-w-lg flex-col items-center px-4 py-16 text-center sm:px-6">
                <p className="text-sm leading-relaxed text-slate-600">
                  {ui.quizEmptyBody}
                </p>
                <button
                  type="button"
                  onClick={onGoChat}
                  className="mt-8 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800"
                >
                  {ui.quizEmptyCta}
                </button>
              </div>
            ) : (
              <div className="mx-auto w-full max-w-lg px-4 py-12 text-center sm:px-6">
                <p className="text-4xl font-semibold tabular-nums text-slate-900">
                  {questionCount}
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  {ui.quizTodayCountLabel}
                </p>

                {error ? (
                  <p className="mt-6 text-sm text-rose-700">{error}</p>
                ) : null}

                <button
                  type="button"
                  disabled={isGenerating}
                  onClick={() => void startQuiz(Boolean(session?.completedAt))}
                  className="mt-8 w-full rounded-2xl bg-slate-900 px-4 py-3.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
                >
                  {isGenerating
                    ? ui.quizGenerating
                    : session?.completedAt
                      ? ui.quizReviewAgainCta
                      : session && session.answers.length > 0
                        ? ui.quizContinueCta
                        : ui.quizStartCta}
                </button>

                {session?.completedAt ? (
                  <button
                    type="button"
                    onClick={() => setView("result")}
                    className="mt-2 w-full rounded-2xl px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900"
                  >
                    {ui.quizSeeResult}
                  </button>
                ) : null}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
