/**
 * What the sentence bank is worth, measured rather than argued about.
 *
 * The bank exists to make the character reach for a line that already exists
 * instead of inventing one: an existing line costs no synthesis, plays a read
 * somebody checked, and comes back from the edge in a fifth of a second. None
 * of that is worth anything if the lines are never the ones a conversation
 * calls for, and until now there was no way to know which it was.
 *
 * So this is the before-and-after. Run it once before growing the bank and
 * again afterwards, and the difference is the answer — not the hit rate on its
 * own, which says nothing without something to compare it to.
 *
 * Every figure here is a floor. A line the character said before any of this
 * was counted is invisible, and so is a conversation from a build that does not
 * report its version. The report says which numbers it could not see rather
 * than quietly averaging over the gap.
 *
 * Run: node --experimental-strip-types scripts/bank-report.mjs [--days 30]
 */
import { readFileSync } from "node:fs";
import { kvConfigured, kvGetNumbers, kvScanKeys } from "../src/lib/server/kv.ts";
import { SCENARIOS, SENTENCES } from "../src/lib/roleplay/catalog.ts";
import { scenarioSentenceIds } from "../src/lib/roleplay/script.ts";

function loadEnvFromFile() {
  if (kvConfigured()) return;
  try {
    for (const line of readFileSync(".env.local", "utf8").split(/\r?\n/)) {
      const at = line.indexOf("=");
      if (at === -1) continue;
      const key = line.slice(0, at).trim();
      const value = line.slice(at + 1).trim().replace(/^"|"$/g, "");
      if (key && !process.env[key]) process.env[key] = value;
    }
  } catch {
    // No file is the same as no credentials, and says so below.
  }
}

loadEnvFromFile();
if (!kvConfigured()) {
  console.error(
    "No KV credentials. Set KV_REST_API_URL and KV_REST_API_TOKEN (or the\n" +
      "UPSTASH_ pair) in .env.local — the deployment has them, a script run by\n" +
      "hand does not. Without them there is nothing to read.",
  );
  process.exit(2);
}

const daysAt = process.argv.indexOf("--days");
const DAYS = daysAt === -1 ? 30 : Math.max(1, Number(process.argv[daysAt + 1]) || 30);
const SINCE = Date.now() - DAYS * 24 * 60 * 60 * 1000;

/** Every sentence a scene can say, with where it came from. */
function bankLines() {
  const lines = [];
  for (const scenario of SCENARIOS) {
    const bank = SENTENCES[scenario.language] ?? {};
    for (const id of scenarioSentenceIds(scenario)) {
      const sentence = bank[id];
      if (!sentence) continue;
      if (lines.some((line) => line.id === id && line.language === scenario.language)) continue;
      lines.push({
        id,
        language: scenario.language,
        text: sentence.text,
        source: sentence.source ?? "written",
        scenario: scenario.id,
        // A line belonging to an open conversation fits anywhere; one belonging
        // to a step answers that step and nothing else.
        general: Boolean(scenario.openEnded),
      });
    }
  }
  return lines;
}

const lines = bankLines();
const said = await kvGetNumbers(
  lines.map((line) => `bank:said:${line.language}:${line.id}`),
);
lines.forEach((line, index) => {
  line.said = said[index] ?? 0;
});

/** The daily op counters, summed over the window. */
async function opTotals() {
  const keys = await kvScanKeys("usage:op:*");
  const wanted = new Map();
  const cutoff = new Date(SINCE).toISOString().slice(0, 10);
  for (const key of keys) {
    // usage:op:<op>:<userId>:<YYYY-MM-DD>
    const parts = key.split(":");
    const day = parts[parts.length - 1];
    const op = parts[2];
    if (!op || !day || day < cutoff) continue;
    if (!wanted.has(op)) wanted.set(op, []);
    wanted.get(op).push(key);
  }
  const totals = {};
  for (const [op, opKeys] of wanted) {
    const counts = await kvGetNumbers(opKeys);
    totals[op] = counts.reduce((sum, n) => sum + (n ?? 0), 0);
  }
  return totals;
}

const ops = await opTotals();
const get = (name) => ops[name] ?? 0;

const bankLine = get("roleplayBankLine");
const invented = get("roleplayInventedLine");
const spokenTurns = bankLine + invented;
const sessions = get("roleplaySession");
const turns = get("roleplayTurn");
const split = get("roleplaySplitTurn");
const tts = get("tts");

const pct = (part, whole) => (whole > 0 ? `${((part / whole) * 100).toFixed(1)}%` : "—");
const per = (part, whole) => (whole > 0 ? (part / whole).toFixed(1) : "—");

console.log(`Bank report — last ${DAYS} days\n`);

console.log("[2] Before and after");
console.log(`  bank hit rate          ${pct(bankLine, spokenTurns)}  (${bankLine} of ${spokenTurns} lines came from the bank)`);
// Two clips in a row sound like one turn, so whether this ever happens cannot
// be told by listening — the first person to use the build could not say.
console.log(`  whole turns from bank  ${pct(split, turns)}  (${split} of ${turns} turns came back as two lines)`);
console.log(`  tts / roleplayTurn     ${turns > 0 ? (tts / turns).toFixed(2) : "—"}  (${tts} syntheses, ${turns} character turns)`);
console.log(`  syntheses per session  ${per(tts, sessions)}`);
console.log(`  turns per session      ${per(turns, sessions)}`);
console.log(`  conversations          ${sessions}`);

console.log("\n[1] Hit rate by where the line came from");
const bySource = new Map();
for (const line of lines) {
  const row = bySource.get(line.source) ?? { total: 0, used: 0, said: 0 };
  row.total += 1;
  if (line.said > 0) row.used += 1;
  row.said += line.said;
  bySource.set(line.source, row);
}
for (const [source, row] of bySource) {
  console.log(
    `  ${source.padEnd(10)} ${String(row.used).padStart(3)}/${String(row.total).padEnd(3)} used  ${pct(row.used, row.total).padStart(6)}   ${row.said} plays`,
  );
}

console.log("\n  general vs tied to a step");
for (const general of [true, false]) {
  const group = lines.filter((line) => line.general === general);
  const used = group.filter((line) => line.said > 0).length;
  console.log(
    `  ${(general ? "general" : "step").padEnd(10)} ${String(used).padStart(3)}/${String(group.length).padEnd(3)} used  ${pct(used, group.length).padStart(6)}`,
  );
}

console.log("\n[3] The long tail");
const plays = lines.map((line) => line.said).sort((a, b) => b - a);
const totalPlays = plays.reduce((sum, n) => sum + n, 0);
const topTenth = plays.slice(0, Math.max(1, Math.ceil(plays.length / 10)));
console.log(
  `  top 10% of lines carry ${pct(topTenth.reduce((s, n) => s + n, 0), totalPlays)} of all plays`,
);
const never = lines.filter((line) => line.said === 0);
console.log(`  never said: ${never.length} of ${lines.length}`);
for (const line of never.slice(0, 20)) {
  console.log(`    ${line.language}/${line.id.padEnd(22)} ${line.source.padEnd(9)} "${line.text.slice(0, 44)}"`);
}
if (never.length > 20) console.log(`    … and ${never.length - 20} more`);

if (totalPlays === 0) {
  console.log(
    "\nNothing has been said yet that this could count. The counters were added\n" +
      "after the lines were, so this is a baseline of zero rather than a measured\n" +
      "one — run it again once a build carrying them has been used.",
  );
}
