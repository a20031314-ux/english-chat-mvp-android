

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
  /**
   * Set on a mission added because the learner keeps getting the same thing
   * wrong in chat or calls (weakPoints.ts): the pattern's key, and what it is
   * in the interface language ("past tense after 'yesterday'"). Missing on
   * missions written for the topic itself.
   */
  weak?: string;
  focus?: string;
  /**
   * Set on a mission the learner put on the map themselves, from a sentence
   * they were looking at ("put it on my map"). Practised first, like a weak
   * spot, and marked as their own choice.
   */
  picked?: boolean;
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

export type MissionCheck = {
  verdict: MissionVerdict;
  better: string;
  feedback: string;
  reply: string;
};

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
  /** Added for a recurring mistake and not yet mastered. */
  weak: number;
  /** Put on the map by the learner and not yet mastered. */
  picked: number;
};

export function topicCounts(state: TopicMissions | null | undefined, now = Date.now()): TopicCounts {
  const counts: TopicCounts = { total: 0, mastered: 0, learned: 0, toLearn: 0, seen: 0, due: 0, done: 0, weak: 0, picked: 0 };
  if (!state) return counts;
  for (const mission of state.missions) {
    const item = itemState(state, mission.id, now);
    counts.total += 1;
    counts[item.state] += 1;
    if (item.state === "toLearn" && item.seen) counts.seen += 1;
    if (item.due) counts.due += 1;
    if (item.state !== "toLearn") counts.done += 1;
    if (mission.weak && !mission.picked && item.state !== "mastered") counts.weak += 1;
    if (mission.picked && item.state !== "mastered") counts.picked += 1;
  }
  return counts;
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
