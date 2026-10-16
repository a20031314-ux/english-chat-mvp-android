/**
 * Bring in-app feedback down to disk, for sorting.
 *
 * Writes tmp/feedback/<run>/items.json (newest last) and one picture per item
 * that has one (<id>.jpg), and remembers how far it got in
 * hub/feedback/last-pulled.txt so the next run starts there. tmp/ is
 * gitignored: the pictures are learners' screens and never go into the
 * repository.
 *
 * Needs the feedback read key: FEEDBACK_KEY in the environment (the scheduled
 * task that sorts feedback carries it). How the sorting is done:
 * hub/feedback/README.md.
 *
 * Run: FEEDBACK_KEY=… node scripts/feedback-pull.mjs [--since <ms>|--all]
 */
import fs from "node:fs";
import path from "node:path";

const API = process.env.API_BASE || "https://english-chat-mvp.vercel.app";
const KEY = process.env.FEEDBACK_KEY?.trim();
if (!KEY) {
  console.error("FEEDBACK_KEY is not set.");
  process.exit(2);
}
const ROOT = process.cwd();
const MARK = path.join(ROOT, "hub/feedback/last-pulled.txt");
const args = process.argv.slice(2);
const since = args.includes("--all")
  ? 0
  : args.includes("--since")
    ? Number(args[args.indexOf("--since") + 1]) || 0
    : Number(fs.existsSync(MARK) ? fs.readFileSync(MARK, "utf8").trim() : 0) || 0;

const headers = { "x-feedback-key": KEY };
const response = await fetch(`${API}/api/feedback?since=${since}`, { headers });
if (!response.ok) {
  console.error(`feedback list failed: ${response.status}`);
  process.exit(1);
}
const { items } = await response.json();
const run = new Date().toISOString().slice(0, 16).replace(/[:T]/g, "-");
const dir = path.join(ROOT, "tmp/feedback", run);
fs.mkdirSync(dir, { recursive: true });
for (const item of items) {
  if (!item.hasImage) continue;
  const picture = await fetch(`${API}/api/feedback/image?id=${encodeURIComponent(item.id)}`, { headers });
  if (!picture.ok) continue;
  const file = path.join(dir, `${item.id}.jpg`);
  fs.writeFileSync(file, Buffer.from(await picture.arrayBuffer()));
  item.imageFile = path.relative(ROOT, file);
}
fs.writeFileSync(path.join(dir, "items.json"), JSON.stringify(items, null, 2));
if (items.length) {
  fs.mkdirSync(path.dirname(MARK), { recursive: true });
  fs.writeFileSync(MARK, `${Math.max(...items.map((item) => item.at))}\n`);
}
console.log(`${items.length} new since ${since ? new Date(since).toISOString() : "the start"} → ${path.relative(ROOT, dir)}`);
