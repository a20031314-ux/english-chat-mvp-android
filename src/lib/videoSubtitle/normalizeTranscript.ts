import { VideoPipelineError } from "@/lib/videoSubtitle/errors";
import { chatModel, getOpenAIClient } from "@/lib/videoSubtitle/openaiClient";
import { asRecord, asString, parseModelJson } from "@/lib/videoSubtitle/parseModelJson";
import type { NormalizedSegment, SttSegment } from "@/lib/videoSubtitle/types";

const BATCH = 18;

function fallbackNormalize(text: string): string {
  const trimmed = text.replace(/\s+/g, " ").trim();
  if (!trimmed) return "";
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

function toNormalized(
  segment: SttSegment,
  normalizedText: string,
): NormalizedSegment {
  return {
    id: segment.id,
    startTime: segment.startTime,
    endTime: segment.endTime,
    rawText: segment.text,
    normalizedText,
    words: segment.words,
    confidence: segment.confidence,
    uncertain: segment.uncertain,
  };
}

function normalizeSystem(): string {
  return `You clean speech-to-text in the same language as the source. You do not translate.

Allowed:
- Restore punctuation and capitalization appropriate to that language
- Restore sentence boundaries
- Fix obvious STT errors
- Restore proper nouns and technical terms
- Drop filler only when it carries no meaning

Forbidden:
- Change the speaker's meaning
- Add information they did not say
- Summarize
- Translate into another language
- Rewrite into "better" prose
- Invent words for unclear audio

Return JSON:
{"segments":[{"id":"...","normalizedText":"..."}]}
Keep the same ids. If a line is too unclear to fix, copy the raw text.`;
}

async function normalizeBatch(
  segments: SttSegment[],
): Promise<Map<string, string>> {
  const client = getOpenAIClient();
  if (!client) throw new VideoPipelineError("MISSING_OPENAI_KEY");

  const completion = await client.chat.completions.create({
    model: chatModel(),
    temperature: 0.1,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: normalizeSystem() },
      {
        role: "user",
        content: JSON.stringify({
          segments: segments.map((segment) => ({
            id: segment.id,
            rawText: segment.text,
          })),
        }),
      },
    ],
  });

  const parsed = asRecord(parseModelJson(completion.choices[0]?.message?.content));
  const rows = Array.isArray(parsed?.segments) ? parsed.segments : [];
  const map = new Map<string, string>();
  for (const row of rows) {
    const item = asRecord(row);
    const id = asString(item?.id);
    const text = asString(item?.normalizedText);
    if (id && text) map.set(id, text);
  }
  return map;
}

/**
 * Fast path: GPT-clean only the first window; remainder gets light cleanup.
 * Cuts prepare latency so playback can start after section 1.
 */
export async function normalizeTranscript(
  segments: SttSegment[],
  options?: { gptThroughSeconds?: number },
): Promise<NormalizedSegment[]> {
  const gptThrough = options?.gptThroughSeconds;
  const gptSegments =
    gptThrough == null
      ? segments
      : segments.filter((segment) => segment.startTime < gptThrough);
  const restSegments =
    gptThrough == null
      ? []
      : segments.filter((segment) => segment.startTime >= gptThrough);

  const gptMap = new Map<string, string>();
  for (let i = 0; i < gptSegments.length; i += BATCH) {
    const batch = gptSegments.slice(i, i + BATCH);
    try {
      const map = await normalizeBatch(batch);
      map.forEach((value, key) => gptMap.set(key, value));
    } catch (error) {
      console.error("[video-normalize]", error);
    }
  }

  const out: NormalizedSegment[] = [];
  for (const segment of gptSegments) {
    out.push(
      toNormalized(
        segment,
        gptMap.get(segment.id) || fallbackNormalize(segment.text),
      ),
    );
  }
  for (const segment of restSegments) {
    out.push(toNormalized(segment, fallbackNormalize(segment.text)));
  }
  return out.sort((a, b) => a.startTime - b.startTime);
}
