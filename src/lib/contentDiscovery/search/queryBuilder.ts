import { nativeSearchTerms } from "../nativeSearchTerms";
import type { DiscoveryTopicId } from "../topicCategories";
import type { ContentSearchIntent } from "../types";
import { learningLanguageName } from "../../learningLanguages";

/**
 * Extra search intents per category so one keyword does not dominate results.
 * Keep these close to the selected topic — do not inject unrelated genres.
 */
const CATEGORY_INTENTS: Record<DiscoveryTopicId, string[]> = {
  any: ["everyday conversation", "natural spoken interview", "daily vlog"],
  daily: ["everyday conversation", "daily life vlog", "casual dialogue"],
  travel: ["travel vlog", "trip conversation", "airport travel talk"],
  food: ["cooking tutorial", "restaurant conversation", "food vlog"],
  work: ["workplace conversation", "career interview", "business discussion"],
  news: ["news report", "current events discussion", "interview news"],
  school: ["lecture explanation", "classroom discussion", "study tips talk"],
  entertainment: ["variety talk", "drama clip discussion", "entertainment interview"],
  sports: ["sports interview", "match discussion", "athlete talk"],
  tech: [
    "software development",
    "programming tutorial",
    "web development",
    "developer interview",
    "software engineering discussion",
    "coding tutorial",
  ],
  culture: ["culture explanation", "city life vlog", "tradition documentary"],
  health: ["health explanation", "fitness talk", "doctor interview"],
  music: ["musician interview", "concert talk", "song explanation"],
  family: ["family vlog", "parenting conversation", "home daily life"],
  interview: ["interview", "podcast conversation", "talk show"],
  vlog: ["daily vlog", "day in my life", "real life vlog"],
  shopping: ["shopping vlog", "fashion haul", "store conversation"],
  finance: ["economy explanation", "business news discussion", "finance interview"],
  nature: ["wildlife documentary", "nature explanation", "animals talk"],
  hobbies: [
    "gaming discussion",
    "hobby tutorial",
    "how to craft",
    "game commentary",
  ],
};

const DIVERSITY_HINT: Record<string, string[]> = {
  en: ["interview", "tutorial", "discussion"],
  ko: ["인터뷰", "강의", "토크"],
  ja: ["インタビュー", "解説", "対談"],
  zh: ["访谈", "教程", "讨论"],
  es: ["entrevista", "tutorial", "conversación"],
  fr: ["interview", "tutoriel", "discussion"],
  it: ["intervista", "tutorial", "discussione"],
  pt: ["entrevista", "tutorial", "conversa"],
  ru: ["интервью", "урок", "обсуждение"],
};

function uniqueQueries(queries: string[], limit: number): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of queries) {
    const query = raw.replace(/\s+/g, " ").trim();
    const key = query.toLowerCase();
    if (!query || seen.has(key)) continue;
    seen.add(key);
    out.push(query);
    if (out.length >= limit) break;
  }
  return out;
}

/**
 * Category / free-text → several search intents.
 * Used by both category browse and a future "Search videos..." box.
 */
export function buildVideoSearchQueries(intent: ContentSearchIntent): string[] {
  const language = intent.language;
  const native = nativeSearchTerms(intent.topicCategory || "any", language);
  const extras = CATEGORY_INTENTS[intent.topicCategory || "any"] || [];
  const hints = DIVERSITY_HINT[language] || DIVERSITY_HINT.en;
  const queries: string[] = [];

  if (intent.naturalQuery?.trim()) {
    queries.push(intent.naturalQuery.trim());
  }

  for (const term of native) queries.push(term);

  if (language === "en") {
    for (const extra of extras) queries.push(extra);
  } else if (native[0] && hints[0]) {
    queries.push(`${native[0]} ${hints[0]}`);
    if (hints[1]) queries.push(`${native[0]} ${hints[1]}`);
  }

  if (intent.keywords?.length) {
    for (const keyword of intent.keywords.slice(0, 3)) {
      queries.push(keyword);
    }
  }

  const unique = uniqueQueries(queries, 5);
  if (unique.length > 0) return unique;
  return [learningLanguageName(language)];
}

export function withVideoSiteHint(query: string, forWebSearch: boolean): string {
  if (!forWebSearch) return query;
  if (/site:\s*youtube\.com/i.test(query)) return query;
  return `${query} site:youtube.com`;
}
