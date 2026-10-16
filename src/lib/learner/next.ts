/**
 * "Try this": the one next thing to do, from what has piled up.
 *
 * The learner no longer manages a list (hub/drafts/coaching-loop.md). What
 * they say is kept — the expression ledger, the mistakes that recur, the map
 * of their goal — and this reads all of it and lines up what would fill the
 * biggest gap, in this order:
 *
 *   1. a mistake that keeps coming back (twice within two weeks);
 *   2. a phrase they learned and have not used in a week;
 *   3. a situation from their goal they have not finished;
 *   4. tasks on the map they started and left;
 *   5. with nothing to go on, a conversation about their day.
 *
 * Each step carries a practice goal (practice.ts), so whichever tab it opens
 * starts with the tutor already knowing what it is for. The screen shows the
 * first and offers the rest one at a time; which were passed over is the
 * screen's to remember.
 *
 * No model call. Pure.
 */

import type { Ledger } from "./ledger.ts";
import type { PracticeGoal } from "./practice.ts";
import type { GapId, SelfCheck } from "./selfCheck.ts";
import { MAX_PRACTICE_PHRASES } from "./practice.ts";
import type { StudyMap, TopicStatus } from "../curriculum/map.ts";
import type { TopicMissions } from "../curriculum/missions.ts";
import { RECUR_COUNT, RECUR_WINDOW_MS, type WeakRecord } from "../curriculum/weakPoints.ts";

const DAY = 24 * 60 * 60 * 1000;
/** A learned phrase not used for this long is worth bringing out again. */
export const UNUSED_AFTER_MS = 7 * DAY;
/** Help this recent and a phrase has not had its chance yet. */
const FRESH_HELP_MS = DAY;
const MAX_STEPS = 6;

export type NextKind = "mistake" | "phrase" | "gap" | "situation" | "mission" | "free";
export type NextTab = "chat" | "roleplay" | "map";

export type NextStep = {
  /** Stable across requests, so a step passed over stays passed over. */
  key: string;
  kind: NextKind;
  /** Where it is best done. The screen may offer the other conversation tab too. */
  tab: NextTab;
  /** Null only for a map step: the tasks carry their own direction. */
  goal: PracticeGoal | null;
  /** The mistake in the interface language, when the map has named it. */
  mistakeLabel?: string;
  /** Times the mistake came up within the window. */
  count?: number;
  /** The phrase a phrase step leads with. */
  phrase?: string;
  /** Whole days since it was last used, or since it was learned. */
  days?: number;
  /** Whether the phrase has been used at all (days counts from that use). */
  used?: boolean;
  topicId?: string;
  topicTitle?: string;
  done?: number;
  total?: number;
  /** For a gap step: which of the gaps they ticked when they started. */
  gap?: GapId;
};

export type NextInput = {
  ledger: Ledger;
  weak: WeakRecord;
  map: StudyMap | null;
  status: Record<string, TopicStatus>;
  /** Missions of the current map, by topic. */
  missions: Record<string, TopicMissions>;
  /** What they said about themselves when they started, if they did. */
  selfCheck?: SelfCheck | null;
  /** The My tab's "grow this next" (growth.ts), which leads the gap steps. */
  growNext?: GapId | null;
  now: number;
};

function lastOutputAt(item: Ledger["items"][string]): number {
  return item.outputs.length ? item.outputs[item.outputs.length - 1]!.at : 0;
}

/** Mission phrases of a topic the learner has not mastered yet, as the ledger sees them. */
function openPhrases(input: NextInput, topicId: string): string[] {
  const missions = input.missions[topicId]?.missions ?? [];
  const items = input.ledger.items;
  const out: string[] = [];
  for (const mission of missions) {
    const phrase = mission.expression?.trim();
    if (!phrase || out.includes(phrase)) continue;
    const item = Object.values(items).find((entry) => entry.text.toLowerCase() === phrase.toLowerCase());
    if (item?.state === "mastered") continue;
    out.push(phrase);
    if (out.length >= MAX_PRACTICE_PHRASES) break;
  }
  return out;
}

function mistakeSteps(input: NextInput): NextStep[] {
  const { now } = input;
  const missionsLabel = (onMap?: { topicId: string; missionId: string }) => {
    if (!onMap || !input.map) return undefined;
    const mission = input.missions[onMap.topicId]?.missions.find((m) => m.id === onMap.missionId);
    return mission?.focus?.trim() || undefined;
  };
  return Object.entries(input.weak.patterns)
    .map(([key, pattern]) => ({
      key,
      pattern,
      recent: pattern.misses.filter((at) => now - at <= RECUR_WINDOW_MS),
    }))
    .filter((row) => row.recent.length >= RECUR_COUNT)
    .sort((a, b) => b.recent.length - a.recent.length || b.recent[b.recent.length - 1]! - a.recent[a.recent.length - 1]!)
    .slice(0, 2)
    .map(({ key, pattern, recent }) => {
      const onMap = input.map && pattern.onMap?.mapId === input.map.id ? pattern.onMap : undefined;
      const topic = onMap ? input.map!.topics.find((t) => t.id === onMap.topicId) : undefined;
      const label = missionsLabel(onMap);
      return {
        key: `mistake:${key}`,
        kind: "mistake" as const,
        tab: "chat" as const,
        goal: {
          mistake: pattern.name,
          ...(topic ? { situation: topic.title } : {}),
        },
        ...(label ? { mistakeLabel: label } : {}),
        count: recent.length,
        ...(topic ? { topicId: topic.id, topicTitle: topic.title } : {}),
      };
    });
}

