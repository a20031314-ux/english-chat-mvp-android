import { fastestEffort, isReasoningModel } from "@/lib/server/llm";
import { completeChat, routeFor } from "@/lib/server/llm";
import { NextRequest, after } from "next/server";
import { recordPronunciation } from "@/lib/server/growthStore";
import { requestUserId } from "@/lib/server/premiumRequest";
import { coerceLanguageCode, interfaceLanguageName } from "@/lib/learningLanguages";
import { findScenario } from "@/lib/roleplay/catalog";
import { compareToTarget, parsePractice, practicePrompt, type Practice } from "@/lib/roleplay/practice";
import { noteFitsUi } from "@/lib/notes/notebook";
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
  return routeFor("roleplayPractice").model;
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
  // Saying a line again is what grows pronunciation (learner/growth.ts): an
  // attempt when something was heard, a point when every word came out right.
  if (heard) {
    after(() =>
      recordPronunciation({ userId: requestUserId(request), language: scenario.language, clean: comparison.clean }),
    );
  }
  try {
    const model = practiceModel();
    const reasoning = isReasoningModel(model);
    const nativeCode = coerceLanguageCode(body.nativeLanguage);
    const nativeName = interfaceLanguageName(nativeCode);
    const system = practicePrompt({
      target,
      heard,
      comparison,
      targetLanguage: interfaceLanguageName(scenario.language),
      nativeLanguage: nativeName,
    });
    type Turn = { role: "system" | "user" | "assistant"; content: string };
    const ask = (messages: Turn[]) =>
      completeChat(client, "roleplayPractice", {
        messages,
        response_format: { type: "json_object" },
        ...(reasoning
          ? { max_completion_tokens: 2000, reasoning_effort: fastestEffort(model) as "minimal" }
          : { max_tokens: 300 }),
      });
    // The note sometimes comes back in the learning language (2026-10-27: a Japanese
    // note for a Korean reader); ask once more, naming the miss, when it is not in the
    // interface script.
    const messages: Turn[] = [
      { role: "system", content: system },
      { role: "user", content: `JSON, with the note in ${nativeName}.` },
    ];
    let practice: Practice | null = null;
    for (let attempt = 0; attempt < 2; attempt += 1) {
      const completion = await ask(messages);
      const raw = completion.choices[0]?.message?.content ?? "";
      practice = parsePractice(raw);
      if (!practice || noteFitsUi(practice.note, nativeCode)) break;
      messages.push(
        { role: "assistant", content: raw },
        { role: "user", content: `That note is not in ${nativeName}. Give the same JSON with the note rewritten in ${nativeName}; quote words of the sentence only where needed.` },
      );
    }
    if (!practice) {
      return jsonWithCors(request, { error: "NO_PRACTICE" }, { status: 502 });
    }
    return jsonWithCors(request, { ...practice, outcomes: comparison.outcomes });
  } catch (error) {
    console.error("[roleplay/practice]", error);
    return jsonWithCors(request, { error: "PRACTICE_FAILED" }, { status: 502 });
  }
}
