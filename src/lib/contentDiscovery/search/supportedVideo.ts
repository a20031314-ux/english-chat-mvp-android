/**
 * YouTube URL rules must match `parseYouTubeInput` in videoLearning.ts.
 * Kept local so discovery tests do not load the learning pipeline.
 */
export function extractYoutubeVideoId(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  const fromWatch = trimmed.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (fromWatch?.[1]) return fromWatch[1];

  const fromShort = trimmed.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed|shorts|live)\/)([a-zA-Z0-9_-]{11})/,
  );
  if (fromShort?.[1]) return fromShort[1];

  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  return null;
}

export function canonicalYoutubeUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

export function isSupportedVideoUrl(url: string): boolean {
  return Boolean(extractYoutubeVideoId(url));
}
