/**
 * 열쇠마다 이 폰에서 푼 기록(nextStudy QuizLog)을 읽고 쓰는 곳 — Quizbank·오늘 할 것(TodayPlan)과 문장구조 수업(FrameLesson)이 같이 쓴다.
 * 2026-11-01: 수업 안 퀴즈에서 맞힌 문장구조가 기록에 안 남아 Quizbank 문법 탭에 바로 다시 나오던 것을 막는다.
 * 쓰면 "quiz-log" 이벤트로 열려 있는 화면이 다시 읽는다. 열쇠·횟수·때만(학습자 문장 없음).
 */
import { recordQuiz, type QuizLog } from "./nextStudy.ts";

const KEY = "quizLog.v1";
export const QUIZ_LOG_EVENT = "quiz-log";

export function readQuizLog(language: string): QuizLog {
  try {
    return (JSON.parse(localStorage.getItem(`${KEY}.${language}`) ?? "null") as QuizLog | null) ?? {};
  } catch {
    return {};
  }
}

export function saveQuizLog(language: string, log: QuizLog, announce = true): void {
  try {
    localStorage.setItem(`${KEY}.${language}`, JSON.stringify(log));
    if (announce) window.dispatchEvent(new CustomEvent(QUIZ_LOG_EVENT, { detail: language }));
  } catch {
    // 이 화면에서만.
  }
}

/** 한 열쇠의 답 하나를 더한다(다른 화면에서). */
export function noteQuizLog(language: string, key: string, right: boolean, now = Date.now()): void {
  saveQuizLog(language, recordQuiz(readQuizLog(language), key, right, now));
}
