import { completeChat } from "@/lib/server/llm";
import { NextRequest } from "next/server";
import { getOpenAIClient } from "@/lib/server/openai";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { meterRequest, simDetail } from "@/lib/server/meterRequest";
import { resolveRequestEntitlement } from "@/lib/server/premiumRequest";
import { isIdentified } from "@/lib/server/identity";
import { getDailyOpUsed } from "@/lib/server/entitlementStore";
import { saveNewMap } from "@/lib/server/curriculumStore";
import { readComprehension, readLearnerProfile } from "@/lib/server/learnerProfileStore";
import { itemsIn } from "@/lib/learner/comprehension";
import { profileBrief } from "@/lib/learner/profile";
import { FREE_DAILY_MAP_LIMIT, PREMIUM_DAILY_MAP_LIMIT } from "@/lib/billing/config";
import { normalizeMap, type StudyMap } from "@/lib/curriculum/map";
import { mapSystemPrompt, mapUserMessage } from "@/lib/curriculum/prompt";
import { parseSelfCheck, pitchFor, selfCheckMapRules } from "@/lib/learner/selfCheck";
import { saveSelfCheck } from "@/lib/server/selfCheckStore";
import { stageById, stageScopeForPrompt } from "@/lib/curriculum/stages";
import { forgetLearnerBrief } from "@/lib/server/learnerBrief";
import { currentLibraryPack } from "@/lib/videoLibrary/catalog";
import {
  INTERFACE_LANGUAGE_LABELS,
  coerceLanguageCode,
  learningLanguageName,
} from "@/lib/learningLanguages";

export const dynamic = "force-dynamic";
// 고가 모델(Sonnet)로 그리면 35~46초(2026-10-22 비교) — 60초에 가까워 넉넉히.
export const maxDuration = 120;

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
  // Ticked instead of written (learner/selfCheck.ts): no level is asked for,
  // and the map is pitched from the answers. A level sent by an older build
  // is still honoured.
  const selfCheck = parseSelfCheck(body.selfCheck, Date.now());
  const level = LEVELS.includes(body.level as StudyMap["level"])
    ? (body.level as StudyMap["level"])
    : selfCheck
      ? pitchFor(selfCheck)
      : "beginner";
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
  if (selfCheck) {
    await saveSelfCheck(userId, targetCode, selfCheck).catch(() => undefined);
    await forgetLearnerBrief(userId, targetCode);
  }

  const pack = currentLibraryPack(targetCode);
  const library = (pack?.clips ?? []).map((clip) => ({ videoId: clip.videoId, title: clip.title }));
  // What their chats have shown, and the plan they chose, shape the map.
  // A learner with no history and the default plan adds nothing.
  const [profile, comprehension] = await Promise.all([
    readLearnerProfile(userId, targetCode),
    readComprehension(userId, targetCode),
  ]);
  const brief = {
    ...profileBrief(profile),
    understoodNotUsed: itemsIn(comprehension, "understood", 10).map((item) => item.text),
    studied: itemsIn(comprehension, "studied", 10).map((item) => item.text),
  };
  const hasHistory =
    profile.turns > 0 || profile.updatedAt > 0 || Object.keys(comprehension.items).length > 0;
  // 대화 예시로 고른 단계가 이 학습 언어의 것이면 그 범위 안에서만 그린다(curriculum/stages).
  const stage = selfCheck?.stage ? stageById(selfCheck.stage) : null;
  const stageForMap = stage && stage.id.startsWith(`${targetCode}-`) ? stage : null;
  const input = {
    goal,
    ...(stageForMap ? { stageScope: stageScopeForPrompt(stageForMap, learningLanguageName(targetCode)) } : {}),
    level,
    target: learningLanguageName(targetCode),
    uiName: INTERFACE_LANGUAGE_LABELS[uiCode] ?? "Korean",
    library,
    ...(hasHistory ? { learner: brief } : {}),
    ...(selfCheck ? { selfCheck: selfCheckMapRules(selfCheck) } : {}),
  };

  try {
    // 지도 그리기는 따로(curriculumMap, 코드 기본값 Sonnet) — 먼저 생각하게 둔다(think): 끄면 지도가 얇아졌다(2026-10-22 점검).
    // 얇은 지도(주제 0개)가 28번 중 2번 와서(2026-10-22 release271) 시간이 남으면 한 번 더 그린다(한 번 36~52초, maxDuration 120).
    const startedAt = Date.now();
    const drawOnce = async () => {
      const completion = await completeChat(openai, "curriculumMap", {
        temperature: 0.4,
        // Claude는 같은 한국어·일본어 글에 토큰을 더 많이 써서 4000이면 지도 JSON이 중간에 끊겼다(2026-10-22 점검, 세 조합 모두 MAP_FAILED).
        max_tokens: 8000,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: mapSystemPrompt(input) },
          { role: "user", content: mapUserMessage(input) },
        ],
      }, { think: true });
      if (completion.choices[0]?.finish_reason === "length") throw new Error("map cut off at max_tokens");
      const drawn = JSON.parse(completion.choices[0]?.message?.content ?? "{}") as unknown;
      const normalized = normalizeMap(drawn, {
        id: crypto.randomUUID(),
        language: targetCode,
        uiLanguage: uiCode,
        goal,
        level,
        createdAt: new Date().toISOString(),
        libraryVideoIds: library.map((clip) => clip.videoId),
        ...(stageForMap ? { stageId: stageForMap.id } : {}),
      });
      return { raw: drawn, result: normalized };
    };
    let { raw, result } = await drawOnce();
    if (!result && Date.now() - startedAt < 55_000) {
      console.error("[curriculum] map too thin, drawing again", { model: MODEL() });
      ({ raw, result } = await drawOnce());
    }
    if (!result) {
      console.error("[curriculum] map too thin to keep", { model: MODEL() });
      // 점검 사용자에게만: 무엇이 왔는지(어떤 모양이라 버려졌는지 보려고).
      const shape = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
      const topicsIn = Array.isArray(shape.topics) ? shape.topics : [];
      const why = `map too thin: keys=${Object.keys(shape).join(",")} topics=${topicsIn.length} first=${JSON.stringify(topicsIn[0] ?? shape).slice(0, 220)}`;
      return jsonWithCors(request, { error: "MAP_FAILED", ...simDetail(request, why) }, { status: 502 });
    }
    if (result.dropped.length) console.log("[curriculum] dropped", result.dropped);
    const record = await saveNewMap(userId, result.map);
    return jsonWithCors(request, record);
  } catch (error) {
    console.error("[curriculum]", error);
    return jsonWithCors(request, { error: "MAP_FAILED", ...simDetail(request, error) }, { status: 502 });
  }
}
