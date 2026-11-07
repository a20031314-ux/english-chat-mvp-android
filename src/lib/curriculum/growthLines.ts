/**
 * 대화에서 내가 한 문장(고쳐진 줄·고쳐지지 않은 줄)을 열쇠와 함께 이 폰에 — "틀린 문장 → 나중에 맞게 쓴 문장" 짝(growthView.ts growthPairs)의 재료
 * (2026-11-07 사용자 "구체적인 화면으로 틀렸던 문장 > 이후 배워서 활용한 문장"). 학습 언어마다 `growthLines.v1.<언어>`, 서버로 안 보냄.
 * 열쇠가 없는 줄은 안 남긴다. 고친 줄·쓴 줄 각각 최근 LINES_MAX개.
 */
import type { MissLine, TalkSource, UsedLine } from "./growthView.ts";

const KEY = "growthLines.v1";
export const LINES_MAX = 300;
export const GROWTH_LINES_EVENT = "growth-lines";

type Store = { getItem(key: string): string | null; setItem(key: string, value: string): void };
type Saved = { v: 1; miss: MissLine[]; used: UsedLine[] };

function browserStore(): Store | null {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

const SOURCES: readonly TalkSource[] = ["call", "chat", "people"];
const keysOk = (k: unknown) => Array.isArray(k) && k.length > 0 && k.every((one) => typeof one === "string");
const isMiss = (one: unknown): one is MissLine => {
  const m = one as MissLine;
  return typeof one === "object" && one !== null && keysOk(m.k) && typeof m.w === "string" && typeof m.r === "string" && typeof m.t === "number" && SOURCES.includes(m.s);
};
const isUsed = (one: unknown): one is UsedLine => {
  const u = one as UsedLine;
  return typeof one === "object" && one !== null && keysOk(u.k) && typeof u.x === "string" && typeof u.t === "number" && SOURCES.includes(u.s);
};

export function readGrowthLines(language: string, store: Store | null = browserStore()): { miss: MissLine[]; used: UsedLine[] } {
  if (!store) return { miss: [], used: [] };
  try {
    const parsed = JSON.parse(store.getItem(`${KEY}.${language}`) ?? "null") as Partial<Saved> | null;
    return { miss: Array.isArray(parsed?.miss) ? parsed.miss.filter(isMiss) : [], used: Array.isArray(parsed?.used) ? parsed.used.filter(isUsed) : [] };
  } catch {
    return { miss: [], used: [] };
  }
}

/** 줄을 더한다(같은 시각·같은 문장은 한 번). t는 초. */
export function noteGrowthLines(language: string, add: { miss?: readonly MissLine[]; used?: readonly UsedLine[] }, store: Store | null = browserStore()): void {
  if (!store) return;
  const now = readGrowthLines(language, store);
  const sig = (one: { t: number; w?: string; x?: string }) => `${one.t}|${one.w ?? one.x}`;
  const merge = <T extends { t: number }>(old: T[], extra: readonly T[]) => {
    const seen = new Set(old.map((one) => sig(one as never)));
    const out = [...old];
    for (const one of extra) {
      if (seen.has(sig(one as never))) continue;
      seen.add(sig(one as never));
      out.push(one);
    }
    return out.sort((a, b) => a.t - b.t).slice(-LINES_MAX);
  };
  const next: Saved = { v: 1, miss: merge(now.miss, (add.miss ?? []).filter((one) => one.k.length)), used: merge(now.used, (add.used ?? []).filter((one) => one.k.length)) };
  try {
    store.setItem(`${KEY}.${language}`, JSON.stringify(next));
  } catch {
    // 가득 차면 이번만 못 남김.
  }
  try {
    globalThis.dispatchEvent?.(new Event(GROWTH_LINES_EVENT));
  } catch {
    // 창 없음.
  }
}

/** Logbank "그날 지우기": 그날(dayOf — 그 폰 날짜) 남긴 줄을 지운다. */
export function forgetGrowthDay(language: string, day: string, dayOf: (t: number) => string, store: Store | null = browserStore()): void {
  if (!store) return;
  const now = readGrowthLines(language, store);
  const next: Saved = { v: 1, miss: now.miss.filter((one) => dayOf(one.t) !== day), used: now.used.filter((one) => dayOf(one.t) !== day) };
  try {
    store.setItem(`${KEY}.${language}`, JSON.stringify(next));
    globalThis.dispatchEvent?.(new Event(GROWTH_LINES_EVENT));
  } catch {
    // 이번만.
  }
}
