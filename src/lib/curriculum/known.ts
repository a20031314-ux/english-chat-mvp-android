/**
 * 이미 아는 것 거르기(2026-10-29 사용자 "단계별 시험에서 사용자가 이미 아는 건 그냥 걸러내고 커리큘럼을 짜주자" →
 * "이미 앎의 기준이 모호하다면 맞힌 문제는 퀴즈나 주별 시험에 몇 번 더 넣어서 확실히 아는지 확인").
 *
 * - 시험(처음 시험·단계 미리 확인·단계 시험)에서 맞힌 열쇠 → **확인 중**: 커리큘럼(오늘 할 것·n일 완성)에서 빠진다.
 * - 확인 중 열쇠는 계속 공부·이번 주 확인에 다시 나온다. **다른 날** 맞힌 날이 KNOWN_DAYS일이 되면(시험 날 포함) **이미 앎**.
 * - 시험·퀴즈에서 한 번이라도 틀리면 지운다 → 커리큘럼으로 돌아온다(다시 볼 것은 따로 서버 review).
 * - 처음 생기는 것은 시험뿐 — 퀴즈 정답은 이미 있는 열쇠만 늘린다(대본으로 배운 것은 대본 통과가 따로 센다).
 * 열쇠만(문장 없음), 서버 `stageScripts:v1` known. 순수 모듈.
 */
import { DAY_MS, reviewKeysOf } from "./dailyPlan.ts";
import { allFramesFor } from "./frames.ts";
import { allScriptsFor } from "./stageScripts.ts";

/** 열쇠 → 맞힌 날(UTC 날 번호, 겹침 없음, 오래된 것부터)·마지막 때. */
export type KnownMap = Record<string, { days: number[]; at: number }>;
export type KnownState = "checking" | "known";

/** 이만큼 서로 다른 날 맞히면 이미 앎(시험 날 + 두 번 더). */
export const KNOWN_DAYS = 3;
export const KNOWN_MAX = 600;

const dayOf = (now: number) => Math.floor(now / DAY_MS);

export function knownState(map: KnownMap | null | undefined, key: string): KnownState | null {
  const entry = map?.[key];
  if (!entry) return null;
  return entry.days.length >= KNOWN_DAYS ? "known" : "checking";
}

/** 답 하나를 반영. create = 시험에서 온 답(없던 열쇠도 만듦), 아니면 있는 열쇠만. */
export function applyKnown(map: KnownMap, key: string, right: boolean, now = Date.now(), create = false): KnownMap {
  const before = map[key];
  if (!right) {
    if (!before) return map;
    const next = { ...map };
    delete next[key];
    return next;
  }
  if (!before && !create) return map;
  const day = dayOf(now);
  const days = before ? (before.days.includes(day) ? before.days : [...before.days, day].slice(-KNOWN_DAYS)) : [day];
  return { ...map, [key]: { days, at: now } };
}

/** 오래된 것부터 버려 KNOWN_MAX개까지. */
export function trimKnown(map: KnownMap): KnownMap {
  const entries = Object.entries(map);
  if (entries.length <= KNOWN_MAX) return map;
  return Object.fromEntries(entries.sort((a, b) => b[1].at - a[1].at).slice(0, KNOWN_MAX));
}

/** 커리큘럼에서 건너뛸 대본·틀 id: 그 대본의 열쇠가 모두 확인 중이거나 이미 앎. */
export function skippedIds(language: string, map: KnownMap | null | undefined): Set<string> {
  const out = new Set<string>();
  if (!map || !Object.keys(map).length) return out;
  const ids = [...allScriptsFor(language).map((script) => script.id), ...allFramesFor(language).map((frame) => frame.id)];
  for (const id of ids) {
    const keys = reviewKeysOf(language, id);
    if (keys.length && keys.every((key) => map[key])) out.add(id);
  }
  return out;
}

/** 오늘 다시 물어볼 확인 중 열쇠(오늘 이미 맞힌 것은 빼고, 오래된 것부터). */
export function confirmDue(map: KnownMap | null | undefined, now = Date.now()): string[] {
  if (!map) return [];
  const today = dayOf(now);
  return Object.entries(map)
    // 꺼내 쓰기 열쇠(r|, curriculum/recall.ts)는 꺼내 쓰기 묶음이 다시 묻는다 — 퀴즈 확인 중에는 안 넣음.
    .filter(([key, entry]) => !key.startsWith("r|") && entry.days.length < KNOWN_DAYS && entry.days[entry.days.length - 1] !== today)
    .sort((a, b) => a[1].at - b[1].at)
    .map(([key]) => key);
}

/** 받은 known을 고른다(열쇠 모양·날 숫자). */
export function cleanKnown(raw: unknown): KnownMap {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const out: KnownMap = {};
  for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
    if (!/^[efguwr]\|/.test(key) || key.length > 80 || !value || typeof value !== "object") continue;
    const entry = value as { days?: unknown; at?: unknown };
    const days = Array.isArray(entry.days) ? [...new Set(entry.days.filter((d): d is number => Number.isInteger(d)))].slice(-KNOWN_DAYS) : [];
    if (!days.length) continue;
    out[key] = { days, at: typeof entry.at === "number" ? entry.at : 0 };
  }
  return out;
}
