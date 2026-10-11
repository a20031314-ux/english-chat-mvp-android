/**
 * The app's own interface strings, so a scene can find "Send" or "분석" by the
 * label the learner sees in that language instead of by an English guess.
 *
 * copy.ts imports through "@/", which Node cannot resolve, so it is read
 * through a temporary copy with those imports rewritten — the same way
 * scripts/capture-whats-new.mjs reads it. Needs Node with
 * --experimental-strip-types (Node 22.6+), which `npm run store:shots` passes.
 */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

export async function loadUiCopy(root) {
  const dir = path.join(root, "tmp", "copycheck");
  fs.mkdirSync(dir, { recursive: true });
  const source = fs
    .readFileSync(path.join(root, "src/lib/copy.ts"), "utf8")
    .replace('"@/lib/locales/generated.json"', '"../../src/lib/locales/generated.json" with { type: "json" }')
    .replace('"@/lib/locales/overlays.json"', '"../../src/lib/locales/overlays.json" with { type: "json" }')
    .replace('"@/lib/learningLanguages"', '"../../src/lib/learningLanguages.ts"');
  const file = path.join(dir, `store-shots-${process.pid}-${Date.now()}.ts`);
  fs.writeFileSync(file, source);
  try {
    const { copy } = await import(pathToFileURL(file).href);
    return copy;
  } finally {
    fs.rmSync(file, { force: true });
  }
}
