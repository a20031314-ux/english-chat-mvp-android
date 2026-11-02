/**
 * Stagebank 고정 수업(2026-11-02 사용자 "stagebank같이 고정된 학습공간은 구체화해서 만들어두면" → "섞어서" → "시작해줘").
 *
 * 문장구조 하나 = 뜻 · 대표 예문 · 조각 ↔ 하는 일 ↔ 앱 언어 표 · 순서(앱 언어와 어떻게 다른지) · ___ 자리 · 대답 ·
 * 흔한 실수(틀린 꼴 → 바른 꼴 + 이유) · 퀴즈 셋(빈칸 쓰기·고르기·틀린 곳 고치기) · 대화 셋. 모양은 curriculum/fixedLessons/check.ts.
 *
 * 어디서 오나(앞이 이김):
 *  1. 저장소 원고(curriculum/fixedLessons/<학습>.<앱>.json — 사람이 보고 고친 것)
 *  2. 서버 저장(`fixedlesson:v1:<학습>:<앱>:<틀>`, 만료 없음) — Sonnet이 쓰고 검사기를 통과한 것만
 *     · 앱 언어 한국어·영어는 예약 작업이 미리 다 만든다(seedFixedLessons, /api/curriculum/fixed-lesson/seed)
 *     · 그 밖의 앱 언어는 누가 처음 열 때 뒤에서 만든다(그동안은 예전 수업)
 * 학습자 글은 받지 않는다. 멈추기: Vercel `FIXED_LESSON_SEED=off`(미리 만들기만) · `FIXED_LESSON_MAKE=off`(새로 만들기 전부).
 */
import { kvGetJson, kvSetJson } from "./kv.ts";
import { completeChat } from "./llm.ts";
import { getOpenAIClient } from "./openai.ts";
import { allFramesFor, type Frame } from "../curriculum/frames.ts";
import { ladderFor } from "../curriculum/stages/index.ts";
import { glossFor } from "../curriculum/stageScripts.ts";
import { loadBank } from "../curriculum/vocabBank.ts";
import { tooEarlyWords } from "../curriculum/lessonWords.ts";
import { checkLesson, type FixedLesson, type CheckIssue } from "../curriculum/fixedLessons/check.ts";
import { staticFixedLesson, FIXED_EXAMPLE } from "../curriculum/fixedLessons/index.ts";
import type { FrameLesson } from "../curriculum/frameLesson.ts";
import { INTERFACE_LANGUAGE_LABELS, SUPPORTED_LEARNING_LANGUAGES } from "../learningLanguages.ts";

/** 미리 다 만드는 앱 언어(2026-11-02 정함 — 지금 사용자 대부분). 나머지는 첫 열기 때. */
export const SEED_UIS = ["ko", "en"] as const;
const keyOf = (language: string, ui: string, id: string) => `fixedlesson:v1:${language}:${ui}:${id}`;
const failKeyOf = (language: string, ui: string, id: string) => `fixedlesson:v1:fail:${language}:${ui}:${id}`;
/** 같은 틀을 몇 번까지 다시 만들어 볼지(넘으면 사람이 볼 때까지 예전 수업). */
const MAX_FAILS = 3;
const making = new Set<string>();

const makeOff = () => process.env.FIXED_LESSON_MAKE?.trim() === "off";

function grammarNames(language: string, frame: Frame): string[] {
  const stage = ladderFor(language)?.stages.find((one) => one.order === frame.stage);
  const list = (stage as { grammar?: { name: { en?: string } }[] } | undefined)?.grammar ?? [];
  return (frame.grammar ?? []).map((index) => list[index]?.name?.en ?? "").filter(Boolean);
}

