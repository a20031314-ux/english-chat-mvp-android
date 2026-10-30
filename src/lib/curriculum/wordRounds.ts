/**
 * 뜻 맞추기(WordMatch) 판 나누기 — 판 하나는 같은 품사 낱말만(사용자 2026-10-30 "선지가 다수일 시 다 같은 품사로").
 * 품사마다 size개씩 끊어 꽉 찬 판만 이어 붙이고(판이 한 바퀴 돌아도 섞이지 않게), 꽉 찬 판이 없으면 가장 큰 품사 묶음 하나만.
 * 품사를 모르는 낱말은 그 자체로 한 묶음("?").
 */
export function samePosRounds<T extends { word: string }>(pairs: readonly T[], posOf: (word: string) => string | undefined, size: number): T[] {
  const buckets = new Map<string, T[]>();
  for (const pair of pairs) {
    const group = posOf(pair.word) ?? "?";
    buckets.set(group, [...(buckets.get(group) ?? []), pair]);
  }
  const full: T[] = [];
  for (const list of buckets.values()) {
    for (let at = 0; at + size <= list.length; at += size) full.push(...list.slice(at, at + size));
  }
  if (full.length) return full;
  return [...buckets.values()].reduce<T[]>((best, list) => (list.length > best.length ? list : best), []);
}
