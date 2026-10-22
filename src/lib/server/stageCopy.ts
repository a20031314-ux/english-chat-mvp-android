/**
 * 단계 범위·글자 기초를 화면에 보일 모양으로(curriculum/stages, curriculum/scripts). 앱 언어가 영어·한국어면 데이터에 손으로 쓴 글,
 * 다른 앱 언어는 처음 한 번 모델이 옮겨 저장한다(학습 언어 × 데이터 버전 × 앱 언어마다 한 번, 사람마다가 아님).
 * 옮기다 실패하면 영어로 보인다 — 화면이 비지 않게.
 */
import { kvGetJson, kvSetJson } from "./kv.ts";
import { completeChat } from "./llm.ts";
import { getOpenAIClient } from "./openai.ts";
import { ladderFor, stageText, type Stage, type StageText } from "../curriculum/stages/index.ts";
import { scriptFor, type ScriptCourse } from "../curriculum/scripts/index.ts";

export type StageLineView = { who: "A" | "B"; text: string; gloss: string };
export type StageDialogueView = { setting: string; lines: StageLineView[] };
export type StageGrammarView = { name: string; example: string; constructionId?: string };
export type StageView = {
  id: string;
  order: number;
  title: string;
  canDo: string[];
  grammar: StageGrammarView[];
  dialogues: StageDialogueView[];
};

export type ScriptItemView = { char: string; reading: string; say: string; word?: string; meaning?: string };
export type ScriptGroupView = { id: string; title: string; note?: string; items: ScriptItemView[] };
export type ScriptView = { title: string; groups: ScriptGroupView[] };

const TTL_SECONDS = 400 * 24 * 60 * 60;
/** 한 번에 옮기는 글 수 — 태국어·힌디어처럼 토큰이 많은 언어에서 답이 잘리지 않게 나눈다. */
const CHUNK = 60;

/** 손으로 쓴 글로 만든 모양. ui가 학습 언어와 같으면 뜻풀이는 비운다. */
export function viewsFrom(stages: Stage[], language: string, ui: string, keepGloss = false): StageView[] {
  const t = (text: StageText) => stageText(text, ui);
  return stages.map((stage) => ({
    id: stage.id,
    order: stage.order,
    title: t(stage.title),
    canDo: stage.canDo.map(t),
    grammar: stage.grammar.map((g) => ({ name: t(g.name), example: g.example, ...(g.constructionId ? { constructionId: g.constructionId } : {}) })),
    dialogues: stage.dialogues.map((dialogue) => ({
      setting: t(dialogue.setting),
      lines: dialogue.lines.map((line) => ({
        who: line.who,
        text: line.text,
        gloss: ui === language && !keepGloss ? "" : (ui === "ko" ? line.ko : undefined) ?? line.en,
      })),
    })),
  }));
}

/** 옮길 글만 뽑고(순서대로), 옮긴 글을 같은 순서로 다시 넣는다. */
export function textsOf(views: StageView[]): string[] {
  return views.flatMap((view) => [
    view.title,
    ...view.canDo,
    ...view.grammar.map((g) => g.name),
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
    grammar: view.grammar.map((g) => ({ ...g, name: next() })),
    dialogues: view.dialogues.map((dialogue) => ({
      setting: next(),
      lines: dialogue.lines.map((line) => ({ ...line, gloss: next() })),
    })),
  }));
}

export function scriptViewFrom(course: ScriptCourse, ui: string): ScriptView {
  const t = (text: StageText) => stageText(text, ui);
  return {
    title: t(course.title),
    groups: course.groups.map((group) => ({
      id: group.id,
      title: t(group.title),
      ...(group.note ? { note: t(group.note) } : {}),
      items: group.items.map((item) => ({
        char: item.char,
        reading: item.reading,
        say: item.say,
        ...(item.example ? { word: item.example.word, meaning: t(item.example.meaning) } : {}),
      })),
    })),
  };
}

export function scriptTextsOf(view: ScriptView): string[] {
  return [
    view.title,
    ...view.groups.flatMap((group) => [group.title, ...(group.note ? [group.note] : []), ...group.items.flatMap((item) => (item.meaning ? [item.meaning] : []))]),
  ];
}

export function withScriptTexts(view: ScriptView, texts: string[]): ScriptView | null {
  if (texts.length !== scriptTextsOf(view).length) return null;
  let i = 0;
  const next = () => texts[i++] ?? "";
  return {
    title: next(),
    groups: view.groups.map((group) => ({
      ...group,
      title: next(),
      ...(group.note ? { note: next() } : {}),
      items: group.items.map((item) => (item.meaning ? { ...item, meaning: next() } : item)),
    })),
  };
}

/** 영어 글 묶음을 앱 언어로(저장해 두고 다시 씀). 실패하면 null. */
async function translated(source: string[], uiName: string, cacheKey: string, onTranslate?: () => void): Promise<string[] | null> {
  try {
    const kept = await kvGetJson<string[]>(cacheKey);
    if (Array.isArray(kept) && kept.length === source.length) return kept;
  } catch {
    // 저장소가 안 되면 아래에서 옮긴다.
  }
  const client = getOpenAIClient();
  if (!client) return null;
  try {
    onTranslate?.();
    const out: string[] = [];
    for (let start = 0; start < source.length; start += CHUNK) {
      const part = source.slice(start, start + CHUNK);
      const completion = await completeChat(client, "translate", {
        temperature: 0,
        max_tokens: 8000,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: `Translate every string of the JSON array "texts" from English into ${uiName}, for a language-learning app screen. Keep the meaning plain and natural, the same length or shorter, and keep anything in quotes or in another script as it is. Return only {"texts": [...]} with exactly ${part.length} strings in the same order.`,
          },
          { role: "user", content: JSON.stringify({ texts: part }) },
        ],
      });
      const parsed = JSON.parse(completion.choices[0]?.message?.content ?? "{}") as { texts?: unknown };
      const texts = Array.isArray(parsed.texts) ? parsed.texts.map((t) => (typeof t === "string" ? t.trim() : "")) : [];
      if (texts.length !== part.length || texts.some((t) => !t)) return null;
      out.push(...texts);
    }
    await kvSetJson(cacheKey, out, TTL_SECONDS).catch(() => undefined);
    return out;
  } catch (error) {
    console.error("[stage-copy]", error);
    return null;
  }
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
  // 옮길 원문: 영어 학습이어도 뜻풀이(영어)를 남겨야 다른 앱 언어로 옮길 수 있다(2026-10-22, en·ja에서 뜻이 비고 영어로 떨어졌음).
  const english = viewsFrom(ladder.stages, language, "en", true);
  const texts = await translated(textsOf(english), uiName, `stagecopy:v1:stages2:${language}:${ladder.version}:${ui}`, onTranslate);
  return (texts && withTexts(english, texts)) ?? english;
}

/** 화면용 글자 기초. 없는 학습 언어는 null. */
export async function scriptView(language: string, ui: string, uiName: string, onTranslate?: () => void): Promise<ScriptView | null> {
  const course = scriptFor(language);
  if (!course) return null;
  if (ui === "en" || ui === "ko") return scriptViewFrom(course, ui);
  const english = scriptViewFrom(course, "en");
  const texts = await translated(scriptTextsOf(english), uiName, `stagecopy:v1:script:${language}:${course.version}:${ui}`, onTranslate);
  return (texts && withScriptTexts(english, texts)) ?? english;
}
