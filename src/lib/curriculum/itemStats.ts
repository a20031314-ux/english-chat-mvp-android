/**
 * 문제 난이도 통계(2026-10-29 사용자 시험 중심 계획 "4번 해줘"): 시험(처음 시험·단계 시험·이번 주 확인)에서 문제 열쇠마다
 * 모든 사용자의 [맞힘, 낸 수]를 모아(누구 것인지는 남기지 않음, 서버 `itemStats:v1:<언어>`), 시험을 짤 때 쓴다.
 *
 * - 말하기 문제는 세지 않는다(마이크·받아쓰기 탓이 섞임). 고르기·순서만, 첫 답만.
 * - 충분히 풀린 문제(STAT_MIN번)만 판단: 맞힌 몫이 TOO_HARD 아래면 "막힘"(문제나 보기가 헷갈리게 짜였을 수 있음 — 시험 맨 뒤로, 점검 보고에 뜸),
 *   TOO_EASY 위면 "쉬움"(실력을 가르지 못함 — 뒤로), 그 사이는 "가름"(앞으로). 모르면 그 사이에.
 * - 순서만 바꾸고(같은 무리 안에서는 원래 섞인 순서), 빼지는 않는다 — 문제 수가 모자라지 않게.
 * 순수 모듈: 시험 만드는 곳(checkup·placement·stageTest)·서버(api/curriculum/scripts)·점검 스크립트(scripts/item-stats.mjs).
 */
import type { QuizQuestion } from "./quiz.ts";

/** 열쇠 → [맞힘, 낸 수]. */
export type ItemStats = Record<string, [number, number]>;
/** 한 시험에서 낸 문제 하나: [열쇠, 맞았는지]. */
export type AskedItem = [string, boolean];
export type Difficulty = "split" | "unknown" | "easy" | "stuck";

export const STAT_MIN = 20;
export const TOO_HARD = 0.15;
export const TOO_EASY = 0.95;
/** 한 번에 받는 문제 수(단계 시험 24 + 여유). */
export const ASKED_MAX = 30;

const RANK: Record<Difficulty, number> = { split: 0, unknown: 1, easy: 2, stuck: 3 };

export function difficultyOf(stats: ItemStats | null | undefined, key: string): Difficulty {
  const stat = stats?.[key];
  if (!stat || stat[1] < STAT_MIN) return "unknown";
  const rate = stat[0] / stat[1];
  if (rate < TOO_HARD) return "stuck";
  if (rate > TOO_EASY) return "easy";
  return "split";
}

/** 실력을 가르는 문제가 앞으로(같은 무리 안에서는 원래 순서). 통계가 없으면 그대로. */
export function byDifficulty(keys: readonly string[], stats: ItemStats | null | undefined): string[] {
  if (!stats || !Object.keys(stats).length) return [...keys];
  return keys
    .map((key, index) => ({ key, index, rank: RANK[difficultyOf(stats, key)] }))
    .sort((a, b) => a.rank - b.rank || a.index - b.index)
    .map((one) => one.key);
}

/** 시험 답에서 통계로 보낼 것: 말하기·건너뛴 것은 빼고 첫 답만. */
export function askedOf(items: readonly { key: string; question: Pick<QuizQuestion, "kind"> }[], answers: readonly (boolean | null)[]): AskedItem[] {
  const out: AskedItem[] = [];
  items.forEach((item, i) => {
    const answer = answers[i];
    if (item.question.kind === "say" || answer === null || answer === undefined) return;
    out.push([item.key, answer]);
  });
  return out.slice(0, ASKED_MAX);
}

/** 서버가 받은 것을 고른다(열쇠 모양 e|·f|·g|, 80자, 겹치면 한 번). */
export function cleanAsked(raw: unknown): AskedItem[] {
  if (!Array.isArray(raw)) return [];
  const seen = new Set<string>();
  const out: AskedItem[] = [];
  for (const row of raw) {
    if (!Array.isArray(row) || typeof row[0] !== "string" || typeof row[1] !== "boolean") continue;
    const key = row[0];
    if (!/^[efg]\|/.test(key) || key.length > 80 || seen.has(key)) continue;
    seen.add(key);
    out.push([key, row[1]]);
    if (out.length >= ASKED_MAX) break;
  }
  return out;
}

/** 해시 칸(n|열쇠·r|열쇠) ↔ 통계. */
export function statFields(asked: readonly AskedItem[]): Record<string, number> {
  const out: Record<string, number> = {};
  for (const [key, right] of asked) {
    out[`n|${key}`] = (out[`n|${key}`] ?? 0) + 1;
    if (right) out[`r|${key}`] = (out[`r|${key}`] ?? 0) + 1;
  }
  return out;
}

export function statsFromFields(fields: Record<string, number>): ItemStats {
  const out: ItemStats = {};
  for (const [field, value] of Object.entries(fields)) {
    if (!field.startsWith("n|")) continue;
    const key = field.slice(2);
    out[key] = [Math.min(value, fields[`r|${key}`] ?? 0), value];
  }
  return out;
}
