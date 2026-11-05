/**
 * Logbank가 화면에 올리는 비교(2026-11-04). 목록은 없고, 지난 2주보다 오른 눈금과
 * 예상보다 아래인 칸만. 설명과 다음 하나는 이 둘로 만든다. 문장·초·틀린 낱말은 없다.
 */
import { AXES, BANK_AXES, keysInCell, type Axis, type BankAxis, type FillCatalog, type FillCell, type FillEvent, type FillResult } from "./fill.ts";

export const COMPARE_MS = 14 * 86_400_000;
/** 이보다 작은 오름은 눈금 흔들림이라 화면에 안 올린다. */
export const GAIN_MIN = 0.03;
const SHOW = 2;
/** 예상과 실제가 없는 셈 칸(틀린 꼴·막힌 까닭)은 비교에 넣지 않는다. */
const NOT_COMPARED = new Set(["miss", "why", "lead", "part"]);

export type GainRow = { axis: Axis; before: number; now: number };
export type LackRow = { cell: FillCell; expected: number; actual: number };
export type DirectionView = { gains: GainRow[]; lacks: LackRow[] };

function kindOf(id: string): string {
  const cut = id.indexOf(":");
  return cut < 0 ? id : id.slice(0, cut);
}

export type StudyMix = { missed: number; total: number };

/**
 * 그 칸이 최근 틀림에서 차지하는 몫. 같은 눈금(어휘 활용이면 활용만)에서
 * 마지막이 틀린 열쇠 중 이 칸에 드는 개수. 듣기·실전 대화처럼 열쇠가 없는 칸은 null.
 */
export function studyMix(events: readonly FillEvent[], catalog: FillCatalog, cell: FillCell, since: number): StudyMix | null {
  if (!(BANK_AXES as readonly string[]).includes(cell.axis)) return null;
  const axis = cell.axis as BankAxis;
  const use = axis.endsWith("Use");
  const items = axis.startsWith("vocab") ? catalog.vocab : catalog.sent;
  const inCell = new Set(keysInCell(catalog, axis, cell.id));
  const latest = new Map<string, boolean>();
  for (const one of [...events].sort((a, b) => a.at - b.at)) {
    if (one.at < since || one.use !== use || !items.has(one.key)) continue;
    latest.set(one.key, one.correct);
  }
  let missed = 0;
  let total = 0;
  for (const [key, correct] of latest) {
    if (correct) continue;
    total += 1;
    if (inCell.has(key)) missed += 1;
  }
  return { missed, total };
}

export function directionView(now: FillResult, earlier: FillResult): DirectionView {
  const gains = AXES.map((axis) => ({ axis, before: earlier.axes[axis].fill, now: now.axes[axis].fill }))
    .filter((row) => row.now - row.before >= GAIN_MIN)
    .sort((a, b) => b.now - b.before - (a.now - a.before))
    .slice(0, SHOW);
  const lacks = now.weak
    .filter((cell) => cell.gap > 0 && !NOT_COMPARED.has(kindOf(cell.id)))
    .slice(0, SHOW)
    .map((cell) => ({ cell, actual: cell.value, expected: Math.min(1, cell.value + cell.gap) }));
  return { gains, lacks };
}
