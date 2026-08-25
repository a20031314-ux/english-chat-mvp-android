import { NextRequest } from "next/server";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { coerceLanguageCode } from "@/lib/learningLanguages";
import { completeDimensionPrompt } from "@/lib/salience/llm";
import { analyzeRecommendedSpan } from "@/lib/salience/pipeline";
import { getOpenAIClient } from "@/lib/videoSubtitle/openaiClient";

export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request);
}

export async function POST(request: NextRequest) {
  if (!getOpenAIClient()) {
    return jsonWithCors(request, { error: "MISSING_OPENAI_KEY" }, { status: 503 });
  }

  let body: {
    sentence?: unknown;
    language?: unknown;
    nativeLanguage?: unknown;
    explanationLanguage?: unknown;
    translation?: unknown;
    originalText?: unknown;
    tokenRange?: unknown;
    signalTags?: unknown;
    salienceReason?: unknown;
  };
  try {
    body = await request.json();
  } catch {
    return jsonWithCors(request, { error: "Invalid JSON" }, { status: 400 });
  }

  const sentence =
    typeof body.sentence === "string" ? body.sentence.replace(/\s+/g, " ").trim() : "";
  const originalText =
    typeof body.originalText === "string"
      ? body.originalText.replace(/\s+/g, " ").trim()
      : "";
  const range =
    body.tokenRange && typeof body.tokenRange === "object"
      ? (body.tokenRange as { start?: unknown; end?: unknown })
      : null;
  const start = typeof range?.start === "number" ? range.start : NaN;
  const end = typeof range?.end === "number" ? range.end : NaN;
  if (!sentence || !originalText || !Number.isFinite(start) || !Number.isFinite(end)) {
    return jsonWithCors(request, { error: "span required" }, { status: 400 });
  }

  const language = coerceLanguageCode(body.language);
  const nativeLanguage =
    typeof body.nativeLanguage === "string" && body.nativeLanguage.trim()
      ? body.nativeLanguage.trim()
      : "ko";
  const explanationLanguage =
    typeof body.explanationLanguage === "string" && body.explanationLanguage.trim()
      ? body.explanationLanguage.trim()
      : nativeLanguage;
  const signalTags = Array.isArray(body.signalTags)
    ? body.signalTags.filter((tag): tag is string => typeof tag === "string")
    : [];
  const salienceReason =
    typeof body.salienceReason === "string" ? body.salienceReason.trim() : "";
  const translation =
    typeof body.translation === "string" ? body.translation.trim() : "";

  try {
    const analysis = await analyzeRecommendedSpan({
      sentence,
      language,
      nativeLanguage,
      explanationLanguage,
      translation,
      candidate: {
        tokenRange: { start, end },
        originalText,
        linguisticScore: 0,
        sourceExpressionScore: 0,
        signalTags,
        totalScore: 0,
        salienceReason,
        charStart: 0,
        charEnd: 0,
      },
      callDimension: completeDimensionPrompt,
    });
    return jsonWithCors(request, analysis);
  } catch (error) {
    console.error("[salience/analyze]", error);
    return jsonWithCors(request, { error: "ANALYSIS_FAILED" }, { status: 500 });
  }
}
