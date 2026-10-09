import { NextRequest } from "next/server";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { recentVideoTranscripts } from "@/lib/server/videoTranscriptStore";
import {
  DEFAULT_LEARNING_LANGUAGE_CODE,
  isLearningLanguageCode,
} from "@/lib/learningLanguages";
import { matchVideos } from "@/lib/videoIndex/match";

export const runtime = "nodejs";

/**
 * Which kept videos actually say these expressions, and when.
 *
 * `GET /api/video-index/find?language=en&q=end+up&q=stand+someone+up`
 *
 * Reads the words of videos already prepared by somebody
 * (lib/server/videoTranscriptStore) and ranks them by how much of what was
 * asked is said in them (lib/videoIndex/match). Each match carries the
 * seconds where it is said, so the app can open the video at that scene.
 *
 * Only the matching lines come back, a few per expression — enough to show the
 * scene, never the whole transcript. No model is called; this costs a few KV
 * reads.
 */
const MAX_EXPRESSIONS = 8;
const HITS_PER_EXPRESSION = 3;

export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request);
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const asked = params.get("language")?.trim() ?? "";
  const language = isLearningLanguageCode(asked) ? asked : DEFAULT_LEARNING_LANGUAGE_CODE;
  const expressions = params
    .getAll("q")
    .map((q) => q.replace(/\s+/g, " ").trim().slice(0, 60))
    .filter(Boolean)
    .slice(0, MAX_EXPRESSIONS);
  if (expressions.length === 0) {
    return jsonWithCors(request, { error: "q required" }, { status: 400 });
  }
  const limit = Math.min(20, Math.max(1, Number(params.get("limit")) || 10));

  const records = await recentVideoTranscripts(language);
  const matches = matchVideos(records, expressions, limit).map((match) => ({
    ...match,
    found: match.found.map((entry) => ({
      expression: entry.expression,
      count: entry.hits.length,
      hits: entry.hits.slice(0, HITS_PER_EXPRESSION).map((hit) => ({
        start: hit.start,
        end: hit.end,
        text: hit.text,
        matched: hit.matched,
      })),
    })),
  }));

  return jsonWithCors(request, {
    language,
    searched: records.length,
    matches,
  });
}
