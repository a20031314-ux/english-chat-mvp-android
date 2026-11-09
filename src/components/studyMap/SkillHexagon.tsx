"use client";

import { bankTone } from "@/components/studyMap/bankTone";
import type { UICopy } from "@/lib/copy";
import { AXES, type Axis, type AxisFill, type FillResult } from "@/lib/curriculum/fill";
import { axisGain, axisShown, axisWeak, bandPct } from "@/lib/curriculum/bandView";

/** 하늘색(Logbank 칸과 같은 색) — 통화 끝 화면의 육각형. */
const LOG = bankTone("log");

/**
 * Logbank 맨 위 언어능력 육각형(2026-11-02 사용자 그림 "언어능력 지도" — 꼭짓점을 누르면 그 변수의 게이지, 빈 곳을 누르면 부족한 것·공부할 것·추천,
 * hub/drafts/fill-gauge-2026-11-02.md 9~11절). 값은 curriculum/fill.ts computeFill. 진한 면 = 지금, 흐린 선 = 고른 기간이 시작할 때.
 * 수렴 전 꼭짓점은 "~n%"와 축 위 범위 띠, 부족한 세부 칸이 있는 꼭짓점은 주황 점. 설명 글 없음(RULES 4) — 이름·숫자·아이콘만.
 * 숫자·점·▲는 띠(SkillBands)와 같은 규칙(curriculum/bandView.ts, 2026-11-07): 답 8개 미만인 꼭짓점은 ─, 면은 가운데, 빈 점.
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

/** 꼭짓점 숫자 — 띠와 같은 규칙(답 8개 미만이면 ─). */
export const pct = (axis: AxisFill) => bandPct(axis) ?? "─";

/** 육각형 면에 찍을 값 — 숫자가 안 보이는 꼭짓점은 가운데(어림을 그림으로도 안 보임). */
const drawn = (axis: AxisFill) => Math.max(0.02, axisShown(axis) ? axis.fill : 0);

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
}: {
  ui: UICopy;
  result: FillResult;
  before: FillResult | null;
  onAxis: (axis: Axis) => void;
}) {
  const now = AXES.map((axis, i) => point(i, drawn(result.axes[axis])));
  const then = before ? AXES.map((axis, i) => point(i, drawn(before.axes[axis]))) : null;
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
          return one.converged || !axisShown(one) ? null : <line key={`r-${axis}`} x1={lx} y1={ly} x2={hx} y2={hy} className="stroke-info" strokeWidth="6" strokeLinecap="round" opacity="0.25" />;
        })}
        {AXES.map((axis, i) => {
          const one = result.axes[axis];
          const [x, y] = now[i]!;
          const [tx, ty] = point(i, 1.24);
          const weak = axisWeak(result, axis);
          const shown = axisShown(one);
          const anchor = Math.abs(tx - CX) < 8 ? "middle" : tx > CX ? "start" : "end";
          const delta = axisGain(one, before?.axes[axis]);
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
              <circle data-skill-dot={shown ? "measured" : "none"} cx={x} cy={y} r={weak ? 7 : 5.5} className={weak ? "fill-warn" : shown ? LOG.fill : `fill-none ${LOG.stroke}`} strokeWidth={shown ? undefined : 1.5} />
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
      </svg>
    </figure>
  );
}

/** 세부 칸 이름(통화 첫 마디 "부족한 칸")에 쓰는 표. */
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
