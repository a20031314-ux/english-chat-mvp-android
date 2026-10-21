import { NextRequest } from "next/server";
import { corsHeaders, corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { requestAuth, resolveRequestEntitlement } from "@/lib/server/premiumRequest";
import { meterRequest } from "@/lib/server/meterRequest";
import { getOpenAIClient } from "@/lib/server/openai";
import { readThread } from "@/lib/server/dmStore";
import { readGroup } from "@/lib/server/groupStore";
import { readAccount } from "@/lib/server/accountStore";
import { blockedEitherWay, isAccountId } from "@/lib/server/socialStore";
import { openMedia, readMediaMeta, uploadMedia, type MediaPlace } from "@/lib/server/mediaStore";
import { threadIdFor } from "@/lib/rooms/dm";
import { isGroupId } from "@/lib/rooms/group";
import { fitSize, isMediaId, mediaDailyLimit, MEDIA_MAX_BYTES } from "@/lib/rooms/media";
import { suspendedResponse } from "@/lib/server/suspension";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * 사람 사이 사진(rooms/media.ts).
 *   POST { scope, dataUrl, w, h } → { image: { id, w, h } } | { error }
 *        scope: { kind: "dm", target } | { kind: "group", id } | { kind: "board" }
 *        error: SIGNED_OUT · BAD_SCOPE · BLOCKED · NOT_MEMBER · TOO_BIG · BAD_TYPE · LIMIT(하루 상한) · REJECTED(검사) · UNAVAILABLE
 *   GET ?id= → 사진(보는 사람 확인: 1:1·단체방은 그 방 사람만, 게시판은 누구나)
 */
export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request);
}

const bad = (request: NextRequest, error: string, status = 400) => jsonWithCors(request, { error }, { status });

/** 검사 모델(OpenAI moderation, 이미지 지원·무료). 못 물어보면 거절 — 검사 없이 두지 않는다. */
async function looksAllowed(dataUrl: string): Promise<boolean> {
  const client = getOpenAIClient();
  if (!client) return false;
  try {
    const result = await client.moderations.create({
      model: "omni-moderation-latest",
      input: [{ type: "image_url", image_url: { url: dataUrl } }],
    });
    return !result.results.some((row) => row.flagged);
  } catch (error) {
    console.error("[media] moderation failed", error);
    return false;
  }
}

function parseDataUrl(value: unknown): { type: string; bytes: Uint8Array } | null {
  if (typeof value !== "string" || value.length > MEDIA_MAX_BYTES * 1.4 + 100) return null;
  const match = /^data:(image\/(?:webp|jpeg|png));base64,([A-Za-z0-9+/=]+)$/.exec(value);
  if (!match) return null;
  return { type: match[1], bytes: new Uint8Array(Buffer.from(match[2], "base64")) };
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return bad(request, "Invalid JSON");
  }
  const auth = requestAuth(request);
  if (!auth) return bad(request, "SIGNED_OUT", 401);
  const me = auth.accountId;
  const scope = body.scope as { kind?: unknown; target?: unknown; id?: unknown } | undefined;
  // 운영자가 사람 기능을 정지한 계정은 쓰기만 막는다(opsStore.ts).
  {
    const stop = await suspendedResponse(request, me);
    if (stop) return stop;
  }
  let place: MediaPlace;
  if (scope?.kind === "dm") {
    if (!isAccountId(scope.target) || scope.target === me || !(await readAccount(scope.target))) return bad(request, "BAD_SCOPE");
    if (await blockedEitherWay(me, scope.target)) return bad(request, "BLOCKED", 403);
    place = { kind: "dm", threadId: threadIdFor(me, scope.target) };
  } else if (scope?.kind === "group") {
    if (!isGroupId(scope.id)) return bad(request, "BAD_SCOPE");
    const group = await readGroup(scope.id);
    if (!group || !group.members.includes(me)) return bad(request, "NOT_MEMBER", 403);
    place = { kind: "group", groupId: scope.id };
  } else if (scope?.kind === "board") {
    place = { kind: "board" };
  } else {
    return bad(request, "BAD_SCOPE");
  }
  const parsed = parseDataUrl(body.dataUrl);
  if (!parsed) return bad(request, "BAD_TYPE");
  const { w, h } = fitSize(Number(body.w) || 1, Number(body.h) || 1, 10_000);
  const { isPremium } = await resolveRequestEntitlement(request);
  void meterRequest(request, "mediaUpload");
  const result = await uploadMedia({
    owner: me,
    place,
    bytes: parsed.bytes,
    type: parsed.type,
    w,
    h,
    dailyLimit: mediaDailyLimit(isPremium),
    check: looksAllowed,
  });
  if (!result.ok) {
    const status = result.error === "LIMIT" ? 429 : result.error === "UNAVAILABLE" ? 503 : result.error === "REJECTED" ? 422 : 400;
    return bad(request, result.error, status);
  }
  return jsonWithCors(request, { image: result.ref });
}

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  if (!isMediaId(id)) return bad(request, "BAD_ID");
  const meta = await readMediaMeta(id);
  if (!meta || (meta.place.kind !== "board" && !meta.used && meta.owner !== requestAuth(request)?.accountId)) return bad(request, "NOT_FOUND", 404);
  if (meta.place.kind !== "board") {
    const me = requestAuth(request)?.accountId;
    if (!me) return bad(request, "SIGNED_OUT", 401);
    if (meta.place.kind === "dm") {
      const thread = await readThread(meta.place.threadId);
      if (!thread?.members.includes(me) && meta.owner !== me) return bad(request, "NOT_FOUND", 404);
    } else {
      const group = await readGroup(meta.place.groupId);
      if (!group?.members.includes(me) && meta.owner !== me) return bad(request, "NOT_FOUND", 404);
    }
  }
  const stream = await openMedia(meta);
  if (!stream) return bad(request, "NOT_FOUND", 404);
  const response = new Response(stream, {
    headers: {
      "content-type": meta.type,
      // 사람마다 확인하고 주는 사진이라 공용 캐시에는 두지 않는다.
      "cache-control": meta.place.kind === "board" ? "public, max-age=86400" : "private, max-age=86400",
    },
  });
  // 앱(capacitor://localhost 등)이 fetch로 받아 그림으로 띄운다.
  for (const [name, value] of Object.entries(corsHeaders(request))) response.headers.set(name, value);
  return response;
}
