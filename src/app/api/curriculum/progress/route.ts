import { NextRequest } from "next/server";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { requestUserId } from "@/lib/server/premiumRequest";
import { isIdentified } from "@/lib/server/identity";
import { setTopicStatus } from "@/lib/server/curriculumStore";
import type { TopicStatus } from "@/lib/curriculum/map";
import { coerceLanguageCode } from "@/lib/learningLanguages";

export const dynamic = "force-dynamic";

const STATUSES: TopicStatus[] = ["todo", "doing", "done"];

/** Mark one topic on the current map. 409 when the map changed underneath. */
export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request);
}

export async function POST(request: NextRequest) {
  const userId = requestUserId(request);
  if (!isIdentified(userId)) {
    return jsonWithCors(request, { error: "IDENTITY_REQUIRED" }, { status: 401 });
  }
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return jsonWithCors(request, { error: "Invalid JSON" }, { status: 400 });
  }
  const mapId = typeof body.mapId === "string" ? body.mapId : "";
  const topicId = typeof body.topicId === "string" ? body.topicId : "";
  const status = body.status as TopicStatus;
  if (!mapId || !topicId || !STATUSES.includes(status)) {
    return jsonWithCors(request, { error: "mapId, topicId and status required" }, { status: 400 });
  }
  const record = await setTopicStatus(userId, coerceLanguageCode(body.language), mapId, topicId, status);
  if (!record) return jsonWithCors(request, { error: "MAP_CHANGED" }, { status: 409 });
  return jsonWithCors(request, record);
}
