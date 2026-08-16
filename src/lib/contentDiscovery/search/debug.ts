import type { VideoCandidate, VideoDiscoveryDebug } from "@/lib/contentDiscovery/search/types";

export function logVideoDiscovery(
  debug: VideoDiscoveryDebug,
  samples: VideoCandidate[],
): void {
  if (process.env.NODE_ENV === "production") return;
  console.info("[content-discovery/search]", {
    CATEGORY: debug.category || "(none)",
    PROVIDER: debug.provider,
    GENERATED_QUERIES: debug.generatedQueries,
    RAW_SEARCH_RESULTS: debug.rawSearchResults,
    AFTER_DEDUPLICATION: debug.afterDeduplication,
    SUPPORTED_VIDEOS: debug.supportedVideos,
    AFTER_FILTERING: debug.afterFiltering,
    CATALOG_RESULTS: debug.catalogResults,
  });
  for (const video of samples.slice(0, 5)) {
    console.info("[content-discovery/search/item]", {
      source: video.source,
      searchQuery: video.searchQuery,
      title: video.title,
      url: video.url,
      category: video.category,
      topics: video.topics,
      estimatedLevel: video.estimatedLevel,
      learningScore: video.learningScore,
    });
  }
}
