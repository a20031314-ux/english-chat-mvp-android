import { NextRequest } from "next/server";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { isIdentified } from "@/lib/server/identity";
import { resolveRequestEntitlement } from "@/lib/server/premiumRequest";
import { getDailyUsed, incrementDailyUsed } from "@/lib/server/entitlementStore";
import { chatBonusToday } from "@/lib/server/adChat";
import { meterRequest, simDetail } from "@/lib/server/meterRequest";
import { getOpenAIClient } from "@/lib/server/openai";
import { completeChat } from "@/lib/server/llm";
import { recordAsked } from "@/lib/server/stageScriptStore";
import { MAX_ASK_CHARS, askPrompt, parseAskAnswer, parseTopics } from "@/lib/curriculum/ask";
import { isCurriculumKey } from "@/lib/curriculum/dailyPlan";
import { coerceLanguageCode, INTERFACE_LANGUAGE_LABELS, isInterfaceLanguage, learningLanguageName } from "@/lib/learningLanguages";

export const dynamic = "force-dynamic";

/**
 * 오늘 배운 것에 직접 묻기(My 오늘 할 것 끝, lib/curriculum/ask.ts). 라이트·플러스·프리미엄만(사용자 2026-10-28 "유료만"),
 * 한 번 = 채팅 1회. 질문·답 글은 남기지 않고, 질문이 걸린 곳(문법·문장구조·표현 열쇠)만 stageScripts:v1 asked·review에.
 *
 * POST { language, interfaceLanguage, question, topics: [{ key, label }] } → { answer, about, review }
 */
export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request);
}

const PAID = new Set(["lite", "plus", "premium"]);

export async function POST(request: NextRequest) {
  const openai = getOpenAIClient();
  if (!openai) return jsonWithCors(request, { error: "MISSING_OPENAI_KEY" }, { status: 503 });
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return jsonWithCors(request, { error: "Invalid JSON" }, { status: 400 });
  }
  const question = typeof body.question === "string" ? body.question.replace(/\s+/g, " ").trim().slice(0, MAX_ASK_CHARS) : "";
  if (question.length < 2) return jsonWithCors(request, { error: "question required" }, { status: 400 });
  const language = coerceLanguageCode(body.language);
  const ui = typeof body.interfaceLanguage === "string" && isInterfaceLanguage(body.interfaceLanguage) ? body.interfaceLanguage : "ko";
  const topics = parseTopics(body.topics, (key) => isCurriculumKey(language, key));

  const { userId, tier, terms } = await resolveRequestEntitlement(request);
  if (!isIdentified(userId)) return jsonWithCors(request, { error: "IDENTITY_REQUIRED" }, { status: 401 });
  if (!PAID.has(tier)) return jsonWithCors(request, { error: "PAID_ONLY" }, { status: 402 });
  const chatLimit = terms.dailyChat;
  if (chatLimit !== null && (await getDailyUsed(userId)) >= chatLimit + (await chatBonusToday(userId, tier))) {
    return jsonWithCors(request, { error: "DAILY_LIMIT_REACHED" }, { status: 403 });
  }

  await meterRequest(request, "learnerAsk");
  try {
    const completion = await completeChat(openai, "learnerAsk", {
      temperature: 0.3,
      max_tokens: 500,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: askPrompt({ uiName: INTERFACE_LANGUAGE_LABELS[ui] ?? "Korean", targetName: learningLanguageName(language) }) },
        { role: "user", content: JSON.stringify({ question, topics }) },
      ],
    });
    const raw = completion.choices[0]?.message?.content ?? "";
    const parsed = parseAskAnswer(raw, new Set(topics.map((topic) => topic.key)));
    if (!parsed) return jsonWithCors(request, { error: "ASK_FAILED", ...simDetail(request, `unparsed: ${raw}`) }, { status: 502 });
    await incrementDailyUsed(userId);
    const review = parsed.about.length ? await recordAsked(userId, language, parsed.about) : undefined;
    return jsonWithCors(request, { ...parsed, ...(review ? { review } : {}) });
  } catch (error) {
    console.error("[curriculum/ask]", error);
    return jsonWithCors(request, { error: "ASK_FAILED", ...simDetail(request, error) }, { status: 502 });
  }
}
