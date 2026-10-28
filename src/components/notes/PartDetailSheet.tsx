"use client";

import { useMemo, useState } from "react";
import { BodyLayer } from "@/components/FullScreenLayer";
import { useExpressionInsightOptional } from "@/contexts/ExpressionInsightContext";
import type { UICopy } from "@/lib/copy";
import { HISTORY_DAYS, type PartId, type PartLogItem } from "@/lib/notes/stageParts";

/**
 * 망·그래프를 누르면 "무엇을 공부했나"(2026-10-29 사용자 "My탭의 학습데이터를 구체화해서 — 망이나 그래프를 클릭하면 뭘 공부했는지 구체적으로").
 * 서버 partItems(stageParts.ts partLog — 최근 14일 배움·숙지·고침)를 날짜별로, 아래에 그 갈래 전체 목록(상태별).
 * 그래프 막대에서 열면 그날만 보이고 "전체"로 14일을 다 본다. 낱말·표현을 누르면 표현 자세히, "단계에서 보기"는 예전처럼 단계 보기의 그 갈래.
 */

export type PartAll = { text: string; state: "met" | "learned" | "mastered" | null }[];

const WHERE_ICON: Record<string, string> = {
  chat: "💬",
  call: "📞",
  mission: "📘",
  review: "🔁",
  video: "🎬",
  vocab: "📒",
  map: "📘",
  dm: "✉️",
  room: "🎙",
};

