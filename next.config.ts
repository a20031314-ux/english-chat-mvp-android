import { readFileSync } from "node:fs";
import type { NextConfig } from "next";
import { DOOR_BASE_DOMAIN, DOOR_LANGS, DOORS } from "./src/lib/doors.ts";

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
  // 웹 광고(AdSense) 판매자 확인 파일. 앱 정적 빌드에는 서버가 없어서 넣지 않는다.
  // 창구(lib/doors.ts): call.languagebank.net 의 `/`·`/<언어>`는 소개 페이지, `?screen=`이 붙으면 같은 앱.
  ...(capacitorStatic
    ? {}
    : {
        rewrites: async () => ({
          beforeFiles: DOORS.flatMap((door) => {
            const host = [{ type: "host" as const, value: `${door.host}.${DOOR_BASE_DOMAIN}` }];
            const appQuery = [{ type: "query" as const, key: "screen" }];
            return [
              { source: "/", has: host, missing: appQuery, destination: `/door/${door.id}` },
              { source: `/:lang(${DOOR_LANGS.join("|")})`, has: host, destination: `/door/${door.id}/:lang` },
            ];
          }),
          afterFiles: [{ source: "/ads.txt", destination: "/api/ads/txt" }],
          fallback: [],
        }),
      }),
};

export default nextConfig;
