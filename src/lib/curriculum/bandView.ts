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
 *
 * 숫자 하나의 규칙(2026-11-07 점검 "띠는 ─인데 육각형은 5%", 사용자 "띠, 육각형의 수치부터 맞춰줘"):
 * 띠·육각형·꼭짓점 세부·2주 비교가 모두 여기 axisShown·bandPct·axisWeak·axisGain만 쓴다.
 * 답 8개 미만인 꼭짓점은 어림(priorFill)만 있는 것이라 숫자·▲·약함 점·나아진 점 어디에도 안 올린다.
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

/** 그 꼭짓점을 숫자로 보여 줄 만큼 답했나. */
export function axisShown(axis: AxisFill): boolean {
  return axis.n >= WEAK_MIN_N;
}

export function bandPct(axis: AxisFill): string | null {
  if (!axisShown(axis)) return null;
  return `${axis.converged ? "" : "~"}${Math.round(axis.fill * 100)}%`;
}

/**
 * 약한 꼭짓점(띠의 주황 점 = 육각형의 주황 점): 숫자가 보이는 꼭짓점 중, 부족한 세부 칸이 있거나
 * 수렴한 채 숫자가 보이는 다른 꼭짓점 평균보다 15%p 넘게 낮음.
 */
export function axisWeak(result: FillResult, axis: Axis): boolean {
  const one = result.axes[axis];
  if (!axisShown(one)) return false;
  if (one.cells.some((cell) => cell.state === "weak")) return true;
  const others = AXES.filter((other) => other !== axis && axisShown(result.axes[other])).map((other) => result.axes[other].fill);
  if (!others.length) return false;
  const mean = others.reduce((a, b) => a + b, 0) / others.length;
  return one.converged && one.fill < mean - 0.15;
}

/** 기간 처음보다 오른 %p — 두 때 모두 숫자가 보일 때만(어림 6% → 잰 17% 같은 가짜 오름 없음). */
export function axisGain(now: AxisFill, before: AxisFill | null | undefined): number {
  if (!before || !axisShown(now) || !axisShown(before)) return 0;
  const gain = Math.round((now.fill - before.fill) * 100);
  return gain > 0 ? gain : 0;
}

export function bandRows(result: FillResult, before: FillResult | null = null): BandRow[] {
  return AXES.map((axis) => {
    const one = result.axes[axis];
    return { axis, cells: bandCells(one), pct: bandPct(one), gain: axisGain(one, before?.axes[axis]), weak: axisWeak(result, axis) };
  });
}
