"use client";

import { bankTone } from "@/components/studyMap/bankTone";
import { axisName } from "@/components/studyMap/SkillHexagon";
import type { UICopy } from "@/lib/copy";
import { BAND_GROUPS, bandRows, type BandCell } from "@/lib/curriculum/bandView";
import { STAGES, type Axis, type FillResult } from "@/lib/curriculum/fill";

/** Logbank 칸 색(하늘) — 육각형·위 칸 이름 버튼과 같게. */
const LOG = bankTone("log");

/**
 * Logbank 띠 1단계(2026-11-06 사용자 "육각형 내부 데이터를 띠로" → "2.80에 넣고") — 육각형과 같은 값(computeFill)을
 * 꼭짓점마다 한 줄, 1~5단계 한 칸씩으로 펼친다. 그리는 규칙은 curriculum/bandView.ts.
 * 잰 것이 없는 단계 칸은 빈 테두리(미리 칠하지 않음), 답이 적은 칸은 옅게, 줄 끝은 %(답 8개 미만이면 ─).
 * 줄을 누르면 육각형 꼭짓점과 같은 세부 시트(onAxis). 설명 글 없음(RULES 4) — 이름·숫자·아이콘만.
 */
export function SkillBands({
  ui,
  result,
  before,
  onAxis,
  onRecord,
  recordLabel,
}: {
  ui: UICopy;
  result: FillResult;
  before: FillResult | null;
  onAxis: (axis: Axis) => void;
  /** 📈 실력 기록(기록이 있을 때만) — 육각형 한가운데 있던 것. */
  onRecord?: () => void;
  recordLabel?: string;
}) {
  const rows = new Map(bandRows(result, before).map((row) => [row.axis, row]));
  const cell = (one: BandCell) => (
    <span
      key={one.stage}
      data-band-cell={one.state}
      className={`relative h-3 overflow-hidden rounded-lg ${one.state === "none" ? "border border-dashed border-line" : "bg-white/10"}`}
    >
      {one.state === "none" ? null : (
        <span
          className={`absolute inset-y-0 start-0 rounded-lg ${LOG.bar} ${one.state === "thin" ? "opacity-40" : ""}`}
          style={{ width: `${Math.round(one.value * 100)}%` }}
        />
      )}
    </span>
  );
  return (
    <div data-skill-bands className="flex flex-col gap-2">
      {onRecord ? (
        <button
          type="button"
          data-skill-record-open
          aria-label={recordLabel}
          title={recordLabel}
          onClick={onRecord}
          className="self-end rounded-full px-2 py-0.5 text-note hover:bg-white/10"
        >
          📈
        </button>
      ) : null}
      {BAND_GROUPS.map((group) => (
        <div key={group.join("-")} className="flex flex-col gap-1">
          {group.map((axis) => {
            const row = rows.get(axis)!;
            const name = axisName(ui, axis);
            return (
              <button
                key={axis}
                type="button"
                data-band-row={axis}
                aria-label={`${name} ${row.pct ?? "─"}`}
                onClick={() => onAxis(axis)}
                className="grid grid-cols-[6.5rem_1fr_3.25rem] items-center gap-2 rounded-lg px-1 py-1 text-start hover:bg-white/5"
              >
                <span className="flex min-w-0 items-center gap-1">
                  {row.weak ? <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-warn" /> : null}
                  <span className="truncate text-caption text-ink">{name}</span>
                </span>
                <span className="grid grid-cols-5 gap-0.5">{row.cells.map(cell)}</span>
                <span className="text-end text-meta tabular-nums text-slate-300">
                  {row.pct ?? "─"}
                  {row.gain > 0 ? <span className="block text-info">{`▲${row.gain}`}</span> : null}
                </span>
              </button>
            );
          })}
        </div>
      ))}
      <div aria-hidden className="grid grid-cols-[6.5rem_1fr_3.25rem] gap-2 px-1">
        <span />
        <span className="grid grid-cols-5 gap-0.5">
          {Array.from({ length: STAGES }, (_, i) => (
            <span key={i} className="text-center text-meta tabular-nums text-slate-500">{i + 1}</span>
          ))}
        </span>
        <span />
      </div>
    </div>
  );
}
