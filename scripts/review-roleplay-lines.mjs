/**
 * Read a draft's lines before a person has to, and say which ones need eyes.
 *
 * The catalog was written by drafting with a model and then reading every line,
 * and the reading was always the expensive half. It does not scale: an open
 * conversation needs a bank in the hundreds, and nobody reads hundreds of lines
 * carefully twice. This does the pass that can be mechanised so the person can
 * spend their attention on the handful that tripped something.
 *
 * It is not a gate and does not decide anything. "ok" means nothing on the list
 * was tripped, which is not the same as good; "fix" and "cut" are where to look.
 * Nothing is written to src/ — the same reason the drafter prints rather than
 * saves, which is that the gap where a person reads is the point.
 *
 * Reviewed by a model that did not write the line, and a better one than the
 * drafter used, because nothing is waiting on this.
 *
 * Run:
 *   node --experimental-strip-types scripts/review-roleplay-lines.mjs <scenario-id>
 *   node --experimental-strip-types scripts/review-roleplay-lines.mjs --file draft.json
 *
 * A --file takes the drafter's own output: { "sentences": { id: { text, translation } } }.
 */
import { readFileSync } from "node:fs";
import { SCENARIOS, SENTENCES, findScenario } from "../src/lib/roleplay/catalog.ts";
import { sentenceIdsUsed } from "../src/lib/roleplay/script.ts";
import {
  MAX_LINES_PER_REVIEW,
  draftReviewPrompt,
  needsEyes,
  parseDraftReview,
} from "../src/lib/roleplay/reviewDraft.ts";

const MODEL = process.env.OPENAI_REVIEW_MODEL ?? "gpt-5-mini";

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
    // fall through
  }
  console.error("OPENAI_API_KEY is not set, and .env.local does not carry one.");
  process.exit(2);
}

const args = process.argv.slice(2);
const fileAt = args.indexOf("--file");

/** The lines to read, and what to tell the reviewer about them. */
function gather() {
  if (fileAt !== -1) {
    const path = args[fileAt + 1];
    if (!path) {
      console.error("--file needs a path.");
      process.exit(2);
    }
    const draft = JSON.parse(readFileSync(path, "utf8"));
    const role = draft.tutorRole ?? "the person in this scene";
    return {
      setting: draft.setting ?? "A spoken conversation.",
      targetLanguage: draft.language ?? "English",
      lines: Object.entries(draft.sentences ?? {}).map(([id, sentence]) => ({
        id,
        text: sentence.text ?? "",
        ...(sentence.translation ? { translation: sentence.translation } : {}),
        role,
      })),
    };
  }

  const id = args[0];
  const scenario = id ? findScenario(id) : null;
  if (!scenario) {
    console.error("Usage: review-roleplay-lines.mjs <scenario-id> | --file <draft.json>\n");
    console.error("Scenarios:");
    for (const one of SCENARIOS) console.error(`  ${one.id.padEnd(24)} ${one.title}`);
    process.exit(2);
  }
  const bank = SENTENCES[scenario.language] ?? {};
  return {
    setting: scenario.setting,
    targetLanguage: scenario.language,
    lines: sentenceIdsUsed(scenario)
      .filter((sentenceId) => bank[sentenceId])
      .map((sentenceId) => ({
        id: sentenceId,
        text: bank[sentenceId].text,
        ...(bank[sentenceId].translation
          ? { translation: bank[sentenceId].translation }
          : {}),
        role: scenario.tutorRole,
      })),
  };
}

async function review(batch, setting, targetLanguage) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        {
          role: "user",
          content: draftReviewPrompt({
            lines: batch,
            setting,
            targetLanguage,
            nativeLanguage: "Korean",
          }),
        },
      ],
      response_format: { type: "json_object" },
    }),
  });
  if (!response.ok) {
    console.error(`${response.status} ${(await response.text()).slice(0, 300)}`);
    process.exit(1);
  }
  const body = await response.json();
  return parseDraftReview(body.choices?.[0]?.message?.content ?? "", batch);
}

const { lines, setting, targetLanguage } = gather();
if (lines.length === 0) {
  console.error("Nothing to read.");
  process.exit(2);
}

console.log(`${lines.length} line(s), read by ${MODEL}\n`);

const verdicts = [];
for (let at = 0; at < lines.length; at += MAX_LINES_PER_REVIEW) {
  const batch = lines.slice(at, at + MAX_LINES_PER_REVIEW);
  verdicts.push(...(await review(batch, setting, targetLanguage)));
}

const byId = new Map(lines.map((line) => [line.id, line]));
const flagged = needsEyes(verdicts);

for (const verdict of flagged) {
  const line = byId.get(verdict.id);
  console.log(`${verdict.verdict.toUpperCase().padEnd(4)} ${verdict.id}`);
  console.log(`     "${line?.text ?? ""}"`);
  console.log(`     ${verdict.why}`);
  if (verdict.suggestion) console.log(`  →  "${verdict.suggestion}"`);
  console.log();
}

console.log(
  `${verdicts.length - flagged.length} tripped nothing, ${flagged.length} for a person to read.`,
);
console.log(
  "Nothing was changed. \"ok\" means nothing on the list was tripped, which is not the same as good.",
);
