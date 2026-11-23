import { kvGetJson, kvSetJson } from "./kv.ts";
import type { StudyMap, TopicStatus } from "../curriculum/map.ts";
import {
  applyCheck,
  applyUse,
  dueMissions,
  markSeen,
  statusFromMissions,
  type Mission,
  type MissionVerdict,
  type TopicMissions,
} from "../curriculum/missions.ts";
import { findExpression } from "../videoIndex/match.ts";

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
 * Move a topic's status along after its items changed: started once anything
 * is done, finished when every item is mastered. Never moves a topic back —
 * one the learner marked done stays done.
 */
async function advanceStatus(
  userId: string,
  language: string,
  mapId: string,
  topicId: string,
  topic: TopicMissions,
): Promise<TopicStatus> {
  const record = await readCurriculum(userId, language);
  let status: TopicStatus = record?.status[topicId] ?? "todo";
  if (status === "done") return status;
  const next = statusFromMissions(topic);
  const anything = Object.keys(topic.results).length > 0;
  if (!anything || next === status) return status;
  const saved = await setTopicStatus(userId, language, mapId, topicId, next);
  if (saved) status = next;
  return status;
}

/**
 * A line they said in chat or a call, held against the phrases on their map.
 * Said and kept by the correction: produced. Said but corrected away: a slip.
 */
export async function observeMapUse(input: {
  userId: string;
  language: string;
  sentence: string;
  corrected: string;
  where: "chat" | "call";
}): Promise<void> {
  const sentence = input.sentence.trim();
  if (!sentence) return;
  try {
    const record = await readCurriculum(input.userId, input.language);
    if (!record) return;
    const all = await readMissions(input.userId, input.language, record.map.id);
    const said = [{ start: 0, end: 0, text: sentence }];
    const kept = [{ start: 0, end: 0, text: input.corrected.trim() || sentence }];
    const changedTopics: string[] = [];
    for (const [topicId, before] of Object.entries(all)) {
      let topic = before;
      for (const mission of before.missions) {
        if (!mission.expression) continue;
        if (findExpression(said, mission.expression, input.language).length === 0) continue;
        const correct = findExpression(kept, mission.expression, input.language).length > 0;
        topic = applyUse(topic, mission.id, correct, input.where);
      }
      if (topic !== before) {
        all[topicId] = topic;
        changedTopics.push(topicId);
      }
    }
    if (changedTopics.length === 0) return;
    await kvSetJson(missionsKey(input.userId, input.language, record.map.id), all, CURRICULUM_TTL_SECONDS);
    for (const topicId of changedTopics) {
      await advanceStatus(input.userId, input.language, record.map.id, topicId, all[topicId]!);
    }
  } catch (error) {
    console.error("[curriculum] map use failed", error);
  }
}
