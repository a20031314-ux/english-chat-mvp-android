// 홍보 녹화 공통: www를 띄우고 /api는 운영으로, 휴대폰 크기 Chrome을 2배 해상도로 화면 전송(CDP screencast) 녹화 → raw.mp4 + events.json.
// record-fix.mjs와 같은 방식을 새 편(record-analyze.mjs 등)이 나눠 쓴다.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { chromium } from "playwright";

export async function loadCopy(root) {
  const dir = path.join(root, "tmp", "copycheck");
  fs.mkdirSync(dir, { recursive: true });
  const source = fs
    .readFileSync(path.join(root, "src/lib/copy.ts"), "utf8")
    .replace('"@/lib/locales/generated.json"', '"../../src/lib/locales/generated.json" with { type: "json" }')
    .replace('"@/lib/locales/overlays.json"', '"../../src/lib/locales/overlays.json" with { type: "json" }')
    .replace('"@/lib/learningLanguages"', '"../../src/lib/learningLanguages.ts"');
  const file = path.join(dir, `promo-h-${process.pid}.ts`);
  fs.writeFileSync(file, source);
  try {
    return (await import(`file://${file}`)).copy;
  } finally {
    fs.rmSync(file, { force: true });
  }
}

const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".woff2": "font/woff2", ".webp": "image/webp", ".mp3": "audio/mpeg", ".txt": "text/plain" };

/**
 * 녹화 하나. scene(page, { tap, mark, events })에서 앱을 조작한다.
 * 결과: <out>/raw.mp4, events.json(장면 시각은 녹화 시작부터 초), final.png.
 */
export async function record({ root, out, user, locale, target, port = 4292, scene }) {
  const api = process.env.API_BASE || "https://english-chat-mvp.vercel.app";
  const www = path.join(root, "www");
  const server = http.createServer(async (req, res) => {
    if (req.url.startsWith("/api/")) {
      const chunks = [];
      for await (const c of req) chunks.push(c);
      const headers = { ...req.headers };
      for (const h of ["host", "origin", "referer", "content-length"]) delete headers[h];
      try {
        const up = await fetch(api + req.url, { method: req.method, headers, body: ["GET", "HEAD"].includes(req.method) ? undefined : Buffer.concat(chunks) });
        res.writeHead(up.status, { "content-type": up.headers.get("content-type") || "application/octet-stream" });
        res.end(Buffer.from(await up.arrayBuffer()));
      } catch {
        res.writeHead(502);
        res.end();
      }
      return;
    }
    let file = path.join(www, decodeURIComponent(req.url.split("?")[0]));
    if (file.endsWith(path.sep)) file += "index.html";
    if (!fs.existsSync(file) && fs.existsSync(file + ".html")) file += ".html";
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
    if (!fs.existsSync(file)) return res.writeHead(404).end();
    res.writeHead(200, { "content-type": TYPES[path.extname(file)] || "application/octet-stream" });
    fs.createReadStream(file).pipe(res);
  });
  await new Promise((r) => server.listen(port, "127.0.0.1", r));
  const base = `http://127.0.0.1:${port}`;

  fs.rmSync(out, { recursive: true, force: true });
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 412, height: 915 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const events = { locale, target };
  const mark = (name) => (events[name] = Date.now() / 1000);
  await context.route("**/api/**", (route) => route.continue({ headers: { ...route.request().headers(), "x-rc-user": user } }));
  await context.addInitScript(([t, l]) => {
    localStorage.setItem("appTargetLanguage", t);
    localStorage.setItem("appUiLocale", l);
    localStorage.setItem("chatOwnLanguageTipSeen", "1");
    localStorage.setItem("whatsNewSeenVersion", "999");
    localStorage.setItem("chatCorrectionViewMode", "tap");
      // 화면 전송은 바뀐 프레임만 보낸다 — 가끔 멈춰 마지막 장면(열린 교정)이 안 찍혔다(ko). 보이지 않는 점을 매 프레임 바꿔 계속 받는다.
    addEventListener("DOMContentLoaded", () => {
      const dot = document.createElement("div");
      dot.style.cssText = "position:fixed;left:0;top:0;width:1px;height:1px;z-index:99998;pointer-events:none;background:#000";
      document.body.appendChild(dot);
      let on = false;
      const tick = () => {
        on = !on;
        dot.style.opacity = on ? "0.011" : "0.012";
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  addEventListener("pointerdown", (e) => {
      const dot = document.createElement("div");
      dot.style.cssText = `position:fixed;left:${e.clientX - 22}px;top:${e.clientY - 22}px;width:44px;height:44px;border-radius:50%;background:rgba(255,255,255,.35);border:2px solid rgba(255,255,255,.8);z-index:99999;pointer-events:none;transition:transform .45s ease-out,opacity .45s ease-out`;
      document.body.appendChild(dot);
      requestAnimationFrame(() => {
        dot.style.transform = "scale(1.8)";
        dot.style.opacity = "0";
      });
      setTimeout(() => dot.remove(), 600);
    }, true);
  }, [target, locale]);
  const page = await context.newPage();
  page.setDefaultTimeout(60000);
  const frames = [];
  const framesDir = path.join(out, "frames");
  fs.mkdirSync(framesDir, { recursive: true });
  const cdp = await context.newCDPSession(page);
  cdp.on("Page.screencastFrame", async ({ data, metadata, sessionId }) => {
    const file = path.join(framesDir, `${String(frames.length).padStart(5, "0")}.jpg`);
    fs.writeFileSync(file, Buffer.from(data, "base64"));
    frames.push({ file, at: metadata.timestamp });
    await cdp.send("Page.screencastFrameAck", { sessionId }).catch(() => {});
  });
  const tap = async (locator) => {
    const box = await locator.boundingBox();
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  };
  const startScreencast = () => cdp.send("Page.startScreencast", { format: "jpeg", quality: 92, maxWidth: 824, maxHeight: 1830, everyNthFrame: 1 });
  try {
    await page.goto(`${base}/?screen=chat`, { waitUntil: "domcontentloaded" });
    await scene(page, { tap, mark, events, startScreencast });
    mark("end");
    await page.screenshot({ path: path.join(out, "final.png") });
  } finally {
    await cdp.send("Page.stopScreencast").catch(() => {});
    await context.close();
    await browser.close();
    server.close();
  }
  const start = frames[0].at;
  const list = frames
    .map((f, i) => {
      const next = i + 1 < frames.length ? frames[i + 1].at : events.end;
      return `file '${f.file}'\nduration ${Math.max(0.01, next - f.at).toFixed(3)}`;
    })
    .join("\n");
  fs.writeFileSync(path.join(out, "frames.txt"), `${list}\nfile '${frames.at(-1).file}'\n`);
  execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-f", "concat", "-safe", "0", "-i", path.join(out, "frames.txt"),
    "-vf", "fps=25,scale=824:1830:flags=lanczos,format=yuv420p", "-c:v", "libx264", "-crf", "16", path.join(out, "raw.mp4")]);
  for (const key of Object.keys(events)) if (typeof events[key] === "number") events[key] = +(events[key] - start).toFixed(3);
  fs.rmSync(framesDir, { recursive: true, force: true });
  fs.writeFileSync(path.join(out, "events.json"), JSON.stringify(events, null, 2));
  return events;
}

export const exactly = (t) => new RegExp(`^${t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`);
