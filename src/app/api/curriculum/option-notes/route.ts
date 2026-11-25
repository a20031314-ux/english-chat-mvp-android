import { createHash } from "node:crypto";
import { NextRequest } from "next/server";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { coerceLanguageCode, INTERFACE_LANGUAGE_LABELS } from "@/lib/learningLanguages";
import { completeChat } from "@/lib/server/llm";
import { kvGetJson, kvSetJson } from "@/lib/server/kv";
import { meterRequest, simDetail } from "@/lib/server/meterRequest";
import { getOpenAIClient } from "@/lib/server/openai";

export const dynamic = "force-dynamic";

/**
 * POST { language, ui, sentence, options[], answer } → { notes: [{ meaning, why }] }
 *
 * 고르기 문제를 답한 뒤 보기마다 뜻(앱 언어 — 품사 + 뜻 한 줄)과, 틀린 보기면 이 자리에 왜 안 맞는지 한 줄
 * (2026-11-03 사용자 "정답·오답이 각각 무슨 뜻인지, 오답은 왜 오답인지가 안 떠"). 문제(문장·보기·정답·앱 언어)마다 한 번 만들어
 * 모두가 같이 쓴다(quiznotes:v8 — 틀린 보기는 그 말이 주로 언제 쓰이는지, 짧은 해요체 한 줄, 2026-11-26, 180일 — 학습자 자신의 줄로 만든 문제(mine)는 저장 안 함) — 문제은행 문장은 사용자끼리 같아서 대부분 저장된 것을 돌려준다. 학습자가 고른 보기·누가 물었는지는 남기지 않는다.
 * 기능은 vocab(Haiku) — 단가는 op quizOptionNotes.
 */
const TTL = 180 * 24 * 60 * 60;
type Note = { meaning: string; why: string };

