/**
 * 문법·표현 사다리와 종류 비율(퀴즈 다시 짜기 4단계, hub/work/drafts/quiz-redesign-2026-11-10.md §3·§8). 순수 — 저장은 이 폰 localStorage만.
 *
 * 칸(g|·e|·f|)마다 사다리 칸 하나(사용자 2026-11-24 "문장 쓰기는 무슨 소재를 학습하는지 불명확 — 고르기를 고도화하고 빈칸·틀린 곳으로"):
 *   1 고르기 — 맞는 꼴·문맥·뜻 차이·틀린 문장(ladderQuiz.ts)   2 빈칸 쓰기 — 그 문법 자리만 쓰기
 *   3 틀린 곳 — 찾아 고치기(그 칸 문항이 있을 때만, 없으면 2에서 끝)
 * 맞히면 다음 칸, 틀리면 그 칸에서 다른 문장으로. 3을 맞히면 끝(DONE). 문장 전체 쓰기는 대화(통화·채팅·대화 채우기)가 맡는다.
 * 순서는 유형 먼저(axisOf): 모든 칸의 고르기를 1~5단계로 → 빈칸 1~5단계 → 틀린 곳 1~5단계 → 다음 회차.
 * 낱말(w|)은 사다리 없음(한 모양, 3단계).
 *
 * 종류 비율(§8, 사용자 2026-11-10 "학습자가 뭐가 부족한지에 따라 비율이 변하도록"): 출발 단어 40 · 문법 35 · 표현 25(1~2단계 50 · 30 · 20),
 * 최근 14일 퀴즈 답의 종류별 틀린 비율이 평균보다 높은 쪽으로 옮김(10%p마다 5%p), 한 종류 15~60%.
 */
export type Rung = 1 | 2 | 3;
export const DONE = 4;
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
  // 옛 4칸 사다리(문장 쓰기·끝 5)는 지금 끝(4)으로.
  return typeof at === "number" && at >= 1 ? Math.min(at, DONE) : 1;
}

/** 답 하나 → 사다리. 맞음 = 낸 칸 + 1(앞 칸을 건너뛰었으면 그다음), 틀림 = 낸 칸 그대로. */
export function stepLadder(ladder: Ladder, key: string, rung: number, correct: boolean): Ladder {
  const next = correct ? Math.min(DONE, rung + 1) : rung;
  return { ...ladder, [key]: Math.max(next, correct ? rungOf(ladder, key) : 1) };
}

