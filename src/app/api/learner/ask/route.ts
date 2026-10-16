import { NextRequest } from "next/server";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { isIdentified } from "@/lib/server/identity";
import { resolveRequestEntitlement } from "@/lib/server/premiumRequest";
import { getDailyUsed, incrementDailyUsed } from "@/lib/server/entitlementStore";
import { FREE_DAILY_CHAT_LIMIT } from "@/lib/billing/config";
import { meterRequest } from "@/lib/server/meterRequest";
import { chatModel, getOpenAIClient } from "@/lib/server/openai";
import { readGrowth, readGrowthRecord } from "@/lib/server/growthStore";
import { readWeakRecord } from "@/lib/server/weakPointStore";
import { readSelfCheck } from "@/lib/server/selfCheckStore";
import { readLearnerBrief } from "@/lib/server/learnerBrief";
import { recentStuckPhrases } from "@/lib/learner/growth";
import { RECUR_WINDOW_MS } from "@/lib/curriculum/weakPoints";
import { MAX_QUESTION_CHARS, askData, askSystemPrompt, parseAnswer } from "@/lib/learner/ask";
import {
  coerceLanguageCode,
  INTERFACE_LANGUAGE_LABELS,
  isInterfaceLanguage,
  learningLanguageName,
} from "@/lib/learningLanguages";

export const dynamic = "force-dynamic";

/**
 * A question about the learner's own progress, answered from what is kept
 * (learner/ask.ts). One model call, counted like a chat message; the question
 * itself is not stored.
 *
 * POST { language, interfaceLanguage, question } → { answer, grow }
 */
export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request);
}

const DAY = 24 * 60 * 60 * 1000;

export async function POST(request: NextRequest) {
  const openai = getOpenAIClient();
  if (!openai) return jsonWithCors(request, { error: "MISSING_OPENAI_KEY" }, { status: 503 });
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return jsonWithCors(request, { error: "Invalid JSON" }, { status: 400 });
  }
  const question = typeof body.question === "string" ? body.question.replace(/\s+/g, " ").trim().slice(0, MAX_QUESTION_CHARS) : "";
  if (question.length < 2) return jsonWithCors(request, { error: "question required" }, { status: 400 });
  const language = coerceLanguageCode(body.language);
  const ui = typeof body.interfaceLanguage === "string" && isInterfaceLanguage(body.interfaceLanguage) ? body.interfaceLanguage : "ko";

  const { userId, isPremium } = await resolveRequestEntitlement(request);
  if (!isIdentified(userId)) return jsonWithCors(request, { error: "IDENTITY_REQUIRED" }, { status: 401 });
  if (!isPremium && (await getDailyUsed(userId)) >= FREE_DAILY_CHAT_LIMIT) {
    return jsonWithCors(request, { error: "DAILY_LIMIT_REACHED" }, { status: 403 });
  }

  const now = Date.now();
  const [growth, record, weak, selfCheck, brief] = await Promise.all([
    readGrowth(userId, language, null, now),
    readGrowthRecord(userId, language),
    readWeakRecord(userId, language),
    readSelfCheck(userId, language),
    readLearnerBrief(userId, language, now),
  ]);
  const mistakes = Object.values(weak.patterns)
    .map((p) => ({ name: p.name, times: p.misses.filter((at) => now - at <= RECUR_WINDOW_MS).length }))
    .filter((m) => m.times > 0)
    .sort((a, b) => b.times - a.times)
    .slice(0, 5);
  const stuckLast14 = Object.entries(record.stuck?.days ?? {}).reduce((sum, [day, n]) => {
    return Date.parse(`${day}T00:00:00Z`) >= now - 14 * DAY ? sum + n : sum;
  }, 0);

  await meterRequest(request, "learnerAsk");
  try {
    const completion = await openai.chat.completions.create({
      model: chatModel(),
      temperature: 0.4,
      max_tokens: 400,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: askSystemPrompt({ uiName: INTERFACE_LANGUAGE_LABELS[ui] ?? "Korean", targetName: learningLanguageName(language) }),
        },
        {
          role: "user",
          content: JSON.stringify({
            question,
            data: JSON.parse(
              askData({
                growth,
                mistakes,
                stuckLast14,
                stuckPhrases: recentStuckPhrases(record, now, 5, 14 * DAY),
                selfCheck,
                tutorNotes: brief.notes.map((note) => note.kind),
              }),
            ),
          }),
        },
      ],
    });
    const parsed = parseAnswer(completion.choices[0]?.message?.content ?? "");
    if (!parsed) return jsonWithCors(request, { error: "ASK_FAILED" }, { status: 502 });
    if (!isPremium) await incrementDailyUsed(userId);
    return jsonWithCors(request, parsed);
  } catch (error) {
    console.error("[learner/ask]", error);
    return jsonWithCors(request, { error: "ASK_FAILED" }, { status: 502 });
  }
}
