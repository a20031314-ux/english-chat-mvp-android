import { kvGetJson, kvSetJson } from "./kv.ts";
import { applyCheck, reviewKeysOf, type ReviewMap } from "../curriculum/dailyPlan.ts";
import { CHECKUP_KEEP, type CheckResult } from "../curriculum/checkup.ts";
import { scriptById } from "../curriculum/stageScripts.ts";
import { applyKnown, trimKnown, type KnownMap } from "../curriculum/known.ts";
import type { AskedItem } from "../curriculum/itemStats.ts";

/**
 * 통과한 단계 대본(curriculum/stageScripts.ts) — 대본 id와 통과한 때만, 학습 언어별.
 * 말한 문장은 남기지 않는다. 계정·학습 id를 지우면 함께(accountPurge가 키에 든 id로 지움).
 */
const TTL_SECONDS = 400 * 24 * 60 * 60;

export function stageScriptKey(userId: string, language: string): string {
  return `stageScripts:v1:${userId}:${language}`;
}

/** passed: 대본·틀 id → 처음 통과한 때. redo: 틀 id → 마지막으로 "다시 연습"을 끝낸 때(2026-10-28, 틀린 틀 다시 권유를 3일 쉼). */
/** asked: 직접 물어본 곳(문법·문장구조·표현 열쇠) → 몇 번·마지막 때(2026-10-28 "어디가 부족하고 어디를 모르는지 기록", 질문·답 글은 남기지 않음). */
/** checkups: 이번 주 확인 결과(curriculum/checkup.ts) — 갈래·칸별 맞힘 수와 틀린 열쇠만, 최근 12번(2026-10-29). */
/** known: 시험에서 맞힌 열쇠 → 맞힌 날들(curriculum/known.ts — 확인 중·이미 앎, 2026-10-29 "아는 건 걸러내고 커리큘럼을"). */
type Record_ = { passed: Record<string, number>; redo?: Record<string, number>; review?: ReviewMap; asked?: Record<string, { n: number; at: number }>; checkups?: CheckResult[]; known?: KnownMap };

export async function readKnown(userId: string, language: string): Promise<KnownMap> {
  const record = await kvGetJson<Record_>(stageScriptKey(userId, language)).catch(() => null);
  return record?.known ?? {};
}

/** 통과한 대본·틀 id → 처음 통과한 때(My 네 갈래·그래프, notes/myParts.ts). */
export async function readPassedTimes(userId: string, language: string): Promise<Map<string, number>> {
  const record = await kvGetJson<Record_>(stageScriptKey(userId, language)).catch(() => null);
  return new Map(Object.entries(record?.passed ?? {}));
}

export async function readPassedScripts(userId: string, language: string): Promise<Set<string>> {
  const record = await kvGetJson<Record_>(stageScriptKey(userId, language)).catch(() => null);
  return new Set(Object.keys(record?.passed ?? {}));
}

export async function markScriptPassed(userId: string, language: string, id: string, at = Date.now()): Promise<string[]> {
  const key = stageScriptKey(userId, language);
  const record = (await kvGetJson<Record_>(key).catch(() => null)) ?? { passed: {} };
  const passed = { ...(record.passed ?? {}), [id]: record.passed?.[id] ?? at };
  // 대본을 넘기면 그 열쇠도 확인 중(맞힌 날 하루) — 퀴즈·이번 주 확인에서 다른 날 두 번 더 맞히면 이미 앎(뼈대 → 채우기, curriculum/known.ts).
  let known = record.known ?? {};
  const script = scriptById(language, id);
  const grammarKeys = script ? (script.grammar ?? []).map((index) => `g|${script.stage}:${index}`) : [];
  for (const one of [...reviewKeysOf(language, id), ...grammarKeys]) known = applyKnown(known, one, true, at, true);
  await kvSetJson(key, { ...record, passed, known: trimKnown(known) }, TTL_SECONDS);
  return Object.keys(passed);
}

/** 틀마다 마지막 "다시 연습" 끝낸 때. */
export async function readRedoDone(userId: string, language: string): Promise<Record<string, number>> {
  const record = await kvGetJson<Record_>(stageScriptKey(userId, language)).catch(() => null);
  return record?.redo ?? {};
}

/** "다시 연습"을 끝냄 — 그 틀의 통과(처음이면)와 끝낸 때를 함께. */
export async function markRedoDone(userId: string, language: string, frameId: string, at = Date.now()): Promise<Record<string, number>> {
  const key = stageScriptKey(userId, language);
  const record = (await kvGetJson<Record_>(key).catch(() => null)) ?? { passed: {} };
  const passed = { ...(record.passed ?? {}), [frameId]: record.passed?.[frameId] ?? at };
  const redo = { ...(record.redo ?? {}), [frameId]: at };
  await kvSetJson(key, { ...record, passed, redo }, TTL_SECONDS);
  return redo;
}

