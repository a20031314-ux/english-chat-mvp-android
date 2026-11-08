/**
 * 날마다 푼 퀴즈 수·맞힌 수(2026-10-31 Logbank — 사용자 "복습 칸 자리에 날마다·주마다 배운 것 정리, AI 없이 목록만").
 * 이 폰에만, 언어마다, 최근 1년(2026-11-02 Logbank 주·월 정리 — 예전 60일). 수와 그날 틀린 열쇠(낱말·표현·틀 이름 — 학습자 문장 아님)만.
 */
import { noteLedger } from "./logLedger.ts";

const KEY = "quizDays.v1";
const KEEP_DAYS = 366;

/**
 * wrong: 그날 틀린 열쇠(w|·e|·f|…, 서른 개까지) — Logbank 그날 칸에 "틀린 것"으로(2026-11-01).
 * 2026-11-02부터(Logbank 육각형 — 알아봄/만들어 냄 가르기, curriculum/fill.ts): okc·okt = 고르기·쓰기로 맞힌 열쇠, wt = 틀린 것 중 쓰기,
 * miss = 틀린 열쇠의 틀린 꼴(고른 오답과 정답 차이). 예전 날엔 없다(맞힌 것은 익힘 기록 known에서, 고르기로 어림).
 */
export type QuizShape = "c" | "t";
export type QuizDay = { n: number; right: number; wrong?: string[]; okc?: string[]; okt?: string[]; wt?: string[]; miss?: Record<string, string> };
export type QuizDays = Record<string, QuizDay>;
const DAY_KEYS_MAX = 200;

export function readQuizDays(language: string): QuizDays {
  try {
    const raw = JSON.parse(localStorage.getItem(`${KEY}.${language}`) ?? "null") as QuizDays | null;
    return raw && typeof raw === "object" ? raw : {};
  } catch {
    return {};
  }
}

/** 하루 칸에 한 문제를 더한다(오래된 날은 지움). 순수 — 저장은 saveQuizDays. */
export function addQuizDay(days: QuizDays, day: string, correct: boolean, key?: string, shape?: QuizShape, miss?: string): QuizDays {
  const one = days[day] ?? { n: 0, right: 0 };
  const wrong = !correct && key && !(one.wrong ?? []).includes(key) ? [...(one.wrong ?? []), key].slice(-30) : one.wrong;
  const push = (list: string[] | undefined, yes: boolean) => (yes && key && !(list ?? []).includes(key) ? [...(list ?? []), key].slice(-DAY_KEYS_MAX) : list);
  const okc = push(one.okc, correct && shape === "c");
  const okt = push(one.okt, correct && shape === "t");
  const wt = push(one.wt, !correct && shape === "t");
  const misses = !correct && key && miss ? { ...(one.miss ?? {}), [key]: miss } : one.miss;
  const next: QuizDays = {
    ...days,
    [day]: {
      n: one.n + 1,
      right: one.right + (correct ? 1 : 0),
      ...(wrong?.length ? { wrong } : {}),
      ...(okc?.length ? { okc } : {}),
      ...(okt?.length ? { okt } : {}),
      ...(wt?.length ? { wt } : {}),
      ...(misses && Object.keys(misses).length ? { miss: misses } : {}),
    },
  };
  const keys = Object.keys(next);
  if (keys.length <= KEEP_DAYS) return next;
  const order = keys.sort((a, b) => dayValue(a) - dayValue(b));
  for (const old of order.slice(0, keys.length - KEEP_DAYS)) delete next[old];
  return next;
}

/** src judge = 맞나 틀리나 판단(장부 출처만 다름 — 날 기록은 그대로). */
export function noteQuizDay(language: string, day: string, correct: boolean, key?: string, shape?: QuizShape, miss?: string, src: "quiz" | "judge" = "quiz"): void {
  try {
    localStorage.setItem(`${KEY}.${language}`, JSON.stringify(addQuizDay(readQuizDays(language), day, correct, key, shape, miss)));
    window.dispatchEvent(new CustomEvent("quiz-days", { detail: language }));
  } catch {
    // 이번에만.
  }
  // Logbank 사건 장부에도(같이 쓰기 — curriculum/logLedger.ts).
  if (key) noteLedger(language, [{ k: key, src, r: correct ? "ok" : "miss", ...(shape ? { m: shape === "t" ? "write" : "pick" } : {}) }]);
}

/** "2026-10-31" 같은 날(localDay) → 비교용 수. */
export function dayValue(day: string): number {
  const [y, m, d] = day.split("-").map(Number);
  return Date.UTC(y ?? 1970, (m ?? 1) - 1, d ?? 1);
}

/** 그 날이 든 주의 월요일(같은 주 묶기). */
export function weekOf(day: string): string {
  const value = dayValue(day);
  const weekday = (new Date(value).getUTCDay() + 6) % 7;
  const monday = new Date(value - weekday * 24 * 60 * 60 * 1000);
  return `${monday.getUTCFullYear()}-${monday.getUTCMonth() + 1}-${monday.getUTCDate()}`;
}

/** 그날 퀴즈 기록 지우기(Logbank 날짜 줄 🗑 · 틀린 것 카드 ×, 2026-11-01). wrongOnly면 틀린 열쇠만. */
export function clearQuizDay(language: string, day: string, wrongOnly = false): void {
  try {
    const days = readQuizDays(language);
    if (!days[day]) return;
    if (wrongOnly) {
      const rest = { ...days[day]! };
      delete rest.wrong;
      delete rest.wt;
      delete rest.miss;
      days[day] = rest;
    } else delete days[day];
    localStorage.setItem(`${KEY}.${language}`, JSON.stringify(days));
    window.dispatchEvent(new CustomEvent("quiz-days", { detail: language }));
  } catch {
    // 이번에만.
  }
}
