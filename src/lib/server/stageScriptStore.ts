import { kvGetJson, kvSetJson } from "./kv.ts";

/**
 * 통과한 단계 대본(curriculum/stageScripts.ts) — 대본 id와 통과한 때만, 학습 언어별.
 * 말한 문장은 남기지 않는다. 계정·학습 id를 지우면 함께(accountPurge가 키에 든 id로 지움).
 */
const TTL_SECONDS = 400 * 24 * 60 * 60;

export function stageScriptKey(userId: string, language: string): string {
  return `stageScripts:v1:${userId}:${language}`;
}

/** passed: 대본·틀 id → 처음 통과한 때. redo: 틀 id → 마지막으로 "다시 연습"을 끝낸 때(2026-10-28, 틀린 틀 다시 권유를 3일 쉼). */
type Record_ = { passed: Record<string, number>; redo?: Record<string, number> };

export async function readPassedScripts(userId: string, language: string): Promise<Set<string>> {
  const record = await kvGetJson<Record_>(stageScriptKey(userId, language)).catch(() => null);
  return new Set(Object.keys(record?.passed ?? {}));
}

export async function markScriptPassed(userId: string, language: string, id: string, at = Date.now()): Promise<string[]> {
  const key = stageScriptKey(userId, language);
  const record = (await kvGetJson<Record_>(key).catch(() => null)) ?? { passed: {} };
  const passed = { ...(record.passed ?? {}), [id]: record.passed?.[id] ?? at };
  await kvSetJson(key, { ...record, passed }, TTL_SECONDS);
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
