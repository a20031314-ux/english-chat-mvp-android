const BLOCKED_SCHEMES = new Set([
  "javascript",
  "data",
  "file",
  "blob",
  "intent",
  "content",
  "about",
  "mailto",
  "tel",
  "sms",
  "market",
]);

export type WebReaderUrlResult =
  | { ok: true; url: string }
  | { ok: false; error: "empty" | "invalid" | "unsupported" };

function isLocalHost(hostname: string) {
  const host = hostname.toLowerCase();
  return host === "localhost" || host === "127.0.0.1" || host === "[::1]";
}

export function normalizeWebReaderUrl(raw: string): WebReaderUrlResult {
  const trimmed = raw.trim();
  if (!trimmed) return { ok: false, error: "empty" };

  const withScheme = /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  let parsed: URL;
  try {
    parsed = new URL(withScheme);
  } catch {
    return { ok: false, error: "invalid" };
  }

  const scheme = parsed.protocol.replace(":", "").toLowerCase();
  if (BLOCKED_SCHEMES.has(scheme)) {
    return { ok: false, error: "unsupported" };
  }
  if (scheme !== "http" && scheme !== "https") {
    return { ok: false, error: "unsupported" };
  }

  if (scheme === "http" && !isLocalHost(parsed.hostname)) {
    parsed.protocol = "https:";
  }

  return { ok: true, url: parsed.toString() };
}

export const WEB_READER_SHORTCUTS = [
  { id: "reddit", url: "https://www.reddit.com/" },
  { id: "bbc", url: "https://www.bbc.com/news" },
  { id: "guardian", url: "https://www.theguardian.com/" },
] as const;
