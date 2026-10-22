import { NextRequest } from "next/server";
import { corsHeaders, corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { requestAuth } from "@/lib/server/premiumRequest";
import { meterRequest } from "@/lib/server/meterRequest";
import { getOpenAIClient } from "@/lib/server/openai";
import { readAccount, readAccounts } from "@/lib/server/accountStore";
import { addReport } from "@/lib/server/socialStore";
import { suspendedResponse } from "@/lib/server/suspension";
import { prepareIcon } from "@/lib/server/iconImage";
import {
  addIcon,
  createPack,
  decorate,
  deletePack,
  listPacks,
  listPacksBy,
  myPacks,
  openIcon,
  readPack,
  removeIcon,
  renamePack,
  setCollected,
  type PackError,
} from "@/lib/server/iconStore";
import {
  ICON_MIN_ACCOUNT_AGE_MS,
  ICON_UPLOAD_MAX_BYTES,
  PACK_NAME_MAX,
  cleanPhrase,
  cleanShortText,
  isIconId,
  isIconLicense,
  isPackId,
  type IconPack,
} from "@/lib/rooms/icons";
import { isAccountId } from "@/lib/server/socialStore";
import { cleanText } from "@/lib/rooms/protocol";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * 사용자가 만든 아이콘·짤 묶음(rooms/icons.ts, hub/drafts/icons-2026-10-23.md).
 *   GET ?f=<묶음>.<아이콘> → WebP(모두에게 공개, 오래 캐시 — 내리면 CDN에서 한 시간 안에 사라짐)
 *   POST { action }
 *     list { sort: new|popular, offset }   공개 묶음
 *     pack { id }                          묶음 하나
 *     mine                                 내가 만든 묶음 + 받아 둔 묶음(보낼 때 고르기)
 *     by { owner }                         그 사람이 만든 공개 묶음
 *     create { name, license, agree }      새 묶음(라이선스 CC BY 4.0·CC0, 동의 필수, 가입 7일 뒤)
 *     rename { id, name }
 *     upload { id, dataUrl, phrase? }      아이콘 하나(서버가 256px WebP로 줄이고 프레임 검사, 올리자마자 공개)
 *     removeIcon { id, iconId } · deletePack { id }
 *     collect { id, on }                   받아 두기·빼기
 *     report { id, reason }                신고(저작권 포함) → 운영자 신고함
 */
export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request);
}

const bad = (request: NextRequest, error: string, status = 400) => jsonWithCors(request, { error }, { status });
const STATUS: Record<PackError, number> = { LIMIT: 429, NOT_FOUND: 404, FORBIDDEN: 403, FULL: 409, HIDDEN: 410 };

/** 검사(OpenAI moderation, 이미지·무료). 프레임 하나라도 걸리거나 물어보지 못하면 거절. */
async function framesAllowed(frames: string[]): Promise<boolean> {
  const client = getOpenAIClient();
  if (!client) return false;
  try {
    for (const frame of frames) {
      const result = await client.moderations.create({ model: "omni-moderation-latest", input: [{ type: "image_url", image_url: { url: frame } }] });
      if (result.results.some((row) => row.flagged)) return false;
    }
    return true;
  } catch (error) {
    console.error("[icons] moderation failed", error);
    return false;
  }
}

async function withNames(packs: IconPack[], me: string | null): Promise<IconPack[]> {
  const decorated = await decorate(packs, me);
  const owners = [...new Set(decorated.map((pack) => pack.owner))];
  const accounts = await readAccounts(owners);
  const names = new Map(owners.map((id, index) => [id, accounts.at(index)?.profile.nickname || accounts.at(index)?.username || ""]));
  return decorated.map((pack) => ({ ...pack, ownerName: names.get(pack.owner) ?? "" }));
}

function parseUpload(value: unknown): Uint8Array | null {
  if (typeof value !== "string" || value.length > ICON_UPLOAD_MAX_BYTES * 1.4 + 100) return null;
  const match = /^data:image\/(?:png|jpeg|webp|gif);base64,([A-Za-z0-9+/=]+)$/.exec(value);
  return match ? new Uint8Array(Buffer.from(match[1], "base64")) : null;
}

