/**
 * The self-check a learner filled in when they started a map, one per learning
 * language (learner/selfCheck.ts). Ids only. Kept as long as a map is.
 */
import { kvGetJson, kvSetJson } from "./kv.ts";
import { isIdentified } from "./identity.ts";
import { parseSelfCheck, type SelfCheck } from "../learner/selfCheck.ts";

const TTL_SECONDS = 400 * 24 * 60 * 60;

function key(userId: string, language: string): string {
  return `selfcheck:v1:${userId}:${language}`;
}

export async function readSelfCheck(userId: string, language: string): Promise<SelfCheck | null> {
  if (!isIdentified(userId)) return null;
  try {
    return parseSelfCheck(await kvGetJson(key(userId, language)), Date.now());
  } catch {
    return null;
  }
}

export async function saveSelfCheck(userId: string, language: string, check: SelfCheck): Promise<void> {
  if (!isIdentified(userId)) return;
  await kvSetJson(key(userId, language), check, TTL_SECONDS);
}
