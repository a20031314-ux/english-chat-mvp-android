import { parseYouTubeInput } from "@/lib/videoLearning";
import { analyzeVideoContext } from "@/lib/videoSubtitle/analyzeVideoContext";
import { VideoPipelineError } from "@/lib/videoSubtitle/errors";
import { extractAudio } from "@/lib/videoSubtitle/extractAudio";
import { formatSubtitles } from "@/lib/videoSubtitle/formatSubtitles";
import { getOpenAIClient } from "@/lib/videoSubtitle/openaiClient";
import { normalizeTranscript } from "@/lib/videoSubtitle/normalizeTranscript";
import {
  transcribeAudio,
  transcriptLooksEnglish,
} from "@/lib/videoSubtitle/transcribeAudio";
import {
  retryMissingTranslations,
  translateSegments,
} from "@/lib/videoSubtitle/translateSegments";
import type {
  NormalizedSegment,
  PreparedTranscript,
  SttSegment,
  SubtitleSegment,
  TranslateWindowInput,
} from "@/lib/videoSubtitle/types";
import { validateTranslation } from "@/lib/videoSubtitle/validateTranslation";
import { transcribeYouTubeCaptions } from "@/lib/videoSubtitle/youtubeCaptions";
import { resolveYouTubeSource } from "@/lib/videoSubtitle/youtubePlayer";

const MAX_SEGMENTS = 480;

function isMarkerOnly(text: string): boolean {
  return /^\s*\[(music|applause|laughter|silence|inaudible).*\]\s*$/i.test(
    text,
  );
}

function usableSpeech(segments: SttSegment[]): SttSegment[] {
  return segments
    .map((segment) => ({
      ...segment,
      text: segment.text.replace(/\s+/g, " ").trim(),
    }))
    .filter((segment) => segment.text && !isMarkerOnly(segment.text))
    .slice(0, MAX_SEGMENTS);
}

function coverage(segments: SttSegment[], durationSeconds: number): number {
  if (segments.length === 0) return 0;
  if (durationSeconds <= 0) return 1;
  const end = segments[segments.length - 1]!.endTime;
  return Math.min(1, end / durationSeconds);
}

function withoutWords(segments: NormalizedSegment[]): NormalizedSegment[] {
  return segments.map(({ words: _words, ...rest }) => rest);
}

export async function prepareVideoTranscript(
  videoUrl: string,
): Promise<PreparedTranscript> {
  if (!getOpenAIClient()) {
    throw new VideoPipelineError("MISSING_OPENAI_KEY");
  }

  const parsed = parseYouTubeInput(videoUrl);
  if (!parsed.ok) {
    throw new VideoPipelineError("INVALID_URL");
  }

  const source = await resolveYouTubeSource(parsed.url);
  let sttSource: PreparedTranscript["sttSource"] = "youtube-asr";
  let stt: SttSegment[] = [];

  const audio = await extractAudio({
    audioStreamUrl: source.audioStreamUrl,
    audioMimeType: source.audioMimeType,
  });
  if (audio) {
    try {
      const whispered = usableSpeech(await transcribeAudio(audio));
      const enough =
        whispered.length > 0 &&
        (coverage(whispered, source.durationSeconds) >= 0.45 ||
          source.captionTracks.length === 0);
      if (enough) {
        stt = whispered;
        sttSource = "whisper";
      }
    } catch (error) {
      console.error("[video-prepare-whisper]", error);
    }
  }

  if (stt.length === 0) {
    stt = usableSpeech(await transcribeYouTubeCaptions(source.captionTracks));
    sttSource = "youtube-asr";
  }

  if (stt.length === 0) {
    throw new VideoPipelineError(
      source.audioStreamUrl || source.captionTracks.length
        ? "NO_SPEECH"
        : "NO_AUDIO",
    );
  }

  if (!transcriptLooksEnglish(stt)) {
    throw new VideoPipelineError("UNKNOWN_LANGUAGE");
  }

  const normalized = withoutWords(await normalizeTranscript(stt));
  const context = await analyzeVideoContext(normalized);
  const last = normalized[normalized.length - 1];
  const durationSeconds = Math.max(
    source.durationSeconds,
    last ? last.endTime : 0,
  );

  return {
    videoId: parsed.videoId,
    videoUrl: parsed.url,
    durationSeconds,
    sttSource,
    context,
    segments: normalized,
  };
}

export async function translateSubtitleWindow(
  input: TranslateWindowInput,
): Promise<SubtitleSegment[]> {
  if (!getOpenAIClient()) {
    throw new VideoPipelineError("MISSING_OPENAI_KEY");
  }
  if (input.currentSegments.length === 0) return [];

  let translations = await translateSegments(input);
  const missing = retryMissingTranslations(input.currentSegments, translations);
  if (missing.length > 0) {
    try {
      const extra = await translateSegments({
        ...input,
        currentSegments: missing,
      });
      extra.forEach((value, key) => translations.set(key, value));
    } catch (error) {
      console.error("[video-translate-retry]", error);
    }
  }

  translations = await validateTranslation({
    locale: input.locale,
    context: input.context,
    segments: input.currentSegments,
    translations,
  });

  return formatSubtitles({
    segments: input.currentSegments,
    translations,
  });
}
