import { completeChat } from "@/lib/server/llm";
import { NextRequest } from "next/server";
import { findScenario } from "@/lib/roleplay/catalog";
import { readSpokenLines } from "@/lib/roleplay/director";
import { MAX_CONTEXT_CHARS, contextPrompt, parseMemory } from "@/lib/roleplay/memory";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { meterRequest } from "@/lib/server/meterRequest";
import { getOpenAIClient } from "@/lib/server/openai";
import { chatPartnerForLanguage, serverTutorGender, type TutorGender } from "@/lib/chatPartner";
import { interfaceLanguagePromptLabel, isLearningLanguageCode, learningLanguageName } from "@/lib/learningLanguages";
import { tutorPersona } from "@/lib/tutorPersona";

export const dynamic = "force-dynamic";

/** 튜터 요약을 쓸 목소리: 앱 언어 이름·학습 언어 이름·튜터 이름·말투(lib/tutorPersona.ts). */
function summaryVoice(target: string, locale: string, gender: TutorGender) {
  const persona = tutorPersona(target, gender);
  return {
    language: interfaceLanguagePromptLabel(locale),
    target: learningLanguageName(target),
    name: chatPartnerForLanguage(target, gender).givenName,
    manner: persona ? `${persona.personality}; ${persona.talk}` : "warm and plain",
  };
}

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

  // 통화가 끝난 접기(final)면 튜터 요약도 — 앱 언어로, 고른 튜터의 이름·말투로(2026-11-06).
  const summary =
    body.final === true && typeof body.locale === "string" && isLearningLanguageCode(body.locale)
      ? summaryVoice(scenario.language, body.locale, serverTutorGender(scenario.language, body.tutorGender))
      : null;

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
            ...(summary ? { summary } : {}),
          }),
        },
      ],
      response_format: { type: "json_object" },
      max_tokens: summary ? 800 : 500, // Claude 여유(2026-10-22). 노트와 사실 목록(+ 끝이면 튜터 요약).
    });
    const folded = parseMemory(completion.choices[0]?.message?.content ?? "");
    if (!folded) {
      return jsonWithCors(request, { error: "NO_CONTEXT" }, { status: 502 });
    }
    return jsonWithCors(request, { notes: folded.notes, facts: folded.facts, ...(summary && folded.summary ? { summary: folded.summary } : {}) });
  } catch (error) {
    console.error("[roleplay/context]", error);
    return jsonWithCors(request, { error: "CONTEXT_FAILED" }, { status: 502 });
  }
}
