import { buildSearchQuery } from "@/lib/contentDiscovery/parseSearchIntent";
import type {
  ContentCandidate,
  ContentSearchIntent,
} from "@/lib/contentDiscovery/types";
import type { LearningLanguageCode } from "@/lib/learningLanguages";

type NewsLocale = { hl: string; gl: string; ceid: string };

const NEWS_LOCALE: Record<LearningLanguageCode, NewsLocale> = {
  en: { hl: "en-US", gl: "US", ceid: "US:en" },
  ko: { hl: "ko", gl: "KR", ceid: "KR:ko" },
  ja: { hl: "ja", gl: "JP", ceid: "JP:ja" },
  zh: { hl: "zh-CN", gl: "CN", ceid: "CN:zh-Hans" },
  es: { hl: "es", gl: "ES", ceid: "ES:es" },
  fr: { hl: "fr", gl: "FR", ceid: "FR:fr" },
  it: { hl: "it", gl: "IT", ceid: "IT:it" },
  pt: { hl: "pt-PT", gl: "PT", ceid: "PT:pt-150" },
  ru: { hl: "ru", gl: "RU", ceid: "RU:ru" },
};

function decodeXml(text: string): string {
  return text
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function tagValue(block: string, tag: string): string {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i");
  const match = re.exec(block);
  return match ? decodeXml(match[1] || "") : "";
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function estimateReadingMinutes(text: string): number | undefined {
  const words = text.split(/\s+/).filter(Boolean).length;
  if (words < 20) return undefined;
  return Math.max(1, Math.round(words / 200));
}

function sourceFromUrl(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "news";
  }
}

function simpleHash(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return hash.toString(36);
}

/**
 * Reading discovery via Google News RSS (public feed, not HTML scraping).
 * Returns titles + links + short descriptions only — no full article body storage.
 */
export async function searchGoogleNewsRss(
  intent: ContentSearchIntent,
): Promise<{ candidates: ContentCandidate[]; warning?: string }> {
  const locale = NEWS_LOCALE[intent.language] || NEWS_LOCALE.en;
  const q = buildSearchQuery(intent);
  const params = new URLSearchParams({
    q,
    hl: locale.hl,
    gl: locale.gl,
    ceid: locale.ceid,
  });
  const feedUrl = `https://news.google.com/rss/search?${params.toString()}`;

  let xml: string;
  try {
    const response = await fetch(feedUrl, {
      headers: { Accept: "application/rss+xml, application/xml, text/xml" },
      next: { revalidate: 0 },
    });
    if (!response.ok) {
      return { candidates: [], warning: "NEWS_FAILED" };
    }
    xml = await response.text();
  } catch (error) {
    console.error("[google-news-rss]", error);
    return { candidates: [], warning: "NEWS_FAILED" };
  }

  const items = xml.match(/<item[\s\S]*?<\/item>/gi) || [];
  const candidates: ContentCandidate[] = [];
  const seen = new Set<string>();

  for (const block of items) {
    const title = tagValue(block, "title");
    const link = tagValue(block, "link");
    const description = stripHtml(tagValue(block, "description"));
    const pubDate = tagValue(block, "pubDate");
    const sourceName = tagValue(block, "source") || sourceFromUrl(link);
    if (!title || !link) continue;
    if (seen.has(link)) continue;
    seen.add(link);

    candidates.push({
      id: `news:${simpleHash(link)}`,
      type: "article",
      source: sourceName || "google-news",
      title,
      url: link,
      description: description.slice(0, 400) || undefined,
      preview: description.slice(0, 180) || undefined,
      publishedAt: pubDate || undefined,
      authorOrChannel: sourceName || undefined,
      estimatedReadingMinutes: estimateReadingMinutes(description),
      language: intent.language,
    });
    if (candidates.length >= 20) break;
  }

  return { candidates };
}
