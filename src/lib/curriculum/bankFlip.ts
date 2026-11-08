/**
 * Languagebank 넘겨 보기 순서(2026-11-08, 화면 studyMap/BankFlip): 모델·서버 없음, 이 판 안에서만.
 * - 시작: New·적용이 힘듦 먼저(묶음 순서 그대로), 알아요는 뒤. 한 판 최대 FLIP_MAX장.
 * - 알아요: 이 판에서 빠짐. 헷갈려요: 3~5장 뒤에 다시(그 낱말 두 번까지 — 세 번째 헷갈려요면 그냥 빠지고 끝의 Quizbank로).
 * - 스스로 누른 알아요는 체크 셋(장부)에 넣지 않는다 — 부르는 쪽도 기록하지 않음(사용자 2026-11-08).
 */
export const FLIP_MAX = 30;
export const FLIP_HIDES = ["meaning", "word", "example"] as const;
export type FlipHide = (typeof FLIP_HIDES)[number];
export type FlipRound = { queue: string[]; total: number; seen: number; known: string[]; unsure: string[]; again: Record<string, number> };

export function startFlip(words: readonly string[], level: (word: string) => "new" | "hard" | "known"): FlipRound {
  const unique = [...new Set(words)];
  const first = unique.filter((word) => level(word) !== "known");
  const later = unique.filter((word) => level(word) === "known");
  const queue = [...first, ...later].slice(0, FLIP_MAX);
  return { queue, total: queue.length, seen: 0, known: [], unsure: [], again: {} };
}

/** 지금 카드(queue[0])에 답한 뒤 다음 판. seed는 다시 넣는 자리(3~5장 뒤)를 고르는 데만. */
export function flipNext(round: FlipRound, known: boolean, seed: string): FlipRound {
  const [word, ...rest] = round.queue;
  if (!word) return round;
  if (known) {
    return { ...round, queue: rest, seen: round.seen + (round.again[word] ? 0 : 1), known: round.known.includes(word) ? round.known : [...round.known, word] };
  }
  const times = (round.again[word] ?? 0) + 1;
  const unsure = round.unsure.includes(word) ? round.unsure : [...round.unsure, word];
  const seen = round.seen + (round.again[word] ? 0 : 1);
  if (times > 2) return { ...round, queue: rest, seen, unsure, again: { ...round.again, [word]: times } };
  const gap = 3 + (hash(seed) % 3);
  const at = Math.min(gap, rest.length);
  return { ...round, queue: [...rest.slice(0, at), word, ...rest.slice(at)], seen, unsure, again: { ...round.again, [word]: times } };
}

function hash(text: string): number {
  let h = 0;
  for (let i = 0; i < text.length; i += 1) h = (h * 31 + text.charCodeAt(i)) >>> 0;
  return h;
}
