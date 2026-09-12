import { NextRequest } from "next/server";
import { coerceLanguageCode, interfaceLanguageName } from "@/lib/learningLanguages";
import { findScenario } from "@/lib/roleplay/catalog";
import { readSpokenLines } from "@/lib/roleplay/director";
import { parseReview, reviewPrompt, type StuckTurn } from "@/lib/roleplay/review";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { meterRequest } from "@/lib/server/meterRequest";
import { getOpenAIClient } from "@/lib/server/openai";

export const dynamic = "force-dynamic";

/**
 * The model that looks back at a turn the learner got stuck on.
 *
 * A better one than the scene itself uses, on purpose. Nothing is waiting on
 * this — the conversation carried on without it, and the learner asked for it
 * knowing they were stopping to read — so the second or two it takes is spent
 * where judgement actually pays: working out whether they missed the question,
 * missed the words, or simply answered slowly.
 */
function reviewModel(): string {
  return process.env.OPENAI_REVIEW_MODEL?.trim() || "gpt-5-mini";
}

export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request);
}

function readCount(raw: unknown): number {
  return typeof raw === "number" && Number.isFinite(raw) && raw > 0 ? Math.floor(raw) : 0;
}

export async function POST(request: NextRequest) {
  const client = getOpenAIClient();
  if (!client) {
    return jsonWithCors(request, { error: "MISSING_OPENAI_KEY" }, { status: 503 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return jsonWithCors(request, { error: "Invalid JSON" }, { status: 400 });
  }

  const scenario = findScenario(typeof body.scenarioId === "string" ? body.scenarioId : "");
  if (!scenario) {
    return jsonWithCors(request, { error: "unknown scenario" }, { status: 400 });
  }

  const turn: StuckTurn = {
    asked: typeof body.asked === "string" ? body.asked.trim().slice(0, 500) : "",
    heard: typeof body.heard === "string" ? body.heard.trim().slice(0, 500) : "",
    attempts: readCount(body.attempts),
    hesitationMs: readCount(body.hesitationMs),
    history: readSpokenLines(body.history),
  };
  if (!turn.asked && turn.history.length === 0) {
    return jsonWithCors(request, { error: "nothing to review" }, { status: 400 });
  }

  await meterRequest(request, "roleplayReview");

  try {
    const model = reviewModel();
    const reasoning = /^(gpt-5|o\d)/.test(model);
    const completion = await client.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content: reviewPrompt({
            tutorRole: scenario.tutorRole,
            setting: scenario.setting,
            targetLanguage: interfaceLanguageName(scenario.language),
            nativeLanguage: interfaceLanguageName(coerceLanguageCode(body.nativeLanguage)),
            turn,
          }),
        },
      ],
      response_format: { type: "json_object" },
      ...(reasoning ? { max_completion_tokens: 2000 } : { max_tokens: 500 }),
    });
    const review = parseReview(completion.choices[0]?.message?.content ?? "");
    if (!review) {
      return jsonWithCors(request, { error: "NO_REVIEW" }, { status: 502 });
    }
    return jsonWithCors(request, review);
  } catch (error) {
    console.error("[roleplay/review]", error);
    return jsonWithCors(request, { error: "REVIEW_FAILED" }, { status: 502 });
  }
}
