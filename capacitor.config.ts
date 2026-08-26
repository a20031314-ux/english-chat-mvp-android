import type { CapacitorConfig } from "@capacitor/cli";

/**
 * Production Play Store builds should load bundled assets from `www/` inside the
 * Capacitor WebView (no remote server.url).
 *
 * For local live reload only, set CAPACITOR_DEV_SERVER_URL, e.g.:
 *   CAPACITOR_DEV_SERVER_URL=http://192.168.0.10:3000
 */
const devServerUrl = process.env.CAPACITOR_DEV_SERVER_URL?.trim();

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
