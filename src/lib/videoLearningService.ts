import { apiUrl } from "@/lib/apiBase";
import type { VideoSubtitle, VideoSubtitleAnalysis } from "@/lib/videoLearning";
import { MOCK_VIDEO_ANALYSES } from "@/lib/videoLearningMock";
import type {
  NormalizedSegment,
  PreparedTranscript,
  SubtitleSegment,
} from "@/lib/videoSubtitle/types";
import {
  neighborsAround,
  segmentsInWindow,
  windowsForDuration,
} from "@/lib/videoSubtitle/windows";

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

export class VideoSubtitleClientError extends Error {
  constructor(public code: string) {
    super(code);
    this.name = "VideoSubtitleClientError";
  }
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

function toCue(segment: SubtitleSegment): VideoSubtitle {
  return {
    id: segment.id,
    startTime: segment.startTime,
    endTime: segment.endTime,
    original: segment.original,
    translation: segment.translation,
    rawOriginal: segment.rawOriginal,
    confidence: segment.confidence,
    translationStatus: segment.translationStatus,
  };
}

function mergeCues(current: VideoSubtitle[], incoming: VideoSubtitle[]): VideoSubtitle[] {
  const map = new Map(current.map((cue) => [cue.id, cue]));
  for (const cue of incoming) map.set(cue.id, cue);
  return [...map.values()].sort((a, b) => a.startTime - b.startTime);
}

export type SubtitleStatusStep =
  | "speech"
  | "context"
  | "translate"
  | "cleanup";

export async function generateSubtitles(
  videoUrl: string,
  options?: {
    locale?: string;
    onStatus?: (step: SubtitleStatusStep) => void;
    onPartial?: (cues: VideoSubtitle[], done: boolean) => void;
    signal?: AbortSignal;
  },
): Promise<VideoSubtitle[]> {
  const locale = options?.locale ?? "ko";
  options?.onStatus?.("speech");

  const prepareResponse = await fetch(apiUrl("/api/video-subtitles/prepare"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ videoUrl }),
    signal: options?.signal,
  });
  if (!prepareResponse.ok) {
    throw new VideoSubtitleClientError(await readError(prepareResponse));
  }
  const prepared = (await prepareResponse.json()) as PreparedTranscript;
  options?.onStatus?.("context");

  const windows = windowsForDuration(prepared.durationSeconds || 60);
  let cues: VideoSubtitle[] = [];

  for (let index = 0; index < windows.length; index += 1) {
    if (options?.signal?.aborted) {
      throw new VideoSubtitleClientError("TIMEOUT");
    }
    const window = windows[index]!;
    const currentSegments = segmentsInWindow(prepared.segments, window);
    if (currentSegments.length === 0) continue;

    const startIndex = prepared.segments.indexOf(currentSegments[0]!);
    const endIndex = startIndex + currentSegments.length;
    const { previous, next } = neighborsAround(
      prepared.segments,
      startIndex,
      endIndex,
    );

    if (index === 0) options?.onStatus?.("translate");

    const windowResponse = await fetch(apiUrl("/api/video-subtitles/window"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        locale,
        context: prepared.context,
        currentSegments,
        previousSegments: previous,
        nextSegments: next,
      }),
      signal: options?.signal,
    });
    if (!windowResponse.ok) {
      if (cues.length > 0) {
        options?.onPartial?.(cues, false);
        continue;
      }
      throw new VideoSubtitleClientError(await readError(windowResponse));
    }
    const payload = (await windowResponse.json()) as { cues?: SubtitleSegment[] };
    const incoming = Array.isArray(payload.cues) ? payload.cues.map(toCue) : [];
    cues = mergeCues(cues, incoming);
    if (index === 0) options?.onStatus?.("cleanup");
    const done = index === windows.length - 1;
    options?.onPartial?.(cues, done);
  }

  if (cues.length === 0) {
    throw new VideoSubtitleClientError("NO_SPEECH");
  }
  options?.onPartial?.(cues, true);
  return cues;
}

export async function analyzeSubtitle(
  subtitleId: string,
): Promise<VideoSubtitleAnalysis | null> {
  await wait(220);
  return MOCK_VIDEO_ANALYSES[subtitleId] ?? null;
}

export type { NormalizedSegment, PreparedTranscript };
