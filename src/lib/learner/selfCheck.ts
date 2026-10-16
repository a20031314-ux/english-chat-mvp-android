/**
 * What the learner said about themselves when they started: where they feel
 * they fall short, what they want to work on most, and (if they said) where
 * they will use the language (hub/drafts/checklist-start-and-learner-brief.md).
 *
 * It replaces writing a goal and picking a level. It is the first material the
 * map, "try this" and the tutors have; once conversations pile up, what was
 * measured takes over from what was said. A level is never asked for or shown —
 * the map is pitched from these answers, and the tutors adjust from the turns.
 *
 * Ids only; the words the learner sees are interface text in copy.ts. Pure.
 */

export const GAP_IDS = ["speaking", "accuracy", "words", "listening", "pronunciation", "natural"] as const;
export const FOCUS_IDS = ["speaking", "listening", "writing", "words"] as const;
export const USE_IDS = ["daily", "travel", "work", "video"] as const;

export type GapId = (typeof GAP_IDS)[number];
export type FocusId = (typeof FOCUS_IDS)[number];
export type UseId = (typeof USE_IDS)[number];

export type SelfCheck = {
  gaps: GapId[];
  focus: FocusId[];
  use?: UseId;
  /** ms since epoch. */
  at: number;
};

const MAX_FOCUS = 2;

function pick<T extends string>(value: unknown, allowed: readonly T[], max: number): T[] {
  const out: T[] = [];
  for (const entry of Array.isArray(value) ? value : []) {
    if (typeof entry === "string" && (allowed as readonly string[]).includes(entry) && !out.includes(entry as T)) {
      out.push(entry as T);
    }
  }
  return out.slice(0, max);
}

/** What survives of a self-check from a request; null when nothing was chosen. */
export function parseSelfCheck(value: unknown, now: number): SelfCheck | null {
  if (!value || typeof value !== "object") return null;
  const raw = value as Record<string, unknown>;
  const gaps = pick(raw.gaps, GAP_IDS, GAP_IDS.length);
  const focus = pick(raw.focus, FOCUS_IDS, MAX_FOCUS);
  const use = typeof raw.use === "string" && (USE_IDS as readonly string[]).includes(raw.use) ? (raw.use as UseId) : undefined;
  if (gaps.length === 0 && focus.length === 0 && !use) return null;
  const at = typeof raw.at === "number" && Number.isFinite(raw.at) ? raw.at : now;
  return { gaps, focus, ...(use ? { use } : {}), at };
}

/**
 * The level a first map is pitched at, never shown. Someone who ticks most of
 * the gaps is starting out; anyone else gets the middle, and the tutors move
 * from there on what the turns show (learner/brief.ts).
 */
export function pitchFor(check: SelfCheck): "beginner" | "intermediate" {
  return check.gaps.length >= 3 || (check.gaps.includes("speaking") && check.gaps.includes("accuracy"))
    ? "beginner"
    : "intermediate";
}

const GAP_MAP_RULE: Record<GapId, string> = {
  speaking: "Words do not come out quickly: put short, frequent speaking situations (A) early, each with a roleplay call as the first activity.",
  accuracy: "They cannot build sentences correctly yet: give the expressions-and-grammar sector (B) more topics, each tied to a situation where it is needed.",
  words: "They lack words and phrases: give the vocabulary sector (C) more topics, as word families the situations use.",
  listening: "They cannot follow fast speech: give pronunciation-and-listening (D) more topics, brought in next to the situations they serve, with video activities.",
  pronunciation: "They worry about pronunciation: include pronunciation topics in D with roleplay calls to say things out loud.",
  natural: "They are correct but sound unnatural: give B topics on natural, everyday phrasing rather than textbook forms.",
};

const FOCUS_MAP_RULE: Record<FocusId, string> = {
  speaking: "They want to practise mostly by speaking: make a roleplay call the first activity of most topics.",
  listening: "They want to practise mostly by listening: give most topics a video activity with listenFor.",
  writing: "They want to practise mostly by writing: make chat the first activity of most topics.",
  words: "They want to build vocabulary most: give most topics a vocab activity and phrases worth keeping.",
};

const USE_MAP_RULE: Record<UseId, string> = {
  daily: "They will use it in everyday conversation: draw the situations from daily life and small talk.",
  travel: "They will use it travelling: draw the situations from a trip (transport, food, lodging, shops, small talk with locals).",
  work: "They will use it at work: draw the situations from the workplace (meetings, colleagues, email, calls).",
  video: "They want to follow videos and shows: draw the situations from what people say on screen, and lean on listening.",
};

/** The lines a map is drawn by, in place of a written goal's detail and a chosen plan. */
export function selfCheckMapRules(check: SelfCheck): string {
  const lines = [
    "What they told us about themselves (they chose these; nothing is measured yet):",
    ...check.gaps.map((gap) => `- ${GAP_MAP_RULE[gap]}`),
    ...check.focus.map((focus) => `- ${FOCUS_MAP_RULE[focus]}`),
    `- ${USE_MAP_RULE[check.use ?? "daily"]}`,
  ];
  return lines.join("\n");
}

/** What a tutor does about each gap while there is little else to go on (learner/brief.ts). */
export const GAP_TUTOR_RULE: Record<GapId, string> = {
  speaking: "they say words do not come out quickly: keep your questions short and easy to answer, one at a time",
  accuracy: "they say they cannot build sentences correctly: now and then ask something that needs a full sentence, and keep yours clear",
  words: "they say they lack words: use one useful new word or phrase per turn where it fits, in a context that makes it clear",
  listening: "they say they cannot follow fast speech: use common words and short sentences, and say things one at a time",
  pronunciation: "they say they worry about pronunciation: keep things relaxed and encourage them to say things out loud",
  natural: "they say they sound unnatural: speak naturally yourself, with everyday phrasing rather than textbook forms",
};
