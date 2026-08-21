import { buildSceneContextsForWindow } from "@/lib/videoSubtitle/buildSceneContexts";
import { VideoPipelineError } from "@/lib/videoSubtitle/errors";
import { extractAudio } from "@/lib/videoSubtitle/extractAudio";
import { getOpenAIClient } from "@/lib/videoSubtitle/openaiClient";
import { normalizeTranscript } from "@/lib/videoSubtitle/normalizeTranscript";
import { sketchVideoContent } from "@/lib/videoSubtitle/sketchVideoContent";
import { transcribeAudio } from "@/lib/videoSubtitle/transcribeAudio";
import { translateSubtitleWindowPipeline } from "@/lib/videoSubtitle/translateSegments";
import type {
  NormalizedSegment,
  PreparedTranscript,
  SttSegment,
  SubtitleSegment,
  TranslateWindowInput,
} from "@/lib/videoSubtitle/types";
import { parseYouTubeInput } from "@/lib/videoLearning";
import { transcribeYouTubeCaptions } from "@/lib/videoSubtitle/youtubeCaptions";
import { resolveYouTubeSource } from "@/lib/videoSubtitle/youtubePlayer";
import {
  FIRST_WINDOW_SECONDS,
  neighborsAround,
  processingWindows,
  segmentsInWindow,
} from "@/lib/videoSubtitle/windows";
import type { SceneContext } from "@/lib/videoSubtitle/sceneTypes";
import {
  emptyViewerContext,
  type ViewerContext,
} from "@/lib/videoSubtitle/viewerTypes";
import { speechLooksWrongLanguage } from "@/lib/videoSubtitle/languageMatch";
import {
  isLearningLanguageCode,
  type LearningLanguageCode,
} from "@/lib/learningLanguages";
import { isNonSpeechMarker } from "@/lib/videoSubtitle/speechNoise";

const MAX_SEGMENTS = 800;
/** Prefer as much audio as Whisper/download allows for full-video grasp. */
const WHISPER_MAX_SECONDS = 900;

function usableSpeech(segments: SttSegment[]): SttSegment[] {
  return segments
    .map((segment) => ({
      ...segment,
      text: segment.text.replace(/\s+/g, " ").trim(),
    }))
    .filter(
      (segment) =>
        segment.text &&
        !isNonSpeechMarker(segment.text) &&
        // Caption tracks sometimes include [Music] / ♪ lines too.
        !(segment.uncertain && (segment.confidence ?? 1) < 0.3),
    )
    .slice(0, MAX_SEGMENTS);
}

function withoutWords(segments: NormalizedSegment[]): NormalizedSegment[] {
  return segments.map(({ words: _words, ...rest }) => rest);
}

async function buildFirstWindowCues(
  segments: NormalizedSegment[],
  locale: string,
  context: PreparedTranscript["context"],
  sceneContexts?: SceneContext[],
  viewerContext?: ViewerContext,
): Promise<{ cues: SubtitleSegment[]; viewerContext: ViewerContext }> {
  const window = { start: 0, end: FIRST_WINDOW_SECONDS };
  let currentSegments = segmentsInWindow(segments, window);
  if (currentSegments.length === 0) {
    currentSegments = segments.slice(0, 8);
  }
  if (currentSegments.length === 0) {
    return {
      cues: [],
      viewerContext:
        viewerContext ??
        emptyViewerContext({
          topic: context.topic,
          summary: context.summary,
        }),
    };
  }
  const startIndex = segments.indexOf(currentSegments[0]!);
  const endIndex = startIndex + currentSegments.length;
  const { previous, next } = neighborsAround(segments, startIndex, endIndex);
  return translateSubtitleWindow({
    locale,
    context,
    currentSegments,
    previousSegments: previous,
    nextSegments: next,
    sceneContexts,
    viewerContext,
  });
}

function asOfficialSegments(segments: SttSegment[]): NormalizedSegment[] {
  return withoutWords(
    segments.map((segment) => ({
      id: segment.id,
      startTime: segment.startTime,
      endTime: segment.endTime,
      rawText: segment.text,
      normalizedText: segment.text.replace(/\s+/g, " ").trim(),
      words: segment.words,
      confidence: segment.confidence,
      uncertain: segment.uncertain,
    })),
  );
}

