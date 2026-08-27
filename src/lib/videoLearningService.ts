import { Capacitor } from "@capacitor/core";
import { PREMIUM_CLIENT_HEADER } from "@/lib/billing/config";
import { apiUrl } from "@/lib/apiBase";
import {
  ClientAudioError,
  transcribeYouTubeAudioOnDevice,
} from "@/lib/videoSubtitle/clientVideoAudio";
import type { VideoSubtitle, VideoSubtitleAnalysis } from "@/lib/videoLearning";
import { MOCK_VIDEO_ANALYSES } from "@/lib/videoLearningMock";
import { getSceneContextAtTime } from "@/lib/videoSubtitle/getSceneContextAtTime";
import { groupMeaningUnits } from "@/lib/videoSubtitle/groupMeaningUnits";
import { distinctSpokenLine } from "@/lib/videoSubtitle/subtitleDraft";
import type {
  NormalizedSegment,
  SttSegment,
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
    ...(segment.segmentIds?.length ? { segmentIds: segment.segmentIds } : {}),
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
    ...(segment.analysisTranslation
      ? { analysisTranslation: segment.analysisTranslation }
      : {}),
    ...(segment.debug ? { debug: segment.debug } : {}),
  };
}

/** English study cues follow the word-sliced sentence bounds from prepare. */
export function englishCuesFromSegments(
  segments: NormalizedSegment[],
): VideoSubtitle[] {
  return segments.map((segment) => ({
    id: `mu-${segment.id}`,
    startTime: segment.startTime,
    endTime: Math.max(segment.startTime + 0.3, segment.endTime),
    original: segment.normalizedText || segment.rawText,
    translation: "",
    rawOriginal: segment.rawText || segment.normalizedText,
    meaning: segment.normalizedText || segment.rawText,
    literalMeaning: segment.normalizedText || segment.rawText,
    confidence: segment.confidence,
    translationStatus: "english" as const,
  }));
}

