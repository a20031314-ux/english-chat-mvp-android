import { NextRequest } from "next/server";
import { recommendedChannelSeeds } from "@/lib/contentDiscovery/recommendedChannels";
import { youtubeChannelUrl } from "@/lib/contentDiscovery/savedChannels";
import {
  resolveRecommendedChannels,
  searchYoutubeChannels,
} from "@/lib/contentDiscovery/search/resolveYoutubeChannel";
import { coerceLanguageCode } from "@/lib/learningLanguages";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";

export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request);
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim() || "";
  const suggested =
    request.nextUrl.searchParams.get("suggested") === "1" ||
    request.nextUrl.searchParams.get("suggested") === "true";
  const language = coerceLanguageCode(
    request.nextUrl.searchParams.get("language"),
  );
  if (!process.env.YOUTUBE_API_KEY?.trim()) {
    return jsonWithCors(request, {
      language,
      channels: [],
      warning: "YOUTUBE_UNAVAILABLE",
    });
  }
  if (suggested && !query) {
    const resolved = await resolveRecommendedChannels(
      recommendedChannelSeeds(language),
    );
    return jsonWithCors(request, {
      language,
      channels: resolved.map((row) => ({
        channelId: row.channelId,
        name: row.name,
        url: youtubeChannelUrl(row.channelId),
        thumbnailUrl: row.thumbnailUrl || null,
      })),
    });
  }
  if (!query) {
    return jsonWithCors(request, { language, channels: [] });
  }
  const channels = await searchYoutubeChannels(query, language);
  return jsonWithCors(request, { language, channels });
}
