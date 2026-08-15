import { buildSearchQuery } from "@/lib/contentDiscovery/parseSearchIntent";
import type {
  ContentCandidate,
  ContentSearchIntent,
} from "@/lib/contentDiscovery/types";
import type { LearningLanguageCode } from "@/lib/learningLanguages";

const WIKI_HOST: Record<LearningLanguageCode, string> = {
  en: "en.wikipedia.org",
  ko: "ko.wikipedia.org",
  ja: "ja.wikipedia.org",
  zh: "zh.wikipedia.org",
  es: "es.wikipedia.org",
  fr: "fr.wikipedia.org",
  it: "it.wikipedia.org",
  pt: "pt.wikipedia.org",
  ru: "ru.wikipedia.org",
};

type WikiSearchItem = {
  title?: string;
  snippet?: string;
  pageid?: number;
};

function simpleHash(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return hash.toString(36);
}

function stripWikiMarkup(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

/**
 * Reading discovery via Wikipedia search (public API, not HTML scraping).
 */
export async function searchWikipedia(
  intent: ContentSearchIntent,
): Promise<{ candidates: ContentCandidate[]; warning?: string }> {
  const host = WIKI_HOST[intent.language] || WIKI_HOST.en;
  const q = buildSearchQuery(intent);
  const params = new URLSearchParams({
    action: "query",
    list: "search",
    srsearch: q,
    srlimit: "15",
    format: "json",
    utf8: "1",
  });

  try {
    const response = await fetch(
      `https://${host}/w/api.php?${params.toString()}`,
      {
        headers: {
          Accept: "application/json",
          "User-Agent": "english-chat-mvp/content-discovery",
        },
        next: { revalidate: 0 },
      },
    );
    if (!response.ok) {
      return { candidates: [], warning: "WIKI_FAILED" };
    }
    const json = (await response.json()) as {
      query?: { search?: WikiSearchItem[] };
    };
    const rows = json.query?.search ?? [];
    const candidates: ContentCandidate[] = [];
    const seen = new Set<string>();

    for (const row of rows) {
      const title = row.title?.trim();
      if (!title) continue;
      const url = `https://${host}/wiki/${encodeURIComponent(title.replace(/ /g, "_"))}`;
      if (seen.has(url)) continue;
      seen.add(url);
      const preview = stripWikiMarkup(row.snippet || "").slice(0, 180);
      candidates.push({
        id: `wiki:${simpleHash(url)}`,
        type: "article",
        source: "wikipedia",
        title,
        url,
        description: preview || undefined,
        preview: preview || undefined,
        authorOrChannel: host,
        language: intent.language,
      });
    }
    return { candidates };
  } catch (error) {
    console.error("[wikipedia-search]", error);
    return { candidates: [], warning: "WIKI_FAILED" };
  }
}
