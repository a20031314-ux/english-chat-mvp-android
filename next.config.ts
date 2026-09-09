import { readFileSync } from "node:fs";
import type { NextConfig } from "next";

/**
 * The app's own version, read from package.json so a release bumps one file and
 * not three. Inlined at build time, which is what a static export needs: there
 * is no server left to read an environment variable at request time.
 */
const appVersion = JSON.parse(
  readFileSync("./package.json", "utf8"),
).version as string;

/** Set by `scripts/build-capacitor.mjs` so `app/api` can be omitted during export. */
const capacitorStatic = process.env.CAPACITOR_STATIC === "1";

const nextConfig: NextConfig = {
  ...(capacitorStatic ? { output: "export" as const } : {}),
  env: {
    NEXT_PUBLIC_APP_VERSION: appVersion,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
