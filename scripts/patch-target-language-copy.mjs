/**
 * One-shot: replace learning-language hardcodes in copy packs with {targetLanguage}.
 * Run: node scripts/patch-target-language-copy.mjs
 */
import fs from "fs";
import path from "path";

const root = path.resolve("src/lib");

const SKIP_KEYS = new Set(["languageEnglish"]);

const REPLACERS = {
  ko: [[/영어/g, "{targetLanguage}"]],
  en: [[/\bEnglish\b/g, "{targetLanguage}"]],
  es: [
    [/inglés/gi, "{targetLanguage}"],
    [/ingles/gi, "{targetLanguage}"],
  ],
  ja: [[/英語/g, "{targetLanguage}"]],
  zh: [[/英语/g, "{targetLanguage}"]],
  vi: [
    [/tiếng Anh/gi, "{targetLanguage}"],
    [/Tiếng Anh/g, "{targetLanguage}"],
  ],
  fr: [
    [/anglais/gi, "{targetLanguage}"],
  ],
  pt: [
    [/inglês/gi, "{targetLanguage}"],
    [/ingles/gi, "{targetLanguage}"],
  ],
  id: [
    [/bahasa Inggris/gi, "{targetLanguage}"],
    [/Inggris/g, "{targetLanguage}"],
  ],
};

function patchObject(obj, locale) {
  const rules = REPLACERS[locale];
  if (!rules || !obj || typeof obj !== "object") return 0;
  let count = 0;
  for (const [key, value] of Object.entries(obj)) {
    if (SKIP_KEYS.has(key)) continue;
    if (typeof value !== "string") continue;
    if (value.includes("{targetLanguage}")) continue;
    let next = value;
    for (const [re, rep] of rules) {
      next = next.replace(re, rep);
    }
    if (next !== value) {
      obj[key] = next;
      count += 1;
    }
  }
  return count;
}

// Patch generated.json
const genPath = path.join(root, "locales/generated.json");
const generated = JSON.parse(fs.readFileSync(genPath, "utf8"));
let genCount = 0;
for (const locale of Object.keys(generated)) {
  genCount += patchObject(generated[locale], locale);
}
fs.writeFileSync(genPath, JSON.stringify(generated, null, 2) + "\n");
console.log("generated.json patched keys:", genCount);

// Patch handwritten locales inside copy.ts via careful string replace on values
const copyPath = path.join(root, "copy.ts");
let copyText = fs.readFileSync(copyPath, "utf8");

function patchCopyLocaleBlock(locale, openMarker) {
  const rules = REPLACERS[locale];
  if (!rules) return 0;
  const start = copyText.indexOf(openMarker);
  if (start < 0) {
    console.warn("block not found", locale);
    return 0;
  }
  // End at next top-level locale key or generatedLocales
  const rest = copyText.slice(start);
  const endMatch = rest.search(
    /\n  (?:en|es|ja|zh|vi|fr|pt|id):\s|(?:\n  ja: generatedLocales)/,
  );
  const end = endMatch < 0 ? copyText.length : start + endMatch;
  let block = copyText.slice(start, end);
  let count = 0;

  block = block.replace(
    /(\w+)\s*:\s*"((?:\\.|[^"\\])*)"/g,
    (full, key, value) => {
      if (SKIP_KEYS.has(key)) return full;
      if (value.includes("{targetLanguage}")) return full;
      let next = value;
      for (const [re, rep] of rules) {
        next = next.replace(re, rep);
      }
      // unescape for replace then re-escape quotes
      if (next === value) return full;
      count += 1;
      const escaped = next.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
      // value in source may already use \n etc — we operated on raw source substring
      return `${key}: "${next}"`;
    },
  );

  // Fix: the regex replacement broke escaped sequences because `value` in regex
  // already contains literal backslash-n from source. Returning next as-is from
  // the capture is correct for source text. Don't double-escape.
  // Redo more carefully:
  return { start, end, block, count };
}

// Simpler approach: line-by-line for ko/en/es value strings
function patchCopyTextForLocale(locale, blockStartRegex, blockEndRegex) {
  const rules = REPLACERS[locale];
  const start = copyText.search(blockStartRegex);
  if (start < 0) return 0;
  const from = copyText.slice(start);
  const relativeEnd = from.search(blockEndRegex);
  const end = relativeEnd < 0 ? copyText.length : start + relativeEnd;
  let block = copyText.slice(start, end);
  let count = 0;
  block = block.replace(
    /^(\s*(?:\/\/.*)?|(\s*)(\w+):\s*)"((?:\\.|[^"\\])*)"(,?)$/gm,
    (full, prefix, _indent, key, value, comma = "") => {
      if (!key || SKIP_KEYS.has(key)) return full;
      if (value.includes("{targetLanguage}")) return full;
      // Decode simple escapes for matching
      const decoded = value
        .replace(/\\n/g, "\n")
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, "\\");
      let nextDecoded = decoded;
      for (const [re, rep] of rules) {
        nextDecoded = nextDecoded.replace(re, rep);
      }
      if (nextDecoded === decoded) return full;
      count += 1;
      const encoded = nextDecoded
        .replace(/\\/g, "\\\\")
        .replace(/"/g, '\\"')
        .replace(/\n/g, "\\n");
      return `${prefix}"${encoded}"${comma}`;
    },
  );
  copyText = copyText.slice(0, start) + block + copyText.slice(end);
  return count;
}

const koCount = patchCopyTextForLocale(
  "ko",
  /^  ko:\s*\{/m,
  /^  en:\s*\{/m,
);
const enCount = patchCopyTextForLocale(
  "en",
  /^  en:\s*\{/m,
  /^  es:\s*\{/m,
);
const esCount = patchCopyTextForLocale(
  "es",
  /^  es:\s*\{/m,
  /^  ja:\s/m,
);

fs.writeFileSync(copyPath, copyText);
console.log("copy.ts patched", { koCount, enCount, esCount });
