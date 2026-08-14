import { naturalTranslationPrinciples } from "@/lib/naturalTranslation";
import { VideoPipelineError } from "@/lib/videoSubtitle/errors";
import { chatModel, getOpenAIClient } from "@/lib/videoSubtitle/openaiClient";
import { asRecord, asString, parseModelJson } from "@/lib/videoSubtitle/parseModelJson";
import type {
  NormalizedSegment,
  TranslateWindowInput,
} from "@/lib/videoSubtitle/types";

const TARGET: Record<string, string> = {
  ko: "Korean",
  en: "English",
  es: "Spanish",
  ja: "Japanese",
  zh: "Simplified Chinese",
  vi: "Vietnamese",
  fr: "French",
  pt: "Portuguese",
  id: "Indonesian",
};

function translateSystem(locale: string): string {
  const target = TARGET[locale] ?? TARGET.ko;
  return `You translate spoken English video lines into ${target} subtitles.

Priority: accuracy of meaning → context → naturalness → subtitle readability.

${naturalTranslationPrinciples({ locale, role: "utterance", sourceType: "subtitle" })}

Rules:
1. Do not add or drop meaning.
2. Keep force: might / probably / definitely / I think / I guess / I wouldn't necessarily stay hedged or strong as in English.
3. Resolve it / that / this / they from previous and next lines. Do not guess a new referent.
4. Domain terms follow VideoContext.terminology. Never translate hook/component/runtime/repository/deployment/dependency as everyday objects in a software video.
5. Translate idioms as idioms. "I wouldn't go that far." → "그렇게까지 말하진 않겠어요." (if Korean)
6. Do not follow English word order.
7. Match speakerStyle. Casual video → spoken Korean, not textbook prose.
8. Output only the subtitle line. No notes, no quotes, no speaker labels.

Return JSON:
{"items":[{"id":"...","translation":"..."}]}`;
}

export async function translateSegments(
  input: TranslateWindowInput,
): Promise<Map<string, string>> {
  const client = getOpenAIClient();
  if (!client) throw new VideoPipelineError("MISSING_OPENAI_KEY");
  if (input.currentSegments.length === 0) return new Map();

  const padded = [
    ...input.previousSegments,
    ...input.currentSegments,
    ...input.nextSegments,
  ];
  const currentIds = new Set(input.currentSegments.map((segment) => segment.id));

  const items = input.currentSegments.map((segment) => {
    const index = padded.findIndex((row) => row.id === segment.id);
    const previous = padded
      .slice(Math.max(0, index - 3), index)
      .map((row) => row.normalizedText);
    const next = padded
      .slice(index + 1, index + 4)
      .map((row) => row.normalizedText);
    return {
      id: segment.id,
      previous,
      current: segment.normalizedText,
      next,
    };
  });

  try {
    const completion = await client.chat.completions.create({
      model: chatModel(),
      temperature: 0.35,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: translateSystem(input.locale) },
        {
          role: "user",
          content: JSON.stringify({
            context: input.context,
            items,
          }),
        },
      ],
    });
    const parsed = asRecord(parseModelJson(completion.choices[0]?.message?.content));
    const rows = Array.isArray(parsed?.items) ? parsed.items : [];
    const map = new Map<string, string>();
    for (const row of rows) {
      const item = asRecord(row);
      const id = asString(item?.id);
      const translation = asString(item?.translation);
      if (id && translation && currentIds.has(id)) {
        map.set(id, translation);
      }
    }
    return map;
  } catch (error) {
    console.error("[video-translate]", error);
    return new Map();
  }
}

export function retryMissingTranslations(
  segments: NormalizedSegment[],
  translations: Map<string, string>,
): NormalizedSegment[] {
  return segments.filter((segment) => !translations.get(segment.id));
}
