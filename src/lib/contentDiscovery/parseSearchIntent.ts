import OpenAI from "openai";
import {
  LEARNER_LEVELS,
  asLearnerLevel,
  type LearnerLevel,
} from "@/lib/languageAnalysisPrompt";
import {
  coerceLanguageCode,
  learningLanguageName,
  type LearningLanguageCode,
} from "@/lib/learningLanguages";
import {
  getDiscoveryTopicCategory,
  isDiscoveryTopicId,
} from "@/lib/contentDiscovery/topicCategories";
import {
  DURATION_BUCKETS,
  type ContentDiscoveryRequest,
  type ContentDiscoveryType,
  type ContentSearchIntent,
  type PreferredDurationBucket,
} from "@/lib/contentDiscovery/types";

const MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

function asContentType(value: unknown): ContentDiscoveryType | null {
  return value === "video" || value === "reading" ? value : null;
}

function asDurationBucket(value: unknown): PreferredDurationBucket {
  if (
    value === "short" ||
    value === "medium" ||
    value === "long" ||
    value === "any"
  ) {
    return value;
  }
  return "any";
}

function defaultIntent(
  request: ContentDiscoveryRequest,
): ContentSearchIntent {
  const language = coerceLanguageCode(request.targetLanguage);
  const contentType = request.contentType;
  const durationBucket = asDurationBucket(request.preferredDuration);
  const category = isDiscoveryTopicId(request.topicCategory)
    ? getDiscoveryTopicCategory(request.topicCategory)
    : null;
  const topic =
    category?.topic ||
    (request.topic || request.naturalQuery || "")
      .replace(/\s+/g, " ")
      .trim() ||
    "everyday conversation";
  const level = asLearnerLevel(request.learnerLevel);
  const keywords = category
    ? [...category.keywords, learningLanguageName(language)]
    : [topic, learningLanguageName(language)];
  return {
    language,
    topic,
    contentType,
    durationBucket,
    duration: { ...DURATION_BUCKETS[durationBucket] },
    ...(level ? { level } : {}),
    keywords,
    ...(request.naturalQuery?.trim()
      ? { naturalQuery: request.naturalQuery.trim() }
      : {}),
    ...(request.requireOriginalCaptions
      ? { requireOriginalCaptions: true }
      : {}),
    ...(category ? { topicCategory: category.id } : {}),
  };
}

function normalizeIntent(
  raw: unknown,
  request: ContentDiscoveryRequest,
): ContentSearchIntent {
  const base = defaultIntent(request);
  if (!raw || typeof raw !== "object") return base;
  const o = raw as Record<string, unknown>;

  const language = coerceLanguageCode(
    typeof o.language === "string" ? o.language : request.targetLanguage,
  ) as LearningLanguageCode;
  const contentType =
    asContentType(o.contentType) || request.contentType || base.contentType;
  const durationBucket = asDurationBucket(
    o.durationBucket ?? request.preferredDuration,
  );
  const durationObj =
    o.duration && typeof o.duration === "object"
      ? (o.duration as Record<string, unknown>)
      : {};
  const minSeconds =
    typeof durationObj.min === "number"
      ? durationObj.min
      : typeof durationObj.minSeconds === "number"
        ? durationObj.minSeconds
        : DURATION_BUCKETS[durationBucket].minSeconds;
  const maxSeconds =
    typeof durationObj.max === "number"
      ? durationObj.max
      : typeof durationObj.maxSeconds === "number"
        ? durationObj.maxSeconds
        : DURATION_BUCKETS[durationBucket].maxSeconds;

  // Category selection wins over model-rewritten topic so coverage stays stable.
  const category = isDiscoveryTopicId(request.topicCategory)
    ? getDiscoveryTopicCategory(request.topicCategory)
    : null;
  const topic = category?.topic ||
    (typeof o.topic === "string" && o.topic.trim()) ||
    base.topic;
  const level =
    asLearnerLevel(o.level) || asLearnerLevel(request.learnerLevel);
  const modelKeywords = Array.isArray(o.keywords)
    ? o.keywords
        .filter((k): k is string => typeof k === "string")
        .map((k) => k.trim())
        .filter(Boolean)
        .slice(0, 8)
    : [];
  const keywords = category
    ? [...category.keywords, ...(modelKeywords.slice(0, 3))]
    : modelKeywords.length
      ? modelKeywords
      : base.keywords;

  return {
    language,
    topic,
    contentType,
    durationBucket,
    duration: {
      ...(minSeconds != null ? { minSeconds } : {}),
      ...(maxSeconds != null ? { maxSeconds } : {}),
    },
    ...(level ? { level } : {}),
    keywords: keywords.length ? keywords : base.keywords,
    ...(typeof o.naturalQuery === "string" && o.naturalQuery.trim()
      ? { naturalQuery: o.naturalQuery.trim() }
      : base.naturalQuery
        ? { naturalQuery: base.naturalQuery }
        : {}),
    ...(request.requireOriginalCaptions || base.requireOriginalCaptions
      ? { requireOriginalCaptions: true }
      : {}),
    ...(category ? { topicCategory: category.id } : {}),
  };
}

