import { NextRequest } from "next/server";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { requestUserId } from "@/lib/server/premiumRequest";
import { isIdentified } from "@/lib/server/identity";
import { recordMissionSeen } from "@/lib/server/curriculumStore";
import { coerceLanguageCode } from "@/lib/learningLanguages";

export const dynamic = "force-dynamic";

/**
 * The example answer of a mission was opened. Kept as a mark beside the item
 * — "seen" — and never as progress: looking is not producing (PRODUCT.md).
 */
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
  const read = (key: string) => (typeof body[key] === "string" ? (body[key] as string) : "");
  if (!read("mapId") || !read("topicId") || !read("missionId")) {
    return jsonWithCors(request, { error: "mapId, topicId and missionId required" }, { status: 400 });
  }
  await recordMissionSeen({
    userId,
    language: coerceLanguageCode(body.language),
    mapId: read("mapId"),
    topicId: read("topicId"),
    missionId: read("missionId"),
  });
  return jsonWithCors(request, { ok: true });
}
