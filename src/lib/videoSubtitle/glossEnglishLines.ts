import { VideoPipelineError } from "@/lib/videoSubtitle/errors";
import { chatModel, getOpenAIClient } from "@/lib/videoSubtitle/openaiClient";
import {
  asRecord,
  asString,
  parseModelJson,
} from "@/lib/videoSubtitle/parseModelJson";
import { localeTargetName } from "@/lib/videoSubtitle/subtitleDraft";
import type { NormalizedSegment, VideoContext } from "@/lib/videoSubtitle/types";

const BATCH = 8;

export type LineGloss = {
  /** Same id as English study cue: mu-${segment.id} */
  id: string;
  interpretation: string;
};

function cueId(segmentId: string): string {
  return segmentId.startsWith("mu-") ? segmentId : `mu-${segmentId}`;
}

function normalizeCompare(text: string): string {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

/**
 * Per-line learner gloss tied to each STT segment id.
 * Does NOT use the native-viewer caption pipeline (which over-writes short lines
 * with neighboring conversational meaning).
 */
export async function glossEnglishLines(input: {
  locale: string;
  context: VideoContext;
  segments: NormalizedSegment[];
}): Promise<LineGloss[]> {
  const client = getOpenAIClient();
  if (!client) throw new VideoPipelineError("MISSING_OPENAI_KEY");
  if (input.segments.length === 0) return [];

  const target = localeTargetName(input.locale);
  const out: LineGloss[] = [];

  for (let i = 0; i < input.segments.length; i += BATCH) {
    const batch = input.segments.slice(i, i + BATCH);
    const payload = batch.map((segment, index) => {
      const abs = i + index;
      const prev = input.segments[abs - 1];
      const next = input.segments[abs + 1];
      return {
        id: cueId(segment.id),
        english: segment.normalizedText,
        previous: prev?.normalizedText || "",
        next: next?.normalizedText || "",
      };
    });

    try {
      const completion = await client.chat.completions.create({
        model: chatModel(),
        temperature: 0.3,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: `You write a short ${target} gloss for each English video line (language learning).

Hard rules:
- Gloss THIS english line only. Keep the same id.
- Short reactions (Yeah / Ok / Right / Mm) stay short (응 / 그래 / 맞아 / 음). Never expand them into the next sentence's content.
- previous/next are only for pronouns/deixis (this/that/it/he…).
- Do not write tutor notes, labels, or English.
- One short spoken line per item.

Return JSON:
{"items":[{"id":"...","interpretation":"..."}]}`,
          },
          {
            role: "user",
            content: JSON.stringify({
              topic: input.context.topic,
              situation: input.context.summary,
              items: payload,
            }),
          },
        ],
      });

      const parsed = asRecord(
        parseModelJson(completion.choices[0]?.message?.content),
      );
      const rows = Array.isArray(parsed?.items) ? parsed.items : [];
      const byId = new Map<string, string>();
      for (const row of rows) {
        const item = asRecord(row);
        const id = asString(item?.id);
        const interpretation =
          asString(item?.interpretation) ||
          asString(item?.naturalSubtitle) ||
          asString(item?.translation) ||
          "";
        if (id && interpretation.trim()) {
          byId.set(cueId(id), interpretation.trim());
        }
      }

      for (let index = 0; index < batch.length; index += 1) {
        const segment = batch[index]!;
        const id = cueId(segment.id);
        let interpretation = byId.get(id) || "";
        // Index fallback only when the model omitted ids but kept order,
        // and only if we can sanity-check against the English text.
        if (!interpretation && rows.length === batch.length) {
          const row = asRecord(rows[index]);
          const candidate =
            asString(row?.interpretation) ||
            asString(row?.naturalSubtitle) ||
            asString(row?.translation);
          const rowEnglish =
            asString(row?.english) || asString(row?.original) || "";
          if (
            candidate &&
            (!rowEnglish ||
              normalizeCompare(rowEnglish) ===
                normalizeCompare(segment.normalizedText))
          ) {
            interpretation = candidate.trim();
          }
        }
        if (interpretation) {
          out.push({ id, interpretation });
        }
      }
    } catch (error) {
      console.error("[gloss-english-lines]", error);
    }
  }

  return out;
}
