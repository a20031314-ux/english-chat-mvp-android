"use client";

import { useEffect, useState } from "react";
import { usePremium } from "@/contexts/PremiumContext";
import type { UICopy } from "@/lib/copy";
import { itemState, type ItemState, type TopicMissions } from "@/lib/curriculum/missions";
import { fetchMissions } from "@/lib/studyMapClient";
import { learningLanguageTextDir } from "@/lib/learningLanguages";

/**
 * Mastered, learned, to learn — as one bar, and as the topic's phrases.
 *
 * A phrase only shows its words once the learner has done its task: before
 * that, the task stands in for it, because showing the words would be giving
 * the answer (PRODUCT.md, "먼저 해보게 하고"). Looked at but not done is a
 * mark on the row, not a step forward.
 */

const SEGMENTS: Array<{ key: "mastered" | "learned" | "toLearn"; className: string }> = [
  { key: "mastered", className: "bg-emerald-400" },
  { key: "learned", className: "bg-amber-300" },
  { key: "toLearn", className: "bg-white/15" },
];

export function ItemBar({ counts }: { counts: { mastered: number; learned: number; toLearn: number } }) {
  const total = counts.mastered + counts.learned + counts.toLearn;
  if (!total) return null;
  return (
    <span className="flex h-1.5 w-full overflow-hidden rounded-full bg-white/5" aria-hidden>
      {SEGMENTS.map(({ key, className }) =>
        counts[key] ? (
          <span key={key} className={className} style={{ width: `${(counts[key] / total) * 100}%` }} />
        ) : null,
      )}
    </span>
  );
}

const ORDER: ItemState[] = ["mastered", "learned", "toLearn"];

export function TopicItems({
  ui,
  mapId,
  topicId,
  targetLanguage,
}: {
  ui: UICopy;
  mapId: string;
  topicId: string;
  targetLanguage: string;
}) {
  const { isPremium } = usePremium();
  const [topic, setTopic] = useState<TopicMissions | null>(null);
  const dir = learningLanguageTextDir(targetLanguage);

  useEffect(() => {
    let cancelled = false;
    void fetchMissions({ language: targetLanguage, mapId, topicId, isPremium }).then((result) => {
      if (!cancelled && result.ok) setTopic(result.topic);
    });
    return () => {
      cancelled = true;
    };
  }, [targetLanguage, mapId, topicId, isPremium]);

  if (!topic) return null;
  const label: Record<ItemState, string> = {
    mastered: ui.itemsMastered,
    learned: ui.itemsLearned,
    toLearn: ui.itemsToLearn,
  };
  const dot: Record<ItemState, string> = {
    mastered: "bg-emerald-400",
    learned: "bg-amber-300",
    toLearn: "bg-white/25",
  };
  const rows = topic.missions
    .map((mission) => ({ mission, item: itemState(topic, mission.id) }))
    .sort((a, b) => ORDER.indexOf(a.item.state) - ORDER.indexOf(b.item.state));

  return (
    <section className="mt-4">
      <p className="text-[11px] font-semibold tracking-wide text-slate-500">{ui.topicItemsTitle}</p>
      <p className="mt-1 text-[12px] leading-relaxed text-slate-500">{ui.topicItemsHint}</p>
      <ul className="mt-2 space-y-1.5">
        {rows.map(({ mission, item }) => (
          <li key={mission.id} className="flex items-start gap-2 rounded-lg bg-white/[0.03] px-3 py-2">
            <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${dot[item.state]}`} />
            <span className="min-w-0 flex-1">
              <span className="block text-[11px] text-slate-500">
                {label[item.state]}
                {item.seen && item.state === "toLearn" ? ` · ${ui.itemSeen}` : ""}
              </span>
              {item.state === "toLearn" ? (
                <span className="block text-[13px] leading-snug text-slate-300">{mission.task}</span>
              ) : (
                <span className="block text-[13px] leading-snug text-slate-100" dir={dir}>
                  {mission.expression || mission.answer}
                </span>
              )}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
