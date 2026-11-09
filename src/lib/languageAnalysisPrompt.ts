import { INTERFACE_LANGUAGE_LABELS } from "@/lib/learningLanguages";

export const LEARNER_LEVELS = ["beginner", "intermediate", "advanced"] as const;
export type LearnerLevel = (typeof LEARNER_LEVELS)[number];

export const ANALYSIS_LANGUAGES: Record<string, string> = INTERFACE_LANGUAGE_LABELS;

export function asLearnerLevel(value: unknown): LearnerLevel | undefined {
  return typeof value === "string" &&
    (LEARNER_LEVELS as readonly string[]).includes(value)
    ? (value as LearnerLevel)
    : undefined;
}
