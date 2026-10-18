/**
 * iOS 프로젝트(ios/App)를 저장소 기준에 맞춘다. `npm run build:ios`가 부르고,
 * 여러 번 돌려도 같은 결과(이미 들어간 건 건너뜀).
 *
 * 1. 버전: android/app/build.gradle의 versionName·versionCode →
 *    MARKETING_VERSION·CURRENT_PROJECT_VERSION. 버전은 저장소에서만 올리고
 *    (hub/RULES.md) iOS는 따라간다 — Xcode에서 손으로 바꾸지 않는다.
 * 2. 권한 안내 문구: scripts/ios-permission-strings.json(14개 언어) →
 *    ios/App/App/<언어>.lproj/InfoPlist.strings, Info.plist엔 영어 기본값,
 *    Xcode 프로젝트에 InfoPlist.strings 묶음과 언어 등록.
 * 3. Info.plist 고정 값: 암호화 신고(표준 HTTPS만 → false).
 * 4. 번들 ID: 환경 변수 IOS_BUNDLE_ID가 있으면 그 값(GitHub 저장소 변수), 없으면
 *    capacitor.config.ts의 appId. App Store에 한 번 올리면 못 바꾸므로 사람이 정한다.
 */
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const appDir = path.join(root, "ios", "App", "App");
const pbxPath = path.join(root, "ios", "App", "App.xcodeproj", "project.pbxproj");
const plistPath = path.join(appDir, "Info.plist");

if (!existsSync(pbxPath)) {
  console.error("ios/ 프로젝트가 없습니다. `npx cap add ios`를 먼저 하세요.");
  process.exit(1);
}

const gradle = readFileSync(path.join(root, "android", "app", "build.gradle"), "utf8");
const versionName = gradle.match(/versionName\s+"([^"]+)"/)?.[1];
const versionCode = gradle.match(/versionCode\s+(\d+)/)?.[1];
if (!versionName || !versionCode) {
  console.error("build.gradle에서 versionName/versionCode를 읽지 못했습니다.");
  process.exit(1);
}

const strings = JSON.parse(
  readFileSync(path.join(root, "scripts", "ios-permission-strings.json"), "utf8"),
);
const languages = Object.keys(strings).filter((key) => !key.startsWith("_"));

// ── 2. 언어별 InfoPlist.strings ────────────────────────────────────────────
const escape = (value) => value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
for (const lang of languages) {
  const dir = path.join(appDir, `${lang}.lproj`);
  mkdirSync(dir, { recursive: true });
  const body = Object.entries(strings[lang])
    .map(([key, value]) => `"${key}" = "${escape(value)}";`)
    .join("\n");
  writeFileSync(path.join(dir, "InfoPlist.strings"), `/* scripts/ios-project.mjs가 만듦 — 직접 고치지 말 것 */\n${body}\n`);
}

// ── Info.plist ────────────────────────────────────────────────────────────
let plist = readFileSync(plistPath, "utf8");
function setPlistString(key, value) {
  const pattern = new RegExp(`(<key>${key}</key>\\s*<string>)[^<]*(</string>)`);
  if (pattern.test(plist)) {
    plist = plist.replace(pattern, `$1${value}$2`);
  } else {
    plist = plist.replace(/<\/dict>\s*<\/plist>\s*$/, `\t<key>${key}</key>\n\t<string>${value}</string>\n</dict>\n</plist>\n`);
  }
}
function setPlistBool(key, value) {
  const pattern = new RegExp(`(<key>${key}</key>\\s*)<(true|false)/>`);
  if (pattern.test(plist)) {
    plist = plist.replace(pattern, `$1<${value}/>`);
  } else {
    plist = plist.replace(/<\/dict>\s*<\/plist>\s*$/, `\t<key>${key}</key>\n\t<${value}/>\n</dict>\n</plist>\n`);
  }
}
const xml = (value) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
for (const [key, value] of Object.entries(strings.en)) setPlistString(key, xml(value));
setPlistBool("ITSAppUsesNonExemptEncryption", "false");
writeFileSync(plistPath, plist);

// ── Xcode 프로젝트 ────────────────────────────────────────────────────────
let pbx = readFileSync(pbxPath, "utf8");
const id = (seed) => createHash("md5").update(`languagebank-ios:${seed}`).digest("hex").slice(0, 24).toUpperCase();