function phraseSteps(input: NextInput): NextStep[] {
  const { now } = input;
  const due = Object.values(input.ledger.items)
    .filter((item) => item.state === "learned" && item.mark !== "known")
    .map((item) => {
      const used = lastOutputAt(item);
      const since = used ? now - used : now - item.helpAt;
      const ready = used ? since >= UNUSED_AFTER_MS : since >= FRESH_HELP_MS;
      return { item, since, ready };
    })
    .filter((row) => row.ready)
    // Longest waiting first: the one most likely to be slipping.
    .sort((a, b) => b.since - a.since);
  if (due.length === 0) return [];
  const lead = due[0]!.item;
  const phrases = due.slice(0, MAX_PRACTICE_PHRASES).map((row) => row.item.text);
  const topic = lead.map && input.map?.id === lead.map.mapId
    ? input.map.topics.find((t) => t.id === lead.map!.topicId)
    : undefined;
  return [
    {
      key: `phrase:${lead.text.toLowerCase()}`,
      kind: "phrase",
      tab: "roleplay",
      goal: { phrases, ...(topic ? { situation: topic.title } : {}) },
      phrase: lead.text,
      days: Math.max(1, Math.floor(due[0]!.since / DAY)),
      used: lastOutputAt(lead) > 0,
      ...(topic ? { topicId: topic.id, topicTitle: topic.title } : {}),
    },
  ];
}

/**
 * What they said they find hard, as a conversation built for it. Comes after
 * what their own turns show (mistakes, phrases) and before the map's
 * situations: early on it is all there is to go on; later it is one more
 * option among measured ones.
 */
export const GAP_STEP: Record<GapId, { tab: "chat" | "roleplay"; situation: string }> = {
  speaking: { tab: "roleplay", situation: "Quick, light back-and-forth: short questions they can answer in a few words, at an easy pace" },
  accuracy: { tab: "chat", situation: "Telling you about something they did recently, in full sentences, taking their time" },
  words: { tab: "chat", situation: "Talking about their interests, where you bring in one useful new word or phrase at a time" },
  listening: { tab: "roleplay", situation: "Listening to you describe something in a few short sentences and reacting to it" },
  pronunciation: { tab: "roleplay", situation: "A relaxed chat where they say things out loud, with words they find hard to pronounce" },
  natural: { tab: "chat", situation: "Everyday small talk, said the way people really say it" },
};

function gapSteps(input: NextInput): NextStep[] {
  const gaps = [...new Set([...(input.growNext ? [input.growNext] : []), ...(input.selfCheck?.gaps ?? [])])];
  return gaps.slice(0, 2).map((gap) => ({
    key: `gap:${gap}`,
    kind: "gap" as const,
    tab: GAP_STEP[gap].tab,
    goal: { situation: GAP_STEP[gap].situation },
    gap,
  }));
}

/** Situations from the goal, the one being worked on first, then in the map's order. */
function situationSteps(input: NextInput): NextStep[] {
  const map = input.map;
  if (!map) return [];
  const rank = (id: string) => (input.status[id] === "doing" ? 0 : 1);
  return map.topics
    .filter((topic) => topic.sector === "A" && input.status[topic.id] !== "done")
    .sort((a, b) => rank(a.id) - rank(b.id) || a.order - b.order)
    .slice(0, 2)
    .map((topic) => {
      const phrases = openPhrases(input, topic.id);
      return {
        key: `situation:${map.id}:${topic.id}`,
        kind: "situation" as const,
        tab: "roleplay" as const,
        goal: { situation: topic.title, ...(phrases.length ? { phrases } : {}) },
        topicId: topic.id,
        topicTitle: topic.title,
      };
    });
}

/** Tasks started on the map and left unfinished. */
function missionSteps(input: NextInput): NextStep[] {
  const map = input.map;
  if (!map) return [];
  return map.topics
    .map((topic) => {
      const record = input.missions[topic.id];
      const total = record?.missions.length ?? 0;
      const done = record ? record.missions.filter((m) => record.results[m.id]).length : 0;
      return { topic, total, done };
    })
    .filter((row) => row.total > 0 && row.done > 0 && row.done < row.total)
    .sort((a, b) => a.topic.order - b.topic.order)
    .slice(0, 1)
    .map(({ topic, total, done }) => ({
      key: `mission:${map.id}:${topic.id}`,
      kind: "mission" as const,
      tab: "map" as const,
      goal: null,
      topicId: topic.id,
      topicTitle: topic.title,
      done,
      total,
    }));
}

const FREE_STEP: NextStep = {
  key: "free:day",
  kind: "free",
  tab: "chat",
  goal: { situation: "Catching up: what they did today and what is coming up" },
};

export function nextSteps(input: NextInput): NextStep[] {
  const steps = [
    ...mistakeSteps(input),
    ...phraseSteps(input),
    ...gapSteps(input),
    ...situationSteps(input),
    ...missionSteps(input),
  ];
  return [...steps.slice(0, MAX_STEPS - 1), FREE_STEP];
}
