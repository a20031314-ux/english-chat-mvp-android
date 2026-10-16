/**
 * Asking about one's own progress: "what has got better lately?", "what should
 * I do more of?" (hub/drafts/my-growth-network.md, "ask directly").
 *
 * The answer is written from what is kept and nothing else — the growing
 * elements, the mistakes that recur, the stuck moments, what they ticked when
 * they started — handed to the model as data with the numbers in it, so it can
 * say "accuracy grew by 5 this week" and cannot say what it does not know. It
 * may point at one element to grow, which the screen turns into a button.
 *
 * No level, no comparison with anyone else (the product's rule). Pure: the
 * prompt and the reading of the answer; the route gathers the data.
 */

import { ELEMENT_IDS, type ElementId, type GrowthView } from "./growth.ts";
import type { SelfCheck } from "./selfCheck.ts";

export const MAX_QUESTION_CHARS = 300;

const ELEMENT_NAMES: Record<ElementId, string> = {
  speaking: "flow (starting to speak quickly in calls)",
  accuracy: "accuracy (lines needing no correction)",
  words: "range (phrases produced on their own)",
  listening: "listening (phrases understood when heard)",
  pronunciation: "pronunciation (every word heard right when saying a line again)",
  natural: "naturalness (lines already as natural as a native would say)",
};

export type AskData = {
  growth: GrowthView;
  /** What the learner's screen calls each element, in their language. */
  names?: Partial<Record<ElementId, string>>;
  /** Kinds of mistake that recur, with how many times in the last two weeks. */
  mistakes: Array<{ name: string; times: number }>;
  /** Moments they got stuck in calls, last fourteen days. */
  stuckLast14: number;
  stuckPhrases: string[];
  selfCheck: SelfCheck | null;
  /** What the tutors are currently told (brief notes, by kind). */
  tutorNotes: string[];
};

export function askData(data: AskData): string {
  return JSON.stringify({
    elements: data.growth.elements.map((e) => ({
      id: e.id,
      calledOnTheirScreen: data.names?.[e.id] || null,
      what: ELEMENT_NAMES[e.id],
      points: e.points,
      stage: e.stage,
      thisWeek: e.week,
      lastTwoWeeksByDay: e.daily,
      resting: e.resting,
      measured: e.measured,
      recentPhrases: e.leaves.slice(0, 5),
    })),
    growNext: data.growth.next,
    recurringMistakes: data.mistakes,
    stuckInCallsLast14Days: data.stuckLast14,
    phrasesFromStuckMoments: data.stuckPhrases,
    toldUsWhenStarting: data.selfCheck
      ? { gaps: data.selfCheck.gaps, focus: data.selfCheck.focus, use: data.selfCheck.use ?? null }
      : null,
    tutorIsCurrently: data.tutorNotes,
  });
}

export function askSystemPrompt(input: { uiName: string; targetName: string }): string {
  return `You answer a learner's question about their own progress in ${input.targetName}, inside a language app. You are given their data as JSON; answer from it and nothing else.

- Write in ${input.uiName}, 2 to 4 short sentences, warm and plain. ${input.targetName} phrases may be quoted as they are.
- Call each element by "calledOnTheirScreen" when it is given — never by its id or English name.
- Use the numbers you have, said as what was counted ("5 more lines needed no correction this week", "3 stuck moments in calls") — never as "points". Never invent a number, a phrase or an event the data does not show.
- Elements only grow; a resting one has had nothing added for two weeks. Do not describe anything as getting worse.
- Never give a level, a score out of anything, a grade, or a comparison with other people.
- If the data is too thin to answer, say so and suggest having a few conversations first.
- If one element is the natural thing to work on next for this question, name it in "grow" by its id (${ELEMENT_IDS.join(", ")}); usually growNext unless the question points elsewhere. Otherwise leave "grow" empty.

Return only JSON: {"answer":"...","grow":"<id or empty>"}`;
}

export function parseAnswer(raw: string): { answer: string; grow: ElementId | null } | null {
  try {
    const row = JSON.parse(raw) as { answer?: unknown; grow?: unknown };
    const answer = typeof row.answer === "string" ? row.answer.replace(/\s+\n/g, "\n").trim().slice(0, 800) : "";
    if (!answer) return null;
    const grow =
      typeof row.grow === "string" && (ELEMENT_IDS as readonly string[]).includes(row.grow) ? (row.grow as ElementId) : null;
    return { answer, grow };
  } catch {
    return null;
  }
}

/** Element names from a request, cut to size; unknown ids are dropped. */
export function parseNames(value: unknown): Partial<Record<ElementId, string>> {
  if (!value || typeof value !== "object") return {};
  const out: Partial<Record<ElementId, string>> = {};
  for (const id of ELEMENT_IDS) {
    const name = (value as Record<string, unknown>)[id];
    if (typeof name === "string" && name.trim()) out[id] = name.replace(/\s+/g, " ").trim().slice(0, 40);
  }
  return out;
}
