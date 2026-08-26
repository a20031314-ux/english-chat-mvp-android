import type { NextConfig } from "next";

/** Set by `scripts/build-capacitor.mjs` so `app/api` can be omitted during export. */
const capacitorStatic = process.env.CAPACITOR_STATIC === "1";

const nextConfig: NextConfig = {
  ...(capacitorStatic ? { output: "export" as const } : {}),
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