function prompt(language: string, ui: string, frame: Frame): { system: string; user: string } {
  const lang = INTERFACE_LANGUAGE_LABELS[language] ?? language;
  const uiName = INTERFACE_LANGUAGE_LABELS[ui] ?? ui;
  const system = `You write one fixed lesson for a language-learning app: one ${lang} sentence pattern, taught to a speaker of ${uiName}. The lesson is stored and shown to every such learner, so it must be correct, concrete and useful.

Write every explanation in natural ${uiName} (short, plain, friendly, no jargon unless unavoidable). Every sentence the learner says or reads in ${lang} is written in ${lang}.

The lesson has these parts:
- meaning: what the pattern lets you say, as the natural ${uiName} equivalent with ___ for the slot, plus a few words of when.
- sample: one short example sentence (not one of the practice sentences) and its ${uiName} meaning.
- map: split the sample into its pieces in order. For each piece: the exact ${lang} piece as it appears in the sample, what it does (one short line), and which part of the ${uiName} sentence it corresponds to (write "(${uiName}에 없음)"-style note in ${uiName} if nothing corresponds). The point is to show which ${lang} piece is the "___" part and how the rest maps onto the ${uiName} phrase.
- order: one or two sentences on how the word order differs from ${uiName}.
- slot: what goes in ___ and any form rule for it (e.g. verb form, article, plural).
- reply: a typical answer or response and its meaning (optional but usually helpful).
- mistakes: 2-3 mistakes that ${uiName} speakers really make with THIS pattern. Each: the wrong ${lang} sentence, the right one, and why it is wrong in one short ${uiName} line (point to the ${uiName} habit that causes it when there is one). Never list a correct alternative as a mistake.
- quiz: exactly three questions in this order:
  1. type: a sentence with one blank (before / after) and the answer the learner types; cue = the ${uiName} meaning of the full sentence. The answer must be a key part of the pattern and must not appear in before/after.
  2. choose: a sentence with one blank, four options (index of the right one in "answer"); wrong options are the typical mistaken forms of the right answer (wrong conjugation, particle, article, word order), never correct alternatives; cue = meaning.
  3. fix: a sentence containing one mistake from the mistakes list style; "bad" = the exact wrong piece as it appears, "right" = what replaces it; cue = meaning of the corrected sentence.
- turns: exactly three short exchanges. "them" = another person's line in ${lang} that naturally leads to an answer using the pattern (do not use the pattern yourself in "them"); "me" = the learner's answer that uses the pattern's fixed part exactly; each with a ${uiName} meaning. The answer must follow logically from "them".

Stage ${frame.stage} of 5 (1 = first week). Use only basic, high-frequency words for that stage in every ${lang} sentence; no rare nouns, brands, real people or places other than common country/city names; nothing rude. Never reuse a practice sentence.

Answer with one JSON object and nothing else, with exactly these keys:
{"meaning":"","sample":{"text":"","gloss":""},"map":[{"piece":"","role":"","ui":""}],"order":"","slot":"","reply":"","mistakes":[{"wrong":"","right":"","why":""}],"quiz":[{"kind":"type","before":"","after":"","answer":"","cue":""},{"kind":"choose","before":"","after":"","options":["","","",""],"answer":0,"cue":""},{"kind":"fix","wrong":"","bad":"","right":"","cue":""}],"turns":[{"them":"","themGloss":"","me":"","meGloss":""}]}

Here is a finished lesson of the right quality and shape (English pattern for Korean speakers; follow its depth, not its language):
${JSON.stringify(FIXED_EXAMPLE)}`;
  const grammar = grammarNames(language, frame);
  const user = `Pattern: ${frame.pattern}
Fixed part(s) the learner's answers must contain: ${frame.core.join(" / ")}
Meaning (English): ${glossFor(frame.meaning, "en")}
${grammar.length ? `Grammar it practises: ${grammar.join("; ")}\n` : ""}Practice sentences already used (do not reuse): ${frame.examples.map((example) => example.text).join(" / ")}`;
  return { system, user };
}

function parse(raw: string, frame: Frame): FixedLesson | null {
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  try {
    const body = JSON.parse(raw.slice(start, end + 1)) as Omit<FixedLesson, "id" | "pattern">;
    return { ...body, id: frame.id, pattern: frame.pattern };
  } catch {
    return null;
  }
}

/** Sonnet이 쓰고 검사기가 본다 — 오류가 있으면 그 목록을 주고 한 번 다시. 둘 다 안 되면 null. */
export async function makeFixedLesson(language: string, ui: string, frame: Frame, onMake?: () => void): Promise<{ lesson: FixedLesson | null; issues: CheckIssue[] }> {
  const client = getOpenAIClient();
  if (!client) return { lesson: null, issues: [{ id: frame.id, level: "error", what: "모델 키 없음" }] };
  const bank = await loadBank(language).catch(() => [] as const);
  const early = (text: string) => tooEarlyWords(language, text, frame.stage, bank);
  const { system, user } = prompt(language, ui, frame);
  let feedback = "";
  let issues: CheckIssue[] = [];
  for (let attempt = 0; attempt < 2; attempt += 1) {
    onMake?.();
    const completion = await completeChat(client, "fixedLesson", {
      temperature: 0.4,
      max_tokens: 3000,
      messages: [
        { role: "system", content: system },
        { role: "user", content: feedback ? `${user}\n\nYour previous answer failed these checks — fix them and answer again with the full JSON:\n${feedback}` : user },
      ],
    });
    const lesson = parse(String(completion.choices[0]?.message?.content ?? ""), frame);
    if (!lesson) {
      issues = [{ id: frame.id, level: "error", what: "JSON을 못 읽음" }];
      feedback = "- The answer was not one valid JSON object.";
      continue;
    }
    issues = checkLesson(lesson, frame, early);
    const errors = issues.filter((one) => one.level === "error");
    // 이른 낱말 경고도 다시 쓰게(사람 원고에서는 나라 이름 같은 것만 남겼다).
    const warns = issues.filter((one) => one.level === "warn" && !/^이 단계에 이른 낱말: [\p{Lu}][\p{L}]*\.?$/u.test(one.what));
    if (!errors.length && (attempt === 1 || !warns.length)) return { lesson, issues };
    feedback = [...errors, ...warns].map((one) => `- ${one.what}`).join("\n");
  }
  return { lesson: null, issues };
}

