import { apiUrl } from "@/lib/apiBase";
import { entitlementHeaders } from "@/lib/billing/billingService";
import type { StudyMap, TopicStatus } from "@/lib/curriculum/map";
import type {
  Mission,
  MissionCheck,
  MissionResult,
  TopicCounts,
  TopicMissions,
} from "@/lib/curriculum/missions";

/** What the curriculum routes answer with: the map and how far through it. */
export type MapRecord = {
  map: StudyMap | null;
  status: Record<string, TopicStatus>;
  hasPrevious?: boolean;
  /** Where each practised topic's phrases stand: mastered, learned, to learn. */
  missions?: Record<string, TopicCounts>;
};

export type MapError = "identity" | "limit" | "failed";

export type SceneHit = { start: number; end: number; text: string; matched: string };

export type SceneMatch = {
  videoId: string;
  title?: string;
  durationSeconds: number;
  found: Array<{ expression: string; count: number; hits: SceneHit[] }>;
  hitCount: number;
};

async function readJson(response: Response): Promise<Record<string, unknown>> {
  return (await response.json().catch(() => ({}))) as Record<string, unknown>;
}

function asRecord(data: Record<string, unknown>): MapRecord {
  return {
    map: (data.map as StudyMap | null) ?? null,
    status: (data.status as Record<string, TopicStatus>) ?? {},
    ...(typeof data.hasPrevious === "boolean" ? { hasPrevious: data.hasPrevious } : {}),
    ...(data.missions && typeof data.missions === "object"
      ? { missions: data.missions as MapRecord["missions"] }
      : {}),
  };
}

function errorOf(response: Response): MapError {
  if (response.status === 401) return "identity";
  if (response.status === 429) return "limit";
  return "failed";
}

export async function fetchStudyMap(
  language: string,
  isPremium: boolean,
): Promise<{ ok: true; record: MapRecord } | { ok: false; error: MapError }> {
  try {
    const response = await fetch(apiUrl(`/api/curriculum?lang=${encodeURIComponent(language)}`), {
      headers: entitlementHeaders(isPremium),
    });
    if (!response.ok) return { ok: false, error: errorOf(response) };
    return { ok: true, record: asRecord(await readJson(response)) };
  } catch {
    return { ok: false, error: "failed" };
  }
}

export async function drawStudyMap(input: {
  goal: string;
  /** What they ticked about themselves (learner/selfCheck.ts); the server pitches the map from it. */
  selfCheck?: { gaps: string[]; focus: string[]; use?: string };
  targetLanguage: string;
  interfaceLanguage: string;
  isPremium: boolean;
}): Promise<{ ok: true; record: MapRecord } | { ok: false; error: MapError; limit?: number }> {
  try {
    const response = await fetch(apiUrl("/api/curriculum/generate"), {
      method: "POST",
      headers: { "Content-Type": "application/json", ...entitlementHeaders(input.isPremium) },
      body: JSON.stringify({
        goal: input.goal,
        ...(input.selfCheck ? { selfCheck: input.selfCheck } : {}),
        targetLanguage: input.targetLanguage,
        interfaceLanguage: input.interfaceLanguage,
      }),
      signal: AbortSignal.timeout(90000),
    });
    const data = await readJson(response);
    if (!response.ok) {
      return {
        ok: false,
        error: errorOf(response),
        ...(typeof data.limit === "number" ? { limit: data.limit } : {}),
      };
    }
    return { ok: true, record: { ...asRecord(data), hasPrevious: true } };
  } catch {
    return { ok: false, error: "failed" };
  }
}

export type DrawResult = Awaited<ReturnType<typeof drawStudyMap>>;

/**
 * 그리는 중인 요청을 화면 밖(모듈)에 둔다 — My 탭은 보일 때만 그려져서(AppHome), 그리는 동안 다른 탭에 갔다 오면
 * 화면 상태(그리는 중·쓴 목표)가 사라지고 빈 체크 화면이 다시 떴다(사용자 2026-10-23).
 * 요청은 그대로 돌고, 돌아오면 같은 요청을 다시 기다리거나 이미 끝난 결과를 받는다. 학습 언어마다 하나.
 */
/** 화면에 다시 보여 줄 입력: 직접 쓴 목표(체크만 했으면 빈 칸)와 고른 체크. */
type DrawForm = { typed: string; selfCheck?: { gaps: string[]; focus: string[]; use?: string; stage?: string } };
type PendingDraw = { form: DrawForm; promise: Promise<DrawResult>; result?: DrawResult };
const pendingDraws = new Map<string, PendingDraw>();

export function startStudyMapDraw(input: Parameters<typeof drawStudyMap>[0], typed = ""): PendingDraw {
  const existing = pendingDraws.get(input.targetLanguage);
  if (existing && !existing.result) return existing;
  const entry: PendingDraw = {
    form: { typed, ...(input.selfCheck ? { selfCheck: input.selfCheck } : {}) },
    promise: Promise.resolve(null as unknown as DrawResult),
  };
  entry.promise = drawStudyMap(input).then((result) => {
    entry.result = result;
    return result;
  });
  pendingDraws.set(input.targetLanguage, entry);
  return entry;
}

/** 이 학습 언어로 그리는 중이거나, 화면이 없는 동안 끝나 아직 받지 않은 요청. */
export function pendingStudyMapDraw(targetLanguage: string): PendingDraw | null {
  return pendingDraws.get(targetLanguage) ?? null;
}

/** 결과를 화면에 넣었으면 지운다(같은 요청일 때만 — 그사이 새로 시작한 것은 남긴다). */
export function finishStudyMapDraw(targetLanguage: string, entry: PendingDraw): void {
  if (pendingDraws.get(targetLanguage) === entry) pendingDraws.delete(targetLanguage);
}