/**
 * Prepare full transcript + topic, then adapt the first 20s window so playback
 * can start. Remaining 20s windows are adapted on the client.
 *
 * When an official (non-ASR) caption track matches the UI locale, those cues
 * become learning captions and playback units — AI gloss is skipped client-side.
 */
export async function prepareVideoTranscript(
  videoUrl: string,
  locale = "ko",
  targetLanguage = "en",
): Promise<PreparedTranscript> {
  if (!getOpenAIClient()) {
    throw new VideoPipelineError("MISSING_OPENAI_KEY");
  }

  const parsed = parseYouTubeInput(videoUrl);
  if (!parsed.ok) {
    throw new VideoPipelineError("INVALID_URL");
  }

  const source = await resolveYouTubeSource(parsed.url);
  let sttSource: PreparedTranscript["sttSource"] = "whisper";
  let stt: SttSegment[] = [];
  let officialUi: SttSegment[] = [];
  let captionMode: PreparedTranscript["captionMode"] = "speech";

  // Official UI-locale captions (manual only, language must match).
  try {
    officialUi = usableSpeech(
      await transcribeYouTubeCaptions(
        source.captionTracks,
        source.videoId,
        source.cookie,
        { preferredLocale: locale, manualOnly: true },
      ),
    );
  } catch (error) {
    console.error("[video-prepare-official-ui]", error);
  }

  // Speech / learning-language transcript only (never another language's track).
  try {
    const targetManual = usableSpeech(
      await transcribeYouTubeCaptions(
        source.captionTracks,
        source.videoId,
        source.cookie,
        { preferredLocale: targetLanguage, manualOnly: true },
      ),
    );
    if (targetManual.length > 0) {
      stt = targetManual;
      sttSource = "youtube-manual";
    } else {
      const targetCaptions = usableSpeech(
        await transcribeYouTubeCaptions(
          source.captionTracks,
          source.videoId,
          source.cookie,
          {
            preferredLocale: targetLanguage,
            requireLanguageMatch: true,
          },
        ),
      );
      if (targetCaptions.length > 0) {
        stt = targetCaptions;
        sttSource = "youtube-asr";
      }
    }
  } catch (error) {
    console.error("[video-prepare-captions]", error);
  }

  if (stt.length === 0) {
    const audio = await extractAudio({
      audioStreamUrl: source.audioStreamUrl,
      audioMimeType: source.audioMimeType,
      videoStreamUrl: source.videoStreamUrl,
      mediaUserAgent: source.mediaUserAgent,
      maxSeconds: Math.min(
        WHISPER_MAX_SECONDS,
        Math.max(
          90,
          Math.ceil((source.durationSeconds || WHISPER_MAX_SECONDS) + 15),
        ),
      ),
    });
    console.error("[video-prepare-audio]", {
      videoId: parsed.videoId,
      extracted: Boolean(audio),
      bytes: audio?.bytes.byteLength ?? 0,
      mimeType: audio?.mimeType,
      filename: audio?.filename,
    });
    if (audio) {
      try {
        const raw = await transcribeAudio(audio);
        stt = usableSpeech(raw);
        console.error("[video-prepare-stt]", {
          videoId: parsed.videoId,
          rawLines: raw.length,
          usableLines: stt.length,
          sample: raw.slice(0, 3).map((row) => row.text),
        });
        if (stt.length > 0) sttSource = "whisper";
      } catch (error) {
        console.error("[video-prepare-whisper]", error);
      }
    }
  }

  // Only reuse UI official captions as the speech track when UI == learning language.
  if (stt.length === 0 && officialUi.length > 0) {
    const uiBase = locale.split(/[-_]/)[0]?.toLowerCase();
    const targetBase = targetLanguage.split(/[-_]/)[0]?.toLowerCase();
    if (uiBase && targetBase && uiBase === targetBase) {
      stt = officialUi;
      sttSource = "youtube-official-ui";
    }
  }

  console.error("[video-prepare]", {
    videoId: parsed.videoId,
    hasAudio: Boolean(source.audioStreamUrl),
    hasVideo: Boolean(source.videoStreamUrl),
    sttLines: stt.length,
    officialUiLines: officialUi.length,
    sttSource,
  });

  if (stt.length === 0) {
    throw new VideoPipelineError(
      source.audioStreamUrl || source.captionTracks.length
        ? "NO_SPEECH"
        : "NO_AUDIO",
    );
  }

  const targetCode: LearningLanguageCode = isLearningLanguageCode(targetLanguage)
    ? targetLanguage
    : "en";
  const speechSample = stt
    .slice(0, 40)
    .map((row) => row.text)
    .join(" ");
  if (speechLooksWrongLanguage(speechSample, targetCode)) {
    console.error("[video-prepare-wrong-language]", {
      videoId: parsed.videoId,
      targetLanguage: targetCode,
      sttSource,
      sample: speechSample.slice(0, 160),
    });
    throw new VideoPipelineError("UNKNOWN_LANGUAGE");
  }

  const useOfficialUi = officialUi.length > 0;
  captionMode = useOfficialUi ? "official-ui" : "speech";
  if (useOfficialUi) {
    sttSource = "youtube-official-ui";
  }

  // Study / playback units always follow learning-language speech timing.
  const speechNormalized = withoutWords(
    await normalizeTranscript(stt, {
      gptThroughSeconds: FIRST_WINDOW_SECONDS,
    }),
  );
  const officialNormalized = useOfficialUi
    ? asOfficialSegments(officialUi)
    : [];
  const normalized = speechNormalized;

  const last = normalized[normalized.length - 1];
  const durationSeconds = Math.max(
    source.durationSeconds,
    last ? last.endTime : 0,
  );
  // Fixed 20s clock slices for progressive adaptation.
  const windows = processingWindows(normalized, durationSeconds);

  const [context, sceneContexts] = await Promise.all([
    sketchVideoContent({
      title: source.title,
      segments: normalized,
    }),
    buildSceneContextsForWindow({
      videoStreamUrl: source.videoStreamUrl,
      mediaUserAgent: source.mediaUserAgent,
      videoTitle: source.title,
      fromSeconds: 0,
      toSeconds: FIRST_WINDOW_SECONDS,
    }),
  ]);

  // First playback uses English STT only — Korean interpretation runs after the video ends.
  const viewerContext = emptyViewerContext({
    topic: context.topic,
    summary: context.summary,
  });

  console.error("[video-prepare-sections]", {
    videoId: parsed.videoId,
    windowSeconds: FIRST_WINDOW_SECONDS,
    sectionCount: windows.length,
    durationSeconds,
    segments: normalized.length,
    captionMode,
    officialUi: officialNormalized.length,
    firstCues: 0,
    sceneContexts: sceneContexts.length,
    viewerFacts: viewerContext.establishedFacts.length,
    locale,
  });

  return {
    videoId: parsed.videoId,
    videoUrl: parsed.url,
    durationSeconds,
    sttSource,
    captionMode,
    context,
    segments: normalized,
    ...(officialNormalized.length > 0
      ? { officialUiSegments: officialNormalized }
      : {}),
    sceneContexts: sceneContexts.length ? sceneContexts : undefined,
    viewerContext,
    firstWindowEnd: FIRST_WINDOW_SECONDS,
    processingWindows: windows,
  };
}

export async function translateSubtitleWindow(
  input: TranslateWindowInput,
): Promise<{ cues: SubtitleSegment[]; viewerContext: ViewerContext }> {
  if (!getOpenAIClient()) {
    throw new VideoPipelineError("MISSING_OPENAI_KEY");
  }
  if (input.currentSegments.length === 0) {
    return {
      cues: [],
      viewerContext:
        input.viewerContext ??
        emptyViewerContext({
          topic: input.context.topic,
          summary: input.context.summary,
        }),
    };
  }
  return translateSubtitleWindowPipeline(input);
}

/** @deprecated unused after full-video prepare; kept for tests/helpers */
export function segmentsForWindow(
  segments: NormalizedSegment[],
  start: number,
  end: number,
): NormalizedSegment[] {
  return segmentsInWindow(segments, { start, end });
}

export function windowNeighbors(
  segments: NormalizedSegment[],
  current: NormalizedSegment[],
): { previous: NormalizedSegment[]; next: NormalizedSegment[] } {
  if (current.length === 0) return { previous: [], next: [] };
  const startIndex = segments.indexOf(current[0]!);
  const endIndex = startIndex + current.length;
  return neighborsAround(segments, startIndex, endIndex);
}

export type { SceneContext };
