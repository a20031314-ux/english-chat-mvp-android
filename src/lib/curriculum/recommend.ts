/**
 * The order the map recommends now, from where the learner is — not only the
 * order it was drawn in.
 *
 * The generator's order is the plan on the day the goal was written. After
 * that the learner's own record says more: a topic holding something they keep
 * getting wrong in chat or calls comes first, a topic they started and have not
 * finished comes next, then the ones not started in the drawn order, and the
 * ones finished last. Within each group the drawn order decides, so the map
 * does not jump about for no reason.
 *
 * Pure, so the screen and the tests read the same rule.
 */

import type { MapTopic, StudyMap, TopicStatus } from "./map.ts";
import type { TopicCounts } from "./missions.ts";

export type RecommendReason = "weak" | "continue" | "next" | "done";

export type Recommended = {
  topic: MapTopic;
  /** 1-based place in the order recommended now. */
  place: number;
  reason: RecommendReason;
  /** Items added for recurring mistakes and not mastered yet. */
  weak: number;
};

type Counts = Pick<TopicCounts, "mastered" | "learned" | "toLearn"> & { weak?: number };

const RANK: Record<RecommendReason, number> = { weak: 0, continue: 1, next: 2, done: 3 };

export function recommendedOrder(
  map: StudyMap,
  status: Record<string, TopicStatus>,
  counts: Record<string, Counts | undefined>,
): Recommended[] {
  const rows = map.topics.map((topic) => {
    const c = counts[topic.id];
    const weak = c?.weak ?? 0;
    const state = status[topic.id] ?? "todo";
    const open = c ? c.learned + c.toLearn > 0 : true;
    let reason: RecommendReason;
    if (weak > 0) reason = "weak";
    else if (state === "done" || (c && !open && c.mastered > 0)) reason = "done";
    else if (state === "doing") reason = "continue";
    else reason = "next";
    return { topic, reason, weak };
  });
  rows.sort(
    (a, b) =>
      RANK[a.reason] - RANK[b.reason] ||
      (a.reason === "weak" ? b.weak - a.weak : 0) ||
      a.topic.order - b.topic.order,
  );
  return rows.map((row, index) => ({ ...row, place: index + 1 }));
}

/** What "continue" opens: the first recommended topic that is not finished. */
export function recommendedNext(order: Recommended[]): Recommended | null {
  return order.find((row) => row.reason !== "done") ?? null;
}
