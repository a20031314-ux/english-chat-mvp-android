import { NextRequest } from "next/server";
import { coerceLanguageCode } from "@/lib/learningLanguages";
import { SCENARIOS, sentencesFor } from "@/lib/roleplay/catalog";
import {
  ROLEPLAY_BANK_CLIENT_HEADER,
  ROLEPLAY_STREAM_CLIENT_HEADER,
  flattenForOldClients,
  leadFromPartial,
  playableBy,
  parseDirection,
  readSpokenLines,
  recordedLines,
  tutorMessages,
  tutorSystemPrompt,
  type Direction,
  type DirectorRequest,
} from "@/lib/roleplay/director";
import { MAX_CONTEXT_CHARS } from "@/lib/roleplay/memory";
import {
  ROLEPLAY_POINTS_CLIENT_HEADER,
  ROLEPLAY_SESSION_HEADER,
} from "@/lib/billing/config";
import { chargeRoleplayTurn, noteSentenceSaid } from "@/lib/server/entitlementStore";
import { resolveRequestEntitlement } from "@/lib/server/premiumRequest";
import { corsPreflightResponse, jsonWithCors, streamWithCors } from "@/lib/server/cors";
import { meterRequest } from "@/lib/server/meterRequest";
import { requestAppVersion } from "@/lib/appVersion";
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

  // The scenes as this build can play them: a repertoire line is an id resolved
  // against the bank inside the app, so a build released before those lines
  // existed is offered none of them and its character writes its own, the way
  // every language without a bank already works (director.ts).
  const scenarios = playableBy(SCENARIOS, requestAppVersion(request.headers));
  const wanted = typeof body.scenarioId === "string" ? body.scenarioId : "";
  const scenario = scenarios.find((one) => one.id === wanted);
  if (!scenario) {
    return jsonWithCors(request, { error: "unknown scenario" }, { status: 400 });
  }
  const nodeId = typeof body.nodeId === "string" ? body.nodeId : "";
  if (!scenario.nodes[nodeId]) {
    return jsonWithCors(request, { error: "unknown step" }, { status: 400 });
  }

  // Charged as the conversation runs, and only for a build that can be told it
  // has run out: an older one reads a refused turn as a failed one, drops it,
  // and leaves the learner talking to a scene that has gone quiet.
  if (request.headers.get(ROLEPLAY_POINTS_CLIENT_HEADER) === "1") {
    const sessionId = request.headers.get(ROLEPLAY_SESSION_HEADER)?.trim().slice(0, 64);
    if (sessionId) {
      const { isPremium, userId } = await resolveRequestEntitlement(request);
      const charge = await chargeRoleplayTurn(userId, isPremium, sessionId, Date.now());
      if (!charge.ok) {
        return jsonWithCors(request, { error: "NO_POINTS", left: charge.left }, { status: 402 });
      }
    }
  }

  await meterRequest(request, "roleplayTurn");
  // The first director call of a conversation, so per-session figures have a
  // denominator. Stateless, and therefore an undercount by exactly the
  // conversations whose first turn the script took on its own.
  if (readCount(body.directedTurns) === 0) void meterRequest(request, "roleplaySession");

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
  const recorded = recordedLines(scenario, scenarios, bank);

  // Two clips only for a build that said it can play them. Everything on a
  // phone today was released before these lines existed and would queue
  // nothing at all for them (director.ts).
  const canPlayBank = request.headers.get(ROLEPLAY_BANK_CLIENT_HEADER) === "1";
  // And an answer in pieces only for a build that reads one (director.ts).
  const wantsStream =
    canPlayBank && request.headers.get(ROLEPLAY_STREAM_CLIENT_HEADER) === "1";

  /**
   * What the bank is for, counted where it is decided and before the answer is
   * reshaped for whoever asked, so the figures describe the conversation rather
   * than the build having it. A line reached for out of the bank is the same
   * words every time, which the edge cache can hold and hand back to everybody;
   * an invented one is a string nobody has asked for before.
   */
  const noteDirection = (direction: Direction) => {
    if ("id" in direction.say) {
      void meterRequest(request, "roleplayBankLine");
      void noteSentenceSaid(scenario.language, direction.say.id);
    } else {
      void meterRequest(request, "roleplayInventedLine");
    }
    if (direction.follow) {
      void meterRequest(request, "roleplaySplitTurn");
      void noteSentenceSaid(scenario.language, direction.follow);
    }
  };

  const model = tutorModel();
  // Reasoning models spend hidden tokens before answering and take their cap
  // under another name. Minimal effort: this is one spoken line, and every
  // second of thinking is a second of silence in a conversation.
  const reasoning = /^(gpt-5|o\d)/.test(model);
  const ask = {
    model,
    messages: [
      {
        role: "system" as const,
        content: tutorSystemPrompt({ scenario, bank, recorded, request: turn }),
      },
      ...tutorMessages(turn),
    ],
    response_format: { type: "json_object" as const },
    ...(reasoning
      ? { max_completion_tokens: 2000, reasoning_effort: "minimal" as const }
      : { max_tokens: 300 }),
  };
  const parse = (text: string) =>
    parseDirection(text, {
      scenario,
      bank,
      recordedIds: new Set(recorded.map((line) => line.id)),
      request: turn,
    });

  try {
    if (!wantsStream) {
      const completion = await client.chat.completions.create(ask);
      const direction = parse(completion.choices[0]?.message?.content ?? "");
      if (!direction) {
        return jsonWithCors(request, { error: "NO_DIRECTION" }, { status: 502 });
      }
      noteDirection(direction);
      return jsonWithCors(
        request,
        canPlayBank ? direction : flattenForOldClients(direction, bank),
      );
    }

    /**
     * The same answer, handed over in the order it is written.
     *
     * The line the turn opens with is named in the first key and the rest of
     * the answer is a note and a rewrite — text, read after the fact. Measured
     * against the real model, the id is in hand about a third of a second
     * before the object closes, which is a third of a second the app can spend
     * fetching the audio rather than waiting to be told what to fetch.
     *
     * Everything that can fail with a status still does: the model call is
     * started before a single byte of this response, so a refusal, a bad key
     * or an unreachable model is the same 402 or 502 it always was. Only a
     * failure part way through the answer arrives in the body, where the app
     * reads it as the dropped turn it is.
     */
    const completion = await client.chat.completions.create({ ...ask, stream: true });
    const encoder = new TextEncoder();
    const body = new ReadableStream<Uint8Array>({
      async start(controller) {
        const write = (value: unknown) =>
          controller.enqueue(encoder.encode(`${JSON.stringify(value)}\n`));
        let text = "";
        let led = false;
        try {
          for await (const part of completion) {
            const piece = part.choices[0]?.delta?.content ?? "";
            if (!piece) continue;
            text += piece;
            // Only where a named reaction cannot be outranked by a step's own
            // question, which is every open conversation and no scripted scene
            // (director.ts), and only for a line this voice can really play.
            if (led || !scenario.openEnded) continue;
            const lead = leadFromPartial(text);
            if (lead && recorded.some((line) => line.id === lead)) {
              led = true;
              write({ lead });
            }
          }
          const direction = parse(text);
          if (!direction) {
            write({ error: "NO_DIRECTION" });
          } else {
            noteDirection(direction);
            write({ direction });
          }
        } catch (error) {
          console.error("[roleplay/turn] mid-answer", error);
          write({ error: "DIRECTION_FAILED" });
        } finally {
          controller.close();
        }
      },
    });
    return streamWithCors(request, body);
  } catch (error) {
    console.error("[roleplay/turn]", error);
    return jsonWithCors(request, { error: "DIRECTION_FAILED" }, { status: 502 });
  }
}
