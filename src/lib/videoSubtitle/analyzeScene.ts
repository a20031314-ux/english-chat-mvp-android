import { VideoPipelineError } from "@/lib/videoSubtitle/errors";
import { getOpenAIClient } from "@/lib/videoSubtitle/openaiClient";
import { asNumber, asRecord, asString, parseModelJson } from "@/lib/videoSubtitle/parseModelJson";
import { VISION_MODEL } from "@/lib/videoSubtitle/sceneConfig";
import type {
  RepresentativeFrame,
  SceneContext,
  VisualSceneSpan,
} from "@/lib/videoSubtitle/sceneTypes";

function frameDataUrl(frame: RepresentativeFrame): string | null {
  if (!frame.jpeg?.byteLength) return null;
  const mime = frame.mimeType || "image/jpeg";
  return `data:${mime};base64,${frame.jpeg.toString("base64")}`;
}

/**
 * Vision pass: situation for dialogue understanding only — never writes subtitles.
 */
export async function analyzeScene(input: {
  scene: VisualSceneSpan;
  frames: RepresentativeFrame[];
  videoTitle?: string;
}): Promise<SceneContext> {
  const client = getOpenAIClient();
  const base: SceneContext = {
    id: input.scene.id,
    startTime: input.scene.startTime,
    endTime: input.scene.endTime,
  };
  if (!client) return base;

  const images = input.frames
    .map(frameDataUrl)
    .filter((url): url is string => Boolean(url))
    .slice(0, 3);

  if (images.length === 0) {
    return base;
  }

  try {
    const completion = await client.chat.completions.create({
      model: VISION_MODEL,
      temperature: 0.2,
      response_format: { type: "json_object" },
      max_tokens: 400,
      messages: [
        {
          role: "system",
          content: `You analyze video stills only to help understand spoken dialogue later.
Do NOT translate speech. Do NOT invent subtitles.
Describe only what clearly helps answer: what situation is this conversation happening in?
Keep fields short. If unsure, say so (e.g. "unclear", "possibly …"). Do not invent relationships or hidden emotions.

Return JSON:
{
  "setting": "short place/event label",
  "situation": "what appears to be happening",
  "interaction": "how people relate in the frame",
  "mood": "visible atmosphere",
  "visualCues": ["short cue", "..."],
  "confidence": 0.0
}`,
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: JSON.stringify({
                videoTitle: input.videoTitle,
                sceneStart: input.scene.startTime,
                sceneEnd: input.scene.endTime,
              }),
            },
            ...images.map((url) => ({
              type: "image_url" as const,
              image_url: { url, detail: "low" as const },
            })),
          ],
        },
      ],
    });

    const parsed = asRecord(
      parseModelJson(completion.choices[0]?.message?.content),
    );
    const cues = Array.isArray(parsed?.visualCues)
      ? parsed.visualCues
          .map((row) => asString(row))
          .filter((row): row is string => Boolean(row))
          .slice(0, 6)
      : [];

    return {
      ...base,
      setting: asString(parsed?.setting) || undefined,
      situation: asString(parsed?.situation) || undefined,
      interaction: asString(parsed?.interaction) || undefined,
      mood: asString(parsed?.mood) || undefined,
      ...(cues.length ? { visualCues: cues } : {}),
      confidence: asNumber(parsed?.confidence) ?? undefined,
    };
  } catch (error) {
    console.error("[scene-vision]", error);
    return base;
  }
}

export async function analyzeScenesBatch(input: {
  scenes: VisualSceneSpan[];
  frames: RepresentativeFrame[];
  videoTitle?: string;
}): Promise<SceneContext[]> {
  const client = getOpenAIClient();
  if (!client) {
    return input.scenes.map((scene) => ({
      id: scene.id,
      startTime: scene.startTime,
      endTime: scene.endTime,
    }));
  }

  const out: SceneContext[] = [];
  for (const scene of input.scenes) {
    const frames = input.frames.filter((frame) => frame.sceneId === scene.id);
    out.push(
      await analyzeScene({
        scene,
        frames,
        videoTitle: input.videoTitle,
      }),
    );
  }
  return out;
}

/** Thrown only for missing key when caller wants hard fail — vision itself soft-fails. */
export function requireOpenAI(): void {
  if (!getOpenAIClient()) throw new VideoPipelineError("MISSING_OPENAI_KEY");
}
