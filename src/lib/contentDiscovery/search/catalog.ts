import { discoveryCacheGet, discoveryCacheSet } from "@/lib/contentDiscovery/cache";
import type { CatalogVideo, VideoCandidate } from "@/lib/contentDiscovery/search/types";

const CATALOG_TTL_MS = 30 * 60 * 1000;

function catalogKey(parts: {
  language: string;
  category?: string;
  naturalQuery?: string;
}): string {
  return `video-catalog|${parts.language}|${parts.category || ""}|${parts.naturalQuery || ""}`;
}

export function readCatalog(parts: {
  language: string;
  category?: string;
  naturalQuery?: string;
}): CatalogVideo[] {
  return discoveryCacheGet<CatalogVideo[]>(catalogKey(parts)) || [];
}

export function writeCatalog(
  parts: {
    language: string;
    category?: string;
    naturalQuery?: string;
  },
  videos: VideoCandidate[],
): CatalogVideo[] {
  const now = new Date().toISOString();
  const existing = readCatalog(parts);
  const byId = new Map(existing.map((row) => [row.id, row]));
  for (const video of videos) {
    const prev = byId.get(video.id);
    const topics = new Set([
      ...(prev?.topics || []),
      ...(video.topics || []),
    ]);
    byId.set(video.id, {
      ...prev,
      ...video,
      topics: topics.size ? [...topics] : video.topics,
      discoveredAt: prev?.discoveredAt || now,
      lastValidatedAt: now,
      status: "active",
    });
  }
  const rows = [...byId.values()];
  discoveryCacheSet(catalogKey(parts), rows, CATALOG_TTL_MS);
  return rows;
}
