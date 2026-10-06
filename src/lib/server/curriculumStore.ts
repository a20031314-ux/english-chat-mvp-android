import { kvGetJson, kvSetJson } from "./kv.ts";
import type { StudyMap, TopicStatus } from "../curriculum/map.ts";

/**
 * Where a learner's study map and their progress through it are kept.
 *
 * One map at a time per person and language — someone learning Spanish for a
 * trip and English for work has two goals, and switching the app between them
 * must not throw either away. "New goal" replaces the map for that language,
 * and the one it replaced is kept beside it once, so a goal rewritten by
 * mistake can be put back. Progress is a status per topic, keyed to the map it was made on — a
 * progress row for an old map is not carried onto a new one whose A1 is a
 * different topic.
 *
 * Kept for as long as it is used: every write pushes the expiry out again, and
 * a map nobody has opened in 400 days goes the way the learner metrics do.
 */
export const CURRICULUM_TTL_SECONDS = 400 * 24 * 60 * 60;

export type CurriculumRecord = {
  map: StudyMap;
  status: Record<string, TopicStatus>;
  updatedAt: string;
};

export function curriculumKey(userId: string, language: string): string {
  return `curriculum:${userId}:${language}`;
}

function previousKey(userId: string, language: string): string {
  return `curriculum:${userId}:${language}:prev`;
}

export async function readCurriculum(userId: string, language: string): Promise<CurriculumRecord | null> {
  return kvGetJson<CurriculumRecord>(curriculumKey(userId, language));
}

/** Whether there is a replaced map to go back to. */
export async function hasPreviousMap(userId: string, language: string): Promise<boolean> {
  return (await kvGetJson<CurriculumRecord>(previousKey(userId, language))) !== null;
}

export async function saveNewMap(userId: string, map: StudyMap): Promise<CurriculumRecord> {
  const current = await readCurriculum(userId, map.language);
  if (current) await kvSetJson(previousKey(userId, map.language), current, CURRICULUM_TTL_SECONDS);
  const record: CurriculumRecord = { map, status: {}, updatedAt: new Date().toISOString() };
  await kvSetJson(curriculumKey(userId, map.language), record, CURRICULUM_TTL_SECONDS);
  return record;
}

/** Put the map that was replaced back, and keep the one that replaced it as the spare. */
export async function restorePreviousMap(userId: string, language: string): Promise<CurriculumRecord | null> {
  const previous = await kvGetJson<CurriculumRecord>(previousKey(userId, language));
  if (!previous) return null;
  const current = await readCurriculum(userId, language);
  if (current) await kvSetJson(previousKey(userId, language), current, CURRICULUM_TTL_SECONDS);
  await kvSetJson(curriculumKey(userId, language), previous, CURRICULUM_TTL_SECONDS);
  return previous;
}

/**
 * Mark one topic. Refused (null) when the map has changed since the screen
 * that asked was drawn, or the topic is not on it.
 */
export async function setTopicStatus(
  userId: string,
  language: string,
  mapId: string,
  topicId: string,
  status: TopicStatus,
): Promise<CurriculumRecord | null> {
  const record = await readCurriculum(userId, language);
  if (!record || record.map.id !== mapId) return null;
  if (!record.map.topics.some((topic) => topic.id === topicId)) return null;
  if (status === "todo") delete record.status[topicId];
  else record.status[topicId] = status;
  record.updatedAt = new Date().toISOString();
  await kvSetJson(curriculumKey(userId, language), record, CURRICULUM_TTL_SECONDS);
  return record;
}
