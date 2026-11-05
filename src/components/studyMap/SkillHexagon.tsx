"use client";

import { bankTone } from "@/components/studyMap/bankTone";
import { useState } from "react";
import type { UICopy } from "@/lib/copy";
import { AXES, STAGES, type Axis, type AxisFill, type FillCell, type FillResult } from "@/lib/curriculum/fill";

/** Logbank 칸 색(하늘) — 위 칸 이름 버튼과 같게(2026-11-03). */
const LOG = bankTone("log");

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

/** 긴 꼭짓점 이름(영어·스페인어 등 "Sentence understanding")은 가운데 가까운 띄어쓰기에서 두 줄로 — 그림 옆으로 잘리지 않게. */
export function labelLines(name: string, max = 14): string[] {
  if ([...name].length <= max || !name.includes(" ")) return [name];
  const mid = name.length / 2;
  let cut = -1;
  for (let i = 0; i < name.length; i += 1) if (name[i] === " " && (cut < 0 || Math.abs(i - mid) < Math.abs(cut - mid))) cut = i;
  return [name.slice(0, cut), name.slice(cut + 1)];
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
  onRecord,
  recordLabel,
}: {
  ui: UICopy;
  result: FillResult;
  before: FillResult | null;
  onAxis: (axis: Axis) => void;
  /** 육각형 한가운데 📈. 기록이 있을 때만(2026-11-03). */
  onRecord?: () => void;
  recordLabel?: string;
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
        <path data-skill-now d={path(now)} className={`${LOG.fill} ${LOG.stroke}`} fillOpacity="0.22" strokeWidth="2.2" strokeLinejoin="round" />
        {AXES.map((axis, i) => {
          const one = result.axes[axis];
          const [lx, ly] = point(i, one.low);
          const [hx, hy] = point(i, one.high);
          return one.converged ? null : <line key={`r-${axis}`} x1={lx} y1={ly} x2={hx} y2={hy} className="stroke-info" strokeWidth="6" strokeLinecap="round" opacity="0.25" />;
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
              <circle cx={x} cy={y} r={weak ? 7 : 5.5} className={weak ? "fill-warn" : LOG.fill} />
              <text x={tx} y={ty - 6} textAnchor={anchor} className="fill-ink text-caption font-semibold">
                {labelLines(axisName(ui, axis)).map((line, n, all) => (
                  <tspan key={n} x={tx} dy={n === 0 ? -(all.length - 1) * 15 : 15}>{line}</tspan>
                ))}
              </text>
              <text x={tx} y={ty + 10} textAnchor={anchor} className="fill-slate-300 text-meta tabular-nums">
                {pct(one)}
                {delta > 0 ? <tspan className="fill-info">{` ▲${delta}`}</tspan> : null}
              </text>
              <circle cx={tx} cy={ty} r="26" className="fill-transparent" />
            </g>
          );
        })}
        {onRecord ? (
          <g
            role="button"
            tabIndex={0}
            data-skill-record-open
            aria-label={recordLabel}
            onClick={(event) => {
              event.stopPropagation();
              onRecord();
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onRecord();
              }
            }}
            className="cursor-pointer outline-none"
          >
            <circle cx={CX} cy={CY} r="18" className="fill-black/75 stroke-info" strokeWidth="1.4" />
            <text x={CX} y={CY + 6} textAnchor="middle" className="text-body">
              📈
            </text>
          </g>
        ) : null}
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

/** 칸 id의 앞부분(stage·pos·band…) — 목록 탭과 같다. */
export function tabOf(id: string): string {
  const cut = id.indexOf(":");
  return cut < 0 ? id : id.slice(0, cut);
}

/**
 * 섹터 목록에 보여줄 칸. 단계·듣기 띠는 1→5. 나머지는 부족한 것 전부, 아직 모름은 네 개까지.
 * 맞음·강함과 빈 분류 전체는 넣지 않는다.
 */
export function planCells(cells: readonly FillCell[], tab: string): FillCell[] {
  const list = cells.filter((cell) => tabOf(cell.id) === tab);
  if (tab === "stage" || tab === "band") return [...list].sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));
  return [...list.filter((cell) => cell.state === "weak"), ...list.filter((cell) => cell.state === "unknown").slice(0, 4)];
}

