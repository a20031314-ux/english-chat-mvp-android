/**
 * 실력 확인 — 2주마다 짧은 다시 측정(2026-11-09 사용자 "학습자 수준을 측정하는 걸 다시 부활" → ② 주기 시험 "진행해줘").
 * 순수 모듈 — 모델 없음. 화면은 studyMap/FirstCheck.tsx(recheck)와 Logbank SkillChecks.
 *
 * 앎·말하기 분리(같은 날)에 맞춰 둘을 따로 잰다:
 *   어휘·표현·문법 = 첫 측정과 같은 시험(낱말 예/아니오 → 뜻 고르기 → 표현·문법 오르기, 글자는 뺌)
 *   말하기        = 시험 없이 장부에서 — 그 확인 전 TALK_WINDOW_DAYS일 동안 통화·채팅·사람 대화에서 맞게 쓴 열쇠 수
 * 기록은 이 폰에만(skillCheck.v1.<언어>). 첫 측정(firstCheck.v1)이 있으면 그것이 첫 줄.
 */
import type { LogEvent } from "./logLedger.ts";
import { readFirstCheck, type FirstCheckResult } from "./firstCheck.ts";
import { knowChance } from "./vocabLevel.ts";

export const RECHECK_DAYS = 14;
export const TALK_WINDOW_DAYS = 14;
const DAY_MS = 86_400_000;
const KEEP = 24;

export type SkillCheck = { at: number; b: number; expression: number; grammar: number; first?: boolean };

const keyOf = (language: string) => `skillCheck.v1.${language}`;

function valid(one: unknown): one is SkillCheck {
  const v = one as SkillCheck;
  return Boolean(v) && [v.at, v.b, v.expression, v.grammar].every((n) => typeof n === "number" && Number.isFinite(n));
}

export function readRechecks(language: string): SkillCheck[] {
  try {
    const list = JSON.parse(globalThis.localStorage?.getItem(keyOf(language)) ?? "[]") as unknown;
    return Array.isArray(list) ? list.filter(valid) : [];
  } catch {
    return [];
  }
}

export function saveRecheck(language: string, one: SkillCheck): void {
  try {
    const list = [...readRechecks(language), { at: one.at, b: one.b, expression: one.expression, grammar: one.grammar }].sort((a, b) => a.at - b.at);
    globalThis.localStorage?.setItem(keyOf(language), JSON.stringify(list.slice(-KEEP)));
  } catch {
    // 이번에만.
  }
}

/** 순수: 첫 측정(글자부터면 뺌 — 낱말을 안 잼) + 다시 측정, 오래된 것부터. */
export function checkHistory(first: FirstCheckResult | null, rechecks: readonly SkillCheck[]): SkillCheck[] {
  const out: SkillCheck[] = [];
  if (first && !first.letters) out.push({ at: first.at, b: first.b, expression: first.expression, grammar: first.grammar, first: true });
  out.push(...rechecks.filter((one) => !first || one.at !== first.at));
  return out.sort((a, b) => a.at - b.at);
}

/** 가장 최근 확인(첫 측정 또는 실력 확인) — Quizbank 표현 시작 단계 등이 읽는다. 글자부터라 잰 적이 없으면 null. */
export function latestCheck(language: string): SkillCheck | null {
  const history = checkHistory(readFirstCheck(language), readRechecks(language));
  return history[history.length - 1] ?? null;
}

/** 순수: 다시 잴 때가 됐나 — 기록이 없거나 마지막 것이 RECHECK_DAYS일 넘음. */
export function recheckDue(history: readonly SkillCheck[], now: number): boolean {
  const last = history[history.length - 1];
  return !last || now - last.at >= RECHECK_DAYS * DAY_MS;
}

const talked = (event: LogEvent) => event.r === "used" && (event.src === "call" || event.src === "chat" || event.src === "people");

/** 순수: 말하기 = until(ms) 전 TALK_WINDOW_DAYS일 동안 대화에서 맞게 쓴 서로 다른 열쇠 수. */
export function talkUsedBefore(events: readonly LogEvent[], until: number, days = TALK_WINDOW_DAYS): number {
  const from = (until - days * DAY_MS) / 1000;
  const to = until / 1000;
  const keys = new Set<string>();
  for (const event of events) if (talked(event) && event.t > from && event.t <= to) keys.add(event.k);
  return keys.size;
}

export type CheckRow = SkillCheck & { talk: number };

/** 순수: 화면 줄(새것부터) — 확인마다 그때까지 2주 말하기를 붙임. */
export function checkRows(history: readonly SkillCheck[], events: readonly LogEvent[]): CheckRow[] {
  return history.map((one) => ({ ...one, talk: talkUsedBefore(events, one.at) })).reverse();
}

/** 다시 측정의 오르기 시작 단계 = 지난번보다 한 단계 아래(1~5) — 처음부터 다시 오르지 않게, 내려갈 여지는 하나. */
export function climbFrom(last: SkillCheck | undefined): { expression: number; grammar: number } {
  const from = (stage: number | undefined) => Math.max(1, Math.min(5, (stage ?? 1) - 1));
  return { expression: from(last?.expression), grammar: from(last?.grammar) };
}

/**
 * Languagebank 추정(2026-11-09 사용자 "추정을 다시 넣고, 학습 단어는 해당 카드에만"): 가장 최근 확인 하나로 칸마다 "아는 정도" 0~1.
 *   낱말 = 빈도 순위가 경계 b 근처면 반쯤(vocabLevel.knowChance — 첫 측정과 같은 곡선)
 *   표현·문법 = 잰 단계 아래는 1, 그 단계는 0.5, 위는 0
 * 퀴즈 기록(학습)은 섞지 않는다 — 그건 낱말 카드에만.
 */
export function estimateChance(check: Pick<SkillCheck, "b" | "expression" | "grammar">, item: { kind: "word" | "expr" | "gram"; rank: number; lv: number }): number {
  if (item.kind === "word") return knowChance({ b: check.b, n: 0 }, item.rank);
  const stage = item.kind === "expr" ? check.expression : check.grammar;
  return item.lv < stage ? 1 : item.lv === stage ? 0.5 : 0;
}
