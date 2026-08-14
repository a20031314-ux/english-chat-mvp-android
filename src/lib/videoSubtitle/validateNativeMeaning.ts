import { VideoPipelineError } from "@/lib/videoSubtitle/errors";
import { chatModel, getOpenAIClient } from "@/lib/videoSubtitle/openaiClient";
import { asRecord, asString, parseModelJson } from "@/lib/videoSubtitle/parseModelJson";
import {
  localeTargetName,
  type SubtitleDraft,
} from "@/lib/videoSubtitle/subtitleDraft";
import type {
  NativeInterpretation,
  ViewerContext,
} from "@/lib/videoSubtitle/viewerTypes";
import { compactViewerContext } from "@/lib/videoSubtitle/viewerTypes";
import { looksLikeLiteralOrForeignCaption } from "@/lib/videoSubtitle/calqueDetect";

const BATCH = 8;

/**
 * Check Korean caption against native understanding — not against English glossing.
 * Never rewrite into 직역체.
 */
export async function validateNativeMeaning(input: {
  locale: string;
  viewerContext: ViewerContext;
  interpretations: NativeInterpretation[];
  drafts: SubtitleDraft[];
}): Promise<SubtitleDraft[]> {
  const client = getOpenAIClient();
  if (!client) throw new VideoPipelineError("MISSING_OPENAI_KEY");
  if (input.drafts.length === 0) return [];

  const target = localeTargetName(input.locale);
  const byId = new Map(input.interpretations.map((row) => [row.unitId, row]));
  const revised = new Map(
    input.drafts.map((draft) => [draft.id, draft.naturalSubtitle]),
  );
  const memory = compactViewerContext(input.viewerContext);

  for (let i = 0; i < input.drafts.length; i += BATCH) {
    const batch = input.drafts.slice(i, i + BATCH);
    const forceIds = batch
      .filter((draft) => {
        const text = revised.get(draft.id) || "";
        return (
          !text.trim() ||
          looksLikeLiteralOrForeignCaption(draft.original, text, input.locale)
        );
      })
      .map((draft) => draft.id);

    try {
      const completion = await client.chat.completions.create({
        model: chatModel(),
        temperature: 0.4,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: `Compare native English viewer understanding vs ${target} subtitle.

Fix ONLY if:
- Korean adds speculative info not established
- Important established meaning is missing for equivalent understanding
- Reference resolved wrongly
- Tone polarity flipped (praise vs sarcasm, yes vs no)
- Caption is dictionary 직역체

Do NOT force word-for-word English structure.
Do NOT empty captions.
Keep natural spoken ${target}.

Return JSON object:
{"revisions":[{"id":"...","naturalSubtitle":"..."}]}
Must revise every forceRewriteIds entry with non-empty text.`,
          },
          {
            role: "user",
            content: JSON.stringify({
              viewerMemory: memory,
              forceRewriteIds: forceIds,
              items: batch.map((draft) => {
                const interp = byId.get(draft.id);
                return {
                  id: draft.id,
                  original: draft.original,
                  understoodMeaning: interp?.understoodMeaning,
                  references: interp?.references,
                  naturalSubtitle: revised.get(draft.id),
                };
              }),
            }),
          },
        ],
      });
      const parsed = asRecord(
        parseModelJson(completion.choices[0]?.message?.content),
      );
      const rows = Array.isArray(parsed?.revisions) ? parsed.revisions : [];
      for (const row of rows) {
        const item = asRecord(row);
        const id = asString(item?.id);
        const natural = asString(item?.naturalSubtitle);
        if (id && natural?.trim()) revised.set(id, natural.trim());
      }
    } catch (error) {
      console.error("[validate-native-meaning]", error);
    }
  }

  return input.drafts.map((draft) => {
    const natural = (revised.get(draft.id) || draft.naturalSubtitle).trim();
    return {
      ...draft,
      naturalSubtitle: natural || draft.naturalSubtitle,
    };
  });
}