/** 그 칸이 부족한 이유 한 줄. 셈 칸(틀린 꼴·막힌 까닭)은 이름 자체가 이유라 예상 차이를 붙이지 않는다. */
export function lackOf(ui: UICopy, cell: FillCell): string {
  const counted = tabOf(cell.id) === "miss" || tabOf(cell.id) === "why" || tabOf(cell.id) === "lead" || tabOf(cell.id) === "part";
  if (cell.state === "unknown") return ui.fillUnknown;
  if (cell.state === "weak" && !counted && cell.gap > 0) return ui.fillGap.replace("{n}", String(Math.round(cell.gap * 100)));
  if (cell.state === "weak") return ui.fillWeak;
  return "";
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
  const cells = planCells(fill.cells, tab);
  const parts = axis === "talk" ? fill.cells.filter((cell) => cell.id.startsWith("part:")) : [];
  const bar = (value: number, weak: boolean) => (
    <span className="relative h-1.5 w-16 shrink-0 overflow-hidden rounded-full bg-white/10">
      <span className={`absolute inset-y-0 start-0 rounded-full ${weak ? "bg-warn" : LOG.bar}`} style={{ width: `${Math.round(Math.min(1, Math.max(0, value)) * 100)}%` }} />
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
              <div className="absolute inset-x-0 bottom-0 bg-info/70" style={{ height: `${Math.round((fill.stages[i] ?? 0) * 100)}%` }} />
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
            className={`rounded-full px-3 py-1 text-caption ${tab === one.id ? LOG.chip : "border border-line text-slate-300"}`}
          >
            {one.title}
          </button>
        ))}
      </div>
      {tab === "records" ? (
        records
      ) : cells.length ? (
        <ol data-skill-cells className="flex flex-col gap-1">
          {cells.map((cell, index) => {
            const weak = cell.state === "weak";
            const counted = cell.id.startsWith("miss:") || cell.id.startsWith("why:") || cell.id.startsWith("lead:") || (axis === "talk" && cell.id.startsWith("fn:"));
            const staged = cell.id.startsWith("stage:") || cell.id.startsWith("band:");
            const lack = lackOf(ui, cell);
            return (
              <li key={cell.id}>
                <button
                  type="button"
                  data-skill-cell={cell.id}
                  data-skill-state={cell.state}
                  data-skill-order={index + 1}
                  onClick={() => onCell(cell)}
                  className="flex w-full items-center gap-2 rounded-lg border border-line px-3 py-2 text-start hover:bg-white/5"
                >
                  <span className={`w-4 shrink-0 text-center text-caption tabular-nums ${weak ? "text-warn" : "text-slate-400"}`}>{index + 1}</span>
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span dir="auto" className="truncate text-note text-ink">{cellName(ui, cell.id, grammarName)}</span>
                    {lack ? <span className="truncate text-meta text-slate-400">{lack}</span> : null}
                  </span>
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

export type CellStep = { key: string; label: string };
export type CellPlan = {
  /** 이 칸이 섹터 목록에서 몇 번째인지. */
  order: number;
  /** 부족한 점 한 줄. */
  lack: string;
  /** 추천 이유 한 줄. 틀린 기록이 없으면 비운다. */
  why: string;
  /** 틀린 것 순서. 안 푼 표현은 넣지 않는다. */
  steps: CellStep[];
  recommend: { icon: string; label: string; go: () => void } | null;
};

export function CellDetail({ ui, plan, onKey }: { ui: UICopy; plan: CellPlan; onKey: (key: string) => void }) {
  return (
    <div data-skill-cell-detail className="flex flex-col gap-4">
      <section className="flex flex-col gap-1">
        <h3 className="text-meta font-semibold text-slate-400">{ui.fillShort}</h3>
        <p className="text-note text-ink">{plan.lack || "—"}</p>
      </section>
      {plan.steps.length ? (
        <section className="flex flex-col gap-1">
          <h3 className="text-meta font-semibold text-slate-400">{ui.fillOrder}</h3>
          <ol className="flex flex-col gap-1">
            {plan.steps.map((step, index) => (
              <li key={step.key}>
                <button
                  type="button"
                  data-skill-key={step.key}
                  onClick={() => onKey(step.key)}
                  className="flex w-full items-center gap-2 rounded-lg border border-line px-3 py-2 text-start hover:bg-white/5"
                >
                  <span className="w-4 shrink-0 text-center text-caption tabular-nums text-slate-400">{index + 1}</span>
                  <span dir="auto" className="min-w-0 flex-1 truncate text-note text-ink">{step.label}</span>
                </button>
              </li>
            ))}
          </ol>
        </section>
      ) : null}
      {plan.why ? (
        <section className="flex flex-col gap-1">
          <h3 className="text-meta font-semibold text-slate-400">{ui.fillWhy}</h3>
          <p className="text-note text-ink">{plan.why}</p>
        </section>
      ) : null}
      {plan.recommend ? (
        <button type="button" data-skill-recommend onClick={plan.recommend.go} className="tb-btn flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-note font-semibold">
          <span aria-hidden>{plan.recommend.icon}</span>
          <span>{plan.recommend.label}</span>
        </button>
      ) : null}
    </div>
  );
}
