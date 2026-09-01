import { NextRequest } from "next/server";
import { chatModel, getOpenAIClient } from "@/lib/server/openai";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import {
  ENGLISH_ANALYSIS_LANGUAGES,
  mapSentenceSpanToEnglishElement,
} from "@/lib/englishAnalysis";
import { asLearnerLevel } from "@/lib/languageAnalysisPrompt";
import {
  coerceLanguageCode,
  learningLanguageName,
} from "@/lib/learningLanguages";
import {
  buildSentenceSpanPrompt,
  parseSentenceSpanAnalysis,
} from "@/lib/salience/sentenceSpanPrompt";

export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request);
}

export async function POST(request: NextRequest) {
  const openai = getOpenAIClient();
  if (!openai) {
    return jsonWithCors(request, { error: "MISSING_OPENAI_KEY" }, { status: 503 });
  }

  let body: {
    selectedText?: unknown;
    contextSentence?: unknown;
    context?: unknown;
    locale?: unknown;
    interfaceLanguage?: unknown;
    targetLanguage?: unknown;
    sourceType?: unknown;
    language?: unknown;
    learnerLevel?: unknown;
    translation?: unknown;
    analysisTranslation?: unknown;
  };
  try {
    body = await request.json();
  } catch {
    return jsonWithCors(request, { error: "Invalid JSON" }, { status: 400 });
  }

  const selectedText =
    typeof body.selectedText === "string"
      ? body.selectedText.replace(/\s+/g, " ").trim()
      : "";
  const contextSentence =
    typeof body.contextSentence === "string"
      ? body.contextSentence.replace(/\s+/g, " ").trim()
      : "";
  if (
    !selectedText ||
    !contextSentence ||
    selectedText.length > 200 ||
    contextSentence.length > 800
  ) {
    return jsonWithCors(request, { error: "selection required" }, { status: 400 });
  }

  const locale =
    typeof body.locale === "string" && body.locale in ENGLISH_ANALYSIS_LANGUAGES
      ? body.locale
      : "ko";
  const interfaceLanguage =
    typeof body.interfaceLanguage === "string" &&
    body.interfaceLanguage in ENGLISH_ANALYSIS_LANGUAGES
      ? body.interfaceLanguage
      : locale;
  const targetLanguage = coerceLanguageCode(body.targetLanguage);
  const learnerLevel = asLearnerLevel(body.learnerLevel);
  const languageHint =
    typeof body.language === "string" && body.language.trim()
      ? body.language.trim()
      : learningLanguageName(targetLanguage);
  const context = Array.isArray(body.context)
    ? body.context
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.trim())
        .filter(Boolean)
        .slice(-6)
    : [];
  const translation =
    (typeof body.analysisTranslation === "string" &&
      body.analysisTranslation.trim()) ||
    (typeof body.translation === "string" && body.translation.trim()) ||
    "";

  try {
    const completion = await openai.chat.completions.create({
      model: chatModel(),
      messages: [
        {
          role: "system",
          content: buildSentenceSpanPrompt({
            sentence: contextSentence,
            spanText: selectedText,
            language: targetLanguage,
            nativeLanguage: interfaceLanguage,
            explanationLanguage: interfaceLanguage,
            ...(translation ? { translation } : {}),
            ...(learnerLevel ? { learnerLevel } : {}),
          }),
        },
        {
          role: "user",
          content: JSON.stringify({
            selectedText,
            contextSentence,
            ...(context.length ? { context } : {}),
            languageHint,
            targetLanguage,
            ...(learnerLevel ? { learnerLevel } : {}),
            ...(typeof body.translation === "string" && body.translation.trim()
              ? { captionTranslation: body.translation.trim() }
              : {}),
            ...(typeof body.analysisTranslation === "string" &&
            body.analysisTranslation.trim()
              ? { analysisTranslation: body.analysisTranslation.trim() }
              : {}),
          }),
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.4,
    });
    const raw = completion.choices[0]?.message?.content;
    if (!raw) {
      return jsonWithCors(request, { error: "empty completion" }, { status: 500 });
    }
    const parsed = JSON.parse(raw);
    const span = parseSentenceSpanAnalysis(parsed, {
      sentence: contextSentence,
      spanText: selectedText,
      language: targetLanguage,
    });
    if (!span) {
      return jsonWithCors(request, { error: "empty analysis" }, { status: 500 });
    }
    return jsonWithCors(
      request,
      mapSentenceSpanToEnglishElement(span, targetLanguage),
    );
  } catch (error) {
    console.error("[english-analysis/element]", error);
    return jsonWithCors(request, { error: "ANALYSIS_FAILED" }, { status: 500 });
  }
}
