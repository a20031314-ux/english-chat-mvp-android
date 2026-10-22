import { completeChat } from "@/lib/server/llm";
import { NextRequest } from "next/server";
import { getOpenAIClient } from "@/lib/server/openai";
import { corsPreflightResponse, jsonWithCors, streamWithCors } from "@/lib/server/cors";
import { meterRequest, simDetail } from "@/lib/server/meterRequest";
import { requestUserId } from "@/lib/server/premiumRequest";
import { resolveRequestEntitlement } from "@/lib/server/premiumRequest";
import { isIdentified } from "@/lib/server/identity";
import { getDailyOpUsed } from "@/lib/server/entitlementStore";
import { saveNewMap } from "@/lib/server/curriculumStore";
import { readComprehension, readLearnerProfile } from "@/lib/server/learnerProfileStore";
import { itemsIn } from "@/lib/learner/comprehension";
import { profileBrief } from "@/lib/learner/profile";
import { FREE_DAILY_MAP_LIMIT, PREMIUM_DAILY_MAP_LIMIT } from "@/lib/billing/config";
import { normalizeMap, type StudyMap } from "@/lib/curriculum/map";
import { fillGroups, mapFillPrompt, mapPlanPrompt, mapSystemPrompt, mapUserMessage, type PlannedTopic } from "@/lib/curriculum/prompt";
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
/**
 * 나눠 그리기 운영 스위치(Vercel MAP_SPLIT=0이면 예전 한 번에). 기본 켬(2026-10-23 운영 비교:
 * 한 번에 40~47초·재시도 85초 → 나눠서 33~43초, 뼈대는 19~30초에 화면에 보임, 주제·연습 수와 질은 같음).
 */
const mapSplitOn = () => (process.env.MAP_SPLIT?.trim() ?? "1") !== "0";

