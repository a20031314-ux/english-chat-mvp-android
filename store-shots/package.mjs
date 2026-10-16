/**
 * Put one screenshot run into folders a person can upload to Play by hand,
 * and say which screens changed since the last run.
 *
 * Reads what capture.mjs wrote (fastlane/metadata/android/<locale>/images/
 * phoneScreenshots/) and what canvas/render.mjs wrote (store-shots/out/canvas/),
 * and writes store-shots/out/upload/:
 *
 *   0_default-english/  the default listing (app captures)
 *   1_korea/ … 5_india/ one Play custom listing each: eight images, numbered in
 *                       upload order (select all in the folder, add as assets)
 *   compare/            before | after for every screen that changed
 *   CHANGES.md          the same list in words (also the job summary in CI)
 *
 * Folder names are ASCII on purpose: Korean names came out garbled when the
 * zip was opened on Windows.
 *
 * "Before" is --previous <dir> (the last run's upload/ folder, which the
 * workflow downloads) when given, otherwise the images committed in git.
 * Nothing here uploads anywhere.
 *
 * Run: node store-shots/package.mjs [--previous <dir>]
 */
import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, "..");
const metadata = path.join(root, "fastlane", "metadata", "android");
const canvasDir = path.join(here, "out", "canvas");
const out = path.join(here, "out", "upload");
const args = process.argv.slice(2);
const previous = args.includes("--previous") ? args[args.indexOf("--previous") + 1] : undefined;

/**
 * Which images go to which listing, in upload order. "app:" is a capture of
 * the running app (follows every app change), "canvas:" a designed mockup
 * (changes only when store-shots/canvas/ does). Eight is Play's limit.
 */
const LISTINGS = [
  { folder: "0_default-english", locale: "en-US", images: ["app:01-map", "app:02-chat", "app:03-sentence"] },
  ...[
    ["1_korea", "ko-KR", "1_한국"],
    ["2_japan", "ja-JP", "2_일본"],
    ["3_china", "zh-CN", "3_중국"],
    ["4_spain", "es-ES", "4_스페인"],
    ["5_india", "hi-IN", "5_인도"],
  ].map(([folder, locale, canvas]) => ({
    folder,
    locale,
    canvas,
    images: [
      "app:01-map",
      "app:02-chat",
      "canvas:02-where-stuck",
      "canvas:03-gentle-hint",
      "app:03-sentence",
      "canvas:06-video-split",
      "canvas:07-video-save",
      "canvas:05-languages",
    ],
  })),
];

function source(listing, image) {
  const [kind, name] = image.split(":");
  return kind === "app"
    ? path.join(metadata, listing.locale, "images", "phoneScreenshots", `${name}.png`)
    : path.join(canvasDir, listing.canvas, `${name}.png`);
}

/** The same image from the last run, or from git when there is no last run. */
function before(listing, file, image) {
  if (previous) {
    const prev = path.join(previous, listing.folder, file);
    return existsSync(prev) ? readFileSync(prev) : null;
  }
  const [kind, name] = image.split(":");
  if (kind !== "app") return null; // canvas output is not committed
  try {
    return execFileSync("git", ["show", `HEAD:fastlane/metadata/android/${listing.locale}/images/phoneScreenshots/${name}.png`], {
      cwd: root,
      maxBuffer: 64 << 20,
    });
  } catch {
    return null;
  }
}

rmSync(out, { recursive: true, force: true });
const changed = [];
const missing = [];
for (const listing of LISTINGS) {
  const dir = path.join(out, listing.folder);
  mkdirSync(dir, { recursive: true });
  listing.images.forEach((image, i) => {
    const from = source(listing, image);
    const file = `${i + 1}-${image.split(":")[1].replace(/^\d+-/, "")}.png`;
    if (!existsSync(from)) {
      missing.push(`${listing.folder}/${file}`);
      return;
    }
    copyFileSync(from, path.join(dir, file));
    const old = before(listing, file, image);
    if (!old || !old.equals(readFileSync(from))) changed.push({ listing, file, old, now: from, isNew: !old });
  });
}

// One before | after picture per changed screen, so the change can be seen
// without opening two files side by side.
if (changed.length) {
  const compare = path.join(out, "compare");
  mkdirSync(compare, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1140, height: 1040 } });
  const uri = (buf) => `data:image/png;base64,${buf.toString("base64")}`;
  for (const c of changed) {
    const cell = (label, buf) =>
      `<figure><figcaption>${label}</figcaption>${buf ? `<img src="${uri(buf)}">` : `<div class="none">—</div>`}</figure>`;
    await page.setContent(
      `<!doctype html><meta charset="utf-8"><style>
        body{margin:0;background:#202124;color:#eee;font:20px sans-serif;display:flex;gap:20px;padding:20px}
        figure{margin:0}figcaption{margin-bottom:8px}img,.none{width:540px;height:960px;display:block}
        .none{display:grid;place-items:center;background:#111;font-size:60px}
      </style>${cell("before", c.old)}${cell(`after — ${c.listing.folder}/${c.file}`, readFileSync(c.now))}`,
      { waitUntil: "load" },
    );
    await page.screenshot({ path: path.join(compare, `${c.listing.folder}--${c.file}`) });
  }
  await browser.close();
}

const lines = [
  "# Store screenshots",
  "",
  `Compared with ${previous ? "the last run" : "the images committed in git"}.`,
  "",
  changed.length ? `**${changed.length} changed** (before | after in \`compare/\`):` : "**Nothing changed.**",
  ...changed.map((c) => `- ${c.listing.folder}/${c.file}${c.isNew ? " (new)" : ""}`),
  ...(missing.length ? ["", `**Missing** (not produced this run):`, ...missing.map((m) => `- ${m}`)] : []),
  "",
  "Custom listings (1_korea … 5_india) are uploaded by hand in Play Console: open the listing, delete the old images, select all eight in the folder.",
];
writeFileSync(path.join(out, "CHANGES.md"), `${lines.join("\n")}\n`);
console.log(lines.join("\n"));
process.exit(missing.length ? 1 : 0);
