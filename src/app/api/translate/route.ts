import { NextRequest } from "next/server";
import { chatModel, getOpenAIClient } from "@/lib/server/openai";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { meterRequest } from "@/lib/server/meterRequest";
import { spokenTranslateSystem } from "@/lib/spokenTranslate";
import { asTranslationSourceType } from "@/lib/naturalTranslation";
import { coerceLanguageCode, isInterfaceLanguage } from "@/lib/learningLanguages";
import {
  isVideoId,
  keepVideoLine,
  readVideoLine,
  videoLineKey,
} from "@/lib/server/subtitleGlossStore";

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
    videoId?: unknown;
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

  // A subtitle line tapped in the video tab comes with its video's id. The
  // same line of the same video reads the same for the next learner in the
  // same language pair, so it is translated once and kept
  // (server/subtitleGlossStore.ts) rather than paid for by every viewer.
  const lineKey =
    sourceType === "subtitle" && isVideoId(body.videoId)
      ? videoLineKey({
          targetLanguage,
          interfaceLanguage,
          videoId: body.videoId,
          text,
        })
      : null;
  if (lineKey) {
    const kept = await readVideoLine(lineKey);
    if (kept) {
      void meterRequest(request, "translateKept");
      return jsonWithCors(request, { translated: kept });
    }
  }

  await meterRequest(request, "translate");

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

    if (lineKey && translated !== text) void keepVideoLine(lineKey, translated);
    return jsonWithCors(request, { translated });
  } catch (error) {
    console.error("[translate]", error);
    return jsonWithCors(request, { error: "TRANSLATION_FAILED" }, { status: 500 });
  }
}
