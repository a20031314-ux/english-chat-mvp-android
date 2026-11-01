/**
 * Stagebank 표현·문법 칸 수업(2026-11-01 설계 "설명은 Stagebank, 문제는 Quizbank", hub/drafts/quiz-pages-2026-11-01.md 2절):
 * 문장구조 수업(server/frameLesson.ts)과 같은 방식 — 소재마다 한 번 Haiku가 ① 뜻·쓰임·짧은 설명 줄(영어)
 * ② 그 소재를 쓰는 주고받기 세 번(상대 줄·내 줄은 학습 언어, 각 줄 영어 뜻)을 만들고, 앱 언어가 영어가 아니면 옮겨 둔다.
 * 모두가 같이 쓰는 저장(`itemlesson:v1`), 학습자 글 없음. 표현은 내 줄에 그 표현이 그대로 들어야 하고, 연습 예문과 겹치면 안 된다.
 */
import { kvGetJson, kvSetJson } from "./kv.ts";
import { completeChat } from "./llm.ts";
import { getOpenAIClient } from "./openai.ts";
import { translated } from "./stageCopy.ts";
import { pieceOf } from "../curriculum/quiz.ts";
import type { FrameLesson, LessonTurn } from "../curriculum/frameLesson.ts";
import { INTERFACE_LANGUAGE_LABELS } from "../learningLanguages.ts";

const TTL_SECONDS = 400 * 24 * 60 * 60;
const FAIL_SECONDS = 10 * 60;

/** 표현(e|) 또는 문법 칸(g|) 하나 — 이름(영어)과 그 단계 예문 한두 개. */
export type LessonItem = { key: string; kind: "expression" | "grammar"; name: string; examples: string[] };
/** 수업 + 앱 언어 이름(문법 칸 이름은 옮김, 표현은 그대로). */
export type ItemLessonView = FrameLesson & { title: string };

/** 점검용: 마지막으로 받은 모델 글(운영 확인 — 저장 안 함). */
export let lastLessonRaw = "";

async function makeLesson(language: string, item: LessonItem): Promise<FrameLesson | null> {
  const client = getOpenAIClient();
  if (!client) return null;
  const name = INTERFACE_LANGUAGE_LABELS[language] ?? language;
  const what =
    item.kind === "expression"
      ? `the ${name} expression "${item.name}"`
      : `the ${name} grammar point "${item.name}"`;
  const lines =
    item.kind === "expression"
      ? `M|<what it means / what it lets you say, one short line>
U|<when people use it, one short line>
E|<how it differs from a similar expression, or "-" if none, one short line>
E|<its tone: casual, polite or formal, one short line>`
      : `M|<the rule in one or two short lines, plain words>
U|<when to use it, one short line>
E|<how the form changes, one short line (or "-")>
E|<one common learner mistake and the right form, one short line>`;
  const completion = await completeChat(client, "translate", {
    temperature: 0.5,
    // 모델이 먼저 생각하면 그 몫도 여기서 나가 글이 잘렸다(운영 2026-11-01: 줄 중간에서 끊기거나 빈 답) — 넉넉히.
    max_tokens: 4000,
    messages: [
      {
        role: "system",
        content: `You teach ${what} to a learner. Explain it in English (only quoted ${name} words in ${name}); no grammar jargon unless needed, do not compare with English grammar:
${lines}
Then write three short, natural exchanges in ${name}: another person says one line, and the learner answers with ONE sentence that uses it${item.kind === "expression" ? ` (the expression written exactly as "${item.name}", once)` : ""}, simple everyday words. Do not repeat the practice sentences given. No names of real people, brands or places, nothing rude.
T|<other person's line in ${name}>|<its English translation>|<learner's answer in ${name}>|<its English translation>
Answer with exactly these lines (one M, one U, two E, three T) and nothing else. Translations are plain translations of the line itself.`,
      },
      { role: "user", content: `${item.kind === "expression" ? "Expression" : "Grammar point"}: ${item.name}\nPractice sentences already used: ${item.examples.join(" / ") || "-"}` },
    ],
  });
  const raw = String(completion.choices[0]?.message?.content ?? "");
  lastLessonRaw += `\n---\n${raw.slice(0, 1500)}`;
  let meaning = "";
  let usage = "";
  const explain: string[] = [];
  const turns: LessonTurn[] = [];
  const used = new Set(item.examples.map((text) => text.trim()));
  for (const line of raw.split(/\r?\n/)) {
    const cells = line.split("|").map((cell) => cell.trim());
    if (cells[0] === "M" && cells[1]) meaning = cells[1];
    if (cells[0] === "U" && cells[1]) usage = cells[1];
    if (cells[0] === "E" && cells[1] && cells[1] !== "-" && explain.length < 3) explain.push(cells[1]);
    if (cells[0] === "T" && cells.length >= 5 && cells.slice(1, 5).every(Boolean)) {
      const [, them, themGloss, me, meGloss] = cells as [string, string, string, string, string];
      if (used.has(me)) continue;
      if (item.kind === "expression" && !pieceOf(me, item.name)) continue;
      used.add(me);
      turns.push({ them, themGloss, me, meGloss });
    }
  }
  if (!meaning || turns.length < 2) return null;
  return { explain, meaning, usage, turns: turns.slice(0, 3) };
}

