import { NextRequest } from "next/server";
import { chatModel, getOpenAIClient } from "@/lib/server/openai";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import {
  fallbackLearningSpans,
  normalizeLearningSpans,
} from "@/lib/learningSpans";
import { learningSpansSystem } from "@/lib/learningSpansPrompt";
import {
  coerceLanguageCode,
  learningLanguageName,
} from "@/lib/learningLanguages";
import { ANALYSIS_LANGUAGES } from "@/lib/languageAnalysisPrompt";

function sentenceLooksValid(sentence: string, targetLanguage: string) {
  if (!sentence || sentence.length > 500) return false;
  if (
    targetLanguage === "ja" ||
    targetLanguage === "zh" ||
    targetLanguage === "ko" ||
    targetLanguage === "th" ||
    targetLanguage === "ar" ||
    targetLanguage === "hi"
  ) {
    return true;
  }
  if (targetLanguage === "ru") {
    return /[A-Za-zА-Яа-яЁё]/.test(sentence);
  }
  return /[\p{L}]/u.test(sentence);
}

export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request);
}

export async function POST(request: NextRequest) {
  let body: {
    sentence?: unknown;
    targetLanguage?: unknown;
    interfaceLanguage?: unknown;
  };
  try {
    body = await request.json();
  } catch {
    return jsonWithCors(request, { error: "Invalid JSON" }, { status: 400 });
  }

  const sentence =
    typeof body.sentence === "string"
      ? body.sentence.replace(/\s+/g, " ").trim()
      : "";
  const targetLanguage = coerceLanguageCode(body.targetLanguage);
  const interfaceLanguage =
    typeof body.interfaceLanguage === "string" &&
    body.interfaceLanguage in ANALYSIS_LANGUAGES
      ? body.interfaceLanguage
      : "ko";

  // English keeps the existing tokenizer / idiom pipeline.
  if (targetLanguage === "en" || !sentenceLooksValid(sentence, targetLanguage)) {
    return jsonWithCors(request, { spans: [] });
  }

  const fallback = fallbackLearningSpans(sentence);
  const openai = getOpenAIClient();
  if (!openai) {
    return jsonWithCors(request, { spans: fallback });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: chatModel(),
      messages: [
        {
          role: "system",
          content: learningSpansSystem({
            targetLanguage,
            interfaceLanguage,
          }),
        },
        {
          role: "user",
          content: JSON.stringify({
            sentence,
            targetLanguage,
            language: learningLanguageName(targetLanguage),
          }),
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.2,
    });
    const raw = completion.choices[0]?.message?.content;
    if (!raw) {
      return jsonWithCors(request, { spans: fallback });
    }
    const spans = normalizeLearningSpans(JSON.parse(raw), sentence);
    return jsonWithCors(request, {
      spans: spans.length > 0 ? spans : fallback,
    });
  } catch (error) {
    console.error("[learning-spans]", error);
    return jsonWithCors(request, { spans: fallback });
  }
}
