import { apiUrl } from "@/lib/apiBase";
import { entitlementHeaders } from "@/lib/billing/billingService";
import type { StudyMap, TopicStatus } from "@/lib/curriculum/map";

/** What the curriculum routes answer with: the map and how far through it. */
export type MapRecord = {
  map: StudyMap | null;
  status: Record<string, TopicStatus>;
  hasPrevious?: boolean;
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
  level: StudyMap["level"];
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
        level: input.level,
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
