import { kvGetJson, kvSetJson } from "./kv.ts";
import { isIdentified } from "./identity.ts";
import { readComprehension } from "./learnerProfileStore.ts";
import { readCurriculum, readMissions } from "./curriculumStore.ts";
import { itemState } from "../curriculum/missions.ts";
import {
  applyLearnerLine,
  applyMeet,
  applyMissionResult,
  applyHeard,
  emptyLedger,
  parseLedger,
  type Ledger,
  type LedgerTab,
  type MeetKind,
} from "../learner/ledger.ts";

/**
 * Where a learner's expression ledger is kept (learner/ledger.ts): one per
 * person and learning language, phrases and places only.
 *
 * The first read builds it from what was already known — the expressions they
 * looked up (comprehension) and the current map's items — so nobody starts
 * from an empty page the day this arrives. Kept as long as it is used.
 */
const TTL_SECONDS = 400 * 24 * 60 * 60;

function key(userId: string, language: string): string {
  return `learnerLedger:v1:${userId}:${language}`;
}

async function seed(userId: string, language: string, now: number): Promise<Ledger> {
  let ledger = emptyLedger(language, now);
  try {
    const comprehension = await readComprehension(userId, language);
    for (const item of Object.values(comprehension.items).sort((a, b) => a.firstAt - b.firstAt)) {
      const at = item.firstAt || now;
      ledger = applyMeet(ledger, item.text, item.state === "studied" ? "analyze" : "lookup", { tab: "chat" }, at);
      if (item.state === "used") {
        // Written correctly at some point; how long after the look-up is not
        // known, so only a use well after the first meeting counts as memory.
        const unaided = (item.lastAt || at) - at >= 8 * 60 * 60 * 1000;
        ledger = applyLearnerLine(ledger, item.text, item.text, "chat", unaided ? item.lastAt : at);
      }
    }
    const record = await readCurriculum(userId, language);
    if (record) {
      const all = await readMissions(userId, language, record.map.id);
      for (const [topicId, topic] of Object.entries(all)) {
        for (const mission of topic.missions) {
          if (!mission.expression) continue;
          const map = { mapId: record.map.id, topicId, missionId: mission.id };
          const state = itemState(topic, mission.id).state;
          const at = topic.results[mission.id]?.lastAt ?? now;
          ledger =
            state === "toLearn"
              ? applyMeet(ledger, mission.expression, "task", { tab: "map" }, at, map)
              : applyMissionResult(ledger, mission.expression, state === "mastered" ? "unaided" : "helped", "mission", map, at);
        }
      }
    }
  } catch (error) {
    console.error("[ledger] seed failed", error);
  }
  return ledger;
}

export async function readLedger(userId: string, language: string, now = Date.now()): Promise<Ledger> {
  const stored = parseLedger(await kvGetJson(key(userId, language)), language);
  if (stored) return stored;
  const seeded = await seed(userId, language, now);
  await kvSetJson(key(userId, language), seeded, TTL_SECONDS);
  return seeded;
}

/** Change the ledger and keep it. Never throws: a lost update costs one data point. */
export async function updateLedger(
  userId: string,
  language: string,
  change: (ledger: Ledger) => Ledger,
): Promise<void> {
  if (!isIdentified(userId)) return;
  try {
    const before = await readLedger(userId, language);
    const after = change(before);
    if (after !== before) await kvSetJson(key(userId, language), after, TTL_SECONDS);
  } catch (error) {
    console.error("[ledger] update failed", error);
  }
}

export type MeetEvent = {
  kind: MeetKind;
  text: string;
  tab: LedgerTab;
  videoId?: string;
  t?: number;
};

export function recordMeets(userId: string, language: string, events: MeetEvent[], now = Date.now()) {
  return updateLedger(userId, language, (ledger) =>
    events.reduce(
      (l, e) => applyMeet(l, e.text, e.kind, { tab: e.tab, videoId: e.videoId, t: e.t }, now),
      ledger,
    ),
  );
}

/** A chat or call turn: the learner's line as output, the tutor's as something heard. */
export function recordTurn(input: {
  userId: string;
  language: string;
  where: "chat" | "call";
  learner?: { sentence: string; corrected: string };
  tutorLine?: string;
}) {
  return updateLedger(input.userId, input.language, (ledger) => {
    let next = ledger;
    if (input.learner?.sentence.trim()) {
      next = applyLearnerLine(next, input.learner.sentence, input.learner.corrected, input.where);
    }
    if (input.tutorLine?.trim()) next = applyHeard(next, input.tutorLine);
    return next;
  });
}
