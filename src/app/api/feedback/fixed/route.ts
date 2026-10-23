import { NextRequest } from "next/server";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { canReadFeedback } from "@/lib/server/feedbackStore";
import { announceFix, type Recipient } from "@/lib/server/feedbackFixStore";
import {
  CARD_ID,
  clampReward,
  FIX_LOCALES,
  FIX_TEXT_MAX,
  SENDER_TAG,
  isFixLocale,
  type FeedbackFix,
  type FixLocale,
} from "@/lib/feedbackFix";

export const dynamic = "force-dynamic";

export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request);
}

/**
 * POST — 의견함 카드가 반영·완료됐다. 앱을 운영하는 사람(의견함 정리 예약 작업)만,
 * 헤더 x-feedback-key. 묶인 사람마다 소식을 하나 쌓는다(같은 카드는 한 사람에게 한 번).
 *
 * body: { card, appVersion, texts: {ko: "…", ja: "…"}, shots: ["ko","ja"], reward?: 5~50,
 *         recipients: [{ sender: "<16자 해시>", uiLocale: "ja" }] }   — recipients는 의견을 보낸 순서대로(먼저 보낸 3명만 보상)
 * 그림(public/feedback-fix/<card>/<언어>/{before,after}.webp)은 PR로 먼저 배포돼 있어야 한다.
 */
export async function POST(request: NextRequest) {
  if (!canReadFeedback(request.headers.get("x-feedback-key"))) {
    return jsonWithCors(request, { error: "FORBIDDEN" }, { status: 403 });
  }
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return jsonWithCors(request, { error: "Invalid JSON" }, { status: 400 });
  }
  const card = typeof body.card === "string" ? body.card.trim() : "";
  if (!CARD_ID.test(card)) return jsonWithCors(request, { error: "CARD" }, { status: 400 });

  const appVersion = typeof body.appVersion === "string" && /^\d+(\.\d+){0,2}$/.test(body.appVersion.trim()) ? body.appVersion.trim() : "";

  const texts: Partial<Record<FixLocale, string>> = {};
  const rawTexts = (body.texts ?? {}) as Record<string, unknown>;
  for (const locale of FIX_LOCALES) {
    const text = rawTexts[locale];
    if (typeof text === "string" && text.trim()) texts[locale] = text.trim().slice(0, FIX_TEXT_MAX);
  }
  if (!Object.keys(texts).length) return jsonWithCors(request, { error: "TEXTS" }, { status: 400 });

  const shots = Array.isArray(body.shots) ? [...new Set(body.shots.filter(isFixLocale))] : [];

  const recipients: Recipient[] = [];
  for (const row of Array.isArray(body.recipients) ? body.recipients.slice(0, 2000) : []) {
    const sender = typeof row?.sender === "string" ? row.sender : "";
    if (!SENDER_TAG.test(sender)) continue;
    recipients.push({ sender, uiLocale: typeof row?.uiLocale === "string" ? row.uiLocale.slice(0, 10) : "" });
  }

  const reward = clampReward(body.reward);
  const fix: FeedbackFix = { card, at: Date.now(), appVersion, texts, shots, ...(reward ? { reward } : {}) };
  const result = await announceFix(fix, recipients);
  return jsonWithCors(request, { ok: true, ...result });
}
