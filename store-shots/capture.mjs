/**
 * Store screenshots from the running app.
 *
 *   1. capture: open the app at phone size for each locale in
 *      store-shots/content/, play each scene in scenes.mjs with fixed AI
 *      responses, and save the screen to store-shots/out/raw/.
 *   2. compose: put that screen under the locale's headline (frame.html) and
 *      write 1080×1920 PNGs to fastlane/metadata/android/<locale>/images/
 *      phoneScreenshots/, which "Play: upload listing" sends to Play.
 *
 * The app must already be running, in app-build mode:
 *   CAPACITOR_STATIC=1 npx next dev -p 3100
 * then:
 *   npm run store:shots                       every locale in content/
 *   npm run store:shots -- --locale en-US     one locale
 *   npm run store:shots -- --scene chat       one scene
 *
 * Files this writes are named NN-<scene>.png. Anything else already in a
 * phoneScreenshots folder (for example screenshots pulled from Play) is left
 * alone, and Play shows the whole folder in file-name order, up to eight.
 */
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { SCENES, baseRoutes } from "./scenes.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, "..");
const contentDir = path.join(here, "content");
const rawDir = path.join(here, "out", "raw");
const metadataDir = path.join(root, "fastlane", "metadata", "android");

const args = process.argv.slice(2);
const arg = (name) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : undefined;
};
const baseUrl = (arg("base-url") ?? process.env.STORE_SHOTS_URL ?? "http://localhost:3100").replace(/\/$/, "");
const onlyLocale = arg("locale");
const onlyScene = arg("scene");

/** One accent per scene, the same set the store canvas uses. */
const ACCENTS = ["#FF8A6B", "#7CC4FF", "#C6F25A", "#FFD15C"];

/** The phone screen: a common 20:9 Android size (412×915 CSS px), rendered at 2x so text stays sharp in the frame. */
const PHONE = { viewport: { width: 412, height: 915 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true };

/** Hide Next's dev badge and stop animations, so every run draws the same pixels. */
const STEADY_CSS = `
  nextjs-portal { display: none !important; }
  *, *::before, *::after { animation: none !important; transition: none !important; caret-color: transparent !important; }
`;

const escapeHtml = (s) =>
  String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

const locales = readdirSync(contentDir)
  .filter((f) => f.endsWith(".json"))
  .map((f) => f.replace(/\.json$/, ""))
  .filter((l) => !onlyLocale || l === onlyLocale);
if (!locales.length) {
  console.error(`No content for ${onlyLocale ?? "any locale"} in store-shots/content/.`);
  process.exit(1);
}

const APP_VERSION = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8")).version;
const frameTemplate = readFileSync(path.join(here, "frame.html"), "utf8");
const browser = await chromium.launch();
let failures = 0;

try {
  for (const locale of locales) {
    const content = JSON.parse(readFileSync(path.join(contentDir, `${locale}.json`), "utf8"));
    for (const scene of SCENES) {
      if (onlyScene && scene.id !== onlyScene) continue;
      const sceneContent = content.scenes?.[scene.id];
      if (!sceneContent) {
        console.log(`skip  ${locale}/${scene.id}: no content`);
        continue;
      }
      const label = `${locale}/${scene.id}`;
      try {
        const raw = await capture(content, scene, sceneContent);
        mkdirSync(path.join(rawDir, locale), { recursive: true });
        writeFileSync(path.join(rawDir, locale, `${scene.id}.png`), raw);

        const png = await compose(content, scene, sceneContent, raw);
        const outDir = path.join(metadataDir, locale, "images", "phoneScreenshots");
        mkdirSync(outDir, { recursive: true });
        const file = `${String(scene.order).padStart(2, "0")}-${scene.id}.png`;
        writeFileSync(path.join(outDir, file), png);
        console.log(`ok    ${label} → fastlane/metadata/android/${locale}/images/phoneScreenshots/${file}`);
      } catch (error) {
        failures += 1;
        console.error(`FAIL  ${label}: ${error.message.split("\n")[0]}`);
      }
    }
  }
} finally {
  await browser.close();
}
process.exit(failures ? 1 : 0);

async function capture(content, scene, sceneContent) {
  const context = await browser.newContext(PHONE);
  await context.addInitScript(
    ({ uiLocale, targetLanguage, version }) => {
      localStorage.setItem("appUiLocale", uiLocale);
      localStorage.setItem("appTargetLanguage", targetLanguage);
      // A store screenshot shows the app in use, not the "what's new" sheet a
      // first launch of a new version opens over it (src/lib/whatsNew.ts).
      localStorage.setItem("whatsNewSeenVersion", version);
    },
    { uiLocale: content.uiLocale, targetLanguage: content.targetLanguage, version: APP_VERSION },
  );
  const page = await context.newPage();
  page.setDefaultTimeout(20000);
  try {
    await baseRoutes(page);
    await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
    await page.addStyleTag({ content: STEADY_CSS });
    try {
      await scene.run(page, sceneContent);
    } catch (error) {
      // Keep what the screen showed when the scene gave up, for whoever reads the log.
      mkdirSync(path.join(here, "out", "failed"), { recursive: true });
      await page.screenshot({ path: path.join(here, "out", "failed", `${content.uiLocale}-${scene.id}.png`) }).catch(() => {});
      throw error;
    }
    await page.waitForTimeout(600);
    await page.evaluate(() => document.fonts.ready);
    return await page.screenshot();
  } finally {
    await context.close();
  }
}

async function compose(content, scene, sceneContent, raw) {
  const html = frameTemplate
    .replaceAll("{{font}}", content.font ?? "sans-serif")
    .replaceAll("{{accent}}", ACCENTS[(scene.order - 1) % ACCENTS.length])
    .replaceAll("{{kicker}}", escapeHtml(sceneContent.kicker ?? ""))
    .replaceAll("{{title}}", escapeHtml(sceneContent.title ?? ""))
    .replaceAll("{{subtitle}}", escapeHtml(sceneContent.subtitle ?? ""))
    .replaceAll("{{screen}}", `data:image/png;base64,${raw.toString("base64")}`);
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  try {
    await page.setContent(html, { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);
    return await page.screenshot();
  } finally {
    await page.close();
  }
}
