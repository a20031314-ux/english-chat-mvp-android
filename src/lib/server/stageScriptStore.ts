import { kvGetJson, kvSetJson } from "./kv.ts";

/**
 * 통과한 단계 대본(curriculum/stageScripts.ts) — 대본 id와 통과한 때만, 학습 언어별.
 * 말한 문장은 남기지 않는다. 계정·학습 id를 지우면 함께(accountPurge가 키에 든 id로 지움).
 */
const TTL_SECONDS = 400 * 24 * 60 * 60;

export function stageScriptKey(userId: string, language: string): string {
  return `stageScripts:v1:${userId}:${language}`;
}

type Record_ = { passed: Record<string, number> };

export async function readPassedScripts(userId: string, language: string): Promise<Set<string>> {
  const record = await kvGetJson<Record_>(stageScriptKey(userId, language)).catch(() => null);
  return new Set(Object.keys(record?.passed ?? {}));
}

export async function markScriptPassed(userId: string, language: string, id: string, at = Date.now()): Promise<string[]> {
  const key = stageScriptKey(userId, language);
  const record = (await kvGetJson<Record_>(key).catch(() => null)) ?? { passed: {} };
  const passed = { ...(record.passed ?? {}), [id]: record.passed?.[id] ?? at };
  await kvSetJson(key, { passed }, TTL_SECONDS);
  return Object.keys(passed);
}
