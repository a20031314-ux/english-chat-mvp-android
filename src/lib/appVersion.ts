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
