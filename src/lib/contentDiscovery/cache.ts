type CacheEntry<T> = {
  expiresAt: number;
  value: T;
};

const store = new Map<string, CacheEntry<unknown>>();

const DEFAULT_TTL_MS = 15 * 60 * 1000;

export function discoveryCacheGet<T>(key: string): T | null {
  const entry = store.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return null;
  }
  return entry.value as T;
}

export function discoveryCacheSet<T>(
  key: string,
  value: T,
  ttlMs = DEFAULT_TTL_MS,
): void {
  store.set(key, { value, expiresAt: Date.now() + ttlMs });
  // Soft cap to avoid unbounded growth in warm serverless instances.
  if (store.size > 200) {
    const first = store.keys().next().value;
    if (first) store.delete(first);
  }
}

export function discoveryCacheKey(parts: Record<string, unknown>): string {
  return Object.keys(parts)
    .sort()
    .map((key) => `${key}=${JSON.stringify(parts[key] ?? null)}`)
    .join("|");
}
