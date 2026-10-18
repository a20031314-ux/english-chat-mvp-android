/**
 * Play 그래픽 이미지(1024×500) — feature.html을 그대로 찍는다(2026-10-19).
 * 화면 그림은 앱에서 찍은 캡처(public/guide·public/whats-new)와 앱 아이콘을 복사해 쓴다.
 * fastlane/metadata에 넣지 않는다: 지금 Play의 그래픽이 저장소에 없어서, 넣으면 업로드가 덮어쓴다.
 * Run: node store-shots/feature/build.mjs  →  store-shots/feature/featureGraphic.png
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const dir = path.resolve("store-shots/feature");
const work = path.resolve("tmp/feature");
fs.mkdirSync(work, { recursive: true });
const shots = {
  "chat-correct": "public/guide/en/chat-correct.webp",
  growth: "public/guide/en/growth.webp",
  board: "public/whats-new/2.69/en/board.webp",
};
for (const [name, file] of Object.entries(shots)) await sharp(file).png().toFile(path.join(work, `${name}.png`));
fs.copyFileSync("android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png", path.join(work, "icon.png"));
fs.copyFileSync(path.join(dir, "feature.html"), path.join(work, "feature.html"));
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || "playwright");
const browser = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
const page = await browser.newPage({ viewport: { width: 1024, height: 500 }, deviceScaleFactor: 1 });
await page.goto("file://" + path.join(work, "feature.html"));
await page.waitForTimeout(800);
await page.screenshot({ path: path.join(dir, "featureGraphic.png") });
await browser.close();
console.log("store-shots/feature/featureGraphic.png");
