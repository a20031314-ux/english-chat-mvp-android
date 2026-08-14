import { toFile } from "openai";
import { VideoPipelineError } from "@/lib/videoSubtitle/errors";
import { getOpenAIClient, transcribeModel } from "@/lib/videoSubtitle/openaiClient";
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
): Promise<SttSegment[]> {
  const client = getOpenAIClient();
  if (!client) {
    throw new VideoPipelineError("MISSING_OPENAI_KEY");
  }

  const makeFile = () =>
    toFile(audio.bytes, audio.filename, {
      type: audio.mimeType,
    });

  try {
    const prompt =
      "Transcribe clearly audible speech from this video in its original language. Do not invent missing speech. Do not translate.";
    const request = async (withWords: boolean) =>
      client.audio.transcriptions.create({
        file: await makeFile(),
        model: transcribeModel(),
        temperature: 0,
        response_format: "verbose_json",
        ...(withWords ? { timestamp_granularities: ["segment", "word"] } : {}),
        prompt,
      });
    const result = await request(true).catch(() => request(false));

    const words: SttWord[] | undefined = result.words?.map((word) => ({
      word: word.word,
      start: word.start,
      end: word.end,
    }));

    const segments: SttSegment[] = [];
    for (const [index, segment] of (result.segments ?? []).entries()) {
      const text = segment.text.replace(/\s+/g, " ").trim();
      const { confidence, uncertain } = segmentConfidence({
        avgLogprob: segment.avg_logprob,
        noSpeechProb: segment.no_speech_prob,
      });
      if (!text) continue;
      if ((segment.no_speech_prob ?? 0) > 0.85 && text.length < 8) continue;
      const slice = wordsForSegment(words, segment.start, segment.end);
      segments.push({
        id: `w-${index}-${Math.round(segment.start * 1000)}`,
        text,
        startTime: segment.start,
        endTime: Math.max(segment.start + 0.3, segment.end),
        ...(slice ? { words: slice } : {}),
        confidence,
        uncertain,
      });
    }

    if (segments.length === 0 && result.text.trim()) {
      return [
        {
          id: "w-0",
          text: result.text.trim(),
          startTime: 0,
          endTime: result.duration || 4,
          ...(words?.length ? { words } : {}),
        },
      ];
    }
    return segments;
  } catch (error) {
    console.error("[video-stt]", error);
    throw new VideoPipelineError("STT_FAILED");
  }
}
