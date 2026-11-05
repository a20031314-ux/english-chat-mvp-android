import { completeChat } from "@/lib/server/llm";
import { NextRequest } from "next/server";
import { findScenario } from "@/lib/roleplay/catalog";
import { readSpokenLines } from "@/lib/roleplay/director";
import { MAX_CONTEXT_CHARS, contextPrompt, parseMemory } from "@/lib/roleplay/memory";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { meterRequest } from "@/lib/server/meterRequest";
import { getOpenAIClient } from "@/lib/server/openai";

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
    const completion = await completeChat(client, "roleplayContext", {
      messages: [
        {
          role: "system",
          content: contextPrompt({
            tutorRole: scenario.tutorRole,
            setting: scenario.setting,
            previous:
              typeof body.previous === "string" ? body.previous.slice(0, MAX_CONTEXT_CHARS) : "",
            lines,
            today: typeof body.today === "string" && /^\d{4}-\d{2}-\d{2}$/.test(body.today) ? body.today : new Date().toISOString().slice(0, 10),
          }),
        },
      ],
      response_format: { type: "json_object" },
      max_tokens: 500, // Claude 여유(2026-10-22). 노트와 사실 목록.
    });
    const folded = parseMemory(completion.choices[0]?.message?.content ?? "");
    if (!folded) {
      return jsonWithCors(request, { error: "NO_CONTEXT" }, { status: 502 });
    }
    return jsonWithCors(request, { notes: folded.notes, facts: folded.facts });
  } catch (error) {
    console.error("[roleplay/context]", error);
    return jsonWithCors(request, { error: "CONTEXT_FAILED" }, { status: 502 });
  }
}