function normalizeGloss(text: string): string {
  return text
    .replace(/\s+/g, "")
    .replace(/[.,!?…~"'“”‘’]/g, "")
    .toLowerCase();
}

function hangulLen(text: string): number {
  return [...text].filter((ch) => /[가-힣]/.test(ch)).length;
}

function englishWordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function mergeCuePair(left: VideoSubtitle, right: VideoSubtitle): VideoSubtitle {
  const leftKo = hangulLen(left.translation);
  const rightKo = hangulLen(right.translation);
  const pickRight = rightKo > leftKo;
  const translation =
    pickRight ? right.translation : left.translation || right.translation;
  const analysisTranslation = pickRight
    ? right.analysisTranslation || left.analysisTranslation
    : left.analysisTranslation || right.analysisTranslation;
  const original = dedupeCueOriginal(left.original, right.original);
  return {
    ...left,
    original,
    rawOriginal: original,
    endTime: Math.max(left.endTime, right.endTime),
    translation,
    ...(analysisTranslation ? { analysisTranslation } : {}),
    meaning: translation || left.meaning,
    literalMeaning: translation || left.literalMeaning,
    translationStatus: translation.trim()
      ? ("final" as const)
      : left.translationStatus,
  };
}

function dedupeCueOriginal(previous: string, next: string): string {
  const prevWords = previous.split(/\s+/).filter(Boolean);
  const nextWords = next.split(/\s+/).filter(Boolean);
  const max = Math.min(6, prevWords.length, nextWords.length);
  let rest = nextWords;
  for (let count = max; count >= 1; count -= 1) {
    const left = prevWords.slice(-count).join(" ").toLowerCase();
    const right = nextWords.slice(0, count).join(" ").toLowerCase();
    if (left && left === right) {
      rest = nextWords.slice(count);
      break;
    }
  }
  return [...prevWords, ...rest].join(" ").replace(/\s+/g, " ").trim();
}

function mergeCuesWithSameGloss(cues: VideoSubtitle[]): VideoSubtitle[] {
  if (cues.length <= 1) return cues;
  const out: VideoSubtitle[] = [];
  for (const cue of cues) {
    const prev = out[out.length - 1];
    if (prev && shouldJoinStudyCues(prev, cue)) {
      out[out.length - 1] = mergeCuePair(prev, cue);
      continue;
    }
    out.push({ ...cue });
  }
  return out;
}

function shouldJoinStudyCues(left: VideoSubtitle, right: VideoSubtitle): boolean {
  // Lines split back out of one meaning unit share its reading on purpose.
  // Joining them again on that shared text would undo the split.
  const unit = left.segmentIds ?? [];
  if (unit.length > 1 && unit.join("|") === (right.segmentIds ?? []).join("|")) {
    return false;
  }
  const gap = right.startTime - left.endTime;
  if (gap > 1.5) return false;
  const leftEn = englishWordCount(left.original);
  const rightEn = englishWordCount(right.original);
  const leftKo = hangulLen(left.translation);
  const rightKo = hangulLen(right.translation);
  const a = normalizeGloss(left.translation);
  const b = normalizeGloss(right.translation);
  if (
    a.length >= 8 &&
    b.length >= 8 &&
    (a === b || a.includes(b) || b.includes(a))
  ) {
    return true;
  }
  const reaction =
    /^(yeah|yes|yep|ok|okay|right|sure|no|nope|wow|oh|hey|hi|hello)[.!?…]*$/i;
  if (reaction.test(left.original.trim()) || reaction.test(right.original.trim())) {
    return false;
  }
  const leftOpen =
    /(?:to|of|for|with|and|or|the|a|an|my|your|our)$/i.test(
      left.original.trim().replace(/[.!?…]+$/g, ""),
    ) ||
    (leftEn <= 5 && !/[.!?…]"?$/.test(left.original.trim()));
  if (leftOpen && rightEn <= 12) return true;
  if (leftEn >= 8 && leftKo <= Math.max(3, leftEn * 0.45) && rightEn <= 7 && rightKo >= 10) {
    return true;
  }
  if (rightEn >= 8 && rightKo <= Math.max(3, rightEn * 0.45) && leftEn <= 7 && leftKo >= 10) {
    return true;
  }
  return false;
}

function overlapSeconds(
  a: { startTime: number; endTime: number },
  b: { startTime: number; endTime: number },
): number {
  return Math.min(a.endTime, b.endTime) - Math.max(a.startTime, b.startTime);
}

/**
 * Learning-language sentence units + official UI translations by time overlap.
 * Each caption line maps to at most one study cue so the same Korean is not
 * copied onto two English fragments.
 */
export function officialUiCuesFromPrepared(
  prepared: PreparedTranscript,
): VideoSubtitle[] {
  const official =
    prepared.officialUiSegments ||
    prepared.speechSegments ||
    [];
  const base = englishCuesFromSegments(prepared.segments);
  if (official.length === 0) return base;

  const merged = [...base];
  for (const caption of official) {
    const hits: number[] = [];
    for (let i = 0; i < merged.length; i += 1) {
      const cue = merged[i]!;
      const overlap = overlapSeconds(cue, caption);
      if (overlap > 0.08) hits.push(i);
    }
    if (hits.length < 2) continue;
    const consecutive = hits.every((index, offset) =>
      offset === 0 ? true : index === hits[offset - 1]! + 1,
    );
    if (!consecutive) continue;
    const first = hits[0]!;
    const last = hits[hits.length - 1]!;
    const members = merged.slice(first, last + 1);
    merged.splice(first, members.length, {
      ...members[0]!,
      original: members
        .map((row) => row.original)
        .join(" ")
        .replace(/\s+/g, " ")
        .trim(),
      rawOriginal: members[0]!.rawOriginal,
      startTime: members[0]!.startTime,
      endTime: members[members.length - 1]!.endTime,
    });
  }

  const used = new Set<number>();
  const assigned = new Array<string>(merged.length).fill("");
  for (const caption of [...official].sort((a, b) => a.startTime - b.startTime)) {
    let best = -1;
    let bestScore = 0;
    for (let i = 0; i < merged.length; i += 1) {
      if (used.has(i)) continue;
      const cue = merged[i]!;
      const overlap = overlapSeconds(cue, caption);
      if (overlap <= 0.05) continue;
      const capSpan = Math.max(0.2, caption.endTime - caption.startTime);
      const score = overlap / capSpan;
      if (score > bestScore) {
        bestScore = score;
        best = i;
      }
    }
    if (best >= 0 && bestScore >= 0.15) {
      assigned[best] = caption.normalizedText;
      used.add(best);
    }
  }

  return mergeCuesWithSameGloss(
    merged.map((cue, index) => {
      const translation = assigned[index] ?? "";
      if (!translation) return cue;
      return {
        ...cue,
        translation,
        meaning: translation,
        literalMeaning: translation,
        translationStatus: "final" as const,
      };
    }),
  );
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
  const regrouped = units.map((unit) => {
    const memberIndexes = unit.segmentIds
      .map((id) => Number(String(id).replace(/^cue-/, "")))
      .filter((index) => Number.isFinite(index) && index >= 0 && index < byIndex.length);
    const members = memberIndexes.map((index) => byIndex[index]!);
    const translations = members
      .map((row) => row.translation.trim())
      .filter(Boolean);
    const sameGloss =
      translations.length > 1 &&
      translations.every(
        (text) => normalizeGloss(text) === normalizeGloss(translations[0]!),
      );
    const translation =
      translations.length <= 1 || sameGloss ? translations[0] ?? "" : "";
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
  return mergeCuesWithSameGloss(regrouped);
}

/**
 * The device's own caption lines, kept as the display spine. The server groups
 * them into sentence units for translation — good for the reading, far too
 * coarse to follow, since one unit can span ten seconds of speech.
 */
function segmentsFromDeviceStt(segments: SttSegment[]): NormalizedSegment[] {
  return segments.map((segment) => ({
    id: segment.id,
    startTime: segment.startTime,
    endTime: segment.endTime,
    rawText: segment.text,
    normalizedText: segment.text,
    confidence: segment.confidence,
    uncertain: segment.uncertain,
  }));
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

function indexGlossItems(
  items?: Array<{
    id?: string;
    interpretation?: string;
    analysisTranslation?: string;
  }>,
): {
  interpretation: Map<string, string>;
  analysis: Map<string, string>;
} {
  const interpretation = new Map<string, string>();
  const analysis = new Map<string, string>();
  const remember = (map: Map<string, string>, id: string, value: string) => {
    map.set(id, value);
    if (id.startsWith("mu-") && id.length > 3) map.set(id.slice(3), value);
  };
  for (const item of items ?? []) {
    const id = typeof item.id === "string" ? item.id.trim() : "";
    const gloss =
      typeof item.interpretation === "string" ? item.interpretation.trim() : "";
    const analysisLine =
      typeof item.analysisTranslation === "string"
        ? item.analysisTranslation.trim()
        : "";
    if (!id || !gloss) continue;
    remember(interpretation, id, gloss);
    if (analysisLine) remember(analysis, id, analysisLine);
  }
  return { interpretation, analysis };
}

function applyGlossToCue(
  cue: VideoSubtitle,
  maps: ReturnType<typeof indexGlossItems>,
): VideoSubtitle {
  const translation = interpretationForId(maps.interpretation, cue.id);
  if (!translation) return cue;
  const analysisTranslation = distinctSpokenLine(
    translation,
    interpretationForId(maps.analysis, cue.id),
  );
  return {
    ...cue,
    translation,
    meaning: translation,
    literalMeaning: translation,
    translationStatus: "final" as const,
    ...(analysisTranslation
      ? { analysisTranslation }
      : { analysisTranslation: undefined }),
  };
}

function overlapsWindow(cue: VideoSubtitle, window: TimeWindow): boolean {
  return cue.startTime < window.end && cue.endTime > window.start;
}

/**
 * The English lines are the spine: one line per source segment, each with its
 * own timing. A window cue can cover several of them, because the pipeline
 * groups short fragments into one meaning unit, so the reading is given back to
 * every line it came from. Keying by cue id alone left the absorbed lines
 * untranslated and stretched one caption over several utterances.
 */
function applyWindowCues(
  lines: VideoSubtitle[],
  incoming: VideoSubtitle[],
): VideoSubtitle[] {
  const bySegmentId = new Map<string, VideoSubtitle>();
  for (const cue of incoming) {
    for (const segmentId of cue.segmentIds ?? []) {
      bySegmentId.set(`mu-${segmentId}`, cue);
    }
    bySegmentId.set(cue.id, cue);
  }

  // A unit's segment ids can reach past its own time range, so the clock wins:
  // taking the id match first handed a line the reading of speech that had
  // already gone by, and the captions ran ahead of the audio.
  const covering = (line: VideoSubtitle) => {
    const middle = (line.startTime + line.endTime) / 2;
    return incoming.find(
      (cue) => cue.startTime <= middle && middle < cue.endTime,
    );
  };

  return lines.map((line) => {
    const cue = covering(line) ?? bySegmentId.get(line.id);
    if (!cue) return line;
    return {
      ...cue,
      id: line.id,
      segmentIds: cue.segmentIds,
      startTime: line.startTime,
      endTime: line.endTime,
      original: line.original,
      rawOriginal: line.rawOriginal ?? line.original,
    };
  });
}

function replaceWindowCues(
  current: VideoSubtitle[],
  window: TimeWindow,
  incoming: VideoSubtitle[],
): VideoSubtitle[] {
  const kept = current.filter((cue) => !overlapsWindow(cue, window));
  const inWindow = current.filter((cue) => overlapsWindow(cue, window));
  const translated = applyWindowCues(inWindow, incoming);
  return [...kept, ...translated].sort((a, b) => a.startTime - b.startTime);
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
function jsonHeaders(isPremium?: boolean) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (isPremium) headers[PREMIUM_CLIENT_HEADER] = "1";
  return headers;
}

export async function prepareEnglishWatch(
  videoUrl: string,
  options?: {
    locale?: string;
    interfaceLanguage?: string;
    targetLanguage?: string;
    onStatus?: (step: SubtitleStatusStep) => void;
    onProgress?: (progress: SubtitleProgress) => void;
    signal?: AbortSignal;
    isPremium?: boolean;
  },
): Promise<{ prepared: PreparedTranscript; englishCues: VideoSubtitle[] }> {
  const locale = options?.interfaceLanguage ?? options?.locale ?? "ko";
  const targetLanguage = options?.targetLanguage ?? "en";
  const skipServerAudio = Capacitor.isNativePlatform();
  options?.onStatus?.("speech");
  options?.onProgress?.({ percent: 10, step: "speech" });

  const prepareResponse = await fetch(apiUrl("/api/video-subtitles/prepare"), {
    method: "POST",
    headers: jsonHeaders(options?.isPremium),
    body: JSON.stringify({
      videoUrl,
      locale,
      interfaceLanguage: locale,
      targetLanguage,
      skipServerAudio,
    }),
    signal: options?.signal,
  });
  let prepared: PreparedTranscript;
  let deviceSegments: SttSegment[] | null = null;
  const preparePayload = (await prepareResponse.json().catch(() => ({}))) as {
    error?: string;
    segments?: PreparedTranscript["segments"];
  } & Partial<PreparedTranscript>;
  const prepareError =
    typeof preparePayload.error === "string" && preparePayload.error
      ? preparePayload.error
      : prepareResponse.ok
        ? ""
        : prepareResponse.status === 503
          ? "MISSING_OPENAI_KEY"
          : "STT_FAILED";
  const needsClientAudio =
    skipServerAudio &&
    (!prepareResponse.ok || !preparePayload.segments?.length) &&
    (prepareResponse.status === 409 ||
      prepareError === "CLIENT_AUDIO_REQUIRED" ||
      prepareError === "NO_SPEECH" ||
      prepareError === "NO_AUDIO" ||
      prepareError === "STT_FAILED");

  if (prepareResponse.ok && (preparePayload.segments?.length ?? 0) > 0) {
    prepared = preparePayload as PreparedTranscript;
  } else if (needsClientAudio) {
    options?.onProgress?.({ percent: 16, step: "speech" });
    try {
      const device = await transcribeYouTubeAudioOnDevice(videoUrl, {
        targetLanguage,
        signal: options?.signal,
        onProgress: (percent) =>
          options?.onProgress?.({ percent, step: "speech" }),
      });
      const fromStt = await fetch(apiUrl("/api/video-subtitles/prepare-from-stt"), {
        method: "POST",
        headers: jsonHeaders(options?.isPremium),
        body: JSON.stringify({
          videoUrl,
          locale,
          interfaceLanguage: locale,
          targetLanguage,
          segments: device.segments,
          sttSource: device.source,
        }),
        signal: options?.signal,
      });
      if (!fromStt.ok) {
        throw new VideoSubtitleClientError(await readError(fromStt));
      }
      prepared = (await fromStt.json()) as PreparedTranscript;
      deviceSegments = device.displayLines;
    } catch (error) {
      if (error instanceof VideoSubtitleClientError) throw error;
      if (error instanceof ClientAudioError) {
        throw new VideoSubtitleClientError(error.code);
      }
      console.error("[video-client-audio] prepare fallback", error);
      throw new VideoSubtitleClientError("NO_SPEECH");
    }
  } else if (!prepareResponse.ok) {
    throw new VideoSubtitleClientError(prepareError);
  } else {
    prepared = preparePayload as PreparedTranscript;
  }
  options?.onStatus?.("cleanup");
  options?.onProgress?.({ percent: 100, step: "cleanup" });

  const spine =
    deviceSegments && deviceSegments.length > prepared.segments.length
      ? segmentsFromDeviceStt(deviceSegments)
      : prepared.segments;
  const englishCues =
    prepared.captionMode === "official-ui"
      ? officialUiCuesFromPrepared(prepared)
      : englishCuesFromSegments(spine);
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
  const merged = mergeCuesWithSameGloss(cues);
  options?.onPartial?.(merged, true);
  return merged;
}

/**
 * Line-tied learner gloss for study list. Keeps English originals/timing;
 * only fills `translation` by matching cue id. Opening lines are glossed first
 * so playback does not start on English-only captions.
 */
export async function generateLineInterpretations(
  prepared: PreparedTranscript,
  options?: {
    locale?: string;
    interfaceLanguage?: string;
    targetLanguage?: string;
    cues?: VideoSubtitle[];
    onProgress?: (progress: SubtitleProgress) => void;
    onPartial?: (cues: VideoSubtitle[], done: boolean) => void;
    signal?: AbortSignal;
  },
): Promise<VideoSubtitle[]> {
  const locale = options?.interfaceLanguage ?? options?.locale ?? "ko";
  const targetLanguage = options?.targetLanguage ?? "en";
  let cues = (options?.cues?.length
    ? options.cues
    : prepared.captionMode === "official-ui"
      ? officialUiCuesFromPrepared(prepared)
      : englishCuesFromSegments(prepared.segments)
  ).map((cue) => ({ ...cue }));
  const missing = cues.filter(
    (cue) => cue.original.trim() && !cue.translation.trim(),
  );
  if (missing.length === 0) {
    options?.onProgress?.({ percent: 100, step: "cleanup" });
    options?.onPartial?.(cues, true);
    return cues;
  }

  const firstChunk = Math.min(8, missing.length);
  const slices: NormalizedSegment[][] = [
    cuesAsGlossSegments(missing.slice(0, firstChunk)),
  ];
  for (let i = firstChunk; i < missing.length; i += 24) {
    slices.push(cuesAsGlossSegments(missing.slice(i, i + 24)));
  }
  const total = Math.max(1, slices.length);
  let completed = 0;

  for (const slice of slices) {
    if (options?.signal?.aborted) {
      throw new VideoSubtitleClientError("TIMEOUT");
    }
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
        items?: Array<{
          id?: string;
          interpretation?: string;
          analysisTranslation?: string;
        }>;
      };
      const maps = indexGlossItems(payload.items);
      if (maps.interpretation.size > 0) {
        cues = cues.map((cue) => applyGlossToCue(cue, maps));
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
    items?: Array<{
      id?: string;
      interpretation?: string;
      analysisTranslation?: string;
    }>;
  };
  const maps = indexGlossItems(payload.items);
  if (maps.interpretation.size === 0) {
    console.error("[video-edit-gloss] empty items", {
      ids: targets.map((cue) => cue.id),
    });
    return cues;
  }

  return cues.map((cue) => applyGlossToCue(cue, maps));
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
      analysisTranslation: cue.analysisTranslation,
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
