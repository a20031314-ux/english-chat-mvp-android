/**
 * 문법·표현 사다리와 종류 비율(퀴즈 다시 짜기 4단계, hub/work/drafts/quiz-redesign-2026-11-10.md §3·§8). 순수 — 저장은 이 폰 localStorage만.
 *
 * 칸(g|·e|·f|)마다 사다리 칸 하나:
 *   1 알아보기 — 맞는 꼴 고르기          2 꼴 만들기 — 빈칸 쓰기(첫 글자 도움)
 *   3 틀린 곳 — 고르고 고치기(고정 데이터 spot-errors, 그 칸 문항이 있을 때만)
 *   4 문장 만들기 — 뜻만 보고 문장 전체 쓰기
 * 맞히면 다음 칸, 틀리면 그 칸에서 다른 문장으로(설계안 §3). 4를 맞히면 끝(DONE) — 새 묶음에서 쉬고, 틀린 것은 다시 볼 것으로.
 * 낱말(w|)은 사다리 없음(한 모양, 3단계).
 *
 * 종류 비율(§8, 사용자 2026-11-10 "학습자가 뭐가 부족한지에 따라 비율이 변하도록"): 출발 단어 40 · 문법 35 · 표현 25(1~2단계 50 · 30 · 20),
 * 최근 14일 퀴즈 답의 종류별 틀린 비율이 평균보다 높은 쪽으로 옮김(10%p마다 5%p), 한 종류 15~60%.
 */
export type Rung = 1 | 2 | 3 | 4;
export const DONE = 5;
export type Kind = "w" | "g" | "e";

const KEY = "ladder.v1";

export function kindOf(key: string): Kind | null {
  if (key.startsWith("w|")) return "w";
  if (key.startsWith("g|") || key.startsWith("f|")) return "g";
  if (key.startsWith("e|")) return "e";
  return null;
}

export type Ladder = Record<string, number>;

export function readLadder(language: string): Ladder {
  try {
    const raw = typeof localStorage === "undefined" ? null : localStorage.getItem(`${KEY}.${language}`);
    const parsed = raw ? (JSON.parse(raw) as unknown) : null;
    return parsed && typeof parsed === "object" ? (parsed as Ladder) : {};
  } catch {
    return {};
  }
}

export function saveLadder(language: string, ladder: Ladder): void {
  try {
    if (typeof localStorage !== "undefined") localStorage.setItem(`${KEY}.${language}`, JSON.stringify(ladder));
  } catch {
    // 이번에만.
  }
}

/** 지금 칸(없으면 1). */
export function rungOf(ladder: Ladder, key: string): number {
  const at = ladder[key];
  return typeof at === "number" && at >= 1 && at <= DONE ? at : 1;
}

/** 답 하나 → 사다리. 맞음 = 낸 칸 + 1(앞 칸을 건너뛰었으면 그다음), 틀림 = 낸 칸 그대로. */
export function stepLadder(ladder: Ladder, key: string, rung: number, correct: boolean): Ladder {
  const next = correct ? Math.min(DONE, rung + 1) : rung;
  return { ...ladder, [key]: Math.max(next, correct ? rungOf(ladder, key) : 1) };
}

/** 낼 칸: 지금 칸부터 낼 수 있는 첫 칸(3은 틀린 곳 문항이 있을 때만). 끝났으면 null. */
export function askRung(current: number, can: (rung: Rung) => boolean): Rung | null {
  for (let rung = Math.max(1, current); rung <= 4; rung += 1) if (can(rung as Rung)) return rung as Rung;
  return null;
}

export const KIND_BASE: Record<Kind, number> = { w: 40, g: 35, e: 25 };
export const KIND_BASE_LOW: Record<Kind, number> = { w: 50, g: 30, e: 20 };
const KINDS: Kind[] = ["w", "g", "e"];
export const WEAK_DAYS = 14;
const MIN_ANSWERS = 5;

/** 종류별 최근 틀린 비율(퀴즈·첫 측정 답, 이 기간에 답이 다섯 안 되는 종류는 null). */
export function missRates(events: readonly { k: string; src: string; r: string; t: number }[], now: number): Record<Kind, number | null> {
  const since = now - WEAK_DAYS * 86400;
  const tally: Record<Kind, { n: number; miss: number }> = { w: { n: 0, miss: 0 }, g: { n: 0, miss: 0 }, e: { n: 0, miss: 0 } };
  for (const event of events) {
    if (event.t < since || (event.src !== "quiz" && event.src !== "exam") || (event.r !== "ok" && event.r !== "miss")) continue;
    const kind = kindOf(event.k);
    if (!kind) continue;
    tally[kind].n += 1;
    if (event.r === "miss") tally[kind].miss += 1;
  }
  return { w: rate(tally.w), g: rate(tally.g), e: rate(tally.e) };
}
const rate = (one: { n: number; miss: number }) => (one.n >= MIN_ANSWERS ? one.miss / one.n : null);

/** 종류 비율(%, 합 100) — 출발값에서 약한 쪽으로. */
export function kindShares(stage: number, rates: Record<Kind, number | null>): Record<Kind, number> {
  const base = stage <= 2 ? KIND_BASE_LOW : KIND_BASE;
  const known = KINDS.filter((kind) => rates[kind] !== null);
  const mean = known.length ? known.reduce((sum, kind) => sum + (rates[kind] as number), 0) / known.length : 0;
  const raw = Object.fromEntries(KINDS.map((kind) => {
    const r = rates[kind];
    const shift = r === null || known.length < 2 ? 0 : Math.round(((r - mean) * 100) / 10) * 5;
    return [kind, Math.min(60, Math.max(15, base[kind] + shift))];
  })) as Record<Kind, number>;
  const total = KINDS.reduce((sum, kind) => sum + raw[kind], 0);
  return Object.fromEntries(KINDS.map((kind) => [kind, (raw[kind] * 100) / total])) as Record<Kind, number>;
}

/** 묶음 size개를 비율대로(가장 큰 나머지, 종류마다 적어도 하나 — size ≥ 3일 때). */
export function kindCounts(size: number, shares: Record<Kind, number>): Record<Kind, number> {
  const exact = KINDS.map((kind) => ({ kind, v: (shares[kind] * size) / 100 }));
  const out = Object.fromEntries(exact.map((one) => [one.kind, Math.floor(one.v)])) as Record<Kind, number>;
  let left = size - KINDS.reduce((sum, kind) => sum + out[kind], 0);
  for (const one of [...exact].sort((a, b) => (b.v % 1) - (a.v % 1))) {
    if (left <= 0) break;
    out[one.kind] += 1;
    left -= 1;
  }
  if (size >= 3) {
    for (const kind of KINDS) {
      if (out[kind] > 0) continue;
      const most = KINDS.reduce((a, b) => (out[a] >= out[b] ? a : b));
      out[most] -= 1;
      out[kind] = 1;
    }
  }
  return out;
}
