import { VideoPipelineError } from "@/lib/videoSubtitle/errors";
import { chatModel, getOpenAIClient } from "@/lib/videoSubtitle/openaiClient";
import { asRecord, asString, parseModelJson } from "@/lib/videoSubtitle/parseModelJson";
import type { NormalizedSegment, VideoContext } from "@/lib/videoSubtitle/types";

export async function validateTranslation(input: {
  locale: string;
  context: VideoContext;
  segments: NormalizedSegment[];
  translations: Map<string, string>;
}): Promise<Map<string, string>> {
  const client = getOpenAIClient();
  if (!client) throw new VideoPipelineError("MISSING_OPENAI_KEY");

  const rows = input.segments
    .map((segment) => {
      const translation = input.translations.get(segment.id);
      if (!translation) return null;
      return {
        id: segment.id,
        original: segment.normalizedText,
        translation,
      };
    })
    .filter((row): row is { id: string; original: string; translation: string } => row !== null);

  if (rows.length === 0) return input.translations;

  const revised = new Map(input.translations);
  try {
    const completion = await client.chat.completions.create({
      model: chatModel(),
      temperature: 0.1,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You check subtitle translations. Do NOT rewrite a line unless it has a real problem.

Problems to fix:
- missing meaning
- added meaning
- wrong technical term
- over-paraphrase that changes the claim
- awkward calque
- changed force (might/probably/definitely/I think)
- wrong pronoun/referent
- translation that fights VideoContext

If a line is fine, omit it.
Return JSON: {"revisions":[{"id":"...","translation":"...","reason":"..."}]}
If nothing is wrong: {"revisions":[]}`,
        },
        {
          role: "user",
          content: JSON.stringify({
            locale: input.locale,
            context: input.context,
            items: rows,
          }),
        },
      ],
    });
    const parsed = asRecord(parseModelJson(completion.choices[0]?.message?.content));
    const revisions = Array.isArray(parsed?.revisions) ? parsed.revisions : [];
    for (const row of revisions) {
      const item = asRecord(row);
      const id = asString(item?.id);
      const translation = asString(item?.translation);
      if (id && translation && revised.has(id)) {
        revised.set(id, translation);
      }
    }
  } catch (error) {
    console.error("[video-validate]", error);
  }
  return revised;
}
