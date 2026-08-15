import type { LearningLanguageCode } from "@/lib/learningLanguages";
import type { LearnerLevel } from "@/lib/languageAnalysisPrompt";
import type { DiscoveryTopicId } from "@/lib/contentDiscovery/topicCategories";

export type ContentDiscoveryType = "video" | "reading";

export type ContentCandidateKind = "video" | "article" | "community";

export type PreferredDurationBucket = "short" | "medium" | "long" | "any";

export type DurationRange = {
  minSeconds?: number;
  maxSeconds?: number;
};

export type ContentSearchIntent = {
  language: LearningLanguageCode;
  topic: string;
  contentType: ContentDiscoveryType;
  duration: DurationRange;
  durationBucket: PreferredDurationBucket;
  level?: LearnerLevel;
  keywords: string[];
  naturalQuery?: string;
  /** When true, only videos with official (non-auto) captions. */
  requireOriginalCaptions?: boolean;
  topicCategory?: DiscoveryTopicId;
};

export type ContentCandidate = {
  id: string;
  type: ContentCandidateKind;
  source: string;
  title: string;
  url: string;
  language?: string;
  description?: string;
  thumbnail?: string;
  durationSeconds?: number;
  estimatedReadingMinutes?: number;
  publishedAt?: string;
  authorOrChannel?: string;
  preview?: string;
  learningReason?: string;
  learningScore?: number;
  /** Provider-specific id (e.g. YouTube videoId) */
  externalId?: string;
  /** YouTube contentDetails.caption or timedtext probe */
  hasCaptions?: boolean;
  /** At least one non-ASR (uploader/official) caption track */
  hasOriginalCaptions?: boolean;
};

export type ContentDiscoveryRequest = {
  targetLanguage: LearningLanguageCode;
  topic?: string;
  topicCategory?: DiscoveryTopicId;
  contentType: ContentDiscoveryType;
  preferredDuration?: PreferredDurationBucket;
  learnerLevel?: LearnerLevel;
  naturalQuery?: string;
  interfaceLanguage?: string;
  requireOriginalCaptions?: boolean;
};

export type ContentDiscoveryResult = {
  intent: ContentSearchIntent;
  candidates: ContentCandidate[];
  warnings: string[];
};

export const DURATION_BUCKETS: Record<
  PreferredDurationBucket,
  DurationRange
> = {
  any: {},
  short: { minSeconds: 0, maxSeconds: 300 },
  medium: { minSeconds: 240, maxSeconds: 900 },
  long: { minSeconds: 600, maxSeconds: 2400 },
};
