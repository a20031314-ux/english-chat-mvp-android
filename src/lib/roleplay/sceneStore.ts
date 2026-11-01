/**
 * 통화 장면 데이터 읽기 — 서버만(앱 묶음에 넣지 않는다, 설계 6절: 장면 추가·고침이 서버 반영만으로).
 *
 * 언어마다 단계 파일 하나(`scenes/<언어>/s<단계>.json`)를 처음 부를 때 읽어 두고 다시 쓴다.
 * 지금은 1단계만 있다 — 단계를 더하면 LOADERS에 줄을 더한다.
 */
import type { CallScene } from "./callScene.ts";

type Loader = () => Promise<{ default: unknown }>;

const LOADERS: Record<string, Record<number, Loader>> = {
  en: { 1: () => import("./scenes/en/s1.json") },
  es: { 1: () => import("./scenes/es/s1.json") },
  fr: { 1: () => import("./scenes/fr/s1.json") },
  it: { 1: () => import("./scenes/it/s1.json") },
  pt: { 1: () => import("./scenes/pt/s1.json") },
  ru: { 1: () => import("./scenes/ru/s1.json") },
  ar: { 1: () => import("./scenes/ar/s1.json") },
  hi: { 1: () => import("./scenes/hi/s1.json") },
  id: { 1: () => import("./scenes/id/s1.json") },
  vi: { 1: () => import("./scenes/vi/s1.json") },
  th: { 1: () => import("./scenes/th/s1.json") },
  zh: { 1: () => import("./scenes/zh/s1.json") },
  ja: { 1: () => import("./scenes/ja/s1.json") },
  ko: { 1: () => import("./scenes/ko/s1.json") },
};

const cache = new Map<string, CallScene[]>();

/** "es-s1-03" → 언어 es, 단계 1. */
export function parseSceneId(id: string): { language: string; stage: number } | null {
  const match = /^([a-z]{2})-s(\d)-\d{2}$/.exec(id);
  return match ? { language: match[1]!, stage: Number(match[2]) } : null;
}

export async function scenesFor(language: string, stage: number): Promise<CallScene[]> {
  const key = `${language}:${stage}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const load = LOADERS[language]?.[stage];
  if (!load) return [];
  const mod = await load();
  const scenes = (Array.isArray(mod.default) ? mod.default : []) as CallScene[];
  cache.set(key, scenes);
  return scenes;
}

export async function findScene(id: string): Promise<CallScene | null> {
  const parsed = parseSceneId(id);
  if (!parsed) return null;
  return (await scenesFor(parsed.language, parsed.stage)).find((scene) => scene.id === id) ?? null;
}
