import OpenAI from "openai";
import { NextRequest } from "next/server";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import {
  normalizeExpressionInsight,
  selectionFitsSentence,
} from "@/lib/expressionInsight";
import {
  ANALYSIS_LANGUAGES,
  asLearnerLevel,
  languageElementSystem,
} from "@/lib/languageAnalysisPrompt";

const MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

function getClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  return new OpenAI({ apiKey });
}

export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request);
}

export async function POST(request: NextRequest) {
  const openai = getClient();
  if (!openai) {
    return jsonWithCors(request, { error: "MISSING_OPENAI_KEY" }, { status: 503 });
  }

  let body: {
    sentence?: unknown;
    selected?: unknown;
    context?: unknown;
    locale?: unknown;
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
  const learnerLevel = asLearnerLevel(body.learnerLevel);
  const languageHint =
    typeof body.language === "string" ? body.language.trim() : "";
  const context = Array.isArray(body.context)
    ? body.context
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.trim())
        .filter(Boolean)
        .slice(-6)
    : [];

  try {
    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: languageElementSystem({
            locale,
            sourceType: "conversation",
            learnerLevel,
            ...(languageHint ? { languageHint } : {}),
          }),
        },
        {
          role: "user",
          content: JSON.stringify({
            selectedText: selected,
            contextSentence: sentence,
            ...(context.length ? { context } : {}),
            ...(languageHint ? { languageHint } : {}),
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
    const insight = normalizeExpressionInsight(JSON.parse(raw), selected);
    if (!insight) {
      return jsonWithCors(request, { error: "empty insight" }, { status: 500 });
    }
    return jsonWithCors(request, insight);
  } catch (error) {
    console.error("[expression-insight]", error);
    return jsonWithCors(request, { error: "INSIGHT_FAILED" }, { status: 500 });
  }
}
