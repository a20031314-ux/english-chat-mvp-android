import { NextRequest } from "next/server";
import { getOpenAIClient } from "@/lib/server/openai";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { meterRequest } from "@/lib/server/meterRequest";
import { resolveRequestEntitlement } from "@/lib/server/premiumRequest";
import { isIdentified } from "@/lib/server/identity";
import { getDailyOpUsed } from "@/lib/server/entitlementStore";
import { saveNewMap } from "@/lib/server/curriculumStore";
import { FREE_DAILY_MAP_LIMIT, PREMIUM_DAILY_MAP_LIMIT } from "@/lib/billing/config";
import { normalizeMap, type StudyMap } from "@/lib/curriculum/map";
import { mapSystemPrompt, mapUserMessage } from "@/lib/curriculum/prompt";
import { currentLibraryPack } from "@/lib/videoLibrary/catalog";
import {
  INTERFACE_LANGUAGE_LABELS,
  coerceLanguageCode,
  learningLanguageName,
} from "@/lib/learningLanguages";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Draw a study map from a goal the learner wrote.
 *
 * The one place the map is written by a model; everything after — opening a
 * topic, marking it, following a link — is plain reads and writes. The model is
 * a setting (OPENAI_CURRICULUM_MODEL) because this is the call most likely to
 * move to another provider, and nothing outside this file knows which it is:
 * the answer goes through normalizeMap either way.
 *
 * The goal is kept, with the map, because the map is about it and the screen
 * shows it back. Nothing else the learner has said is sent.
 */
const MODEL = () => process.env.OPENAI_CURRICULUM_MODEL?.trim() || "gpt-4.1";
const MAX_GOAL_CHARS = 300;
const LEVELS: StudyMap["level"][] = ["beginner", "intermediate", "advanced"];

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

  const goal = typeof body.goal === "string" ? body.goal.replace(/\s+/g, " ").trim().slice(0, MAX_GOAL_CHARS) : "";
  if (goal.length < 2) {
    return jsonWithCors(request, { error: "goal required" }, { status: 400 });
  }
  const level = LEVELS.includes(body.level as StudyMap["level"]) ? (body.level as StudyMap["level"]) : "beginner";
  const targetCode = coerceLanguageCode(body.targetLanguage);
  const uiCode =
    typeof body.interfaceLanguage === "string" && INTERFACE_LANGUAGE_LABELS[body.interfaceLanguage]
      ? body.interfaceLanguage
      : "ko";

  const { userId, isPremium } = await resolveRequestEntitlement(request);
  if (!isIdentified(userId)) {
    return jsonWithCors(request, { error: "IDENTITY_REQUIRED" }, { status: 401 });
  }
  const limit = isPremium ? PREMIUM_DAILY_MAP_LIMIT : FREE_DAILY_MAP_LIMIT;
  if ((await getDailyOpUsed(userId, "curriculumGenerate")) >= limit) {
    return jsonWithCors(request, { error: "MAP_LIMIT_REACHED", limit }, { status: 429 });
  }
  await meterRequest(request, "curriculumGenerate");

  const pack = currentLibraryPack(targetCode);
  const library = (pack?.clips ?? []).map((clip) => ({ videoId: clip.videoId, title: clip.title }));
  const input = {
    goal,
    level,
    target: learningLanguageName(targetCode),
    uiName: INTERFACE_LANGUAGE_LABELS[uiCode] ?? "Korean",
    library,
  };

  try {
    const completion = await openai.chat.completions.create({
      model: MODEL(),
      temperature: 0.4,
      max_tokens: 4000,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: mapSystemPrompt(input) },
        { role: "user", content: mapUserMessage(input) },
      ],
    });
    const raw = JSON.parse(completion.choices[0]?.message?.content ?? "{}") as unknown;
    const result = normalizeMap(raw, {
      id: crypto.randomUUID(),
      language: targetCode,
      uiLanguage: uiCode,
      goal,
      level,
      createdAt: new Date().toISOString(),
      libraryVideoIds: library.map((clip) => clip.videoId),
    });
    if (!result) {
      console.error("[curriculum] map too thin to keep", { model: MODEL() });
      return jsonWithCors(request, { error: "MAP_FAILED" }, { status: 502 });
    }
    if (result.dropped.length) console.log("[curriculum] dropped", result.dropped);
    const record = await saveNewMap(userId, result.map);
    return jsonWithCors(request, record);
  } catch (error) {
    console.error("[curriculum]", error);
    return jsonWithCors(request, { error: "MAP_FAILED" }, { status: 502 });
  }
}
