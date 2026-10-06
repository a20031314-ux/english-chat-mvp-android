/**
 * Read what learnerMetrics.ts keeps, and answer a request to remove it.
 *
 * Two jobs, both promised by the privacy policy rather than wanted by the app:
 * reading the measurements back out for whoever builds the curriculum on them,
 * and deleting one person's records — and keeping them out from then on — when
 * they ask. A person is the anonymous app id the rows are keyed by ("rc:…").
 *
 * Run:
 *   node --experimental-strip-types scripts/learner-metrics.mjs export --month 2026-10 [--out tmp/lm-2026-10.jsonl]
 *   node --experimental-strip-types scripts/learner-metrics.mjs export --user rc:abc [--out …]
 *   node --experimental-strip-types scripts/learner-metrics.mjs summary --month 2026-10
 *   node --experimental-strip-types scripts/learner-metrics.mjs delete --user rc:abc        (and stop recording them)
 *
 * Needs KV_REST_API_URL / KV_REST_API_TOKEN, from the environment or .env.local.
 */
import { readFileSync, writeFileSync } from "node:fs";

function loadEnvFromFile() {
  if (process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL) return;
  try {
    for (const line of readFileSync(".env.local", "utf8").split(/\r?\n/)) {
      const at = line.indexOf("=");
      if (at === -1) continue;
      const key = line.slice(0, at).trim();
      const value = line.slice(at + 1).trim().replace(/^"|"$/g, "");
      if (key && !process.env[key]) process.env[key] = value;
    }
  } catch {
    // Reported by the KV layer as running without a store.
  }
}
loadEnvFromFile();

const { kvDelete, kvGetJson, kvListRange, kvScanKeys, kvSetJson } = await import("../src/lib/server/kv.ts");
const { optOutKey } = await import("../src/lib/server/learnerMetrics.ts");

const [command, ...rest] = process.argv.slice(2);
const option = (name) => {
  const at = rest.indexOf(name);
  return at === -1 ? undefined : rest[at + 1];
};

async function eventRows(pattern) {
  const keys = (await kvScanKeys(pattern)).sort();
  const rows = [];
  for (const key of keys) {
    const user = key.split(":").slice(2, -1).join(":");
    for (const raw of await kvListRange(key)) rows.push({ user_id: user, ...JSON.parse(raw) });
  }
  return rows;
}

async function exportRows() {
  const user = option("--user");
  const month = option("--month");
  if (!user && !month) throw new Error("export needs --user or --month");
  const rows = await eventRows(`lm:events:${user ?? "*"}:${month ?? "*"}`);
  const out = option("--out");
  const text = rows.map((row) => JSON.stringify(row)).join("\n") + (rows.length ? "\n" : "");
  if (out) {
    writeFileSync(out, text);
    console.log(`${rows.length} rows -> ${out}`);
  } else {
    process.stdout.write(text);
  }
}

async function summary() {
  const month = option("--month");
  if (!month) throw new Error("summary needs --month");
  const rows = await eventRows(`lm:events:*:${month}`);
  const by = new Map();
  for (const row of rows) {
    const key = `${row.surface} ${row.language}`;
    const entry = by.get(key) ?? { n: 0, users: new Set(), chars: 0, conf: [], corrected: 0, judged: 0 };
    entry.n += 1;
    entry.users.add(row.user_id);
    entry.chars += row.utterance_length ?? 0;
    if (typeof row.asr_confidence === "number") entry.conf.push(row.asr_confidence);
    if (row.had_correction !== null && row.had_correction !== undefined) {
      entry.judged += 1;
      if (row.had_correction) entry.corrected += 1;
    }
    by.set(key, entry);
  }
  console.log(`${rows.length} turns in ${month}`);
  for (const [key, e] of [...by].sort((a, b) => b[1].n - a[1].n)) {
    const conf = e.conf.length ? (e.conf.reduce((s, v) => s + v, 0) / e.conf.length).toFixed(3) : "-";
    const fix = e.judged ? `${Math.round((e.corrected / e.judged) * 100)}% corrected` : "-";
    console.log(`  ${key.padEnd(18)} ${String(e.n).padStart(6)} turns  ${String(e.users.size).padStart(4)} people  ${(e.chars / e.n).toFixed(0).padStart(4)} chars avg  conf ${conf}  ${fix}`);
  }
}

async function remove() {
  const user = option("--user");
  if (!user || !user.startsWith("rc:")) throw new Error('delete needs --user rc:<id>');
  const eventKeys = await kvScanKeys(`lm:events:${user}:*`);
  const sessions = new Set();
  for (const key of eventKeys) {
    for (const raw of await kvListRange(key)) {
      const row = JSON.parse(raw);
      if (row.session_id) sessions.add(row.session_id);
    }
  }
  const keys = [
    ...eventKeys,
    ...(await kvScanKeys(`lm:text:${user}:*`)),
    ...(await kvScanKeys(`lm:asr:${user}:*`)),
    // Study maps: the goal they wrote and the map drawn from it, per language
    // (curriculumStore.ts). Theirs as much as the turns are.
    ...(await kvScanKeys(`curriculum:${user}:*`)),
    ...[...sessions].flatMap((id) => [`lm:session:${id}`, `lm:lastturn:${id}`]),
  ];
  for (const sessionKey of [...sessions].map((id) => `lm:session:${id}`)) {
    const session = await kvGetJson(sessionKey);
    if (session && session.user_id !== user) throw new Error(`${sessionKey} belongs to someone else; stopping`);
  }
  await kvDelete(keys);
  await kvSetJson(optOutKey(user), { at: new Date().toISOString() });
  console.log(`Deleted ${keys.length} keys for ${user} and stopped recording them.`);
}

const commands = { export: exportRows, summary, delete: remove };
if (!commands[command]) {
  console.error("Usage: learner-metrics.mjs export|summary|delete [--user rc:…] [--month YYYY-MM] [--out file]");
  process.exit(2);
}
await commands[command]();
