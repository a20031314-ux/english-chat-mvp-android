import { createHash } from "node:crypto";
import { NextRequest } from "next/server";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { coerceLanguageCode, INTERFACE_LANGUAGE_LABELS } from "@/lib/learningLanguages";
import { completeChat } from "@/lib/server/llm";
import { kvGetJson, kvSetJson } from "@/lib/server/kv";
import { meterRequest } from "@/lib/server/meterRequest";
import { getOpenAIClient } from "@/lib/server/openai";

export const dynamic = "force-dynamic";

/**
 * POST { language, ui, sentence, options[], answer } → { notes: [{ meaning, why }] }
 *
 * 고르기 문제를 답한 뒤 보기마다 뜻(앱 언어 — 품사 + 뜻 한 줄)과, 틀린 보기면 이 자리에 왜 안 맞는지 한 줄
 * (2026-11-03 사용자 "정답·오답이 각각 무슨 뜻인지, 오답은 왜 오답인지가 안 떠"). 문제(문장·보기·정답·앱 언어)마다 한 번 만들어
 * 모두가 같이 쓴다(quiznotes:v1, 180일) — 문제은행 문장은 사용자끼리 같아서 대부분 저장된 것을 돌려준다. 학습자가 고른 보기·누가 물었는지는 남기지 않는다.
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
  if (!language || !sentence || options.length < 2 || answer < 0 || answer >= options.length) {
    return jsonWithCors(request, { error: "bad input" }, { status: 400 });
  }
  const key = `quiznotes:v1:d:${createHash("sha256").update(JSON.stringify([language, ui, sentence, options, answer])).digest("hex").slice(0, 32)}`;
  const cached = await kvGetJson<Note[]>(key).catch(() => null);
  if (cached?.length === options.length) return jsonWithCors(request, { notes: cached, cached: true });

  const client = getOpenAIClient();
  if (!client) return jsonWithCors(request, { notes: [] });
  await meterRequest(request, "quizOptionNotes");
  const target = INTERFACE_LANGUAGE_LABELS[language] ?? language;
  const native = INTERFACE_LANGUAGE_LABELS[ui] ?? ui;
  const completion = await completeChat(client, "vocab", {
    response_format: { type: "json_object" },
    max_tokens: 600,
    messages: [
      {
        role: "system",
        content: `A learner of ${target} has just answered a multiple-choice blank. For every option, in order, write in ${native}:
- "meaning": its part of speech and its usual meaning — at most 8 words, no example, no usage notes (for a phrase, what it means as a whole).
- "why": for the correct option, empty. For every other option, one plain sentence of at most 15 words a teacher would say about why it does not fit this blank — the grammar reason (wrong form, wrong part of speech, agreement, tense, particle) or that the meaning does not fit the sentence. Name the one main reason; do not just say it is wrong, and do not add a second explanation. If it would actually also be correct here, say so plainly.
Write only in ${native}, except the ${target} words themselves. Keep the options in the order given, and copy each option exactly into "option". Reply with JSON only: {"notes":[{"option":"…","meaning":"…","why":"…"}, …]} with exactly one entry per option.`,
      },
      {
        role: "user",
        content: `Sentence: ${sentence}\nOptions:\n${options.map((one, i) => `${i + 1}. ${one}${i === answer ? " (correct)" : ""}`).join("\n")}`,
      },
    ],
  }).catch(() => null);
  const reply = completion?.choices[0]?.message?.content ?? "";
  let notes: Note[] = [];
  try {
    const parsed = JSON.parse(reply.slice(reply.indexOf("{"), reply.lastIndexOf("}") + 1)) as { notes?: unknown };
    if (Array.isArray(parsed.notes)) {
      // 모델이 정답을 앞으로 옮겨 쓰는 일이 있었다(운영 2026-11-03 es: 뜻이 한 칸씩 밀림) — 보기 글로 짝을 맞추고, 못 맞추면 순서대로.
      const rows = parsed.notes.map((one) => (one ?? {}) as Record<string, unknown>);
      const norm = (value: unknown) => (typeof value === "string" ? value.trim().toLocaleLowerCase() : "");
      const byText = options.map((option) => rows.find((row) => norm(row.option) === option.trim().toLocaleLowerCase()));
      const matched = byText.every(Boolean);
      notes = options.map((_, i) => {
        const row = (matched ? byText[i] : rows[i]) ?? {};
        return { meaning: text(row.meaning, 120), why: i === answer ? "" : text(row.why, 200) };
      });
    }
  } catch {
    notes = [];
  }
  if (notes.length !== options.length || notes.every((one) => !one.meaning)) return jsonWithCors(request, { notes: [] });
  await kvSetJson(key, notes, TTL).catch(() => undefined);
  return jsonWithCors(request, { notes });
}
