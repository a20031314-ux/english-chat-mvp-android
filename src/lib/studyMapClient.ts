import { apiUrl } from "@/lib/apiBase";
import { entitlementHeaders } from "@/lib/billing/billingService";
import type { StudyMap, TopicStatus } from "@/lib/curriculum/map";
import type { TopicCounts } from "@/lib/curriculum/missions";

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

/** 나눠 그리기 진행(서버 stream): 뼈대 짜는 중 → 뼈대 도착(주제 목록) → 연습 채우는 중 n/m. */
export type DrawProgress = {
  step: "plan" | "fill";
  /** 뼈대가 오면 주제·순서(연습은 아직 비어 있음). */
  skeleton?: StudyMap;
  done?: number;
  total?: number;
};

export async function drawStudyMap(
  input: {
    goal: string;
    /** What they ticked about themselves (learner/selfCheck.ts); the server pitches the map from it. */
    selfCheck?: { gaps: string[]; focus: string[]; use?: string };
    targetLanguage: string;
    interfaceLanguage: string;
    isPremium: boolean;
  },
  onProgress?: (progress: DrawProgress) => void,
): Promise<{ ok: true; record: MapRecord } | { ok: false; error: MapError; limit?: number }> {
  try {
    const response = await fetch(apiUrl("/api/curriculum/generate"), {
      method: "POST",
      headers: { "Content-Type": "application/json", ...entitlementHeaders(input.isPremium) },
      body: JSON.stringify({
        goal: input.goal,
        ...(input.selfCheck ? { selfCheck: input.selfCheck } : {}),
        targetLanguage: input.targetLanguage,
        interfaceLanguage: input.interfaceLanguage,
        // 서버가 나눠 그리기를 켰으면 진행을 줄 단위로 흘려 보낸다(2026-10-23). 꺼져 있으면 예전처럼 끝에 한 번.
        stream: true,
      }),
      signal: AbortSignal.timeout(110000),
    });
    const isStream = (response.headers.get("content-type") ?? "").includes("ndjson") && response.body;
    if (!isStream) {
      const data = await readJson(response);
      if (!response.ok) {
        return {
          ok: false,
          error: errorOf(response),
          ...(typeof data.limit === "number" ? { limit: data.limit } : {}),
        };
      }
      return { ok: true, record: { ...asRecord(data), hasPrevious: true } };
    }
    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let progress: DrawProgress = { step: "plan" };
    for (;;) {
      const { value, done } = await reader.read();
      if (value) buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = done ? "" : (lines.pop() ?? "");
      for (const raw of lines) {
        if (!raw.trim()) continue;
        let line: Record<string, unknown>;
        try {
          line = JSON.parse(raw) as Record<string, unknown>;
        } catch {
          continue;
        }
        if (line.type === "done" && line.record && typeof line.record === "object") {
          return { ok: true, record: { ...asRecord(line.record as Record<string, unknown>), hasPrevious: true } };
        }
        if (line.type === "error") {
          const status = typeof line.status === "number" ? line.status : 502;
          return {
            ok: false,
            error: status === 401 ? "identity" : status === 429 ? "limit" : "failed",
            ...(typeof line.limit === "number" ? { limit: line.limit } : {}),
          };
        }
        if (line.type === "plan" && line.map) {
          const fill = (line.fill ?? {}) as { done?: number; total?: number };
          progress = { step: "fill", skeleton: line.map as StudyMap, done: fill.done ?? 0, total: fill.total ?? 0 };
          onProgress?.(progress);
        } else if (line.type === "step" && line.step === "fill") {
          progress = { ...progress, step: "fill", done: Number(line.done) || 0, total: Number(line.total) || progress.total };
          onProgress?.(progress);
        } else if (line.type === "step" && line.step === "plan") {
          onProgress?.(progress);
        }
      }
      if (done) break;
    }
    return { ok: false, error: "failed" };
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
type PendingDraw = {
  form: DrawForm;
  promise: Promise<DrawResult>;
  result?: DrawResult;
  /** 언제 눌렀는지(지난 초 표시)와 마지막 진행. 화면을 떠났다 와도 이어서 보인다. */
  startedAt: number;
  progress: DrawProgress;
  listeners: Set<() => void>;
};
const pendingDraws = new Map<string, PendingDraw>();

export function startStudyMapDraw(input: Parameters<typeof drawStudyMap>[0], typed = ""): PendingDraw {
  const existing = pendingDraws.get(input.targetLanguage);
  if (existing && !existing.result) return existing;
  const entry: PendingDraw = {
    form: { typed, ...(input.selfCheck ? { selfCheck: input.selfCheck } : {}) },
    promise: Promise.resolve(null as unknown as DrawResult),
    startedAt: Date.now(),
    progress: { step: "plan" },
    listeners: new Set(),
  };
  entry.promise = drawStudyMap(input, (progress) => {
    entry.progress = progress;
    for (const listener of entry.listeners) listener();
  }).then((result) => {
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

/** 진행이 바뀔 때 다시 그리기(useSyncExternalStore용). */
export function subscribeStudyMapDraw(targetLanguage: string, listener: () => void): () => void {
  const entry = pendingDraws.get(targetLanguage);
  if (!entry) return () => undefined;
  entry.listeners.add(listener);
  return () => entry.listeners.delete(listener);
}

/** 결과를 화면에 넣었으면 지운다(같은 요청일 때만 — 그사이 새로 시작한 것은 남긴다). */
export function finishStudyMapDraw(targetLanguage: string, entry: PendingDraw): void {
  if (pendingDraws.get(targetLanguage) === entry) pendingDraws.delete(targetLanguage);
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
