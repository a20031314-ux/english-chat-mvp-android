/**
 * What a learner keeps getting wrong in chat and calls, turned into things to
 * learn on their study map.
 *
 * The map was drawn once from a goal; what someone actually trips over shows
 * up later, in what they say. Each corrected line is read for the kind of
 * mistake it was — "verb tense after a time word", "particle が vs は" — as a
 * short name in English and a stable key, never the sentence: the words are
 * not kept (server/learnerMetrics.ts). The same kind twice within two weeks is
 * a pattern, not a slip, and becomes one mission on the topic it fits best,
 * marked so the map can say why it is there and put that topic first.
 *
 * Works for every learning language: the English construction list
 * (learner/constructions.ts) covers English only, and this does not need one —
 * the reader is given the keys it has used for this learner before, so the
 * same mistake keeps the same key.
 *
 * Pure: prompts, the reading of answers, and the bookkeeping.
 */

import type { Mission, TopicMissions } from "./missions.ts";

/** Seen this many times within the window, a mistake is a pattern. */
export const RECUR_COUNT = 2;
export const RECUR_WINDOW_MS = 14 * 24 * 60 * 60 * 1000;
/** Mistakes older than this are forgotten. */
const KEEP_MS = 60 * 24 * 60 * 60 * 1000;
const MAX_MISSES = 6;
const MAX_PATTERNS = 40;
/** Added items not yet mastered, per map, before more wait their turn. */
export const MAX_OPEN_WEAK = 8;

export type WeakPattern = {
  /** What kind of mistake, in English, a few words; never the learner's words. */
  name: string;
  /** When it was seen, oldest first (ms). */
  misses: number[];
  /** Where it was put on a map. */
  onMap?: { mapId: string; topicId: string; missionId: string };
};

export type WeakRecord = { v: 1; patterns: Record<string, WeakPattern> };

export function emptyWeakRecord(): WeakRecord {
  return { v: 1, patterns: {} };
}

export function parseWeakRecord(raw: unknown): WeakRecord {
  const row = (raw ?? {}) as Partial<WeakRecord>;
  if (row.v !== 1 || !row.patterns || typeof row.patterns !== "object") return emptyWeakRecord();
  return { v: 1, patterns: row.patterns };
}

const KEY = /^[a-z0-9]+(?:-[a-z0-9]+){0,6}$/;

function clean(value: unknown, max: number): string {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim().slice(0, max) : "";
}

export function patternPrompt(input: { target: string; known: Array<{ key: string; name: string }> }): string {
  const known = input.known.length
    ? `\nKinds already seen for this learner — use the same key when it is the same kind of mistake:\n${input.known
        .map((k) => `${k.key} — ${k.name}`)
        .join("\n")}\n`
    : "";
  return `You read one sentence a learner of ${input.target} said or wrote, and the corrected version. Name the kinds of mistake the correction fixed.

- A kind is general, so the same mistake in another sentence gets the same name: "past tense of irregular verbs", "article before a singular noun", "particle を for the object", "word order of time expressions", "polite verb ending". Not "said goed".
- Only real mistakes: grammar, the wrong word, word order, a missing word, a wrong form, register that does not fit. Not spelling of a name, punctuation, capitals, or a change of style the sentence did not need.
- Never quote or translate the learner's sentence in the name.
- At most two kinds. None when the correction only polished it, and none when the learner's line is mostly in another language than ${input.target} — that is a different thing, not a mistake in it.
${known}
"key": lowercase words joined by hyphens, in English, two to five words. "name": a few words in English.

Return only json: {"mistakes":[{"key":"...","name":"..."}]}`;
}

export function patternMessage(sentence: string, corrected: string): string {
  return JSON.stringify({ learner: sentence, corrected });
}

/** Read the reader's answer; junk and quoted sentences are dropped. */
export function readPatterns(raw: string, sentence: string): Array<{ key: string; name: string }> {
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return [];
  }
  const list = Array.isArray((data as { mistakes?: unknown })?.mistakes)
    ? ((data as { mistakes: unknown[] }).mistakes)
    : [];
  const said = sentence.toLowerCase();
  const out: Array<{ key: string; name: string }> = [];
  for (const item of list) {
    const row = (item ?? {}) as Record<string, unknown>;
    const key = clean(row.key, 48).toLowerCase();
    const name = clean(row.name, 60);
    if (!KEY.test(key) || !name || out.some((o) => o.key === key)) continue;
    // A name that carries a run of what they said is their words, not a kind.
    if (name.length >= 12 && said.includes(name.toLowerCase())) continue;
    out.push({ key, name });
    if (out.length === 2) break;
  }
  return out;
}

