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
import { scriptsFor } from "../curriculum/stageScripts.ts";
import { framesFor } from "../curriculum/frames.ts";

export type StageLineView = { who: "A" | "B"; text: string; gloss: string };
export type StageDialogueView = { setting: string; lines: StageLineView[] };
export type StageGrammarView = { name: string; example: string; constructionId?: string };
export type StageView = {
  id: string;
  order: number;
  title: string;
  canDo: string[];
  grammar: StageGrammarView[];
  /** 이 단계 발음 짚을 점(앱 언어, 2026-10-25 My 네 갈래의 발음). */
  pronunciation: string;
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
    pronunciation: t(stage.pronunciation),
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
    view.pronunciation,
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
    pronunciation: next(),
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
        // 영어 파닉스처럼 뜻이 낱말 그대로("cat" = cat)면 뜻은 빼고 낱말만 — 옮길 수도 없고 보여도 같은 말이다.
        ...(item.example
          ? item.example.meaning.en.trim().toLowerCase() === item.example.word.trim().toLowerCase()
            ? { word: item.example.word }
            : { word: item.example.word, meaning: t(item.example.meaning) }
          : {}),
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

/** 앱 언어별로 글에 나와야 할 문자(라틴 문자 앱 언어는 검사하지 않음). */
const UI_SCRIPT: Record<string, RegExp> = {
  ar: /[\u0600-\u06FF]/, th: /[\u0E00-\u0E7F]/, hi: /[\u0900-\u097F]/, ru: /[\u0400-\u04FF]/,
  ja: /[\u3040-\u30FF\u4E00-\u9FFF]/, zh: /[\u4E00-\u9FFF]/, ko: /[\uAC00-\uD7A3]/,
  vi: /[ăâđêôơưạảấầẩẫậắằẳẵặẹẻẽếềểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỵỷỹ]/i,
};

/**
 * 옮긴 글이 정말 그 앱 언어인가. 학습 언어 이야기를 옮기다 보니 모델이 학습 언어로 옮긴 적이 있다
 * (2026-10-22, 스페인어 학습·아랍어 앱이 전부 스페인어로 저장됨). 글자가 있는 줄의 절반 넘게 그 문자여야 한다.
 */
export function looksLike(ui: string, texts: string[]): boolean {
  const pattern = UI_SCRIPT[ui];
  if (!pattern) return true;
  const lettered = texts.filter((text) => /\p{L}/u.test(text));
  if (!lettered.length) return true;
  const hits = lettered.filter((text) => pattern.test(text)).length;
  return hits / lettered.length >= (ui === "vi" ? 0.4 : 0.5);
}

/** 마지막으로 옮기기가 실패한 까닭(점검 사용자에게만 돌려줌, 라우트의 simDetail). */
let lastFailure = "";
export function lastCopyFailure(): string {
  return lastFailure;
}

/** 영어 글 묶음을 앱 언어로(저장해 두고 다시 씀). 실패하면 null. */
async function translated(source: string[], ui: string, uiName: string, cacheKey: string, onTranslate?: () => void): Promise<string[] | null> {
  lastFailure = "";
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
      // 번호 붙인 줄로 주고받는다: JSON으로 받으면 Haiku가 배열을 글자 하나로 싸 보내 깨지곤 했다(2026-10-22 운영).
      const completion = await completeChat(client, "translate", {
        temperature: 0,
        max_tokens: 8000,
        messages: [
          {
            role: "system",
            content: `Translate each numbered line from English into ${uiName}. They are labels and glosses on a language-learning app screen read by a ${uiName} speaker, so every translation must be written in ${uiName} — never in the language being studied, even when a line is about that language. Keep the meaning plain and natural, the same length or shorter; leave words in quotes, grammar terms written in another language (like "ser" or "-ar"), and anything already in another script as they are. Answer with exactly ${part.length} lines in the same order, each as <number>|<translation>, and nothing else.`,
          },
          { role: "user", content: part.map((text, index) => `${index + 1}|${text.replace(/\s+/g, " ")}`).join("\n") },
        ],
      });
      const raw = String(completion.choices[0]?.message?.content ?? "");
      const byNumber = new Map<number, string>();
      for (const line of raw.split(/\r?\n/)) {
        const match = /^\s*(\d+)\s*[|｜]\s*(.*)$/.exec(line);
        if (match) byNumber.set(Number(match[1]), match[2]!.trim());
      }
      const texts = part.map((_, index) => byNumber.get(index + 1) ?? "");
      if (texts.some((t) => !t)) {
        lastFailure = `chunk ${start}: got ${byNumber.size}/${part.length}, raw ${raw.slice(0, 160)}`;
        return null;
      }
      if (!looksLike(ui, texts)) {
        lastFailure = `chunk ${start}: not ${ui}: ${texts.slice(0, 3).join(" | ").slice(0, 160)}`;
        console.error("[stage-copy]", lastFailure);
        return null;
      }
      out.push(...texts);
    }
    await kvSetJson(cacheKey, out, TTL_SECONDS).catch(() => undefined);
    return out;
  } catch (error) {
    lastFailure = String((error as Error)?.message ?? error).slice(0, 200);
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
  // stages3: 2026-10-22 학습 언어로 잘못 옮겨 저장된 것(stages2)을 버림. stages4: 2026-10-25 발음 줄 더함(글 수가 바뀜).
  const texts = await translated(textsOf(english), ui, uiName, `stagecopy:v1:stages4:${language}:${ladder.version}:${ui}`, onTranslate);
  return (texts && withTexts(english, texts)) ?? english;
}

