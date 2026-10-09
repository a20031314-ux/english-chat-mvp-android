import type { Pack } from "../types.ts";

/**
 * A course with a set range — a university subject, an exam. The learner does
 * not want the field opened up; they want their syllabus covered, in its order
 * and its terms, by the exam date.
 *
 * So the scope (a syllabus, a table of contents) is followed as given, and
 * when materials are attached the units follow the materials and every topic
 * names the pages it is taught from. normalize reports pages no topic covers,
 * which is how a screen can say "pages 41–44 aren't in your map yet".
 *
 * input.subject is the course name.
 */
export const coursePack: Pack = {
  id: "course",
  framing: (input) =>
    `You design the study map for one student taking ${input.subject ? `"${input.subject}"` : "a course"}. The range is set by the course; your job is to lay it out so they can cover all of it, in the course's order, and see how its parts depend on each other.`,
  sectors: {
    mode: "free",
    min: 3,
    max: 8,
    brief: "Each sector is a unit of the course, in the order the course teaches it. When a scope or materials are given, the units follow them.",
  },
  topics: { min: 5, max: 24, perSector: 1, ask: [8, 18] },
  sources: true,
  activities: {
    perTopic: [1, 3],
    list: [
      { kind: "lesson", brief: "read a lesson on the topic: definitions, the derivation with no steps skipped, a worked example." },
      { kind: "slides", brief: "go through the topic's pages of the materials with explanations filled in. Only for topics that have sources." },
      {
        kind: "quiz",
        brief: "check understanding with a few exam-style questions.",
        fields: [{ name: "focus", type: "text", max: 120, brief: "what the questions test — the usual exam point." }],
      },
    ],
  },
  rules: () => [
    "Stay inside the course. Prerequisites from earlier courses may be named in links, not added as topics.",
    "Use the course's own symbols and terms.",
  ],
};
