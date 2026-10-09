import {
  ACTIVITY_TABS,
  MAP_SCHEMA_VERSION,
  type ActivityTab,
  type MapActivity,
  type SectorId,
  type StudyMap,
} from "../../map.ts";
import type { Curriculum, CurriculumActivity } from "../types.ts";

/**
 * Between the engine's Curriculum and the StudyMap the app already stores.
 *
 * The 학습 지도 store, progress route and screen speak StudyMap. A curriculum
 * drawn with the language pack converts to one without loss, so moving the
 * generate route onto the engine changes nothing that is stored or shown. The
 * reverse lets the engine's readers (graph.ts) work on maps already saved.
 */

export function toStudyMap(
  c: Curriculum,
  base: { language: string; uiLanguage: string },
): StudyMap {
  if (c.pack !== "language") throw new Error(`only language curricula become study maps, not "${c.pack}"`);
  return {
    v: MAP_SCHEMA_VERSION,
    id: c.id,
    language: base.language,
    uiLanguage: base.uiLanguage,
    goal: c.goal,
    title: c.title,
    summary: c.summary,
    level: c.level,
    sectors: c.sectors.map((s) => ({ id: s.id as SectorId, title: s.title, description: s.description })),
    topics: c.topics.map((t) => ({
      id: t.id,
      sector: t.sector as SectorId,
      title: t.title,
      summary: t.summary,
      order: t.order,
      activities: t.activities
        .filter((a) => ACTIVITY_TABS.includes(a.kind as ActivityTab))
        .map((a) => {
          const out: MapActivity = { tab: a.kind as ActivityTab, task: a.task };
          if (a.kind === "chat" && a.starter) out.starter = a.starter;
          if (a.kind === "video" && a.videoId) out.videoId = a.videoId;
          return out;
        }),
      links: t.links.map((l) => ({ ...l })),
    })),
    createdAt: c.createdAt,
  };
}

export function fromStudyMap(map: StudyMap): Curriculum {
  return {
    v: 1,
    id: map.id,
    pack: "language",
    goal: map.goal,
    level: map.level,
    title: map.title,
    summary: map.summary,
    sectors: map.sectors.map((s) => ({ ...s })),
    topics: map.topics.map((t) => ({
      id: t.id,
      sector: t.sector,
      title: t.title,
      summary: t.summary,
      order: t.order,
      activities: t.activities.map((a) => {
        const out = { kind: a.tab, task: a.task } as CurriculumActivity;
        if (a.starter) out.starter = a.starter;
        if (a.videoId) out.videoId = a.videoId;
        return out;
      }),
      links: t.links.map((l) => ({ ...l })),
      sources: [],
    })),
    createdAt: map.createdAt,
  };
}
