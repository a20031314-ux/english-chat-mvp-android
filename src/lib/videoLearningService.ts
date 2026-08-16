import { apiUrl } from "@/lib/apiBase";
import type { VideoSubtitle, VideoSubtitleAnalysis } from "@/lib/videoLearning";
import { MOCK_VIDEO_ANALYSES } from "@/lib/videoLearningMock";
import { getSceneContextAtTime } from "@/lib/videoSubtitle/getSceneContextAtTime";
import { groupMeaningUnits } from "@/lib/videoSubtitle/groupMeaningUnits";
import type {
  NormalizedSegment,
  PreparedTranscript,
  SubtitleSegment,
} from "@/lib/videoSubtitle/types";
import {
  neighborsAround,
  processingWindows,
  segmentsInWindow,
  type TimeWindow,
} from "@/lib/videoSubtitle/windows";

export class VideoSubtitleClientError extends Error {
  constructor(public code: string) {
    super(code);
    this.name = "VideoSubtitleClientError";
  }
}

function isAbortError(error: unknown, signal?: AbortSignal): boolean {
  if (signal?.aborted) return true;
  if (!error || typeof error !== "object") return false;
  const name = "name" in error ? String(error.name) : "";
  return name === "AbortError";
}

async function readError(response: Response): Promise<string> {
  try {
    const data = (await response.json()) as { error?: string };
    if (typeof data.error === "string" && data.error) return data.error;
  } catch {
    // ignore
  }
  return response.status === 503 ? "MISSING_OPENAI_KEY" : "STT_FAILED";
}

function toKoreanCue(segment: SubtitleSegment): VideoSubtitle {
  const translation = segment.translation?.trim() || "";
  const original = segment.original?.trim() || "";
  const hasKorean = /[가-힣]/.test(translation);
  return {
    id: segment.id,
    startTime: segment.startTime,
    endTime: segment.endTime,
    original: segment.original,
    translation,
    rawOriginal: segment.rawOriginal,
    meaning: segment.meaning,
    literalMeaning: segment.literalMeaning ?? segment.meaning,
    tone: segment.tone,
    speakerStyle: segment.speakerStyle,
    interpretationConfidence: segment.interpretationConfidence,
    confidence: segment.confidence,
    translationStatus: hasKorean ? "final" : "draft",
    ...(segment.nativeUnderstanding
      ? { nativeUnderstanding: segment.nativeUnderstanding }
      : {}),
    ...(segment.debug ? { debug: segment.debug } : {}),
  };
}

/** English study cues: merge mid-sentence STT crumbs into readable units. */
export function englishCuesFromSegments(
  segments: NormalizedSegment[],
): VideoSubtitle[] {
  const units = groupMeaningUnits({ currentSegments: segments });
  return units.map((unit) => ({
    id: unit.id,
    startTime: unit.startTime,
    endTime: Math.max(unit.startTime + 0.3, unit.endTime),
    original: unit.original,
    translation: "",
    rawOriginal: unit.original,
    meaning: unit.original,
    literalMeaning: unit.original,
    confidence: unit.confidence,
    translationStatus: "english" as const,
  }));
}