function thinWhy(raw: unknown): string {
  // 점검 사용자에게만: 무엇이 왔는지(어떤 모양이라 버려졌는지 보려고).
  const shape = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  const topicsIn = Array.isArray(shape.topics) ? shape.topics : [];
  return `map too thin: keys=${Object.keys(shape).join(",")} topics=${topicsIn.length} first=${JSON.stringify(topicsIn[0] ?? shape).slice(0, 220)}`;
}
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

  // 아래 안쪽 함수들이 쓴다(위에서 이미 없으면 503).
  const client = openai;
  const base = () => ({
    id: crypto.randomUUID(),
    language: targetCode,
    uiLanguage: uiCode,
    goal,
    level,
    createdAt: new Date().toISOString(),
    libraryVideoIds: library.map((clip) => clip.videoId),
    ...(stageForMap ? { stageId: stageForMap.id } : {}),
  });

  // 나눠 그리기(2026-10-23): 뼈대 짜기 → 주제 몇 개씩 연습 나란히 채우기. 운영 기본은 MAP_SPLIT(켜기 전엔 꺼짐),
  // 점검 사용자는 x-sim-map-split: 1/0으로 골라 비교한다. 새 앱은 stream:true로 진행·뼈대를 바로 받는다.
  const simUser = /^rc:simcheck-/.test(requestUserId(request));
  const simSplit = simUser ? request.headers.get("x-sim-map-split") : null;
  const split = simSplit === "1" || (simSplit !== "0" && mapSplitOn());
  const wantsStream = body.stream === true && split;
  // 뼈대 짜기에서 먼저 생각할지(운영 MAP_PLAN_THINK=1이면 켬, 기본 끔) — 뼈대만 쓰면 생각 없이도 주제 수·질이 같고 10초쯤 빠름
  // (2026-10-23 운영 비교 ja·en·es 6번 모두 9~12주제). 점검 사용자는 x-sim-map-think: 1/0으로 비교.
  const simThink = simUser ? request.headers.get("x-sim-map-think") : null;
  const planThinks = simThink === "1" || (simThink !== "0" && process.env.MAP_PLAN_THINK?.trim() === "1");

  if (!split) return drawWhole();

  if (!wantsStream) {
    const out = await drawSplit(() => undefined);
    return jsonWithCors(request, out.body, { status: out.status });
  }
  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (line: unknown) => controller.enqueue(encoder.encode(`${JSON.stringify(line)}\n`));
      try {
        const out = await drawSplit(send);
        send(out.status === 200 ? { type: "done", record: out.body } : { type: "error", status: out.status, ...out.body });
      } catch (error) {
        console.error("[curriculum-split-stream]", error);
        send({ type: "error", status: 502, error: "MAP_FAILED", ...simDetail(request, error) });
      }
      controller.close();
    },
  });
  return streamWithCors(request, stream);

  /** 예전처럼 한 번에(Sonnet, 먼저 생각). 나눠 그리기가 꺼져 있을 때. */
  async function drawWhole() {
    try {
      // 지도 그리기는 따로(curriculumMap, 코드 기본값 Sonnet) — 먼저 생각하게 둔다(think): 끄면 지도가 얇아졌다(2026-10-22 점검).
      // 얇은 지도(주제 0개)가 28번 중 2번 와서(2026-10-22 release271) 시간이 남으면 한 번 더 그린다(한 번 36~52초, maxDuration 120).
      const startedAt = Date.now();
      const drawOnce = async () => {
        const completion = await completeChat(client, "curriculumMap", {
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
        return { raw: drawn, result: normalizeMap(drawn, base()) };
      };
      let { raw, result } = await drawOnce();
      if (!result && Date.now() - startedAt < 55_000) {
        console.error("[curriculum] map too thin, drawing again", { model: MODEL() });
        ({ raw, result } = await drawOnce());
      }
      if (!result) {
        console.error("[curriculum] map too thin to keep", { model: MODEL() });
        return jsonWithCors(request, { error: "MAP_FAILED", ...simDetail(request, thinWhy(raw)) }, { status: 502 });
      }
      if (result.dropped.length) console.log("[curriculum] dropped", result.dropped);
      const record = await saveNewMap(userId, result.map);
      return jsonWithCors(request, record);
    } catch (error) {
      console.error("[curriculum]", error);
      return jsonWithCors(request, { error: "MAP_FAILED", ...simDetail(request, error) }, { status: 502 });
    }
  }

  /** 뼈대 → 채우기. send는 진행을 흘려 보낼 곳(스트림이 아니면 버림). */
  async function drawSplit(send: (line: unknown) => void): Promise<{ status: number; body: Record<string, unknown> }> {
    const startedAt = Date.now();
    try {
      send({ type: "step", step: "plan" });
      const planOnce = async () => {
        const completion = await completeChat(client, "curriculumMap", {
          temperature: 0.4,
          max_tokens: 6000,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: mapPlanPrompt(input) },
            { role: "user", content: mapUserMessage(input) },
          ],
        }, { think: planThinks });
        if (completion.choices[0]?.finish_reason === "length") throw new Error("plan cut off at max_tokens");
        const raw = JSON.parse(completion.choices[0]?.message?.content ?? "{}") as Record<string, unknown>;
        return { raw, skeleton: normalizeMap(raw, base()) };
      };
      let { raw, skeleton } = await planOnce();
      if (!skeleton && Date.now() - startedAt < 40_000) {
        console.error("[curriculum-split] plan too thin, again");
        ({ raw, skeleton } = await planOnce());
      }
      if (!skeleton) return { status: 502, body: { error: "MAP_FAILED", ...simDetail(request, thinWhy(raw)) } };
      const planAt = Date.now();
      const kept = new Set(skeleton.map.topics.map((t) => t.id));
      const planned: PlannedTopic[] = (Array.isArray(raw.topics) ? (raw.topics as Record<string, unknown>[]) : [])
        .map((t) => ({
          id: String(t?.id ?? "").toUpperCase(),
          sector: String(t?.sector ?? ""),
          title: String(t?.title ?? ""),
          summary: String(t?.summary ?? ""),
          order: skeleton!.map.topics.find((k) => k.id === String(t?.id ?? "").toUpperCase())?.order ?? 99,
          covers: typeof t?.covers === "string" ? t.covers.slice(0, 200) : "",
        }))
        .filter((t) => kept.has(t.id));
      const groups = fillGroups(planned);
      send({ type: "plan", map: skeleton.map, fill: { done: 0, total: groups.length } });

      const plan = { title: skeleton.map.title, topics: planned };
      const filled = new Map<string, Record<string, unknown>>();
      let done = 0;
      const fillOnce = async (ids: string[]) => {
        void meterRequest(request, "curriculumMapFill");
        const completion = await completeChat(client, "curriculumMapFill", {
          temperature: 0.4,
          max_tokens: 3500,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: mapFillPrompt(input, plan, ids) },
            { role: "user", content: JSON.stringify({ topics: ids }) },
          ],
        });
        if (completion.choices[0]?.finish_reason === "length") throw new Error("fill cut off at max_tokens");
        const out = JSON.parse(completion.choices[0]?.message?.content ?? "{}") as { topics?: unknown };
        const rows = Array.isArray(out.topics) ? (out.topics as Record<string, unknown>[]) : [];
        const got = rows.filter((row) => ids.includes(String(row?.id ?? "").toUpperCase()));
        if (!got.length) throw new Error(`fill returned none of ${ids.join(",")}`);
        return got;
      };
      await Promise.all(
        groups.map(async (ids) => {
          let rows: Record<string, unknown>[] = [];
          try {
            rows = await fillOnce(ids);
          } catch (error) {
            console.error("[curriculum-split] fill failed, again", ids, error);
            rows = await fillOnce(ids).catch((again) => {
              console.error("[curriculum-split] fill failed twice — topics kept without practice", ids, again);
              return [];
            });
          }
          for (const row of rows) filled.set(String(row.id).toUpperCase(), row);
          done += 1;
          send({ type: "step", step: "fill", done, total: groups.length });
        }),
      );

      // 뼈대 + 채운 것 → 예전과 같은 모양으로 한 번 더 걸러 저장.
      const merged = {
        ...raw,
        topics: (raw.topics as Record<string, unknown>[]).map((t) => {
          const row = filled.get(String(t?.id ?? "").toUpperCase());
          return { ...t, activities: row?.activities ?? [], links: row?.links ?? [] };
        }),
      };
      const result = normalizeMap(merged, { ...base(), id: skeleton.map.id, createdAt: skeleton.map.createdAt });
      if (!result) return { status: 502, body: { error: "MAP_FAILED", ...simDetail(request, "merged map too thin") } };
      if (result.dropped.length) console.log("[curriculum-split] dropped", result.dropped);
      console.log("[curriculum-split] ms", { plan: planAt - startedAt, fill: Date.now() - planAt, groups: groups.length, missing: planned.length - filled.size });
      const record = await saveNewMap(userId, result.map);
      return { status: 200, body: record as unknown as Record<string, unknown> };
    } catch (error) {
      console.error("[curriculum-split]", error);
      return { status: 502, body: { error: "MAP_FAILED", ...simDetail(request, error) } };
    }
  }
}
