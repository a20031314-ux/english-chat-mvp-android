import type OpenAI from "openai";
import { kvGetJson, kvSetJson } from "./kv.ts";
import { isIdentified } from "./identity.ts";
import { CURRICULUM_TTL_SECONDS, readCurriculum, readMissions, saveTopicMissions } from "./curriculumStore.ts";
import type { MeteredOp } from "./modelCalls.ts";
import { applyUse } from "../curriculum/missions.ts";
import {
  MAX_OPEN_WEAK,
  addWeakMission,
  applyMistakes,
  normalizeWeakMission,
  openWeakCount,
  parseWeakRecord,
  patternMessage,
  patternPrompt,
  readPatterns,
  recurringPatterns,
  weakMissionMessage,
  weakMissionPrompt,
  type WeakRecord,
} from "../curriculum/weakPoints.ts";
import { INTERFACE_LANGUAGE_LABELS, learningLanguageName } from "../learningLanguages.ts";

/**
 * Where the kinds of mistake a learner keeps making are kept, and the step that
 * puts a recurring one on their study map (curriculum/weakPoints.ts).
 *
 * Kinds and times only — the corrected line is read once and not stored. Kept
 * per person and learning language, beside the map, for as long as the map.
 */

const READ_MODEL = () => process.env.OPENAI_LEARNER_MODEL?.trim() || "gpt-4.1-mini";
const MISSION_MODEL = () => process.env.OPENAI_CURRICULUM_MODEL?.trim() || "gpt-4.1";

function weakKey(userId: string, language: string): string {
  return `curriculum:${userId}:${language}:weak`;
}

export async function readWeakRecord(userId: string, language: string): Promise<WeakRecord> {
  return parseWeakRecord(await kvGetJson(weakKey(userId, language)));
}

function same(a: string, b: string): boolean {
  const bare = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{M}\p{N}]/gu, "");
  return bare(a) === bare(b);
}

/**
 * A corrected line from chat or a call. Read for the kind of mistake; a kind
 * already on the map takes its item back from mastered; a kind seen often
 * enough lately becomes an item. Runs after the reply has gone out and
 * swallows every failure.
 */
export async function observeWeakPoints(input: {
  openai: OpenAI | null;
  userId: string;
  language: string;
  sentence: string;
  corrected: string;
  meter?: (op: MeteredOp) => void;
  now?: number;
}): Promise<void> {
  const sentence = input.sentence.replace(/\s+/g, " ").trim().slice(0, 400);
  const corrected = input.corrected.replace(/\s+/g, " ").trim().slice(0, 400);
  if (!input.openai || !isIdentified(input.userId) || !sentence || !corrected || same(sentence, corrected)) return;
  const now = input.now ?? Date.now();
  try {
    // Only for someone with a map: the point is to put it there.
    const record = await readCurriculum(input.userId, input.language);
    if (!record) return;
    const target = learningLanguageName(input.language);
    const before = await readWeakRecord(input.userId, input.language);
    const known = Object.entries(before.patterns)
      .map(([key, p]) => ({ key, name: p.name }))
      .slice(0, 30);

    input.meter?.("weakRead");
    const read = await input.openai.chat.completions.create({
      model: READ_MODEL(),
      temperature: 0,
      max_tokens: 150,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: patternPrompt({ target, known }) },
        { role: "user", content: patternMessage(sentence, corrected) },
      ],
    });
    const mistakes = readPatterns(read.choices[0]?.message?.content ?? "", sentence);
    if (mistakes.length === 0) return;
    let weak = applyMistakes(before, mistakes, now);

    const mapId = record.map.id;
    const all = await readMissions(input.userId, input.language, mapId);

    // Mastered once, wrong again: back to learned.
    for (const { key } of mistakes) {
      const placed = weak.patterns[key]?.onMap;
      if (!placed || placed.mapId !== mapId) continue;
      const topic = all[placed.topicId];
      if (!topic) continue;
      const after = applyUse(topic, placed.missionId, false, "chat", now);
      if (after !== topic) await saveTopicMissions(input.userId, input.language, mapId, placed.topicId, after);
    }

    // At most one new item per line, and only while few are open.
    const due = recurringPatterns(weak, mapId, now).find((p) => mistakes.some((m) => m.key === p.key));
    if (due && openWeakCount(all) < MAX_OPEN_WEAK) {
      input.meter?.("weakMission");
      const map = record.map;
      const written = await input.openai.chat.completions.create({
        model: MISSION_MODEL(),
        temperature: 0.4,
        max_tokens: 500,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: weakMissionPrompt({
              target,
              uiName: INTERFACE_LANGUAGE_LABELS[map.uiLanguage] ?? "Korean",
              level: map.level,
            }),
          },
          {
            role: "user",
            content: weakMissionMessage({
              mistake: due.name,
              goal: map.goal,
              topics: map.topics.map((t) => ({
                id: t.id,
                title: t.title,
                summary: t.summary,
                done: record.status[t.id] === "done",
              })),
            }),
          },
        ],
      });
      let parsed: unknown = null;
      try {
        parsed = JSON.parse(written.choices[0]?.message?.content ?? "{}");
      } catch {
        parsed = null;
      }
      const placed = normalizeWeakMission(parsed, map.topics.map((t) => t.id), due.key);
      if (placed) {
        // Read again: the map-use observer may have written in between.
        const fresh = (await readMissions(input.userId, input.language, mapId))[placed.topicId];
        const { topic, missionId } = addWeakMission(fresh, placed.mission);
        await saveTopicMissions(input.userId, input.language, mapId, placed.topicId, topic);
        weak = {
          ...weak,
          patterns: {
            ...weak.patterns,
            [due.key]: { ...weak.patterns[due.key]!, onMap: { mapId, topicId: placed.topicId, missionId } },
          },
        };
      } else {
        console.error("[weak-points] mission unusable", { key: due.key });
      }
    }
    await kvSetJson(weakKey(input.userId, input.language), weak, CURRICULUM_TTL_SECONDS);
  } catch (error) {
    console.error("[weak-points] observe failed", error);
  }
}