/** Overlapping caption text for a speech time window (prefer contained cues). */
function captionTextForWindow(
  captions: NormalizedSegment[] | undefined,
  startTime: number,
  endTime: number,
): string {
  if (!captions || captions.length === 0) return "";
  const span = Math.max(0.2, endTime - startTime);
  const scored = captions
    .map((segment) => {
      const overlap =
        Math.min(segment.endTime, endTime) - Math.max(segment.startTime, startTime);
      if (overlap <= 0.05) return null;
      const segSpan = Math.max(0.2, segment.endTime - segment.startTime);
      // Prefer captions mostly inside this speech beat (avoids dumping a long
      // neighboring line into a short window).
      const coverage = overlap / segSpan;
      const focus = overlap / span;
      return { segment, score: coverage * 2 + focus + overlap };
    })
    .filter((row): row is { segment: NormalizedSegment; score: number } =>
      Boolean(row),
    )
    .sort(
      (a, b) =>
        a.segment.startTime - b.segment.startTime || b.score - a.score,
    );

  if (scored.length === 0) return "";
  // Keep captions that meaningfully overlap this beat.
  const picked = scored.filter((row) => row.score >= 0.35);
  const use = picked.length > 0 ? picked : scored.slice(0, 1);
  return use
    .map((row) => row.segment.normalizedText)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Learning-language sentence units + official UI translations by time overlap.
 * Keeps playback sync on speech, not on (often shorter) caption cue boxes.
 */
export function officialUiCuesFromPrepared(
  prepared: PreparedTranscript,
): VideoSubtitle[] {
  const official =
    prepared.officialUiSegments ||
    prepared.speechSegments ||
    [];
  const base = englishCuesFromSegments(prepared.segments);
  return base.map((cue) => {
    const translation = captionTextForWindow(
      official,
      cue.startTime,
      cue.endTime,
    );
    if (!translation) return cue;
    return {
      ...cue,
      translation,
      meaning: translation,
      literalMeaning: translation,
      translationStatus: "final" as const,
    };
  });
}

/**
 * Re-apply merge rules to already-built study lines (e.g. older saved sessions
 * that still have "... our." / "schedule ..." splits).
 */
export function regroupStudyCues(cues: VideoSubtitle[]): VideoSubtitle[] {
  if (cues.length <= 1) return cues;
  const segments: NormalizedSegment[] = cues.map((cue, index) => ({
    id: `cue-${index}`,
    startTime: cue.startTime,
    endTime: cue.endTime,
    rawText: cue.original,
    normalizedText: cue.original,
    confidence: cue.confidence,
  }));
  const byIndex = cues;
  const units = groupMeaningUnits({ currentSegments: segments });
  return units.map((unit) => {
    const memberIndexes = unit.segmentIds
      .map((id) => Number(String(id).replace(/^cue-/, "")))
      .filter((index) => Number.isFinite(index) && index >= 0 && index < byIndex.length);
    const members = memberIndexes.map((index) => byIndex[index]!);
    const translation =
      members.length === 1 ? members[0]!.translation.trim() : "";
    return {
      id: unit.id,
      startTime: unit.startTime,
      endTime: Math.max(unit.startTime + 0.3, unit.endTime),
      original: unit.original,
      translation,
      rawOriginal: unit.original,
      meaning: unit.original,
      literalMeaning: unit.original,
      confidence: unit.confidence ?? members[0]?.confidence,
      translationStatus: translation
        ? ("final" as const)
        : ("english" as const),
    };
  });
}

function cuesAsGlossSegments(cues: VideoSubtitle[]): NormalizedSegment[] {
  return cues.map((cue) => ({
    id: cue.id,
    startTime: cue.startTime,
    endTime: cue.endTime,
    rawText: cue.rawOriginal || cue.original,
    normalizedText: cue.original,
    confidence: cue.confidence,
  }));
}

function interpretationForId(
  byId: Map<string, string>,
  id: string,
): string | undefined {
  return (
    byId.get(id) ||
    byId.get(`mu-${id}`) ||
    (id.startsWith("mu-") ? byId.get(id.slice(3)) : undefined)
  );
}

function overlapsWindow(cue: VideoSubtitle, window: TimeWindow): boolean {
  return cue.startTime < window.end && cue.endTime > window.start;
}

function replaceWindowCues(
  current: VideoSubtitle[],
  window: TimeWindow,
  incoming: VideoSubtitle[],
): VideoSubtitle[] {
  const kept = current.filter((cue) => !overlapsWindow(cue, window));
  const map = new Map(kept.map((cue) => [cue.id, cue]));
  for (const cue of incoming) map.set(cue.id, cue);
  return [...map.values()].sort((a, b) => a.startTime - b.startTime);
}

export type SubtitleStatusStep =
  | "speech"
  | "context"
  | "translate"
  | "cleanup";

export type SubtitleProgress = {
  percent: number;
  step: SubtitleStatusStep;
  windowIndex?: number;
  windowTotal?: number;
};

/**
 * Extract speech + light context, then return English captions for first watch.
 * Korean interpretation is deferred until the video ends.
 */
export async function prepareEnglishWatch(
  videoUrl: string,
  options?: {
    locale?: string;
    interfaceLanguage?: string;
    targetLanguage?: string;
    onStatus?: (step: SubtitleStatusStep) => void;
    onProgress?: (progress: SubtitleProgress) => void;
    signal?: AbortSignal;
  },
): Promise<{ prepared: PreparedTranscript; englishCues: VideoSubtitle[] }> {
  const locale = options?.interfaceLanguage ?? options?.locale ?? "ko";
  const targetLanguage = options?.targetLanguage ?? "en";
  options?.onStatus?.("speech");
  options?.onProgress?.({ percent: 10, step: "speech" });

  const prepareResponse = await fetch(apiUrl("/api/video-subtitles/prepare"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      videoUrl,
      locale,
      interfaceLanguage: locale,
      targetLanguage,
    }),
    signal: options?.signal,
  });
  if (!prepareResponse.ok) {
    throw new VideoSubtitleClientError(await readError(prepareResponse));
  }
  const prepared = (await prepareResponse.json()) as PreparedTranscript;
  options?.onStatus?.("cleanup");
  options?.onProgress?.({ percent: 100, step: "cleanup" });

  const englishCues =
    prepared.captionMode === "official-ui"
      ? officialUiCuesFromPrepared(prepared)
      : englishCuesFromSegments(prepared.segments);
  if (englishCues.length === 0) {
    throw new VideoSubtitleClientError("NO_SPEECH");
  }
  return { prepared, englishCues };
}

