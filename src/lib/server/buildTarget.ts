/**
 * Which of the two builds this is.
 *
 * One codebase produces both the copy of the web app bundled into the APK and
 * the deployment that serves the API. `scripts/build-capacitor.mjs` sets
 * CAPACITOR_STATIC=1 for the first; nothing sets it for the second.
 *
 * Read this only from server components. It is a plain environment variable, so
 * it is inlined for client bundles only when prefixed NEXT_PUBLIC_ — and it must
 * not be, because a value the client can read is a value the client can lie
 * about. Deciding at build time is what makes the split unbypassable.
 */
export function isAppBuild(): boolean {
  return process.env.CAPACITOR_STATIC === "1";
}
