import OpenAI from "openai";
import { NextRequest } from "next/server";
import { FREE_DAILY_REPORT_LIMIT } from "@/lib/billing/config";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import {
  getDailyReportsUsed,
  incrementDailyReportsUsed,
} from "@/lib/server/entitlementStore";
import { isPremiumClientRequest } from "@/lib/server/premiumRequest";
import {
  normalizeConversationAnalysis,
  type AnalysisTurn,
} from "@/lib/conversationAnalysis";

const MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

const OUTPUT_LANGUAGES: Record<string, string> = {
  ko: "Korean (한국어)",
  en: "English",
  es: "Spanish",
  ja: "Japanese",
  zh: "Simplified Chinese",
  vi: "Vietnamese",
  fr: "French",
  pt: "Portuguese",
  id: "Indonesian",
};

function getClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  return new OpenAI({ apiKey });
}

function requestUserId(request: NextRequest) {
  return request.cookies.get("ec_uid")?.value ?? "local-anonymous";
}

function asTurns(value: unknown): AnalysisTurn[] {
  if (!Array.isArray(value)) return [];
  const turns: AnalysisTurn[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object") continue;
    const o = item as Record<string, unknown>;
    const user = typeof o.user === "string" ? o.user.trim() : "";
    if (!user) continue;
    const assistant =
      typeof o.assistant === "string" ? o.assistant.trim() : "";
    turns.push(assistant ? { user, assistant } : { user });
    if (turns.length >= 40) break;
  }
  return turns;
}

function buildSystem(locale: string) {
  const language = OUTPUT_LANGUAGES[locale] ?? OUTPUT_LANGUAGES.ko;
  return `You are an English conversation coach reviewing ONE learner's chat.

Write title, analysis, suggestion, and nextGoal fields in ${language}.
Keep evidence and example in English, copied or newly invented as specified.

The only subject is the person who wrote the numbered lines.
Never analyze a tutor/AI. Never quote tutor questions. Never write "AI가…", "the AI asked…", LEARNER, USER, or TUTOR.

This is NOT grammar correction. Do not list errors or rewrite "wrong → right".
Ask: How did this person use English in this conversation?

Return at least 2 insights whenever the learner wrote one or more full English sentences.
Every insight MUST include evidence copied EXACTLY from a numbered learner line.
Explain WHY that line matters: nuance, tone, collocation, flow, or conversation strategy.
Do not give abstract praise like "you expressed your thoughts well" without quoting a line and naming the phrase.
If the learner used a reaction + extra thought (e.g. "That sounds like great advice! Taking breaks can really help with focus."), analyze that as a strength.

Look for real strengths too: natural chunks, nuance, word choice, tone, connection words, good questions, expanding an idea.
Also look for grounded improvements: expand an opinion, soften tone, vary openers, take the lead with a question.
A grammatically correct line is never an "error". Softer wording is a tone/nuance suggestion.

Categories — pick only what the chat actually shows. Do not fill every category:
NATURAL, NUANCE, WORD_CHOICE, TONE, FLOW, VARIETY, CONNECTION, EXPRESSION, CONVERSATION, IMPROVEMENT

Do not call a simple correct sentence "native-like" (e.g. "I like traveling.").
Reserve NATURAL for real conversational chunks such as "I haven't really thought about it that way."
A habit needs the same learner pattern at least 3 times.
Do not invent problems. Keep each analysis to 2–4 short sentences.
3–5 insights max. Skip a category if there is nothing meaningful.

nextGoal must grow from THIS chat (not generic grammar). Never say "improve sentence structure" or "use correct verb forms".
Give one concrete action, a short explanation, a reusable pattern, and a NEW example related to the same topic.

Return ONLY JSON:
{
  "insights": [
    {
      "category": "NUANCE",
      "sentiment": "positive",
      "title": "",
      "evidence": "exact learner line",
      "analysis": "",
      "suggestion": "optional, for improvement/tone only",
      "example": "optional English example, not framed as a grammar fix"
    }
  ],
  "nextGoal": {
    "title": "",
    "body": "",
    "pattern": "I think ___ because ___.",
    "example": "I think working from home is better because I can concentrate more easily."
  },
  "shortConversationNote": "only if the chat is too short to judge habits, else empty"
}`;
}

export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request);
}

export async function POST(request: NextRequest) {
  const userId = requestUserId(request);
  const isPremium = isPremiumClientRequest(request);

  if (
    !isPremium &&
    getDailyReportsUsed(userId) >= FREE_DAILY_REPORT_LIMIT
  ) {
    return jsonWithCors(
      request,
      { error: "REPORT_DAILY_LIMIT_REACHED" },
      { status: 403 },
    );
  }

  const openai = getClient();
  if (!openai) {
    return jsonWithCors(request, { error: "MISSING_OPENAI_KEY" }, { status: 503 });
  }

  let body: { locale?: string; turns?: unknown };
  try {
    body = await request.json();
  } catch {
    return jsonWithCors(request, { error: "Invalid JSON" }, { status: 400 });
  }

  const turns = asTurns(body.turns);
  if (turns.length === 0) {
    return jsonWithCors(request, { error: "turns required" }, { status: 400 });
  }

  const locale =
    typeof body.locale === "string" && body.locale in OUTPUT_LANGUAGES
      ? body.locale
      : "ko";

  const transcript = [
    "Analyze ONLY these learner utterances. Tutor replies are omitted on purpose.",
    ...turns.map((turn, index) => `${index + 1}. ${turn.user}`),
  ].join("\n");

  try {
    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: buildSystem(locale) },
        { role: "user", content: transcript },
      ],
      response_format: { type: "json_object" },
      temperature: 0.4,
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) {
      return jsonWithCors(request, { error: "empty completion" }, { status: 500 });
    }

    const parsed: unknown = JSON.parse(raw);
    const analysis = normalizeConversationAnalysis(parsed, turns);
    if (!analysis) {
      return jsonWithCors(request, { error: "empty analysis" }, { status: 500 });
    }

    if (!isPremium) {
      incrementDailyReportsUsed(userId);
    }

    return jsonWithCors(request, analysis);
  } catch (error) {
    console.error("[report-analysis]", error);
    return jsonWithCors(request, { error: "ANALYSIS_FAILED" }, { status: 500 });
  }
}