/**
 * After first watch ends: build Korean meaning captions for study materials.
 */
export async function generateKoreanStudyMaterials(
  prepared: PreparedTranscript,
  options?: {
    locale?: string;
    onProgress?: (progress: SubtitleProgress) => void;
    onPartial?: (cues: VideoSubtitle[], done: boolean) => void;
    signal?: AbortSignal;
  },
): Promise<VideoSubtitle[]> {
  const locale = options?.locale ?? "ko";
  let viewerContext = prepared.viewerContext;
  let cues = englishCuesFromSegments(prepared.segments);

  const windows =
    prepared.processingWindows && prepared.processingWindows.length > 0
      ? prepared.processingWindows
      : processingWindows(
          prepared.segments,
          prepared.durationSeconds || 20,
        );

  const workWindows = windows.filter(
    (window) => segmentsInWindow(prepared.segments, window).length > 0,
  );
  const total = Math.max(1, workWindows.length);
  let completed = 0;

  for (const window of workWindows) {
    if (options?.signal?.aborted) {
      throw new VideoSubtitleClientError("TIMEOUT");
    }
    const currentSegments = segmentsInWindow(prepared.segments, window);
    if (currentSegments.length === 0) continue;

    const startIndex = prepared.segments.findIndex(
      (segment) => segment.id === currentSegments[0]!.id,
    );
    const endIndex = startIndex + currentSegments.length;
    const { previous, next } = neighborsAround(
      prepared.segments,
      Math.max(0, startIndex),
      endIndex,
    );

    let windowResponse: Response | null = null;
    for (let attempt = 0; attempt < 2; attempt += 1) {
      if (options?.signal?.aborted) {
        throw new VideoSubtitleClientError("TIMEOUT");
      }
      try {
        windowResponse = await fetch(apiUrl("/api/video-subtitles/window"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            locale,
            context: prepared.context,
            currentSegments,
            previousSegments: previous,
            nextSegments: next,
            sceneContexts: prepared.sceneContexts,
            viewerContext,
          }),
          signal: options?.signal,
        });
        if (windowResponse.ok) break;
      } catch (error) {
        console.error("[video-korean-window]", { attempt, window, error });
        windowResponse = null;
      }
      if (attempt === 0) {
        await new Promise((resolve) => setTimeout(resolve, 400));
      }
    }

    if (windowResponse?.ok) {
      const payload = (await windowResponse.json()) as {
        cues?: SubtitleSegment[];
        viewerContext?: PreparedTranscript["viewerContext"];
      };
      if (payload.viewerContext) {
        viewerContext = payload.viewerContext;
        prepared.viewerContext = payload.viewerContext;
      }
      const incoming = Array.isArray(payload.cues)
        ? payload.cues.map(toKoreanCue).filter((cue) => cue.translationStatus === "final")
        : [];
      if (incoming.length > 0) {
        cues = replaceWindowCues(cues, window, incoming);
      }
    }

    completed += 1;
    options?.onProgress?.({
      percent: Math.min(99, Math.round((completed / total) * 100)),
      step: "translate",
      windowIndex: completed,
      windowTotal: total,
    });
    options?.onPartial?.(cues, false);
  }

  options?.onProgress?.({ percent: 100, step: "cleanup" });
  // Keep English lines that never got a Korean window so the list stays complete.
  options?.onPartial?.(cues, true);
  return cues;
}

