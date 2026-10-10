/**
 * A topic on the study map, turned into things to do.
 *
 * A topic used to end at a button that opened the chat tab: the tutor there did
 * not know the topic, and "done" was whatever the learner ticked. A mission is
 * one thing to say in the topic's situation, given as a task and not as an
 * answer — "greet a colleague you have just met and say your name" — so the
 * learner has to produce it. Then it is checked: done, close (shown the
 * corrected sentence), or not yet (nudged, never told). Hints come in three
 * steps, the last of which is the answer, and how many were used is kept.
 *
 * Missions are written once per topic, the first time someone practises it,
 * in the interface language the map was drawn in — the same rule as the map
 * itself, whose screen already says so when the app is switched to another.
 * What the learner has to say, the example answer and the second hint are in
 * the language being learned.
 *
 * Pure: shapes, prompts, and the bookkeeping. The routes call models and store.
 */

export const MISSIONS_PER_TOPIC = { min: 3, max: 5 } as const;

export type Mission = {
  id: string;
  /** What to do, in the interface language. Never contains the answer. */
  task: string;
  /** One natural way to do it, in the language being learned. Shown last. */
  answer: string;
  /**
   * Two hints before the answer: a direction in the interface language, then
   * the start of a sentence in the language being learned.
   */
  hints: [string, string];
  /**
   * The phrase being practised, in the language being learned — the part any
   * good answer contains. What chat and call lines are searched for, so using
   * it there counts. Missing on missions written before it existed.
   */
  expression?: string;
};

export type MissionVerdict = "pass" | "close" | "miss";

/** How one mission went, kept per learner. */
export type MissionResult = {
  /** pass: done as asked. corrected: done, with a correction shown. */
  outcome: "pass" | "corrected";
  /** Hints opened before it was done, 0–3. Three means the answer was shown. */
  hints: number;
  tries: number;
  /** When it was first done (ms). Missing on results kept before it was. */
  learnedAt?: number;
  /** Whether they can produce it unaided: see items.ts. */
  mastered?: boolean;
  masteredAt?: number;
  /** The last time it was tried or used, for when a review is due. */
  lastAt?: number;
  /** Times it went from mastered back to learned. */
  slips?: number;
  /** Where it was produced unaided, most recent last, at most a few. */
  outputs?: Array<{ at: number; where: OutputPlace }>;
};

export type OutputPlace = "mission" | "review" | "chat" | "call";

export type TopicMissions = {
  missions: Mission[];
  results: Record<string, MissionResult>;
  /** Missions whose example answer was looked at without being done. */
  seen?: Record<string, true>;
};

function text(value: unknown, max: number): string {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim().slice(0, max) : "";
}

/** Whether a task gives its own answer away. */
function revealsAnswer(task: string, answer: string): boolean {
  const a = answer.toLowerCase().replace(/[^\p{L}\p{M}\p{N}\s]/gu, "").trim();
  return a.length >= 4 && task.toLowerCase().includes(a);
}

/**
 * The second hint is the start of a sentence, not most of it. Seen from the
 * model: "今日はお疲れ様でした。…" for an answer whose first sentence that was.
 * Cut back to about half of the answer.
 */
function startOf(hint: string, answer: string): string {
  const bare = hint.replace(/[…\s.]+$/u, "");
  if (bare.length <= answer.length * 0.55) return hint;
  const room = Math.max(2, Math.floor(answer.length * 0.45));
  const spaced = /\s/.test(bare);
  let cut = bare.slice(0, room);
  if (spaced && cut.includes(" ")) cut = cut.slice(0, cut.lastIndexOf(" "));
  return `${cut.replace(/[、。,.!?！？\s]+$/u, "")}…`;
}

/** Keep the well-formed missions; null when too few survive to practise. */
export function normalizeMissions(raw: unknown): Mission[] | null {
  const list = Array.isArray((raw as { missions?: unknown })?.missions)
    ? ((raw as { missions: unknown[] }).missions)
    : [];
  const missions: Mission[] = [];
  for (const item of list) {
    const row = (item ?? {}) as Record<string, unknown>;
    const task = text(row.task, 200);
    const answer = text(row.answer, 200);
    const hints = Array.isArray(row.hints) ? row.hints.map((h) => text(h, 160)) : [];
    if (!task || !answer || !hints[0] || !hints[1]) continue;
    if (revealsAnswer(task, answer)) continue;
    const expression = text(row.expression, 80);
    missions.push({
      id: `m${missions.length + 1}`,
      task,
      answer,
      hints: [hints[0], startOf(hints[1], answer)],
      ...(expression && !revealsAnswer(task, expression) ? { expression } : {}),
    });
    if (missions.length === MISSIONS_PER_TOPIC.max) break;
  }
  return missions.length >= MISSIONS_PER_TOPIC.min ? missions : null;
}

