import { NextRequest } from "next/server";
import { coerceLanguageCode, interfaceLanguageName } from "@/lib/learningLanguages";
import { findScenario } from "@/lib/roleplay/catalog";
import { compareToTarget, parsePractice, practicePrompt } from "@/lib/roleplay/practice";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { meterRequest } from "@/lib/server/meterRequest";
import { getOpenAIClient } from "@/lib/server/openai";

export const dynamic = "force-dynamic";

/**
 * Reading one attempt at a line the review handed them.
 *
 * The comparison is done before the model is asked anything — which word came
 * out as which is arithmetic, not judgement, and doing it here means the model
 * is handed a finding rather than trusted to make one. What it adds is the
 * sentence a person would say about that finding.
 *
 * So it runs on the fast model rather than the review's. Measured on real
 * attempts, the reasoning model took twelve to twenty-two seconds and dropped
 * one answer in three by spending its budget before it wrote any JSON — which
 * is nothing in a review someone reads once, and fatal in a loop whose whole
 * point is saying the line again and again. The finding is already made; this
 * is phrasing.
 */
function practiceModel(): string {
  return process.env.OPENAI_PRACTICE_MODEL?.trim() || "gpt-4.1-mini";
}

export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request);
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
  const target = typeof body.target === "string" ? body.target.trim().slice(0, 200) : "";
  const heard = typeof body.heard === "string" ? body.heard.trim().slice(0, 200) : "";
  if (!target) {
    return jsonWithCors(request, { error: "nothing to say back" }, { status: 400 });
  }

  await meterRequest(request, "roleplayPractice");

  const comparison = compareToTarget(target, heard);
  try {
    const model = practiceModel();
    const reasoning = /^(gpt-5|o\d)/.test(model);
    const completion = await client.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content: practicePrompt({
            target,
            heard,
            comparison,
            targetLanguage: interfaceLanguageName(scenario.language),
            nativeLanguage: interfaceLanguageName(coerceLanguageCode(body.nativeLanguage)),
          }),
        },
      ],
      response_format: { type: "json_object" },
      ...(reasoning
        ? { max_completion_tokens: 2000, reasoning_effort: "minimal" as const }
        : { max_tokens: 300 }),
    });
    const practice = parsePractice(completion.choices[0]?.message?.content ?? "");
    if (!practice) {
      return jsonWithCors(request, { error: "NO_PRACTICE" }, { status: 502 });
    }
    return jsonWithCors(request, { ...practice, outcomes: comparison.outcomes });
  } catch (error) {
    console.error("[roleplay/practice]", error);
    return jsonWithCors(request, { error: "PRACTICE_FAILED" }, { status: 502 });
  }
}
