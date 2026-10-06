/**
 * Translate the screen strings the eleven generated locales still show in
 * English, and say which ones remain.
 *
 * Ko, en and es are written by hand in copy.ts. The other eleven start from
 * locales/generated.json, and every string written after that file was made
 * reaches them as an English overlay — the paywall, the report dialog, the
 * call tab, the video library — and Italian and Russian came out of generation
 * almost entirely in English to begin with. check:languages passed throughout,
 * because a key filled with English is not a missing key. This is the check
 * that sees it, and the pass that fixes it.
 *
 * Only keys the code actually reads (`ui.<key>`) are translated; the file has
 * hundreds left over from retired screens. The English and the Korean are both
 * given, the Korean being the version written with the most care about tone.
 * Placeholders and line breaks are checked in code, then a second model reads
 * every translation for meaning and language, and what it rejects is asked
 * once more. The result is locales/overlays.json, applied last in copy.ts, so
 * anything still missing falls back to the English it shows today.
 *
 * Run: node --experimental-strip-types scripts/translate-ui-overlays.mjs [--check] [--only it,ru]
 *   --check  report what is still English, translate nothing (exit 1 if any)
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "src/lib/locales/overlays.json");
const args = process.argv.slice(2);
const CHECK = args.includes("--check");
const only = args.includes("--only") ? args[args.indexOf("--only") + 1].split(",") : null;
const MODEL = process.env.OPENAI_TRANSLATE_MODEL ?? "gpt-4.1";
const JUDGE = process.env.OPENAI_JUDGE_MODEL ?? "gpt-4.1";

/** copy.ts imports through "@/", which Node cannot resolve; read it through a copy that does not. */
async function loadCopy() {
  const dir = path.join(ROOT, "tmp", "copycheck");
  mkdirSync(dir, { recursive: true });
  const source = readFileSync(path.join(ROOT, "src/lib/copy.ts"), "utf8")
    .replace('"@/lib/locales/generated.json"', '"../../src/lib/locales/generated.json" with { type: "json" }')
    .replace('"@/lib/locales/overlays.json"', '"../../src/lib/locales/overlays.json" with { type: "json" }')
    .replace('"@/lib/learningLanguages"', '"../../src/lib/learningLanguages.ts"');
  const file = path.join(dir, `copy-${Date.now()}.ts`);
  writeFileSync(file, source);
  return (await import(`file://${file.replace(/\\/g, "/")}`)).copy;
}

function usedKeys() {
  const out = execFileSync("git", ["grep", "--untracked", "-hoE", "\\bui\\.[a-zA-Z]+", "--", "src/*.ts", "src/*.tsx"], { encoding: "utf8" });
  return new Set(out.split(/\r?\n/).filter(Boolean).map((line) => line.replace(/^ui\./, "")));
}

function stillEnglish(copy, used) {
  const en = copy.en;
  // A key the translator has answered is done even when its answer is the
  // English: "Chat" in French and "Premium" everywhere are words, not gaps.
  const decided = existsSync(OUT) ? JSON.parse(readFileSync(OUT, "utf8")) : {};
  const result = {};
  for (const locale of Object.keys(copy)) {
    if (["ko", "en", "es"].includes(locale) || (only && !only.includes(locale))) continue;
    result[locale] = [...used]
      .filter((key) => typeof en[key] === "string" && copy[locale][key] === en[key] && /[A-Za-z]{3}/.test(en[key]))
      .filter((key) => !(decided[locale] && key in decided[locale]))
      .sort();
  }
  return result;
}

function apiKey() {
  const fromEnv = process.env.OPENAI_API_KEY?.trim();
  if (fromEnv) return fromEnv;
  const line = readFileSync(".env.local", "utf8").split(/\r?\n/).find((l) => l.startsWith("OPENAI_API_KEY="));
  return line?.slice("OPENAI_API_KEY=".length).trim().replace(/^"|"$/g, "") ?? "";
}

async function askJson(model, system, user) {
  for (let attempt = 1; attempt <= 8; attempt += 1) {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey()}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model, temperature: 0.2, response_format: { type: "json_object" }, messages: [{ role: "system", content: system }, { role: "user", content: user }] }),
    });
    if (response.ok) return JSON.parse((await response.json()).choices[0].message.content);
    // A per-minute token limit is waited out, not reported: the sweep is
    // larger than one minute's allowance on purpose.
    if (response.status === 429 && attempt < 8) {
      await new Promise((r) => setTimeout(r, 20_000));
      continue;
    }
    if (response.status < 500 || attempt === 8) throw new Error(`OpenAI ${response.status}: ${(await response.text()).slice(0, 200)}`);
    await new Promise((r) => setTimeout(r, attempt * 1500));
  }
  return {};
}

