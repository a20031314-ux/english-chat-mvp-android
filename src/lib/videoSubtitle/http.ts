export async function fetchWithTimeout(
  url: string,
  init: RequestInit & { timeoutMs?: number } = {},
): Promise<Response> {
  const { timeoutMs = 20000, ...rest } = init;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...rest, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

export const YOUTUBE_ANDROID_UA =
  "com.google.android.youtube/20.10.38 (Linux; U; Android 14) gzip";

export const YOUTUBE_IOS_UA =
  "com.google.ios.youtube/20.10.4 (iPhone16,2; U; CPU iOS 18_1 like Mac OS X)";

export const BROWSER_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

export function youtubeMediaHeaders(
  userAgent = YOUTUBE_ANDROID_UA,
): Record<string, string> {
  return {
    "User-Agent": userAgent,
    Referer: "https://www.youtube.com/",
    Origin: "https://www.youtube.com",
    "Accept-Language": "en-US,en;q=0.9",
  };
}
