import OpenAI from "openai";
import { NextRequest } from "next/server";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { spokenTranslateSystem } from "@/lib/spokenTranslate";

const MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

const TARGET_LANGUAGES: Record<string, string> = {
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

function getClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new OpenAI({ apiKey });
}

export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request);
}

export async function POST(request: NextRequest) {
  const client = getClient();
  if (!client) {
    return jsonWithCors(request, { error: "MISSING_OPENAI_KEY" }, { status: 503 });
  }

  let body: { text?: string; locale?: string };
  try {
    body = await request.json();
  } catch {
    return jsonWithCors(request, { error: "Invalid JSON" }, { status: 400 });
  }

  const text = body.text?.trim();
  if (!text) {
    return jsonWithCors(request, { error: "text required" }, { status: 400 });
  }

  const locale =
    typeof body.locale === "string" && body.locale in TARGET_LANGUAGES
      ? body.locale
      : "ko";

  try {
    const completion = await client.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: spokenTranslateSystem(locale),
        },
        { role: "user", content: text },
      ],
      response_format: { type: "json_object" },
      temperature: 0.35,
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) {
      return jsonWithCors(request, { error: "Empty model response" }, { status: 502 });
    }

    const parsed = JSON.parse(raw) as { translated?: string };
    const translated =
      typeof parsed.translated === "string" && parsed.translated.trim() !== ""
        ? parsed.translated.trim()
        : text;

    return jsonWithCors(request, { translated });
  } catch (error) {
    console.error("[translate]", error);
    return jsonWithCors(request, { error: "TRANSLATION_FAILED" }, { status: 500 });
  }
}
