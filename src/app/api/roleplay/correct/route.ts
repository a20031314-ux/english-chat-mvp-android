import { NextRequest } from "next/server";
import { coerceLanguageCode } from "@/lib/learningLanguages";
import {
  correctionSystemPrompt,
  parseCorrection,
} from "@/lib/roleplay/correctionPrompt";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { meterRequest } from "@/lib/server/meterRequest";
import { chatModel, getOpenAIClient } from "@/lib/server/openai";

export const dynamic = "force-dynamic";

export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request);
}

/**
 * One line of correction for a miss the scenario did not see coming.
 *
 * The rung between a written correction and a call. Most misses at a given turn
 * are the same miss and were recorded in advance, costing nothing to play; this
 * is for the rest, and it stays one-way — a sentence, spoken and done — because
 * a reply would make it a conversation, which is what the call is and what the
 * call costs.
 */
export async function POST(request: NextRequest) {
  const client = getOpenAIClient();
  if (!client) {
    return jsonWithCors(request, { error: "MISSING_OPENAI_KEY" }, { status: 503 });
  }

  await meterRequest(request, "roleplayCorrect");

  let body: {
    heard?: unknown;
    goal?: unknown;
    setting?: unknown;
    tutorRole?: unknown;
    targetLanguage?: unknown;
    interfaceLanguage?: unknown;
  };
  try {
    body = await request.json();
  } catch {
    return jsonWithCors(request, { error: "Invalid JSON" }, { status: 400 });
  }

  const heard = typeof body.heard === "string" ? body.heard.trim() : "";
  if (!heard) {
    // Nothing was said, so there is nothing to correct. Saying so lets the app
    // offer a retry rather than inventing advice about silence.
    return jsonWithCors(request, { error: "heard required" }, { status: 400 });
  }

  const prompt = correctionSystemPrompt({
    heard,
    goal: typeof body.goal === "string" ? body.goal : "",
    setting: typeof body.setting === "string" ? body.setting : "",
    tutorRole: typeof body.tutorRole === "string" ? body.tutorRole : "assistant",
    targetLanguage: coerceLanguageCode(body.targetLanguage),
    nativeLanguage: coerceLanguageCode(body.interfaceLanguage),
  });

  try {
    const completion = await client.chat.completions.create({
      model: chatModel(),
      messages: [{ role: "system", content: prompt }],
      response_format: { type: "json_object" },
      // One or two sentences. A cap here is cheaper than trimming afterwards,
      // and a correction that runs long has stopped being a correction.
      max_tokens: 200,
    });
    const correction = parseCorrection(
      completion.choices[0]?.message?.content ?? "",
    );
    if (!correction) {
      return jsonWithCors(request, { error: "NO_CORRECTION" }, { status: 502 });
    }
    return jsonWithCors(request, correction);
  } catch (error) {
    console.error("[roleplay/correct]", error);
    return jsonWithCors(request, { error: "CORRECTION_FAILED" }, { status: 502 });
  }
}