export function missionsSystemPrompt(input: { target: string; uiName: string; level: string }): string {
  return `You write short speaking and writing missions for a ${input.level} learner of ${input.target}, for one topic of their study map.

A mission is one thing to say in the topic's situation. Give it as a task, the way a teacher would — "Greet a colleague you have just met and tell them your name", "Ask what they recommend" — never as the sentence to say. The learner has to come up with the words.

Write ${MISSIONS_PER_TOPIC.min} to ${MISSIONS_PER_TOPIC.max} missions that walk through the situation in order, each one sentence or two for the learner to produce, at their level. Use the topic's expressions where they fit.

For each mission:
- "task": what to do, in ${input.uiName}. Do not quote or translate the answer in it.
- "hints": exactly two hints. The first, in ${input.uiName}: which idea or kind of expression to reach for, without the words. The second, in ${input.target}: only the first two to four words of a good answer, never a whole sentence, ending with "…".
- "answer": one natural way to do it, in ${input.target}, as a person would say it.
- "expression": the phrase this mission practises, in ${input.target}, two to six words, exactly as it appears in "answer" — the part any good answer would contain.

Return only a json object: {"missions":[{"task":"...","hints":["...","..."],"answer":"...","expression":"..."}]}`;
}

export function missionsUserMessage(input: {
  goal: string;
  topic: { title: string; summary: string; sector: string };
  starter?: string;
  listenFor?: string[];
}): string {
  return JSON.stringify({
    learnerGoal: input.goal,
    topic: input.topic.title,
    about: input.topic.summary,
    kind: input.topic.sector,
    ...(input.starter ? { openingLine: input.starter } : {}),
    ...(input.listenFor?.length ? { expressions: input.listenFor } : {}),
  });
}

export function checkSystemPrompt(input: { target: string; uiName: string; focus: string }): string {
  return `You check one answer from a learner of ${input.target}. They were given a task in a situation and wrote or said something to do it.

Decide:
- "pass": it does the task and someone who speaks ${input.target} would understand it and find it natural enough. Small slips that do not change the meaning still pass; put the polished sentence in "better" if there is one.
- "close": it does the task, but with mistakes a ${input.target} speaker would notice — wrong form, wrong word, missing word, unnatural order. Put their sentence corrected in "better", keeping their words and meaning.
- "miss": it does not do the task yet — off the task, not in ${input.target}, too little to tell, or not understandable. Do not give the answer. "feedback" says what to try, in one short sentence.

Do not compare word for word with the example answer: many answers are right.

"feedback": one short sentence in ${input.uiName} — for pass, what was good; for close, what the correction changed; for miss, a nudge toward the task without the words.
"reply": for pass and close, one short line in ${input.target} from the other person in the situation, reacting naturally, as the conversation would go on. Empty for miss.
"better": in ${input.target}, or empty.
${input.focus ? `\nWhat goes wrong in ${input.target} in particular:\n${input.focus}\n` : ""}
Return only a json object: {"verdict":"pass"|"close"|"miss","better":"...","feedback":"...","reply":"..."}`;
}

export type MissionCheck = {
  verdict: MissionVerdict;
  better: string;
  feedback: string;
  reply: string;
};

export function normalizeCheck(raw: unknown, answer: string): MissionCheck | null {
  const row = (raw ?? {}) as Record<string, unknown>;
  const verdict = row.verdict;
  if (verdict !== "pass" && verdict !== "close" && verdict !== "miss") return null;
  const better = text(row.better, 300);
  const same = (a: string, b: string) =>
    a.toLowerCase().replace(/[^\p{L}\p{M}\p{N}]/gu, "") === b.toLowerCase().replace(/[^\p{L}\p{M}\p{N}]/gu, "");
  return {
    verdict,
    // A correction that comes back as what they wrote is not one.
    better: verdict === "miss" || !better || same(better, answer) ? "" : better,
    feedback: text(row.feedback, 240),
    reply: verdict === "miss" ? "" : text(row.reply, 240),
  };
}

/**
 * How long after the last try a mission can count as produced from memory.
 * Long enough that the answer just shown, or the correction just read, is no
 * longer on screen in their head; short enough that tonight can count for
 * this morning. Retrying straight after a correction is practice, not proof.
 */
export const REVIEW_GAP_MS = 8 * 60 * 60 * 1000;
const MAX_OUTPUTS = 5;

function withOutput(result: MissionResult, where: OutputPlace, now: number): MissionResult["outputs"] {
  return [...(result.outputs ?? []), { at: now, where }].slice(-MAX_OUTPUTS);
}

/** A mastered item that came out wrong goes back to learned. */
function slipped(result: MissionResult, now: number): MissionResult {
  return result.mastered
    ? { ...result, mastered: false, masteredAt: undefined, slips: (result.slips ?? 0) + 1, lastAt: now }
    : { ...result, lastAt: now };
}

/**
 * Record a checked try, from a mission or a review.
 *
 * Mastered means they can produce it unaided: done with no hints and passed
 * outright, either the very first time (they knew it already) or once some
 * hours have passed since they last tried it. Done with hints, or corrected,
 * is learned. Getting a mastered one wrong takes it back to learned.
 */
