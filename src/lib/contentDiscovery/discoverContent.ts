import OpenAI from "openai";
import {
  discoveryCacheGet,
  discoveryCacheKey,
  discoveryCacheSet,
} from "@/lib/contentDiscovery/cache";
import { filterCandidates } from "@/lib/contentDiscovery/filterCandidates";
import { parseSearchIntent } from "@/lib/contentDiscovery/parseSearchIntent";
import { rankCandidates } from "@/lib/contentDiscovery/rankCandidates";
import { searchGoogleNewsRss } from "@/lib/contentDiscovery/providers/googleNewsRssProvider";
import { searchYouTubeVideos } from "@/lib/contentDiscovery/providers/youtubeProvider";
import type {
  ContentCandidate,
  ContentDiscoveryRequest,
  ContentDiscoveryResult,
} from "@/lib/contentDiscovery/types";

function getOpenAI(): OpenAI | null {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  return new OpenAI({ apiKey });
}

/**
 * Discover learning content via official/public providers.
 * Does not download media or scrape HTML search pages.
 */
export async function discoverContent(
  request: ContentDiscoveryRequest,
): Promise<ContentDiscoveryResult> {
  const cacheKey = discoveryCacheKey({
    targetLanguage: request.targetLanguage,
    topic: request.topic || "",
    topicCategory: request.topicCategory || "",
    contentType: request.contentType,
    preferredDuration: request.preferredDuration || "any",
    learnerLevel: request.learnerLevel || "",
    naturalQuery: request.naturalQuery || "",
    requireOriginalCaptions: Boolean(request.requireOriginalCaptions),
  });
  const cached = discoveryCacheGet<ContentDiscoveryResult>(cacheKey);
  if (cached) return cached;

  const client = getOpenAI();
  const intent = await parseSearchIntent(client, request);
  const warnings: string[] = [];
  let raw: ContentCandidate[] = [];

  if (intent.contentType === "video") {
    const youtube = await searchYouTubeVideos(intent);
    raw = youtube.candidates;
    if (youtube.warning) warnings.push(youtube.warning);
  } else {
    const news = await searchGoogleNewsRss(intent);
    raw = news.candidates;
    if (news.warning) warnings.push(news.warning);
  }

  const filtered = filterCandidates(raw, intent);
  const ranked = await rankCandidates(
    client,
    intent,
    filtered,
    request.interfaceLanguage || "ko",
  );

  const result: ContentDiscoveryResult = {
    intent,
    candidates: ranked,
    warnings,
  };
  discoveryCacheSet(cacheKey, result);
  return result;
}
