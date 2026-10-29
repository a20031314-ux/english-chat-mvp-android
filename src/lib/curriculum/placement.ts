/**
 * 처음 시험(실력 확인, 2026-10-29 사용자 "처음이나 가끔씩 분량이 있는 시험으로 실력을 가늠" → "시험 + 퀴즈·지속 학습, 시험을 중심으로 모으는 걸로" → "1번 시작해줘").
 *
 * 시작 단계를 대화 예시로 스스로 고르는 대신(StagePicker — 그대로 남겨 고를 수 있게) 문제로 정한다. 단계를 오르내리며 4문제씩:
 *   2단계에서 시작 → 4문제 중 3 이상(70%)이면 위 단계, 아니면 아래 단계. 넘은 단계 바로 위가 막히면(또는 1단계가 막히거나 5단계를 넘으면) 끝.
 *   시작 단계 = 막힌 단계 중 가장 낮은 것(없으면 넘은 단계 + 1, 5까지). 문제가 12개보다 적게 끝나면 시작 단계 문제를 한 묶음 더(갈래를 재려고).
 * 문제 = 그 단계 대본의 표현·문장구조 열쇠마다 퀴즈 모양 한 문제(고르기·순서 번갈아, 묶음 넷째는 말하기 — 셋까지). 첫 답만 셈, 말하기 건너뛰면 뺌.
 * 결과는 이번 주 확인과 같은 모양(curriculum/checkup.ts CheckResult, kind "placement") — 시작 단계·단계별·갈래별 맞힌 수, 시작 단계보다 아래에서 틀린 것.
 * 레벨·등급은 보이지 않는다. 순수 모듈: 화면(studyMap/PlacementPlayer)·테스트.
 */
import { byDifficulty, difficultyOf, type ItemStats } from "./itemStats.ts";
import { partOf, STAGE_KEYS, type CheckResult, type StageKey, type Tally } from "./checkup.ts";
import { reviewKeysOf } from "./dailyPlan.ts";
import { buildQuiz, speakScored, type QuizQuestion } from "./quiz.ts";
import { allScriptsFor } from "./stageScripts.ts";
import type { PartId } from "../notes/stageParts.ts";

export type PlacementItem = { key: string; stage: number; part: PartId; question: QuizQuestion };

export const PLACEMENT_BLOCK = 4;
export const PLACEMENT_FIRST = 2;
export const PLACEMENT_SAY = 3;
export const PLACEMENT_MIN = 12;
/** 단계를 넘었다고 볼 맞힌 몫. */
export const PLACEMENT_PASS = 0.7;
/** 끝까지 안 해도 이만큼 답했으면 거기까지로 정한다. */
export const PLACEMENT_ENOUGH = 8;

