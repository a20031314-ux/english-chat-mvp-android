export type RecentEnglishAnalysis = {
  input: string;
  translation?: string;
  savedAt: number;
};

const STORAGE_KEY = "englishAnalysisRecent";
const MAX_ITEMS = 8;

export function loadRecentEnglishAnalyses(): RecentEnglishAnalysis[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const out: RecentEnglishAnalysis[] = [];
    for (const item of parsed) {
      if (!item || typeof item !== "object") continue;
      const o = item as Record<string, unknown>;
      const input =
        typeof o.input === "string" ? o.input.replace(/\s+/g, " ").trim() : "";
      if (!input) continue;
      const translation =
        typeof o.translation === "string"
          ? o.translation.replace(/\s+/g, " ").trim()
          : "";
      const savedAt = typeof o.savedAt === "number" ? o.savedAt : Date.now();
      out.push({
        input,
        ...(translation ? { translation } : {}),
        savedAt,
      });
      if (out.length >= MAX_ITEMS) break;
    }
    return out;
  } catch {
    return [];
  }
}

export function rememberEnglishAnalysis(entry: {
  input: string;
  translation?: string;
}): RecentEnglishAnalysis[] {
  const input = entry.input.replace(/\s+/g, " ").trim();
  if (!input) return loadRecentEnglishAnalyses();
  const next: RecentEnglishAnalysis[] = [
    {
      input,
      ...(entry.translation ? { translation: entry.translation } : {}),
      savedAt: Date.now(),
    },
    ...loadRecentEnglishAnalyses().filter(
      (item) => item.input.toLowerCase() !== input.toLowerCase(),
    ),
  ].slice(0, MAX_ITEMS);
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
  return next;
}
