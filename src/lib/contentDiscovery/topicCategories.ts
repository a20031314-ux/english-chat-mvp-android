/**
 * Discovery topic categories — together they cover the full video/reading
 * search surface (YouTube + News RSS + Wikipedia). Public topic labels
 * stay English internally; actual search queries are in the learning language.
 */

export const DISCOVERY_TOPIC_IDS = [
  "any",
  "daily",
  "travel",
  "food",
  "work",
  "news",
  "school",
  "entertainment",
  "sports",
  "tech",
  "culture",
  "health",
  "music",
  "family",
  "interview",
  "vlog",
  "shopping",
  "finance",
  "nature",
  "hobbies",
] as const;

export type DiscoveryTopicId = (typeof DISCOVERY_TOPIC_IDS)[number];

export type DiscoveryTopicCategory = {
  id: DiscoveryTopicId;
  /** English topic phrase used in search intent */
  topic: string;
  /** Extra keywords for YouTube / News query coverage */
  keywords: string[];
};

export const DISCOVERY_TOPIC_CATEGORIES: readonly DiscoveryTopicCategory[] = [
  {
    id: "any",
    topic: "general authentic content",
    keywords: ["conversation", "spoken", "everyday", "natural speech"],
  },
  {
    id: "daily",
    topic: "everyday conversation",
    keywords: ["daily life", "casual chat", "dialogue", "small talk"],
  },
  {
    id: "travel",
    topic: "travel",
    keywords: ["trip", "airport", "hotel", "sightseeing", "travel vlog"],
  },
  {
    id: "food",
    topic: "food and cooking",
    keywords: ["restaurant", "recipe", "cooking", "cafe", "street food"],
  },
  {
    id: "work",
    topic: "work and business",
    keywords: ["office", "meeting", "career", "interview job", "workplace"],
  },
  {
    id: "news",
    topic: "news and current events",
    keywords: ["news", "headline", "politics", "society", "report"],
  },
  {
    id: "school",
    topic: "school and study",
    keywords: ["university", "classroom", "exam", "study tips", "lecture"],
  },
  {
    id: "entertainment",
    topic: "movies drama entertainment",
    keywords: ["drama", "movie", "variety show", "TV", "clip"],
  },
  {
    id: "sports",
    topic: "sports",
    keywords: ["football", "match", "athlete", "workout", "game highlights"],
  },
  {
    id: "tech",
    topic: "technology and science",
    keywords: ["tech", "AI", "gadgets", "science", "programming"],
  },
  {
    id: "culture",
    topic: "culture and society",
    keywords: ["tradition", "festival", "customs", "city life", "history culture"],
  },
  {
    id: "health",
    topic: "health and lifestyle",
    keywords: ["health", "fitness", "wellness", "doctor", "lifestyle"],
  },
  {
    id: "music",
    topic: "music",
    keywords: ["song", "concert", "musician", "lyrics", "live performance"],
  },
  {
    id: "family",
    topic: "family and parenting",
    keywords: ["family", "kids", "parents", "home", "parenting"],
  },
  {
    id: "interview",
    topic: "interview and talk",
    keywords: ["interview", "podcast", "talk show", "Q&A", "conversation"],
  },
  {
    id: "vlog",
    topic: "vlog",
    keywords: ["vlog", "day in my life", "daily vlog", "real life"],
  },
  {
    id: "shopping",
    topic: "shopping and fashion",
    keywords: ["shopping", "fashion", "outfit", "store", "haul"],
  },
  {
    id: "finance",
    topic: "money and economy",
    keywords: ["finance", "economy", "investing", "business news", "money"],
  },
  {
    id: "nature",
    topic: "nature and animals",
    keywords: ["nature", "animals", "outdoor", "wildlife", "environment"],
  },
  {
    id: "hobbies",
    topic: "hobbies and games",
    keywords: ["hobby", "gaming", "crafts", "leisure", "how to"],
  },
] as const;

const BY_ID = Object.fromEntries(
  DISCOVERY_TOPIC_CATEGORIES.map((category) => [category.id, category]),
) as Record<DiscoveryTopicId, DiscoveryTopicCategory>;

export function isDiscoveryTopicId(value: unknown): value is DiscoveryTopicId {
  return (
    typeof value === "string" &&
    Object.prototype.hasOwnProperty.call(BY_ID, value)
  );
}

export function getDiscoveryTopicCategory(
  id: DiscoveryTopicId | string | null | undefined,
): DiscoveryTopicCategory {
  if (isDiscoveryTopicId(id)) return BY_ID[id];
  return BY_ID.any;
}

/** Copy key for a category label, e.g. discoverTopicDaily */
export function discoveryTopicLabelKey(id: DiscoveryTopicId): string {
  return `discoverTopic${id.charAt(0).toUpperCase()}${id.slice(1)}`;
}
