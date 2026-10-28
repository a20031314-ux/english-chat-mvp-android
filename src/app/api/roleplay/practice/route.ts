import { fastestEffort, isReasoningModel } from "@/lib/server/llm";
import { completeChat, routeFor } from "@/lib/server/llm";
import { NextRequest, after } from "next/server";
import { recordPronunciation } from "@/lib/server/growthStore";
import { takeScriptLine } from "@/lib/server/entitlementStore";
import { studyTick } from "@/lib/server/profileContext";
import { resolveRequestEntitlement } from "@/lib/server/premiumRequest";
import { localDay, parseOffset, TZ_OFFSET_HEADER } from "@/lib/billing/plans";
import { requestUserId } from "@/lib/server/premiumRequest";
import { coerceLanguageCode, interfaceLanguageName } from "@/lib/learningLanguages";
import { findScenario } from "@/lib/roleplay/catalog";
import { compareToTarget, frameUsePrompt, ownWordsPrompt, parsePractice, practicePrompt, recallPrompt, type Practice } from "@/lib/roleplay/practice";
import { noteMostlyUi } from "@/lib/notes/notebook";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { meterRequest } from "@/lib/server/meterRequest";
import { getOpenAIClient } from "@/lib/server/openai";

export const dynamic = "force-dynamic";

/**
 * Reading one attempt at a line the review handed them.
 *
 * The comparison is done before the model is asked anything — which word came
 * out as which is arithmetic, not judgement, and doing it here means the model
 * is handed a finding rather than trusted to make one. What it adds is the
 * sentence a person would say about that finding.
 *
 * So it runs on the fast model rather than the review's. Measured on real
 * attempts, the reasoning model took twelve to twenty-two seconds and dropped
 * one answer in three by spending its budget before it wrote any JSON — which
 * is nothing in a review someone reads once, and fatal in a loop whose whole
 * point is saying the line again and again. The finding is already made; this
 * is phrasing.
 */
function practiceModel(): string {
  return routeFor("roleplayPractice").model;
}

export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request);
}

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
  const target = typeof body.target === "string" ? body.target.trim().slice(0, 200) : "";
  const heard = typeof body.heard === "string" ? body.heard.trim().slice(0, 200) : "";
  if (!target) {
    return jsonWithCors(request, { error: "nothing to say back" }, { status: 400 });
  }

  // My 단계 대본의 줄(scriptId): 요금별 하루 한도(plans.ts dailyScriptLines) — 무료는 이것만 쓰므로 원가의 끝이 여기.
  if (typeof body.scriptId === "string" && body.scriptId) {
    const { userId, terms } = await resolveRequestEntitlement(request);
    const day = localDay(Date.now(), parseOffset(request.headers.get(TZ_OFFSET_HEADER)));
    if (!(await takeScriptLine(userId, terms.dailyScriptLines, day))) {
      return jsonWithCors(request, { error: "SCRIPT_LIMIT", limit: terms.dailyScriptLines }, { status: 429 });
    }
    // 대본·문장구조 한 줄을 말함 — 프로필 공부 기록 "말한 문장"(들린 말이 있을 때만).
    if (heard) after(() => studyTick(request, "lines"));
  }

  await meterRequest(request, "roleplayPractice");

  const comparison = compareToTarget(target, heard);
  // Saying a line again is what grows pronunciation (learner/growth.ts): an
  // attempt when something was heard, a point when every word came out right.
  if (heard && typeof body.meaning !== "string" && typeof body.frame !== "string") {
    after(() =>
      recordPronunciation({ userId: requestUserId(request), language: scenario.language, clean: comparison.clean }),
    );
  }
  try {
    const model = practiceModel();
    const reasoning = isReasoningModel(model);
    const nativeCode = coerceLanguageCode(body.nativeLanguage);
    const nativeName = interfaceLanguageName(nativeCode);
    // "내 말로"(단계 대본 3~5단계): meaning = 보여 준 뜻(앱 언어), before = 바로 앞 상대 줄. 낱말 비교 대신 뜻이 통하는지.
    const meaning = typeof body.meaning === "string" ? body.meaning.trim().slice(0, 300) : "";
    const before = typeof body.before === "string" ? body.before.trim().slice(0, 300) : "";
    // 틀 "내 말로"(3단계~): frame = 틀 모양, meaning = 그 틀이 하는 일. 빈칸은 학습자가 고른 말 — 틀을 맞게 썼는지.
    const frame = typeof body.frame === "string" ? body.frame.trim().slice(0, 200) : "";
    // 대본·문장구조를 보지 않고 떠올려 말함(첫 글자만·가리기·문장구조만): 맞게 바꿔 말한 것도 통과(2026-10-28). 따라 말하기(mode "shadow")만 원문 그대로.
    // 2.76 첫 빌드는 mode를 안 보내 — 대본 줄(scriptId)이면 떠올리기로 본다.
    const recalled = typeof body.scriptId === "string" && body.mode !== "shadow";
    // 받아쓰기가 망설인 낱말(앱이 listen의 clarity로 고름) — 맞게 받아쓴 낱말이지만 소리가 흐렸을 수 있어 한마디에 짚는다.
    const unclear = Array.isArray(body.unclear)
      ? (body.unclear as unknown[]).filter((word): word is string => typeof word === "string" && word.trim().length > 0 && word.length <= 40).slice(0, 3)
      : [];
    const system = frame
      ? frameUsePrompt({ frame, meaning, example: target, heard, targetLanguage: interfaceLanguageName(scenario.language), nativeLanguage: nativeName })
      : meaning
      ? ownWordsPrompt({ meaning, reference: target, heard, before, targetLanguage: interfaceLanguageName(scenario.language), nativeLanguage: nativeName })
      : recalled
      ? recallPrompt({ target, heard, comparison, targetLanguage: interfaceLanguageName(scenario.language), nativeLanguage: nativeName, unclear })
      : practicePrompt({
          target,
          heard,
          comparison,
          unclear,
          targetLanguage: interfaceLanguageName(scenario.language),
          nativeLanguage: nativeName,
        });
    type Turn = { role: "system" | "user" | "assistant"; content: string };
    const ask = (messages: Turn[]) =>
      completeChat(client, "roleplayPractice", {
        messages,
        response_format: { type: "json_object" },
        ...(reasoning
          ? { max_completion_tokens: 2000, reasoning_effort: fastestEffort(model) as "minimal" }
          : { max_tokens: 300 }),
      });
    // The note sometimes comes back in the learning language (2026-10-27: a Japanese
    // note for a Korean reader); ask once more, naming the miss, when it is not in the
    // interface script.
    const messages: Turn[] = [
      { role: "system", content: system },
      { role: "user", content: `JSON, with the note in ${nativeName}.` },
    ];
    let practice: Practice | null = null;
    for (let attempt = 0; attempt < 2; attempt += 1) {
      const completion = await ask(messages);
      const raw = completion.choices[0]?.message?.content ?? "";
      practice = parsePractice(raw);
      if (!practice || noteMostlyUi(practice.note, nativeCode)) break;
      messages.push(
        { role: "assistant", content: raw },
        { role: "user", content: `That note is not in ${nativeName}. Give the same JSON with the note rewritten in ${nativeName}; quote words of the sentence only where needed.` },
      );
    }
    if (!practice) {
      return jsonWithCors(request, { error: "NO_PRACTICE" }, { status: 502 });
    }
    return jsonWithCors(request, { ...practice, outcomes: comparison.outcomes });
  } catch (error) {
    console.error("[roleplay/practice]", error);
    return jsonWithCors(request, { error: "PRACTICE_FAILED" }, { status: 502 });
  }
}
