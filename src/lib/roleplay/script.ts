import type { LearningLanguageCode } from "../learningLanguages.ts";

/**
 * The shape of a scripted roleplay.
 *
 * A roleplay is the cheap half of the call: the tutor's lines are known before
 * anyone opens the app, so their audio is generated once and served to everyone
 * from a file. What costs money at runtime is only listening to the learner —
 * and the live tutor, when it is woken up for a question the script cannot
 * answer. Nothing here talks to a model; this is the content, and the pipeline
 * reads it.
 *
 * The rule that makes the economics work: every `tutor` line must be fixed text.
 * The moment a line is generated per learner, its audio cannot be shared and the
 * scenario costs what a call costs.
 */

/** A line the tutor speaks. Its audio is pre-generated and cached by `id`. */
export type TutorLine = {
  type: "tutor";
  /**
   * Stable within the scenario and never reused for different words: the
   * generated audio is stored under it, so changing the text without changing
   * the id would leave everyone hearing the old recording.
   */
  id: string;
  text: string;
  /** Shown alongside the audio, in the learner's own language. */
  translation?: string;
};

/**
 * A turn where the learner speaks.
 *
 * `accept` is what counts as getting there — several phrasings, because there is
 * rarely one right answer and a scenario that demands one teaches recitation
 * instead of speech. Matching is the pipeline's business; what belongs here is
 * the range of things a person might reasonably say.
 */
export type LearnerTurn = {
  type: "learner";
  id: string;
  /** What the learner is trying to do, in their own language. */
  goal: string;
  accept: string[];
  /** Offered after a struggle, before the live tutor is woken. */
  hint?: string;
};

export type ScriptStep = TutorLine | LearnerTurn;

export type RoleplayScenario = {
  id: string;
  language: LearningLanguageCode;
  title: string;
  /**
   * Where this takes place and who each side is, written for the model rather
   * than the learner: it is what the live tutor is handed when it is woken
   * mid-scenario, so that it arrives knowing the situation instead of guessing
   * from the last thing said.
   */
  setting: string;
  /** Who the tutor is playing. The learner plays themselves. */
  tutorRole: string;
  /**
   * Deliberately no difficulty here. A scenario is walked differently by
   * different people — one takes the main line, another wanders through every
   * branch — so a label on the scenario describes neither of them. Difficulty
   * lives in difficulty.ts as a dial that moves while the conversation runs.
   */
  steps: ScriptStep[];
};

/** Every tutor line in a scenario, which is exactly what needs audio. */
export function tutorLines(scenario: RoleplayScenario): TutorLine[] {
  return scenario.steps.filter(
    (step): step is TutorLine => step.type === "tutor",
  );
}

/**
 * Where a tutor line's audio lives.
 *
 * Scenario id and line id, so two scenarios can both have a "greeting" without
 * colliding, and so a file can be traced back to the line that made it.
 */
export function tutorLineAudioPath(
  scenario: RoleplayScenario,
  line: TutorLine,
): string {
  return `/roleplay/${scenario.language}/${scenario.id}/${line.id}.pcm`;
}

/** Line ids must be unique inside a scenario, or audio files overwrite each other. */
export function duplicateStepIds(scenario: RoleplayScenario): string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const step of scenario.steps) {
    if (seen.has(step.id)) duplicates.add(step.id);
    seen.add(step.id);
  }
  return [...duplicates];
}

/**
 * A scenario has to end on the tutor and alternate, roughly.
 *
 * Two learner turns in a row means the learner speaks into silence, which reads
 * as the app having crashed. Two tutor lines in a row is fine — people say more
 * than one sentence — so only the learner side is checked.
 */
export function consecutiveLearnerTurns(scenario: RoleplayScenario): string[] {
  const offenders: string[] = [];
  scenario.steps.forEach((step, index) => {
    const next = scenario.steps[index + 1];
    if (step.type === "learner" && next?.type === "learner") {
      offenders.push(next.id);
    }
  });
  return offenders;
}