export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request);
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const text = (value: unknown, max: number) => (typeof value === "string" ? value.trim().slice(0, max) : "");
  const language = coerceLanguageCode(typeof body.language === "string" ? body.language : "");
  const ui = coerceLanguageCode(typeof body.ui === "string" ? body.ui : "") || "en";
  const sentence = text(body.sentence, 240);
  const options = Array.isArray(body.options) ? body.options.map((one) => text(one, 80)).filter(Boolean).slice(0, 6) : [];
  const answer = typeof body.answer === "number" ? body.answer : -1;
  // 학습자 자신의 줄(고친 줄·통화 줄)로 만든 문제는 저장하지 않는다 — 학습자 문장은 서버에 남기지 않음(2026-11-03 변경 감시 major).
  const mine = body.mine === true;
  if (!language || !sentence || options.length < 2 || answer < 0 || answer >= options.length) {
    return jsonWithCors(request, { error: "bad input" }, { status: 400 });
  }
  const key = `quiznotes:v8:f:${createHash("sha256").update(JSON.stringify([language, ui, sentence, options, answer])).digest("hex").slice(0, 32)}`;
  const cached = mine ? null : await kvGetJson<Note[]>(key).catch(() => null);
  if (cached?.length === options.length) return jsonWithCors(request, { notes: cached, cached: true });

  const client = getOpenAIClient();
  if (!client) return jsonWithCors(request, { notes: [] });
  await meterRequest(request, "quizOptionNotes");
  const target = INTERFACE_LANGUAGE_LABELS[language] ?? language;
  const native = INTERFACE_LANGUAGE_LABELS[ui] ?? ui;
  const ask = (strict: boolean) => completeChat(client, "vocab", {
    response_format: { type: "json_object" },
    max_tokens: 1200,
    messages: [
      {
        role: "system",
        content: `A learner of ${target} has just answered a multiple-choice blank. For every option, in order, write in ${native}:
- "meaning": its part of speech and its usual meaning — at most 6 words, no example, no usage notes (for a phrase, what it means as a whole). - "real": true if the option is a real word or phrase of ${target} on its own (even if wrong here), false if it is a broken form that does not exist. When false, "meaning" is "".
- "why": for the correct option, empty. For every other option, one short spoken line (at most 16 words) the way a friendly tutor would say it out loud — concrete, never abstract. Do not just say the meaning does not fit the blank; say what the option itself is for.
  · If the option is a real word or phrase: quote it with its short meaning in round parentheses right after (like this), never square brackets, then say when it is usually used — the typical situation, or what it goes with — so the learner sees why it is not this sentence. If its form is what breaks the sentence (part of speech, a form the word before cannot take), say what that form is used for or where it goes instead — naming the part of speech alone is not enough.
  · If it is a broken form: say which word is wrong and what goes there instead, in the same sentence.
  Write it as a single sentence.
  Read the option together with the words right before and after the blank first. One point only, no "because … therefore", no grammar jargon a learner would not know. If it would actually also be correct here, say so plainly.
Tone: casual-polite and warm, never formal or textbook-like. In Korean use 해요체 endings (…예요, …해요, …없어요), never 합니다체 or "…므로"; in Japanese use short です/ます; in other languages the everyday polite register.
Quote ${target} words with single quotes ('like this'), never with double quotes. Both "meaning" and "why" are written in ${native} — never in ${target} — quoting ${target} words only where needed. Number the options as given (1, 2, 3, …). Reply with JSON only, flat keys, one pair per option: {"real_1":true,"meaning_1":"…","why_1":"…","real_2":false,"meaning_2":"","why_2":"…", …}.`,
      },
      ...(strict ? [{ role: "system" as const, content: `The last answer used the wrong language. Every "meaning" and "why" must be in ${native}.` }] : []),
      {
        role: "user",
        content: `Sentence: ${sentence}\nOptions:\n${options.map((one, i) => `${i + 1}. ${one}${i === answer ? " (correct)" : ""}`).join("\n")}\n\nWrite every "meaning" and "why" in ${native}.`,
      },
    ],
  }).catch(() => null);
  let parseError = "";
  const firstRaw = (await ask(false))?.choices[0]?.message?.content ?? "";
  let notes = parseNotes(firstRaw);
  // Haiku가 목록을 글로 싸며 안쪽 따옴표를 깨뜨리면 못 읽는다(운영 2026-11-23 fr) — 한 번만 다시 묻는다.
  if (notes.length !== options.length) {
    await meterRequest(request, "quizOptionNotes");
    notes = parseNotes((await ask(false))?.choices[0]?.message?.content ?? "");
  }
  // 앱 언어 글자가 따로 있는 언어(ar·ja·ko·zh·th·hi·ru)인데 뜻이 그 글자로 안 쓰였으면 한 번 더(운영 2026-11-03 es→ar 뜻이 스페인어로 옴).
  const script = UI_SCRIPT[ui];
  // 따옴표·괄호 안(학습 언어 인용·뜻 괄호)은 빼고 본다 — 영어 까닭에 괄호 속 한국어 뜻만 있어도 통과하던 일(운영 2026-11-26).
  const bare = (line: string) => line.replace(/'[^']*'|‘[^’]*’|「[^」]*」|\([^)]*\)|\[[^\]]*\]/gu, "");
  if (script && notes.length && notes.some((one, i) => (one.meaning && !script.test(one.meaning)) || (i !== answer && one.why && !script.test(bare(one.why))))) {
    await meterRequest(request, "quizOptionNotes");
    const again = parseNotes((await ask(true))?.choices[0]?.message?.content ?? "");
    if (again.length && again.every((one, i) => (!one.meaning || script.test(one.meaning)) && (i === answer || !one.why || script.test(bare(one.why))))) notes = again;
    // 다시 물어도 앱 언어가 아니면 저장하지 않고 빈 답(다음에 다시 만듦) — 다른 말 설명을 180일 돌려주지 않게.
    else return jsonWithCors(request, { notes: [] });
  }
  // 빈 답이면 점검 사용자(simcheck-)에게만 모델 답을 보인다 — 왜 비었는지 보려고.
  if (notes.length !== options.length || notes.every((one, i) => !one.meaning && (i === answer || !one.why))) return jsonWithCors(request, { notes: [], ...simDetail(request, `${parseError} len=${firstRaw.length} n=${notes.length} ${firstRaw.slice(0, 120)}`) });
  if (!mine) await kvSetJson(key, notes, TTL).catch(() => undefined);
  return jsonWithCors(request, { notes });

  function parseNotes(reply: string): Note[] {
  let notes: Note[] = [];
  try {
    const parsed = readReply(reply) as Record<string, unknown>;
    // 평평한 열쇠(meaning_1·why_1 …) — 목록으로 받으면 Haiku가 글로 싸며 안쪽 따옴표를 깨뜨려 보기 설명이 통째로 비었다(운영 2026-11-23).
    if (options.every((_, i) => typeof parsed[`meaning_${i + 1}`] === "string")) {
      // 깨진 꼴(real false)은 뜻 줄 없이 까닭만, 까닭은 첫 문장만(모델이 두 문장으로 늘이는 일, 운영 2026-11-26 ja).
      notes = options.map((_, i) => ({
        meaning: parsed[`real_${i + 1}`] === false && i !== answer ? "" : text(parsed[`meaning_${i + 1}`], 120),
        why: i === answer ? "" : firstSentence(text(parsed[`why_${i + 1}`], 200)),
      }));
      // 깨진 꼴은 뜻이 비어 오므로 그 자리를 why로 판단 — 뜻도 까닭도 없는 보기가 있으면 못 읽은 것.
      if (notes.some((one, i) => !one.meaning && (i === answer || !one.why))) notes = [];
    }
  } catch (error) {
    parseError = error instanceof Error ? error.message.slice(0, 120) : "parse";
    notes = [];
  }
  return notes;
  }
}

const UI_SCRIPT: Record<string, RegExp> = {
  ar: /\p{Script=Arabic}/u,
  ja: /[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}]/u,
  ko: /\p{Script=Hangul}/u,
  zh: /\p{Script=Han}/u,
  th: /\p{Script=Thai}/u,
  hi: /\p{Script=Devanagari}/u,
  ru: /\p{Script=Cyrillic}/u,
};

/** 모델 답 읽기(첫 { 부터 마지막 } 까지). */
function readReply(reply: string): unknown {
  return JSON.parse(reply.slice(reply.indexOf("{"), reply.lastIndexOf("}") + 1));
}

/** 모델이 문장을 늘이면 둘째까지만 — 둘이 합쳐 길면(90자 넘게) 첫 문장만. 문장부호 없는 말(th)은 그대로. */
function firstSentence(line: string): string {
  const parts = line.split(/(?<=[.!?؟])\s+|(?<=[。！？])\s*/u).filter(Boolean);
  if (parts.length < 2) return line;
  const two = `${parts[0]} ${parts[1]}`.trim();
  return two.length <= 90 ? two : parts[0]!;
}