/** 소재 하나의 수업. 앱 언어가 영어가 아니면 설명·뜻을 그 말로. */
export async function itemLesson(language: string, item: LessonItem, ui: string, uiName: string, onMake?: () => void): Promise<ItemLessonView | null> {
  const key = `itemlesson:v1:${language}:${item.key}`;
  let lesson = await kvGetJson<FrameLesson>(key).catch(() => null);
  if (!lesson?.turns?.length) {
    // 세 번 다 실패한 소재는 10분 동안 다시 만들지 않는다 — 열 때마다 모델을 세 번 부르지 않게(2026-11-01 변경 감시 리뷰).
    const failKey = `itemlesson:v1:fail:${language}:${item.key}`;
    if (await kvGetJson<number>(failKey).catch(() => null)) return null;
    // 처음 만들 때 모델이 한 번 실패하거나 형식을 안 지키는 일이 있어(2026-11-01 운영 확인) 한 번 더.
    lastLessonRaw = "";
    // 실패한 시도도 모델을 부른 것이라 시도마다 센다(2026-11-01 변경 감시 리뷰).
    const once = () => {
      onMake?.();
      return makeLesson(language, item).catch((error: unknown) => {
        lastLessonRaw += `\n---\nERR ${error instanceof Error ? error.message : String(error)}`.slice(0, 300);
        return null;
      });
    };
    lesson = (await once()) ?? (await once()) ?? (await once());
    if (!lesson) {
      await kvSetJson(failKey, Date.now(), FAIL_SECONDS).catch(() => undefined);
      return null;
    }
    await kvSetJson(key, lesson, TTL_SECONDS).catch(() => undefined);
  }
  if (ui === "en") return { ...lesson, title: item.name };
  // 빈 줄을 넣으면 번호가 어긋나 옮기기가 통째로 실패한다(표현 수업이 한국어 앱에서 영어로 나오던 것, 2026-11-01).
  const grammarTitle = item.kind === "grammar";
  const source = [...(grammarTitle ? [item.name] : []), lesson.meaning || "-", lesson.usage || "-", ...lesson.explain, ...lesson.turns.flatMap((turn) => [turn.themGloss, turn.meGloss])];
  const moved = await translated(source, ui, uiName, `${key}:${ui}`, onMake);
  if (!moved) return { ...lesson, title: item.name };
  let at = 0;
  const take = () => moved[at++] ?? "";
  const title = grammarTitle ? take() : item.name;
  const meaning = take();
  const usage = take();
  const explain = lesson.explain.map((line) => take() || line);
  const turns = lesson.turns.map((turn) => ({ ...turn, themGloss: take() || turn.themGloss, meGloss: take() || turn.meGloss }));
  const kept = (moved: string, original: string | undefined) => (moved && moved.trim() !== "-" && original ? moved : original);
  return { explain, meaning: kept(meaning, lesson.meaning), usage: kept(usage, lesson.usage), turns, title: grammarTitle ? title || item.name : item.name };
}
