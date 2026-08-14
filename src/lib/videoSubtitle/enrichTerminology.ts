import { VideoPipelineError } from "@/lib/videoSubtitle/errors";
import { chatModel, getOpenAIClient } from "@/lib/videoSubtitle/openaiClient";
import { asRecord, asString, parseModelJson } from "@/lib/videoSubtitle/parseModelJson";
import type { VideoContext, VideoContextTerm } from "@/lib/videoSubtitle/types";

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

/**
 * Lightweight glossary pass so technical videos keep consistent terms.
 * Skipped when context already has terminology.
 */
export async function enrichTerminology(
  context: VideoContext,
  lines: string[],
): Promise<VideoContext> {
  if (context.terminology.length > 0) return context;
  const sample = lines.join("\n").slice(0, 8000);
  if (sample.trim().length < 40) return context;

  const client = getOpenAIClient();
  if (!client) throw new VideoPipelineError("MISSING_OPENAI_KEY");

  try {
    const completion = await client.chat.completions.create({
      model: chatModel(),
      temperature: 0,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `Extract domain terms that a Korean subtitle should keep consistent.
Prefer practitioner loanwords (React, hook, API, repository, deployment, runtime, Server Component, framework).
Do not invent terms. If unsure, omit.
Also refine topic/domain/speakerStyle if obvious.

Return JSON:
{
  "topic": "...",
  "domain": "...",
  "speakerStyle": "...",
  "terminology":[{"term":"...","preferredTranslation":"keep as-is or Korean usual form","meaning":"optional"}]
}`,
        },
        { role: "user", content: sample },
      ],
    });
    const parsed = asRecord(parseModelJson(completion.choices[0]?.message?.content));
    return {
      topic: asString(parsed?.topic) || context.topic,
      domain: asString(parsed?.domain) || context.domain,
      summary: context.summary,
      speakerStyle: asString(parsed?.speakerStyle) || context.speakerStyle,
      terminology: parseTerms(parsed?.terminology),
    };
  } catch (error) {
    console.error("[video-terminology]", error);
    return context;
  }
}
