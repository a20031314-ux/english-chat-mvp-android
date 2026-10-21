import { completeChat } from "@/lib/server/llm";
import { NextRequest, after } from "next/server";
import { updateLedger } from "@/lib/server/ledgerStore";
import { applyMeet } from "@/lib/learner/ledger";
import type { Mission } from "@/lib/curriculum/missions";
import { getOpenAIClient } from "@/lib/server/openai";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { meterRequest } from "@/lib/server/meterRequest";
import { resolveRequestEntitlement } from "@/lib/server/premiumRequest";
import { isIdentified } from "@/lib/server/identity";
import { getDailyOpUsed } from "@/lib/server/entitlementStore";
import { readCurriculum, readMissions, saveTopicMissions } from "@/lib/server/curriculumStore";
import {
  FREE_DAILY_MISSION_SET_LIMIT,
  PREMIUM_DAILY_MISSION_SET_LIMIT,
} from "@/lib/billing/config";
import { listenForPhrases } from "@/lib/curriculum/map";
import {
  hasTopicMissions,
  withTopicMissions,
  missionsSystemPrompt,
  missionsUserMessage,
  normalizeMissions,
} from "@/lib/curriculum/missions";
import {
  INTERFACE_LANGUAGE_LABELS,
  coerceLanguageCode,
  learningLanguageName,
} from "@/lib/learningLanguages";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * A topic's missions: read if they were written before, written now if not.
 *
 * Written in the interface language the map was drawn in, not the one the app
 * happens to show now, so a topic reads the same as the map it belongs to.
 */
const SECTOR_NAMES: Record<string, string> = {
  A: "a situation",
  B: "expressions and grammar",
  C: "vocabulary",
  D: "pronunciation and listening",
};

export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request);
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return jsonWithCors(request, { error: "Invalid JSON" }, { status: 400 });
  }
  const language = coerceLanguageCode(body.language);
  const mapId = typeof body.mapId === "string" ? body.mapId : "";
  const topicId = typeof body.topicId === "string" ? body.topicId : "";
  if (!mapId || !topicId) {
    return jsonWithCors(request, { error: "mapId and topicId required" }, { status: 400 });
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
  if (!topic) return jsonWithCors(request, { error: "MAP_CHANGED" }, { status: 409 });

  // A topic can hold a mission added for a recurring mistake before it was
  // ever opened (weakPoints.ts); its own missions are still written then.
  const stored = (await readMissions(userId, language, mapId))[topicId];
  if (stored && hasTopicMissions(stored)) return jsonWithCors(request, stored);

  const openai = getOpenAIClient();
  // Whatever stops the topic's own missions being written, the ones already
  // added for mistakes can still be practised.
  if (!openai) {
    if (stored) return jsonWithCors(request, stored);
    return jsonWithCors(request, { error: "MISSING_OPENAI_KEY" }, { status: 503 });
  }
  const limit = isPremium ? PREMIUM_DAILY_MISSION_SET_LIMIT : FREE_DAILY_MISSION_SET_LIMIT;
  if ((await getDailyOpUsed(userId, "curriculumMissions")) >= limit) {
    if (stored) return jsonWithCors(request, stored);
    return jsonWithCors(request, { error: "MISSION_LIMIT_REACHED", limit }, { status: 429 });
  }
  await meterRequest(request, "curriculumMissions");

  const map = record.map;
  const chat = topic.activities.find((a) => a.tab === "chat");
  const listen = topic.activities.flatMap((a) => listenForPhrases(a));
  try {
    const completion = await completeChat(openai, "curriculum", {
      temperature: 0.5,
      // Claude는 같은 글에 토큰을 더 써서 넉넉히(2026-10-22, 지도 만들기가 4000에서 끊긴 것과 같은 이유).
      max_tokens: 3000,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: missionsSystemPrompt({
            target: learningLanguageName(language),
            uiName: INTERFACE_LANGUAGE_LABELS[map.uiLanguage] ?? "Korean",
            level: map.level,
          }),
        },
        {
          role: "user",
          content: missionsUserMessage({
            goal: map.goal,
            topic: { title: topic.title, summary: topic.summary, sector: SECTOR_NAMES[topic.sector] ?? "" },
            starter: chat?.starter,
            listenFor: listen,
          }),
        },
      ],
    });
    const missions = normalizeMissions(JSON.parse(completion.choices[0]?.message?.content ?? "{}"));
    if (!missions) {
      console.error("[missions] too few usable missions", { topic: topic.id });
      if (stored) return jsonWithCors(request, stored);
      return jsonWithCors(request, { error: "MISSIONS_FAILED" }, { status: 502 });
    }
    const latest = (await readMissions(userId, language, mapId))[topicId];
    const fresh = withTopicMissions(latest, missions);
    await saveTopicMissions(userId, language, mapId, topicId, fresh);
    // Each task's phrase is met — handed to them on the map (learner/ledger.ts).
    after(() =>
      recordMeetsForTasks(userId, language, mapId, topicId, missions),
    );
    return jsonWithCors(request, fresh);
  } catch (error) {
    console.error("[missions]", error);
    if (stored) return jsonWithCors(request, stored);
    return jsonWithCors(request, { error: "MISSIONS_FAILED" }, { status: 502 });
  }
}

function recordMeetsForTasks(userId: string, language: string, mapId: string, topicId: string, missions: Mission[]) {
  return updateLedger(userId, language, (ledger) =>
    missions.reduce(
      (l, m) =>
        m.expression
          ? applyMeet(l, m.expression, "task", { tab: "map" }, Date.now(), { mapId, topicId, missionId: m.id })
          : l,
      ledger,
    ),
  );
}
