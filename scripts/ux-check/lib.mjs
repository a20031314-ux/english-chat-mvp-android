// 체감 점검 공용(저장소 맨 위에서 실행): www를 띄우고 /api는 운영으로(시험 사용자 x-rc-user), 앱 문구(copy) 읽기.
import http from "node:http"; import fs from "node:fs"; import path from "node:path";
import { createRequire } from "node:module";
export const { chromium } = createRequire(process.cwd() + "/node_modules/")("playwright");
export const ROOT = process.cwd(), WWW = path.join(ROOT, "www"), API = "https://www.languagebank.net";
const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webp": "image/webp", ".woff2": "font/woff2", ".mp4": "video/mp4" };
export const state = { uid: "" };
export function serve(port) {
  const server = http.createServer(async (req, res) => {
    if (req.url.startsWith("/api/") || req.url.startsWith("/guide/") || req.url.startsWith("/whats-new/")) {
      const chunks = []; for await (const c of req) chunks.push(c);
      const headers = { ...req.headers }; for (const h of ["host", "origin", "referer", "content-length"]) delete headers[h];
      headers["x-app-version"] = "2.77.0"; headers["x-rc-user"] = state.uid;
      try { const up = await fetch(API + req.url, { method: req.method, headers, body: ["GET", "HEAD"].includes(req.method) ? undefined : Buffer.concat(chunks) });
        res.writeHead(up.status, { "content-type": up.headers.get("content-type") || "application/octet-stream" }); res.end(Buffer.from(await up.arrayBuffer())); }
      catch { res.writeHead(502); res.end(); } return;
    }
    let f = path.join(WWW, decodeURIComponent(req.url.split("?")[0])); if (f.endsWith("/")) f += "index.html";
    if (!fs.existsSync(f) && fs.existsSync(f + ".html")) f += ".html"; if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, "index.html");
    if (!fs.existsSync(f)) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, { "content-type": types[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(res);
  });
  return new Promise((r) => server.listen(port, () => r(server)));
}
export async function api(p, body, uid = state.uid) {
  const r = await fetch(API + p, { method: "POST", headers: { "content-type": "application/json", "x-rc-user": uid, "x-app-version": "2.77.0" }, body: JSON.stringify(body ?? {}) });
  let j = null; try { j = await r.json(); } catch {} return { status: r.status, body: j };
}
export async function loadCopy() {
  const dir = path.join(ROOT, "tmp", "ux"); fs.mkdirSync(dir, { recursive: true });
  const source = fs.readFileSync(path.join(ROOT, "src/lib/copy.ts"), "utf8")
    .replace('"@/lib/locales/generated.json"', '"../../src/lib/locales/generated.json" with { type: "json" }')
    .replace('"@/lib/locales/overlays.json"', '"../../src/lib/locales/overlays.json" with { type: "json" }')
    .replace('"@/lib/learningLanguages"', '"../../src/lib/learningLanguages.ts"');
  const file = path.join(dir, `copy-ux.ts`);
  fs.writeFileSync(file, source);
  const { copy } = await import(`file://${file}`);
  return copy;
}
