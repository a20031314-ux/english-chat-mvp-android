/**
 * 꺼내 쓰기 문제(2026-10-30 사용자 "'~라고 말해 보세요' 식으로 숙지한 부분을 활용", `hub/drafts/frames-first-2026-10-30.md`):
 * 문장구조(틀, curriculum/frames.ts) 하나 또는 두 개마다 한 번 Haiku가 그 틀을 쓴 새 문장 여섯 개와 영어 뜻을 만들고,
 * 앱 언어가 영어가 아니면 뜻을 옮겨 둔다(stageCopy.translated). 모두가 같이 쓰는 저장(`recall:v1`), 학습자 글 없음.
 * 문장은 틀마다 알아보는 조각(core) 하나를 그대로 담아야 하고 연습 예문과 겹치면 안 된다 — 지키지 않은 줄은 버린다.
 */
import { kvGetJson, kvSetJson } from "./kv.ts";
import { completeChat } from "./llm.ts";
import { getOpenAIClient } from "./openai.ts";
import { translated } from "./stageCopy.ts";
import { glossFor } from "../curriculum/stageScripts.ts";
import { recallFits, type RecallPrompt } from "../curriculum/recall.ts";
import type { Frame } from "../curriculum/frames.ts";
import { INTERFACE_LANGUAGE_LABELS } from "../learningLanguages.ts";

const TTL_SECONDS = 400 * 24 * 60 * 60;
export const RECALL_PER_KEY = 6;

async function makePrompts(language: string, frames: readonly Frame[]): Promise<RecallPrompt[] | null> {
  const client = getOpenAIClient();
  if (!client) return null;
  const name = INTERFACE_LANGUAGE_LABELS[language] ?? language;
  const both = frames.length > 1;
  const listed = frames
    .map((frame, index) => `Pattern ${index + 1}: ${frame.pattern} — ${glossFor(frame.meaning, "en")}. Practice sentences already used (do not repeat): ${frame.examples.map((example) => example.text).join(" / ")}`)
    .join("\n");
  const completion = await completeChat(client, "translate", {
    temperature: 0.6,
    max_tokens: 1500,
    messages: [
      {
        role: "system",
        content: `You write speaking prompts for a beginner learning ${name}. The learner has just practised the sentence pattern${both ? "s" : ""} below (___ is the part that changes).
Write ${RECALL_PER_KEY} new, natural, short sentences a person would really say in an everyday situation${both ? ", each one using BOTH patterns (two short clauses or two short sentences are fine)" : ", each using the pattern"} with a different, simple filler. Keep the fixed part of the pattern exactly as written. Use only simple, common words. No names of real people, brands or places, nothing rude.
For each, give the English meaning as an instruction to say it, from the speaker's point of view, without quoting the ${name} words (for example a request, a question or a statement in plain English).
Answer with exactly one line per sentence as <number>|<${name} sentence>|<English meaning>, and nothing else.`,
      },
      { role: "user", content: listed },
    ],
  });
  const raw = String(completion.choices[0]?.message?.content ?? "");
  const used = new Set(frames.flatMap((frame) => frame.examples.map((example) => example.text.trim())));
  const out: RecallPrompt[] = [];
  for (const line of raw.split(/\r?\n/)) {
    const match = /^\s*\d+\s*\|([^|]+)\|([^|]+)$/.exec(line);
    if (!match) continue;
    const prompt: RecallPrompt = { text: match[1]!.trim(), gloss: match[2]!.trim(), frames: frames.map((frame) => frame.id) };
    if (used.has(prompt.text) || !prompt.gloss) continue;
    if (!recallFits(language, prompt.text, frames)) continue;
    used.add(prompt.text);
    out.push(prompt);
  }
  return out.length >= 2 ? out.slice(0, RECALL_PER_KEY) : null;
}

/** 틀 묶음 하나(id 하나 또는 두 개, 정렬)의 문제. 앱 언어가 영어가 아니면 뜻을 그 말로. */
export async function recallPrompts(language: string, frames: readonly Frame[], ui: string, uiName: string, onMake?: () => void): Promise<RecallPrompt[]> {
  if (!frames.length || frames.length > 2) return [];
  const id = frames.map((frame) => frame.id).sort().join("+");
  const key = `recall:v1:${language}:${id}`;
  let prompts = await kvGetJson<RecallPrompt[]>(key).catch(() => null);
  if (!Array.isArray(prompts) || !prompts.length) {
    onMake?.();
    prompts = await makePrompts(language, frames).catch(() => null);
    if (!prompts) return [];
    await kvSetJson(key, prompts, TTL_SECONDS).catch(() => undefined);
  }
  if (ui === "en") return prompts;
  const moved = await translated(prompts.map((prompt) => prompt.gloss), ui, uiName, `${key}:${ui}`, onMake);
  if (!moved) return prompts;
  return prompts.map((prompt, index) => ({ ...prompt, gloss: moved[index] ?? prompt.gloss }));
}
