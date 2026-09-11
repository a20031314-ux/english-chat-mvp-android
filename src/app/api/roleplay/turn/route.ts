import { NextRequest } from "next/server";
import { coerceLanguageCode } from "@/lib/learningLanguages";
import { SCENARIOS, findScenario, sentencesFor } from "@/lib/roleplay/catalog";
import {
  directorSystemPrompt,
  directorUserMessage,
  parseDirection,
  recordedLines,
  type DirectorRequest,
  type SpokenLine,
} from "@/lib/roleplay/director";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { meterRequest } from "@/lib/server/meterRequest";
import { chatModel, getOpenAIClient } from "@/lib/server/openai";

export const dynamic = "force-dynamic";

export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request);
}

function readHistory(raw: unknown): SpokenLine[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((line) => {
      const record = (typeof line === "object" && line !== null ? line : {}) as {
        who?: unknown;
        text?: unknown;
      };
      const who = record.who === "learner" ? "learner" : "tutor";
      const text = typeof record.text === "string" ? record.text.trim().slice(0, 500) : "";
      return { who, text } as SpokenLine;
    })
    .filter((line) => line.text);
}

function readCount(raw: unknown): number {
  return typeof raw === "number" && Number.isFinite(raw) && raw >= 0 ? Math.floor(raw) : 0;
}

/**
 * One turn the script could not take, decided by the director.
 *
 * The scene is looked up here rather than trusted from the request, so the
 * lines the director may pick are the ones that really have recordings and the
 * steps it may send the conversation to are the ones that really exist.
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
  const nodeId = typeof body.nodeId === "string" ? body.nodeId : "";
  if (!scenario.nodes[nodeId]) {
    return jsonWithCors(request, { error: "unknown step" }, { status: 400 });
  }

  await meterRequest(request, "roleplayTurn");

  const turn: DirectorRequest = {
    scenarioId: scenario.id,
    nodeId,
    mode: body.mode === "free" ? "free" : "script",
    heard: typeof body.heard === "string" ? body.heard.trim().slice(0, 500) : "",
    history: readHistory(body.history),
    freeTurns: readCount(body.freeTurns),
    directedTurns: readCount(body.directedTurns),
    level: Math.min(5, Math.max(1, readCount(body.level) || 3)),
    targetLanguage: coerceLanguageCode(scenario.language),
    nativeLanguage: coerceLanguageCode(body.nativeLanguage),
  };

  const bank = sentencesFor(scenario.language);
  const recorded = recordedLines(scenario, SCENARIOS, bank);

  try {
    const completion = await client.chat.completions.create({
      model: chatModel(),
      messages: [
        {
          role: "system",
          content: directorSystemPrompt({ scenario, bank, recorded, request: turn }),
        },
        { role: "user", content: directorUserMessage(turn) },
      ],
      response_format: { type: "json_object" },
      // One line and a note. A cap is cheaper than trimming afterwards.
      max_tokens: 300,
    });
    const direction = parseDirection(completion.choices[0]?.message?.content ?? "", {
      scenario,
      bank,
      recordedIds: new Set(recorded.map((line) => line.id)),
      request: turn,
    });
    if (!direction) {
      return jsonWithCors(request, { error: "NO_DIRECTION" }, { status: 502 });
    }
    return jsonWithCors(request, direction);
  } catch (error) {
    console.error("[roleplay/turn]", error);
    return jsonWithCors(request, { error: "DIRECTION_FAILED" }, { status: 502 });
  }
}
