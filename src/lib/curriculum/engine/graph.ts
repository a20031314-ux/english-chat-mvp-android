import type { Curriculum, CurriculumTopic, TopicStatus } from "./types.ts";

/**
 * Reading a curriculum once it exists: what connects to what, what is next,
 * how far along the learner is, and which topics a given activity serves.
 *
 * These are the questions every screen built on a curriculum asks — the map,
 * the "continue" button, a tab that wants to say which topic you are working
 * on — so they live here once rather than in each screen.
 */

/** Every link touching a topic, either way, with the reason as written. */
export function connectionsOf(c: Curriculum, topicId: string): { topic: CurriculumTopic; why: string }[] {
  const byId = new Map(c.topics.map((t) => [t.id, t]));
  const out: { topic: CurriculumTopic; why: string }[] = [];
  for (const link of byId.get(topicId)?.links ?? []) {
    const other = byId.get(link.to);
    if (other) out.push({ topic: other, why: link.why });
  }
  for (const other of c.topics) {
    if (other.id === topicId) continue;
    const back = other.links.find((l) => l.to === topicId);
    if (back && !out.some((o) => o.topic.id === other.id)) out.push({ topic: other, why: back.why });
  }
  return out;
}

/** The first topic in order that is not done — what "continue" opens. */
export function nextTopic(c: Curriculum, status: Record<string, TopicStatus>): CurriculumTopic | null {
  return c.topics.find((t) => status[t.id] !== "done") ?? null;
}

/** Counts for a progress bar, overall and per sector. */
export function progressOf(c: Curriculum, status: Record<string, TopicStatus>) {
  const count = (list: CurriculumTopic[]) => ({
    total: list.length,
    done: list.filter((t) => status[t.id] === "done").length,
    doing: list.filter((t) => status[t.id] === "doing").length,
  });
  return {
    ...count(c.topics),
    sectors: Object.fromEntries(c.sectors.map((s) => [s.id, count(c.topics.filter((t) => t.sector === s.id))])),
  };
}

/**
 * Topics with an activity of this kind — optionally only those whose activity
 * points at a given value, such as one video id. A tab uses this to say "this
 * is part of your map" and to mark the topic as started when the learner
 * practises it there.
 */
export function topicsForActivity(c: Curriculum, kind: string, match?: { field: string; value: string }): CurriculumTopic[] {
  return c.topics.filter((t) => t.activities.some((a) => a.kind === kind && (!match || a[match.field] === match.value)));
}

/** Topics taught from a page of a material — the reverse of a topic's sources. */
export function topicsForPage(c: Curriculum, materialId: string, page: number): CurriculumTopic[] {
  return c.topics.filter((t) => t.sources.some((s) => s.material === materialId && page >= s.from && page <= s.to));
}

/**
 * A status change that follows from practising: "todo" becomes "doing", and
 * nothing else moves. Finishing is the learner's to say.
 */
export function statusAfterPractice(current: TopicStatus | undefined): TopicStatus {
  return current === "done" ? "done" : "doing";
}
