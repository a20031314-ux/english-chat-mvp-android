import { NextRequest } from "next/server";
import { findScenario } from "@/lib/roleplay/catalog";
import { readSpokenLines } from "@/lib/roleplay/director";
import { MAX_CONTEXT_CHARS, contextPrompt, parseContext } from "@/lib/roleplay/memory";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { meterRequest } from "@/lib/server/meterRequest";
import { chatModel, getOpenAIClient } from "@/lib/server/openai";

export const dynamic = "force-dynamic";

export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request);
}

/**
 * Fold lines that have left the tutor's verbatim view into its notes.
 *
 * Called beside the conversation, never on a turn's critical path, so the
 * app's everyday model is enough: this is summarising, not judgement, and
 * nobody is waiting on it.
 */
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
  const lines = readSpokenLines(body.lines);
  if (lines.length === 0) {
    return jsonWithCors(request, { error: "lines required" }, { status: 400 });
  }

  await meterRequest(request, "roleplayContext");

  try {
    const completion = await client.chat.completions.create({
      model: chatModel(),
      messages: [
        {
          role: "system",
          content: contextPrompt({
            tutorRole: scenario.tutorRole,
            setting: scenario.setting,
            previous:
              typeof body.previous === "string" ? body.previous.slice(0, MAX_CONTEXT_CHARS) : "",
            lines,
          }),
        },
      ],
      response_format: { type: "json_object" },
      max_tokens: 250,
    });
    const notes = parseContext(completion.choices[0]?.message?.content ?? "");
    if (!notes) {
      return jsonWithCors(request, { error: "NO_CONTEXT" }, { status: 502 });
    }
    return jsonWithCors(request, { notes });
  } catch (error) {
    console.error("[roleplay/context]", error);
    return jsonWithCors(request, { error: "CONTEXT_FAILED" }, { status: 502 });
  }
}
