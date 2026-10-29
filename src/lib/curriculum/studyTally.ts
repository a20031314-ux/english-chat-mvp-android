/**
 * 오늘 계속 공부로 는 것(2026-10-29 사용자 "틈틈이 할 수 있되 할수록 실력이 늘도록" → "진행해줘"): 오늘 이미 앎이 된 열쇠·틀렸다가 맞힌 열쇠.
 * "▶ 계속 공부" 아래 한 줄(+n 앎 · 바로잡음 n). 이 폰에만, 날짜가 바뀌면 새로. 열쇠만(문장 없음).
 */
const KEY = "studyTally.v1";

export type Tally = { day: string; known: string[]; fixed: string[] };

export function readTally(language: string, day: string): Tally {
  try {
    const raw = JSON.parse(localStorage.getItem(`${KEY}.${language}`) ?? "null") as Tally | null;
    if (raw && raw.day === day && Array.isArray(raw.known) && Array.isArray(raw.fixed)) return raw;
  } catch {
    // 못 읽으면 오늘은 0부터.
  }
  return { day, known: [], fixed: [] };
}

/** 한 열쇠를 더한다(같은 날 같은 열쇠는 한 번). */
export function addTally(tally: Tally, add: { known?: string; fixed?: string }): Tally {
  const known = add.known && !tally.known.includes(add.known) ? [...tally.known, add.known] : tally.known;
  const fixed = add.fixed && !tally.fixed.includes(add.fixed) ? [...tally.fixed, add.fixed] : tally.fixed;
  return known === tally.known && fixed === tally.fixed ? tally : { ...tally, known, fixed };
}

export function saveTally(language: string, tally: Tally): void {
  try {
    localStorage.setItem(`${KEY}.${language}`, JSON.stringify(tally));
  } catch {
    // 이번에만.
  }
}
