import { toFile } from "openai";
import { VideoPipelineError } from "@/lib/videoSubtitle/errors";
import { getOpenAIClient, transcribeModel } from "@/lib/server/openai";
import { externalSttReady, isExternalStt, scribeTimed, tokensToLines } from "@/lib/server/sttProviders";
import { SPEECH_DEFAULTS } from "@/lib/aiDefaults";
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
  const offset = Math.max(0, options?.offsetSeconds ?? 0);
  const language = options?.language?.trim().toLowerCase().split(/[-_]/)[0];
  const chosen = transcribeModel();

  // 2026-10-27: 기본은 Scribe v2(낱말 시간 포함, whisper-1 2027-02-26 종료의 대체). 실패하면 아래 OpenAI 길로.
  if (isExternalStt(chosen) && chosen === "scribe_v2" && externalSttReady(chosen)) {
    try {
      const heard = await scribeTimed({ bytes: audio.bytes, mimeType: audio.mimeType, filename: audio.filename, language });
      const segments: SttSegment[] = [];
      for (const [index, line] of tokensToLines(heard.tokens, offset).entries()) {
        const confidence = line.confidence ?? 0.8;
        const uncertain = confidence < 0.35;
        if (looksLikeMusicBleed({ text: line.text, noSpeechProb: 0, confidence, uncertain })) continue;
        segments.push({
          id: `s-${index}-${Math.round(line.start * 1000)}`,
          text: line.text,
          startTime: line.start,
          endTime: Math.max(line.start + 0.3, line.end),
          words: line.words,
          confidence,
          uncertain,
        });
      }
      return segments;
    } catch (error) {
      console.error("[video-stt] scribe failed, falling back to OpenAI:", error);
    }
  }

  const client = getOpenAIClient();
  if (!client) {
    throw new VideoPipelineError("MISSING_OPENAI_KEY");
  }
  const openaiModel = isExternalStt(chosen) ? SPEECH_DEFAULTS.openaiTranscribe : chosen;
  // gpt-transcribe 계열은 시간 정보(verbose_json)가 없다 — 글만 받아 조각 하나로(아래 fallback 줄).
  const nextGen = /^gpt-(live-)?transcribe/.test(openaiModel);

  const makeFile = () =>
    toFile(audio.bytes, audio.filename, {
      type: audio.mimeType,
    });

  try {
    const prompt =
      "Transcribe only clearly spoken dialogue and narration in the original language. " +
      "Ignore background music, instrumentals, hummed melodies, and song lyrics unless a person is clearly speaking them as dialogue. " +
      "If you only hear music, output nothing or [music]. Do not invent speech. Do not translate.";
    type Verbose = Awaited<ReturnType<typeof client.audio.transcriptions.create>> & {
      words?: { word: string; start: number; end: number }[];
      segments?: { text: string; start: number; end: number; no_speech_prob?: number; avg_logprob?: number }[];
      duration?: number;
      text: string;
    };
    const request = async (withWords: boolean): Promise<Verbose> =>
      nextGen
        ? ((await client.audio.transcriptions.create({
            file: await makeFile(),
            model: openaiModel,
            response_format: "json",
            ...(language && language.length === 2 ? { languages: [language] } : {}),
            prompt,
          } as unknown as Parameters<typeof client.audio.transcriptions.create>[0])) as unknown as Verbose)
        : ((await client.audio.transcriptions.create({
            file: await makeFile(),
            model: openaiModel,
            temperature: 0,
            response_format: "verbose_json",
            ...(withWords ? { timestamp_granularities: ["segment", "word"] } : {}),
            ...(language && language.length === 2 ? { language } : {}),
            prompt,
          })) as unknown as Verbose);
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
            endTime: offset + (result.duration || audio.durationHintSeconds || 4),
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
