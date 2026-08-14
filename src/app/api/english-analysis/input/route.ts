import OpenAI from "openai";
import { NextRequest } from "next/server";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { ENGLISH_ANALYSIS_LANGUAGES, normalizeEnglishInputAnalysis } from "@/lib/englishAnalysis";
import {
  asLearnerLevel,
  languageOverviewSystem,
} from "@/lib/languageAnalysisPrompt";
import { asTranslationSourceType } from "@/lib/naturalTranslation";

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
    text?: unknown;
    locale?: unknown;
    sourceType?: unknown;
    language?: unknown;
    learnerLevel?: unknown;
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
  const sourceType = asTranslationSourceType(body.sourceType);
  const learnerLevel = asLearnerLevel(body.learnerLevel);
  const languageHint =
    typeof body.language === "string" ? body.language.trim() : "";

  try {
    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: languageOverviewSystem({
            locale,
            sourceType,
            learnerLevel,
            ...(languageHint ? { languageHint } : {}),
          }),
        },
        {
          role: "user",
          content: JSON.stringify({
            text,
            ...(languageHint ? { languageHint } : {}),
            ...(learnerLevel ? { learnerLevel } : {}),
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
    const analysis = normalizeEnglishInputAnalysis(JSON.parse(raw), text);
    if (!analysis) {
      return jsonWithCors(request, { error: "empty analysis" }, { status: 500 });
    }
    return jsonWithCors(request, analysis);
  } catch (error) {
    console.error("[english-analysis/input]", error);
    return jsonWithCors(request, { error: "ANALYSIS_FAILED" }, { status: 500 });
  }
}
