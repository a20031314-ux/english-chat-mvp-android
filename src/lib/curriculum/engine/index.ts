/**
 * The curriculum engine: one way to draw a study map from a goal, with packs
 * for the kinds of learning it serves.
 *
 *   const result = await generateCurriculum({
 *     pack: languagePack,
 *     input: { goal, level, writeIn: "Korean", subject: "Spanish", refs: { library } },
 *     model: openAICurriculumModel(),          // server/curriculumModel.ts
 *     id: crypto.randomUUID(),
 *   });
 *   if (result.ok) save(toStudyMap(result.curriculum, { language, uiLanguage }));
 *
 * A new kind of learning is a new pack — sectors, activities, rules — and
 * nothing else in this folder changes. See README.md beside this file.
 */
export * from "./types.ts";
export { normalizeCurriculum, allowedSectorIds } from "./normalize.ts";
export { buildCurriculumPrompt, type CurriculumPrompt } from "./prompt.ts";
export { generateCurriculum, readJsonReply, type CurriculumModel, type GenerateResult } from "./generate.ts";
export { connectionsOf, nextTopic, progressOf, topicsForActivity, topicsForPage, statusAfterPractice } from "./graph.ts";
export { toStudyMap, fromStudyMap } from "./adapters/studyMap.ts";
export { languagePack } from "./packs/language.ts";
export { knowledgePack } from "./packs/knowledge.ts";
export { coursePack } from "./packs/course.ts";
export { projectPack } from "./packs/project.ts";

import { languagePack } from "./packs/language.ts";
import { knowledgePack } from "./packs/knowledge.ts";
import { coursePack } from "./packs/course.ts";
import { projectPack } from "./packs/project.ts";
import type { Pack } from "./types.ts";

/** Every pack by id, for routes that take the kind of map as a parameter. */
export const PACKS: Record<string, Pack> = {
  [languagePack.id]: languagePack,
  [knowledgePack.id]: knowledgePack,
  [coursePack.id]: coursePack,
  [projectPack.id]: projectPack,
};
