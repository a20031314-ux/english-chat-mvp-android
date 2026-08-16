import { filterCandidates } from "@/lib/contentDiscovery/filterCandidates";
import { readCatalog, writeCatalog } from "@/lib/contentDiscovery/search/catalog";
import { logVideoDiscovery } from "@/lib/contentDiscovery/search/debug";
import {
  dedupeVideoCandidates,
  mvpLearningScore,
  normalizeSearchResult,
} from "@/lib/contentDiscovery/search/normalize";
import {
  hydrateYoutubeMetadata,
} from "@/lib/contentDiscovery/search/providers/youtubeSearchProvider";
import {
  buildVideoSearchQueries,
  withVideoSiteHint,
} from "@/lib/contentDiscovery/search/queryBuilder";
import {
  resolveSearchProvider,
  searchProviderUsesWebEngine,
} from "@/lib/contentDiscovery/search/resolveProvider";
import { videoCandidateToContentCandidate } from "@/lib/contentDiscovery/search/toContentCandidate";
import type {
  VideoCandidate,
  VideoSearchResult,
} from "@/lib/contentDiscovery/search/types";
import type {
  ContentCandidate,
  ContentSearchIntent,
} from "@/lib/contentDiscovery/types";

function warningFromError(error: unknown): string {
  const message = error instanceof Error ? error.message : "";
  if (message === "YOUTUBE_QUOTA" || message === "SEARCH_QUOTA") {
    return message === "SEARCH_QUOTA" ? "YOUTUBE_QUOTA" : message;
  }
  if (message === "YOUTUBE_FAILED") return "YOUTUBE_FAILED";
  return "SEARCH_FAILED";
}

async function hydrateCandidates(
  candidates: VideoCandidate[],
): Promise<VideoCandidate[]> {
  const meta = await hydrateYoutubeMetadata(candidates.map((row) => row.id));
  if (meta.size === 0) return candidates;
  return candidates.map((row) => {
    const extra = meta.get(row.id);
    if (!extra) return row;
    return {
      ...row,
      ...(extra.duration && !row.duration ? { duration: extra.duration } : {}),
      ...(extra.language && !row.language ? { language: extra.language } : {}),
      ...(extra.thumbnailUrl && !row.thumbnailUrl
        ? { thumbnailUrl: extra.thumbnailUrl }
        : {}),
      ...(extra.creator && !row.creator ? { creator: extra.creator } : {}),
    };
  });
}

/**
 * Future free-text box: searchVideos({ query, language }) → same pipeline.
 */
export async function searchVideos(input: {
  query: string;
  language?: string;
  category?: string;
  maxResults?: number;
}): Promise<VideoCandidate[]> {
  const provider = resolveSearchProvider();
  if (!provider) return [];
  const hits = await provider.searchVideos({
    query: withVideoSiteHint(input.query, searchProviderUsesWebEngine(provider)),
    language: input.language,
    category: input.category,
    maxResults: input.maxResults,
  });
  const normalized = hits
    .map((hit) =>
      normalizeSearchResult(
        { ...hit, searchQuery: input.query },
        { category: input.category },
      ),
    )
    .filter((row): row is VideoCandidate => Boolean(row));
  return dedupeVideoCandidates(normalized);
}

export async function discoverVideosFromSearch(
  intent: ContentSearchIntent,
): Promise<{ candidates: ContentCandidate[]; warnings: string[] }> {
  const catalogParts = {
    language: intent.language,
    category: intent.topicCategory,
    naturalQuery: intent.naturalQuery,
  };
  const cachedCatalog = readCatalog(catalogParts);
  const provider = resolveSearchProvider();
  if (!provider) {
    if (cachedCatalog.length > 0) {
      return {
        candidates: cachedCatalog.map(videoCandidateToContentCandidate),
        warnings: ["SEARCH_UNAVAILABLE"],
      };
    }
    return { candidates: [], warnings: ["YOUTUBE_UNAVAILABLE"] };
  }

  const queries = buildVideoSearchQueries(intent);
  const useWeb = searchProviderUsesWebEngine(provider);
  const warnings: string[] = [];
  const raw: VideoSearchResult[] = [];

  const searches = await Promise.all(
    queries.map(async (query) => {
      try {
        return await provider.searchVideos({
          query: withVideoSiteHint(query, useWeb),
          language: intent.language,
          category: intent.topicCategory,
          maxResults: 15,
        });
      } catch (error) {
        warnings.push(warningFromError(error));
        return [] as VideoSearchResult[];
      }
    }),
  );
  for (const hits of searches) raw.push(...hits);

  const normalized = raw
    .map((hit) =>
      normalizeSearchResult(hit, {
        category: intent.topicCategory,
      }),
    )
    .filter((row): row is VideoCandidate => Boolean(row));
  const supported = normalized.filter((row) => row.source && row.url);
  const deduped = dedupeVideoCandidates(supported);
  const hydrated = await hydrateCandidates(deduped);
  const scored = hydrated.map((row) => ({
    ...row,
    learningScore: mvpLearningScore(row, intent.topic),
    topics: row.topics || [intent.topic],
  }));

  if (scored.length > 0) {
    writeCatalog(catalogParts, scored);
  }

  const catalog = scored.length > 0 ? scored : cachedCatalog;
  const asContent = catalog.map(videoCandidateToContentCandidate);
  const filtered = filterCandidates(asContent, intent);

  logVideoDiscovery(
    {
      category: intent.topicCategory,
      generatedQueries: queries,
      rawSearchResults: raw.length,
      afterDeduplication: deduped.length,
      supportedVideos: supported.length,
      afterFiltering: filtered.length,
      catalogResults: catalog.length,
      provider: provider.id,
    },
    scored,
  );

  if (filtered.length === 0 && cachedCatalog.length > 0) {
    return {
      candidates: filterCandidates(
        cachedCatalog.map(videoCandidateToContentCandidate),
        intent,
      ),
      warnings: warnings.length ? warnings : ["SEARCH_FAILED"],
    };
  }

  return { candidates: filtered, warnings: [...new Set(warnings)] };
}
