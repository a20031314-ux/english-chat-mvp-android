export type VideoSearchQuery = {
  query: string;
  language?: string;
  category?: string;
  maxResults?: number;
  pageToken?: string;
};

export type VideoSearchPage = {
  results: VideoSearchResult[];
  nextPageToken?: string;
};

export type VideoSearchResult = {
  title: string;
  url: string;
  snippet?: string;
  source?: string;
  thumbnailUrl?: string;
  creator?: string;
  publishedAt?: string;
  searchQuery?: string;
};

export interface SearchProvider {
  readonly id: string;
  searchVideos(query: VideoSearchQuery): Promise<VideoSearchResult[]>;
}

export type VideoCandidate = {
  id: string;
  title: string;
  description?: string;
  url: string;
  source: string;
  thumbnailUrl?: string;
  creator?: string;
  duration?: number;
  publishedAt?: string;
  language?: string;
  category?: string;
  topics?: string[];
  estimatedLevel?: string;
  learningScore?: number;
  searchQuery?: string;
  contentType?: string;
};

export type CatalogVideo = VideoCandidate & {
  discoveredAt: string;
  lastValidatedAt?: string;
  status: "active" | "unavailable" | "unsupported";
};

export type VideoDiscoveryDebug = {
  category?: string;
  generatedQueries: string[];
  rawSearchResults: number;
  afterDeduplication: number;
  supportedVideos: number;
  afterFiltering: number;
  catalogResults: number;
  provider: string;
};
