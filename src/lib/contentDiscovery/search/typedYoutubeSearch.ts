import { filterCandidates } from "@/lib/contentDiscovery/filterCandidates";
import { logVideoDiscovery } from "@/lib/contentDiscovery/search/debug";
import {
  dedupeVideoCandidates,
  normalizeSearchResult,
} from "@/lib/contentDiscovery/search/normalize";
import {
  hydrateYoutubeMetadata,
  YoutubeSearchProvider,
} from "@/lib/contentDiscovery/search/providers/youtubeSearchProvider";
import { withVideoSiteHint } from "@/lib/contentDiscovery/search/queryBuilder";
import {
  resolveSearchProvider,
  searchProviderUsesWebEngine,
} from "@/lib/contentDiscovery/search/resolveProvider";
import { videoCandidateToContentCandidate } from "@/lib/contentDiscovery/search/toContentCandidate";
import type {
  VideoCandidate,
  VideoSearchPage,
  VideoSearchResult,
} from "@/lib/contentDiscovery/search/types";
import type {
  ContentCandidate,
  ContentSearchIntent,
} from "@/lib/contentDiscovery/types";

async function searchPage(
  youtubeQuery: string,
  intent: ContentSearchIntent,
  pageToken?: string,
): Promise<VideoSearchPage> {
  const youtube = new YoutubeSearchProvider();
  if (process.env.YOUTUBE_API_KEY?.trim()) {
    return youtube.searchVideoPage({
      query: youtubeQuery,
      language: intent.language,
      maxResults: 25,
      ...(pageToken ? { pageToken } : {}),
    });
  }
  const provider = resolveSearchProvider();
  if (!provider) {
    throw new Error("YOUTUBE_UNAVAILABLE");
  }
  const query = withVideoSiteHint(
    youtubeQuery,
    searchProviderUsesWebEngine(provider),
  );
  const results = await provider.searchVideos({
    query,
    language: intent.language,
    maxResults: 25,
  });
  return { results };
}

/**
 * One translated query → YouTube search page → learning-language videos.
 * Keeps search order. nextPageToken lets the client keep fetching in the background.
 */
export async function discoverVideosByTypedQuery(
  intent: ContentSearchIntent,
  youtubeQuery: string,
  pageToken?: string,
): Promise<{
  candidates: ContentCandidate[];
  warnings: string[];
  nextPageToken?: string;
}> {
  let page: VideoSearchPage;
  try {
    page = await searchPage(youtubeQuery, intent, pageToken);
  } catch (error) {
    const message = error instanceof Error ? error.message : "SEARCH_FAILED";
    return {
      candidates: [],
      warnings: [
        message === "YOUTUBE_UNAVAILABLE"
          ? "YOUTUBE_UNAVAILABLE"
          : message === "YOUTUBE_QUOTA"
            ? "YOUTUBE_QUOTA"
            : "SEARCH_FAILED",
      ],
    };
  }

  const rawHits: VideoSearchResult[] = page.results;
  const normalized = rawHits
    .map((hit) =>
      normalizeSearchResult({ ...hit, searchQuery: youtubeQuery }),
    )
    .filter((row): row is VideoCandidate => Boolean(row));
  const deduped = dedupeVideoCandidates(normalized);
  const meta = await hydrateYoutubeMetadata(deduped.map((row) => row.id));
  const hydrated = deduped.map((row) => {
    const extra = meta.get(row.id);
    if (!extra) return row;
    return {
      ...row,
      ...(extra.duration ? { duration: extra.duration } : {}),
      ...(extra.language ? { language: extra.language } : {}),
      ...(extra.thumbnailUrl && !row.thumbnailUrl
        ? { thumbnailUrl: extra.thumbnailUrl }
        : {}),
      ...(extra.creator && !row.creator ? { creator: extra.creator } : {}),
    };
  });

  const filtered = filterCandidates(
    hydrated.map(videoCandidateToContentCandidate),
    intent,
  );

  logVideoDiscovery(
    {
      category: pageToken ? "(typed-query-more)" : "(typed-query)",
      generatedQueries: [youtubeQuery],
      rawSearchResults: rawHits.length,
      afterDeduplication: deduped.length,
      supportedVideos: normalized.length,
      afterFiltering: filtered.length,
      catalogResults: filtered.length,
      provider: "youtube",
    },
    hydrated,
  );

  return {
    candidates: filtered,
    warnings: [],
    ...(page.nextPageToken ? { nextPageToken: page.nextPageToken } : {}),
  };
}
