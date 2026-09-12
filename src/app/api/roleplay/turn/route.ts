import { NextRequest } from "next/server";
import { coerceLanguageCode } from "@/lib/learningLanguages";
import { SCENARIOS, findScenario, sentencesFor } from "@/lib/roleplay/catalog";
import {
  parseDirection,
  readSpokenLines,
  recordedLines,
  tutorMessages,
  tutorSystemPrompt,
  type DirectorRequest,
} from "@/lib/roleplay/director";
import { MAX_CONTEXT_CHARS } from "@/lib/roleplay/memory";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { meterRequest } from "@/lib/server/meterRequest";
import { getOpenAIClient } from "@/lib/server/openai";

export const dynamic = "force-dynamic";

/**
 * The model the tutor speaks through, apart from the one everything else uses.
 *
 * It only runs on turns the script could not take, so a better model than the
 * app's default costs well under a won more per intervention — nothing beside a
 * minute of call — and those turns are all judgement: hearing that "I'll sit by
 * the window" means "for here", and bringing a detour home.
 *
 * Chosen on six turns taken from a real session, each run twice. gpt-4.1-mini
 * got all six right both times in about a second and a half. gpt-5-mini read
 * meaning a little better but twice skipped a question the scene still needed,
 * and took two to three seconds — silence, in a spoken conversation. gpt-4o-mini,
 * the app's default, picked a goodbye mid-order. Set by environment so the
 * choice can move without a release.
 */
function tutorModel(): string {
  return process.env.OPENAI_DIRECTOR_MODEL?.trim() || "gpt-4.1-mini";
}

export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request);
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
    history: readSpokenLines(body.history),
    context:
      typeof body.context === "string" ? body.context.trim().slice(0, MAX_CONTEXT_CHARS) : "",
    freeTurns: readCount(body.freeTurns),
    directedTurns: readCount(body.directedTurns),
    level: Math.min(5, Math.max(1, readCount(body.level) || 3)),
    targetLanguage: coerceLanguageCode(scenario.language),
    nativeLanguage: coerceLanguageCode(body.nativeLanguage),
  };

  const bank = sentencesFor(scenario.language);
  const recorded = recordedLines(scenario, SCENARIOS, bank);

  try {
    const model = tutorModel();
    // Reasoning models spend hidden tokens before answering and take their cap
    // under another name. Minimal effort: this is one spoken line, and every
    // second of thinking is a second of silence in a conversation.
    const reasoning = /^(gpt-5|o\d)/.test(model);
    const completion = await client.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content: tutorSystemPrompt({ scenario, bank, recorded, request: turn }),
        },
        ...tutorMessages(turn),
      ],
      response_format: { type: "json_object" },
      ...(reasoning
        ? { max_completion_tokens: 2000, reasoning_effort: "minimal" as const }
        : { max_tokens: 300 }),
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