/** 화면용 글자 기초. 없는 학습 언어는 null. */
export async function scriptView(language: string, ui: string, uiName: string, onTranslate?: () => void): Promise<ScriptView | null> {
  const course = scriptFor(language);
  if (!course) return null;
  if (ui === "en" || ui === "ko") return scriptViewFrom(course, ui);
  const english = scriptViewFrom(course, "en");
  const texts = await translated(scriptTextsOf(english), ui, uiName, `stagecopy:v1:script2:${language}:${course.version}:${ui}`, onTranslate);
  return (texts && withScriptTexts(english, texts)) ?? english;
}

/** 단계 대본·틀의 뜻풀이 원문(영어, 겹침 없이 차례대로) — 앱 언어가 영어·한국어가 아니면 이걸 옮긴다. */
export function scriptGlossTexts(language: string, stage: number): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  const add = (gloss: { en: string } | undefined) => {
    const text = gloss?.en?.trim();
    if (text && !seen.has(text)) {
      seen.add(text);
      out.push(text);
    }
  };
  for (const script of scriptsFor(language, stage)) {
    add(script.setting);
    add(script.goal);
    for (const line of script.lines) {
      add(line.gloss);
      for (const variant of line.alt ?? []) add(variant.gloss);
    }
  }
  for (const frame of framesFor(language, stage)) {
    add(frame.meaning);
    for (const example of frame.examples) {
      add(example.cue);
      add(example.gloss);
    }
  }
  return out;
}

/** 글 묶음이 바뀌면 다시 옮기도록 열쇠에 붙이는 짧은 지문. */
export function textsFingerprint(texts: string[]): string {
  let hash = 5381;
  for (const char of texts.join("\n")) hash = ((hash * 33) ^ char.codePointAt(0)!) >>> 0;
  return `${texts.length}-${hash.toString(36)}`;
}

/**
 * 단계 대본·틀 뜻풀이를 앱 언어로(2026-10-28 "어긋난 점": ja·ar 앱에서 영어로 보였음). 영어 원문 → 옮긴 글.
 * 영어·한국어 앱은 데이터에 손으로 쓴 글이라 빈 표. 학습 언어 × 단계 × 앱 언어 × 글 지문마다 한 번 옮겨 저장(사람마다가 아님).
 * 실패하면 빈 표 — 화면은 영어로.
 */
export async function scriptGlosses(
  language: string,
  stage: number,
  ui: string,
  uiName: string,
  onTranslate?: () => void,
): Promise<Record<string, string>> {
  if (ui === "en" || ui === "ko") return {};
  const source = scriptGlossTexts(language, stage);
  if (!source.length) return {};
  const texts = await translated(source, ui, uiName, `stagecopy:v1:scriptgloss:${language}:${stage}:${textsFingerprint(source)}:${ui}`, onTranslate);
  if (!texts) return {};
  return Object.fromEntries(source.map((text, index) => [text, texts[index]!]));
}