function hash(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function shuffled<T>(list: readonly T[], seed: string): T[] {
  let a = hash(seed) || 1;
  const random = () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const out = [...list];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

/** 그 단계 대본의 표현·문장구조 열쇠(겹치면 한 번). */
export function stageKeys(language: string, stage: number): string[] {
  const keys = new Set<string>();
  for (const script of allScriptsFor(language)) if (script.stage === stage) for (const key of reviewKeysOf(language, script.id)) keys.add(key);
  return [...keys];
}

/** 한 묶음(그 단계에서 PLACEMENT_BLOCK문제, 이미 낸 열쇠는 빼고). says = 지금까지 낸 말하기 수. */
export function placementBlock(input: { language: string; stage: number; used: ReadonlySet<string>; says: number; seed: string; stats?: ItemStats | null }): PlacementItem[] {
  const out: PlacementItem[] = [];
  let says = input.says;
  const keys = byDifficulty(shuffled(stageKeys(input.language, input.stage), `${input.seed}|${input.stage}`), input.stats).filter((key) => !input.used.has(key));
  // 말하기 자리는 말하기로 채점하는 열쇠(표현)로 — 문법 열쇠는 말하기 문제가 없다(quiz.ts speakScored). 그 열쇠를 앞으로 당겨 둔다.
  const sayKey = keys.slice(PLACEMENT_BLOCK - 1).find((key) => speakScored(key) && difficultyOf(input.stats, key) !== "stuck" && buildQuiz(input.language, key, { seed: input.seed })?.questions.some((q) => q.kind === "say"));
  const at = keys.indexOf(sayKey ?? "");
  if (sayKey && says < PLACEMENT_SAY && at > PLACEMENT_BLOCK - 1 && !speakScored(keys[PLACEMENT_BLOCK - 1] ?? "")) {
    keys.splice(at, 1);
    keys.splice(PLACEMENT_BLOCK - 1, 0, sayKey);
  }
  for (const key of keys) {
    if (out.length >= PLACEMENT_BLOCK) break;
    const quiz = buildQuiz(input.language, key, { seed: input.seed });
    if (!quiz) continue;
    const pick = (kind: QuizQuestion["kind"]) => quiz.questions.find((q) => q.kind === kind);
    const wantSay = says < PLACEMENT_SAY && out.length === PLACEMENT_BLOCK - 1;
    const question = (wantSay ? pick("say") : undefined) ?? (out.length % 2 === 0 ? (pick("choose") ?? pick("order")) : (pick("order") ?? pick("choose")));
    if (!question) continue;
    if (question.kind === "say") says += 1;
    out.push({ key, stage: input.stage, part: partOf(input.language, key, question.kind), question });
  }
  return out;
}

/** 단계마다 [맞힘, 낸 수](건너뛴 것은 뺌). */
export function stageTallies(items: readonly PlacementItem[], answers: readonly (boolean | null)[]): Partial<Record<StageKey, Tally>> {
  const out: Partial<Record<StageKey, Tally>> = {};
  items.forEach((item, i) => {
    const answer = answers[i];
    if (answer === null || answer === undefined) return;
    const tally = (out[String(item.stage) as StageKey] ??= [0, 0]);
    tally[1] += 1;
    if (answer) tally[0] += 1;
  });
  return out;
}

const passedOf = (tally: Tally | undefined) => (tally && tally[1] > 0 ? tally[0] / tally[1] >= PLACEMENT_PASS : null);

/** 시작 단계: 막힌 단계 중 가장 낮은 것, 없으면 넘은 단계 + 1(5까지), 아무것도 모르면 1. */
export function placementStart(tallies: Partial<Record<StageKey, Tally>>): number {
  const failed = STAGE_KEYS.filter((key) => passedOf(tallies[key]) === false).map(Number);
  if (failed.length) return Math.min(...failed);
  const passed = STAGE_KEYS.filter((key) => passedOf(tallies[key]) === true).map(Number);
  return passed.length ? Math.min(5, Math.max(...passed) + 1) : 1;
}

/**
 * 다음에 볼 단계(끝이면 null). 방금 끝낸 단계를 넘었으면 위로, 막혔으면 아래로 — 이미 본 단계로 돌아가게 되면 끝.
 * 끝나는데 문제가 PLACEMENT_MIN보다 적으면 시작 단계를 한 번 더(그 단계 다른 문제로, 갈래를 재려고).
 */
export function nextPlacementStage(input: {
  last: number;
  tallies: Partial<Record<StageKey, Tally>>;
  asked: number;
  extraDone: boolean;
  hasKeys: (stage: number) => boolean;
}): number | null {
  const { last, tallies } = input;
  const seen = (stage: number) => Boolean(tallies[String(stage) as StageKey]);
  const passed = passedOf(tallies[String(last) as StageKey]);
  let next: number | null = null;
  if (passed === true && last < 5 && !seen(last + 1) && input.hasKeys(last + 1)) next = last + 1;
  if (passed === false && last > 1 && !seen(last - 1) && input.hasKeys(last - 1)) next = last - 1;
  if (next !== null) return next;
  if (!input.extraDone && input.asked < PLACEMENT_MIN) return placementStart(tallies);
  return null;
}

/** 결과(이번 주 확인과 같은 모양). 틀린 것은 시작 단계보다 아래 것만(다시 볼 것으로 — 위 것은 앞으로 배울 것). */
export function placementResult(items: readonly PlacementItem[], answers: readonly (boolean | null)[], now = Date.now()): CheckResult {
  const stages = stageTallies(items, answers);
  const start = placementStart(stages);
  const parts: CheckResult["parts"] = {};
  const wrong: string[] = [];
  items.forEach((item, i) => {
    const answer = answers[i];
    if (answer === null || answer === undefined) return;
    const tally = (parts[item.part] ??= [0, 0]);
    tally[1] += 1;
    if (answer) tally[0] += 1;
    else if (item.stage < start && !wrong.includes(item.key)) wrong.push(item.key);
  });
  return { at: now, stage: start, parts, origins: {}, wrong, kind: "placement", stages };
}
