import { NextRequest } from "next/server";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { GUIDE_EN, GUIDE_KO, GUIDE_VERSION, type Guide } from "@/lib/guide/content";
import translations from "@/lib/guide/translations.json";
import beforeMy from "@/lib/guide/before-my.json";
import videoBefore267 from "@/lib/guide/videoBefore267.json";

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
  const tabs = asked === "ko" ? GUIDE_KO : asked === "en" ? GUIDE_EN : (translated ?? GUIDE_EN);
  const language = asked === "ko" || asked === "en" || translated ? asked : "en";
  // Builds before 2.67 still have the map screen, not My, and translate every
  // video line under its subtitle instead of behind the sentence bar: they
  // ask without `my=1` and get the map, chat and video pages they can see.
  if (request.nextUrl.searchParams.get("my") !== "1") {
    const old = (beforeMy as Partial<Record<string, Pick<Guide, "map" | "chat">>>)[language];
    const video = (videoBefore267 as Partial<Record<string, Guide["video"]>>)[language];
    if (old || video) {
      return jsonWithCors(request, {
        version: GUIDE_VERSION,
        language,
        tabs: { ...tabs, ...(old ?? {}), ...(video ? { video } : {}) },
      });
    }
  }
  return jsonWithCors(request, { version: GUIDE_VERSION, language, tabs });
}
