/**
 * 글자·소리 기초에서 통과한 묶음(curriculum/scripts), 학습 언어별. 묶음 id와 시각만.
 */
import { kvGetJson, kvSetJson } from "./kv.ts";
import { isIdentified } from "./identity.ts";

const TTL_SECONDS = 400 * 24 * 60 * 60;

function key(userId: string, language: string): string {
  return `scriptprog:v1:${userId}:${language}`;
}

export async function readScriptPassed(userId: string, language: string): Promise<Record<string, number>> {
  if (!isIdentified(userId)) return {};
  try {
    const value = await kvGetJson<{ passed?: Record<string, number> }>(key(userId, language));
    return value?.passed && typeof value.passed === "object" ? value.passed : {};
  } catch {
    return {};
  }
}

export async function markScriptPassed(userId: string, language: string, groupId: string, now = Date.now()): Promise<Record<string, number>> {
  const passed = { ...(await readScriptPassed(userId, language)), [groupId]: now };
  await kvSetJson(key(userId, language), { passed }, TTL_SECONDS);
  return passed;
}
