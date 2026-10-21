import { completeChat } from "@/lib/server/llm";
import { NextRequest } from "next/server";
import { getOpenAIClient } from "@/lib/server/openai";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { meterRequest } from "@/lib/server/meterRequest";
import { resolveRequestEntitlement } from "@/lib/server/premiumRequest";
import { isIdentified } from "@/lib/server/identity";
import { getDailyOpUsed } from "@/lib/server/entitlementStore";
import { readCurriculum, readMissions, saveTopicMissions } from "@/lib/server/curriculumStore";
import { updateLedger } from "@/lib/server/ledgerStore";
import { FREE_DAILY_MISSION_SET_LIMIT, PREMIUM_DAILY_MISSION_SET_LIMIT } from "@/lib/billing/config";
import {
  addWeakMission,
  normalizeWeakMission,
  pickMissionMessage,
  pickMissionPrompt,
} from "@/lib/curriculum/weakPoints";
import { applyMeet, isLedgerTab, ledgerKey } from "@/lib/learner/ledger";
import { INTERFACE_LANGUAGE_LABELS, coerceLanguageCode, learningLanguageName } from "@/lib/learningLanguages";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * "Put it on my map", from the sentence sheet: the words the learner picked
 * (or the whole sentence), and what they asked about it if they asked,
 * become one task on the map topic they fit best — practised first and marked
 * as their own choice (curriculum/missions.ts `picked`).
 *
 * POST { language, text, sentence, tab?, asked?: { question, answer } }
 *   → { topicId, topicTitle, missionId } | { error: "NO_MAP" | … }
 *
 * One model call; counted with the map's task writing and limited the same way.
 */

function clean(value: unknown, max: number): string {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim().slice(0, max) : "";
}

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
  const text = clean(body.text, 300);
  const sentence = clean(body.sentence, 400) || text;
  if (!text) return jsonWithCors(request, { error: "text required" }, { status: 400 });
  const askedRaw = (body.asked ?? null) as Record<string, unknown> | null;
  const asked =
    askedRaw && clean(askedRaw.question, 300) && clean(askedRaw.answer, 600)
      ? { question: clean(askedRaw.question, 300), answer: clean(askedRaw.answer, 600) }
      : undefined;

  const { userId, isPremium } = await resolveRequestEntitlement(request);
  if (!isIdentified(userId)) {
    return jsonWithCors(request, { error: "IDENTITY_REQUIRED" }, { status: 401 });
  }
  const record = await readCurriculum(userId, language);
  if (!record) return jsonWithCors(request, { error: "NO_MAP" }, { status: 409 });
  const openai = getOpenAIClient();
  if (!openai) return jsonWithCors(request, { error: "MISSING_OPENAI_KEY" }, { status: 503 });
  const limit = isPremium ? PREMIUM_DAILY_MISSION_SET_LIMIT : FREE_DAILY_MISSION_SET_LIMIT;
  if ((await getDailyOpUsed(userId, "curriculumMissions")) >= limit) {
    return jsonWithCors(request, { error: "LIMIT_REACHED", limit }, { status: 429 });
  }
  await meterRequest(request, "curriculumMissions");
  void meterRequest(request, "learnerPick");

  const map = record.map;
  const all = await readMissions(userId, language, map.id);
  // Already on the map as one of their picks: nothing to write twice.
  const key = ledgerKey(text);
  for (const [topicId, topic] of Object.entries(all)) {
    const existing = topic.missions.find((m) => m.picked && m.weak === `pick:${key}`);
    if (existing) {
      const t = map.topics.find((row) => row.id === topicId);
      return jsonWithCors(request, { topicId, topicTitle: t?.title ?? "", missionId: existing.id, already: true });
    }
  }

  const uiName = INTERFACE_LANGUAGE_LABELS[map.uiLanguage] ?? "Korean";
  try {
    const completion = await completeChat(openai, "curriculum", {
      temperature: 0.4,
      max_tokens: 500,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: pickMissionPrompt({ target: learningLanguageName(language), uiName, level: map.level }) },
        {
          role: "user",
          content: pickMissionMessage({
            picked: text,
            sentence,
            asked,
            goal: map.goal,
            topics: map.topics.map((t) => ({
              id: t.id,
              title: t.title,
              summary: t.summary,
              done: record.status[t.id] === "done",
            })),
          }),
        },
      ],
    });
    let parsed: unknown = null;
    try {
      parsed = JSON.parse(completion.choices[0]?.message?.content ?? "{}");
    } catch {
      parsed = null;
    }
    const placed = normalizeWeakMission(parsed, map.topics.map((t) => t.id), `pick:${key}`, {
      uiLanguage: map.uiLanguage,
      mistakeName: "",
    });
    if (!placed) return jsonWithCors(request, { error: "PICK_FAILED" }, { status: 502 });
    // A pick, not a weak spot: practised first and marked as their choice.
    // The key stays in `weak` only to find it again; `picked` is what counts.
    const mission = { ...placed.mission, picked: true };
    const fresh = (await readMissions(userId, language, map.id))[placed.topicId];
    const { topic, missionId } = addWeakMission(fresh, mission);
    await saveTopicMissions(userId, language, map.id, placed.topicId, topic);
    const tab = isLedgerTab(body.tab) ? body.tab : "chat";
    if (mission.expression) {
      await updateLedger(userId, language, (ledger) =>
        applyMeet(ledger, mission.expression!, "task", { tab }, Date.now(), {
          mapId: map.id,
          topicId: placed.topicId,
          missionId,
        }),
      );
    }
    const t = map.topics.find((row) => row.id === placed.topicId);
    return jsonWithCors(request, { topicId: placed.topicId, topicTitle: t?.title ?? "", missionId });
  } catch (error) {
    console.error("[curriculum-pick]", error);
    return jsonWithCors(request, { error: "PICK_FAILED" }, { status: 502 });
  }
}
