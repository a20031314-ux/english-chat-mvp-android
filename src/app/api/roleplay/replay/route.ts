import { NextRequest } from "next/server";
import { completeChat } from "@/lib/server/llm";
import { findScenario } from "@/lib/roleplay/catalog";
import { parseReplay, replayPrompt, replayable } from "@/lib/roleplay/replay";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { meterRequest } from "@/lib/server/meterRequest";
import { getOpenAIClient } from "@/lib/server/openai";
import { coerceLanguageCode, interfaceLanguagePromptLabel, learningLanguageName } from "@/lib/learningLanguages";

export const dynamic = "force-dynamic";

export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request);
}

/**
 * 🎭 이렇게도 말할 수 있었어요(lib/roleplay/replay.ts, 2026-11-08): 끝난 통화 대본으로 연습 장면 둘.
 * 수업 통화는 끝나면 앱이 한 번 부르고, 자유대화는 끝 화면에서 눌렀을 때만. 대본·장면은 서버에 남기지 않는다(답으로만 돌려줌).
 */
export async function POST(request: NextRequest) {
  const client = getOpenAIClient();
  if (!client) return jsonWithCors(request, { error: "MISSING_OPENAI_KEY" }, { status: 503 });

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return jsonWithCors(request, { error: "Invalid JSON" }, { status: 400 });
  }
  const scenario = findScenario(typeof body.scenarioId === "string" ? body.scenarioId : "");
  if (!scenario) return jsonWithCors(request, { error: "unknown scenario" }, { status: 400 });

  // 줄마다 who·text와 고친 말(better) — 서버에 남기지 않고 이 호출에만 쓴다.
  const lines = (Array.isArray(body.lines) ? (body.lines as unknown[]) : [])
    .slice(-40)
    .map((raw) => {
      const row = (typeof raw === "object" && raw !== null ? raw : {}) as { who?: unknown; text?: unknown; better?: unknown };
      const who = row.who === "learner" ? ("learner" as const) : ("tutor" as const);
      const text = typeof row.text === "string" ? row.text.trim().slice(0, 300) : "";
      const better = who === "learner" && typeof row.better === "string" ? row.better.trim().slice(0, 200) : "";
      return { who, text, ...(better ? { better } : {}) };
    })
    .filter((line) => line.text);
  if (!replayable(lines)) return jsonWithCors(request, { error: "too short" }, { status: 400 });

  const native = coerceLanguageCode(body.nativeLanguage);
  const level = typeof body.level === "number" ? body.level : 2;

  await meterRequest(request, "callReplay");
  try {
    const completion = await completeChat(client, "callReplay", {
      messages: [
        {
          role: "system",
          content: replayPrompt({ target: learningLanguageName(scenario.language), native: interfaceLanguagePromptLabel(native), level, lines }),
        },
      ],
      response_format: { type: "json_object" },
      max_tokens: 1400,
    });
    const scenes = parseReplay(completion.choices[0]?.message?.content ?? "");
    if (!scenes.length) return jsonWithCors(request, { error: "NO_SCENES" }, { status: 502 });
    return jsonWithCors(request, { scenes });
  } catch (error) {
    console.error("[roleplay/replay]", error);
    return jsonWithCors(request, { error: "REPLAY_FAILED" }, { status: 502 });
  }
}
