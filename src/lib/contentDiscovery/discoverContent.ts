import { getOpenAIClient } from "@/lib/server/openai";
import {
  discoveryCacheGet,
  discoveryCacheKey,
  discoveryCacheSet,
} from "@/lib/contentDiscovery/cache";
import { filterCandidates } from "@/lib/contentDiscovery/filterCandidates";
import {
  contentSearchIntentFromRequest,
  parseSearchIntent,
} from "@/lib/contentDiscovery/parseSearchIntent";
import { rankCandidates } from "@/lib/contentDiscovery/rankCandidates";
import { searchGoogleNewsRss } from "@/lib/contentDiscovery/providers/googleNewsRssProvider";
import { searchWikipedia } from "@/lib/contentDiscovery/providers/wikipediaProvider";
import { searchYouTubeVideos } from "@/lib/contentDiscovery/providers/youtubeProvider";
import { discoverVideosFromSearch } from "@/lib/contentDiscovery/search/discoverVideos";
import { contentDiscoveryProviderMode } from "@/lib/contentDiscovery/search/resolveProvider";
import { translateYoutubeQuery } from "@/lib/contentDiscovery/search/translateQuery";
import { discoverVideosByChannel } from "@/lib/contentDiscovery/search/discoverChannelVideos";
import { discoverVideosByTypedQuery } from "@/lib/contentDiscovery/search/typedYoutubeSearch";
import { isYoutubeChannelId } from "@/lib/contentDiscovery/savedChannels";
import type {
  ContentCandidate,
  ContentDiscoveryRequest,
  ContentDiscoveryResult,
} from "@/lib/contentDiscovery/types";

/**
 * Discover learning content via Search Providers (and reading APIs).
 * Does not download media or scrape HTML search pages.
 * Video learning (STT / transcript / analysis) starts only after the user picks a URL.
 */
export async function discoverContent(
  request: ContentDiscoveryRequest,
): Promise<ContentDiscoveryResult> {
  const youtubeChannelId = (
    request.youtubeChannelId ||
    request.recommendedChannelId ||
    ""
  ).trim();
  if (request.contentType === "video" && youtubeChannelId) {
    const cacheKey = discoveryCacheKey({
      kind: "yt-channel-uploads",
      v: 2,
      targetLanguage: request.targetLanguage,
      youtubeChannelId,
      pageToken: request.pageToken || "",
    });
    const cached = discoveryCacheGet<ContentDiscoveryResult>(cacheKey);
    if (cached) return cached;

    if (!isYoutubeChannelId(youtubeChannelId)) {
      const intent = contentSearchIntentFromRequest({
        targetLanguage: request.targetLanguage,
        contentType: "video",
        topic: youtubeChannelId,
        preferredDuration: "any",
      });
      const result: ContentDiscoveryResult = {
        intent,
        candidates: [],
        warnings: ["SEARCH_FAILED"],
      };
      discoveryCacheSet(cacheKey, result);
      return result;
    }
    const intent = contentSearchIntentFromRequest({
      targetLanguage: request.targetLanguage,
      contentType: "video",
      topic: youtubeChannelId,
      preferredDuration: "any",
      interfaceLanguage: request.interfaceLanguage,
    });
    const discovered = await discoverVideosByChannel(
      intent,
      { channelId: youtubeChannelId },
      request.pageToken,
    );
    const result: ContentDiscoveryResult = {
      intent,
      candidates: discovered.candidates,
      warnings: discovered.warnings,
      searchQuery: youtubeChannelId,
      ...(discovered.nextPageToken
        ? { nextPageToken: discovered.nextPageToken }
        : {}),
    };
    discoveryCacheSet(cacheKey, result);
    return result;
  }

  const cacheKey = discoveryCacheKey({
    targetLanguage: request.targetLanguage,
    topic: request.topic || "",
    topicCategory: request.topicCategory || "",
    contentType: request.contentType,
    preferredDuration: request.preferredDuration || "any",
    learnerLevel: request.learnerLevel || "",
    naturalQuery: request.naturalQuery || "",
    requireOriginalCaptions: Boolean(request.requireOriginalCaptions),
    discoveryProvider: contentDiscoveryProviderMode(),
    pageToken: request.pageToken || "",
  });
  const cached = discoveryCacheGet<ContentDiscoveryResult>(cacheKey);
  if (cached) return cached;

  const client = getOpenAIClient();

  const typedQuery = request.naturalQuery?.trim() || "";
  const useTypedYoutubeSearch =
    request.contentType === "video" && Boolean(typedQuery);

  if (useTypedYoutubeSearch) {
    const base = contentSearchIntentFromRequest({
      ...request,
      topicCategory: undefined,
      topic: typedQuery,
    });
    const youtubeQuery = request.pageToken
      ? typedQuery
      : await translateYoutubeQuery(client, typedQuery, base.language);
    const intent = {
      ...base,
      topic: youtubeQuery,
      keywords: [youtubeQuery],
      naturalQuery: youtubeQuery,
    };
    let raw: ContentCandidate[] = [];
    const warnings: string[] = [];
    let nextPageToken: string | undefined;
    if (intent.requireOriginalCaptions) {
      const youtube = await searchYouTubeVideos(intent);
      raw = youtube.candidates;
      if (youtube.warning) warnings.push(youtube.warning);
    } else {
      const typed = await discoverVideosByTypedQuery(
        intent,
        youtubeQuery,
        request.pageToken,
      );
      raw = typed.candidates;
      warnings.push(...typed.warnings);
      nextPageToken = typed.nextPageToken;
    }
    const result: ContentDiscoveryResult = {
      intent,
      candidates: filterCandidates(raw, intent),
      warnings,
      searchQuery: youtubeQuery,
      ...(nextPageToken ? { nextPageToken } : {}),
    };
    discoveryCacheSet(cacheKey, result);
    return result;
  }

  const intent = await parseSearchIntent(client, request);
  const warnings: string[] = [];
  let raw: ContentCandidate[] = [];

  if (intent.contentType === "video") {
    const useLegacyYoutube =
      contentDiscoveryProviderMode() === "youtube" ||
      Boolean(intent.requireOriginalCaptions);
    if (useLegacyYoutube) {
      const youtube = await searchYouTubeVideos(intent);
      raw = youtube.candidates;
      if (youtube.warning) warnings.push(youtube.warning);
    } else {
      const discovered = await discoverVideosFromSearch(intent);
      raw = discovered.candidates;
      warnings.push(...discovered.warnings);
    }
  } else {
    const [news, wiki] = await Promise.all([
      searchGoogleNewsRss(intent),
      searchWikipedia(intent),
    ]);
    raw = [...wiki.candidates, ...news.candidates];
    if (wiki.warning) warnings.push(wiki.warning);
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
