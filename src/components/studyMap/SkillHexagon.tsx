"use client";

import { useState } from "react";
import type { UICopy } from "@/lib/copy";
import { AXES, STAGES, type Axis, type AxisFill, type FillCell, type FillResult } from "@/lib/curriculum/fill";

/**
 * Logbank 맨 위 언어능력 육각형(2026-11-02 사용자 그림 "언어능력 지도" — 꼭짓점을 누르면 그 변수의 게이지, 빈 곳을 누르면 부족한 것·공부할 것·추천,
 * hub/drafts/fill-gauge-2026-11-02.md 9~11절). 값은 curriculum/fill.ts computeFill. 진한 면 = 지금, 흐린 선 = 고른 기간이 시작할 때.
 * 수렴 전 꼭짓점은 "~n%"와 축 위 범위 띠, 부족한 세부 칸이 있는 꼭짓점은 주황 점. 설명 글 없음(RULES 4) — 이름·숫자·아이콘만.
 */

export function axisName(ui: UICopy, axis: Axis): string {
  return {
    vocabRead: ui.skillVocabRead,
    vocabUse: ui.skillVocabUse,
    sentRead: ui.skillSentRead,
    sentUse: ui.skillSentUse,
    listen: ui.skillListen,
    talk: ui.skillTalk,
  }[axis];
}

export const pct = (axis: AxisFill) => `${axis.converged ? "" : "~"}${Math.round(axis.fill * 100)}%`;

/** 꼭짓점이 약한가: 부족한 세부 칸이 있거나 다른 꼭짓점 평균보다 15%p 넘게 낮음. */
export function weakAxis(result: FillResult, axis: Axis): boolean {
  const one = result.axes[axis];
  if (one.cells.some((cell) => cell.state === "weak")) return true;
  const others = AXES.filter((other) => other !== axis).map((other) => result.axes[other].fill);
  const mean = others.reduce((a, b) => a + b, 0) / others.length;
  return one.converged && one.fill < mean - 0.15;
}

const W = 400;
const H = 300;
const CX = W / 2;
const CY = H / 2 + 4;
const R = 86;

function point(index: number, value: number): [number, number] {
  const angle = -Math.PI / 2 + (index * 2 * Math.PI) / AXES.length;
  return [CX + Math.cos(angle) * R * value, CY + Math.sin(angle) * R * value];
}

export function SkillHexagon({
  ui,
  result,
  before,
  onAxis,
}: {
  ui: UICopy;
  result: FillResult;
  before: FillResult | null;
  onAxis: (axis: Axis) => void;
}) {
  const now = AXES.map((axis, i) => point(i, Math.max(0.02, result.axes[axis].fill)));
  const then = before ? AXES.map((axis, i) => point(i, Math.max(0.02, before.axes[axis].fill))) : null;
  const path = (list: [number, number][]) => list.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ") + " Z";
  return (
    <figure data-skill-hexagon className="m-0 flex justify-center">
      {/* 그림은 오른쪽부터 쓰는 앱에서도 같은 자리 — 글 끝맞춤(textAnchor)이 기하대로 되게 ltr로 그린다(아랍어 이름은 글자 안에서 그대로 오른쪽부터). */}
      <svg viewBox={`0 0 ${W} ${H}`} role="group" aria-label={ui.skillMap} direction="ltr" className="h-auto w-full max-w-[420px]">
        {[0.25, 0.5, 0.75, 1].map((ring) => (
          <path key={ring} d={path(AXES.map((_, i) => point(i, ring)))} className="fill-none stroke-white/15" strokeWidth={ring === 1 ? 1.2 : 0.8} />
        ))}
        {AXES.map((_, i) => {
          const [x, y] = point(i, 1);
          return <line key={i} x1={CX} y1={CY} x2={x} y2={y} className="stroke-white/10" strokeWidth="0.8" />;
        })}
        {then ? <path data-skill-before d={path(then)} className="fill-none stroke-slate-400" strokeWidth="1.2" strokeDasharray="4 3" opacity="0.7" /> : null}
        <path data-skill-now d={path(now)} className="fill-status-mastered stroke-status-mastered" fillOpacity="0.22" strokeWidth="2.2" strokeLinejoin="round" />
        {AXES.map((axis, i) => {
          const one = result.axes[axis];
          const [lx, ly] = point(i, one.low);
          const [hx, hy] = point(i, one.high);
          return one.converged ? null : <line key={`r-${axis}`} x1={lx} y1={ly} x2={hx} y2={hy} className="stroke-status-mastered" strokeWidth="6" strokeLinecap="round" opacity="0.25" />;
        })}
        {AXES.map((axis, i) => {
          const one = result.axes[axis];
          const [x, y] = now[i]!;
          const [tx, ty] = point(i, 1.24);
          const weak = weakAxis(result, axis);
          const anchor = Math.abs(tx - CX) < 8 ? "middle" : tx > CX ? "start" : "end";
          const delta = before ? Math.round((one.fill - before.axes[axis].fill) * 100) : 0;
          return (
            <g
              key={axis}
              role="button"
              tabIndex={0}
              data-skill-axis={axis}
              aria-label={`${axisName(ui, axis)} ${pct(one)}`}
              onClick={() => onAxis(axis)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") onAxis(axis);
              }}
              className="cursor-pointer outline-none"
            >
              <circle cx={x} cy={y} r={weak ? 7 : 5.5} className={weak ? "fill-warn" : "fill-status-mastered"} />
              <text x={tx} y={ty - 6} textAnchor={anchor} className="fill-ink text-caption font-semibold">{axisName(ui, axis)}</text>
              <text x={tx} y={ty + 10} textAnchor={anchor} className="fill-slate-300 text-meta tabular-nums">
                {pct(one)}
                {delta > 0 ? <tspan className="fill-status-mastered">{` ▲${delta}`}</tspan> : null}
              </text>
              <circle cx={tx} cy={ty} r="26" className="fill-transparent" />
            </g>
          );
        })}
      </svg>
    </figure>
  );
}

