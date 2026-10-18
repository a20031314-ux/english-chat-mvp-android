import { createHash } from "node:crypto";
import { NextRequest } from "next/server";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { chatModel, getOpenAIClient } from "@/lib/server/openai";
import { meterRequest } from "@/lib/server/meterRequest";
import { requestUserId } from "@/lib/server/premiumRequest";
import { isIdentified } from "@/lib/server/identity";
import { getDailyOpUsed } from "@/lib/server/entitlementStore";
import { kvGetJsonMany, kvSetJson } from "@/lib/server/kv";
import { coerceLanguageCode, learningLanguageName } from "@/lib/learningLanguages";
import { NOTE_OUTLINE, isNoteTopicId } from "@/lib/notes/outline";
import { placeKey, UNPLACED } from "@/lib/notes/notes";

export const dynamic = "force-dynamic";

/**
 * 노트의 어느 주제에 들어갈지: 표현·단어·문장을 고정 목차(장 8 × 주제 3) 중 하나로.
 *
 * 답은 사람과 상관없다 — "お会計お願いします"는 누구에게나 가게·식당이다. 그래서 학습 언어별로
 * 서버에 한 번 정해 두고 모두가 같이 쓴다(지우지 않음). 모델은 처음 보는 것만 묶어서 한 번.
 *
 * POST { language, texts: string[] (≤ 60) } → { places: { [placeKey]: topicId | "none" } }
 */
const MAX_TEXTS = 60;
/** 한 사람이 하루에 모델을 부르게 하는 횟수(묶음 단위). 공유 캐시라 대부분은 0번. */
const DAILY_CALLS = 40;

const cacheKey = (language: string, key: string) =>
  `notePlace:v1:${language}:${createHash("sha1").update(key).digest("hex").slice(0, 20)}`;

const TOPIC_LIST = NOTE_OUTLINE.flatMap((chapter) =>
  chapter.topics.map((topic) => `${topic.id} — ${chapter.name.en} / ${topic.name.en}: ${topic.about}`),
).join("\n");

export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request);
}

export async function POST(request: NextRequest) {
  const userId = requestUserId(request);
  if (!isIdentified(userId)) {
    return jsonWithCors(request, { error: "IDENTITY_REQUIRED" }, { status: 401 });
  }
  let body: Record<string, unknown> = {};
  try {
    body = await request.json();
  } catch {
    return jsonWithCors(request, { error: "Invalid JSON" }, { status: 400 });
  }
  const language = coerceLanguageCode(body.language);
  const texts = [
    ...new Map(
      (Array.isArray(body.texts) ? body.texts : [])
        .filter((t): t is string => typeof t === "string")
        .map((t) => t.slice(0, 200))
        .filter((t) => placeKey(t))
        .map((t) => [placeKey(t), t] as const),
    ).entries(),
  ].slice(0, MAX_TEXTS);
  if (!texts.length) return jsonWithCors(request, { places: {} });

  const cached = await kvGetJsonMany<string>(texts.map(([key]) => cacheKey(language, key)));
  const places: Record<string, string> = {};
  const missing: Array<[string, string]> = [];
  texts.forEach(([key, text], i) => {
    const hit = cached[i];
    if (hit && (hit === UNPLACED || isNoteTopicId(hit))) places[key] = hit;
    else missing.push([key, text]);
  });
  if (!missing.length) return jsonWithCors(request, { places });

  const openai = getOpenAIClient();
  if (!openai) return jsonWithCors(request, { places, pending: missing.length });
  if ((await getDailyOpUsed(userId, "notesPlace")) >= DAILY_CALLS) {
    return jsonWithCors(request, { places, pending: missing.length, limited: true });
  }
  await meterRequest(request, "notesPlace");

  try {
    const completion = await openai.chat.completions.create({
      model: chatModel(),
      temperature: 0,
      max_tokens: 1200,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            `You file ${learningLanguageName(language)} phrases, words and sentences that a learner met into the topics of a study notebook.\n` +
            `Topics (id — chapter / topic: what belongs there):\n${TOPIC_LIST}\n\n` +
            `For each numbered item pick the one topic where a learner would look for it: the situation it is used in, or what it talks about. ` +
            `A general word or phrase with no clear situation goes where it is most often used. Use "none" only for something that is not language ` +
            `(a name alone, a number, noise). Reply as JSON: {"places":[{"i":0,"topic":"<id or none>"}, ...]} with every item.`,
        },
        { role: "user", content: missing.map(([, text], i) => `${i}. ${text}`).join("\n") },
      ],
    });
    let parsed: { places?: Array<{ i?: unknown; topic?: unknown }> } = {};
    try {
      parsed = JSON.parse(completion.choices[0]?.message?.content ?? "{}");
    } catch {
      parsed = {};
    }
    const writes: Array<Promise<void>> = [];
    for (const row of parsed.places ?? []) {
      const i = typeof row.i === "number" ? row.i : Number(row.i);
      const pair = missing[i];
      if (!pair) continue;
      const topic = row.topic === UNPLACED || isNoteTopicId(row.topic) ? (row.topic as string) : null;
      if (!topic) continue;
      places[pair[0]] = topic;
      writes.push(kvSetJson(cacheKey(language, pair[0]), topic));
    }
    await Promise.all(writes);
    return jsonWithCors(request, { places, pending: missing.filter(([key]) => !places[key]).length });
  } catch (error) {
    console.error("[notes-place]", error);
    return jsonWithCors(request, { places, pending: missing.length });
  }
}
