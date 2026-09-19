/**
 * Put every line the app will speak into the edge cache, before a release.
 *
 * A line spoken in a scene's voice is cached at the edge by its URL, and the
 * cache is shared by everybody: measured, a line warmed from one machine came
 * back to a request with a different origin, a different user id and a
 * different user agent in a fifth of a second. So the first learner to reach a
 * line need not be the one who pays a second and a half for it.
 *
 * Two things about that cache decide the shape of this script.
 *
 * It is emptied by every deployment. Warmed lines measured before a push came
 * back cold after it, so there is no point warming on a schedule or after every
 * commit — this belongs to cutting a release, next to building the audio and
 * the bundle, and that is where package.json puts it.
 *
 * And its key is the URL as a string, not as a request. Measured: the same
 * three parameters in a different order missed. So the URL here is built the
 * way ttsPlayer.ts builds it, through the same spoken-form function and the
 * same parameter order, because a warmer that is one character off warms
 * nothing while reporting success.
 *
 * Only lines with no recording of their own are warmed. A sentence that ships
 * as a file in the APK is played from the file and never asks the server, so
 * warming it would be paying for audio nobody will fetch.
 *
 * Run: npm run roleplay:warm            (against the deployed API)
 *      npm run roleplay:warm -- --dry   (say what would be warmed)
 */
import { existsSync } from "node:fs";
import path from "node:path";
import { SCENARIOS, SENTENCES } from "../src/lib/roleplay/catalog.ts";
import { scenarioSentenceIds, sentenceAudioPath } from "../src/lib/roleplay/script.ts";
import { learningLanguageSpeechTag } from "../src/lib/learningLanguages.ts";
import { spokenFormForTts } from "../src/lib/speech.ts";

const DRY = process.argv.includes("--dry");
const API = (process.env.WARM_API_BASE ?? "https://english-chat-mvp.vercel.app").replace(
  /\/+$/,
  "",
);
/** Gentle: this is a cold cache asking a speech model for everything at once. */
const AT_A_TIME = 4;

/** Roughly what one line costs to synthesise, for the summary. */
const USD_PER_LINE = 0.0008;

/**
 * Every line that will be asked of the server, and the URL it will be asked by.
 *
 * Built from the scenarios rather than the bank, because a sentence's voice
 * belongs to the scene saying it — the same reasoning the audio builder uses,
 * and the reason the two agree about which file would exist.
 */
function linesWanted() {
  const wanted = new Map();
  for (const scenario of SCENARIOS) {
    const bank = SENTENCES[scenario.language] ?? {};
    // Everything the scene can say, nodes and repertoire alike — a repertoire
    // line is exactly the case this exists for: in the bank, not in the APK.
    for (const id of scenarioSentenceIds(scenario)) {
      const sentence = bank[id];
      if (!sentence) continue;

      // Shipped as a file: played from the APK, never fetched.
      const filePath = path.join(
        "public",
        sentenceAudioPath(sentence.text, scenario.voice, scenario.language).replace(/^\//, ""),
      );
      if (existsSync(filePath)) continue;

      const lang = learningLanguageSpeechTag(scenario.language);
      const spoken = spokenFormForTts(sentence.text, lang);
      if (!spoken) continue;
      // Exactly as ttsPlayer.ts builds it. Order included: it is part of the key.
      const query = new URLSearchParams({ text: spoken, lang, voice: scenario.voice });
      const url = `${API}/api/tts?${query.toString()}`;
      if (wanted.has(url)) continue;
      wanted.set(url, { id, language: scenario.language, voice: scenario.voice, text: sentence.text });
    }
  }
  return wanted;
}

async function warm(url) {
  const response = await fetch(url);
  const state = response.headers.get("x-vercel-cache") ?? "unknown";
  // Drained rather than ignored: an unread body can leave the connection open,
  // and the point is to have the edge store the whole answer.
  await response.arrayBuffer();
  return { ok: response.ok, state };
}

const wanted = linesWanted();
console.log(
  `${wanted.size} line(s) without a recording of their own, across ${SCENARIOS.length} scenario(s)`,
);
console.log(`against ${API}\n`);

if (wanted.size === 0) {
  console.log(
    "Nothing to warm: every line a scenario says ships as a file. That is the\n" +
      "cheapest case — a file plays with no request at all — and this script\n" +
      "becomes useful when the bank holds sentences that do not ship as audio.",
  );
  process.exit(0);
}

if (DRY) {
  for (const [url, line] of wanted) {
    console.log(`would warm  ${line.language}/${line.id}  "${line.text.slice(0, 48)}"`);
    console.log(`            ${url.slice(0, 120)}`);
  }
  console.log(`\n${wanted.size} would be warmed. Estimated ${(wanted.size * USD_PER_LINE).toFixed(4)} USD.`);
  process.exit(0);
}

const entries = [...wanted.entries()];
const started = Date.now();
let warmed = 0;
let already = 0;
let failed = 0;

for (let at = 0; at < entries.length; at += AT_A_TIME) {
  const batch = entries.slice(at, at + AT_A_TIME);
  const results = await Promise.all(batch.map(([url]) => warm(url).catch(() => null)));
  results.forEach((result, index) => {
    const line = batch[index][1];
    if (!result?.ok) {
      failed += 1;
      console.log(`failed   ${line.language}/${line.id}`);
      return;
    }
    if (result.state === "HIT") already += 1;
    else warmed += 1;
  });
  process.stdout.write(`\r  ${Math.min(at + AT_A_TIME, entries.length)}/${entries.length}`);
}

const seconds = Math.round((Date.now() - started) / 1000);
console.log(`\n\n${warmed} synthesised and cached, ${already} already warm, ${failed} failed.`);
console.log(`${seconds}s, about ${(warmed * USD_PER_LINE).toFixed(4)} USD.`);

// Asked for again, because a warmer that reports success without checking is
// the failure this is most likely to have: one character off in the URL and
// every line above is a miss that was never noticed.
const [checkUrl, checkLine] = entries[0];
const check = await warm(checkUrl).catch(() => null);
console.log(
  check?.state === "HIT"
    ? `Checked: ${checkLine.language}/${checkLine.id} is served from the edge.`
    : `Checked: ${checkLine.language}/${checkLine.id} came back ${check?.state ?? "unreachable"} — the URL this built is not the one the app asks for.`,
);
if (check?.state !== "HIT") process.exit(1);
