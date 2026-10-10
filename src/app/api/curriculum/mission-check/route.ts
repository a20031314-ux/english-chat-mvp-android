import { NextRequest, after } from "next/server";
import { getOpenAIClient } from "@/lib/server/openai";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { meterRequest } from "@/lib/server/meterRequest";
import { resolveRequestEntitlement } from "@/lib/server/premiumRequest";
import { isIdentified } from "@/lib/server/identity";
import { getDailyUsed, incrementDailyUsed } from "@/lib/server/entitlementStore";
import { readCurriculum, readMissions, recordMissionCheck } from "@/lib/server/curriculumStore";
import { observeChatLines, observeChatTurn } from "@/lib/server/learnerProfileStore";
import { FREE_DAILY_CHAT_LIMIT } from "@/lib/billing/config";
import { checkSystemPrompt, normalizeCheck } from "@/lib/curriculum/missions";
import { targetLanguageFocusHints } from "@/lib/languageFocus";
import { explanationInLearningLanguage } from "@/lib/languageLearningAnalysis";
import {
  INTERFACE_LANGUAGE_LABELS,
  coerceLanguageCode,
  learningLanguageName,
} from "@/lib/learningLanguages";

export const dynamic = "force-dynamic";

/**
 * Check one answer to a mission.
 *
 * A try is a sent chat: it counts against the same daily limit, whatever
 * language it is in, and it feeds the learner's needs the way a chat line
 * does. Hints are not asked for here; they were written with the missions.
 */
const MODEL = () => process.env.OPENAI_MISSION_MODEL?.trim() || "gpt-4.1-mini";
const MAX_ANSWER_CHARS = 400;

export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request);
}

export async function POST(request: NextRequest) {
  const openai = getOpenAIClient();
  if (!openai) {
    return jsonWithCors(request, { error: "MISSING_OPENAI_KEY" }, { status: 503 });
  }
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return jsonWithCors(request, { error: "Invalid JSON" }, { status: 400 });
  }
  const language = coerceLanguageCode(body.language);
  const mapId = typeof body.mapId === "string" ? body.mapId : "";
  const topicId = typeof body.topicId === "string" ? body.topicId : "";
  const missionId = typeof body.missionId === "string" ? body.missionId : "";
  const answer =
    typeof body.answer === "string" ? body.answer.replace(/\s+/g, " ").trim().slice(0, MAX_ANSWER_CHARS) : "";
  const hints = typeof body.hints === "number" ? body.hints : 0;
  const tries = typeof body.tries === "number" ? body.tries : 1;
  if (!mapId || !topicId || !missionId || !answer) {
    return jsonWithCors(request, { error: "answer required" }, { status: 400 });
  }

  const { userId, isPremium } = await resolveRequestEntitlement(request);
  if (!isIdentified(userId)) {
    return jsonWithCors(request, { error: "IDENTITY_REQUIRED" }, { status: 401 });
  }
  const record = await readCurriculum(userId, language);
  if (!record || record.map.id !== mapId) {
    return jsonWithCors(request, { error: "MAP_CHANGED" }, { status: 409 });
  }
  const topic = record.map.topics.find((t) => t.id === topicId);
  const missions = (await readMissions(userId, language, mapId))[topicId];
  const mission = missions?.missions.find((m) => m.id === missionId);
  if (!topic || !mission) {
    return jsonWithCors(request, { error: "MAP_CHANGED" }, { status: 409 });
  }

  if (!isPremium && (await getDailyUsed(userId)) >= FREE_DAILY_CHAT_LIMIT) {
    return jsonWithCors(request, { error: "DAILY_LIMIT_REACHED" }, { status: 403 });
  }
  void meterRequest(request, "missionCheck");

  const target = learningLanguageName(language);
  const uiName = INTERFACE_LANGUAGE_LABELS[record.map.uiLanguage] ?? "Korean";
  const messages = [
    {
      role: "system" as const,
      content: checkSystemPrompt({ target, uiName, focus: targetLanguageFocusHints(language) }),
    },
    {
      role: "user" as const,
      content: JSON.stringify({
        situation: `${topic.title} — ${topic.summary}`,
        task: mission.task,
        exampleAnswer: mission.answer,
        learnerAnswer: answer,
      }),
    },
  ];
  const ask = async (extra?: string) => {
    const completion = await openai.chat.completions.create({
      model: MODEL(),
      temperature: 0.2,
      max_tokens: 400,
      response_format: { type: "json_object" },
      messages: extra ? [...messages, { role: "system" as const, content: extra }] : messages,
    });
    return normalizeCheck(JSON.parse(completion.choices[0]?.message?.content ?? "{}"), answer);
  };
  try {
    let check = await ask();
    if (!check) return jsonWithCors(request, { error: "CHECK_FAILED" }, { status: 502 });
    // Seen with Japanese learners in a Korean app: the feedback came back in
    // Japanese, praising them in the language they cannot yet read easily.
    // Asked once more, plainly; if it still is, the line goes and the verdict
    // and correction speak for themselves.
    const uiCode = record.map.uiLanguage;
    if (check.feedback && explanationInLearningLanguage(check.feedback, uiCode, language)) {
      void meterRequest(request, "missionCheck");
      const again = await ask(`Your "feedback" was written in ${target}. Write it in ${uiName}; keep everything else the same.`);
      const feedback =
        again?.feedback && !explanationInLearningLanguage(again.feedback, uiCode, language) ? again.feedback : "";
      check = { ...check, feedback };
    }
    if (!isPremium) await incrementDailyUsed(userId);

    const saved = await recordMissionCheck({
      userId,
      language,
      mapId,
      topicId,
      missionId,
      verdict: check.verdict,
      hints,
      tries,
    });

    // The answer is a line they produced, read for what it shows about their
    // sentences, the same as a chat line (learner/profile.ts, comprehension.ts).
    after(async () => {
      await observeChatLines({
        userId,
        language,
        tutorLine: check.reply,
        learnerLine: { sentence: answer, corrected: check.better || answer },
      });
      await observeChatTurn({ openai, userId, language, sentence: answer, corrected: check.better || answer });
    });

    return jsonWithCors(request, {
      check,
      ...(saved ? { results: saved.topic.results, status: saved.status } : {}),
    });
  } catch (error) {
    console.error("[mission-check]", error);
    return jsonWithCors(request, { error: "CHECK_FAILED" }, { status: 502 });
  }
}
