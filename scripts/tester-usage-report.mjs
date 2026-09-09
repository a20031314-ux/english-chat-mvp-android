/**
 * What the testers actually did, from the ledger rather than from the console.
 *
 * Play Console reports how many people accepted a tester invitation. That is
 * the number the fourteen-day counter runs on, and it is not the number anyone
 * reviewing an application is persuaded by: an invitation accepted is not an
 * app used, and the gap between the two is where a production-access
 * application quietly fails. This reads the other half — how many distinct
 * people did something, on how many days, and what they did.
 *
 * It counts requests that spend model time, because those are the ones already
 * being metered. Opening the app and reading a saved word is real use and is
 * invisible here; the numbers below are a floor, not a census.
 *
 * Two things will make it lie, so it says so rather than hiding them:
 *
 * A person is a userId, which is their RevenueCat subscriber id where the build
 * sends one and a cookie otherwise. Cleared storage or a reinstall makes a
 * second person out of one, so the distinct count is an over-count in the same
 * direction as an optimistic reading. Prefer the "rc:" figure when quoting one.
 *
 * And the ledger only reaches as far back as its rows live. Those were kept for
 * three days while they were only feeding a daily limit, and are kept for
 * forty-five now — but that change only applies to rows written after it
 * deployed. A window that starts before then is missing its early days, and the
 * report will tell you which ones it could not see.
 *
 * Run: node --experimental-strip-types scripts/tester-usage-report.mjs [--days 14]
 */
import { readFileSync } from "node:fs";
import { kvConfigured, kvGetNumbers, kvScanKeys } from "../src/lib/server/kv.ts";
import { MODEL_CALLS_PER_REQUEST } from "../src/lib/server/modelCalls.ts";

function loadEnvFromFile() {
  // The API reads these from the deployment; a script run by hand has to find
  // them itself, and .env.local is where they already are.
  if (kvConfigured()) return;
  try {
    for (const line of readFileSync(".env.local", "utf8").split(/\r?\n/)) {
      const at = line.indexOf("=");
      if (at <= 0 || line.startsWith("#")) continue;
      const name = line.slice(0, at).trim();
      if (!name.startsWith("KV_") && !name.startsWith("UPSTASH_")) continue;
      if (process.env[name]) continue;
      process.env[name] = line.slice(at + 1).trim().replace(/^"|"$/g, "");
    }
  } catch {
    // Handled by the check below, which can say something more useful.
  }
}

loadEnvFromFile();

if (!kvConfigured()) {
  console.error(
    "No KV credentials. Set KV_REST_API_URL and KV_REST_API_TOKEN (or the\n" +
      "UPSTASH_ pair), or put them in .env.local. Without them there is nothing\n" +
      "to read: the in-memory fallback belongs to a server that is not running.",
  );
  process.exit(2);
}

const days = Number(
  process.argv[process.argv.indexOf("--days") + 1] ?? 14,
) || 14;

const DAY = /^\d{4}-\d{2}-\d{2}$/;

/**
 * `usage:op:<op>:<userId>:<day>`, where userId may itself contain colons —
 * "rc:" ids do. The day is always last and always shaped like a date, and the
 * op never contains a colon, so both ends are safe to take and the middle is
 * whatever is left.
 */
function parseOpKey(key) {
  const parts = key.split(":");
  if (parts.length < 5) return null;
  const day = parts[parts.length - 1];
  if (!DAY.test(day)) return null;
  return { op: parts[2], userId: parts.slice(3, -1).join(":"), day };
}

function windowDays(count) {
  const wanted = [];
  const now = new Date();
  for (let back = count - 1; back >= 0; back -= 1) {
    const at = new Date(now);
    at.setDate(now.getDate() - back);
    const month = String(at.getMonth() + 1).padStart(2, "0");
    const day = String(at.getDate()).padStart(2, "0");
    wanted.push(`${at.getFullYear()}-${month}-${day}`);
  }
  return wanted;
}

const keys = (await kvScanKeys("usage:op:*")).filter(parseOpKey);
const counts = await kvGetNumbers(keys);

