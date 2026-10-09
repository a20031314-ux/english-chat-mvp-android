import type { Pack } from "../types.ts";

/**
 * Knowledge a goal needs — "how software reaches hardware", "enough statistics
 * to read a paper". The sectors are the fields the goal draws on, chosen for
 * it, and the links between topics in different fields are the point: they are
 * where one field hands over to the next.
 *
 * Activities are what a workspace can do with a topic, not tabs of this app:
 * read a lesson written for it, ask the question it raises, practise it in a
 * code runner, or try it on the learner's own situation.
 */
export const knowledgePack: Pack = {
  id: "knowledge",
  framing: () =>
    "You design a study map for one person who wants to understand something well enough to use it. They told you their goal; you lay out the fields it draws on and what to study in each, in an order that gets them there.",
  sectors: {
    mode: "free",
    min: 3,
    max: 5,
    brief: "Each sector is a field of knowledge the goal draws on, named for this goal (for example: digital logic, computer architecture, operating systems).",
  },
  topics: { min: 6, max: 20, perSector: 2, ask: [9, 16] },
  activities: {
    perTopic: [1, 2],
    list: [
      { kind: "lesson", brief: "read a lesson on the topic, written for this learner." },
      {
        kind: "ask",
        brief: "a question worth asking about the topic once the lesson is read.",
        fields: [{ name: "question", type: "text", max: 200, brief: "the question, as the learner would ask it." }],
      },
      {
        kind: "practice",
        brief: "try it in a code runner or a small exercise.",
        fields: [{ name: "runner", type: "text", max: 10, brief: "\"python\", \"web\" or \"none\"." }],
      },
      { kind: "apply", brief: "use the topic on the learner's own situation, from the goal." },
    ],
  },
  rules: () => [
    "Most links cross sectors and say what passes across the boundary — a signal, a value, a decision.",
    "Topics are concrete enough to explain with one example; avoid survey topics like \"overview of X\".",
  ],
};
