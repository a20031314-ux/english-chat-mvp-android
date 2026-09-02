/**
 * The little bit of durable state the API needs, over HTTP.
 *
 * API routes run as serverless functions. Anything kept in module scope lives
 * in one warm instance, is invisible to every other instance handling requests
 * at the same time, and disappears when that instance recycles — so a usage
 * counter held that way does not actually count. This talks to Vercel KV /
 * Upstash over their REST interface, which needs no driver and no connection
 * pool and so works from a cold start.
 *
 * Set either pair of variables (the Vercel KV integration provides the first,
 * Upstash directly the second):
 *
 *   KV_REST_API_URL / KV_REST_API_TOKEN
 *   UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN
 *
 * With neither, this falls back to an in-memory map so local development still
 * runs. That fallback has exactly the weakness described above, so it says so
 * once rather than pretending to be a store.
 */

type Credentials = { url: string; token: string };

function credentials(): Credentials | null {
  const url = (
    process.env.KV_REST_API_URL ??
    process.env.UPSTASH_REDIS_REST_URL ??
    ""
  ).trim();
  const token = (
    process.env.KV_REST_API_TOKEN ??
    process.env.UPSTASH_REDIS_REST_TOKEN ??
    ""
  ).trim();
  if (!url || !token) return null;
  return { url: url.replace(/\/+$/, ""), token };
}

export function kvConfigured(): boolean {
  return credentials() !== null;
}

const memoryStore = globalThis as typeof globalThis & {
  __kvMemory?: Map<string, { value: string; expiresAt: number | null }>;
  __kvMemoryWarned?: boolean;
};

function memory() {
  return (memoryStore.__kvMemory ??= new Map());
}

function warnOnce() {
  if (memoryStore.__kvMemoryWarned) return;
  memoryStore.__kvMemoryWarned = true;
  console.warn(
    "[kv] No KV credentials. Usage counters are in-memory and will reset when this instance recycles.",
  );
}

function memoryRead(key: string): string | null {
  const row = memory().get(key);
  if (!row) return null;
  if (row.expiresAt !== null && row.expiresAt <= Date.now()) {
    memory().delete(key);
    return null;
  }
  return row.value;
}

function memoryWrite(key: string, value: string, ttlSeconds?: number) {
  memory().set(key, {
    value,
    expiresAt: ttlSeconds ? Date.now() + ttlSeconds * 1000 : null,
  });
}

/**
 * A counter that cannot be reached is not a reason to fail the request it
 * belongs to. Every failure here degrades to "nothing recorded", which leaves
 * the caller permissive — the wrong answer for the counter, but far better than
 * a store outage taking chat and video preparation down with it. Counting usage
 * is a side concern of those requests, and a side concern must not be able to
 * end them.
 */
async function attempt<T>(
  what: string,
  run: () => Promise<T>,
  fallback: T,
): Promise<T> {
  try {
    return await run();
  } catch (error) {
    console.error(`[kv] ${what} failed, continuing without it`, error);
    return fallback;
  }
}

/** Upstash takes a command as a JSON array and answers with `{ result }`. */
async function command(parts: (string | number)[]): Promise<unknown> {
  const creds = credentials();
  if (!creds) throw new Error("kv command without credentials");
  const response = await fetch(creds.url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${creds.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(parts),
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`kv ${parts[0]} failed with ${response.status}`);
  }
  const body = (await response.json()) as { result?: unknown };
  return body.result ?? null;
}

export async function kvGetJson<T>(key: string): Promise<T | null> {
  let raw: string | null;
  if (!credentials()) {
    warnOnce();
    raw = memoryRead(key);
  } else {
    raw = await attempt(
      `GET ${key}`,
      async () => {
        const result = await command(["GET", key]);
        return typeof result === "string" ? result : null;
      },
      null,
    );
  }
  if (raw === null) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function kvSetJson(
  key: string,
  value: unknown,
  ttlSeconds?: number,
): Promise<void> {
  const raw = JSON.stringify(value);
  if (!credentials()) {
    warnOnce();
    memoryWrite(key, raw, ttlSeconds);
    return;
  }
  await attempt(
    `SET ${key}`,
    () =>
      command(
        ttlSeconds ? ["SET", key, raw, "EX", ttlSeconds] : ["SET", key, raw],
      ),
    null,
  );
}

/**
 * Adds to a counter and returns the new total. The expiry is refreshed on every
 * call, which is harmless because every counter key already names its own day
 * or month — the key stops being written to before the window is over.
 */
export async function kvIncrBy(
  key: string,
  amount: number,
  ttlSeconds?: number,
): Promise<number> {
  if (!credentials()) {
    warnOnce();
    const current = Number(memoryRead(key) ?? 0);
    const next = current + amount;
    memoryWrite(key, String(next), ttlSeconds);
    return next;
  }
  return attempt(
    `INCRBY ${key}`,
    async () => {
      const result = await command(["INCRBY", key, amount]);
      if (ttlSeconds) await command(["EXPIRE", key, ttlSeconds]);
      return Number(result ?? 0);
    },
    0,
  );
}

export async function kvGetNumber(key: string): Promise<number> {
  if (!credentials()) {
    warnOnce();
    return Number(memoryRead(key) ?? 0);
  }
  return attempt(
    `GET ${key}`,
    async () => {
      const result = await command(["GET", key]);
      return typeof result === "string" || typeof result === "number"
        ? Number(result)
        : 0;
    },
    0,
  );
}
