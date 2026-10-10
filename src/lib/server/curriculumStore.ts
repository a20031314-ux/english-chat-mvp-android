import { kvGetJson, kvSetJson } from "./kv.ts";
import type { StudyMap, TopicStatus } from "../curriculum/map.ts";
import {
  applyCheck,
  statusFromMissions,
  type MissionVerdict,
  type TopicMissions,
} from "../curriculum/missions.ts";

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

/**
 * Missions, one set per topic, kept beside the map rather than in it: written
 * a topic at a time, and checked answers land here while the map record is
 * being marked by other screens. Keyed by map, so a new map starts clean and
 * restoring an old one brings its missions back.
 */
function missionsKey(userId: string, language: string, mapId: string): string {
  return `curriculum:${userId}:${language}:missions:${mapId}`;
}

export async function readMissions(
  userId: string,
  language: string,
  mapId: string,
): Promise<Record<string, TopicMissions>> {
  return (await kvGetJson<Record<string, TopicMissions>>(missionsKey(userId, language, mapId))) ?? {};
}

export async function saveTopicMissions(
  userId: string,
  language: string,
  mapId: string,
  topicId: string,
  topic: TopicMissions,
): Promise<void> {
  const all = await readMissions(userId, language, mapId);
  all[topicId] = topic;
  await kvSetJson(missionsKey(userId, language, mapId), all, CURRICULUM_TTL_SECONDS);
}

/**
 * Record a checked answer and move the topic along: started on the first one
 * done, finished when every mission is. A topic the learner marked done stays
 * done.
 */
export async function recordMissionCheck(input: {
  userId: string;
  language: string;
  mapId: string;
  topicId: string;
  missionId: string;
  verdict: MissionVerdict;
  hints: number;
  tries: number;
}): Promise<{ topic: TopicMissions; status: TopicStatus } | null> {
  const all = await readMissions(input.userId, input.language, input.mapId);
  const before = all[input.topicId];
  if (!before) return null;
  const topic = applyCheck(before, input.missionId, input.verdict, input.hints, input.tries);
  if (topic !== before) {
    all[input.topicId] = topic;
    await kvSetJson(missionsKey(input.userId, input.language, input.mapId), all, CURRICULUM_TTL_SECONDS);
  }
  const record = await readCurriculum(input.userId, input.language);
  let status: TopicStatus = record?.status[input.topicId] ?? "todo";
  if (topic !== before && status !== "done") {
    const next = statusFromMissions(topic);
    if (next !== status) {
      const saved = await setTopicStatus(input.userId, input.language, input.mapId, input.topicId, next);
      if (saved) status = next;
    }
  }
  return { topic, status };
}
