import { SECTOR_BRIEFS, SECTOR_IDS } from "../../map.ts";
import type { Pack } from "../types.ts";

/**
 * Learning a language in this app: the study map the 학습 지도 screen draws.
 *
 * The same sectors, activities and rules as ../prompt.ts, expressed as a pack,
 * so a map drawn by the engine and turned into a StudyMap by adapters/studyMap
 * is the map the existing store, progress route and screen already take. The
 * activities are the app's tabs; a video points only at a clip the caller
 * offered under refs.library.
 *
 * input.subject is the language being learned, by English name.
 */
export const languagePack: Pack = {
  id: "language",
  framing: (input) =>
    `You design a study map for one person learning ${input.subject ?? "a language"}. They told you what they want to be able to do; you lay out what to study to get there.`,
  sectors: { mode: "fixed", list: SECTOR_IDS.map((id) => ({ id, brief: SECTOR_BRIEFS[id] })) },
  topics: { min: 6, max: 16, perSector: 2, ask: [8, 12] },
  activities: {
    perTopic: [1, 3],
    list: [
      {
        kind: "chat",
        brief: "writing back and forth with a tutor.",
        fields: [{ name: "starter", type: "text", max: 200, brief: "the first line the learner could send, in the language being learned." }],
      },
      { kind: "roleplay", brief: "a spoken call with a character in a scene." },
      {
        kind: "video",
        brief: "watching a clip from this month's library. Put the id in \"videoId\", not in the task.",
        fields: [{ name: "videoId", type: "ref", refs: "library", brief: "the clip to watch." }],
      },
      { kind: "vocab", brief: "reviewing the words they saved." },
    ],
  },
  rules: (input) => [
    "Start with a situation they can use soon. Put pronunciation and listening topics next to the situations they serve, not at the end.",
    `Only "starter" is written in ${input.subject ?? "the language being learned"}. Quote its words inside quotes when you mention them elsewhere.`,
  ],
};
