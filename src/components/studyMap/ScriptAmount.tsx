"use client";

import { useMemo, useState } from "react";
import type { UICopy } from "@/lib/copy";
import { scriptAmount, type Count } from "@/lib/curriculum/scriptAmount";
import { glossFor } from "@/lib/curriculum/stageScripts";
import { useStageGlosses } from "@/lib/curriculum/useStageGlosses";

/**
 * My 단계 보기 맨 위: 대본으로 익힌 양(curriculum/scriptAmount.ts, 2026-10-28 사용자 "학습량을 정량적으로든 시각적으로든" → 1·2).
 * 숫자 한 줄(표현·문법·틀 = 익힌 것/전체, 말한 문장 수) + "할 수 있는 일"(공통 기능 칸, 그 기능의 틀을 통과하면 켜짐, 단계별).
 */
export function ScriptAmount({
  ui,
  locale,
  language,
  passed,
  skipped,
  inside = false,
}: {
  ui: UICopy;
  locale: string;
  language: string;
  passed: readonly string[];
  /** 시험으로 걸러진 대본·틀(curriculum/known.ts). */
  skipped?: ReadonlySet<string>;
  /** 일일 학습 카드 안(2026-10-29 사용자 "익힌 것은 오늘의 학습 안에 묶어, 지속 학습 데이터와 헷갈리지 않게") — 테두리 없이 구분선. */
  inside?: boolean;
}) {
  const [open, setOpen] = useState(false);
  // 기능 이름은 단계 뜻풀이와 같이 옮긴다(server/stageCopy.ts) — 1~5단계 모두 받아 둔다.
  useStageGlosses(language, 1, locale);
  useStageGlosses(language, 2, locale);
  useStageGlosses(language, 3, locale);
  useStageGlosses(language, 4, locale);
  useStageGlosses(language, 5, locale);
  const key = passed.join(",");
  const skippedKey = skipped ? [...skipped].sort().join(",") : "";
  const amount = useMemo(
    () => scriptAmount(language, new Set(key ? key.split(",") : []), new Set(skippedKey ? skippedKey.split(",") : [])),
    [language, key, skippedKey],
  );
  if (!amount) return null;
  const done = amount.canDo.filter((item) => item.done).length;
  const stages = [...new Set(amount.canDo.map((item) => item.fn.stage))].sort((a, b) => a - b);
  return (
    <section data-script-amount className={inside ? "mt-3 border-t border-line pt-3" : "mt-3 rounded-2xl border border-line px-3 py-3"}>
      <h3 className="text-caption font-semibold text-slate-300">{ui.scriptAmountTitle}</h3>
      <div className="mt-2 grid grid-cols-4 gap-2">
        <Stat label={ui.partExpression} count={amount.expressions} />
        <Stat label={ui.partGrammar} count={amount.grammar} />
        <Stat label={ui.amountFrames} count={amount.frames} />
        <div className="flex flex-col gap-1">
          <span className="text-meta text-slate-400">{ui.amountLines}</span>
          <span className="text-note font-semibold tabular-nums text-ink">{amount.lines}</span>
        </div>
      </div>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="mt-3 flex w-full items-center gap-2 rounded-xl border border-line px-3 py-2 text-start hover:bg-white/5"
      >
        <span className="min-w-0 flex-1 text-note text-slate-100">{ui.canDoTitle}</span>
        <span className="text-caption tabular-nums text-slate-400">
          {done}/{amount.canDo.length}
        </span>
        <span aria-hidden className={`text-caption text-slate-500 ${open ? "rotate-90" : "rtl:rotate-180"}`}>›</span>
      </button>
      {open ? (
        <div className="mt-2 flex flex-col gap-2">
          {stages.map((stage) => (
            <div key={stage}>
              <h4 className="text-meta text-slate-400">{ui.stageNumber.replace("{n}", String(stage))}</h4>
              <ul className="mt-1 flex flex-wrap gap-1.5">
                {amount.canDo
                  .filter((item) => item.fn.stage === stage)
                  .map((item) => (
                    <li
                      key={item.fn.id}
                      dir="auto"
                      className={`rounded-full px-2.5 py-1 text-meta ${item.done ? "bg-status-mastered/20 text-good" : "border border-line text-slate-500"}`}
                    >
                      {item.done ? "✓ " : ""}
                      {glossFor(item.fn.name, locale)}
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}

function Stat({ label, count }: { label: string; count: Count }) {
  const share = count.total ? Math.round((count.done / count.total) * 100) : 0;
  return (
    <div className="flex flex-col gap-1">
      <span className="text-meta text-slate-400">{label}</span>
      <span className="text-note font-semibold tabular-nums text-ink">
        {count.done}
        <span className="text-meta font-normal text-slate-500">/{count.total}</span>
      </span>
      <span aria-hidden className="h-1 overflow-hidden rounded-full bg-white/10">
        <span className="block h-full rounded-full bg-status-mastered" style={{ width: `${share}%` }} />
      </span>
    </div>
  );
}