export function applyCheck(
  state: TopicMissions,
  missionId: string,
  verdict: MissionVerdict,
  hints: number,
  tries = 1,
  now = Date.now(),
  where: "mission" | "review" = "mission",
): TopicMissions {
  if (!state.missions.some((m) => m.id === missionId)) return state;
  const before = state.results[missionId];
  const clean = verdict === "pass" && hints <= 0;
  let after: MissionResult | undefined;

  if (!before) {
    if (verdict === "miss") return state;
    after = {
      outcome: verdict === "pass" ? "pass" : "corrected",
      hints: Math.max(0, Math.min(3, Math.round(hints))),
      tries: Math.max(1, Math.min(20, Math.round(tries))),
      learnedAt: now,
      lastAt: now,
      ...(clean ? { mastered: true, masteredAt: now, outputs: [{ at: now, where }] } : {}),
    };
  } else if (clean) {
    const fromMemory = now - (before.lastAt ?? 0) >= REVIEW_GAP_MS;
    after = {
      ...before,
      lastAt: now,
      outputs: withOutput(before, where, now),
      ...(!before.mastered && fromMemory ? { mastered: true, masteredAt: now } : {}),
    };
  } else {
    after = slipped(before, now);
  }
  return { ...state, results: { ...state.results, [missionId]: after } };
}

/**
 * The phrase turned up in something they said in chat or a call. Used right,
 * it is output they produced on their own — mastered, unless they only just
 * practised it. Used wrong, a mastered one slips.
 */
export function applyUse(
  state: TopicMissions,
  missionId: string,
  correct: boolean,
  where: "chat" | "call",
  now = Date.now(),
): TopicMissions {
  if (!state.missions.some((m) => m.id === missionId)) return state;
  const before = state.results[missionId];
  if (!correct) {
    return before?.mastered
      ? { ...state, results: { ...state.results, [missionId]: slipped(before, now) } }
      : state;
  }
  const base: MissionResult = before ?? { outcome: "pass", hints: 0, tries: 1, learnedAt: now };
  const fromMemory = !before || now - (before.lastAt ?? 0) >= REVIEW_GAP_MS;
  const after: MissionResult = {
    ...base,
    lastAt: now,
    outputs: withOutput(base, where, now),
    ...(!base.mastered && fromMemory ? { mastered: true, masteredAt: now } : {}),
  };
  return { ...state, results: { ...state.results, [missionId]: after } };
}

/** The example answer was looked at. Shown as a mark, never as progress. */
export function markSeen(state: TopicMissions, missionId: string): TopicMissions {
  if (!state.missions.some((m) => m.id === missionId) || state.seen?.[missionId]) return state;
  return { ...state, seen: { ...(state.seen ?? {}), [missionId]: true } };
}

export type ItemState = "toLearn" | "learned" | "mastered";

export function itemState(
  state: TopicMissions,
  missionId: string,
  now = Date.now(),
): { state: ItemState; seen: boolean; due: boolean } {
  const result = state.results[missionId];
  const seen = Boolean(state.seen?.[missionId]);
  if (!result) return { state: "toLearn", seen, due: false };
  if (result.mastered) return { state: "mastered", seen, due: false };
  return { state: "learned", seen, due: now - (result.lastAt ?? 0) >= REVIEW_GAP_MS };
}

export type TopicCounts = {
  total: number;
  mastered: number;
  learned: number;
  toLearn: number;
  seen: number;
  due: number;
  /** Done at least once, for the task screen's own counter. */
  done: number;
};

export function topicCounts(state: TopicMissions | null | undefined, now = Date.now()): TopicCounts {
  const counts: TopicCounts = { total: 0, mastered: 0, learned: 0, toLearn: 0, seen: 0, due: 0, done: 0 };
  if (!state) return counts;
  for (const mission of state.missions) {
    const item = itemState(state, mission.id, now);
    counts.total += 1;
    counts[item.state] += 1;
    if (item.state === "toLearn" && item.seen) counts.seen += 1;
    if (item.due) counts.due += 1;
    if (item.state !== "toLearn") counts.done += 1;
  }
  return counts;
}

export function missionProgress(state: TopicMissions | null | undefined): { done: number; total: number } {
  const counts = topicCounts(state);
  return { done: counts.done, total: counts.total };
}

/** The topic as its items leave it: started once anything is done, done when all are mastered. */
export function statusFromMissions(state: TopicMissions): "doing" | "done" {
  const counts = topicCounts(state);
  return counts.total > 0 && counts.mastered === counts.total ? "done" : "doing";
}

/** Learned items ready to be produced from memory. */
export function dueMissions(state: TopicMissions, now = Date.now()): Mission[] {
  return state.missions.filter((m) => itemState(state, m.id, now).due);
}

/** The first mission not yet done, or null when all are. */
export function nextMission(state: TopicMissions): Mission | null {
  return state.missions.find((m) => !state.results[m.id]) ?? null;
}
