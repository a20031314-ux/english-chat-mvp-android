import { NextRequest } from "next/server";
import { chatModel, getOpenAIClient } from "@/lib/server/openai";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import {
  ENGLISH_ANALYSIS_LANGUAGES,
  normalizeEnglishInputAnalysis,
} from "@/lib/englishAnalysis";
import { englishOverviewSystem } from "@/lib/englishAnalysisPrompt";
import {
  adaptiveOverviewSystem,
  mapAdaptiveSentenceToEnglishInput,
  normalizeAdaptiveSentenceAnalysis,
} from "@/lib/adaptiveLanguageAnalysis";
import { asLearnerLevel } from "@/lib/languageAnalysisPrompt";
import { asTranslationSourceType } from "@/lib/naturalTranslation";
import {
  coerceLanguageCode,
  learningLanguageName,
} from "@/lib/learningLanguages";

export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request);
}

export async function POST(request: NextRequest) {
  const openai = getOpenAIClient();
  if (!openai) {
    return jsonWithCors(request, { error: "MISSING_OPENAI_KEY" }, { status: 503 });
  }

  let body: {
    text?: unknown;
    locale?: unknown;
    interfaceLanguage?: unknown;
    targetLanguage?: unknown;
    sourceType?: unknown;
    language?: unknown;
    learnerLevel?: unknown;
    context?: unknown;
    paragraph?: unknown;
    previousContext?: unknown;
    nextContext?: unknown;
    translation?: unknown;
    analysisTranslation?: unknown;
  };
  try {
    body = await request.json();
  } catch {
    return jsonWithCors(request, { error: "Invalid JSON" }, { status: 400 });
  }

  const text =
    typeof body.text === "string" ? body.text.replace(/\s+/g, " ").trim() : "";
  if (!text || text.length > 800) {
    return jsonWithCors(request, { error: "text required" }, { status: 400 });
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
  const sourceType = asTranslationSourceType(body.sourceType);
  const learnerLevel = asLearnerLevel(body.learnerLevel);
  const languageHint =
    typeof body.language === "string" && body.language.trim()
      ? body.language.trim()
      : learningLanguageName(targetLanguage);
  const paragraph =
    typeof body.paragraph === "string"
      ? body.paragraph.replace(/\s+/g, " ").trim().slice(0, 1200)
      : "";
  const previousContext =
    typeof body.previousContext === "string"
      ? body.previousContext.replace(/\s+/g, " ").trim()
      : "";
  const nextContext =
    typeof body.nextContext === "string"
      ? body.nextContext.replace(/\s+/g, " ").trim()
      : "";

  const useEnglishPipeline = targetLanguage === "en";

  try {
    const completion = await openai.chat.completions.create({
      model: chatModel(),
      messages: [
        {
          role: "system",
          content: useEnglishPipeline
            ? englishOverviewSystem({
                locale,
                interfaceLanguage,
                sourceType,
                learnerLevel,
              })
            : adaptiveOverviewSystem({
                locale,
                interfaceLanguage,
                targetLanguage,
                sourceType,
                learnerLevel,
                languageHint,
              }),
        },
        {
          role: "user",
          content: JSON.stringify({
            text,
            languageHint,
            targetLanguage,
            ...(learnerLevel ? { learnerLevel } : {}),
            ...(previousContext ? { previousContext } : {}),
            ...(nextContext ? { nextContext } : {}),
            ...(paragraph && paragraph !== text ? { paragraph } : {}),
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
      temperature: 0.3,
    });
    const raw = completion.choices[0]?.message?.content;
    if (!raw) {
      return jsonWithCors(request, { error: "empty completion" }, { status: 500 });
    }
    const parsed = JSON.parse(raw);

    if (useEnglishPipeline) {
      const analysis = normalizeEnglishInputAnalysis(parsed, text);
      if (!analysis) {
        return jsonWithCors(request, { error: "empty analysis" }, { status: 500 });
      }
      return jsonWithCors(request, analysis);
    }

    const adaptive = normalizeAdaptiveSentenceAnalysis(parsed, text);
    if (!adaptive) {
      return jsonWithCors(request, { error: "empty analysis" }, { status: 500 });
    }
    return jsonWithCors(request, mapAdaptiveSentenceToEnglishInput(adaptive));
  } catch (error) {
    console.error("[english-analysis/input]", error);
    return jsonWithCors(request, { error: "ANALYSIS_FAILED" }, { status: 500 });
  }
}
