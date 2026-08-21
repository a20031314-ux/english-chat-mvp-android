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

const OCR_MODEL = process.env.OPENAI_OCR_MODEL?.trim() || "gpt-4o";

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
  const system = `You read a photo of a textbook page, poster, worksheet, or screenshot.
The learner is studying ${languageName}.
Look at the ENTIRE image. Your only job is to list every complete SENTENCE.

Rules:
- One array item = one complete sentence.
- If a sentence wraps onto the next line, keep it as ONE item.
- If two sentences are on the same line, they are TWO items.
- Do not split on abbreviations like Mr. Dr. p.m. a.m. U.S. etc. unless a new sentence really starts.
- Headings, titles, and short labels may be their own items.
- Copy the original language faithfully. Do not translate.
- Skip photos, clocks, and decorations that are not readable study text.
- Do not return coordinates or bounding boxes.

Return JSON:
{"title":"short title or empty","sentences":["First complete sentence.","Second complete sentence."]}`;

  const run = async (model: string) => {
    const completion = await client.chat.completions.create({
      model,
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
              text: "Read the whole page. Return each complete sentence as its own item. Do not guess word positions.",
            },
            {
              type: "image_url",
              image_url: { url: image, detail: "high" },
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
    const result = await run(OCR_MODEL);
    return jsonWithCors(request, result);
  } catch (error) {
    if (OCR_MODEL !== VISION_MODEL) {
      try {
        const result = await run(VISION_MODEL);
        return jsonWithCors(request, result);
      } catch (fallbackError) {
        console.error("[study-ocr]", fallbackError);
      }
    }
    console.error("[study-ocr]", error);
    return jsonWithCors(request, { error: "OCR_FAILED" }, { status: 502 });
  }
}
