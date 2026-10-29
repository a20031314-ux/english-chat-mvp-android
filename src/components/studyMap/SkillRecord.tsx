"use client";

import { useState } from "react";
import { FullScreenLayer } from "@/components/FullScreenLayer";
import { CheckupResult } from "@/components/studyMap/CheckupPlayer";
import type { UICopy } from "@/lib/copy";
import { rateOf, type CheckResult } from "@/lib/curriculum/checkup";
import { PART_IDS, type PartId } from "@/lib/notes/stageParts";

/**
 * 실력 기록(2026-10-29 사용자 "시험을 중심으로 모으는 걸로" → 3번): 처음 시험·단계 시험·이번 주 확인 결과(서버 checkups, 최근 30번)를 한곳에.
 * 보는 방식 [그래프 | 목록](DESIGN.md "보는 방식 고르기"): 그래프 = 갈래마다 시험별 맞힌 몫 막대(큰 시험은 진하게) + 맨 위 단계,
 * 목록 = 최근 것부터 시험 이름·날짜·맞힌 수. 막대·줄을 누르면 그 결과 한 장(바로 앞 결과와 차이). 레벨·등급은 없다.
 */
const VIEW_KEY = "skillRecord.view";

export function SkillRecord({
  ui,
  locale,
  checkups,
  labelOf,
  onClose,
}: {
  ui: UICopy;
  locale: string;
  checkups: readonly CheckResult[];
  labelOf: (key: string) => string;
  onClose: () => void;
}) {
  const [view, setView] = useState<"graph" | "list">(() => {
    try {
      return localStorage.getItem(VIEW_KEY) === "list" ? "list" : "graph";
    } catch {
      return "graph";
    }
  });
  const [open, setOpen] = useState<number | null>(null);
  const choose = (next: "graph" | "list") => {
    setView(next);
    try {
      localStorage.setItem(VIEW_KEY, next);
    } catch {
      // 이 폰에 남기지 못해도 지금은 바뀐다.
    }
  };
  const results = [...checkups].sort((a, b) => a.at - b.at);
  const kindName = (result: CheckResult) =>
    result.kind === "placement"
      ? ui.placementTitle
      : result.kind === "stage"
        ? `${ui.placementTitle} · ${ui.stageNumber.replace("{n}", String(result.stage))}${result.passed ? " ✓" : ""}`
        : ui.checkupTitle;
  const dateOf = (at: number) => new Date(at).toLocaleDateString(locale, { month: "numeric", day: "numeric" });
  const shown = open === null ? null : results[open];
  return (
    <FullScreenLayer>
      <header className="flex shrink-0 items-start gap-2 border-b border-line px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-body font-semibold text-ink">{shown ? kindName(shown) : ui.skillRecord}</h2>
          {shown ? <p className="mt-0.5 text-caption tabular-nums text-slate-400">{dateOf(shown.at)}</p> : null}
        </div>
        <button
          type="button"
          onClick={shown ? () => setOpen(null) : onClose}
          aria-label={ui.billingClose}
          className="rounded-lg px-2 py-1 text-note text-slate-400 hover:bg-white/10"
        >
          {shown ? "‹" : "✕"}
        </button>
      </header>
      <div data-skill-record className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        {shown ? (
          <CheckupResult ui={ui} result={shown} previous={open ? (results[open - 1] ?? null) : null} labelOf={labelOf} onClose={() => setOpen(null)} />
        ) : (
          <div className="flex flex-col gap-4">
            <div role="group" aria-label={ui.myViewLabel} className="flex gap-1.5">
              {(["graph", "list"] as const).map((one) => (
                <button
                  key={one}
                  type="button"
                  aria-pressed={view === one}
                  onClick={() => choose(one)}
                  className={`rounded-full px-3 py-1 text-caption ${view === one ? "bg-white/90 text-slate-900" : "border border-line text-slate-300 hover:bg-white/10"}`}
                >
                  {one === "graph" ? ui.myViewGraph : ui.skillViewList}
                </button>
              ))}
            </div>
            {view === "graph" ? (
              <RecordGraph ui={ui} results={results} onOpen={setOpen} />
            ) : (
              <ul data-record-list className="flex flex-col gap-1.5">
                {results
                  .map((result, index) => ({ result, index }))
                  .reverse()
                  .map(({ result, index }) => {
                    const [right, total] = PART_IDS.reduce(([r, t], part) => [r + (result.parts[part]?.[0] ?? 0), t + (result.parts[part]?.[1] ?? 0)], [0, 0]);
                    return (
                      <li key={result.at}>
                        <button
                          type="button"
                          onClick={() => setOpen(index)}
                          className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2 text-start hover:bg-white/5 ${result.kind ? "border-status-learned/60" : "border-line"}`}
                        >
                          <span className="min-w-0 flex-1 truncate text-note text-ink">{kindName(result)}</span>
                          <span className="shrink-0 text-caption tabular-nums text-slate-400">{dateOf(result.at)}</span>
                          <span className="shrink-0 text-caption tabular-nums text-slate-300">
                            {right}/{total}
                          </span>
                        </button>
                      </li>
                    );
                  })}
              </ul>
            )}
          </div>
        )}
      </div>
    </FullScreenLayer>
  );
}

function partName(ui: UICopy, part: PartId): string {
  return { vocab: ui.partVocab, grammar: ui.partGrammar, expression: ui.partExpression, pronunciation: ui.partPronunciation }[part];
}

/** 갈래마다 한 줄: 시험별 막대(맞힌 몫, 그 갈래 문제가 없던 시험은 빈칸). 맨 위 줄 = 그 시험의 단계. */
function RecordGraph({ ui, results, onOpen }: { ui: UICopy; results: readonly CheckResult[]; onOpen: (index: number) => void }) {
  const parts = PART_IDS.filter((part) => results.some((result) => result.parts[part]));
  const columns = `5rem repeat(${results.length}, minmax(0, 2rem))`;
  return (
    <div data-record-graph className="flex flex-col gap-3">
      <div className="grid items-end gap-1" style={{ gridTemplateColumns: columns }}>
        <span className="text-meta text-slate-500">{ui.stageNumber.replace("{n}", "")}</span>
        {results.map((result) => (
          <span key={result.at} className={`text-center text-meta tabular-nums ${result.kind ? "text-status-learned" : "text-slate-500"}`}>
            {result.stage}
          </span>
        ))}
      </div>
      {parts.map((part) => (
        <div key={part} data-part={part} className="grid items-end gap-1" style={{ gridTemplateColumns: columns }}>
          <span className="truncate text-caption text-ink">{partName(ui, part)}</span>
          {results.map((result, index) => {
            const rate = rateOf(result.parts[part]);
            return (
              <button
                key={result.at}
                type="button"
                onClick={() => onOpen(index)}
                aria-label={rate === null ? undefined : `${Math.round(rate * 100)}%`}
                className="relative h-10 rounded-lg bg-white/5 hover:bg-white/10"
              >
                {rate !== null ? (
                  <span
                    className={`absolute inset-x-0 bottom-0 rounded-lg ${result.kind ? "bg-status-learned" : "bg-white/40"}`}
                    style={{ height: `${Math.max(4, Math.round(rate * 100))}%` }}
                  />
                ) : null}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