/* ───────── 2층: 꼭짓점 하나 ───────── */

export type CellGroup = { id: string; title: string; match: (cell: FillCell) => boolean };

export function cellGroups(ui: UICopy, axis: Axis): CellGroup[] {
  const by = (prefix: string) => (cell: FillCell) => cell.id.startsWith(prefix);
  if (axis === "vocabRead" || axis === "vocabUse") {
    return [
      { id: "stage", title: ui.vocabByStage, match: by("stage:") },
      { id: "pos", title: ui.vocabByPos, match: by("pos:") },
      { id: "topic", title: ui.vocabByTopic, match: by("topic:") },
      ...(axis === "vocabUse" ? [{ id: "miss", title: ui.cellMiss, match: by("miss:") }] : []),
    ];
  }
  if (axis === "sentRead" || axis === "sentUse") {
    return [
      { id: "stage", title: ui.vocabByStage, match: by("stage:") },
      { id: "gram", title: ui.partGrammar, match: by("gram:") },
      { id: "fn", title: ui.cellFn, match: by("fn:") },
      ...(axis === "sentUse" ? [{ id: "miss", title: ui.cellMiss, match: by("miss:") }] : []),
    ];
  }
  if (axis === "talk") {
    return [
      { id: "why", title: ui.cellWhy, match: by("why:") },
      { id: "lead", title: ui.cellLead, match: by("lead:") },
      { id: "fn", title: ui.cellFn, match: by("fn:") },
    ];
  }
  return [{ id: "band", title: ui.vocabByStage, match: by("band:") }];
}

const POS: Record<string, keyof UICopy> = { noun: "posNoun", verb: "posVerb", adj: "posAdj", adv: "posAdv", function: "posFunction" };
const FN: Record<string, keyof UICopy> = { self: "fnSelf", ask: "fnAsk", request: "fnRequest", time: "fnTime", reason: "fnReason", compare: "fnCompare", mind: "fnMind", daily: "fnDaily" };
const MISS: Record<string, keyof UICopy> = { spell: "missSpell", form: "missForm", word: "missWord", particle: "missParticle", order: "missOrder", missing: "missMissing" };
const WHY: Record<string, keyof UICopy> = { slow: "whySlow", hint: "whyHint", native: "whyNative", fix: "whyFix", minimal: "whyMinimal" };
const LEAD: Record<string, keyof UICopy> = { ask: "leadAsk", topic: "leadTopic", extend: "leadExtend" };

