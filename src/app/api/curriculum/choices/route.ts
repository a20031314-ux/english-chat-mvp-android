import { NextRequest } from "next/server";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { meterRequest, simDetail } from "@/lib/server/meterRequest";
import { getOpenAIClient } from "@/lib/server/openai";
import { completeChat } from "@/lib/server/llm";
import { kvGetJson, kvSetJson, kvSetJsonIfAbsent } from "@/lib/server/kv";
import { scriptById } from "@/lib/curriculum/stageScripts";
import { applyCheck, checkInput, checkPrompt, choicesInput, choicesPrompt, parseChoices, type ScriptChoices } from "@/lib/curriculum/scriptChoice";
import { coerceLanguageCode, learningLanguageName } from "@/lib/learningLanguages";

export const dynamic = "force-dynamic";

/**
 * 대본 "고르기" 오답(2026-10-29 사용자 "객관식은 어휘적으로 헷갈리는 선택지, 문법적으로 헷갈리는 선택지 등 다양화"):
 * GET ?lang=&id= → { choices: { [줄 번호]: { blank, wrong: [{ text, type: grammar|vocab }] } } }
 * 대본마다 한 번 모델(`scriptChoices`, Sonnet)이 만들고, 한 번 더 확인해 정답처럼 받아들여질 오답을 뺀 뒤 모두가 같이 쓴다(`scriptChoices:v2:<언어>:<대본 id>`, 학습자 글 없음).
 * 대본은 정해진 목록이라 만드는 횟수도 정해져 있다. 만드는 중이면(다른 요청이 먼저) 빈 답 → 앱이 기기 규칙으로(curriculum/scriptChoice.ts ruleChoice).
 * 로그인 없이(무료 대본도 같은 화면).
 */
const TTL_SECONDS = 400 * 24 * 60 * 60;
const LOCK_SECONDS = 90;

function cacheKey(language: string, id: string): string {
  // v2(2026-10-29): 만든 뒤 한 번 더 확인 — 정답처럼 받아들여질 오답을 뺀다(v1은 확인 없이 만든 것이라 버림).
  return `scriptChoices:v2:${language}:${id}`;
}

export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request);
}

export async function GET(request: NextRequest) {
  const language = coerceLanguageCode(request.nextUrl.searchParams.get("lang"));
  const id = request.nextUrl.searchParams.get("id") ?? "";
  const script = scriptById(language, id);
  if (!script) return jsonWithCors(request, { error: "UNKNOWN_SCRIPT" }, { status: 400 });
  const key = cacheKey(language, id);
  const cached = await kvGetJson<ScriptChoices>(key).catch(() => null);
  if (cached) return jsonWithCors(request, { choices: cached });

  const lines = choicesInput(language, script);
  if (!lines.length) return jsonWithCors(request, { choices: {} });
  const openai = getOpenAIClient();
  if (!openai) return jsonWithCors(request, { choices: {} });
  // 같은 대본을 동시에 여러 번 만들지 않게.
  const locked = await kvSetJsonIfAbsent(`${key}:lock`, 1, LOCK_SECONDS).catch(() => false);
  if (!locked) return jsonWithCors(request, { choices: {}, pending: true });

  await meterRequest(request, "scriptChoices");
  try {
    const completion = await completeChat(openai, "scriptChoices", {
      temperature: 0.4,
      max_tokens: 1800,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: choicesPrompt({ targetName: learningLanguageName(language), stage: script.stage }) },
        { role: "user", content: JSON.stringify({ lines }) },
      ],
    });
    const raw = completion.choices[0]?.message?.content ?? "";
    let choices = parseChoices(raw, language, script);
    // 한 번 더(같은 모델): 오답을 빈칸에 넣은 문장을 원어민이 맞다고 볼 것이면 뺀다 — "when"↔"while", "سأ"↔"سوف" 같은 것.
    const items = checkInput(script, choices);
    if (items.length) {
      await meterRequest(request, "scriptChoices");
      const check = await completeChat(openai, "scriptChoices", {
        temperature: 0,
        max_tokens: 600,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: checkPrompt({ targetName: learningLanguageName(language) }) },
          { role: "user", content: JSON.stringify({ items }) },
        ],
      });
      choices = applyCheck(choices, check.choices[0]?.message?.content ?? "");
    }
    // 내 줄 절반 이상을 못 만들었으면 저장하지 않는다(다음에 다시 만듦) — 이번엔 받은 것만.
    if (Object.keys(choices).length * 2 >= lines.length) await kvSetJson(key, choices, TTL_SECONDS);
    return jsonWithCors(request, { choices });
  } catch (error) {
    console.error("[curriculum/choices]", error);
    return jsonWithCors(request, { choices: {}, ...simDetail(request, error) });
  }
}