export async function saveTopicStatus(input: {
  language: string;
  mapId: string;
  topicId: string;
  status: TopicStatus;
  isPremium: boolean;
}): Promise<MapRecord | null> {
  try {
    const response = await fetch(apiUrl("/api/curriculum/progress"), {
      method: "POST",
      headers: { "Content-Type": "application/json", ...entitlementHeaders(input.isPremium) },
      body: JSON.stringify({
        language: input.language,
        mapId: input.mapId,
        topicId: input.topicId,
        status: input.status,
      }),
    });
    if (!response.ok) return null;
    return asRecord(await readJson(response));
  } catch {
    return null;
  }
}

export async function restorePreviousStudyMap(
  language: string,
  isPremium: boolean,
): Promise<MapRecord | null> {
  try {
    const response = await fetch(apiUrl("/api/curriculum/restore"), {
      method: "POST",
      headers: { "Content-Type": "application/json", ...entitlementHeaders(isPremium) },
      body: JSON.stringify({ language }),
    });
    if (!response.ok) return null;
    return asRecord(await readJson(response));
  } catch {
    return null;
  }
}

/** Kept videos where these expressions are said, best first (api/video-index/find). */
export async function findScenes(
  language: string,
  expressions: string[],
): Promise<SceneMatch[] | null> {
  if (expressions.length === 0) return [];
  const params = new URLSearchParams({ language, limit: "8" });
  for (const expression of expressions) params.append("q", expression);
  try {
    const response = await fetch(apiUrl(`/api/video-index/find?${params.toString()}`));
    if (!response.ok) return null;
    const data = await readJson(response);
    return Array.isArray(data.matches) ? (data.matches as SceneMatch[]) : [];
  } catch {
    return null;
  }
}

export type MissionError = "identity" | "limit" | "changed" | "failed";

function missionErrorOf(response: Response): MissionError {
  if (response.status === 401) return "identity";
  if (response.status === 403 || response.status === 429) return "limit";
  if (response.status === 409) return "changed";
  return "failed";
}

/** A topic's missions, written on the first visit (api/curriculum/missions). */
export async function fetchMissions(input: {
  language: string;
  mapId: string;
  topicId: string;
  isPremium: boolean;
}): Promise<{ ok: true; topic: TopicMissions } | { ok: false; error: MissionError }> {
  try {
    const response = await fetch(apiUrl("/api/curriculum/missions"), {
      method: "POST",
      headers: { "Content-Type": "application/json", ...entitlementHeaders(input.isPremium) },
      body: JSON.stringify({ language: input.language, mapId: input.mapId, topicId: input.topicId }),
      signal: AbortSignal.timeout(60000),
    });
    if (!response.ok) return { ok: false, error: missionErrorOf(response) };
    const data = await readJson(response);
    if (!Array.isArray(data.missions)) return { ok: false, error: "failed" };
    return {
      ok: true,
      topic: {
        missions: data.missions as TopicMissions["missions"],
        results: (data.results as TopicMissions["results"]) ?? {},
        ...(data.seen && typeof data.seen === "object" ? { seen: data.seen as TopicMissions["seen"] } : {}),
      },
    };
  } catch {
    return { ok: false, error: "failed" };
  }
}

/** Check one answer. A try counts as a sent chat. */
export async function checkMission(input: {
  language: string;
  mapId: string;
  topicId: string;
  missionId: string;
  answer: string;
  hints: number;
  tries: number;
  isPremium: boolean;
  /** A review asks a learned item again; producing it then masters it. */
  mode?: "mission" | "review";
}): Promise<
  | {
      ok: true;
      check: MissionCheck;
      results?: Record<string, MissionResult>;
      status?: TopicStatus;
    }
  | { ok: false; error: MissionError }
> {
  try {
    const { isPremium, ...body } = input;
    const response = await fetch(apiUrl("/api/curriculum/mission-check"), {
      method: "POST",
      headers: { "Content-Type": "application/json", ...entitlementHeaders(isPremium) },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(45000),
    });
    if (!response.ok) return { ok: false, error: missionErrorOf(response) };
    const data = await readJson(response);
    if (!data.check || typeof data.check !== "object") return { ok: false, error: "failed" };
    return {
      ok: true,
      check: data.check as MissionCheck,
      ...(data.results ? { results: data.results as Record<string, MissionResult> } : {}),
      ...(typeof data.status === "string" ? { status: data.status as TopicStatus } : {}),
    };
  } catch {
    return { ok: false, error: "failed" };
  }
}

export type DueItem = { topicId: string; topicTitle: string; mission: Mission };

/** Learned phrases ready to be produced from memory (api/curriculum/review). */
export async function fetchDueItems(
  language: string,
  isPremium: boolean,
): Promise<{ mapId: string | null; items: DueItem[] } | null> {
  try {
    const response = await fetch(apiUrl(`/api/curriculum/review?lang=${encodeURIComponent(language)}`), {
      headers: entitlementHeaders(isPremium),
    });
    if (!response.ok) return null;
    const data = await readJson(response);
    return {
      mapId: typeof data.mapId === "string" ? data.mapId : null,
      items: Array.isArray(data.items) ? (data.items as DueItem[]) : [],
    };
  } catch {
    return null;
  }
}

/** The example answer was opened: a mark beside the item, not progress. */
export function markMissionSeen(input: {
  language: string;
  mapId: string;
  topicId: string;
  missionId: string;
  isPremium: boolean;
}): void {
  const { isPremium, ...body } = input;
  void fetch(apiUrl("/api/curriculum/mission-seen"), {
    method: "POST",
    headers: { "Content-Type": "application/json", ...entitlementHeaders(isPremium) },
    body: JSON.stringify(body),
  }).catch(() => undefined);
}
