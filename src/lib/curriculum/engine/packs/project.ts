import type { Pack } from "../types.ts";

/**
 * Learning by building — "a to-do list that survives a reload". The map is
 * drawn backwards from the thing being made: the sectors are its features,
 * easiest first, and the topics under each are the concepts that feature
 * needs, each taught once, where it is first needed.
 *
 * The build activity carries the request a learner would type into the editor
 * to start that piece, so a screen can offer it as a one-tap start.
 *
 * input.subject is what is being built with ("HTML, CSS and JavaScript").
 */
export const projectPack: Pack = {
  id: "project",
  framing: (input) =>
    `You plan a project for one person who learns by building. They told you what they want to make${input.subject ? ` with ${input.subject}` : ""}; you split it into features, easiest first, and under each feature put the concepts it needs.`,
  sectors: {
    mode: "free",
    min: 3,
    max: 7,
    brief: "Each sector is a feature of the program, in the order it is easiest to build. Its topics are the concepts that feature needs.",
  },
  topics: { min: 4, max: 20, perSector: 1, ask: [6, 14] },
  activities: {
    perTopic: [1, 2],
    list: [
      {
        kind: "build",
        brief: "write the code for this concept as part of the feature.",
        fields: [{ name: "request", type: "text", max: 200, brief: "what the learner would ask for in the editor to start this piece, in their own words." }],
      },
      { kind: "lesson", brief: "read a short lesson on the concept, with an example from this project." },
    ],
  },
  rules: () => [
    "Teach each concept once, under the first feature that needs it; later features link back to it instead of repeating it.",
    "Pitch concepts at the learner's level — no frameworks unless the goal asks for one.",
  ],
};
