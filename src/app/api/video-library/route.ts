import { NextRequest } from "next/server";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { FREE_CATALOG_TRIAL_COUNT } from "@/lib/billing/config";
import {
  currentLibraryPack,
  trialEligibleVideoIds,
} from "@/lib/videoLibrary/catalog";
import {
  DEFAULT_LEARNING_LANGUAGE_CODE,
  isLearningLanguageCode,
} from "@/lib/learningLanguages";

export const runtime = "nodejs";

/**
 * This month's clips, so a new month does not need a new APK.
 *
 * The catalog is a file in this repository and the app had its own copy of it,
 * which made the monthly pack the one piece of content that could only reach
 * anybody through Play. It shows as soon as it is wrong: there is one pack in
 * the catalog, August's, and every learner has been reading "this month's
 * library" over it ever since.
 *
 * So the app asks instead. The file stays where it is and stays the answer —
 * this only moves who reads it, from a build that was frozen at install time
 * to a deployment that updates on every push. Adding September is a commit
 * now, not a release.
 *
 * The gate that decides what a clip costs (videoPrep.ts) reads the same file
 * on the same deployment, so the list a learner sees and the list they are
 * charged against cannot drift apart. That was possible before, between an old
 * build and a newer server, and is not any more.
 */
export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request);
}

export async function GET(request: NextRequest) {
  const asked = request.nextUrl.searchParams.get("language")?.trim() ?? "";
  const language = isLearningLanguageCode(asked)
    ? asked
    : DEFAULT_LEARNING_LANGUAGE_CODE;
  const pack = currentLibraryPack(language);

  return jsonWithCors(request, {
    language,
    month: pack?.month ?? null,
    // Named by the server so the free tier cannot be decided by a build that
    // is looking at a different list than the one it is charged against.
    trialVideoIds: trialEligibleVideoIds(pack),
    trialLimit: FREE_CATALOG_TRIAL_COUNT,
    clips: (pack?.clips ?? []).map((clip) => ({
      videoId: clip.videoId,
      title: clip.title,
      durationSeconds: clip.durationSeconds,
    })),
  });
}