const LANGUAGE_NAMES = { ja: "Japanese", zh: "Simplified Chinese", vi: "Vietnamese", fr: "French", it: "Italian", pt: "Portuguese (Brazil)", ru: "Russian", id: "Indonesian", ar: "Arabic", th: "Thai", hi: "Hindi" };

const PLACEHOLDER = /\{[a-zA-Z]+\}/g;

function problemsWith(english, translated) {
  const problems = [];
  if (typeof translated !== "string" || !translated.trim()) return ["empty"];
  const want = (english.match(PLACEHOLDER) ?? []).sort().join(",");
  const got = (translated.match(PLACEHOLDER) ?? []).sort().join(",");
  if (want !== got) problems.push(`placeholders ${got || "none"} instead of ${want || "none"}`);
  if ((english.match(/\n/g) ?? []).length !== (translated.match(/\n/g) ?? []).length) problems.push("line breaks differ");
  return problems;
}

function translateSystem(name) {
  return `You translate the interface of languagebank, a language-learning app (chat with a tutor that corrects you, practice calls with an AI character, learning from videos, a vocabulary book, a premium subscription with points), into ${name}.

For each key you get the English string and the Korean one. Write what a native ${name}-speaking product writer would put on that screen: natural, short, the register the app uses (friendly, plain, not formal-stiff). Not word for word.

Rules:
- Keep every {placeholder} exactly as written, and keep \\n line breaks in the same places.
- Keep "languagebank" and "Premium" as brand words if they are used as names; translate "premium" when it is an ordinary word.
- Points are the app's currency: translate "points"/"pts" with the ordinary word for points.
- Return a json object mapping each key to its ${name} string, and nothing else.`;
}

const JUDGE_SYSTEM = `You review interface translations for a language-learning app. For each key you see the English, the Korean, and the translation. Flag a key only if the translation is in the wrong language, changes the meaning, drops information, or would read as broken or machine-like on a phone screen. Return a json object {"rejected": {"<key>": "<one short reason>"}} — empty when everything is fine.`;

async function translateLocale(locale, keys, copy) {
  const name = LANGUAGE_NAMES[locale];
  const result = {};
  const chunks = [];
  for (let i = 0; i < keys.length; i += 40) chunks.push(keys.slice(i, i + 40));
  for (const chunk of chunks) {
    const payload = Object.fromEntries(chunk.map((key) => [key, { en: copy.en[key], ko: copy.ko[key] }]));
    const answer = await askJson(MODEL, translateSystem(name), JSON.stringify(payload, null, 1));
    for (const key of chunk) result[key] = answer[key];
  }
  // Checked in code, then by a reader, and asked once more for what fails either.
  const review = Object.fromEntries(keys.filter((k) => !problemsWith(copy.en[k], result[k]).length).map((k) => [k, { en: copy.en[k], ko: copy.ko[k], translation: result[k] }]));
  const { rejected = {} } = await askJson(JUDGE, JUDGE_SYSTEM, `Language: ${name}\n${JSON.stringify(review, null, 1)}`);
  const redo = keys.filter((k) => problemsWith(copy.en[k], result[k]).length || rejected[k]);
  if (redo.length) {
    const notes = Object.fromEntries(redo.map((k) => [k, { en: copy.en[k], ko: copy.ko[k], previous: result[k], problem: problemsWith(copy.en[k], result[k]).join("; ") || rejected[k] }]));
    const answer = await askJson(MODEL, `${translateSystem(name)}\nSome of these were rejected; "problem" says why. Fix exactly that.`, JSON.stringify(notes, null, 1));
    for (const k of redo) result[k] = answer[k];
  }
  const kept = {};
  const dropped = [];
  for (const k of keys) {
    if (problemsWith(copy.en[k], result[k]).length) dropped.push(k);
    else kept[k] = result[k];
  }
  return { kept, dropped, rejectedOnce: Object.keys(rejected).length, redone: redo.length };
}

const copy = await loadCopy();
const pending = stillEnglish(copy, usedKeys());
const total = Object.values(pending).reduce((sum, keys) => sum + keys.length, 0);
console.log("Still English, keys the code reads:", Object.fromEntries(Object.entries(pending).map(([l, k]) => [l, k.length])));
if (CHECK) {
  process.exitCode = total > 0 ? 1 : 0;
} else {
  const existing = existsSync(OUT) ? JSON.parse(readFileSync(OUT, "utf8")) : {};
  for (const [locale, keys] of Object.entries(pending)) {
    if (keys.length === 0) continue;
    const { kept, dropped, rejectedOnce, redone } = await translateLocale(locale, keys, copy);
    existing[locale] = { ...(existing[locale] ?? {}), ...kept };
    writeFileSync(OUT, `${JSON.stringify(existing, null, 2)}\n`);
    console.log(`${locale}: ${Object.keys(kept).length} translated, ${rejectedOnce} rejected by the reader and redone (${redone} redone in all), ${dropped.length} left in English${dropped.length ? `: ${dropped.join(", ")}` : ""}`);
  }
}
