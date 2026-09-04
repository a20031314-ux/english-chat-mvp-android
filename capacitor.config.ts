import type { CapacitorConfig } from "@capacitor/cli";

/**
 * Production Play Store builds should load bundled assets from `www/` inside the
 * Capacitor WebView (no remote server.url).
 *
 * For local live reload only, set CAPACITOR_DEV_SERVER_URL, e.g.:
 *   CAPACITOR_DEV_SERVER_URL=http://192.168.0.10:3000
 */
const devServerUrl = process.env.CAPACITOR_DEV_SERVER_URL?.trim();

/**
 * appId reads like a leftover placeholder, and it is — but it is now permanent.
 * Play locks a package name to its app entry the moment a bundle is uploaded,
 * and 2.38 through 2.40 already went to the closed testing track under this one.
 * Changing it would mean a new Play listing, new testers, and a fresh RevenueCat
 * setup, while this name stays burned for the account either way. It is invisible
 * to users, so it stays. Everything a user reads says "languagebank".
 *
 * Keep in sync if it ever does change: android/app/build.gradle (namespace and
 * applicationId), the java/ package directories, and the RevenueCat Play app.
 */
const config: CapacitorConfig = {
  appId: "com.yourname.englishchat",
  appName: "languagebank",
  webDir: "www",
  android: {
    allowMixedContent: false,
  },
  plugins: {
    CapacitorHttp: {
      enabled: true,
    },
  },
  ...(devServerUrl
    ? {
        server: {
          url: devServerUrl,
          cleartext: devServerUrl.startsWith("http://"),
          androidScheme: "https",
        },
      }
    : {}),
};

export default config;
