import { VideoPipelineError } from "@/lib/videoSubtitle/errors";
import { chatModel, getOpenAIClient } from "@/lib/videoSubtitle/openaiClient";
import {
  asRecord,
  asString,
  parseModelJson,
} from "@/lib/videoSubtitle/parseModelJson";
import type { NormalizedSegment, VideoContext } from "@/lib/videoSubtitle/types";
import { learningLanguageName } from "@/lib/learningLanguages";
import { spokenTranslatePrinciples } from "@/lib/spokenTranslate";

const BATCH = 8;

export type LineGloss = {
  /** Same id as English study cue: mu-${segment.id} */
  id: string;
  interpretation: string;
};

function cueId(segmentId: string): string {
  // Study lines already use mu-*; merge/split lines use edit-*. Keep as-is.
  if (segmentId.startsWith("mu-") || segmentId.startsWith("edit-")) {
    return segmentId;
  }
  return `mu-${segmentId}`;
}

function normalizeCompare(text: string): string {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

/**
 * Per-line learner gloss tied to each STT segment id.
 * Uses the same spoken-translate craft as chat `/api/translate`.
 */
export async function glossEnglishLines(input: {
  locale: string;
  targetLanguage?: string;
  interfaceLanguage?: string;
  context: VideoContext;
  segments: NormalizedSegment[];
}): Promise<LineGloss[]> {
  const client = getOpenAIClient();
  if (!client) throw new VideoPipelineError("MISSING_OPENAI_KEY");
  if (input.segments.length === 0) return [];

  const interfaceLanguage = input.interfaceLanguage || input.locale || "ko";
  const targetLanguage = input.targetLanguage || "en";
  const sourceName = learningLanguageName(targetLanguage);
  const out: LineGloss[] = [];

  const lineRules = `
Video-line constraints (on top of the shared translate craft):
- Gloss THIS ${sourceName} line only. Keep the same id.
- Short reactions (Yeah / Ok / Right / Mm / etc.) stay short in the output language. Never expand them into the next sentence's content.
- previous/next are only for pronouns/deixis (this/that/it/he…).
- Keep captions short enough to read on screen (one breath).
- Do not write tutor notes, labels, or leftover source-language wording in the gloss.
`.trim();

  for (let i = 0; i < input.segments.length; i += BATCH) {
    const batch = input.segments.slice(i, i + BATCH);
    const payload = batch.map((segment, index) => {
      const abs = i + index;
      const prev = input.segments[abs - 1];
      const next = input.segments[abs + 1];
      return {
        id: cueId(segment.id),
        text: segment.normalizedText,
        previous: prev?.normalizedText || "",
        next: next?.normalizedText || "",
      };
    });

    try {
      const completion = await client.chat.completions.create({
        model: chatModel(),
        temperature: 0.4,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: `${spokenTranslatePrinciples({
              locale: interfaceLanguage,
              interfaceLanguage,
              targetLanguage,
              sourceType: "subtitle",
            })}

${lineRules}

Return JSON:
{"items":[{"id":"...","interpretation":"..."}]}
Each interpretation is the natural spoken rendering of that line (same field as chat "translated").`,
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
          asString(item?.translated) ||
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
        // and only if we can sanity-check against the source text.
        if (!interpretation && rows.length === batch.length) {
          const row = asRecord(rows[index]);
          const candidate =
            asString(row?.interpretation) ||
            asString(row?.translated) ||
            asString(row?.naturalSubtitle) ||
            asString(row?.translation);
          const rowSource =
            asString(row?.text) ||
            asString(row?.english) ||
            asString(row?.original) ||
            "";
          if (
            candidate &&
            (!rowSource ||
              normalizeCompare(rowSource) ===
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
