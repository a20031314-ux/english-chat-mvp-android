import { NextRequest } from "next/server";
import { completeChat } from "@/lib/server/llm";
import { getOpenAIClient } from "@/lib/server/openai";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { meterRequest } from "@/lib/server/meterRequest";
import { requestUserId } from "@/lib/server/premiumRequest";
import { isIdentified } from "@/lib/server/identity";
import { addDailyVerify } from "@/lib/server/entitlementStore";
import { correctionRisk } from "@/lib/correctionRisk";
import { shouldKeepLearnerLine } from "@/lib/correctionGuard";
import { findIrregularSlips, koreanSlipHint, repairIrregularSlips } from "@/lib/koreanSlips";
import { targetLanguageFocusHints } from "@/lib/languageFocus";
import { touchesDisputed } from "@/lib/rooms/agreement";
import {
  coerceLanguageCode,
  INTERFACE_LANGUAGE_LABELS,
  isInterfaceLanguage,
  learningLanguageName,
} from "@/lib/learningLanguages";

/**
 * 채팅 고친 문장 확인 — 싼 모델이 만든 교정을 확인 모델(llm.ts "chatVerify", high 등급)이 한 번 더 본다.
 *
 * 앱이 부르는 때: 사용자가 접힌 교정을 열 때(기본 "눌러서 보기"), 또는 "바로 보기"에서 답을 받은 뒤 뒤에서.
 * 위험한 줄만(`correctionRisk`) — 아니면 모델 없이 그대로 돌려준다. 하루 상한 `VERIFY_DAILY_MAX`(기본 30)를 넘으면 그대로.
 * 학습자 문장은 저장하지 않는다(받아서 보고 돌려줄 뿐). 학습 기록은 채팅 턴 때 이미 싼 모델 교정으로 남았다.
 * 설계: `hub/drafts/model-cascade-2026-10-21.md` 안 C.
 */

const MAX_CHARS = 600;

export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request);
}

function text(value: unknown): string {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim().slice(0, MAX_CHARS) : "";
}

function dailyMax(): number {
  const n = Number(process.env.VERIFY_DAILY_MAX);
  return Number.isFinite(n) && n >= 0 ? n : 30;
}

// 말하는 방 내 줄(받아쓴 말)을 확인할 때 덧붙이는 지시(2026-10-22) — 문장부호·대소문자는 받아쓰기 몫, "unsure" 낱말은 그대로.
const SPOKEN_NOTE = `
"original" is a speech-to-text transcript of something the learner SAID. Punctuation, capital letters and spacing come from the transcriber: never correct or mention them. Fillers, restarts and repeated words are normal speech, not mistakes. If "unsure" lists words, keep each exactly as it is in corrected.`;

