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
};

export type MissionVerdict = "pass" | "close" | "miss";

/** How one mission went, kept per learner. */
export type MissionResult = {
  /** pass: done as asked. corrected: done, with a correction shown. */
  outcome: "pass" | "corrected";
  /** Hints opened before it was done, 0–3. Three means the answer was shown. */
  hints: number;
  tries: number;
};

export type TopicMissions = {
  missions: Mission[];
  results: Record<string, MissionResult>;
};

function text(value: unknown, max: number): string {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim().slice(0, max) : "";
}

/** Whether a task gives its own answer away. */
function revealsAnswer(task: string, answer: string): boolean {
  const a = answer.toLowerCase().replace(/[^\p{L}\p{M}\p{N}\s]/gu, "").trim();
  return a.length >= 4 && task.toLowerCase().includes(a);
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
    missions.push({ id: `m${missions.length + 1}`, task, answer, hints: [hints[0], hints[1]] });
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
- "hints": exactly two hints. The first, in ${input.uiName}: which idea or kind of expression to reach for, without the words. The second, in ${input.target}: the first few words of a good answer, ending with "…".
- "answer": one natural way to do it, in ${input.target}, as a person would say it.

Return only a json object: {"missions":[{"task":"...","hints":["...","..."],"answer":"..."}]}`;
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

/** Record a checked try. A mission already done keeps its first result. */
export function applyCheck(
  state: TopicMissions,
  missionId: string,
  verdict: MissionVerdict,
  hints: number,
  tries = 1,
): TopicMissions {
  if (!state.missions.some((m) => m.id === missionId)) return state;
  const before = state.results[missionId];
  if (before) return state;
  if (verdict === "miss") return state;
  return {
    ...state,
    results: {
      ...state.results,
      [missionId]: {
        outcome: verdict === "pass" ? "pass" : "corrected",
        hints: Math.max(0, Math.min(3, Math.round(hints))),
        tries: Math.max(1, Math.min(20, Math.round(tries))),
      },
    },
  };
}

export function missionProgress(state: TopicMissions | null | undefined): { done: number; total: number } {
  if (!state) return { done: 0, total: 0 };
  return {
    done: state.missions.filter((m) => state.results[m.id]).length,
    total: state.missions.length,
  };
}

/** The topic's status as the missions leave it: started, or all done. */
export function statusFromMissions(state: TopicMissions): "doing" | "done" {
  const { done, total } = missionProgress(state);
  return total > 0 && done === total ? "done" : "doing";
}

/** The first mission not yet done, or null when all are. */
export function nextMission(state: TopicMissions): Mission | null {
  return state.missions.find((m) => !state.results[m.id]) ?? null;
}
