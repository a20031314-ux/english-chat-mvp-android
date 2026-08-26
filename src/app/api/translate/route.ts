import { NextRequest } from "next/server";
import { chatModel, getOpenAIClient } from "@/lib/server/openai";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { spokenTranslateSystem } from "@/lib/spokenTranslate";
import { asTranslationSourceType } from "@/lib/naturalTranslation";
import { coerceLanguageCode, isInterfaceLanguage } from "@/lib/learningLanguages";

export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request);
}

export async function POST(request: NextRequest) {
  const client = getOpenAIClient();
  if (!client) {
    return jsonWithCors(request, { error: "MISSING_OPENAI_KEY" }, { status: 503 });
  }

  let body: {
    text?: string;
    locale?: string;
    interfaceLanguage?: string;
    targetLanguage?: string;
    context?: unknown;
    sourceType?: unknown;
  };
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
    typeof body.locale === "string" && isInterfaceLanguage(body.locale)
      ? body.locale
      : "ko";
  const interfaceLanguage =
    typeof body.interfaceLanguage === "string" &&
    isInterfaceLanguage(body.interfaceLanguage)
      ? body.interfaceLanguage
      : locale;
  const targetLanguage = coerceLanguageCode(body.targetLanguage);
  const sourceType = asTranslationSourceType(body.sourceType);
  const context = Array.isArray(body.context)
    ? body.context
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.replace(/\s+/g, " ").trim())
        .filter(Boolean)
        .slice(-6)
    : [];

  try {
    const completion = await client.chat.completions.create({
      model: chatModel(),
      messages: [
        {
          role: "system",
          content: spokenTranslateSystem({
            locale,
            interfaceLanguage,
            targetLanguage,
            sourceType,
          }),
        },
        {
          role: "user",
          content: JSON.stringify({
            text,
            ...(context.length ? { context } : {}),
          }),
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.4,
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
