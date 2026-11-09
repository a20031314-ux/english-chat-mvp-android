import { type Axis, type FillCell } from "./fill.ts";

export const COMPARE_MS = 14 * 86_400_000;
export type GainRow = { axis: Axis; before: number; now: number };
export type LackRow = { cell: FillCell; expected: number; actual: number };
export type DirectionView = { gains: GainRow[]; lacks: LackRow[] };
export type StudyMix = { missed: number; total: number };
