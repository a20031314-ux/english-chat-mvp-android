import { isReasoningModel } from "@/lib/server/llm";
import { completeChat, routeFor } from "@/lib/server/llm";
import { NextRequest, after } from "next/server";
import { coerceLanguageCode, interfaceLanguageName } from "@/lib/learningLanguages";
import { findScenario } from "@/lib/roleplay/catalog";
import { readSpokenLines } from "@/lib/roleplay/director";
import { parseReview, reviewPrompt, type StuckTurn } from "@/lib/roleplay/review";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { targetLanguageFocusHints } from "@/lib/languageFocus";
import { meterRequest } from "@/lib/server/meterRequest";
import { getOpenAIClient } from "@/lib/server/openai";
import { requestUserId } from "@/lib/server/premiumRequest";
import { recordLearnerTurn } from "@/lib/server/learnerMetrics";
import { compareVersions, requestAppVersion } from "@/lib/appVersion";

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
export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request);
}

function readCount(raw: unknown): number {
  return typeof raw === "number" && Number.isFinite(raw) && raw > 0 ? Math.floor(raw) : 0;
}

/** 💡 조각(pieces)을 그리는 화면은 2.80부터 — 그 밑 앱은 why·say·meaning만 읽는다. 웹(버전 없음)은 지금 화면. */
const HINT_PIECES_SINCE = "2.80";
function legacyHint(headers: Headers): boolean {
  const version = requestAppVersion(headers);
  return version !== "unknown" && compareVersions(version, HINT_PIECES_SINCE) < 0;
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
    ...(body.live === true ? { live: true } : {}),
  };
  if (!turn.asked && turn.history.length === 0) {
    return jsonWithCors(request, { error: "nothing to review" }, { status: 400 });
  }

  // 통화 중 💡는 따로(빠른 모델·짧은 답), 돌아보기는 그대로.
  const task = turn.live ? ("roleplayHint" as const) : ("roleplayReview" as const);
  await meterRequest(request, task);

  // The one turn whose silence the app sends today: the learner asked to look
  // back at it, so its real response latency and tries come with the request.
  // Recorded as its own row (surface "review") rather than patched into the
  // turn's — the request names no session or index to find that row by.
  after(() =>
    recordLearnerTurn({
      userId: requestUserId(request),
      surface: "review",
      language: scenario.language,
      uiLanguage: typeof body.nativeLanguage === "string" ? body.nativeLanguage : null,
      sessionId: null,
      turnIndex: null,
      text: turn.heard,
      spoken: true,
      responseLatencyMs: turn.hesitationMs,
      attempts: turn.attempts,
      scenarioId: scenario.id,
      appVersion: requestAppVersion(request.headers),
      now: Date.now(),
    }),
  );

  try {
    const model = routeFor(task).model;
    const reasoning = isReasoningModel(model);
    const completion = await completeChat(client, task, {
      messages: [
        {
          role: "system",
          content: reviewPrompt({
            tutorRole: scenario.tutorRole,
            setting: scenario.setting,
            targetLanguage: interfaceLanguageName(scenario.language),
            // The same rubric the chat tab corrects against, so a learner is
            // not held to two different standards in two tabs.
            ...(scenario.language === "en"
              ? {}
              : { focus: targetLanguageFocusHints(coerceLanguageCode(scenario.language)) }),
            nativeLanguage: interfaceLanguageName(coerceLanguageCode(body.nativeLanguage)),
            turn,
            legacyHint: legacyHint(request.headers),
          }),
        },
      ],
      response_format: { type: "json_object" },
      ...(reasoning ? { max_completion_tokens: turn.live ? 800 : 2000 } : { max_tokens: turn.live ? 300 : 900 }),
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
