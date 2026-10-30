import { NextRequest } from "next/server";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { coerceLanguageCode, INTERFACE_LANGUAGE_LABELS } from "@/lib/learningLanguages";
import { completeChat } from "@/lib/server/llm";
import { meterRequest } from "@/lib/server/meterRequest";
import { getOpenAIClient } from "@/lib/server/openai";

export const dynamic = "force-dynamic";

/**
 * POST { language, kind: "blank" | "fix", sentence, answer, typed } → { ok }
 *
 * 퀴즈에서 직접 친 답(빈칸 쓰기·틀린 곳 고치기, 2026-10-30 사용자 "타이핑해서 맞추는 식")이 정해진 꼴과 글자로 다를 때만 앱이 부른다 —
 * 같은 뜻의 다른 맞는 답(I do not ↔ I don't, 한자 대신 가나, 일본어 로마자)을 틀림으로 세지 않게. 기능은 scriptJudge(뜻끼리 맞춤, Haiku).
 * 친 글은 판단에만 쓰고 어디에도 남기지 않는다. 글은 짧게만 받는다(문장 200자·말 60자).
 */
export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request);
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const text = (value: unknown, max: number) => (typeof value === "string" ? value.trim() : "").slice(0, max + 1);
  const language = coerceLanguageCode(typeof body.language === "string" ? body.language : "");
  const kind = body.kind === "fix" ? "fix" : "blank";
  const sentence = text(body.sentence, 200);
  const answer = text(body.answer, 200);
  const typed = text(body.typed, kind === "fix" ? 200 : 60);
  if (!sentence || !answer || !typed || sentence.length > 200 || answer.length > 200 || typed.length > (kind === "fix" ? 200 : 60)) {
    return jsonWithCors(request, { error: "bad input" }, { status: 400 });
  }
  const client = getOpenAIClient();
  if (!client) return jsonWithCors(request, { ok: false });
  await meterRequest(request, "quizTypedCheck");
  const name = INTERFACE_LANGUAGE_LABELS[language] ?? language;
  // 빈칸이면 친 말을 넣은 온 문장끼리 비교한다(조각만 보면 모델이 "정해진 답과 다름"에 끌림, 운영 2026-10-31).
  const filled = (piece: string) => (sentence.includes("___") ? sentence.replace("___", piece) : sentence.replace(/＿+/, piece));
  const expected = kind === "blank" ? filled(answer) : answer;
  const learner = kind === "blank" ? filled(typed) : typed;
  const task = `Language: ${name}
Expected sentence: ${expected}
Learner's sentence: ${learner}`;
  let failure = "";
  const completion = await completeChat(client, "scriptJudge", {
    // JSON 하나 — 도구로 받는다(llm.ts). 짧은 한도면 앞 생각이 다 먹어 빈 답이 왔다(운영 2026-10-31, max_tokens 40).
    response_format: { type: "json_object" },
    max_tokens: 300,
    messages: [
      {
        role: "system",
        content: `You grade one quiz answer by comparing two sentences. The learner's sentence is ok when a teacher would accept it as a correct answer: it is grammatical, has no spelling mistake, and says the same thing as the expected sentence. Accept equivalent forms: contraction vs full form, the same word in another accepted script (kana instead of kanji, or the reverse), an equally correct word order or synonym with the same meaning. Not ok: any grammar or spelling error, a different meaning, a missing or extra word that changes the sentence. Reply with JSON only: {"ok":true} or {"ok":false}.`,
      },
      { role: "user", content: task },
    ],
  }).catch((error: unknown) => {
    failure = error instanceof Error ? error.message.slice(0, 200) : "error";
    return null;
  });
  const reply = completion?.choices[0]?.message?.content ?? "";
  const ok = /"ok"\s*:\s*true/.test(reply);
  // 점검용: 머리 x-typed-debug면 모델 답(친 글은 없음)을 같이.
  const debug = request.headers.get("x-typed-debug") === "1" ? { reply: reply.slice(0, 200), failure } : {};
  return jsonWithCors(request, { ok, ...debug });
}
