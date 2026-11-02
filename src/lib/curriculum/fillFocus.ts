/**
 * 학습 방향(2026-11-02, hub/drafts/fill-gauge-2026-11-02.md 5·10절): Logbank 육각형의 부족한 세부 칸 → 이번 주 약점 열쇠,
 * 아직 모름 칸 → 재 볼 열쇠. Logbank가 계산할 때 이 폰에 남기고, 오늘 할 것("내 기록에 맞춰")이 약점을 다시 볼 것 다음에,
 * 채우기 다섯에 하나를 재 볼 열쇠로 섞는다(계속 재기). 열쇠만, 언어마다.
 */
import { BANK_AXES, keysInCell, unmeasuredCells, type BankAxis, type FillCatalog, type FillEvent, type FillResult } from "./fill.ts";

const KEY = "fillFocus.v1";
export const WEAK_CELLS = 3;
export const WEAK_KEYS = 6;
export const PROBE_KEYS = 5;
/** 채우기 몇 개마다 재 볼 열쇠 하나(다섯에 하나). */
export const PROBE_EVERY = 5;

export type FillFocus = { weak: string[]; probe: string[]; at: number };

/** 부족한 칸(앞 셋)에서 마지막이 틀린 열쇠 → 맞힌 적 없는 열쇠 순, 아직 모름 칸마다 은행 앞쪽 열쇠 하나. */
/** stage = 지금 My 단계 — 그 위 단계 소재는 고르지 않는다(배운 적 없는 틀·낱말로 재지 않게, 2026-11-02 변경 감시). */
export function fillDirection(result: FillResult, catalog: FillCatalog, events: readonly FillEvent[], stage = 5, at = Date.now()): FillFocus {
  const latest = new Map<string, boolean>();
  for (const one of [...events].sort((a, b) => a.at - b.at)) latest.set(`${one.use ? "u" : "r"}|${one.key}`, one.correct);
  const weak: string[] = [];
  const bankCells = result.weak.filter((cell) => (BANK_AXES as readonly string[]).includes(cell.axis) && !cell.id.startsWith("miss:")).slice(0, WEAK_CELLS);
  for (const cell of bankCells) {
    const axis = cell.axis as BankAxis;
    const tag = axis.endsWith("Use") ? "u" : "r";
    const items = axis.startsWith("vocab") ? catalog.vocab : catalog.sent;
    const keys = keysInCell(catalog, axis, cell.id).filter((key) => (items.get(key)?.stage ?? 1) <= Math.max(1, stage));
    const ordered = [...keys.filter((key) => latest.get(`${tag}|${key}`) === false), ...keys.filter((key) => !latest.has(`${tag}|${key}`)).sort((a, b) => (items.get(a)?.d ?? 1) - (items.get(b)?.d ?? 1))];
    for (const key of ordered.slice(0, 2)) if (!weak.includes(key)) weak.push(key);
  }
  const probe: string[] = [];
  for (const cell of unmeasuredCells(result)) {
    if (probe.length >= PROBE_KEYS) break;
    const axis = cell.axis as BankAxis;
    const items = axis.startsWith("vocab") ? catalog.vocab : catalog.sent;
    const first = keysInCell(catalog, axis, cell.id).filter((key) => (items.get(key)?.stage ?? 1) <= Math.max(1, stage)).sort((a, b) => (items.get(a)?.d ?? 1) - (items.get(b)?.d ?? 1)).find((key) => !probe.includes(key) && !weak.includes(key));
    if (first) probe.push(first);
  }
  return { weak: weak.slice(0, WEAK_KEYS), probe, at };
}

/** 채우기 열쇠 사이에 재 볼 열쇠를 다섯에 하나 꼴로 끼운다(순수). */
export function mixProbes(fill: readonly string[], probe: readonly string[]): string[] {
  const out: string[] = [];
  let p = 0;
  for (const key of fill) {
    out.push(key);
    if (out.length % PROBE_EVERY === PROBE_EVERY - 1 && p < probe.length) out.push(probe[p++]!);
  }
  return out;
}

export function readFillFocus(language: string): FillFocus | null {
  try {
    const raw = JSON.parse(globalThis.localStorage?.getItem(`${KEY}.${language}`) ?? "null") as FillFocus | null;
    return raw && Array.isArray(raw.weak) && Array.isArray(raw.probe) ? raw : null;
  } catch {
    return null;
  }
}

export function saveFillFocus(language: string, focus: FillFocus): void {
  try {
    const before = readFillFocus(language);
    if (before && before.weak.join() === focus.weak.join() && before.probe.join() === focus.probe.join()) return;
    globalThis.localStorage?.setItem(`${KEY}.${language}`, JSON.stringify(focus));
  } catch {
    // 이번에만.
  }
}
