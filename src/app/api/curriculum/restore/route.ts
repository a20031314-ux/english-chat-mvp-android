import { NextRequest } from "next/server";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { requestUserId } from "@/lib/server/premiumRequest";
import { isIdentified } from "@/lib/server/identity";
import { restorePreviousMap } from "@/lib/server/curriculumStore";
import { coerceLanguageCode } from "@/lib/learningLanguages";

export const dynamic = "force-dynamic";

/** Put back the map a new goal replaced. 404 when there is none. */
export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request);
}

export async function POST(request: NextRequest) {
  const userId = requestUserId(request);
  if (!isIdentified(userId)) {
    return jsonWithCors(request, { error: "IDENTITY_REQUIRED" }, { status: 401 });
  }
  let body: Record<string, unknown> = {};
  try {
    body = await request.json();
  } catch {
    // A body is optional; the language falls back like everywhere else.
  }
  const record = await restorePreviousMap(userId, coerceLanguageCode(body.language));
  if (!record) return jsonWithCors(request, { error: "NO_PREVIOUS_MAP" }, { status: 404 });
  return jsonWithCors(request, record);
}
