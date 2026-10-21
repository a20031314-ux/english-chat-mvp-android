/**
 * 단계 범위를 화면에 보일 모양으로(curriculum/stages). 앱 언어가 영어·한국어면 데이터에 손으로 쓴 글,
 * 다른 앱 언어는 처음 한 번 모델이 옮겨 저장한다(학습 언어 × 데이터 버전 × 앱 언어마다 한 번, 사람마다가 아님).
 * 옮기다 실패하면 영어로 보인다 — 화면이 비지 않게.
 */
import { kvGetJson, kvSetJson } from "./kv.ts";
import { completeChat } from "./llm.ts";
import { getOpenAIClient } from "./openai.ts";
import { ladderFor, stageText, type Stage, type StageText } from "../curriculum/stages/index.ts";

export type StageLineView = { who: "A" | "B"; text: string; gloss: string };
export type StageDialogueView = { setting: string; lines: StageLineView[] };
export type StageView = {
  id: string;
  order: number;
  title: string;
  canDo: string[];
  dialogues: StageDialogueView[];
};

const TTL_SECONDS = 400 * 24 * 60 * 60;

function key(language: string, version: number, ui: string): string {
  return `stagecopy:v1:${language}:${version}:${ui}`;
}

/** 손으로 쓴 글로 만든 모양. ui가 학습 언어와 같으면 뜻풀이는 비운다. */
export function viewsFrom(stages: Stage[], language: string, ui: string): StageView[] {
  const t = (text: StageText) => stageText(text, ui);
  return stages.map((stage) => ({
    id: stage.id,
    order: stage.order,
    title: t(stage.title),
    canDo: stage.canDo.map(t),
    dialogues: stage.dialogues.map((dialogue) => ({
      setting: t(dialogue.setting),
      lines: dialogue.lines.map((line) => ({
        who: line.who,
        text: line.text,
        gloss: ui === language ? "" : (ui === "ko" ? line.ko : undefined) ?? line.en,
      })),
    })),
  }));
}

/** 옮길 글만 뽑고(순서대로), 옮긴 글을 같은 순서로 다시 넣는다. */
export function textsOf(views: StageView[]): string[] {
  return views.flatMap((view) => [
    view.title,
    ...view.canDo,
    ...view.dialogues.flatMap((dialogue) => [dialogue.setting, ...dialogue.lines.map((line) => line.gloss)]),
  ]);
}

export function withTexts(views: StageView[], texts: string[]): StageView[] | null {
  if (texts.length !== textsOf(views).length) return null;
  let i = 0;
  const next = () => texts[i++] ?? "";
  return views.map((view) => ({
    ...view,
    title: next(),
    canDo: view.canDo.map(() => next()),
    dialogues: view.dialogues.map((dialogue) => ({
      setting: next(),
      lines: dialogue.lines.map((line) => ({ ...line, gloss: next() })),
    })),
  }));
}

/**
 * 화면용 단계 목록. `onTranslate`는 실제로 모델을 부를 때만 불린다(요금 기록용).
 * 범위가 없는 학습 언어는 null.
 */
export async function stageViews(
  language: string,
  ui: string,
  uiName: string,
  onTranslate?: () => void,
): Promise<StageView[] | null> {
  const ladder = ladderFor(language);
  if (!ladder) return null;
  if (ui === "en" || ui === "ko" || ui === language) return viewsFrom(ladder.stages, language, ui);
  const english = viewsFrom(ladder.stages, language, "en");
  const cacheKey = key(language, ladder.version, ui);
  try {
    const kept = await kvGetJson<StageView[]>(cacheKey);
    if (Array.isArray(kept) && kept.length === english.length) return kept;
  } catch {
    // 저장소가 안 되면 아래에서 옮기거나 영어로.
  }
  const client = getOpenAIClient();
  if (!client) return english;
  try {
    onTranslate?.();
    const source = textsOf(english);
    const completion = await completeChat(client, "translate", {
      temperature: 0,
      max_tokens: 8000,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `Translate every string of the JSON array "texts" from English into ${uiName}, for a language-learning app screen. Keep the meaning plain and natural, the same length or shorter, and keep anything in quotes or in another script as it is. Return only {"texts": [...]} with exactly ${source.length} strings in the same order.`,
        },
        { role: "user", content: JSON.stringify({ texts: source }) },
      ],
    });
    const parsed = JSON.parse(completion.choices[0]?.message?.content ?? "{}") as { texts?: unknown };
    const texts = Array.isArray(parsed.texts) ? parsed.texts.map((t) => (typeof t === "string" ? t.trim() : "")) : [];
    const views = withTexts(english, texts);
    if (!views || texts.some((t) => !t)) return english;
    await kvSetJson(cacheKey, views, TTL_SECONDS).catch(() => undefined);
    return views;
  } catch (error) {
    console.error("[stage-copy]", error);
    return english;
  }
}
