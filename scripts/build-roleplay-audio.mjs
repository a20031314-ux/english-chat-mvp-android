/**
 * Turn the roleplay sentence bank into audio files.
 *
 * A scripted line is the same for everyone, so it is synthesised once here and
 * served from a file rather than generated per learner. That is the whole reason
 * a roleplay costs almost nothing to run: the tutor's half of the conversation
 * is already recorded before anyone opens the app.
 *
 * Files are named after a hash of the voice and the text, which makes this
 * idempotent for free — an unchanged sentence lands on a name that already
 * exists and is skipped, and an edited one gets a new name, so nobody is left
 * hearing the old recording. Deleting orphans is a separate, deliberate step:
 * see --prune.
 *
 * Output goes under public/, so the audio ships inside the app and plays without
 * a network round trip. That holds while the library is small. A few hundred
 * scenarios of this would be a bundle nobody wants to download, and at that
 * point these move behind a URL instead — the paths already look like URLs for
 * that reason.
 *
 * Run: node --experimental-strip-types scripts/build-roleplay-audio.mjs
 *      --prune   also delete files no sentence points at any more
 *      --dry     say what would happen and synthesise nothing
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { SENTENCES } from "../src/lib/roleplay/catalog.ts";
import { sentenceAudioPath } from "../src/lib/roleplay/script.ts";
import { realtimeCallVoice } from "../src/lib/realtimeCallSession.ts";

const PRUNE = process.argv.includes("--prune");
const DRY = process.argv.includes("--dry");
const MODEL = process.env.OPENAI_TTS_MODEL ?? "gpt-4o-mini-tts";
const PUBLIC_DIR = "public";

/** Roughly what a second of speech costs, for the summary at the end. */
const USD_PER_1M_AUDIO_TOKENS = 12;
const AUDIO_TOKENS_PER_SECOND = 20;
/** Speech runs about this fast, which is only used to estimate the bill. */
const CHARS_PER_SECOND = 14;

function apiKey() {
  const fromEnv = process.env.OPENAI_API_KEY?.trim();
  if (fromEnv) return fromEnv;
  try {
    const line = readFileSync(".env.local", "utf8")
      .split(/\r?\n/)
      .find((row) => row.startsWith("OPENAI_API_KEY="));
    const value = line?.slice("OPENAI_API_KEY=".length).trim().replace(/^"|"$/g, "");
    if (value) return value;
  } catch {
    // fall through to the error below
  }
  console.error("OPENAI_API_KEY is not set, and .env.local does not carry one.");
  process.exit(2);
}

/**
 * The instruction the voice is given.
 *
 * These lines are a person doing their job, not an announcer reading copy. A
 * roleplay whose barista sounds like a documentary narrator teaches the learner
 * to expect a register they will never meet.
 */
function speechInstructions(role) {
  return `You are a ${role} speaking to a customer in person. Natural, unhurried, friendly. Do not perform or announce; just talk.`;
}

async function synthesize(key, text, voice, role) {
  const response = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      voice,
      input: text,
      response_format: "mp3",
      instructions: speechInstructions(role),
    }),
  });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`${response.status} ${detail.slice(0, 300)}`);
  }
  return Buffer.from(await response.arrayBuffer());
}

const wanted = new Map();
for (const [language, bank] of Object.entries(SENTENCES)) {
  const voice = realtimeCallVoice(language);
  for (const [id, sentence] of Object.entries(bank)) {
    const urlPath = sentenceAudioPath(sentence.text, voice, language);
    // Two ids carrying identical text land on one file, which is the point.
    wanted.set(urlPath, { id, language, voice, text: sentence.text });
  }
}

console.log(`${wanted.size} sentence(s) across ${Object.keys(SENTENCES).length} language(s), model ${MODEL}\n`);

let made = 0;
let skipped = 0;
let estimatedUsd = 0;
const key = DRY ? null : apiKey();

for (const [urlPath, sentence] of wanted) {
  const filePath = path.join(PUBLIC_DIR, urlPath.replace(/^\//, ""));
  if (existsSync(filePath)) {
    skipped += 1;
    continue;
  }
  const seconds = sentence.text.length / CHARS_PER_SECOND;
  estimatedUsd += (seconds * AUDIO_TOKENS_PER_SECOND * USD_PER_1M_AUDIO_TOKENS) / 1e6;
  if (DRY) {
    console.log(`would make  ${sentence.language}/${sentence.id}  "${sentence.text}"`);
    made += 1;
    continue;
  }
  mkdirSync(path.dirname(filePath), { recursive: true });
  // Role is not on the sentence — it belongs to the scenario — so the generic
  // one is used here. A sentence said by two different roles would want the
  // role in the hash; no sentence does that yet.
  const audio = await synthesize(key, sentence.text, sentence.voice, "shop assistant");
  writeFileSync(filePath, audio);
  console.log(`made  ${filePath}  (${audio.length} bytes)  "${sentence.text}"`);
  made += 1;
}

if (PRUNE) {
  const keep = new Set([...wanted.keys()].map((p) => path.join(PUBLIC_DIR, p.replace(/^\//, ""))));
  const root = path.join(PUBLIC_DIR, "roleplay", "audio");
  const walk = (dir) => {
    if (!existsSync(dir)) return;
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (!keep.has(full)) {
        if (DRY) console.log(`would delete  ${full}`);
        else {
          rmSync(full);
          console.log(`deleted  ${full}`);
        }
      }
    }
  };
  walk(root);
}

console.log(
  `\n${made} made, ${skipped} already present.` +
    (made > 0 ? `  Estimated ${estimatedUsd.toFixed(4)} USD.` : ""),
);
if (DRY) console.log("Dry run — nothing was written.");