/** 저장소 원고 → 서버 저장. 없으면 null. */
export async function storedFixedLesson(language: string, ui: string, id: string): Promise<FixedLesson | null> {
  return staticFixedLesson(language, ui, id) ?? (await kvGetJson<FixedLesson>(keyOf(language, ui, id)).catch(() => null));
}

async function makeAndStore(language: string, ui: string, frame: Frame, onMake?: () => void): Promise<boolean> {
  const id = `${language}:${ui}:${frame.id}`;
  if (making.has(id)) return false;
  making.add(id);
  try {
    const fails = (await kvGetJson<number>(failKeyOf(language, ui, frame.id)).catch(() => 0)) ?? 0;
    if (fails >= MAX_FAILS) return false;
    const { lesson } = await makeFixedLesson(language, ui, frame, onMake).catch(() => ({ lesson: null }));
    if (!lesson) {
      await kvSetJson(failKeyOf(language, ui, frame.id), fails + 1).catch(() => undefined);
      return false;
    }
    await kvSetJson(keyOf(language, ui, frame.id), lesson).catch(() => undefined);
    return true;
  } finally {
    making.delete(id);
  }
}

/**
 * 수업을 열 때: 고정 수업이 있으면 그것. 없고 미리 만드는 앱 언어가 아니면 뒤에서 만들기 시작(이번엔 null — 예전 수업으로).
 * later = 응답을 보낸 뒤 할 일(next/server after).
 */
export async function fixedLessonFor(language: string, ui: string, frame: Frame, later?: (job: () => Promise<unknown>) => void, onMake?: () => void): Promise<FixedLesson | null> {
  const have = await storedFixedLesson(language, ui, frame.id);
  if (have) return have;
  if (!makeOff() && later && !(SEED_UIS as readonly string[]).includes(ui)) later(() => makeAndStore(language, ui, frame, onMake));
  return null;
}

/** 고정 수업 → 예전 수업 모양(옛 앱·지금 화면이 그대로 그리게): 뜻·조각(틀에 없는 조각은 ___)·쓰임(___ 자리)·대화. */
export function asFrameLesson(lesson: FixedLesson, frame: Frame): FrameLesson {
  const parts: { piece: string; role: string }[] = [];
  for (const row of lesson.map) {
    const fixedPiece = row.piece.split("/").map((one) => one.trim()).find((one) => frame.pattern.toLowerCase().includes(one.toLowerCase()));
    const piece = fixedPiece ?? "___";
    const last = parts[parts.length - 1];
    if (last && last.piece === "___" && piece === "___") last.role = `${last.role} · ${row.ui}`;
    else parts.push({ piece, role: piece === "___" ? `${row.ui} — ${row.role}` : `${row.role} (${row.ui})` });
  }
  return { explain: [], meaning: lesson.meaning, parts, usage: lesson.slot, turns: lesson.turns };
}

export type SeedResult = { made: number; failed: number; left: number; done: number; total: number; off?: boolean };

/** 예약 작업: 미리 만드는 앱 언어 × 14개 학습 언어 × 1~5단계 틀 중 아직 없는 것을 한 번에 batch개(넷씩 나란히). */
export async function seedFixedLessons(batch = 16, onMake?: () => void): Promise<SeedResult> {
  const todo: { language: string; ui: string; frame: Frame }[] = [];
  let total = 0;
  for (const stage of [1, 2, 3, 4, 5]) {
    for (const ui of SEED_UIS) {
      for (const { code } of SUPPORTED_LEARNING_LANGUAGES) {
        if (code === ui) continue;
        for (const frame of allFramesFor(code).filter((one) => one.stage === stage)) {
          total += 1;
          todo.push({ language: code, ui, frame });
        }
      }
    }
  }
  const missing: typeof todo = [];
  for (const one of todo) {
    if (staticFixedLesson(one.language, one.ui, one.frame.id)) continue;
    const stored = await kvGetJson<FixedLesson>(keyOf(one.language, one.ui, one.frame.id)).catch(() => null);
    if (stored) continue;
    const fails = (await kvGetJson<number>(failKeyOf(one.language, one.ui, one.frame.id)).catch(() => 0)) ?? 0;
    if (fails < MAX_FAILS) missing.push(one);
  }
  const done = total - missing.length;
  if (process.env.FIXED_LESSON_SEED?.trim() === "off" || makeOff()) return { made: 0, failed: 0, left: missing.length, done, total, off: true };
  const take = missing.slice(0, batch);
  let made = 0;
  let failed = 0;
  for (let at = 0; at < take.length; at += 4) {
    const results = await Promise.all(take.slice(at, at + 4).map((one) => makeAndStore(one.language, one.ui, one.frame, onMake)));
    for (const ok of results) ok ? (made += 1) : (failed += 1);
  }
  return { made, failed, left: missing.length - made, done: done + made, total };
}
