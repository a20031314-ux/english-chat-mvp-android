import { VideoPipelineError } from "@/lib/videoSubtitle/errors";
import { chatModel, getOpenAIClient } from "@/lib/videoSubtitle/openaiClient";
import { asRecord, asString, parseModelJson } from "@/lib/videoSubtitle/parseModelJson";
import type {
  NormalizedSegment,
  VideoContext,
  VideoContextTerm,
} from "@/lib/videoSubtitle/types";

function fallbackContext(segments: NormalizedSegment[]): VideoContext {
  const summary = segments
    .slice(0, 12)
    .map((segment) => segment.normalizedText)
    .join(" ")
    .slice(0, 400);
  return {
    topic: "video",
    domain: "general",
    summary: summary || "Spoken audio from a video.",
    speakerStyle: "unknown",
    terminology: [],
  };
}

function parseTerms(value: unknown): VideoContextTerm[] {
  if (!Array.isArray(value)) return [];
  const terms: VideoContextTerm[] = [];
  for (const item of value) {
    const row = asRecord(item);
    const term = asString(row?.term);
    if (!term) continue;
    terms.push({
      term,
      meaning: asString(row?.meaning) ?? undefined,
      preferredTranslation: asString(row?.preferredTranslation) ?? undefined,
    });
  }
  return terms.slice(0, 40);
}

export function quickVideoContext(segments: NormalizedSegment[]): VideoContext {
  return fallbackContext(segments);
}

export async function analyzeVideoContext(
  segments: NormalizedSegment[],
): Promise<VideoContext> {
  const client = getOpenAIClient();
  if (!client) throw new VideoPipelineError("MISSING_OPENAI_KEY");

  const transcript = segments
    .map((segment) => segment.normalizedText)
    .join("\n")
    .slice(0, 14000);

  try {
    const completion = await client.chat.completions.create({
      model: chatModel(),
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `Analyze this video transcript. Detect its language. Do not translate the transcript.

Return JSON:
{
  "topic": "short topic",
  "domain": "e.g. software development, everyday conversation, science",
  "summary": "2-4 sentences in the transcript language",
  "speakerStyle": "e.g. casual technical explanation",
  "terminology": [
    {"term": "...", "meaning": "optional gloss", "preferredTranslation": "how to keep this term in the learner locale"}
  ]
}

Terminology rules:
- List domain terms the translator must not mistranslate.
- Keep terms that speakers leave in the original (product names, APIs, titles).`,
        },
        { role: "user", content: transcript },
      ],
    });
    const parsed = asRecord(parseModelJson(completion.choices[0]?.message?.content));
    return {
      topic: asString(parsed?.topic) || "video",
      domain: asString(parsed?.domain) || "general",
      summary: asString(parsed?.summary) || fallbackContext(segments).summary,
      speakerStyle: asString(parsed?.speakerStyle) || "spoken",
      terminology: parseTerms(parsed?.terminology),
    };
  } catch (error) {
    console.error("[video-context]", error);
    return fallbackContext(segments);
  }
}
