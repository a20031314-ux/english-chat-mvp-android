import { NextRequest } from "next/server";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { asLearnerLevel } from "@/lib/languageAnalysisPrompt";
import { asTranslationSourceType } from "@/lib/naturalTranslation";
import { coerceLanguageCode } from "@/lib/learningLanguages";
import { completeJsonPrompt } from "@/lib/salience/llm";
import { DEFAULT_TOP_N, recommendSalience } from "@/lib/salience/pipeline";
import { getOpenAIClient } from "@/lib/videoSubtitle/openaiClient";

export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request);
}

export async function POST(request: NextRequest) {
  let body: {
    sentence?: unknown;
    language?: unknown;
    nativeLanguage?: unknown;
    sourceType?: unknown;
    learnerLevel?: unknown;
    topN?: unknown;
  };
  try {
    body = await request.json();
  } catch {
    return jsonWithCors(request, { error: "Invalid JSON" }, { status: 400 });
  }

  const sentence =
    typeof body.sentence === "string" ? body.sentence.replace(/\s+/g, " ").trim() : "";
  if (!sentence || sentence.length > 800) {
    return jsonWithCors(request, { error: "sentence required" }, { status: 400 });
  }

  const language = coerceLanguageCode(body.language);
  const nativeLanguage =
    typeof body.nativeLanguage === "string" && body.nativeLanguage.trim()
      ? body.nativeLanguage.trim()
      : "ko";
  const sourceType = asTranslationSourceType(body.sourceType);
  const learnerLevel = asLearnerLevel(body.learnerLevel) ?? "intermediate";
  const topN =
    typeof body.topN === "number" && Number.isFinite(body.topN)
      ? Math.max(1, Math.min(6, Math.round(body.topN)))
      : DEFAULT_TOP_N;

  const hasLlm = Boolean(getOpenAIClient());
  try {
    const result = await recommendSalience({
      sentence,
      language,
      nativeLanguage,
      sourceType,
      learnerLevel,
      topN,
      ...(hasLlm
        ? {
            sourceExpressionJson: completeJsonPrompt,
            rankJson: completeJsonPrompt,
          }
        : {}),
    });
    return jsonWithCors(request, {
      sourceContext: result.sourceContext,
      recommendations: result.recommendations,
    });
  } catch (error) {
    console.error("[salience/recommend]", error);
    return jsonWithCors(request, { error: "SALIENCE_FAILED" }, { status: 500 });
  }
}
