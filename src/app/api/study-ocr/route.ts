import { NextRequest } from "next/server";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import {
  coerceLanguageCode,
  learningLanguageName,
} from "@/lib/learningLanguages";
import {
  parseLooseModelJson,
  parseStudyOcrResult,
} from "@/lib/studyMaterials/ocrResult";
import { getOpenAIClient } from "@/lib/videoSubtitle/openaiClient";
import { asRecord } from "@/lib/videoSubtitle/parseModelJson";
import { VISION_MODEL } from "@/lib/videoSubtitle/sceneConfig";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_DATA_URL_CHARS = 3_500_000;

function asImageDataUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed.startsWith("data:image/")) return null;
  if (trimmed.length > MAX_DATA_URL_CHARS) return null;
  if (!/^data:image\/(jpeg|jpg|png|webp|gif);base64,/i.test(trimmed)) {
    return null;
  }
  return trimmed;
}

export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request);
}

export async function POST(request: NextRequest) {
  const client = getOpenAIClient();
  if (!client) {
    return jsonWithCors(request, { error: "MISSING_OPENAI_KEY" }, { status: 503 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return jsonWithCors(request, { error: "Invalid JSON" }, { status: 400 });
  }

  const image = asImageDataUrl(body.image);
  if (!image) {
    return jsonWithCors(request, { error: "INVALID_IMAGE" }, { status: 400 });
  }

  const targetLanguage = coerceLanguageCode(body.targetLanguage);
  const languageName = learningLanguageName(targetLanguage);
  const system = `You find readable text on a poster, photo, worksheet, or screenshot.
The learner is studying ${languageName}.
Copy the written text as faithfully as possible. Keep the original language. Do not translate.
Group nearby words into lines or short phrases. Return at most 40 blocks.
x,y are the top-left of each block; w,h are its size. Use percentages 0-100 of the image.
If there is no readable text, return empty blocks.

Return JSON:
{"title":"short title or empty","blocks":[{"text":"exact text","x":12,"y":8,"w":70,"h":10}]}`;

  const run = async (detail: "high" | "low") => {
    const completion = await client.chat.completions.create({
      model: VISION_MODEL,
      temperature: 0,
      response_format: { type: "json_object" },
      max_tokens: 8000,
      messages: [
        { role: "system", content: system },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Find each text line on this image and return the words plus position.",
            },
            {
              type: "image_url",
              image_url: { url: image, detail },
            },
          ],
        },
      ],
    });
    const parsed = parseLooseModelJson(
      completion.choices[0]?.message?.content,
    );
    return parseStudyOcrResult(asRecord(parsed) ?? parsed);
  };

  try {
    const result = await run("high");
    return jsonWithCors(request, result);
  } catch (error) {
    console.error("[study-ocr]", error);
    return jsonWithCors(request, { error: "OCR_FAILED" }, { status: 502 });
  }
}
