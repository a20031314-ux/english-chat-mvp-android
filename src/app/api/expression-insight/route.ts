import { NextRequest } from "next/server";
import { chatModel, getOpenAIClient } from "@/lib/server/openai";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import {
  mapSentenceSpanToExpressionInsight,
  selectionFitsSentence,
} from "@/lib/expressionInsight";
import {
  ANALYSIS_LANGUAGES,
  asLearnerLevel,
} from "@/lib/languageAnalysisPrompt";
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
    sentence?: unknown;
    selected?: unknown;
    context?: unknown;
    locale?: unknown;
    interfaceLanguage?: unknown;
    targetLanguage?: unknown;
    language?: unknown;
    learnerLevel?: unknown;
  };
  try {
    body = await request.json();
  } catch {
    return jsonWithCors(request, { error: "Invalid JSON" }, { status: 400 });
  }

  const sentence =
    typeof body.sentence === "string" ? body.sentence.replace(/\s+/g, " ").trim() : "";
  const selected =
    typeof body.selected === "string" ? body.selected.replace(/\s+/g, " ").trim() : "";
  if (!sentence || !selected || !selectionFitsSentence(sentence, selected)) {
    return jsonWithCors(request, { error: "selection required" }, { status: 400 });
  }

  const locale =
    typeof body.locale === "string" && body.locale in ANALYSIS_LANGUAGES
      ? body.locale
      : "ko";
  const interfaceLanguage =
    typeof body.interfaceLanguage === "string" &&
    body.interfaceLanguage in ANALYSIS_LANGUAGES
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

  try {
    const completion = await openai.chat.completions.create({
      model: chatModel(),
      messages: [
        {
          role: "system",
          content: buildSentenceSpanPrompt({
            sentence,
            spanText: selected,
            language: targetLanguage,
            nativeLanguage: interfaceLanguage,
            explanationLanguage: interfaceLanguage,
            ...(learnerLevel ? { learnerLevel } : {}),
          }),
        },
        {
          role: "user",
          content: JSON.stringify({
            selectedText: selected,
            contextSentence: sentence,
            ...(context.length ? { context } : {}),
            languageHint,
            targetLanguage,
            ...(learnerLevel ? { learnerLevel } : {}),
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
    const span = parseSentenceSpanAnalysis(JSON.parse(raw), {
      sentence,
      spanText: selected,
      language: targetLanguage,
    });
    if (!span) {
      return jsonWithCors(request, { error: "empty insight" }, { status: 500 });
    }
    return jsonWithCors(request, mapSentenceSpanToExpressionInsight(span, interfaceLanguage));
  } catch (error) {
    console.error("[expression-insight]", error);
    return jsonWithCors(request, { error: "INSIGHT_FAILED" }, { status: 500 });
  }
}
