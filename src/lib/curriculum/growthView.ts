/**
 * "늘었어요" 재료(2026-11-07 사용자 "포인트 말고 오늘 학습한 단어 N개 식으로도" · "틀렸던 문장 > 이후 배워서 활용한 문장" →
 * "진행해줘"). 순수 모듈 — 장부(logLedger.ts)와 이 폰의 대화 문장(growthLines.ts)에서.
 *
 * 개수(기간 안) — Logbank 표는 학습·활용 두 칸(2026-11-07 밤 사용자 "익힘은 삭제, 다시 맞힌 것은 학습으로, 대화에서 쓴 것은 활용으로"):
 *   학습     그 기간에 푼 열쇠(처음이든 다시든, 맞든 틀리든 — 퀴즈·시험·대본)
 *   새로     그 열쇠를 처음 푼 답(퀴즈·시험·대본)이 기간 안
 *   익힘     체크 셋이 처음으로 앎이 된 때가 기간 안(checkState.ts stepState)
 *   다시 맞힘 앞서 틀린 열쇠를 다른 날 맞히거나 대화에서 씀 — 그 첫 맞음이 기간 안
 *   써 봄    통화·채팅·사람 대화에서 내가 맞게 쓴 열쇠(used)가 기간 안
 *   앎       지금 앎인 열쇠 전체(누적, 기간과 상관없음)
 * 고쳐 씀(짝): 대화에서 고쳐진 내 줄(틀린 꼴 → 바른 꼴) 뒤, 다른 날 대화에서 그 열쇠를 내가 먼저 맞게 쓴 줄.
 */
import type { LogEvent } from "./logLedger.ts";
import { dayOfSeconds, stepState, type CheckState } from "./checkState.ts";
import { partOf } from "./todayCards.ts";

export type ProgressCounts = { studied: string[]; fresh: string[]; learned: string[]; recovered: string[]; used: string[]; known: string[] };

const answered = (event: LogEvent) => (event.src === "quiz" || event.src === "exam" || event.src === "script") && (event.r === "ok" || event.r === "miss");
const talked = (event: LogEvent) => event.src === "call" || event.src === "people" || event.src === "chat";

/** 기간(inDay — 시각(초)이 기간 안인가)의 개수. 열쇠마다 한 번, 늦게 일어난 것부터. */
export function progressIn(events: readonly LogEvent[], inDay: (t: number) => boolean, dayOf: (t: number) => string = (t) => dayOfSeconds(t)): ProgressCounts {
  const byKey = new Map<string, LogEvent[]>();
  for (const event of events) {
    if (!partOf(event.k)) continue;
    const list = byKey.get(event.k);
    if (list) list.push(event);
    else byKey.set(event.k, [event]);
  }
  const at = { studied: new Map<string, number>(), fresh: new Map<string, number>(), learned: new Map<string, number>(), recovered: new Map<string, number>(), used: new Map<string, number>() };
  const known: [string, number][] = [];
  for (const [key, list] of byKey) {
    list.sort((a, b) => a.t - b.t);
    let state: CheckState = { level: "new", step: 0, last: 0 };
    let wasKnown = false;
    let firstAnswer = true;
    let missDay: string | null = null;
    for (const event of list) {
      if (answered(event) && inDay(event.t)) at.studied.set(key, event.t);
      if (answered(event) && firstAnswer) {
        firstAnswer = false;
        if (inDay(event.t)) at.fresh.set(key, event.t);
      }
      if (event.r === "miss") missDay = missDay ?? dayOf(event.t);
      else if ((event.r === "ok" || event.r === "used") && missDay !== null && dayOf(event.t) !== missDay) {
        if (inDay(event.t)) at.recovered.set(key, event.t);
        missDay = null;
      }
      if (event.r === "used" && talked(event) && inDay(event.t)) at.used.set(key, event.t);
      state = stepState(state, event, dayOf);
      if (state.level === "known" && !wasKnown) {
        wasKnown = true;
        if (inDay(event.t)) at.learned.set(key, event.t);
      }
    }
    if (state.level === "known") known.push([key, state.last]);
  }
  const order = (map: Map<string, number>) => [...map].sort((a, b) => b[1] - a[1]).map(([key]) => key);
  return { studied: order(at.studied), fresh: order(at.fresh), learned: order(at.learned), recovered: order(at.recovered), used: order(at.used), known: known.sort((a, b) => b[1] - a[1]).map(([key]) => key) };
}

/** 그 시각(초)까지의 답으로 앎인 열쇠 수 — 학습 곡선 선(누적). */
export function knownAt(events: readonly LogEvent[], until: number, dayOf: (t: number) => string = (t) => dayOfSeconds(t)): number {
  return progressIn(events.filter((event) => event.t <= until), () => false, dayOf).known.length;
}

/* ───────── 고쳐 씀 — 틀린 문장 → 다른 날 맞게 쓴 문장 ───────── */

export type TalkSource = "call" | "chat" | "people";
/** 대화에서 고쳐진 내 줄: 열쇠(고친 꼴에만 든 것) · 틀린 꼴 · 바른 꼴 · 시각(초). */
export type MissLine = { k: string[]; w: string; r: string; t: number; s: TalkSource };
/** 대화에서 고쳐지지 않은 내 줄: 쓴 열쇠 · 문장 · 시각(초). */
export type UsedLine = { k: string[]; x: string; t: number; s: TalkSource };
export type GrowthPair = { key: string; miss: MissLine; used: UsedLine };

/** 열쇠 무게: 문장구조·문법·표현이 낱말보다 앞(고친 꼴을 그대로 다시 쓴 게 보이는 것). */
const keyRank = (key: string) => (key.startsWith("f|") ? 0 : key.startsWith("g|") ? 1 : key.startsWith("e|") ? 2 : 3);
const norm = (text: string) => text.toLocaleLowerCase().replace(/[^\p{L}\p{M}\p{N}]+/gu, "");

/**
 * 틀린 줄마다 짝 하나: 그 뒤 다른 날, 같은 열쇠를 쓴 고쳐지지 않은 내 줄 가운데 가장 이른 것(열쇠는 문장구조 먼저).
 * 쓴 줄 하나는 짝 하나에만. 바른 꼴을 그대로 따라 한 줄(같은 문장)은 셈하지 않는다. 늦게 쓴 것부터.
 */
export function growthPairs(misses: readonly MissLine[], useds: readonly UsedLine[], dayOf: (t: number) => string = (t) => dayOfSeconds(t)): GrowthPair[] {
  const usedSorted = [...useds].sort((a, b) => a.t - b.t);
  const taken = new Set<UsedLine>();
  const pairs: GrowthPair[] = [];
  for (const miss of [...misses].sort((a, b) => a.t - b.t)) {
    const day = dayOf(miss.t);
    const keys = [...miss.k].sort((a, b) => keyRank(a) - keyRank(b));
    let found: GrowthPair | null = null;
    for (const key of keys) {
      const used = usedSorted.find((one) => !taken.has(one) && one.t > miss.t && dayOf(one.t) !== day && one.k.includes(key) && norm(one.x) !== norm(miss.r));
      if (used && (!found || used.t < found.used.t || keyRank(key) < keyRank(found.key))) {
        found = { key, miss, used };
        if (keyRank(key) < 3) break;
      }
    }
    if (found) {
      taken.add(found.used);
      pairs.push(found);
    }
  }
  return pairs.sort((a, b) => b.used.t - a.used.t);
}