/**
 * Structure a user request into a search intent.
 * Never invents content titles/URLs — only query parameters.
 */
export async function parseSearchIntent(
  client: OpenAI | null,
  request: ContentDiscoveryRequest,
): Promise<ContentSearchIntent> {
  const fallback = defaultIntent(request);
  const natural = request.naturalQuery?.trim();
  // Category-only search: keep curated keywords (covers full crawl surface).
  if (!natural) {
    return fallback;
  }
  if (!client) {
    return fallback;
  }

  try {
    const completion = await client.chat.completions.create({
      model: MODEL,
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You turn a learner's content request into a search intent for discovering REAL web content.
Do NOT invent video titles, article titles, URLs, channels, or posts.
Only output structured search parameters.

Return JSON:
{
  "language": "en|ko|ja|zh|es|fr|it|pt|ru",
  "topic": "short topic in English",
  "contentType": "video"|"reading",
  "durationBucket": "short"|"medium"|"long"|"any",
  "duration": {"min":0,"max":600},
  "level": "beginner"|"intermediate"|"advanced"|null,
  "keywords": ["search keyword 1", "..."]
}

Rules:
- language defaults to ${request.targetLanguage} unless the user clearly asks for another learning language.
- contentType defaults to ${request.contentType}.
- keywords should help a search API find authentic ${learningLanguageName(request.targetLanguage)} content about the topic.
- Prefer conversation-heavy / spoken content cues for video (vlog, interview, dialogue) when relevant.
- Prefer news/article cues for reading when relevant.
- duration: short≈under 5m, medium≈5–15m, long≈15m+.
- level must be one of ${LEARNER_LEVELS.join(", ")} or null.
- If a topicCategory is provided, keep keywords close to that category; use naturalQuery only to refine.`,
        },
        {
          role: "user",
          content: JSON.stringify({
            targetLanguage: request.targetLanguage,
            contentType: request.contentType,
            topic: request.topic || null,
            topicCategory: request.topicCategory || null,
            preferredDuration: request.preferredDuration || null,
            learnerLevel: request.learnerLevel || null,
            naturalQuery: natural || null,
          }),
        },
      ],
    });
    const raw = completion.choices[0]?.message?.content;
    if (!raw) return fallback;
    return normalizeIntent(JSON.parse(raw) as unknown, request);
  } catch (error) {
    console.error("[content-discovery/intent]", error);
    return fallback;
  }
}

export function buildSearchQuery(intent: ContentSearchIntent): string {
  const langName = learningLanguageName(intent.language);
  const parts = [
    ...intent.keywords.slice(0, 5),
    intent.topic,
    langName,
  ]
    .map((p) => p.replace(/\s+/g, " ").trim())
    .filter(Boolean);
  // Dedupe while preserving order
  const seen = new Set<string>();
  const unique: string[] = [];
  for (const part of parts) {
    const key = part.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(part);
  }
  return unique.slice(0, 8).join(" ");
}

export type { LearnerLevel };
