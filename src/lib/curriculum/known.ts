/**
 * 이미 아는 것 거르기(2026-10-29 사용자 "단계별 시험에서 사용자가 이미 아는 건 그냥 걸러내고 커리큘럼을 짜주자" →
 * "이미 앎의 기준이 모호하다면 맞힌 문제는 퀴즈나 주별 시험에 몇 번 더 넣어서 확실히 아는지 확인").
 *
 * - 시험·퀴즈에서 맞힌 열쇠, 넘긴 대본의 열쇠 → **익힘**(한 번 맞히면, 2026-11-01): 커리큘럼(오늘 할 것·n일 완성)에서 빠진다.
 * - 익힌 열쇠는 잊을 때가 되면(맞힌 날 다음 1·3·7일, CHECK_DAYS) 계속 공부·이번 주 확인에 한 번씩 다시 나온다.
 * - 시험·퀴즈에서 틀리면 지운다 → 커리큘럼으로 돌아온다(다시 볼 것은 따로 서버 review).
 * 열쇠만(문장 없음), 서버 `stageScripts:v1` known. 순수 모듈.
 */
import { DAY_MS, reviewKeysOf } from "./dailyPlan.ts";
import { allFramesFor } from "./frames.ts";
import { allScriptsFor } from "./stageScripts.ts";

/** 열쇠 → 맞힌 날(UTC 날 번호, 겹침 없음, 오래된 것부터)·마지막 때. */
export type KnownMap = Record<string, { days: number[]; at: number }>;
/** "checking"은 예전(다른 날 세 번) 상태 — 지금은 안 나온다. */
export type KnownState = "checking" | "known";

/**
 * 한 번 맞히면 익힘(2026-11-01 사용자 "익힘을 기준으로, 한 번 맞히면 익힘 · 주기별로 잊었을 확률이 있을 때만 다시").
 * 예전엔 다른 날 세 번 맞혀야 이미 앎이었다. 지금은 맞힌 날 다음 1·3·7일 뒤에 한 번씩 다시 묻고(CHECK_DAYS), 틀리면 지운다.
 */
export const KNOWN_DAYS = 1;
/** 맞힌 날 수 → 다음 확인까지 날. 다 지나면 더 묻지 않는다(퀴즈에서 다시 나오면 nextStudy REST_DAYS). */
export const CHECK_DAYS = [1, 3, 7] as const;
const KEEP_DAYS = CHECK_DAYS.length + 1;
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
  const days = before ? (before.days.includes(day) ? before.days : [...before.days, day].slice(-KEEP_DAYS)) : [day];
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

/** 다음 확인 날(UTC 날 번호) — 확인을 다 했으면 null. */
export function checkDay(entry: { days: number[] }): number | null {
  const gap = CHECK_DAYS[entry.days.length - 1];
  const last = entry.days[entry.days.length - 1];
  return gap === undefined || last === undefined ? null : last + gap;
}

/** 오늘 다시 물어볼 익힌 열쇠 — 잊을 때가 된 것만(CHECK_DAYS), 가장 오래 지난 것부터. */
export function confirmDue(map: KnownMap | null | undefined, now = Date.now()): string[] {
  if (!map) return [];
  const today = dayOf(now);
  return Object.entries(map)
    // 꺼내 쓰기 열쇠(r|, curriculum/recall.ts)는 꺼내 쓰기 묶음이 다시 묻는다 — 퀴즈 확인에는 안 넣음.
    .filter(([key, entry]) => {
      if (key.startsWith("r|")) return false;
      const due = checkDay(entry);
      return due !== null && due <= today;
    })
    .sort((a, b) => (checkDay(a[1]) ?? 0) - (checkDay(b[1]) ?? 0) || a[1].at - b[1].at)
    .map(([key]) => key);
}

/** 받은 known을 고른다(열쇠 모양·날 숫자). */
export function cleanKnown(raw: unknown): KnownMap {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const out: KnownMap = {};
  for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
    if (!/^[efguwr]\|/.test(key) || key.length > 80 || !value || typeof value !== "object") continue;
    const entry = value as { days?: unknown; at?: unknown };
    const days = Array.isArray(entry.days) ? [...new Set(entry.days.filter((d): d is number => Number.isInteger(d)))].slice(-KEEP_DAYS) : [];
    if (!days.length) continue;
    out[key] = { days, at: typeof entry.at === "number" ? entry.at : 0 };
  }
  return out;
}