/** 세부 칸 이름 — 문법 칸은 부르는 쪽(grammarName)이 단계 문법 이름으로. */
export function cellName(ui: UICopy, id: string, grammarName: (stage: number, index: number) => string): string {
  const [kind, a, b] = id.split(":");
  const pick = (table: Record<string, keyof UICopy>) => String(ui[table[a ?? ""] ?? "fillUnknown"] ?? a);
  if (kind === "stage" || kind === "band") return ui.stageNumber.replace("{n}", a ?? "");
  if (kind === "pos") return pick(POS);
  if (kind === "topic") return String(ui[`topic${(a ?? "").charAt(0).toUpperCase()}${(a ?? "").slice(1)}` as keyof UICopy] ?? a);
  if (kind === "gram") return grammarName(Number(a), Number(b)) || `${ui.partGrammar} ${a}-${Number(b) + 1}`;
  if (kind === "fn") return pick(FN);
  if (kind === "miss") return pick(MISS);
  if (kind === "why") return pick(WHY);
  if (kind === "lead") return pick(LEAD);
  if (id === "part:flow") return ui.talkFlow;
  if (id === "part:lead") return ui.cellLead;
  return id;
}

export function AxisDetail({
  ui,
  axis,
  fill,
  grammarName,
  records,
  onCell,
}: {
  ui: UICopy;
  axis: Axis;
  fill: AxisFill;
  grammarName: (stage: number, index: number) => string;
  /** 📎 기록 — 지금 Logbank의 그 갈래 막대·목록(꼭짓점 몫). */
  records: React.ReactNode;
  onCell: (cell: FillCell) => void;
}) {
  const groups = cellGroups(ui, axis);
  const [tab, setTab] = useState<string>(() => groups.find((group) => fill.cells.some((cell) => group.match(cell) && cell.state === "weak"))?.id ?? groups[0]!.id);
  const group = groups.find((one) => one.id === tab);
  const ordered = (list: FillCell[]) =>
    // 단계 칸은 1 → 5 차례대로(부족·아직 모름 먼저가 아니라).
    group && (group.id === "stage" || group.id === "band") ? [...list].sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true })) : list;
  const cells = group ? ordered(fill.cells.filter(group.match)) : [];
  const parts = axis === "talk" ? fill.cells.filter((cell) => cell.id.startsWith("part:")) : [];
  const bar = (value: number, weak: boolean) => (
    <span className="relative h-1.5 w-16 shrink-0 overflow-hidden rounded-full bg-white/10">
      <span className={`absolute inset-y-0 start-0 rounded-full ${weak ? "bg-warn" : "bg-status-mastered"}`} style={{ width: `${Math.round(Math.min(1, Math.max(0, value)) * 100)}%` }} />
    </span>
  );
  return (
    <div data-skill-detail={axis} className="flex flex-col gap-3">
      <div className="flex items-baseline gap-2">
        <span className="text-title font-semibold tabular-nums text-ink">{pct(fill)}</span>
        {fill.converged ? null : <span className="text-meta tabular-nums text-slate-400">{`${Math.round(fill.low * 100)}–${Math.round(fill.high * 100)}%`}</span>}
      </div>
      {/* 게이지: 단계 칸 다섯(듣기는 단계 띠, 실전 대화는 그 단계 통화의 막힘없음). */}
      <div data-skill-gauge className="grid grid-cols-5 gap-1">
        {Array.from({ length: STAGES }, (_, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div className="relative h-16 w-full overflow-hidden rounded-lg bg-white/10">
              <div className="absolute inset-x-0 bottom-0 bg-status-mastered/70" style={{ height: `${Math.round((fill.stages[i] ?? 0) * 100)}%` }} />
            </div>
            <span className="text-meta tabular-nums text-slate-400">{i + 1}</span>
          </div>
        ))}
      </div>
      {parts.map((cell) => (
        <div key={cell.id} className="flex items-center gap-2 text-note">
          <span className="min-w-0 flex-1 truncate text-ink">{cellName(ui, cell.id, grammarName)}</span>
          {bar(cell.value, cell.state === "weak")}
          <span className="w-10 shrink-0 text-end tabular-nums text-slate-300">{cell.state === "unknown" ? "?" : `${Math.round(cell.value * 100)}%`}</span>
        </div>
      ))}
      <div role="tablist" className="flex flex-wrap gap-1">
        {[...groups, { id: "records", title: `📎 ${ui.fillRecords}` }].map((one) => (
          <button
            key={one.id}
            type="button"
            role="tab"
            aria-selected={tab === one.id}
            data-skill-tab={one.id}
            onClick={() => setTab(one.id)}
            className={`rounded-full px-3 py-1 text-caption ${tab === one.id ? "bg-ink text-surface" : "border border-line text-slate-300"}`}
          >
            {one.title}
          </button>
        ))}
      </div>
      {tab === "records" ? (
        records
      ) : cells.length ? (
        <ol data-skill-cells className="flex flex-col gap-1">
          {cells.map((cell) => {
            const weak = cell.state === "weak";
            const counted = cell.id.startsWith("miss:") || cell.id.startsWith("why:") || cell.id.startsWith("lead:") || (axis === "talk" && cell.id.startsWith("fn:"));
            // 단계 칸 값은 채운 몫(어림 포함)이라 답이 적어도 % 로.
            const staged = cell.id.startsWith("stage:") || cell.id.startsWith("band:");
            return (
              <li key={cell.id}>
                <button
                  type="button"
                  data-skill-cell={cell.id}
                  data-skill-state={cell.state}
                  onClick={() => onCell(cell)}
                  className="flex w-full items-center gap-2 rounded-lg border border-line px-3 py-2 text-start hover:bg-white/5"
                >
                  <span aria-hidden className={`w-4 shrink-0 text-center text-caption ${weak ? "text-warn" : "text-slate-500"}`}>{weak ? "▼" : cell.state === "unknown" && !staged ? "?" : cell.state === "strong" ? "▲" : "·"}</span>
                  <span dir="auto" className="min-w-0 flex-1 truncate text-note text-ink">{cellName(ui, cell.id, grammarName)}</span>
                  {counted ? null : bar(cell.value, weak)}
                  <span className="w-10 shrink-0 text-end text-meta tabular-nums text-slate-400">{counted ? cell.n : cell.state === "unknown" && !staged ? "?" : `${Math.round(cell.value * 100)}%`}</span>
                </button>
              </li>
            );
          })}
        </ol>
      ) : (
        <p className="text-note text-slate-500">—</p>
      )}
    </div>
  );
}

