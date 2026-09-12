import { APP_UPDATE_HEADER, PLAY_LISTING_URL, type UpdateLevel } from "@/lib/appVersion";

/**
 * Whether this build has been left behind, as the server sees it.
 *
 * The server answers every request with its verdict (appVersion.ts). Nothing
 * asks for it on its own: the level is picked up from responses the app was
 * making anyway, so knowing it costs no round trip and no battery.
 *
 * Why it exists at all: testers arrive through a reciprocal-testing service and
 * there is no way to reach them. No mailing list, no notice, no support thread.
 * If a build has to be replaced, the only voice the app has is its own, and
 * this is it.
 *
 * Kept in module scope rather than in React state because the responses that
 * carry it are made from all over the app, most of them nowhere near a
 * component that could hold the answer.
 */

let level: UpdateLevel = "none";
const listeners = new Set<(level: UpdateLevel) => void>();

/**
 * Read the verdict off a response and remember it.
 *
 * Only ever moves in one direction within a session: "required" does not become
 * "available" because some other route answered first. A deploy that lowers the
 * bar reaches the app on its next start, which is soon enough for good news.
 */
export function noteUpdateLevel(response: { headers: { get(name: string): string | null } }) {
  const heard = response.headers.get(APP_UPDATE_HEADER);
  if (heard !== "available" && heard !== "required") return;
  if (level === "required" || heard === level) return;
  level = heard;
  for (const listener of listeners) listener(level);
}

export function updateLevel(): UpdateLevel {
  return level;
}

export function watchUpdateLevel(listener: (level: UpdateLevel) => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/**
 * Send them where the update actually comes from.
 *
 * The store listing, not a file: Play owns the install, and on a device that
 * got the app from Play this opens the Play app on the right page.
 */
export function openStoreListing() {
  try {
    window.open(PLAY_LISTING_URL, "_blank");
  } catch {
    // A WebView that refuses to open a window leaves the banner standing, which
    // still says what needs doing.
  }
}
