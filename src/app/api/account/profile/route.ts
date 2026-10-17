import { NextRequest } from "next/server";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { accountFromRequest, readJsonBody } from "@/lib/server/accountRequest";
import { saveProfile, toPublic } from "@/lib/server/accountStore";
import { cleanBio, cleanNickname, cleanPhoto } from "@/lib/account/shared";

export const dynamic = "force-dynamic";

/**
 * 프로필 저장: 닉네임·자기소개·사진.
 *
 * POST { nickname, bio, photo? } — photo가 없으면 그대로, null이면 지움, data URL이면 바꿈.
 * → { account } | { error: PHOTO_INVALID }
 */
export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request);
}

export async function POST(request: NextRequest) {
  const found = await accountFromRequest(request);
  if ("response" in found) return found.response;

  const body = await readJsonBody<{ nickname?: unknown; bio?: unknown; photo?: unknown }>(request);
  if (!body) return jsonWithCors(request, { error: "BAD_REQUEST" }, { status: 400 });

  let photo: string | null | undefined;
  if (body.photo === null) photo = null;
  else if (body.photo === undefined) photo = undefined;
  else {
    photo = cleanPhoto(body.photo);
    if (photo === null) return jsonWithCors(request, { error: "PHOTO_INVALID" }, { status: 400 });
  }

  const updated = await saveProfile(found.account, {
    nickname: cleanNickname(body.nickname),
    bio: cleanBio(body.bio),
    photo,
  });
  return jsonWithCors(request, { account: await toPublic(updated) });
}
