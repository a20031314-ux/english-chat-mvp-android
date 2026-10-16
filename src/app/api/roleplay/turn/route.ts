import { NextRequest, after } from "next/server";
import { coerceLanguageCode, learningLanguageName } from "@/lib/learningLanguages";
import { SCENARIOS, sentencesFor } from "@/lib/roleplay/catalog";
import {
  ROLEPLAY_BANK_CLIENT_HEADER,
  ROLEPLAY_MEANT_CLIENT_HEADER,
  ROLEPLAY_REACT_CLIENT_HEADER,
  meantForOldClients,
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
import { withBankReaction } from "@/lib/roleplay/reactions";
import { readPack, writePack } from "@/lib/server/packStore";
import { advance, candidates, packPrompt, readAsk, type Candidate, type Pack } from "@/lib/pack/pack";
import { shapePackDirection } from "@/lib/pack/turn";
import {
  ROLEPLAY_POINTS_CLIENT_HEADER,
  ROLEPLAY_SESSION_HEADER,
} from "@/lib/billing/config";
import {
  chargeRoleplayTurn,
  noteSentenceSaid,
  noteSentenceWritten,
} from "@/lib/server/entitlementStore";
import { requestUserId, resolveRequestEntitlement } from "@/lib/server/premiumRequest";
import { parseOffset, TZ_OFFSET_HEADER } from "@/lib/billing/plans";
import { recordLearnerTurn } from "@/lib/server/learnerMetrics";
import { observeMapUse } from "@/lib/server/curriculumStore";
import { observeWeakPoints } from "@/lib/server/weakPointStore";
import { recordMeets, recordTurn } from "@/lib/server/ledgerStore";
import { readLearnerBrief } from "@/lib/server/learnerBrief";
import { recordGrowthTurn, recordStuck } from "@/lib/server/growthStore";
import { quotedPhrases } from "@/lib/learner/stuck";
import { writtenInLearningLanguage } from "@/lib/inputLanguage";
import { parsePracticeGoal, practicePrompt, saidPhrase } from "@/lib/learner/practice";
import { contentHash } from "@/lib/roleplay/script";
import { corsPreflightResponse, jsonWithCors, streamWithCors } from "@/lib/server/cors";
import { meterRequest, recordTokens } from "@/lib/server/meterRequest";
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

  // What an open conversation was started to practise — a situation from the
  // learner's goal, phrases to use, a mistake to get right (learner/practice.ts).
  // A scripted scene already has its situation and keeps to it.
  const practice = scenario.openEnded ? parsePracticeGoal(body.practice) : null;
  // Today's daily pack, when this conversation plays one (pack/pack.ts). It is
  // free — one a day — so its turns are not charged; a pack already finished,
  // or one this user does not have, is an ordinary conversation.
  const pack: Pack | null = practice?.pack
    ? await readPack(requestUserId(request), coerceLanguageCode(scenario.language), practice.pack)
    : null;
  const playingPack = pack && !pack.finishedAt ? pack : null;

  // Charged as the conversation runs, and only for a build that can be told it
  // has run out: an older one reads a refused turn as a failed one, drops it,
  // and leaves the learner talking to a scene that has gone quiet.
  if (!playingPack && request.headers.get(ROLEPLAY_POINTS_CLIENT_HEADER) === "1") {
    const sessionId = request.headers.get(ROLEPLAY_SESSION_HEADER)?.trim().slice(0, 64);
    if (sessionId) {
      const { terms, userId } = await resolveRequestEntitlement(request);
      const charge = await chargeRoleplayTurn(
        userId,
        terms,
        sessionId,
        Date.now(),
        parseOffset(request.headers.get(TZ_OFFSET_HEADER)),
      );
      if (!charge.ok) {
        return jsonWithCors(
          request,
          { error: "NO_POINTS", left: charge.left, todayLeftMs: charge.todayLeftMs },
          { status: 402 },
        );
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

  // Measurements of the learner's turn, written once the answer has gone out
  // so nothing here can slow or break it (learnerMetrics.ts). The direction is
  // filled in when it is decided, by whichever of the two paths below decides
  // it, and read only after the response — streamed or not — is finished.
  const sessionId = request.headers.get(ROLEPLAY_SESSION_HEADER)?.trim().slice(0, 64) || null;
  const turnIndex = turn.directedTurns;
  const previousTutorLine = [...turn.history].reverse().find((line) => line.who === "tutor");
  // Sent by builds from 2.61: what the app measured about this turn. Absent
  // from older ones, which leaves the row's latency empty as before.
  const signals =
    body.learnerSignals && typeof body.learnerSignals === "object"
      ? (body.learnerSignals as Record<string, unknown>)
      : null;
  const responseLatencyMs = signals && typeof signals.hesitationMs === "number" ? readCount(signals.hesitationMs) : null;
  const attempts = signals && typeof signals.attempts === "number" ? readCount(signals.attempts) : null;
  let decided: Direction | null = null;
  after(() =>
    recordLearnerTurn({
      userId: requestUserId(request),
      surface: "call",
      language: turn.targetLanguage,
      uiLanguage: turn.nativeLanguage,
      sessionId,
      turnIndex,
      text: turn.heard,
      spoken: true,
      // No direction, no verdict; a direction without a rewrite is a sentence
      // that needed none.
      corrected: decided ? (decided.meant || decided.better || "") : undefined,
      responseLatencyMs,
      attempts,
      scenarioId: scenario.id,
      appVersion: requestAppVersion(request.headers),
      now: Date.now(),
    }),
  );
  // A pack turn, recorded as numbers and the names of phrases said, and the
  // pack moved past the question the tutor picked (pack/pack.ts). Read again
  // here rather than reusing the copy from the start of the request, so two
  // quick turns do not write over each other.
  if (playingPack) {
    after(async () => {
      try {
        const fresh = await readPack(requestUserId(request), playingPack.language, playingPack.day);
        if (!fresh || fresh.finishedAt) return;
        const corrected = decided ? Boolean(decided.meant || decided.better) : null;
        const moved = advance(
          fresh,
          {
            at: Date.now(),
            latencyMs: responseLatencyMs,
            attempts,
            corrected,
            stuck: decided?.assessment === "stuck",
            used: fresh.phrases
              .map((p) => p.text)
              .filter((phrase) => saidPhrase(turn.heard, phrase, turn.targetLanguage)),
          },
          packChoice,
        );
        await writePack(requestUserId(request), moved);
      } catch (error) {
        console.error("[roleplay/turn] pack", error);
      }
    });
  }

  // A phrase on their study map, said in the call, is output they produced on
  // their own; the director's rewrite says whether it survived.
  // Then a mistake of a kind they keep making goes onto the map to learn
  // (curriculum/weakPoints.ts) — after, since both write the map's items.
  after(async () => {
    const corrected = decided ? (decided.meant || decided.better || "") : "";
    await observeMapUse({
      userId: requestUserId(request),
      language: turn.targetLanguage,
      sentence: turn.heard,
      corrected,
      where: "call",
    });
    // Stuck, and handed words to go on with: those words are what it taught
    // (learner/stuck.ts) — met in the ledger, kept as the flow element's leaves,
    // and brought back first by the tutor.
    if (decided?.assessment === "stuck") {
      const phrases = quotedPhrases(decided.note ?? "").filter((phrase) =>
        writtenInLearningLanguage(phrase, turn.targetLanguage, turn.nativeLanguage),
      );
      await recordStuck({ userId: requestUserId(request), language: turn.targetLanguage, phrases });
      if (phrases.length) {
        await recordMeets(
          requestUserId(request),
          turn.targetLanguage,
          phrases.map((text) => ({ kind: "ask" as const, text, tab: "call" as const })),
        );
      }
    }
    // The My tab's elements (learner/growth.ts): a line the character did not
    // rewrite grows accuracy and naturalness, a quick first-go start grows the
    // flow of speech.
    if (decided && turn.heard) {
      await recordGrowthTurn({
        userId: requestUserId(request),
        language: turn.targetLanguage,
        turn: { surface: "call", corrected: Boolean(corrected), alreadyNatural: !corrected, attempts, latencyMs: responseLatencyMs },
      });
    }
    await recordTurn({
      userId: requestUserId(request),
      language: turn.targetLanguage,
      where: "call",
      learner: { sentence: turn.heard, corrected },
    });
    await observeWeakPoints({
      openai: getOpenAIClient(),
      userId: requestUserId(request),
      language: turn.targetLanguage,
      sentence: turn.heard,
      corrected,
      meter: (op) => void meterRequest(request, op),
    });
  });

  // Two clips only for a build that said it can play them. Everything on a
  // phone today was released before these lines existed and would queue
  // nothing at all for them (director.ts).
  const canPlayBank = request.headers.get(ROLEPLAY_BANK_CLIENT_HEADER) === "1";
  const showsMeant = request.headers.get(ROLEPLAY_MEANT_CLIENT_HEADER) === "1";
  const playsReaction = request.headers.get(ROLEPLAY_REACT_CLIENT_HEADER) === "1";
  /**
   * The answer as this build should hear it. Its opening reaction, when the
   * bank holds it, is spoken in the bank's words so the shared speech cache
   * plays it instead of a new synthesis (reactions.ts). Decided after
   * noteDirection, so what is kept of the line is what the character wrote —
   * the record the reaction table grows from.
   */
  const forThisBuild = (direction: Direction) => {
    const shaped = showsMeant ? direction : meantForOldClients(direction);
    const { direction: spoken, swapped } = withBankReaction(shaped, {
      language: scenario.language,
      nativeLanguage: turn.nativeLanguage,
      bank,
      openEnded: Boolean(scenario.openEnded),
      canSplit: playsReaction,
    });
    if (swapped) void meterRequest(request, "roleplayReactionLine");
    return spoken;
  };
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
    decided = direction;
    if ("id" in direction.say) {
      void meterRequest(request, "roleplayBankLine");
      void noteSentenceSaid(scenario.language, direction.say.id);
    } else {
      void meterRequest(request, "roleplayInventedLine");
      // And kept, not only counted. Until now the app has never learned
      // anything from what it actually says: a written line was tallied and
      // thrown away, so the bank could only ever grow by somebody drafting one.
      // Reading the pile is a later job and a larger one; a line not written
      // down now is simply gone (entitlementStore.ts).
      void noteSentenceWritten(scenario.language, direction.say.text, {
        scenario_id: scenario.id,
        node_id: nodeId,
        mode: turn.mode,
        level: turn.level,
        prev_tutor_hash: previousTutorLine ? contentHash(previousTutorLine.text) : null,
        prev_turn_ref: { session_id: sessionId, turn_index: turnIndex },
      });
    }
    if (direction.follow) {
      void meterRequest(request, "roleplaySplitTurn");
      void noteSentenceSaid(scenario.language, direction.follow);
    }
  };

  // In a free conversation, what their own practice shows — mistakes that
  // recur, learned phrases to bring back, whether to ease off or stretch
  // (learner/brief.ts). Cached for minutes, so a call does not rebuild it on
  // every turn. A scripted scene keeps to its script.
  const brief = scenario.openEnded
    ? (await readLearnerBrief(requestUserId(request), turn.targetLanguage)).prompt
    : "";
  // A pack turn: the tutor reacts and picks the pack's next question rather
  // than asking its own, so the practice brief's "ask the question a phrase
  // answers" would pull the other way and is left out (pack.ts packPrompt).
  const packOptions: Candidate[] = playingPack ? candidates(playingPack) : [];
  let packChoice: Candidate | null = null;
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
      ...(brief ? [{ role: "system" as const, content: brief }] : []),
      ...(playingPack
        ? [{ role: "system" as const, content: packPrompt(playingPack, packOptions) }]
        : practice
          ? [{ role: "system" as const, content: practicePrompt(practice, learningLanguageName(turn.targetLanguage)) }]
          : []),
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
  /**
   * The answer as spoken, for a pack turn: the tutor's reaction and the pack
   * question it picked (pack/turn.ts). Called after noteDirection, so what is
   * kept of the tutor's line is what it wrote.
   */
  const playPack = (direction: Direction, text: string): Direction => {
    if (!playingPack) return direction;
    const { direction: shaped, asked } = shapePackDirection(direction, readAsk(text, packOptions), {
      complete: packOptions.length === 0,
      language: scenario.language,
      nativeLanguage: turn.nativeLanguage,
      bank,
      canSplit: playsReaction,
      nodeId,
      planned: packOptions[0] ?? null,
    });
    // The question that will be asked is the one the pack moves past.
    packChoice = asked;
    return shaped;
  };

  try {
    if (!wantsStream) {
      const completion = await client.chat.completions.create(ask);
      void recordTokens("roleplayTurn", completion.usage);
      const content = completion.choices[0]?.message?.content ?? "";
      const direction = parse(content);
      if (!direction) {
        return jsonWithCors(request, { error: "NO_DIRECTION" }, { status: 502 });
      }
      noteDirection(direction);
      const spoken = playPack(direction, content);
      return jsonWithCors(
        request,
        canPlayBank ? forThisBuild(spoken) : flattenForOldClients(forThisBuild(spoken), bank),
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
    const completion = await client.chat.completions.create({
      ...ask,
      stream: true,
      // The last piece then carries what the call used (recordTokens).
      stream_options: { include_usage: true },
    });
    const encoder = new TextEncoder();
    const body = new ReadableStream<Uint8Array>({
      async start(controller) {
        const write = (value: unknown) =>
          controller.enqueue(encoder.encode(`${JSON.stringify(value)}\n`));
        let text = "";
        let led = false;
        try {
          for await (const part of completion) {
            if (part.usage) void recordTokens("roleplayTurn", part.usage);
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
            write({ direction: forThisBuild(playPack(direction, text)) });
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
