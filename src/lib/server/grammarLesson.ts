/**
 * 문법 한 장(2026-11-03 사용자 "문법 설명 넣어줘", 모양 curriculum/fixedLessons/grammar.ts): Stagebank 문법 칸마다 학습 언어 × 앱 언어로
 * 한 번 Sonnet이 쓰고 검사기를 통과한 것만 모두가 같이 쓴다(`gramlesson:v1:<학습>:<앱>:<g|단계:번호>`, 만료 없음).
 * 누가 처음 열 때 응답 뒤(next/server after)에 만들고, 그동안은 예전 짧은 설명(itemLesson). 실패 3번이면 건너뜀.
 * 학습자 글은 받지 않는다. 멈추기: Vercel `FIXED_LESSON_MAKE=off`(고정 수업과 같은 스위치).
 */
import { kvGetJson, kvSetJson } from "./kv.ts";
import { completeChat } from "./llm.ts";
import { getOpenAIClient } from "./openai.ts";
import { allFramesFor } from "../curriculum/frames.ts";
import { ladderFor } from "../curriculum/stages/index.ts";
import { checkGrammarLesson, type GrammarLesson } from "../curriculum/fixedLessons/grammar.ts";
import type { CheckIssue } from "../curriculum/fixedLessons/check.ts";
import { INTERFACE_LANGUAGE_LABELS } from "../learningLanguages.ts";

const keyOf = (language: string, ui: string, key: string) => `gramlesson:v1:${language}:${ui}:${key}`;
const failKeyOf = (language: string, ui: string, key: string) => `gramlesson:v1:fail:${language}:${ui}:${key}`;
const MAX_FAILS = 3;
const making = new Set<string>();
const makeOff = () => process.env.FIXED_LESSON_MAKE?.trim() === "off";

type Item = { key: string; stage: number; name: string; example: string; frames: { pattern: string; core: string[] }[] };

export function grammarItem(language: string, key: string): Item | null {
  if (!key.startsWith("g|")) return null;
  const [stage, index] = key.slice(2).split(":").map(Number);
  const grammar = ladderFor(language)?.stages.find((one) => one.order === stage)?.grammar[index ?? -1];
  if (!grammar || !stage) return null;
  const frames = allFramesFor(language)
    .filter((frame) => frame.stage === stage && (frame.grammar ?? []).includes(index!))
    .map((frame) => ({ pattern: frame.pattern, core: frame.core }));
  return { key, stage, name: grammar.name.en ?? "", example: grammar.example, frames };
}

function prompt(language: string, ui: string, item: Item): { system: string; user: string } {
  const lang = INTERFACE_LANGUAGE_LABELS[language] ?? language;
  const uiName = INTERFACE_LANGUAGE_LABELS[ui] ?? ui;
  const system = `You write one fixed grammar page for a language-learning app: one ${lang} grammar point, taught to a speaker of ${uiName}. It is stored and shown to every such learner, so it must be correct, concrete and useful.

Write every explanation in natural ${uiName} (short, plain, friendly; grammar words only when unavoidable). Every ${lang} word or sentence is written in ${lang}.

Parts:
- name: the grammar point's name in ${uiName}, short (like a textbook heading).
- rule: the rule in one or two short lines — how to make the form and what it means.
- forms: 2 to 6 rows showing how the form changes: "from" = the base or dictionary form in ${lang}, "to" = the changed form in ${lang}, "note" = one short ${uiName} line (e.g. regular / irregular, which ending, which person). Pick the most common, useful words for stage ${item.stage}.
- exceptions: one short ${uiName} line about the main exception or trap ("" if none).
- usage: when to use it, one short line (time words or situations that call for it).
- mistakes: 2-3 mistakes ${uiName} speakers really make with THIS grammar point. Each: wrong ${lang} sentence, right one, and why in one short ${uiName} line (point to the ${uiName} habit behind it when there is one). Never list a correct alternative as a mistake.
- quiz: exactly three questions in this order, all about THIS grammar point:
  1. type: a sentence with one blank (before / after) and the answer the learner types (the form of this grammar point); cue = the ${uiName} meaning of the full sentence. The answer must not appear in before/after.
  2. choose: a sentence with one blank, four options (index of the right one in "answer"); wrong options are typical mistaken forms of the right answer, never correct alternatives; cue = meaning.
  3. fix: a sentence with one mistake in this grammar point; "bad" = the exact wrong piece, "right" = what replaces it; cue = meaning of the corrected sentence.
  Quiz sentences must differ from the mistakes' sentences.
- turns: exactly three short exchanges. "them" = another person's line in ${lang} that naturally calls for this grammar point; "me" = the learner's one-sentence answer that uses it; "piece" = the exact word(s) of "me" (1 to 3 words, copied letter for letter) that show the grammar point; meanings in ${uiName}. Answers must follow logically from "them" and differ from the quiz and mistakes sentences.

Stage ${item.stage} of 5 (1 = first week): only basic, high-frequency words; no brands, real people or places other than common country/city names; nothing rude.

Answer with one JSON object and nothing else, with exactly these keys:
{"name":"","rule":"","forms":[{"from":"","to":"","note":""}],"exceptions":"","usage":"","mistakes":[{"wrong":"","right":"","why":""}],"quiz":[{"kind":"type","before":"","after":"","answer":"","cue":""},{"kind":"choose","before":"","after":"","options":["","","",""],"answer":0,"cue":""},{"kind":"fix","wrong":"","bad":"","right":"","cue":""}],"turns":[{"them":"","themGloss":"","me":"","meGloss":"","piece":""}]}`;
  const user = `Grammar point (English name): ${item.name}
Example sentence: ${item.example}
${item.frames.length ? `Sentence patterns in this stage that use it: ${item.frames.map((frame) => frame.pattern).join(" / ")}\n` : ""}`;
  return { system, user };
}

