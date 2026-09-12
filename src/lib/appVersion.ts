/**
 * Which build a request came from.
 *
 * The app and the API move on different clocks: pushing to main deploys the
 * server at once, while a new APK has to be built, reviewed, and then actually
 * installed by each person. Installs linger on old versions for a long time —
 * during closed testing there may be testers sitting on a build from weeks ago,
 * and no amount of releasing changes that, because a developer cannot make a
 * phone update.
 *
 * Until now the server could not tell which build it was talking to, so "some
 * testers are probably still on the old one" stayed a guess. It is a header
 * now, logged beside the usage counters, which turns the version spread into
 * something anyone can read off the logs.
 *
 * The catch is structural and worth stating: this only reports builds that
 * carry it. Everything already installed is silent, and will stay silent until
 * it updates. So the first thing this measures is not the whole population —
 * it is the part of it that has moved.
 */

/** Set from package.json at build time; see next.config.ts. */
export function appVersion(): string {
  return process.env.NEXT_PUBLIC_APP_VERSION?.trim() ?? "";
}

/**
 * Sent by builds that know their own version. Its absence means "older than
 * this", which is information too — the same shape as the call-block header,
 * and it heals the same way as people update.
 */
export const APP_VERSION_HEADER = "x-app-version";

/** What the server should record for a request, including when it says nothing. */
export function requestAppVersion(headers: {
  get: (name: string) => string | null;
}): string {
  return headers.get(APP_VERSION_HEADER)?.trim() || "unknown";
}

/**
 * What the server tells a build about its own age.
 *
 * A header rather than a field in any response body, for two reasons. It rides
 * on every route without any of them agreeing to carry it, and a header is the
 * one thing an older build cannot be confused by — it reads the body it expects
 * and never sees this at all.
 *
 * This is the only way to reach people at all. Testers arrive through a
 * reciprocal-testing service with no channel back to them, so there is nobody
 * to email when a build needs replacing: the app has to say so itself.
 */
export const APP_UPDATE_HEADER = "x-app-update";

export type UpdateLevel = "none" | "available" | "required";

/**
 * The oldest build the server will still serve without complaint.
 *
 * Raise this only for a build that is genuinely broken against the current
 * server — it takes the app away from whoever has not updated, and during
 * closed testing that may be someone who cannot be asked to.
 */
export const MIN_SUPPORTED_APP_VERSION = "2.48";

/**
 * The oldest build that is not asked to update.
 *
 * Cheap to move, because it only raises a banner. This is the lever to reach
 * for; MIN_SUPPORTED is the one to leave alone.
 */
export const RECOMMENDED_APP_VERSION = "2.50";

/** -1, 0 or 1. Missing parts count as zero, so "2.49" and "2.49.0" are equal. */
export function compareVersions(a: string, b: string): number {
  const read = (value: string) =>
    value
      .trim()
      .split(".")
      .map((part) => Number.parseInt(part, 10) || 0);
  const left = read(a);
  const right = read(b);
  const length = Math.max(left.length, right.length);
  for (let index = 0; index < length; index += 1) {
    const difference = (left[index] ?? 0) - (right[index] ?? 0);
    if (difference !== 0) return difference < 0 ? -1 : 1;
  }
  return 0;
}

/**
 * What to tell a build that says it is this version.
 *
 * A build too old to name itself says nothing, and "unknown" is older than
 * anything named — it predates the header that reports the version at all. It
 * is still only asked, never required: those builds cannot read this answer
 * either, so requiring anything of them would be shouting at a wall, and the
 * day MIN_SUPPORTED passes them they would be locked out with no way to be told
 * why.
 */
export function updateLevelFor(version: string): UpdateLevel {
  const named = version && version !== "unknown";
  if (!named) return "available";
  if (compareVersions(version, MIN_SUPPORTED_APP_VERSION) < 0) return "required";
  if (compareVersions(version, RECOMMENDED_APP_VERSION) < 0) return "available";
  return "none";
}

/** Where an update comes from. The listing, not a file: Play does the install. */
export const PLAY_LISTING_URL =
  "https://play.google.com/store/apps/details?id=com.yourname.englishchat";
