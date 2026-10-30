/**
 * 문장구조 수업(2026-10-30 사용자 "일반적인 설명(문법, 구문) > 문제풀이 > 대화" → 대화는 주고받기형, curriculum/frameLesson.ts):
 * 틀(curriculum/frames.ts)마다 한 번 Haiku가 ① 짧은 설명 두세 줄(영어) ② 그 틀로 대답하는 주고받기 세 번(상대 줄·내 줄은 학습 언어,
 * 각 줄 영어 뜻)을 만들고, 앱 언어가 영어가 아니면 설명·뜻을 옮겨 둔다(stageCopy.translated). 모두가 같이 쓰는 저장(`framelesson:v4`), 학습자 글 없음.
 * 내 줄은 그 틀이 알아보는 조각(core)을 담아야 하고, 연습 예문과 겹치면 안 된다 — 지키지 않은 차례는 버린다.
 */
import { kvGetJson, kvSetJson } from "./kv.ts";
import { completeChat } from "./llm.ts";
import { getOpenAIClient } from "./openai.ts";
import { translated } from "./stageCopy.ts";
import { glossFor } from "../curriculum/stageScripts.ts";
import { recallFits } from "../curriculum/recall.ts";
import type { Frame } from "../curriculum/frames.ts";
import type { FrameLesson, LessonTurn } from "../curriculum/frameLesson.ts";
import { INTERFACE_LANGUAGE_LABELS } from "../learningLanguages.ts";

const TTL_SECONDS = 400 * 24 * 60 * 60;

async function makeLesson(language: string, frame: Frame): Promise<FrameLesson | null> {
  const client = getOpenAIClient();
  if (!client) return null;
  const name = INTERFACE_LANGUAGE_LABELS[language] ?? language;
  const completion = await completeChat(client, "translate", {
    temperature: 0.5,
    max_tokens: 1400,
    messages: [
      {
        role: "system",
        content: `You teach one ${name} sentence pattern to a beginner. ___ is the part that changes.
First write a short explanation for the learner, written in English (only the quoted pattern parts are in ${name}): two or three short lines, each under 20 words, saying how the pattern is built (what each fixed part does) and when to use it. Quote the fixed parts in ${name} exactly as they appear in the pattern; do not compare with English words or English grammar. No grammar jargon unless needed, no example sentences in the explanation.
Then write three short, natural exchanges in ${name}: another person says one line, and the learner answers with ONE sentence that uses the pattern (keep its fixed part exactly as written, change only the ___ part, simple everyday words). Do not repeat the practice sentences given. No names of real people, brands or places, nothing rude.
Answer in exactly this format and nothing else:
E|<explanation line>
E|<explanation line>
T|<other person's line in ${name}>|<its English translation>|<learner's answer in ${name}>|<its English translation>
(two or three E lines, then three T lines). Translations are plain translations of the line itself, not descriptions of it.`,
      },
      { role: "user", content: `Pattern: ${frame.pattern} — ${glossFor(frame.meaning, "en")}\nPractice sentences already used: ${frame.examples.map((example) => example.text).join(" / ")}` },
    ],
  });
  const raw = String(completion.choices[0]?.message?.content ?? "");
  const explain: string[] = [];
  const turns: LessonTurn[] = [];
  const used = new Set(frame.examples.map((example) => example.text.trim()));
  for (const line of raw.split(/\r?\n/)) {
    const parts = line.split("|").map((part) => part.trim());
    if (parts[0] === "E" && parts[1] && explain.length < 3) explain.push(parts[1]);
    if (parts[0] === "T" && parts.length >= 5 && parts.slice(1, 5).every(Boolean)) {
      const [, them, themGloss, me, meGloss] = parts as [string, string, string, string, string];
      if (used.has(me) || !recallFits(language, me, [frame])) continue;
      used.add(me);
      turns.push({ them, themGloss, me, meGloss });
    }
  }
  return explain.length && turns.length >= 2 ? { explain, turns: turns.slice(0, 3) } : null;
}

/** 틀 하나의 수업. 앱 언어가 영어가 아니면 설명·뜻을 그 말로. */
export async function frameLesson(language: string, frame: Frame, ui: string, uiName: string, onMake?: () => void): Promise<FrameLesson | null> {
  // v2(2026-10-30): 뜻이 설명("…를 묻습니다")으로 나오던 것을 그대로 옮긴 말로. v3: 설명이 영어("I am")에 빗대던 것을 학습 언어 조각으로. v4: 설명 글을 학습 언어로 쓰던 것(스페인어)을 영어로 — 앱 언어로 옮김.
  const key = `framelesson:v4:${language}:${frame.id}`;
  let lesson = await kvGetJson<FrameLesson>(key).catch(() => null);
  if (!lesson?.turns?.length) {
    onMake?.();
    lesson = await makeLesson(language, frame).catch(() => null);
    if (!lesson) return null;
    await kvSetJson(key, lesson, TTL_SECONDS).catch(() => undefined);
  }
  if (ui === "en") return lesson;
  const source = [...lesson.explain, ...lesson.turns.flatMap((turn) => [turn.themGloss, turn.meGloss])];
  const moved = await translated(source, ui, uiName, `${key}:${ui}`, onMake);
  if (!moved) return lesson;
  const n = lesson.explain.length;
  return {
    explain: moved.slice(0, n),
    turns: lesson.turns.map((turn, index) => ({ ...turn, themGloss: moved[n + index * 2] ?? turn.themGloss, meGloss: moved[n + index * 2 + 1] ?? turn.meGloss })),
  };
}
