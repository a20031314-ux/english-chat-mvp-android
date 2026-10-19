import { NextRequest } from "next/server";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { GUIDE_EN, GUIDE_KO, GUIDE_VERSION, guideChapters, type Guide } from "@/lib/guide/content";
import translations from "@/lib/guide/translations.json";
import beforeMy from "@/lib/guide/before-my.json";
import videoBefore267 from "@/lib/guide/videoBefore267.json";
import roleplayBefore267 from "@/lib/guide/roleplayBefore267.json";
import roomsBefore269 from "@/lib/guide/roomsBefore269.json";
import mapBefore269 from "@/lib/guide/mapBefore269.json";

export const runtime = "nodejs";

/**
 * How to use each tab, in the language the app is read in.
 *
 * The app draws whatever this returns (GuideSheet.tsx), so the guide changes
 * with a push and not a release — the reason it lives here at all. A language
 * without a translation is answered in English, never left blank.
 */
export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request);
}

export async function GET(request: NextRequest) {
  const asked = request.nextUrl.searchParams.get("lang")?.trim().toLowerCase() ?? "";
  const translated = (translations as Partial<Record<string, Guide>>)[asked];
  const current = asked === "ko" ? GUIDE_KO : asked === "en" ? GUIDE_EN : (translated ?? GUIDE_EN);
  const language = asked === "ko" || asked === "en" || translated ? asked : "en";
  // 2.68 이하는 탭이 "사람·말하는 방"이고 단체방·자유 대화·참여 방식이 없다: `rooms=269`를
  // 보내지 않으면 그 빌드가 보던 말하는 방 안내(스냅숏)를 준다.
  const oldRooms =
    request.nextUrl.searchParams.get("rooms") !== "269" ? (roomsBefore269 as Partial<Record<string, Guide["rooms"]>>)[language] : undefined;
  // 노트(My 안)도 2.69부터: 그 전 빌드에는 노트 단계가 없는 My 안내(스냅숏).
  const oldMap =
    request.nextUrl.searchParams.get("rooms") !== "269" ? (mapBefore269 as Partial<Record<string, Guide["map"]>>)[language] : undefined;
  const tabs = { ...current, ...(oldRooms ? { rooms: oldRooms } : {}), ...(oldMap ? { map: oldMap } : {}) };
  // Builds before 2.67 still have the map screen, not My, and translate every
  // video line under its subtitle instead of behind the sentence bar: they
  // ask without `my=1` and get the map, chat and video pages they can see.
  if (request.nextUrl.searchParams.get("my") !== "1") {
    const old = (beforeMy as Partial<Record<string, Pick<Guide, "map" | "chat">>>)[language];
    const video = (videoBefore267 as Partial<Record<string, Guide["video"]>>)[language];
    // Nor do they have today's pack, the plans or the pictures of either.
    const roleplay = (roleplayBefore267 as Partial<Record<string, Guide["roleplay"]>>)[language];
    if (old || video || roleplay) {
      return jsonWithCors(request, {
        version: GUIDE_VERSION,
        language,
        tabs: { ...tabs, ...(old ?? {}), ...(video ? { video } : {}), ...(roleplay ? { roleplay } : {}) },
      });
    }
  }
  // `chapters=1`(하단 탭 대화·영상·사람·Room·My 빌드부터, 2026-10-20): 같은 글을 기능별 묶음으로도.
  // 옛 빌드는 묻지 않으니 `tabs`만 받는다.
  const chapters = request.nextUrl.searchParams.get("chapters") === "1" ? guideChapters(current) : undefined;
  return jsonWithCors(request, { version: GUIDE_VERSION, language, tabs, ...(chapters ? { chapters } : {}) });
}
