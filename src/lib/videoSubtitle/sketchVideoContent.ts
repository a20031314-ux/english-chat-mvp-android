import { VideoPipelineError } from "@/lib/videoSubtitle/errors";
import { chatModel, getOpenAIClient } from "@/lib/videoSubtitle/openaiClient";
import { asRecord, asString, parseModelJson } from "@/lib/videoSubtitle/parseModelJson";
import type { NormalizedSegment, VideoContext } from "@/lib/videoSubtitle/types";

/** Sample opening / middle / later lines so situation sketch follows the whole flow. */
function sampleDialogueAcross(
  segments: NormalizedSegment[],
  maxChars = 2800,
): string {
  if (segments.length === 0) return "";
  if (segments.length <= 30) {
    return segments
      .map((segment) => segment.normalizedText)
      .join("\n")
      .slice(0, maxChars);
  }
  const mid = Math.floor(segments.length / 2);
  const picks = [
    ...segments.slice(0, 12),
    ...segments.slice(Math.max(12, mid - 6), mid + 6),
    ...segments.slice(-10),
  ];
  const seen = new Set<string>();
  const lines: string[] = [];
  for (const segment of picks) {
    if (seen.has(segment.id)) continue;
    seen.add(segment.id);
    lines.push(segment.normalizedText);
  }
  return lines.join("\n").slice(0, maxChars);
}

/**
 * Fast text sketch from title + dialogue samples across the transcript (no vision).
 * e.g. "Spider-Man trailer about …"
 */
export async function sketchVideoContent(input: {
  title?: string;
  segments: NormalizedSegment[];
}): Promise<VideoContext> {
  const client = getOpenAIClient();
  const sample = sampleDialogueAcross(input.segments);

  const fallback: VideoContext = {
    topic: input.title?.slice(0, 80) || "video",
    domain: "general",
    summary: sample.slice(0, 280) || input.title || "Spoken video.",
    speakerStyle: "spoken",
    terminology: [],
  };

  if (!client) {
    if (!getOpenAIClient()) {
      // soft
    }
    return fallback;
  }

  try {
    const completion = await client.chat.completions.create({
      model: chatModel(),
      temperature: 0.3,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `Quickly identify what this whole video is (type + content), from title and dialogue samples (opening + later lines).
Be free and concise. Capture the overall subject so later captions stay consistent across the video.

Return JSON:
{
  "topic": "short label",
  "domain": "trailer|interview|tutorial|vlog|drama|other",
  "summary": "1-3 sentences: what this video is about overall and what seems to be happening",
  "speakerStyle": "how people talk / vibe"
}`,
        },
        {
          role: "user",
            content: JSON.stringify({
            title: input.title,
            dialogueSample: sample,
          }),
        },
      ],
    });
    const parsed = asRecord(parseModelJson(completion.choices[0]?.message?.content));
    return {
      topic: asString(parsed?.topic) || fallback.topic,
      domain: asString(parsed?.domain) || fallback.domain,
      summary: asString(parsed?.summary) || fallback.summary,
      speakerStyle: asString(parsed?.speakerStyle) || fallback.speakerStyle,
      terminology: [],
    };
  } catch (error) {
    console.error("[video-sketch]", error);
    return fallback;
  }
}

export function assertOpenAI(): void {
  if (!getOpenAIClient()) throw new VideoPipelineError("MISSING_OPENAI_KEY");
}
