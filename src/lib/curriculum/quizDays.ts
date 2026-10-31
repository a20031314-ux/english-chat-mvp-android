/**
 * 날마다 푼 퀴즈 수·맞힌 수(2026-10-31 Logbank — 사용자 "복습 칸 자리에 날마다·주마다 배운 것 정리, AI 없이 목록만").
 * 이 폰에만, 언어마다, 최근 60일. 수와 그날 틀린 열쇠(낱말·표현·틀 이름 — 학습자 문장 아님)만.
 */
const KEY = "quizDays.v1";
const KEEP_DAYS = 60;

/** wrong: 그날 틀린 열쇠(w|·e|·f|…, 서른 개까지) — Logbank 그날 칸에 "틀린 것"으로(2026-11-01). */
export type QuizDays = Record<string, { n: number; right: number; wrong?: string[] }>;

export function readQuizDays(language: string): QuizDays {
  try {
    const raw = JSON.parse(localStorage.getItem(`${KEY}.${language}`) ?? "null") as QuizDays | null;
    return raw && typeof raw === "object" ? raw : {};
  } catch {
    return {};
  }
}

/** 하루 칸에 한 문제를 더한다(오래된 날은 지움). 순수 — 저장은 saveQuizDays. */
export function addQuizDay(days: QuizDays, day: string, correct: boolean, key?: string): QuizDays {
  const one = days[day] ?? { n: 0, right: 0 };
  const wrong = !correct && key && !(one.wrong ?? []).includes(key) ? [...(one.wrong ?? []), key].slice(-30) : one.wrong;
  const next: QuizDays = { ...days, [day]: { n: one.n + 1, right: one.right + (correct ? 1 : 0), ...(wrong?.length ? { wrong } : {}) } };
  const keys = Object.keys(next);
  if (keys.length <= KEEP_DAYS) return next;
  const order = keys.sort((a, b) => dayValue(a) - dayValue(b));
  for (const old of order.slice(0, keys.length - KEEP_DAYS)) delete next[old];
  return next;
}

export function noteQuizDay(language: string, day: string, correct: boolean, key?: string): void {
  try {
    localStorage.setItem(`${KEY}.${language}`, JSON.stringify(addQuizDay(readQuizDays(language), day, correct, key)));
    window.dispatchEvent(new CustomEvent("quiz-days", { detail: language }));
  } catch {
    // 이번에만.
  }
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
      days[day] = { n: days[day]!.n, right: days[day]!.right };
    } else delete days[day];
    localStorage.setItem(`${KEY}.${language}`, JSON.stringify(days));
    window.dispatchEvent(new CustomEvent("quiz-days", { detail: language }));
  } catch {
    // 이번에만.
  }
}
