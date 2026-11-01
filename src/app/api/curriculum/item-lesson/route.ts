import { NextRequest } from "next/server";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { coerceLanguageCode, INTERFACE_LANGUAGE_LABELS } from "@/lib/learningLanguages";
import { meterRequest } from "@/lib/server/meterRequest";
import { itemLesson, type LessonItem } from "@/lib/server/itemLesson";
import { ladderFor } from "@/lib/curriculum/stages/index";
import { quizSources } from "@/lib/curriculum/quiz";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * GET ?lang=es&ui=ko&key=e|a ver (또는 g|2:1) — Stagebank 표현·문법 칸 수업(설명·주고받기, server/itemLesson.ts).
 * 소재마다 한 번 만들어 모두가 같이 씀 — 처음 부를 때만 모델(frameLesson op와 같은 묶음). 학습자 글은 받지 않는다.
 */
export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request);
}

function itemOf(language: string, key: string): LessonItem | null {
  const ladder = ladderFor(language);
  if (!ladder) return null;
  if (key.startsWith("e|")) {
    const expression = key.slice(2);
    if (!ladder.stages.some((stage) => stage.expressions.includes(expression))) return null;
    const examples = quizSources(language, key).filter((source) => source.who !== "them").slice(0, 3).map((source) => source.text);
    return { key, kind: "expression", name: expression, examples };
  }
  if (key.startsWith("g|")) {
    const [order, index] = key.slice(2).split(":").map(Number);
    const grammar = ladder.stages.find((stage) => stage.order === order)?.grammar[index ?? -1];
    if (!grammar) return null;
    return { key, kind: "grammar", name: grammar.name.en, examples: grammar.example ? [grammar.example] : [] };
  }
  return null;
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const language = coerceLanguageCode(params.get("lang"));
  const uiParam = params.get("ui") ?? "en";
  const ui = INTERFACE_LANGUAGE_LABELS[uiParam] ? uiParam : "en";
  const item = itemOf(language, (params.get("key") ?? "").slice(0, 120));
  if (!item) return jsonWithCors(request, { lesson: null });
  let metered = 0;
  const lesson = await itemLesson(language, item, ui, INTERFACE_LANGUAGE_LABELS[ui] ?? "English", () => {
    metered += 1;
    if (metered <= 2) void meterRequest(request, "frameLesson");
  });
  return jsonWithCors(request, { lesson });
}