function localDay(at: number): string {
  const d = new Date(at);
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

/** 그래프 막대 번호(0 = 13일 전 … 13 = 오늘) → 그날. */
export function dayOfBar(index: number, now = Date.now()): string {
  return localDay(now - (HISTORY_DAYS - 1 - index) * 24 * 60 * 60 * 1000);
}

export function PartDetailSheet({
  ui,
  locale,
  part,
  title,
  summary,
  items,
  all,
  day,
  dayCount,
  nodeName,
  onStage,
  onClose,
}: {
  ui: UICopy;
  locale: string;
  part: PartId;
  title: string;
  /** "12/30" 같은 찬 정도(망 꼭짓점과 같은 숫자). */
  summary: string;
  items: readonly PartLogItem[];
  /** 그 갈래 전체(어휘 = 익힌 낱말, 표현 = 단계 핵심 표현, 문법 = 단계 문법 칸). */
  all: PartAll;
  /** 그래프 막대에서 열었으면 그날(localDay). */
  day: string | null;
  /** 그날 막대 값(발음은 줄이 남지 않아 숫자만). */
  dayCount?: number;
  nodeName: (id: string) => string;
  onStage?: () => void;
  onClose: () => void;
}) {
  const insight = useExpressionInsightOptional();
  const [only, setOnly] = useState<string | null>(day);
  const dateFormat = useMemo(() => {
    try {
      return new Intl.DateTimeFormat(locale, { month: "short", day: "numeric", weekday: "short" });
    } catch {
      return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" });
    }
  }, [locale]);
  const groups = useMemo(() => {
    const out = new Map<string, PartLogItem[]>();
    // 같은 날 배운 것과 숙지가 둘 다면 숙지 하나만(같은 낱말이 두 줄로 보이지 않게).
    const masteredOn = new Set(items.filter((item) => item.kind === "mastered").map((item) => `${localDay(item.at)}\u0000${item.text}`));
    for (const item of items) {
      const key = localDay(item.at);
      if (only && key !== only) continue;
      if (item.kind === "learned" && masteredOn.has(`${key}\u0000${item.text}`)) continue;
      out.set(key, [...(out.get(key) ?? []), item]);
    }
    return [...out.entries()];
  }, [items, only]);
  const counts = {
    learned: items.filter((item) => item.kind === "learned").length,
    mastered: items.filter((item) => item.kind === "mastered").length,
    fixed: items.filter((item) => item.kind === "fixed").length,
  };
  const open = (text: string) => insight?.open({ sentence: text, selected: text });
  const states = (["mastered", "learned", null] as const).map((state) => ({ state, list: all.filter((row) => (row.state === "met" ? null : row.state) === state) }));
  const stateName = (state: "mastered" | "learned" | null) => (state === "mastered" ? ui.itemsMastered : state === "learned" ? ui.itemsLearned : ui.itemsToLearn);
  const kindName = (kind: PartLogItem["kind"]) => (kind === "mastered" ? ui.itemsMastered : kind === "learned" ? ui.itemsLearned : ui.partFixed);
  const kindStyle = (kind: PartLogItem["kind"]) =>
    kind === "mastered" ? "bg-status-mastered text-slate-900" : kind === "learned" ? "bg-status-learned/20 text-status-learned" : "bg-warn/15 text-warn";

  return (
    <BodyLayer>
      <div className="fixed inset-0 z-[80] flex flex-col justify-end bg-black/60 p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-[max(0.5rem,env(safe-area-inset-top))] sm:items-center sm:justify-center">
        <button type="button" className="absolute inset-0 cursor-default" aria-label={ui.billingClose} onClick={onClose} />
        <div role="dialog" aria-modal="true" aria-label={title} data-part={part} className="relative z-10 flex max-h-full w-full max-w-md flex-col overflow-hidden rounded-2xl border border-line bg-surface-sunk">
          <div className="flex shrink-0 items-start gap-2 border-b border-line px-4 pb-3 pt-4">
            <div className="min-w-0 flex-1">
              <h3 className="text-title font-semibold text-ink">
                {title} <span className="text-note tabular-nums text-slate-400">{summary}</span>
              </h3>
              <p className="mt-1 flex flex-wrap gap-x-3 text-caption tabular-nums text-slate-400">
                <span>{ui.partRecent}</span>
                {counts.mastered ? <span className="text-status-mastered">{ui.itemsMastered} +{counts.mastered}</span> : null}
                {counts.learned ? <span className="text-status-learned">{ui.itemsLearned} +{counts.learned}</span> : null}
                {counts.fixed ? <span className="text-warn">{ui.partFixed} {counts.fixed}</span> : null}
              </p>
            </div>
            <button type="button" onClick={onClose} aria-label={ui.billingClose} className="rounded-lg px-2 py-1 text-note text-slate-400 hover:bg-white/10">
              ✕
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-3">
            {only ? (
              <div className="mb-2 flex items-center gap-2">
                <span className="rounded-full bg-white/90 px-3 py-1 text-caption font-semibold text-slate-900">{dateFormat.format(dayStart(only))}</span>
                <button type="button" onClick={() => setOnly(null)} className="rounded-full border border-line px-3 py-1 text-caption text-slate-300 hover:bg-white/10">
                  {ui.ledgerAll}
                </button>
              </div>
            ) : null}
            {part === "pronunciation" && only && dayCount ? (
              <p className="mb-2 text-note text-slate-200">{ui.partPronDay.replace("{n}", String(Math.round(dayCount * 10) / 10))}</p>
            ) : null}
            {groups.length ? (
              <ol className="flex flex-col gap-3">
                {groups.map(([key, list]) => (
                  <li key={key}>
                    {only ? null : <p className="mb-1 text-meta text-slate-500">{dateFormat.format(dayStart(key))}</p>}
                    <ul className="flex flex-col gap-1.5">
                      {list.map((item, i) => (
                        <li key={`${item.kind}-${item.at}-${i}`}>
                          <button
                            type="button"
                            onClick={() => open(item.kind === "fixed" ? (item.right ?? item.text) : item.text)}
                            className="flex w-full items-start gap-2 rounded-xl border border-line px-3 py-2 text-start hover:bg-white/5"
                          >
                            <span className={`mt-0.5 shrink-0 rounded-full px-2 py-0.5 text-meta font-semibold ${kindStyle(item.kind)}`}>{kindName(item.kind)}</span>
                            <span className="min-w-0 flex-1">
                              {item.kind === "fixed" ? (
                                <>
                                  <span dir="auto" className="block text-note text-slate-400 line-through">
                                    {item.text}
                                  </span>
                                  <span dir="auto" className="block text-note text-emerald-200">
                                    {item.right}
                                  </span>
                                </>
                              ) : (
                                <span dir="auto" className="block text-chat text-ink">
                                  {item.text}
                                </span>
                              )}
                              {item.node ? (
                                <span dir="auto" className="block truncate text-meta text-slate-500">
                                  {nodeName(item.node)}
                                </span>
                              ) : null}
                            </span>
                            {item.where && WHERE_ICON[item.where] ? (
                              <span aria-hidden className="shrink-0 text-caption">
                                {WHERE_ICON[item.where]}
                              </span>
                            ) : null}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="py-2 text-note text-slate-400">{ui.partEmpty}</p>
            )}
            {!only && all.length ? (
              <div className="mt-4 flex flex-col gap-3 border-t border-line pt-3">
                {states
                  .filter((group) => group.list.length)
                  .map((group) => (
                    <div key={String(group.state)}>
                      <p className="mb-1 text-meta text-slate-500">
                        {stateName(group.state)} · {group.list.length}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {group.list.map((row) => {
                          const style = `rounded-full border px-2.5 py-1 text-caption ${
                            group.state === "mastered" ? "border-status-mastered/60 text-ink" : group.state === "learned" ? "border-status-learned/50 text-slate-200" : "border-line text-slate-400"
                          }`;
                          const body = `${group.state === "mastered" ? "✓ " : ""}${row.text}`;
                          // 문법 칸은 칸 이름(앱 언어)이라 표현 자세히로 열지 않는다.
                          return part === "grammar" ? (
                            <span key={row.text} dir="auto" className={style}>
                              {body}
                            </span>
                          ) : (
                            <button key={row.text} type="button" dir="auto" onClick={() => open(row.text)} className={style}>
                              {body}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
              </div>
            ) : null}
          </div>
          {onStage ? (
            <div className="shrink-0 border-t border-line px-4 py-2.5">
              <button type="button" onClick={onStage} className="flex w-full items-center justify-between text-start text-note text-ink">
                <span>{ui.partOpenStage}</span>
                <span aria-hidden className="text-caption text-slate-500 rtl:rotate-180">›</span>
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </BodyLayer>
  );
}

function dayStart(day: string): Date {
  const [y, m, d] = day.split("-").map(Number);
  return new Date(y!, m! - 1, d!);
}