function systemPrompt(target: string, uiName: string, spoken: boolean): string {
  const name = learningLanguageName(target as Parameters<typeof learningLanguageName>[0]);
  return `You check one correction made by a language-learning chat app. A learner wrote "original" in ${name}; a fast model produced "corrected" and "explanation". Act as a strict native ${name} teacher.${spoken ? SPOKEN_NOTE : ""}

Return the best correction:
- corrected: the learner's line with EVERY real mistake fixed (grammar, conjugation/irregular forms, particles, word order, tense with time words, politeness/honorifics toward a teacher, elder, boss or customer). Keep their meaning exactly — who does what to whom, the tense they meant — and keep their wording wherever it is already acceptable. Never lower the politeness they used. Do not rewrite acceptable text for style.
- explanation: 1–2 short sentences in ${uiName} naming exactly what changed and why, with correct grammar terms. Never call a wrong form acceptable. Never mention a change you did not make.
- If the learner's line had no real mistake, corrected = original exactly and explanation = "".
- changed: true if your corrected or explanation differs in substance from the given ones.

${targetLanguageFocusHints(target as Parameters<typeof targetLanguageFocusHints>[0])}

Return ONLY JSON: {"corrected":"...","explanation":"...","changed":true|false}`;
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return jsonWithCors(request, { error: "Invalid JSON" }, { status: 400 });
  }
  const original = text(body.original);
  const corrected = text(body.corrected);
  const explanation = typeof body.explanation === "string" ? body.explanation.trim().slice(0, MAX_CHARS) : "";
  if (!original || !corrected) {
    return jsonWithCors(request, { error: "original and corrected required" }, { status: 400 });
  }
  const target = coerceLanguageCode(body.targetLanguage);
  const ui =
    typeof body.interfaceLanguage === "string" && isInterfaceLanguage(body.interfaceLanguage)
      ? body.interfaceLanguage
      : typeof body.locale === "string" && isInterfaceLanguage(body.locale)
        ? body.locale
        : "ko";
  const same = { verified: false, changed: false, corrected, explanation };
  // 말하는 방 내 줄에서 열 때(spoken): 받아쓴 말이라는 것과, 두 받아쓰기가 다르게 들은 낱말(unsure).
  const spoken = body.spoken === true;
  const unsure = Array.isArray(body.unsure)
    ? body.unsure.filter((word): word is string => typeof word === "string").map((word) => word.slice(0, 60)).slice(0, 20)
    : [];

  const risk = correctionRisk({ original, corrected, target, explanation });
  if (!risk.risky) return jsonWithCors(request, { ...same, reason: "not_risky" });

  const userId = requestUserId(request);
  if (isIdentified(userId)) {
    try {
      if ((await addDailyVerify(userId)) > dailyMax()) {
        return jsonWithCors(request, { ...same, reason: "daily_max" });
      }
    } catch {
      // 세지 못하면 막지 않는다(사용량 기록과 같은 원칙).
    }
  }

  const openai = getOpenAIClient();
  if (!openai) return jsonWithCors(request, { ...same, reason: "no_model" });
  await meterRequest(request, "chatVerify");

  try {
    const hint = target === "ko" ? koreanSlipHint(original) : "";
    const completion = await completeChat(openai, "chatVerify", {
      messages: [
        { role: "system", content: systemPrompt(target, INTERFACE_LANGUAGE_LABELS[ui] ?? "Korean", spoken) },
        {
          role: "user",
          content: JSON.stringify({
            original,
            corrected,
            explanation,
            ...(hint ? { noticed: hint } : {}),
            ...(spoken && unsure.length ? { unsure } : {}),
          }),
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.2,
      max_tokens: 400,
    });
    const raw = completion.choices[0]?.message?.content ?? "";
    const parsed = JSON.parse(raw) as { corrected?: unknown; explanation?: unknown };
    let next = text(parsed.corrected) || corrected;
    let nextExplanation = typeof parsed.explanation === "string" ? parsed.explanation.trim() : explanation;
    if (target === "ko") next = repairIrregularSlips(next, findIrregularSlips(next));
    const plain = (t: string) => t.normalize("NFC").toLowerCase().replace(/[\p{P}\p{S}\s]/gu, "");
    if (plain(next) === plain(original)) {
      // 확인 모델이 "고칠 것 없음" — 싼 모델이 괜히 고친 줄(별로요·커피가 마시고 싶어요 등). 교정을 거둔다.
      return jsonWithCors(request, { verified: true, changed: true, noError: true, corrected: original, explanation: "" });
    }
    if (shouldKeepLearnerLine(original, next, target) || touchesDisputed(next, unsure, target)) {
      // 확인 모델 답을 가드가 버림(번역·다른 말로 바꿈 등) — 원래 교정을 그대로 둔다.
      return jsonWithCors(request, { ...same, verified: true, reason: "kept" });
    }
    if (!nextExplanation) nextExplanation = explanation;
    const changed = next !== corrected || nextExplanation !== explanation;
    return jsonWithCors(request, {
      verified: true,
      changed,
      corrected: next,
      explanation: nextExplanation,
      reasons: risk.reasons,
    });
  } catch (error) {
    console.error("[chat-verify]", error);
    return jsonWithCors(request, { ...same, reason: "failed" });
  }
}