/** 다시 볼 것(오늘 할 것, curriculum/dailyPlan.ts) — 표현·문장구조 열쇠마다 다음 날짜. 문장은 없음. */
export async function readReview(userId: string, language: string): Promise<ReviewMap> {
  const record = await kvGetJson<Record_>(stageScriptKey(userId, language)).catch(() => null);
  return record?.review ?? {};
}

/** 학습 끝 체크(알아요·헷갈려요)를 반영. 열쇠는 e|·f|·g|로 시작하고 80자까지, 한 번에 12개까지. */
export async function saveChecks(
  userId: string,
  language: string,
  checks: Record<string, boolean>,
  now = Date.now(),
  quiz = false,
): Promise<{ review: ReviewMap; known: KnownMap }> {
  const key = stageScriptKey(userId, language);
  const record = (await kvGetJson<Record_>(key).catch(() => null)) ?? { passed: {} };
  let review = record.review ?? {};
  let known = record.known ?? {};
  for (const [check, ok] of Object.entries(checks).slice(0, 12)) {
    if (!/^[efguw]\|/.test(check) || check.length > 80) continue;
    review = applyCheck(review, check, ok, now);
    // 퀴즈 답만 확인 중 열쇠를 움직인다(알아요·헷갈려요는 스스로 고른 것이라 — 헷갈려요는 지움).
    // 뼈대 밖에서 막힌 것(u|, curriculum/gaps.ts)은 시험에 안 나와서 퀴즈 정답이 확인 중을 처음 만든다.
    if (quiz || !ok) known = applyKnown(known, check, ok, now, quiz && (check.startsWith("u|") || check.startsWith("w|")));
  }
  // 오래 묵은 것은 400개까지만(가장 최근 체크 순).
  const entries = Object.entries(review).sort((a, b) => b[1].at - a[1].at).slice(0, 400);
  review = Object.fromEntries(entries);
  await kvSetJson(key, { ...record, review, known }, TTL_SECONDS);
  return { review, known };
}

/** 직접 물어본 곳: 몇 번 물었는지 남기고, 헷갈려요처럼 다시 볼 것에 넣는다(2일 뒤 오늘 할 것에 "다시"). 열쇠는 부르는 쪽이 거른 것. */
export async function recordAsked(userId: string, language: string, keys: readonly string[], now = Date.now()): Promise<ReviewMap> {
  const key = stageScriptKey(userId, language);
  const record = (await kvGetJson<Record_>(key).catch(() => null)) ?? { passed: {} };
  let review = record.review ?? {};
  const asked = { ...(record.asked ?? {}) };
  for (const one of keys.slice(0, 4)) {
    review = applyCheck(review, one, false, now);
    asked[one] = { n: (asked[one]?.n ?? 0) + 1, at: now };
  }
  const trimmedAsked = Object.fromEntries(Object.entries(asked).sort((a, b) => b[1].at - a[1].at).slice(0, 300));
  const trimmedReview = Object.fromEntries(Object.entries(review).sort((a, b) => b[1].at - a[1].at).slice(0, 400));
  await kvSetJson(key, { ...record, review: trimmedReview, asked: trimmedAsked }, TTL_SECONDS);
  return trimmedReview;
}

export async function readAsked(userId: string, language: string): Promise<Record<string, { n: number; at: number }>> {
  const record = await kvGetJson<Record_>(stageScriptKey(userId, language)).catch(() => null);
  return record?.asked ?? {};
}

export async function readCheckups(userId: string, language: string): Promise<CheckResult[]> {
  const record = await kvGetJson<Record_>(stageScriptKey(userId, language)).catch(() => null);
  return record?.checkups ?? [];
}

/** 이번 주 확인 하나를 남기고, 틀린 열쇠는 헷갈려요처럼 다시 볼 것(2일 뒤)에 넣는다. */
export async function saveCheckup(
  userId: string,
  language: string,
  result: CheckResult,
  now = Date.now(),
  asked: readonly AskedItem[] = [],
): Promise<{ checkups: CheckResult[]; review: ReviewMap; known: KnownMap }> {
  const key = stageScriptKey(userId, language);
  const record = (await kvGetJson<Record_>(key).catch(() => null)) ?? { passed: {} };
  let review = record.review ?? {};
  for (const wrong of result.wrong) review = applyCheck(review, wrong, false, now);
  review = Object.fromEntries(Object.entries(review).sort((a, b) => b[1].at - a[1].at).slice(0, 400));
  // 맞힌 것 → 확인 중(큰 시험·미리 확인은 새로 만들고, 이번 주 확인은 있는 것만 늘림), 틀린 것 → 지움(curriculum/known.ts).
  let known = record.known ?? {};
  for (const [item, right] of asked) known = applyKnown(known, item, right, now, Boolean(result.kind));
  for (const wrong of result.wrong) known = applyKnown(known, wrong, false, now);
  known = trimKnown(known);
  const checkups = [...(record.checkups ?? []), result].sort((a, b) => a.at - b.at).slice(-CHECKUP_KEEP);
  await kvSetJson(key, { ...record, review, checkups, known }, TTL_SECONDS);
  return { checkups, review, known };
}