/**
 * Line-tied Korean gloss for study list. Keeps English originals/timing;
 * only fills `translation` by matching cue id.
 */
export async function generateLineInterpretations(
  prepared: PreparedTranscript,
  options?: {
    locale?: string;
    interfaceLanguage?: string;
    targetLanguage?: string;
    onProgress?: (progress: SubtitleProgress) => void;
    onPartial?: (cues: VideoSubtitle[], done: boolean) => void;
    signal?: AbortSignal;
  },
): Promise<VideoSubtitle[]> {
  const locale = options?.interfaceLanguage ?? options?.locale ?? "ko";
  const targetLanguage = options?.targetLanguage ?? "en";
  let cues = englishCuesFromSegments(prepared.segments);
  const glossSegments = cuesAsGlossSegments(cues);
  const chunkSize = 24;
  const total = Math.max(1, Math.ceil(glossSegments.length / chunkSize));
  let completed = 0;

  for (let i = 0; i < glossSegments.length; i += chunkSize) {
    if (options?.signal?.aborted) {
      throw new VideoSubtitleClientError("TIMEOUT");
    }
    const slice = glossSegments.slice(i, i + chunkSize);
    let response: Response | null = null;
    for (let attempt = 0; attempt < 2; attempt += 1) {
      if (options?.signal?.aborted) {
        throw new VideoSubtitleClientError("TIMEOUT");
      }
      try {
        response = await fetch(apiUrl("/api/video-subtitles/gloss"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            locale,
            interfaceLanguage: locale,
            targetLanguage,
            context: prepared.context,
            segments: slice,
          }),
          signal: options?.signal,
        });
        if (response.ok) break;
      } catch (error) {
        if (isAbortError(error, options?.signal)) {
          throw new VideoSubtitleClientError("TIMEOUT");
        }
        response = null;
      }
      if (attempt === 0) {
        await new Promise((resolve) => setTimeout(resolve, 400));
      }
    }

    if (response?.ok) {
      const payload = (await response.json()) as {
        items?: Array<{ id?: string; interpretation?: string }>;
      };
      const byId = new Map<string, string>();
      for (const item of payload.items ?? []) {
        const id = typeof item.id === "string" ? item.id.trim() : "";
        const interpretation =
          typeof item.interpretation === "string"
            ? item.interpretation.trim()
            : "";
        if (id && interpretation) byId.set(id, interpretation);
      }
      if (byId.size > 0) {
        cues = cues.map((cue) => {
          const interpretation = byId.get(cue.id);
          if (!interpretation) return cue;
          return {
            ...cue,
            translation: interpretation,
            translationStatus: "final" as const,
          };
        });
      }
    }

    completed += 1;
    options?.onProgress?.({
      percent: Math.min(99, Math.round((completed / total) * 100)),
      step: "translate",
      windowIndex: completed,
      windowTotal: total,
    });
    options?.onPartial?.(cues, false);
  }

  options?.onProgress?.({ percent: 100, step: "cleanup" });
  options?.onPartial?.(cues, true);
  return cues;
}

/**
 * Gloss only the given cue ids (e.g. after merge/split). Keeps other lines intact.
 */
