/**
 * 틀린 곳 고르기 고정 데이터(`spot-errors/<언어>.json`, 퀴즈 다시 짜기 2단계 — 쓰는 에이전트 → 판정 에이전트) 읽기.
 * 사다리 3칸(ladder.ts)이 그 문법 칸(errors[].g)의 한 문장 문항(shape s·l)을 꺼내 쓴다. 문단(story-errors)은 5단계 화면에서.
 */
import type { SpotItem } from "./spotErrors.ts";

const FILES: Record<string, () => Promise<{ default: SpotItem[] }>> = {
  ar: () => import("./spot-errors/ar.json") as Promise<{ default: SpotItem[] }>,
  en: () => import("./spot-errors/en.json") as Promise<{ default: SpotItem[] }>,
  es: () => import("./spot-errors/es.json") as Promise<{ default: SpotItem[] }>,
  fr: () => import("./spot-errors/fr.json") as Promise<{ default: SpotItem[] }>,
  hi: () => import("./spot-errors/hi.json") as Promise<{ default: SpotItem[] }>,
  id: () => import("./spot-errors/id.json") as Promise<{ default: SpotItem[] }>,
  it: () => import("./spot-errors/it.json") as Promise<{ default: SpotItem[] }>,
  ja: () => import("./spot-errors/ja.json") as Promise<{ default: SpotItem[] }>,
  ko: () => import("./spot-errors/ko.json") as Promise<{ default: SpotItem[] }>,
  pt: () => import("./spot-errors/pt.json") as Promise<{ default: SpotItem[] }>,
  ru: () => import("./spot-errors/ru.json") as Promise<{ default: SpotItem[] }>,
  th: () => import("./spot-errors/th.json") as Promise<{ default: SpotItem[] }>,
  vi: () => import("./spot-errors/vi.json") as Promise<{ default: SpotItem[] }>,
  zh: () => import("./spot-errors/zh.json") as Promise<{ default: SpotItem[] }>,
};

const PARAS: Record<string, () => Promise<{ default: SpotItem[] }>> = Object.fromEntries(
  ["ar", "en", "es", "fr", "hi", "id", "it", "ja", "ko", "pt", "ru", "th", "vi", "zh"].map((lang) => [lang, () => import(`./story-errors/${lang}.json`) as Promise<{ default: SpotItem[] }>]),
);

const loaded = new Map<string, Map<string, SpotItem[]>>();
const paras = new Map<string, SpotItem[]>();

/** 그 언어의 문단 문항(story-errors, P1~P4) — 한 번 읽으면 기억. */
export async function loadParas(language: string): Promise<SpotItem[]> {
  const have = paras.get(language);
  if (have) return have;
  const list = (await PARAS[language]?.().then((mod) => mod.default).catch(() => [] as SpotItem[])) ?? [];
  paras.set(language, list);
  return list;
}

/** 이미 읽은 문단 중 그 난이도(P1~P4). */
export function parasAt(language: string, level: number): readonly SpotItem[] {
  return (paras.get(language) ?? []).filter((item) => item.shape === `P${level}`);
}

/** 그 언어의 꼴 틀림 한 문장 문항을 문법 칸별로(한 번 읽으면 기억). */
export async function loadSpots(language: string): Promise<Map<string, SpotItem[]>> {
  const have = loaded.get(language);
  if (have) return have;
  const list = (await FILES[language]?.().then((mod) => mod.default).catch(() => [] as SpotItem[])) ?? [];
  const byKey = new Map<string, SpotItem[]>();
  for (const item of list) {
    if (item.shape !== "s" && item.shape !== "l") continue;
    for (const err of item.errors) if (err.type === "form" && err.g) byKey.set(err.g, [...(byKey.get(err.g) ?? []), item]);
  }
  loaded.set(language, byKey);
  return byKey;
}

/** 이미 읽은 것만(없으면 빈 목록) — 묶음을 짜는 쪽은 동기라 미리 loadSpots를 불러 둔다. */
export function spotsFor(language: string, key: string): readonly SpotItem[] {
  return loaded.get(language)?.get(key) ?? [];
}