/** Note the mistakes one line had. Old ones fall away; the record stays small. */
export function applyMistakes(
  record: WeakRecord,
  mistakes: Array<{ key: string; name: string }>,
  now = Date.now(),
): WeakRecord {
  if (mistakes.length === 0) return record;
  const patterns: Record<string, WeakPattern> = {};
  for (const [key, pattern] of Object.entries(record.patterns)) {
    const misses = pattern.misses.filter((at) => now - at < KEEP_MS);
    if (misses.length || pattern.onMap) patterns[key] = { ...pattern, misses };
  }
  for (const { key, name } of mistakes) {
    const before = patterns[key];
    patterns[key] = {
      ...(before ?? {}),
      name: before?.name || name,
      misses: [...(before?.misses ?? []), now].slice(-MAX_MISSES),
    };
  }
  const keys = Object.keys(patterns);
  if (keys.length > MAX_PATTERNS) {
    const last = (p: WeakPattern) => p.misses[p.misses.length - 1] ?? 0;
    keys
      .sort((a, b) => last(patterns[a]!) - last(patterns[b]!))
      .slice(0, keys.length - MAX_PATTERNS)
      .forEach((key) => delete patterns[key]);
  }
  return { v: 1, patterns };
}

/** Patterns seen often enough lately, not yet on this map, most frequent first. */
export function recurringPatterns(
  record: WeakRecord,
  mapId: string,
  now = Date.now(),
): Array<{ key: string; name: string; count: number }> {
  return Object.entries(record.patterns)
    .map(([key, p]) => ({
      key,
      name: p.name,
      count: p.misses.filter((at) => now - at < RECUR_WINDOW_MS).length,
      placed: p.onMap?.mapId === mapId,
    }))
    .filter((p) => !p.placed && p.count >= RECUR_COUNT)
    .sort((a, b) => b.count - a.count)
    .map(({ key, name, count }) => ({ key, name, count }));
}

export function weakMissionPrompt(input: { target: string; uiName: string; level: string }): string {
  return `A learner of ${input.target} (${input.level}) keeps making the same kind of mistake in conversation. Write one mission for their study map that makes them practise getting it right, and choose the topic of the map it belongs to.

A mission is one thing to say in a situation, given as a task the way a teacher would — never as the sentence to say. The situation should come from the chosen topic, and doing the task well should need exactly the thing they get wrong.

- "topicId": the id of the map topic it fits best. Prefer one that is not done.
- "focus": what they keep getting wrong, in ${input.uiName}, a few words a learner understands ("past tense of irregular verbs").
- "task": what to do, in ${input.uiName}. Do not quote or translate the answer.
- "hints": exactly two. The first, in ${input.uiName}: what to watch for, without the words. The second, in ${input.target}: the first two to four words of a good answer, ending with "…".
- "answer": one natural way to do it, in ${input.target}, using the form correctly.
- "expression": the part of the answer that has the form, in ${input.target}, two to six words, exactly as it appears in "answer".

Return only json: {"topicId":"...","focus":"...","task":"...","hints":["...","..."],"answer":"...","expression":"..."}`;
}

export function weakMissionMessage(input: {
  mistake: string;
  goal: string;
  topics: Array<{ id: string; title: string; summary: string; done: boolean }>;
}): string {
  return JSON.stringify({ mistake: input.mistake, learnerGoal: input.goal, topics: input.topics });
}

/** One well-formed mission and the topic it goes on, or null. */
export function normalizeWeakMission(
  raw: unknown,
  topicIds: string[],
  key: string,
): { topicId: string; mission: Omit<Mission, "id"> } | null {
  const row = (raw ?? {}) as Record<string, unknown>;
  const topicId = clean(row.topicId, 4).toUpperCase();
  const task = clean(row.task, 200);
  const answer = clean(row.answer, 200);
  const focus = clean(row.focus, 60);
  const hints = Array.isArray(row.hints) ? row.hints.map((h) => clean(h, 160)) : [];
  const expression = clean(row.expression, 80);
  if (!topicIds.includes(topicId) || !task || !answer || !focus || !hints[0] || !hints[1]) return null;
  const bare = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{M}\p{N}\s]/gu, "").trim();
  if (bare(answer).length >= 4 && bare(task).includes(bare(answer))) return null;
  return {
    topicId,
    mission: {
      task,
      answer,
      hints: [hints[0], hints[1]],
      weak: key,
      focus,
      ...(expression && answer.includes(expression) ? { expression } : {}),
    },
  };
}

/** Put a mission for a mistake on a topic; its id is w1, w2… so it never meets the topic's own. */
export function addWeakMission(
  state: TopicMissions | null | undefined,
  mission: Omit<Mission, "id">,
): { topic: TopicMissions; missionId: string } {
  const missions = state?.missions ?? [];
  let n = 1;
  while (missions.some((m) => m.id === `w${n}`)) n += 1;
  const id = `w${n}`;
  return {
    topic: {
      missions: [...missions, { ...mission, id }],
      results: state?.results ?? {},
      ...(state?.seen ? { seen: state.seen } : {}),
    },
    missionId: id,
  };
}

/** Items added for mistakes on this map that are not mastered yet. */
export function openWeakCount(all: Record<string, TopicMissions>): number {
  let open = 0;
  for (const topic of Object.values(all)) {
    for (const mission of topic.missions) {
      if (mission.weak && !topic.results[mission.id]?.mastered) open += 1;
    }
  }
  return open;
}