const wanted = new Set(windowDays(days));
const byDay = new Map();
const byOp = new Map();
const byUser = new Map();
let actions = 0;
let modelCalls = 0;

for (let i = 0; i < keys.length; i += 1) {
  const row = parseOpKey(keys[i]);
  const count = counts[i] ?? 0;
  if (!row || count <= 0 || !wanted.has(row.day)) continue;

  actions += count;
  modelCalls += count * (MODEL_CALLS_PER_REQUEST[row.op] ?? 1);

  const day = byDay.get(row.day) ?? { users: new Set(), actions: 0 };
  day.users.add(row.userId);
  day.actions += count;
  byDay.set(row.day, day);

  byOp.set(row.op, (byOp.get(row.op) ?? 0) + count);

  const user = byUser.get(row.userId) ?? { days: new Set(), actions: 0 };
  user.days.add(row.day);
  user.actions += count;
  byUser.set(row.userId, user);
}

const calls = await kvScanKeys("usage:calls:*");
const callCounts = await kvGetNumbers(calls);
const callSeconds = await kvGetNumbers(await kvScanKeys("usage:callsec:*"));
const totalCalls = callCounts.reduce((sum, n) => sum + n, 0);
const totalCallSeconds = callSeconds.reduce((sum, n) => sum + n, 0);

const window = windowDays(days);
const identified = [...byUser.keys()].filter((id) => id.startsWith("rc:"));
const activeDays = window.filter((day) => byDay.has(day));

console.log(`\nLast ${days} days — ${window[0]} to ${window[window.length - 1]}\n`);

console.log("day          testers  actions");
for (const day of window) {
  const row = byDay.get(day);
  const seen = row ? String(row.users.size).padStart(7) : "      ·";
  const did = row ? String(row.actions).padStart(8) : "       ·";
  console.log(`${day}${seen}${did}`);
}

if (byOp.size > 0) {
  console.log("\nwhat they did");
  for (const [op, count] of [...byOp].sort((a, b) => b[1] - a[1])) {
    console.log(`  ${op.padEnd(20)} ${String(count).padStart(6)}`);
  }
}

if (byUser.size > 0) {
  console.log("\ndays active, per tester");
  const spread = new Map();
  for (const user of byUser.values()) {
    spread.set(user.days.size, (spread.get(user.days.size) ?? 0) + 1);
  }
  for (const [dayCount, people] of [...spread].sort((a, b) => b[0] - a[0])) {
    console.log(
      `  ${String(dayCount).padStart(2)} day(s)  ${"█".repeat(Math.min(people, 40))} ${people}`,
    );
  }
}

// The roleplay's own quality signal: corrections were meant to be written into
// the scenarios in advance, so generating one means a scenario failed to
// anticipate its own trouble.
const listened = byOp.get("roleplayListen") ?? 0;
const corrected = byOp.get("roleplayCorrect") ?? 0;
if (listened > 0) {
  const share = ((corrected / listened) * 100).toFixed(1);
  console.log(
    `\nroleplay: ${listened} turns heard, ${corrected} corrections generated (${share}%)`,
  );
  console.log(
    "  A share climbing towards the turn count means the scripts are missing",
  );
  console.log("  the trouble the situation briefs already named.");
}

const missing = window.filter((day) => !byDay.has(day));
console.log(`
${byUser.size} distinct tester(s), ${identified.length} of them identified by subscriber id
active on ${activeDays.length} of the last ${days} day(s)
${actions} metered action(s), about ${modelCalls} model call(s)
${totalCalls} call(s) started in total, ${Math.round(totalCallSeconds / 60)} minute(s) of tutor call this month
`);

if (missing.length > 0) {
  console.log(
    `No activity recorded on ${missing.length} day(s): ${missing.join(", ")}`,
  );
  console.log(
    "A run of empty days at the start of the window may be expiry rather than\n" +
      "silence — rows written before the ledger's retention was raised only\n" +
      "lived three days. Empty days at the end are real.",
  );
}
