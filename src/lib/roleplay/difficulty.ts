/**
 * Moving the level while the conversation is still going.
 *
 * Difficulty stopped being a property of the script the moment scenarios became
 * graphs: two learners walk different paths through the same one, so a label on
 * the scenario describes neither of them. What is left is a dial — how strictly
 * an answer is matched, whether a hint is offered, how long the live tutor waits
 * before stepping in — and a dial can move mid-scene.
 *
 * Pure. It takes what happened on a turn and says where the dial should sit;
 * playing the scenario, judging the answer and waking the tutor all live
 * elsewhere. Everything it reads is something the pipeline already produces.
 */

/** How a single learner turn went. */
export type TurnOutcome = {
  /** Whether what they said was accepted for this turn. */
  matched: boolean;
  /** 1 on a first-try answer, higher when they had another go. */
  attempts: number;
  usedHint: boolean;
  /** Whether the script ran out and the live tutor had to be woken. */
  wokeTutor: boolean;
  /** Silence between the tutor finishing and the learner starting. */
  hesitationMs: number;
};

export type DifficultySettings = {
  /** 1 is the gentlest, 5 the strictest. Deliberately not CEFR: this moves. */
  level: number;
  /**
   * How close an answer has to be to count, 0 to 1. At the bottom a learner who
   * conveys the idea passes; at the top the phrasing has to be right.
   */
  matchStrictness: number;
  showHints: boolean;
  /** Failed attempts tolerated before the live tutor is brought in. */
  tutorPatienceAttempts: number;
};

export const MIN_LEVEL = 1;
export const MAX_LEVEL = 5;

/**
 * Long enough that a person is clearly stuck rather than thinking. Hesitation
 * is the one signal here that is about the learner rather than the answer, and
 * it is the earliest: they go quiet before they get it wrong.
 */
const STUCK_HESITATION_MS = 4000;
/** Answering this promptly, first try, is someone who was never in doubt. */
const FLUENT_HESITATION_MS = 1500;

/**
 * Down after two, up after three.
 *
 * Not symmetric on purpose. Being lost is worse than being bored: someone
 * drowning needs the level to come down now, while someone coasting can spend
 * another turn coasting without harm. Requiring a run in either direction is
 * what stops one unlucky turn from moving anything.
 */
const STRUGGLES_BEFORE_EASIER = 2;
const BREEZES_BEFORE_HARDER = 3;

export function settingsForLevel(level: number): DifficultySettings {
  const clamped = Math.min(MAX_LEVEL, Math.max(MIN_LEVEL, Math.round(level)));
  return {
    level: clamped,
    // 0.4 at the bottom through 0.8 at the top: even the strictest setting
    // leaves room for a person to say it their own way.
    matchStrictness: 0.4 + (clamped - MIN_LEVEL) * 0.1,
    // Hints stop being offered once someone is clearly not needing them.
    showHints: clamped <= 3,
    // Patience narrows as the level rises: at the bottom the tutor waits, at
    // the top it steps in early because the learner is here to be corrected.
    tutorPatienceAttempts: clamped >= 4 ? 1 : 2,
  };
}

/** How a turn read, before any decision about the dial. */
export type TurnReading = "struggled" | "steady" | "breezed";

export function readTurn(outcome: TurnOutcome): TurnReading {
  if (
    !outcome.matched ||
    outcome.wokeTutor ||
    outcome.usedHint ||
    outcome.attempts > 1 ||
    outcome.hesitationMs >= STUCK_HESITATION_MS
  ) {
    return "struggled";
  }
  if (outcome.hesitationMs <= FLUENT_HESITATION_MS) return "breezed";
  return "steady";
}

/**
 * The dial, and the run of turns pointing the same way.
 *
 * The run is what makes this stable: a level that moved on every turn would
 * spend the conversation oscillating, and the learner would feel the ground
 * shifting under them rather than a lesson fitting them.
 */
export type DifficultyState = {
  level: number;
  /** Consecutive turns in one direction. Reset by anything else. */
  streak: number;
  streakOf: TurnReading;
};

export function startingDifficulty(level = 3): DifficultyState {
  return {
    level: Math.min(MAX_LEVEL, Math.max(MIN_LEVEL, Math.round(level))),
    streak: 0,
    streakOf: "steady",
  };
}

/**
 * Take one turn into account and say where the dial sits now.
 *
 * The returned state always replaces the old one; `changed` says whether the
 * level actually moved, which is what a caller shows — or, more often, does not
 * show. Announcing "level lowered" tells someone they are doing badly at the
 * moment they are already struggling.
 */
export function applyTurn(
  state: DifficultyState,
  outcome: TurnOutcome,
): { state: DifficultyState; changed: boolean } {
  const reading = readTurn(outcome);
  const streak = reading === state.streakOf ? state.streak + 1 : 1;
  const next: DifficultyState = { ...state, streak, streakOf: reading };

  if (reading === "struggled" && streak >= STRUGGLES_BEFORE_EASIER) {
    const level = Math.max(MIN_LEVEL, state.level - 1);
    // At the floor there is nothing left to give, so the run is kept rather
    // than reset: the caller can see it and do something else, like offering
    // the tutor unprompted.
    if (level === state.level) return { state: next, changed: false };
    return { state: { level, streak: 0, streakOf: reading }, changed: true };
  }

  if (reading === "breezed" && streak >= BREEZES_BEFORE_HARDER) {
    const level = Math.min(MAX_LEVEL, state.level + 1);
    if (level === state.level) return { state: next, changed: false };
    return { state: { level, streak: 0, streakOf: reading }, changed: true };
  }

  return { state: next, changed: false };
}

/**
 * Whether someone is stuck at the gentlest setting.
 *
 * The dial has run out but the turns have not improved, which is the case that
 * wants a person rather than a setting — the point to stop adjusting and let
 * the live tutor take over.
 */
export function isFloored(state: DifficultyState): boolean {
  return (
    state.level === MIN_LEVEL &&
    state.streakOf === "struggled" &&
    state.streak >= STRUGGLES_BEFORE_EASIER
  );
}
