/**
 * Side-by-side: current 1-pass translate vs meaning-extract + regenerate.
 * Does not change production translation yet.
 *
 * Usage: node --experimental-strip-types scripts/compare-reconstruction-translate.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { openAiJsonCompleter } from "../src/lib/reconstructionTranslate/openaiJson.ts";
import {
  compareTranslationPasses,
  formatCompareRow,
} from "../src/lib/reconstructionTranslate/pipeline.ts";
import { SUBTITLE_NATURALIZATION_CASES } from "../src/lib/videoSubtitle/subtitleNaturalizationCases.ts";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

function loadLocalEnv() {
  for (const name of [".env.local", ".env"]) {
    const file = path.join(root, name);
    if (!fs.existsSync(file)) continue;
    const text = fs.readFileSync(file, "utf8");
    for (const raw of text.split(/\r?\n/)) {
      const line = raw.trim();
      if (!line || line.startsWith("#")) continue;
      const eq = line.indexOf("=");
      if (eq < 1) continue;
      const key = line.slice(0, eq).trim();
      let value = line.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = value;
    }
  }
}

const SAMPLE_IDS = ["01", "02", "03", "04", "06"];

/** Extra spoken-texture cases (not locked gold translations). */
const TEXTURE_SAMPLES = [
  {
    id: "t1",
    category: "texture-hedge-runon",
    original:
      "I know usually I feel like I kind of start talking before I even know what I want to say.",
    videoContext: "Casual vlog; speaker talking to the camera about their own habit.",
  },
  {
    id: "t2",
    category: "texture-self-correction",
    original:
      "It was, wait, no, not yesterday — it was like two days ago, I think?",
    videoContext: "Casual vlog; speaker trying to remember a date out loud.",
  },
  {
    id: "t3",
    category: "texture-repetition",
    original: "It's just, it's just a lot, you know? Like a lot a lot.",
    videoContext: "Casual vlog; speaker venting to the camera.",
  },
];

async function main() {
  loadLocalEnv();
  if (!process.env.OPENAI_API_KEY) {
    console.error("OPENAI_API_KEY missing. Add it to .env.local and rerun.");
    process.exit(1);
  }

  const completeJson = openAiJsonCompleter();
  const calqueCases = SUBTITLE_NATURALIZATION_CASES.filter((item) =>
    SAMPLE_IDS.includes(item.id),
  );
  console.log(
    `1-pass vs 2-pass only (${calqueCases.length + TEXTURE_SAMPLES.length} sample lines, en→ko, critique off)\n`,
  );

  for (const item of calqueCases) {
    const row = await compareTranslationPasses(
      {
        sourceText: item.original,
        sourceLang: "en",
        targetLang: "ko",
        sourceType: "subtitle",
        videoContext: "Developer talking through a design choice on a tutorial / vlog.",
        previousLines: item.previous,
        nextLines: item.next,
      },
      completeJson,
      { enableCritique: false },
    );
    console.log(`[${item.id}] ${item.category}`);
    console.log(formatCompareRow(row));
    console.log(`old-calque ${item.oldTranslation.replace(/\n/g, " / ")}`);
    console.log(`(ref only) ${item.improvedSubtitle.replace(/\n/g, " / ")}`);
    console.log("");
  }

  for (const item of TEXTURE_SAMPLES) {
    const row = await compareTranslationPasses(
      {
        sourceText: item.original,
        sourceLang: "en",
        targetLang: "ko",
        sourceType: "subtitle",
        videoContext: item.videoContext,
      },
      completeJson,
      { enableCritique: false },
    );
    console.log(`[${item.id}] ${item.category}`);
    console.log(formatCompareRow(row));
    console.log("");
  }
}

await main();
