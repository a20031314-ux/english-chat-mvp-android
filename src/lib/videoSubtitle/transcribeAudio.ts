import { toFile } from "openai";
import { VideoPipelineError } from "@/lib/videoSubtitle/errors";
import { getOpenAIClient, transcribeModel } from "@/lib/server/openai";
import { looksLikeMusicBleed } from "@/lib/videoSubtitle/speechNoise";
import type { ExtractedAudio, SttSegment, SttWord } from "@/lib/videoSubtitle/types";

function segmentConfidence(input: {
  avgLogprob?: number;
  noSpeechProb?: number;
}): { confidence: number; uncertain: boolean } {
  const avg = input.avgLogprob ?? -0.4;
  const noSpeech = input.noSpeechProb ?? 0;
  const fromLog = Math.max(0, Math.min(1, 1 + avg));
  const confidence = Math.max(0, Math.min(1, fromLog * (1 - noSpeech)));
  const uncertain = noSpeech > 0.55 || avg < -0.9 || confidence < 0.35;
  return { confidence, uncertain };
}

function wordsForSegment(
  words: SttWord[] | undefined,
  start: number,
  end: number,
): SttWord[] | undefined {
  if (!words?.length) return undefined;
  const slice = words.filter(
    (word) => word.start >= start - 0.05 && word.end <= end + 0.08,
  );
  return slice.length ? slice : undefined;
}

export async function transcribeAudio(
  audio: ExtractedAudio,
  options?: { language?: string; offsetSeconds?: number },
): Promise<SttSegment[]> {
  const client = getOpenAIClient();
  if (!client) {
    throw new VideoPipelineError("MISSING_OPENAI_KEY");
  }
  const offset = Math.max(0, options?.offsetSeconds ?? 0);
  const language = options?.language?.trim().toLowerCase().split(/[-_]/)[0];

  const makeFile = () =>
    toFile(audio.bytes, audio.filename, {
      type: audio.mimeType,
    });

  try {
    const prompt =
      "Transcribe only clearly spoken dialogue and narration in the original language. " +
      "Ignore background music, instrumentals, hummed melodies, and song lyrics unless a person is clearly speaking them as dialogue. " +
      "If you only hear music, output nothing or [music]. Do not invent speech. Do not translate.";
    const request = async (withWords: boolean) =>
      client.audio.transcriptions.create({
        file: await makeFile(),
        model: transcribeModel(),
        temperature: 0,
        response_format: "verbose_json",
        ...(withWords ? { timestamp_granularities: ["segment", "word"] } : {}),
        ...(language && language.length === 2 ? { language } : {}),
        prompt,
      });
    const result = await request(true).catch(() => request(false));

    const words: SttWord[] | undefined = result.words?.map((word) => ({
      word: word.word,
      start: word.start + offset,
      end: word.end + offset,
    }));

    const segments: SttSegment[] = [];
    for (const [index, segment] of (result.segments ?? []).entries()) {
      const text = segment.text.replace(/\s+/g, " ").trim();
      const noSpeechProb = segment.no_speech_prob ?? 0;
      const { confidence, uncertain } = segmentConfidence({
        avgLogprob: segment.avg_logprob,
        noSpeechProb,
      });
      if (!text) continue;
      if (
        looksLikeMusicBleed({
          text,
          noSpeechProb,
          confidence,
          uncertain,
        })
      ) {
        continue;
      }
      const slice = wordsForSegment(words, segment.start + offset, segment.end + offset);
      segments.push({
        id: `w-${index}-${Math.round((segment.start + offset) * 1000)}`,
        text,
        startTime: segment.start + offset,
        endTime: Math.max(segment.start + offset + 0.3, segment.end + offset),
        ...(slice ? { words: slice } : {}),
        confidence,
        uncertain,
      });
    }

    if (segments.length === 0 && result.text.trim()) {
      const fallback = result.text.trim();
      if (
        !looksLikeMusicBleed({
          text: fallback,
          noSpeechProb: 0.2,
        })
      ) {
        return [
          {
            id: "w-0",
            text: fallback,
            startTime: offset,
            endTime: offset + (result.duration || 4),
            ...(words?.length ? { words } : {}),
          },
        ];
      }
    }
    return segments;
  } catch (error) {
    console.error("[video-stt]", error);
    throw new VideoPipelineError("STT_FAILED");
  }
}
