import { interfaceLanguageName, learningLanguageName } from "../learningLanguages.ts";
import type { LearningLanguageCode } from "../learningLanguages.ts";

/**
 * Asking for one sentence of correction, spoken in character.
 *
 * This is the rung below a call and above a written line: it exists for the
 * misses a scenario did not anticipate, where nobody has recorded the answer in
 * advance. The whole point is that it stays one-way — say what they could have
 * said and stop — because the moment it invites a reply it has become a
 * conversation, and a conversation is what the call is for and what it costs.
 *
 * Kept apart from the route so the wording can be read and tested without a
 * network call. The prompt is the product here; the fetch around it is not.
 */

export type CorrectionRequest = {
  /** What the learner actually said, as transcribed. */
  heard: string;
  /** What they were trying to do, in their own language. */
  goal: string;
  setting: string;
  tutorRole: string;
  targetLanguage: LearningLanguageCode;
  /** What the learner speaks, so the explanation lands. */
  nativeLanguage: LearningLanguageCode;
};

export function correctionSystemPrompt(input: CorrectionRequest): string {
  const target = learningLanguageName(input.targetLanguage);
  const native = interfaceLanguageName(input.nativeLanguage);
  return `You are the ${input.tutorRole} in this scene, helping for one moment.

${input.setting}

The learner was trying to: ${input.goal}
They said: "${input.heard}"
It did not work here.

Give them one short line they could have said instead, in ${target}. Say it the
way you would say it standing there — not as a grammar note, and not as a
lesson. One sentence, two at the most.

Then translate that line into ${native} so they can check they understood.

Stay in character. Do not say you are a tutor, do not mention practice, and do
not ask them anything: they are about to try again, and a question would take
the turn away from them.

Reply as JSON: {"text": "<the line, in ${target}>", "translation": "<in ${native}>"}`;
}

/** What comes back, once it has been parsed and checked. */
export type Correction = { text: string; translation: string };

/**
 * Read the model's answer, or nothing.
 *
 * A correction that arrives malformed is worse than none: the learner is stuck,
 * and showing them a fragment of JSON is a second thing gone wrong. The caller
 * treats null as "no correction available" and falls back to letting them try
 * again or call.
 */
export function parseCorrection(raw: string): Correction | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }
  if (typeof parsed !== "object" || parsed === null) return null;
  const record = parsed as { text?: unknown; translation?: unknown };
  const text = typeof record.text === "string" ? record.text.trim() : "";
  const translation =
    typeof record.translation === "string" ? record.translation.trim() : "";
  if (!text) return null;
  return { text, translation };
}