/** 낼 칸: 지금 칸부터 낼 수 있는 첫 칸(3은 틀린 곳 문항이 있을 때만). 끝났으면 null. */
export function askRung(current: number, can: (rung: Rung) => boolean): Rung | null {
  for (let rung = Math.max(1, current); rung < DONE; rung += 1) if (can(rung as Rung)) return rung as Rung;
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

/** 잠깐 줄이기 기준: 최근 이틀 안 그 종류의 마지막 답들이 연달아 맞음이면(사용자 2026-11-24 "문법 문제를 다 맞히면 문법 비율을 일시적으로 줄이는 식"). */
export const RUN_HOURS = 48;
/** 연달아 맞힌 수 → 그 종류 몫에서 뺄 %p(틀리면 0으로, 이틀이 지나면 사라짐). */
export function runCut(run: number): number {
  return run >= 10 ? 20 : run >= 5 ? 10 : 0;
}

/** 종류마다 최근 이틀 안의 마지막 퀴즈 답부터 거꾸로 센 연달아 맞음. 순수. */
export function recentRuns(events: readonly { k: string; src: string; r: string; t: number }[], now: number): Record<Kind, number> {
  const since = now - RUN_HOURS * 3600;
  const out: Record<Kind, number> = { w: 0, g: 0, e: 0 };
  const stopped: Record<Kind, boolean> = { w: false, g: false, e: false };
  for (let i = events.length - 1; i >= 0; i -= 1) {
    const event = events[i]!;
    if (event.t < since) break;
    if (event.src !== "quiz" || (event.r !== "ok" && event.r !== "miss")) continue;
    const kind = kindOf(event.k);
    if (!kind || stopped[kind]) continue;
    if (event.r === "ok") out[kind] += 1;
    else stopped[kind] = true;
  }
  return out;
}

/** 종류 비율(%, 합 100) — 출발값에서 약한 쪽으로(14일 틀린 비율), 요즘 연달아 다 맞힌 종류는 잠깐 줄임(runs). */
export function kindShares(stage: number, rates: Record<Kind, number | null>, runs?: Record<Kind, number>): Record<Kind, number> {
  const base = stage <= 2 ? KIND_BASE_LOW : KIND_BASE;
  const known = KINDS.filter((kind) => rates[kind] !== null);
  const mean = known.length ? known.reduce((sum, kind) => sum + (rates[kind] as number), 0) / known.length : 0;
  const raw = Object.fromEntries(KINDS.map((kind) => {
    const r = rates[kind];
    const shift = r === null || known.length < 2 ? 0 : Math.round(((r - mean) * 100) / 10) * 5;
    return [kind, Math.min(60, Math.max(15, base[kind] + shift - runCut(runs?.[kind] ?? 0)))];
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

/**
 * 문법·표현이 닿은 단계(사용자 2026-11-24 "1년을 풀어도 1단계?"): 첫 측정 단계에서 출발해, 지금 닿은 단계 이상의 칸 답을
 * REACH_BATCH개 모아 맞힌 비율이 REACH_UP 이상이면 한 단계 위, REACH_DOWN 이하면 한 단계 아래(첫 측정 단계 밑으로는 안 내려감).
 * 새 묶음은 이 단계 칸부터 내고 다 풀면 아래 단계 — 단어 수준 경계처럼 퀴즈로 실제 실력을 따라간다. 이 폰 reach.v1.<언어>.
 */
export type Reach = { s: number; n: number; ok: number };
const REACH_KEY = "reach.v1";
export const REACH_BATCH = 8;
export const REACH_UP = 0.8;
export const REACH_DOWN = 0.4;
export const REACH_TOP = 5;

export function stepReach(reach: Reach, base: number, itemStage: number, correct: boolean): Reach {
  const floor = Math.max(1, base);
  const now = Math.max(floor, Math.min(REACH_TOP, reach.s));
  if (itemStage < now) return { ...reach, s: now };
  const n = reach.n + 1;
  const ok = reach.ok + (correct ? 1 : 0);
  if (n < REACH_BATCH) return { s: now, n, ok };
  const rate = ok / n;
  const s = rate >= REACH_UP ? Math.min(REACH_TOP, now + 1) : rate <= REACH_DOWN ? Math.max(floor, now - 1) : now;
  return { s, n: 0, ok: 0 };
}

export function readReach(language: string, base: number): Reach {
  try {
    const raw = typeof localStorage === "undefined" ? null : localStorage.getItem(`${REACH_KEY}.${language}`);
    const one = raw ? (JSON.parse(raw) as Reach) : null;
    if (one && typeof one.s === "number") return { s: Math.max(base, Math.min(REACH_TOP, one.s)), n: one.n || 0, ok: one.ok || 0 };
  } catch {
    // 처음.
  }
  return { s: Math.max(1, base), n: 0, ok: 0 };
}

export function saveReach(language: string, reach: Reach): void {
  try {
    if (typeof localStorage !== "undefined") localStorage.setItem(`${REACH_KEY}.${language}`, JSON.stringify(reach));
  } catch {
    // 이번에만.
  }
}

/** 게이지가 단어 수준 경계에 주는 배수(사용자 2026-11-24 — 게이지가 단어에도). */
export function gaugeWordScale(gauge: Gauge): number {
  return gauge <= -2 ? 0.6 : gauge === -1 ? 0.8 : gauge === 1 ? 1.25 : gauge >= 2 ? 1.6 : 1;
}

/**
 * 지금 단계 칸을 다 끝냈으면 통과로 쳐서 위로(사용자 2026-11-24 "위로 안 올라가는 건 원인이 뭐야" — 1년 시뮬레이션에서 단계가 4에 멈춤):
 * 단계는 지금 단계 이상 칸의 답으로만 움직이는데, 지금 단계 칸이 다 끝나면 아래 칸만 나와 답이 안 쌓였다.
 * open(stage) = 그 단계에 아직 안 끝난 칸이 있나(그날 쉬는 칸도 안 끝난 칸). 순수.
 */
export function climbCleared(reach: Reach, base: number, open: (stage: number) => boolean): Reach {
  let s = Math.max(Math.max(1, base), Math.min(REACH_TOP, reach.s));
  if (open(s)) return s === reach.s ? reach : { ...reach, s };
  while (s < REACH_TOP && !open(s)) s += 1;
  return { s, n: 0, ok: 0 };
}

/**
 * 회차(사용자 2026-11-24 "번들로 1~5단계까지 쭉, 다 맞히면 또 다른 번들"): 1~5단계 칸을 다 끝내면 새 문장이 있는 칸만 다시 1칸부터 —
 * 맞힌 문제를 다시 내는 게 아니라 같은 칸의 다른 문장(바꾼 사전 예문·문제은행이 만든 문장)으로. 끝낸 칸의 문장은 used에 남겨 다음 회차에 안 낸다.
 * 이 폰 quizRound.v1.<언어>.
 */
export type QuizRound = { r: number; used: Record<string, string[]>; /** 지난 묶음의 축 — 바뀌면 단계를 첫 측정 단계부터 다시. */ a?: number };
const ROUND_KEY = "quizRound.v1";

export function readRound(language: string): QuizRound {
  try {
    const raw = typeof localStorage === "undefined" ? null : localStorage.getItem(`${ROUND_KEY}.${language}`);
    const one = raw ? (JSON.parse(raw) as QuizRound) : null;
    if (one && typeof one.r === "number" && one.used && typeof one.used === "object") return one;
  } catch {
    // 처음.
  }
  return { r: 1, used: {} };
}

export function saveRound(language: string, round: QuizRound): void {
  try {
    if (typeof localStorage !== "undefined") localStorage.setItem(`${ROUND_KEY}.${language}`, JSON.stringify(round));
  } catch {
    // 이번에만.
  }
}

/** 칸 하나를 끝냈을 때 그 회차에 낸 문장을 남긴다(최근 40개). 순수. */
export function noteRoundUsed(round: QuizRound, key: string, lines: readonly string[]): QuizRound {
  if (!lines.length) return round;
  const list = [...new Set([...(round.used[key] ?? []), ...lines])].slice(-40);
  return { ...round, used: { ...round.used, [key]: list } };
}

/**
 * 다음 회차를 열까: 모든 칸이 끝났고(keys 전부 DONE) 새 문장이 있는 칸이 하나라도 있으면 — 그 칸들의 사다리를 지우고 회차 +1.
 * fresh(key) = 그 칸에 used에 없는 문장이 있나. 돌려줌: 바뀌었으면 새 사다리·회차, 아니면 null. 순수.
 */
export function nextRound(keys: readonly string[], ladder: Ladder, round: QuizRound, fresh: (key: string) => boolean): { ladder: Ladder; round: QuizRound; reopened: string[] } | null {
  if (!keys.length || keys.some((key) => rungOf(ladder, key) < DONE)) return null;
  const reopened = keys.filter(fresh);
  if (!reopened.length) return null;
  const next = { ...ladder };
  for (const key of reopened) delete next[key];
  return { ladder: next, round: { ...round, r: round.r + 1 }, reopened };
}

/**
 * 유형 먼저(사용자 2026-11-24 "고르기에서 맞힌 문제는 바로 다음 단계로, 각 축에서 1~5단계를 다 맞히면 같은 소재의 다른 유형"):
 * 지금 축 = 아직 안 끝난 칸들의 가장 낮은 사다리 칸. 그 축의 칸만 1~5단계 차례로 내고, 축의 칸을 다 지나면 다음 축. 다 끝났으면 null. 순수.
 */
export function axisOf(keys: readonly string[], ladder: Ladder): Rung | null {
  let low = DONE;
  for (const key of keys) low = Math.min(low, rungOf(ladder, key));
  return low >= DONE ? null : (low as Rung);
}
