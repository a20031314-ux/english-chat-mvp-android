/**
 * Static export for Capacitor: Next.js cannot export `app/api` route handlers,
 * so we temporarily move `src/app/api` aside, run `next build` with CAPACITOR_STATIC=1,
 * copy `out/` → `www/`, then restore the API folder for normal web development.
 */
import { execSync } from "node:child_process";
import { cpSync, existsSync, renameSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const apiDir = path.join(root, "src", "app", "api");
const apiBackup = path.join(root, "src", "_capacitor_build_backup_api");
const outDir = path.join(root, "out");
const wwwDir = path.join(root, "www");
const nextDir = path.join(root, ".next");

process.chdir(root);

// Drop stale generated types that still reference `src/app/api/*` before we move that folder.
rmSync(nextDir, { recursive: true, force: true });

if (existsSync(apiBackup)) {
  console.error(
    "Found stale src/_capacitor_build_backup_api — remove it manually, then retry.",
  );
  process.exit(1);
}

rmSync(wwwDir, { recursive: true, force: true });

let apiMoved = false;
if (existsSync(apiDir)) {
  renameSync(apiDir, apiBackup);
  apiMoved = true;
}

function restoreApi() {
  if (!apiMoved || !existsSync(apiBackup)) {
    return;
  }
  if (existsSync(apiDir)) {
    rmSync(apiDir, { recursive: true, force: true });
  }
  renameSync(apiBackup, apiDir);
}

let buildFailed = false;
try {
  execSync("npx next build", {
    stdio: "inherit",
    env: { ...process.env, CAPACITOR_STATIC: "1" },
  });
} catch {
  buildFailed = true;
} finally {
  restoreApi();
}

if (buildFailed) {
  process.exit(1);
}

if (!existsSync(outDir)) {
  console.error("Expected out/ after next build (static export).");
  process.exit(1);
}

cpSync(outDir, wwwDir, { recursive: true });
console.log("Static web bundle copied to www/ (from out/).");
