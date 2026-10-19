/**
 * 무료 오늘의 팩: 7일 동안 며칠까지(billing/plans.ts packDaysPerWeek, 흑자 구조 2026-10-20).
 * 언어를 바꿔도 같은 날은 하루로 센다. 날은 학습자의 날(YYYY-MM-DD).
 * Pure: 서버(api/pack/today)와 테스트가 같이 쓴다.
 */

const DAY_MS = 24 * 60 * 60 * 1000;

function dayIndex(day: string): number {
  return Math.floor(Date.parse(`${day.slice(0, 10)}T00:00:00Z`) / DAY_MS);
}

function dayOf(index: number): string {
  return new Date(index * DAY_MS).toISOString().slice(0, 10);
}

/** 오늘 포함 최근 7일 안에 팩을 연 날(오늘 빼고), 오래된 순. */
export function packDaysInWeek(used: string[], today: string): string[] {
  const t = dayIndex(today);
  const days = [...new Set(used.map((d) => d.slice(0, 10)))].filter((d) => {
    const i = dayIndex(d);
    return Number.isFinite(i) && i < t && i > t - 7;
  });
  return days.sort();
}

export type PackWeekGate = { open: true } | { open: false; nextDay: string };

/** 오늘 새 팩을 열 수 있는지. 못 열면 다음에 열리는 날. */
export function packWeekGate(used: string[], today: string, perWeek: number): PackWeekGate {
  const recent = packDaysInWeek(used, today);
  if (used.some((d) => d.slice(0, 10) === today.slice(0, 10))) return { open: true };
  if (recent.length < perWeek) return { open: true };
  // 가장 오래된 날이 7일 창을 벗어나는 날부터 다시 열린다.
  const oldest = recent[recent.length - perWeek];
  return { open: false, nextDay: dayOf(dayIndex(oldest) + 7) };
}

/** 기록에 오늘을 더하고 2주 넘은 날은 버린다. */
export function notePackDay(used: string[], today: string): string[] {
  const t = dayIndex(today);
  return [...new Set([...used.map((d) => d.slice(0, 10)), today.slice(0, 10)])].filter((d) => dayIndex(d) > t - 14).sort();
}
