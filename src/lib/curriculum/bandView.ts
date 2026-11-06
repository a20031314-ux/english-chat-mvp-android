/**
 * Logbank 띠 1단계(2026-11-06 사용자 "육각형 내부 데이터를 띠로" → "2.80에 넣고"): 육각형과 같은 computeFill 값을
 * 꼭짓점마다 한 줄, 단계마다 한 칸으로 펼친다. 새 계산은 없다 — 그리는 규칙만 여기(순수, 화면은 studyMap/SkillBands).
 *
 * - 칸 길이 = 그 단계 채운 몫(stages[i]).
 * - 그 단계에서 잰 것이 없으면(stageN 0) 칠하지 않는다 — 육각형이 지금 단계 아래를 미리 칠하던 것(priorFill)이 띠에는 없다.
 * - 잰 것이 WEAK_MIN_N(8) 미만이면 옅게(thin).
 * - 줄 끝 %: 답(차례)이 8 미만이면 숫자 대신 null(화면은 ─). 어림 폭이 아직 넓으면 "~"(육각형과 같음).
 * - 고른 기간이 시작할 때보다 오른 만큼(▲n, 1%p 이상만).
 * 설계 hub/drafts/logbank-2026-11-06.md 4절 ②.
 */
import { AXES, STAGES, WEAK_MIN_N, type Axis, type AxisFill, type FillResult } from "./fill.ts";

export type BandCellState = "none" | "thin" | "measured";
export type BandCell = { stage: number; value: number; state: BandCellState };
export type BandRow = { axis: Axis; cells: BandCell[]; pct: string | null; gain: number; weak: boolean };

/** 묶음: 낱말(이해·활용) · 문장(이해·활용) · 듣기 · 실전 대화 — 묶음 사이에 틈을 둔다. */
export const BAND_GROUPS: readonly (readonly Axis[])[] = [["vocabRead", "vocabUse"], ["sentRead", "sentUse"], ["listen"], ["talk"]];

export function bandCells(axis: AxisFill): BandCell[] {
  return Array.from({ length: STAGES }, (_, i) => {
    const n = axis.stageN?.[i] ?? 0;
    const value = Math.min(1, Math.max(0, axis.stages[i] ?? 0));
    const state: BandCellState = n <= 0 ? "none" : n < WEAK_MIN_N ? "thin" : "measured";
    return { stage: i + 1, value: state === "none" ? 0 : value, state };
  });
}

export function bandPct(axis: AxisFill): string | null {
  if (axis.n < WEAK_MIN_N) return null;
  return `${axis.converged ? "" : "~"}${Math.round(axis.fill * 100)}%`;
}

/** 육각형의 주황 점과 같은 기준: 수렴한 꼭짓점이 여섯 평균보다 15%p 넘게 낮음. */
function weakAxis(result: FillResult, axis: Axis): boolean {
  const one = result.axes[axis];
  const mean = AXES.reduce((sum, a) => sum + result.axes[a].fill, 0) / AXES.length;
  return one.converged && one.fill < mean - 0.15;
}

export function bandRows(result: FillResult, before: FillResult | null = null): BandRow[] {
  return AXES.map((axis) => {
    const one = result.axes[axis];
    const gain = before && one.n >= WEAK_MIN_N ? Math.round((one.fill - before.axes[axis].fill) * 100) : 0;
    return { axis, cells: bandCells(one), pct: bandPct(one), gain: gain > 0 ? gain : 0, weak: weakAxis(result, axis) };
  });
}
