import {
  coerceLanguageCode,
  type LearningLanguageCode,
} from "@/lib/learningLanguages";

export const DISCOVERY_CHANNELS_STORAGE_KEY = "talkbank-discovery-channels";
const MAX_SAVED = 24;

export type SavedDiscoveryChannel = {
  channelId: string;
  name: string;
  url: string;
  thumbnailUrl?: string;
};

type Store = Partial<Record<LearningLanguageCode, SavedDiscoveryChannel[]>>;

function asChannel(raw: unknown): SavedDiscoveryChannel | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const channelId = typeof o.channelId === "string" ? o.channelId.trim() : "";
  const name = typeof o.name === "string" ? o.name.trim() : "";
  const url = typeof o.url === "string" ? o.url.trim() : "";
  if (!channelId || !name || !url) return null;
  return {
    channelId,
    name,
    url,
    ...(typeof o.thumbnailUrl === "string" && o.thumbnailUrl.trim()
      ? { thumbnailUrl: o.thumbnailUrl.trim() }
      : {}),
  };
}

function readStore(): Store {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(DISCOVERY_CHANNELS_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return {};
    const out: Store = {};
    for (const [key, value] of Object.entries(parsed as Record<string, unknown>)) {
      const language = coerceLanguageCode(key);
      if (!Array.isArray(value)) continue;
      out[language] = value
        .map(asChannel)
        .filter((row): row is SavedDiscoveryChannel => Boolean(row));
    }
    return out;
  } catch {
    return {};
  }
}

function writeStore(store: Store) {
  window.localStorage.setItem(
    DISCOVERY_CHANNELS_STORAGE_KEY,
    JSON.stringify(store),
  );
}

export function loadSavedDiscoveryChannels(
  language: LearningLanguageCode,
): SavedDiscoveryChannel[] {
  return readStore()[language] ?? [];
}

export function saveDiscoveryChannel(
  language: LearningLanguageCode,
  channel: SavedDiscoveryChannel,
): SavedDiscoveryChannel[] {
  const store = readStore();
  const current = store[language] ?? [];
  const next = [
    channel,
    ...current.filter((row) => row.channelId !== channel.channelId),
  ].slice(0, MAX_SAVED);
  store[language] = next;
  writeStore(store);
  return next;
}

export function removeDiscoveryChannel(
  language: LearningLanguageCode,
  channelId: string,
): SavedDiscoveryChannel[] {
  const store = readStore();
  const next = (store[language] ?? []).filter(
    (row) => row.channelId !== channelId,
  );
  store[language] = next;
  writeStore(store);
  return next;
}

export function youtubeChannelUrl(channelId: string): string {
  return `https://www.youtube.com/channel/${channelId}`;
}

export function isYoutubeChannelId(value: string): boolean {
  return /^UC[\w-]{20,}$/.test(value.trim());
}
