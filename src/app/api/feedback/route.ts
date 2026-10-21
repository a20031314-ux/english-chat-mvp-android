import { NextRequest } from "next/server";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { requestUserId } from "@/lib/server/premiumRequest";
import { canReadFeedback, listFeedback, saveFeedback } from "@/lib/server/feedbackStore";
import {
  acceptableImage,
  FEEDBACK_NOTE_MAX,
  isFeedbackTab,
} from "@/lib/feedback";

export const dynamic = "force-dynamic";

function asText(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request);
}

/**
 * POST — a learner's feedback from the sheet: a note, a screenshot, or both.
 * GET  — the feedback since `?since=` (ms), for the person who runs the app
 *        (header x-feedback-key). Pictures come from /api/feedback/image.
 *
 * No model is called.
 */
export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return jsonWithCors(request, { error: "Invalid JSON" }, { status: 400 });
  }
  const note = asText(body.note, FEEDBACK_NOTE_MAX);
  const image = acceptableImage(body.image);
  if (!note && !image) {
    return jsonWithCors(request, { error: "EMPTY" }, { status: 400 });
  }
  const saved = await saveFeedback(requestUserId(request), {
    note,
    image,
    tab: isFeedbackTab(body.tab) ? body.tab : "other",
    uiLocale: asText(body.uiLocale, 10),
    learningLanguage: asText(body.learningLanguage, 10),
    appVersion: asText(body.appVersion, 20) || request.headers.get("x-app-version")?.slice(0, 20) || "",
    platform: body.platform === "android" ? "android" : "web",
  });
  if (!saved.ok) {
    return jsonWithCors(request, { error: saved.error }, { status: 429 });
  }
  return jsonWithCors(request, { ok: true, id: saved.id });
}

export async function GET(request: NextRequest) {
  if (!canReadFeedback(request.headers.get("x-feedback-key"))) {
    return jsonWithCors(request, { error: "FORBIDDEN" }, { status: 403 });
  }
  const since = Number(request.nextUrl.searchParams.get("since") ?? 0) || 0;
  const items = await listFeedback(since);
  return jsonWithCors(request, { items });
}
