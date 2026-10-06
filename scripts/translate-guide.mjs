/**
 * Translate the how-to guide (src/lib/guide/content.ts) into every interface
 * language other than Korean and English, into src/lib/guide/translations.json.
 *
 * The guide is served by /api/guide, so a new translation reaches phones on
 * push. Run this whenever content.ts changes; it retranslates only languages
 * whose stored copy was made from an older GUIDE_VERSION, or all with --all.
 *
 * Checked in code before it is kept: the same tabs, the same number of
 * sections and paragraphs, and every {ui:<key>} button token carried over
 * untouched — a token the translator rewrote would print a wrong button name.
 * A language that fails is asked once more, then left out (and served English).
 *
 * Run: node --experimental-strip-types scripts/translate-guide.mjs [--all] [--only hi,ru]
 */
import { readFileSync, writeFileSync } from "node:fs";
import { GUIDE_EN, GUIDE_KO, GUIDE_VERSION } from "../src/lib/guide/content.ts";

const OUT = "src/lib/guide/translations.json";
const args = process.argv.slice(2);
const all = args.includes("--all");
const only = args.includes("--only") ? args[args.indexOf("--only") + 1].split(",") : null;
const MODEL = process.env.OPENAI_TRANSLATE_MODEL ?? "gpt-4.1";

const LANGUAGES = { es: "Spanish", ja: "Japanese", zh: "Simplified Chinese", vi: "Vietnamese", fr: "French", it: "Italian", pt: "Portuguese (Brazil)", ru: "Russian", id: "Indonesian", ar: "Arabic", th: "Thai", hi: "Hindi" };

function apiKey() {
  const fromEnv = process.env.OPENAI_API_KEY?.trim();
  if (fromEnv) return fromEnv;
  const line = readFileSync(".env.local", "utf8").split(/\r?\n/).find((l) => l.startsWith("OPENAI_API_KEY="));
  return line?.slice("OPENAI_API_KEY=".length).trim().replace(/^"|"$/g, "") ?? "";
}

async function askJson(system, user) {
  for (let attempt = 1; attempt <= 8; attempt += 1) {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey()}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: MODEL, temperature: 0.2, response_format: { type: "json_object" }, messages: [{ role: "system", content: system }, { role: "user", content: user }] }),
    });
    if (response.ok) return JSON.parse((await response.json()).choices[0].message.content);
    if (response.status === 429 && attempt < 8) {
      await new Promise((r) => setTimeout(r, 20_000));
      continue;
    }
    throw new Error(`OpenAI ${response.status}: ${(await response.text()).slice(0, 200)}`);
  }
  return {};
}

const tokens = (text) => (text.match(/\{ui:[a-zA-Z]+\}/g) ?? []).sort().join(",");

function problems(translated) {
  const out = [];
  for (const [tab, page] of Object.entries(GUIDE_EN)) {
    const got = translated?.[tab];
    if (!got || typeof got.title !== "string" || !Array.isArray(got.sections)) {
      out.push(`${tab}: missing`);
      continue;
    }
    if (got.sections.length !== page.sections.length) out.push(`${tab}: ${got.sections.length} sections, not ${page.sections.length}`);
    page.sections.forEach((section, index) => {
      const other = got.sections[index];
      if (!other) return;
      if (tokens(other.heading) !== tokens(section.heading)) out.push(`${tab}.${index} heading tokens`);
      if (!Array.isArray(other.body) || other.body.length !== section.body.length) {
        out.push(`${tab}.${index}: ${other.body?.length} paragraphs, not ${section.body.length}`);
        return;
      }
      section.body.forEach((paragraph, p) => {
        if (tokens(other.body[p]) !== tokens(paragraph)) out.push(`${tab}.${index}.${p} button tokens changed`);
      });
    });
  }
  return out;
}

function system(name) {
  return `You translate the in-app how-to guide of languagebank, a language-learning app, into ${name}.

You get the English guide and the Korean one, with the same structure. Write the ${name} a native product writer would put in an app's help screen: short, friendly, plain. Not word for word.

Hard rules:
- Keep exactly the same JSON structure: the same tabs, the same number of sections, the same number of paragraphs in each body, in the same order.
- Every {ui:something} is the name of a button, filled in by the app. Copy each one exactly, unchanged, in the paragraph or heading where it appears. Never translate or remove it, and never add one.
- Numbers (10 messages, 20 points, 100 minutes, 5 minutes, 3 videos, 80 points, 15 minutes) stay the same.
Return only the translated json object.`;
}

const stored = (() => {
  try {
    return JSON.parse(readFileSync(OUT, "utf8"));
  } catch {
    return {};
  }
})();

for (const [code, name] of Object.entries(LANGUAGES)) {
  if (only && !only.includes(code)) continue;
  if (!all && stored[code]?._version === GUIDE_VERSION) continue;
  const source = JSON.stringify({ english: GUIDE_EN, korean: GUIDE_KO });
  let translated = await askJson(system(name), source);
  let found = problems(translated);
  if (found.length) {
    translated = await askJson(`${system(name)}\nThe previous attempt broke these rules: ${found.join("; ")}. Fix them.`, source);
    found = problems(translated);
  }
  if (found.length) {
    console.log(`${code}: left out (${found.slice(0, 4).join("; ")})`);
    continue;
  }
  stored[code] = { ...translated, _version: GUIDE_VERSION };
  writeFileSync(OUT, `${JSON.stringify(stored, null, 2)}\n`);
  console.log(`${code}: ok`);
}
