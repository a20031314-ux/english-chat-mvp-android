/**
 * Check fastlane/metadata/android before anything goes to Play.
 *
 * Play rejects an upload whose title, short description, full description or
 * release note runs over its limit, and it says so only after the bundle has
 * been built and the upload started. A missing language is worse: Play does not
 * complain at all, it quietly shows those users the default language. Both are
 * cheap to catch here, on the PR, before merging.
 *
 * Run: npm run check:store
 *      npm run check:store -- --version-code 76   (also require release notes)
 *
 * Exits 1 on any error. Missing languages are warnings, because a listing is
 * allowed to be partial; a missing release note for the versionCode being
 * shipped is an error, because that is the screen users actually read.
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const metadataDir = path.join(root, "fastlane", "metadata", "android");
const gradlePath = path.join(root, "android", "app", "build.gradle");

/**
 * Play locale codes for the 14 learning languages in src/lib/learningLanguages.ts.
 * Keep the two lists in step: a language the app teaches should have a listing
 * its speakers can read.
 */
const EXPECTED_LOCALES = [
  "en-US", "ko-KR", "ja-JP", "zh-CN", "es-ES", "fr-FR", "it-IT",
  "pt-PT", "ru-RU", "ar", "id", "vi", "th", "hi-IN",
];

/** Play's limits, in characters as Play counts them (code points). */
const LIMITS = {
  "title.txt": 30,
  "short_description.txt": 80,
  "full_description.txt": 4000,
  "video.txt": 500,
};
const CHANGELOG_LIMIT = 500;

/** Words Play's policy flags in listings, and claims we cannot back up. */
const BANNED = [
  /(?:^|\s)#1\b/,
  /\b(no\.\s?1|number one|best app)\b/i,
  /\bfree\b.*\bforever\b/i,
  /\b(download now|install now)\b/i,
];

const args = process.argv.slice(2);
const flagIndex = args.indexOf("--version-code");
let versionCode = flagIndex >= 0 ? args[flagIndex + 1] : undefined;
if (versionCode === "current") {
  versionCode = readFileSync(gradlePath, "utf8").match(/versionCode\s+(\d+)/)?.[1];
}

const errors = [];
const warnings = [];
const length = (text) => [...text.trim()].length;

if (!existsSync(metadataDir)) {
  console.log(
    "fastlane/metadata/android does not exist yet. Run the \"Play: pull listing\" workflow first.",
  );
  process.exit(0);
}

const locales = readdirSync(metadataDir).filter((name) =>
  statSync(path.join(metadataDir, name)).isDirectory(),
);

for (const locale of EXPECTED_LOCALES) {
  if (!locales.includes(locale)) warnings.push(`${locale}: no listing (Play will show the default language)`);
}

for (const locale of locales) {
  const dir = path.join(metadataDir, locale);
  for (const [file, limit] of Object.entries(LIMITS)) {
    const filePath = path.join(dir, file);
    if (!existsSync(filePath)) {
      if (file !== "video.txt") warnings.push(`${locale}/${file}: missing`);
      continue;
    }
    const text = readFileSync(filePath, "utf8");
    const n = length(text);
    if (n > limit) errors.push(`${locale}/${file}: ${n} characters, limit ${limit}`);
    if (file === "title.txt" && n === 0) errors.push(`${locale}/title.txt: empty`);
    for (const pattern of BANNED) {
      if (pattern.test(text)) errors.push(`${locale}/${file}: contains "${text.match(pattern)[0]}" (store policy)`);
    }
  }

  const changelogDir = path.join(dir, "changelogs");
  if (existsSync(changelogDir)) {
    for (const file of readdirSync(changelogDir)) {
      const n = length(readFileSync(path.join(changelogDir, file), "utf8"));
      if (n > CHANGELOG_LIMIT) errors.push(`${locale}/changelogs/${file}: ${n} characters, limit ${CHANGELOG_LIMIT}`);
    }
  }
  if (versionCode && !existsSync(path.join(changelogDir, `${versionCode}.txt`))) {
    errors.push(`${locale}/changelogs/${versionCode}.txt: missing release note for versionCode ${versionCode}`);
  }
}

for (const w of warnings) console.warn(`warn  ${w}`);
for (const e of errors) console.error(`error ${e}`);
console.log(
  `\n${locales.length} locale(s) checked, ${errors.length} error(s), ${warnings.length} warning(s).`,
);
process.exit(errors.length ? 1 : 0);