export async function GET(request: NextRequest) {
  const file = request.nextUrl.searchParams.get("f") ?? "";
  const [packId, iconId] = file.split(".");
  if (!isPackId(packId) || !isIconId(iconId)) return bad(request, "BAD_ID");
  const stream = await openIcon(packId, iconId).catch(() => null);
  if (!stream) return bad(request, "NOT_FOUND", 404);
  return new Response(stream, {
    headers: {
      ...corsHeaders(request),
      "content-type": "image/webp",
      // 공개 그림: 폰은 하루, CDN은 한 시간(운영자가 내리면 한 시간 안에 사라지게).
      "cache-control": "public, max-age=86400, s-maxage=3600",
    },
  });
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return bad(request, "Invalid JSON");
  }
  const me = requestAuth(request)?.accountId ?? null;
  const action = body.action;

  if (action === "list") {
    const sort = body.sort === "popular" ? "popular" : "new";
    const offset = typeof body.offset === "number" && Number.isFinite(body.offset) ? body.offset : 0;
    const packs = await listPacks({ sort, offset });
    return jsonWithCors(request, { packs: await withNames(packs, me), next: offset + packs.length });
  }
  if (action === "pack") {
    if (!isPackId(body.id)) return bad(request, "BAD_ID");
    const pack = await readPack(body.id);
    if (!pack || (pack.hidden && pack.owner !== me)) return bad(request, "NOT_FOUND", 404);
    const [decorated] = await withNames([pack], me);
    return jsonWithCors(request, { pack: decorated });
  }
  if (action === "by") {
    if (!isAccountId(body.owner)) return bad(request, "BAD_TARGET");
    const packs = (await listPacksBy(body.owner)).filter((pack) => (!pack.hidden && pack.icons.length > 0) || pack.owner === me);
    return jsonWithCors(request, { packs: await withNames(packs, me) });
  }

  if (!me) return bad(request, "SIGNED_OUT", 401);

  if (action === "mine") {
    const [packs, own] = await Promise.all([myPacks(me), listPacksBy(me)]);
    // 아직 아이콘이 없는 내 묶음도 만들기 화면에 보이게 따로.
    return jsonWithCors(request, { packs: await withNames(packs, me), own: await withNames(own, me) });
  }

  if (typeof action === "string" && ["create", "rename", "upload", "collect", "report"].includes(action)) {
    const stop = await suspendedResponse(request, me);
    if (stop) return stop;
  }

  if (action === "create" || action === "upload") {
    const account = await readAccount(me);
    if (!account) return bad(request, "SIGNED_OUT", 401);
    if (Date.now() - Date.parse(account.createdAt) < ICON_MIN_ACCOUNT_AGE_MS) return bad(request, "TOO_NEW", 403);
  }

  if (action === "create") {
    const name = cleanShortText(body.name, PACK_NAME_MAX);
    if (!name) return bad(request, "NO_NAME");
    if (!isIconLicense(body.license)) return bad(request, "BAD_LICENSE");
    // 라이선스 동의 없이 만들지 않는다(화면의 동의 체크).
    if (body.agree !== true) return bad(request, "NOT_AGREED");
    const result = await createPack({ owner: me, name, license: body.license });
    return "error" in result ? bad(request, result.error, STATUS[result.error]) : jsonWithCors(request, { pack: result.ok });
  }

  if (!isPackId(body.id)) return bad(request, "BAD_ID");
  const id = body.id;

  if (action === "rename") {
    const name = cleanShortText(body.name, PACK_NAME_MAX);
    if (!name) return bad(request, "NO_NAME");
    const result = await renamePack(me, id, name);
    return "error" in result ? bad(request, result.error, STATUS[result.error]) : jsonWithCors(request, { pack: result.ok });
  }
  if (action === "upload") {
    const bytes = parseUpload(body.dataUrl);
    if (!bytes) return bad(request, "BAD_TYPE");
    const pack = await readPack(id);
    if (!pack) return bad(request, "NOT_FOUND", 404);
    if (pack.owner !== me) return bad(request, "FORBIDDEN", 403);
    const prepared = await prepareIcon(bytes);
    if (!prepared.ok) return bad(request, prepared.error, 413);
    void meterRequest(request, "iconUpload");
    if (!(await framesAllowed(prepared.icon.frames))) return bad(request, "REJECTED", 422);
    const { webp, w, h, animated } = prepared.icon;
    const result = await addIcon({ me, packId: id, webp, w, h, animated, phrase: cleanPhrase(body.phrase) });
    return "error" in result ? bad(request, result.error, STATUS[result.error]) : jsonWithCors(request, { pack: result.ok });
  }
  if (action === "removeIcon") {
    if (!isIconId(body.iconId)) return bad(request, "BAD_ID");
    const result = await removeIcon(me, id, body.iconId);
    return "error" in result ? bad(request, result.error, STATUS[result.error]) : jsonWithCors(request, { pack: result.ok });
  }
  if (action === "deletePack") {
    const result = await deletePack(me, id);
    return "error" in result ? bad(request, result.error, STATUS[result.error]) : jsonWithCors(request, { ok: true });
  }
  if (action === "collect") {
    const result = await setCollected(me, id, body.on !== false);
    return "error" in result ? bad(request, result.error, STATUS[result.error]) : jsonWithCors(request, { collection: result.ok });
  }
  if (action === "report") {
    const pack = await readPack(id);
    if (!pack) return bad(request, "NOT_FOUND", 404);
    if (pack.owner === me) return bad(request, "SELF");
    const reason = cleanText(body.reason, 300);
    if (!reason) return bad(request, "NO_REASON");
    // 운영자 신고함에 그 사람 신고로(줄에 묶음 id — /ops에서 "아이콘 묶음 내리기").
    await addReport({
      at: new Date().toISOString(),
      reporter: me,
      target: pack.owner,
      reason: `[아이콘] ${reason}`,
      roomId: null,
      lines: [`icon-pack:${pack.id}`, pack.name],
    });
    return jsonWithCors(request, { ok: true });
  }
  return bad(request, "UNKNOWN_ACTION");
}
