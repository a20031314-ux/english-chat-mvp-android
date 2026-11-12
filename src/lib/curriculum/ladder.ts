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

/**
 * 진단 칩(설계안 §6, 사용자 2026-11-10 "보이게 하되 학습에 방해가 되지 않게"): 최근 14일 퀴즈에서 두 번 이상 틀렸고 마지막 답도 틀린 열쇠,
 * 틀린 수 많은 차례로 셋까지. 숫자는 화면에 안 냄(이름만, Logbank — 문제를 푸는 중엔 안 보임).
 */
export function weakKeys(events: readonly { k: string; src: string; r: string; t: number }[], now: number, n = 3): string[] {
  const since = now - WEAK_DAYS * 86400;
  const miss = new Map<string, number>();
  const last = new Map<string, { r: string; t: number }>();
  for (const event of events) {
    if (event.t < since || (event.src !== "quiz" && event.src !== "exam") || (event.r !== "ok" && event.r !== "miss") || !kindOf(event.k)) continue;
    if (event.r === "miss") miss.set(event.k, (miss.get(event.k) ?? 0) + 1);
    if ((last.get(event.k)?.t ?? -1) <= event.t) last.set(event.k, { r: event.r, t: event.t });
  }
  return [...miss]
    .filter(([key, count]) => count >= 2 && last.get(key)?.r === "miss")
    .sort((a, b) => b[1] - a[1] || (last.get(b[0])?.t ?? 0) - (last.get(a[0])?.t ?? 0))
    .slice(0, n)
    .map(([key]) => key);
}

/* ───────── 게이지(6단계, 설계안 §5 — 사용자 2026-11-10 "학습자가 게이지로 난이도를 조절") ───────── */

/** −2(많이 쉽게) … 0(지금 단계) … +2(많이 어렵게). 이 폰, 언어마다. */
export type Gauge = -2 | -1 | 0 | 1 | 2;
const GAUGE_KEY = "gauge.v1";

export function readGauge(language: string): Gauge {
  try {
    const n = Number(typeof localStorage === "undefined" ? 0 : localStorage.getItem(`${GAUGE_KEY}.${language}`) ?? 0);
    return (Number.isInteger(n) && n >= -2 && n <= 2 ? n : 0) as Gauge;
  } catch {
    return 0;
  }
}

export function saveGauge(language: string, gauge: Gauge): void {
  try {
    if (typeof localStorage !== "undefined") localStorage.setItem(`${GAUGE_KEY}.${language}`, String(gauge));
  } catch {
    // 이번에만.
  }
}

/** 게이지로 낼 칸: 내리면 낮은 칸에 머물고(−2 → 2칸까지, −1 → 3칸까지), 올리면 위 칸부터(+1 → 2칸부터, +2 → 3칸부터). 사다리 기록은 그대로. */
export function gaugeRung(current: number, gauge: Gauge): number {
  if (current >= DONE) return current;
  if (gauge <= -2) return Math.min(current, 2);
  if (gauge === -1) return Math.min(current, 3);
  if (gauge === 1) return Math.max(current, 2);
  if (gauge >= 2) return Math.max(current, 3);
  return current;
}

/** 쓰기 도움: 내리면 첫 글자 + 글자 수, 많이 올리면 없음, 그 사이 첫 글자. */
export function gaugeCue(gauge: Gauge): "len" | "none" | undefined {
  return gauge <= -1 ? "len" : gauge >= 2 ? "none" : undefined;
}

/** 틀린 곳 한 문장: 가운데까지 선지(밑줄), 올리면 표시 없음. */
export function gaugeNumbered(gauge: Gauge): boolean {
  return gauge <= 0;
}

/* ───────── 문단(5단계, 설계안 §4 문단 안 난이도 넷) ───────── */

const PARA_KEY = "para.v1";
export type ParaState = { lv: number; day: string; n: number };

/** 단계별 기본 문단 난이도(1~2단계 P1, 3단계 P2, 4~5단계 P3) — 게이지 올리면 한 칸 위. */
export function startParaLevel(stage: number): number {
  return stage <= 2 ? 1 : stage === 3 ? 2 : 3;
}

export function readPara(language: string, stage: number): ParaState {
  try {
    const raw = typeof localStorage === "undefined" ? null : localStorage.getItem(`${PARA_KEY}.${language}`);
    const one = raw ? (JSON.parse(raw) as ParaState) : null;
    if (one && one.lv >= 1 && one.lv <= 4) return one;
  } catch {
    // 처음.
  }
  return { lv: startParaLevel(stage), day: "", n: 0 };
}

export function savePara(language: string, state: ParaState): void {
  try {
    if (typeof localStorage !== "undefined") localStorage.setItem(`${PARA_KEY}.${language}`, JSON.stringify(state));
  } catch {
    // 이번에만.
  }
}

/** 이번 새 묶음에 문단을 낼까: 하루 둘까지, 1~2단계는 네 묶음에 하나, 3단계는 둘에 하나, 4~5단계는 묶음마다. */
export function paraDue(stage: number, round: number, state: ParaState, today: string): boolean {
  if (state.day === today && state.n >= 2) return false;
  const every = stage <= 2 ? 4 : stage === 3 ? 2 : 1;
  return round % every === 0;
}

/** 문단 답 → 다음 난이도: 다 맞히면 한 칸 위, 둘 이상 놓치면 한 칸 아래. */
export function stepPara(state: ParaState, today: string, errors: number, missed: number): ParaState {
  const lv = missed === 0 ? Math.min(4, state.lv + 1) : missed >= 2 || missed >= errors ? Math.max(1, state.lv - 1) : state.lv;
  return { lv, day: today, n: (state.day === today ? state.n : 0) + 1 };
}

/** 지난 REST_HOURS 동안 마지막 답이 맞음이었던 열쇠(퀴즈·첫 측정) — 새 묶음에서 그날은 쉰다. 틀린 것은 다시 볼 것으로 따로 나옴. */
export const REST_HOURS = 20;
export function rightToday(events: readonly { k: string; src: string; r: string; t: number }[], now: number): Set<string> {
  const since = now - REST_HOURS * 3600;
  const last = new Map<string, { r: string; t: number }>();
  for (const event of events) {
    if (event.t < since || (event.src !== "quiz" && event.src !== "exam") || (event.r !== "ok" && event.r !== "miss")) continue;
    if ((last.get(event.k)?.t ?? -1) <= event.t) last.set(event.k, { r: event.r, t: event.t });
  }
  return new Set([...last].filter(([, one]) => one.r === "ok").map(([key]) => key));
}
