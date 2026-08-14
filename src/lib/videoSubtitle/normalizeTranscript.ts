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

function normalizeSystem(): string {
  return `You clean English speech-to-text. You do not translate.

Allowed:
- Restore punctuation and capitalization
- Restore sentence boundaries
- Fix obvious STT errors (homophones, missing apostrophes)
- Restore proper nouns and technical terms
- Drop filler (uh, um, er) only when it carries no meaning
- Keep hedges such as like, kind of, I guess, I would say

Forbidden:
- Change the speaker's meaning
- Add information they did not say
- Summarize
- Translate
- Rewrite into "better" English
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

export async function normalizeTranscript(
  segments: SttSegment[],
): Promise<NormalizedSegment[]> {
  const out: NormalizedSegment[] = [];
  for (let i = 0; i < segments.length; i += BATCH) {
    const batch = segments.slice(i, i + BATCH);
    let map = new Map<string, string>();
    try {
      map = await normalizeBatch(batch);
    } catch (error) {
      console.error("[video-normalize]", error);
    }
    for (const segment of batch) {
      out.push({
        id: segment.id,
        startTime: segment.startTime,
        endTime: segment.endTime,
        rawText: segment.text,
        normalizedText: map.get(segment.id) || fallbackNormalize(segment.text),
        words: segment.words,
        confidence: segment.confidence,
        uncertain: segment.uncertain,
      });
    }
  }
  return out;
}