function parse(raw: string, key: string): GrammarLesson | null {
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  try {
    const body = JSON.parse(raw.slice(start, end + 1)) as Omit<GrammarLesson, "key">;
    return { ...body, key, exceptions: body.exceptions ?? "" };
  } catch {
    return null;
  }
}

export async function makeGrammarLesson(language: string, ui: string, item: Item, onMake?: () => void): Promise<{ lesson: GrammarLesson | null; issues: CheckIssue[] }> {
  const client = getOpenAIClient();
  if (!client) return { lesson: null, issues: [{ id: item.key, level: "error", what: "모델 키 없음" }] };
  const { system, user } = prompt(language, ui, item);
  let feedback = "";
  let issues: CheckIssue[] = [];
  for (let attempt = 0; attempt < 2; attempt += 1) {
    onMake?.();
    const completion = await completeChat(client, "fixedLesson", {
      temperature: 0.4,
      max_tokens: 3000,
      messages: [
        { role: "system", content: system },
        { role: "user", content: feedback ? `${user}\nYour previous answer failed these checks — fix them and answer again with the full JSON:\n${feedback}` : user },
      ],
    });
    const lesson = parse(String(completion.choices[0]?.message?.content ?? ""), item.key);
    if (!lesson) {
      issues = [{ id: item.key, level: "error", what: "JSON을 못 읽음" }];
      feedback = "- The answer was not one valid JSON object.";
      continue;
    }
    issues = checkGrammarLesson(lesson);
    if (!issues.some((one) => one.level === "error")) return { lesson, issues };
    feedback = issues.map((one) => `- ${one.what}`).join("\n");
  }
  return { lesson: null, issues };
}

async function makeAndStore(language: string, ui: string, item: Item, onMake?: () => void): Promise<boolean> {
  const id = `${language}:${ui}:${item.key}`;
  if (making.has(id)) return false;
  making.add(id);
  try {
    const fails = (await kvGetJson<number>(failKeyOf(language, ui, item.key)).catch(() => 0)) ?? 0;
    if (fails >= MAX_FAILS) return false;
    const { lesson } = await makeGrammarLesson(language, ui, item, onMake).catch(() => ({ lesson: null }));
    if (!lesson) {
      await kvSetJson(failKeyOf(language, ui, item.key), fails + 1).catch(() => undefined);
      return false;
    }
    await kvSetJson(keyOf(language, ui, item.key), lesson).catch(() => undefined);
    return true;
  } finally {
    making.delete(id);
  }
}

/** 문법 한 장: 있으면 그것, 없으면 응답 뒤에 만들기 시작(이번엔 null). */
export async function grammarLessonFor(language: string, ui: string, key: string, later?: (job: () => Promise<unknown>) => void, onMake?: () => void): Promise<GrammarLesson | null> {
  const item = grammarItem(language, key);
  if (!item) return null;
  const have = await kvGetJson<GrammarLesson>(keyOf(language, ui, key)).catch(() => null);
  if (have) return have;
  if (!makeOff() && later) later(() => makeAndStore(language, ui, item, onMake));
  return null;
}