export async function glossStudyCues(
  cues: VideoSubtitle[],
  ids: string[],
  options?: {
    locale?: string;
    interfaceLanguage?: string;
    targetLanguage?: string;
    context?: PreparedTranscript["context"];
    signal?: AbortSignal;
  },
): Promise<VideoSubtitle[]> {
  const idSet = new Set(ids);
  const targets = cues.filter((cue) => idSet.has(cue.id) && cue.original.trim());
  if (targets.length === 0) return cues;

  const locale = options?.interfaceLanguage ?? options?.locale ?? "ko";
  const targetLanguage = options?.targetLanguage ?? "en";
  const context = options?.context ?? {
    topic: "video",
    domain: "general",
    summary: "",
    speakerStyle: "spoken",
    terminology: [],
  };

  let response: Response | null = null;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    if (options?.signal?.aborted) {
      throw new VideoSubtitleClientError("TIMEOUT");
    }
    try {
      response = await fetch(apiUrl("/api/video-subtitles/gloss"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale,
          interfaceLanguage: locale,
          targetLanguage,
          context,
          segments: cuesAsGlossSegments(targets),
        }),
        signal: options?.signal,
      });
      if (response.ok) break;
    } catch (error) {
      if (isAbortError(error, options?.signal)) {
        throw new VideoSubtitleClientError("TIMEOUT");
      }
      response = null;
    }
    if (attempt === 0) {
      await new Promise((resolve) => setTimeout(resolve, 400));
    }
  }

  if (!response?.ok) {
    console.error("[video-edit-gloss] request failed", response?.status);
    return cues;
  }

  const payload = (await response.json()) as {
    items?: Array<{ id?: string; interpretation?: string }>;
  };
  const byId = new Map<string, string>();
  for (const item of payload.items ?? []) {
    const id = typeof item.id === "string" ? item.id.trim() : "";
    const interpretation =
      typeof item.interpretation === "string" ? item.interpretation.trim() : "";
    if (id && interpretation) {
      byId.set(id, interpretation);
      if (id.startsWith("mu-") && id.length > 3) {
        byId.set(id.slice(3), interpretation);
      }
    }
  }
  if (byId.size === 0) {
    console.error("[video-edit-gloss] empty items", {
      ids: targets.map((cue) => cue.id),
    });
    return cues;
  }

  return cues.map((cue) => {
    const interpretation = interpretationForId(byId, cue.id);
    if (!interpretation) return cue;
    return {
      ...cue,
      translation: interpretation,
      meaning: interpretation,
      literalMeaning: interpretation,
      translationStatus: "final" as const,
    };
  });
}

/** @deprecated Prefer prepareEnglishWatch + generateLineInterpretations */
export async function generateSubtitles(
  videoUrl: string,
  options?: {
    locale?: string;
    onStatus?: (step: SubtitleStatusStep) => void;
    onProgress?: (progress: SubtitleProgress) => void;
    onPrepared?: (prepared: PreparedTranscript) => void;
    onFirstReady?: (cues: VideoSubtitle[]) => void;
    onPartial?: (cues: VideoSubtitle[], done: boolean) => void;
    getPlayheadSeconds?: () => number;
    signal?: AbortSignal;
  },
): Promise<VideoSubtitle[]> {
  const { prepared, englishCues } = await prepareEnglishWatch(videoUrl, options);
  options?.onPrepared?.(prepared);
  options?.onFirstReady?.(englishCues);
  options?.onPartial?.(englishCues, false);
  return generateLineInterpretations(prepared, {
    locale: options?.locale,
    onProgress: options?.onProgress,
    onPartial: options?.onPartial,
    signal: options?.signal,
  });
}

export async function analyzeSubtitle(
  cue: VideoSubtitle,
  options?: {
    locale?: string;
    context?: PreparedTranscript["context"];
    sceneContexts?: PreparedTranscript["sceneContexts"];
    previous?: string[];
    next?: string[];
    signal?: AbortSignal;
  },
): Promise<VideoSubtitleAnalysis | null> {
  const mid = (cue.startTime + cue.endTime) / 2;
  const sceneContext =
    cue.debug?.scene
      ? {
          id: `dbg-${cue.id}`,
          startTime: cue.debug.scene.startTime,
          endTime: cue.debug.scene.endTime,
          setting: cue.debug.scene.setting,
          situation: cue.debug.scene.situation,
          interaction: cue.debug.scene.interaction,
          mood: cue.debug.scene.mood,
          visualCues: cue.debug.scene.visualCues,
          confidence: cue.debug.scene.confidence,
        }
      : getSceneContextAtTime(options?.sceneContexts, mid);

  const response = await fetch(apiUrl("/api/video-subtitles/analyze"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    signal: options?.signal,
    body: JSON.stringify({
      subtitleId: cue.id,
      locale: options?.locale ?? "ko",
      original: cue.original,
      naturalSubtitle: cue.translation,
      meaning: cue.meaning ?? cue.literalMeaning,
      tone: cue.tone,
      speakerStyle: cue.speakerStyle,
      context: options?.context,
      sceneContext,
      previous: options?.previous ?? cue.debug?.previous,
      next: options?.next ?? cue.debug?.next,
      nativeUnderstanding: cue.nativeUnderstanding,
    }),
  });
  if (!response.ok) {
    const fallback = MOCK_VIDEO_ANALYSES[cue.id];
    return fallback ?? null;
  }
  return (await response.json()) as VideoSubtitleAnalysis;
}

export type { NormalizedSegment, PreparedTranscript };