// 4. 번들 ID
const bundleId = process.env.IOS_BUNDLE_ID?.trim();
if (bundleId) {
  if (!/^[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)+$/.test(bundleId)) {
    console.error(`IOS_BUNDLE_ID 형식이 이상합니다: ${bundleId}`);
    process.exit(1);
  }
  pbx = pbx.replace(/PRODUCT_BUNDLE_IDENTIFIER = [^;]+;/g, `PRODUCT_BUNDLE_IDENTIFIER = ${bundleId};`);
}

// 1. 버전
pbx = pbx.replace(/MARKETING_VERSION = [^;]+;/g, `MARKETING_VERSION = ${versionName};`);
pbx = pbx.replace(/CURRENT_PROJECT_VERSION = [^;]+;/g, `CURRENT_PROJECT_VERSION = ${versionCode};`);

const groupId = id("InfoPlist.strings");
const buildFileId = id("InfoPlist.strings in Resources");
const fileRefId = (lang) => id(`InfoPlist.strings:${lang}`);

function insertBefore(marker, text) {
  if (!pbx.includes(marker)) throw new Error(`project.pbxproj에서 "${marker}"를 못 찾음`);
  pbx = pbx.replace(marker, `${text}${marker}`);
}

if (!pbx.includes(buildFileId)) {
  insertBefore(
    "/* End PBXBuildFile section */",
    `\t\t${buildFileId} /* InfoPlist.strings in Resources */ = {isa = PBXBuildFile; fileRef = ${groupId} /* InfoPlist.strings */; };\n`,
  );
  // App 그룹 안(Info.plist 옆)과 Resources 단계에 묶음을 넣는다.
  pbx = pbx.replace(
    /(\t+)(504EC3131FED79650016851F \/\* Info\.plist \*\/,\n)/,
    `$1$2$1${groupId} /* InfoPlist.strings */,\n`,
  );
  pbx = pbx.replace(
    /(isa = PBXResourcesBuildPhase;\s*buildActionMask = \d+;\s*files = \(\n)/,
    `$1\t\t\t\t${buildFileId} /* InfoPlist.strings in Resources */,\n`,
  );
}

for (const lang of languages) {
  const ref = fileRefId(lang);
  if (pbx.includes(ref)) continue;
  insertBefore(
    "/* End PBXFileReference section */",
    `\t\t${ref} /* ${lang} */ = {isa = PBXFileReference; lastKnownFileType = text.plist.strings; name = ${lang}; path = ${lang}.lproj/InfoPlist.strings; sourceTree = "<group>"; };\n`,
  );
}

const children = languages.map((lang) => `\t\t\t\t${fileRefId(lang)} /* ${lang} */,\n`).join("");
const variantGroup =
  `\t\t${groupId} /* InfoPlist.strings */ = {\n\t\t\tisa = PBXVariantGroup;\n\t\t\tchildren = (\n${children}\t\t\t);\n` +
  `\t\t\tname = InfoPlist.strings;\n\t\t\tsourceTree = "<group>";\n\t\t};\n`;
const existingGroup = new RegExp(`\\t\\t${groupId} /\\* InfoPlist\\.strings \\*/ = \\{\\n[\\s\\S]*?\\n\\t\\t\\};\\n`);
if (existingGroup.test(pbx)) pbx = pbx.replace(existingGroup, variantGroup);
else insertBefore("/* End PBXVariantGroup section */", variantGroup);

// 알려진 언어(knownRegions)
pbx = pbx.replace(/knownRegions = \(([\s\S]*?)\);/, (_match, inner) => {
  const have = new Set(inner.split(",").map((item) => item.trim().replace(/"/g, "")).filter(Boolean));
  for (const lang of languages) have.add(lang);
  const list = [...have].map((item) => `\t\t\t\t${/[^A-Za-z0-9_]/.test(item) ? `"${item}"` : item},\n`).join("");
  return `knownRegions = (\n${list}\t\t\t);`;
});

writeFileSync(pbxPath, pbx);
const shownBundle = pbx.match(/PRODUCT_BUNDLE_IDENTIFIER = ([^;]+);/)?.[1] ?? "?";
console.log(`iOS 프로젝트 맞춤: 버전 ${versionName} (${versionCode}), 번들 ID ${shownBundle}, 권한 문구 ${languages.length}개 언어.`);