/* ───────── 3층: 세부 칸 하나 ───────── */

export type CellPlan = {
  short: { key: string; label: string }[];
  study: { key: string; label: string }[];
  recommend: { icon: string; label: string; go: () => void } | null;
};

export function CellDetail({ ui, cell, plan, onKey }: { ui: UICopy; cell: FillCell; plan: CellPlan; onKey: (key: string) => void }) {
  const list = (title: string, rows: { key: string; label: string }[], tone: string) =>
    rows.length ? (
      <section className="flex flex-col gap-1">
        <h3 className="text-meta font-semibold text-slate-400">{title}</h3>
        <ul className="flex flex-wrap gap-1.5">
          {rows.map((row) => (
            <li key={row.key}>
              <button type="button" data-skill-key={row.key} onClick={() => onKey(row.key)} dir="auto" className={`rounded-full border px-3 py-1 text-caption hover:bg-white/5 ${tone}`}>
                {row.label}
              </button>
            </li>
          ))}
        </ul>
      </section>
    ) : null;
  return (
    <div data-skill-cell-detail={cell.id} className="flex flex-col gap-4">
      <p className="flex items-baseline gap-3 text-note tabular-nums text-slate-300">
        <span className={cell.state === "weak" ? "text-warn" : "text-slate-400"}>{cell.state === "weak" ? `▼ ${ui.fillWeak}` : cell.state === "unknown" ? `? ${ui.fillUnknown}` : ""}</span>
        {cell.n ? <span>{`${cell.n}`}</span> : null}
      </p>
      {list(ui.fillShort, plan.short, "border-warn/50 text-warn")}
      {list(ui.fillToStudy, plan.study, "border-line text-ink")}
      {plan.recommend ? (
        <button type="button" data-skill-recommend onClick={plan.recommend.go} className="tb-btn flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-note font-semibold">
          <span aria-hidden>{plan.recommend.icon}</span>
          <span>{`${ui.fillRecommend} · ${plan.recommend.label}`}</span>
        </button>
      ) : null}
    </div>
  );
}
